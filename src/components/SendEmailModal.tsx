'use client';

import React, { useState, useEffect } from 'react';
import { XMarkIcon, EnvelopeIcon, ArrowPathIcon, SparklesIcon } from '@heroicons/react/24/outline';
import type { Client, Template } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { FirestoreService } from '@/lib/firestore';
import { OpenAIService } from '@/lib/openai';

interface SendEmailModalProps {
  client: Client;
  onClose: () => void;
}

export function SendEmailModal({ client, onClose }: SendEmailModalProps) {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [formData, setFormData] = useState({
    subject: `Hello ${client.name}!`,
    content: `Hi ${client.name},\n\nI hope this email finds you well. I wanted to reach out regarding your project.\n\nBest regards,\n${user?.name || 'Your Name'}`,
    emailType: 'custom' as 'custom' | 'welcome' | 'onboarding' | 'invoice',
    selectedTemplate: '' as string
  });
  const [sending, setSending] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiFormData, setAiFormData] = useState({
    tone: 'professional' as 'professional' | 'friendly' | 'casual',
    templateType: 'welcome' as 'welcome' | 'scope' | 'timeline' | 'payment' | 'invoice' | 'follow-up',
    projectType: client.projectType || '',
    businessType: '',
    brandName: ''
  });

  // Load user templates
  useEffect(() => {
    const loadUserTemplates = async () => {
      if (!user) return;
      try {
        const userTemplates = await FirestoreService.getUserTemplates(user.id);
        setTemplates(userTemplates);
      } catch (error) {
        console.error('Failed to load templates:', error);
      } finally {
        setLoadingTemplates(false);
      }
    };
    
    loadUserTemplates();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSending(true);
    try {
      const emailData = {
        type: formData.emailType,
        clientEmail: client.email,
        clientName: client.name,
        freelancerName: user.name || 'Freelancer',
        freelancerEmail: user.email,
        subject: formData.subject,
        content: formData.content
      };

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      alert('Email sent successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const emailTemplates = {
    custom: { subject: `Hello ${client.name}!`, content: `Hi ${client.name},\n\nI hope this email finds you well. I wanted to reach out regarding your project.\n\nBest regards,\n${user?.name || 'Your Name'}` },
    welcome: { subject: `Welcome ${client.name}! Let's get started`, content: `Hi ${client.name},\n\nWelcome aboard! I'm excited to work with you on your project. This email kicks off our collaboration.\n\nWhat happens next:\n1. Project scope discussion\n2. Timeline planning\n3. Getting started!\n\nFeel free to reach out with any questions.\n\nBest regards,\n${user?.name || 'Your Name'}` },
    onboarding: { subject: `Next Steps for Your Project - ${client.name}`, content: `Hi ${client.name},\n\nThank you for choosing to work with me! Here are the next steps for your project:\n\n1. Review and approve the project scope\n2. Complete the project questionnaire\n3. Schedule our kickoff call\n\nI'll send you the detailed information shortly.\n\nBest regards,\n${user?.name || 'Your Name'}` }
  };

  const handleTemplateChange = (template: keyof typeof emailTemplates) => {
    setFormData(prev => ({
      ...prev,
      emailType: template,
      selectedTemplate: '',
      subject: emailTemplates[template].subject,
      content: emailTemplates[template].content
    }));
  };

  const handleUserTemplateSelect = (templateId: string) => {
    if (!templateId) {
      // Reset to default if no template selected
      setFormData(prev => ({
        ...prev,
        selectedTemplate: '',
        subject: `Hello ${client.name}!`,
        content: `Hi ${client.name},\n\nI hope this email finds you well. I wanted to reach out regarding your project.\n\nBest regards,\n${user?.name || 'Your Name'}`
      }));
      return;
    }

    const selectedTemplate = templates.find(t => t.id === templateId);
    if (selectedTemplate) {
      // Replace template variables with client data
      const processedContent = selectedTemplate.content
        .replace(/\{\{clientName\}\}/g, client.name)
        .replace(/\{\{projectType\}\}/g, client.projectType || 'your project')
        .replace(/\{\{freelancerName\}\}/g, user?.name || 'Your Name')
        .replace(/\{\{company\}\}/g, client.company || '')
        .replace(/\{\{clientEmail\}\}/g, client.email || '')
        .replace(/\{\{freelancerEmail\}\}/g, user?.email || '');

      // Generate a professional subject line based on template name and type
      let subject = selectedTemplate.name;
      if (selectedTemplate.type && selectedTemplate.type !== 'custom') {
        subject = `${selectedTemplate.name} - ${client.name}`;
      } else {
        subject = `${selectedTemplate.name} - ${client.name}`;
      }

      setFormData(prev => ({
        ...prev,
        selectedTemplate: templateId,
        emailType: 'custom',
        subject: subject,
        content: processedContent
      }));
    }
  };

  const handleGenerateAI = async () => {
    if (!client.name.trim()) {
      alert('Client name is required for AI generation');
      return;
    }

    setGeneratingAI(true);
    try {
      const content = await OpenAIService.generateTemplate({
        type: aiFormData.templateType,
        clientName: client.name,
        projectType: aiFormData.projectType || client.projectType || 'project',
        businessType: aiFormData.businessType,
        tone: aiFormData.tone,
        brandName: aiFormData.brandName
      });
      
      // Set the AI-generated content to the email form
      const templateTypeLabels = {
        welcome: 'Welcome Message',
        scope: 'Scope of Work',
        timeline: 'Project Timeline',
        payment: 'Payment Terms',
        invoice: 'Invoice Template',
        'follow-up': 'Follow-up Email'
      };
      
      setFormData(prev => ({
        ...prev,
        subject: `${templateTypeLabels[aiFormData.templateType]} - ${client.name}`,
        content: content,
        emailType: 'custom'
      }));
      
      setShowAIGenerator(false);
    } catch (error) {
      console.error('Failed to generate AI template:', error);
      alert('Failed to generate AI template. Please try again.');
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleAIFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAiFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-4 text-center">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all max-w-2xl w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <EnvelopeIcon className="h-6 w-6 text-blue-500 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Send Email to {client.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-800">Email Template</label>
                    <button
                      type="button"
                      onClick={() => setShowAIGenerator(!showAIGenerator)}
                      className="inline-flex items-center px-3 py-1 border border-purple-300 shadow-sm text-xs font-medium rounded-md text-purple-700 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <SparklesIcon className="h-3 w-3 mr-1" />
                      AI Generate
                    </button>
                  </div>
                  <select
                    name="emailType"
                    value={formData.emailType}
                    onChange={(e) => handleTemplateChange(e.target.value as keyof typeof emailTemplates)}
                    className="w-full px-4 py-3 text-gray-900 text-base font-medium border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="custom">Write Custom Email</option>
                    <option value="welcome">Quick Welcome Email</option>
                    <option value="onboarding">Quick Onboarding Email</option>
                  </select>
                </div>

                {showAIGenerator && (
                  <div className="border border-purple-200 rounded-lg p-4 bg-gradient-to-r from-purple-50 to-blue-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <SparklesIcon className="h-5 w-5 text-purple-500 mr-2" />
                        <h4 className="text-sm font-medium text-gray-900">AI Template Generator</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAIGenerator(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Template Type</label>
                        <select
                          name="templateType"
                          value={aiFormData.templateType}
                          onChange={handleAIFormChange}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="welcome">Welcome Message</option>
                          <option value="scope">Scope of Work</option>
                          <option value="timeline">Project Timeline</option>
                          <option value="payment">Payment Terms</option>
                          <option value="invoice">Invoice Template</option>
                          <option value="follow-up">Follow-up Email</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
                        <select
                          name="tone"
                          value={aiFormData.tone}
                          onChange={handleAIFormChange}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="professional">Professional</option>
                          <option value="friendly">Friendly</option>
                          <option value="casual">Casual</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                        <input
                          type="text"
                          name="projectType"
                          value={aiFormData.projectType}
                          onChange={handleAIFormChange}
                          placeholder="e.g., Website Development"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Service Type</label>
                        <input
                          type="text"
                          name="businessType"
                          value={aiFormData.businessType}
                          onChange={handleAIFormChange}
                          placeholder="e.g., Web Developer"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Brand/Company Name</label>
                        <input
                          type="text"
                          name="brandName"
                          value={aiFormData.brandName}
                          onChange={handleAIFormChange}
                          placeholder="Your business name"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>

                      <div className="md:col-span-2 flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={handleGenerateAI}
                          disabled={generatingAI}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {generatingAI ? (
                            <>
                              <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <SparklesIcon className="h-4 w-4 mr-2" />
                              Generate with AI
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Custom Templates Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Your Saved Templates
                    {loadingTemplates && <span className="text-xs text-gray-500 ml-2">(Loading...)</span>}
                  </label>
                  {loadingTemplates ? (
                    <div className="w-full px-4 py-3 text-gray-500 bg-gray-50 border-2 border-gray-200 rounded-lg">
                      Loading your templates...
                    </div>
                  ) : templates.length > 0 ? (
                    <select
                      value={formData.selectedTemplate}
                      onChange={(e) => handleUserTemplateSelect(e.target.value)}
                      className="w-full px-4 py-3 text-gray-900 text-base font-medium border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="">Select a saved template...</option>
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name} ({template.type || 'custom'})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full px-4 py-3 text-gray-500 bg-gray-50 border-2 border-gray-200 rounded-lg text-sm">
                      No saved templates found. Create templates in the Templates section to use them here.
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">To</label>
                  <div className="px-4 py-3 text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-lg">
                    {client.name} &lt;{client.email}&gt;
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-gray-900 text-base font-medium border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    placeholder="Email subject"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Message</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={10}
                    className="w-full px-4 py-3 text-gray-900 text-base leading-relaxed font-medium border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white resize-y"
                    placeholder="Type your message here..."
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={sending}
                className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    Send Email
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}