'use client';

import React, { useState, useEffect } from 'react';
import { XMarkIcon, EnvelopeIcon, ArrowPathIcon, SparklesIcon } from '@heroicons/react/24/outline';
import type { Client } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { OpenAIService } from '@/lib/openai';
import { TemplateVariableService } from '@/lib/templateVariables';

interface SendEmailModalProps {
  client: Client;
  onClose: () => void;
}

export function SendEmailModal({ client, onClose }: SendEmailModalProps) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    subject: `Hello ${client.name}!`,
    content: `Hi ${client.name},\n\nI hope this email finds you well. I wanted to reach out regarding your project.\n\nBest regards,\n${user?.name || 'Your Name'}`,
    emailType: 'custom' as 'custom' | 'welcome' | 'onboarding' | 'invoice'
  });
  const [sending, setSending] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [aiFormData, setAiFormData] = useState({
    tone: 'professional' as 'professional' | 'friendly' | 'casual',
    templateType: 'welcome' as 'welcome' | 'scope' | 'timeline' | 'payment' | 'invoice' | 'follow-up',
    projectType: client.projectType || '',
    businessType: '',
    brandName: ''
  });
  
  // Auto-show AI generator on component mount
  useEffect(() => {
    setShowAIGenerator(true);
  }, []);



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
      subject: emailTemplates[template].subject,
      content: emailTemplates[template].content
    }));
  };

  const handleGenerateAI = async () => {
    setGeneratingAI(true);
    try {
      // Use the enhanced AI service with client data
      const content = await OpenAIService.generateTemplate({
        type: aiFormData.templateType,
        clientName: client.name,
        clientEmail: client.email,
        clientCompany: client.company,
        projectType: aiFormData.projectType || client.projectType || '',
        businessType: aiFormData.businessType,
        tone: aiFormData.tone,
        brandName: aiFormData.brandName,
        freelancerName: user?.name,
        useClientData: true // Use actual client data, not placeholders
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


  // Generate HTML preview that matches the actual email output
  const getHTMLPreview = () => {
    if (!user) return '';

    const processedContent = TemplateVariableService.replaceVariables(
      formData.content,
      {
        client,
        user: user || undefined,
        projectType: client.projectType,
      }
    );

    // Parse content into sections like the API does
    const lines = processedContent.split('\n\n').filter(section => section.trim() !== '');
    const sections = {
      greeting: lines[0] || `Hi ${client.name},`,
      leadParagraph: lines[1] || 'Thank you for your interest in working together.',
      bodySections: lines.slice(2, -1).filter(section => section.trim() !== ''),
      signature: lines[lines.length - 1] || `Best regards,\n${user.name || 'Your Name'}`
    };

    const brandName = user.name || 'Professional Services';
    const processedSubject = TemplateVariableService.replaceVariables(
      formData.subject,
      { client, user, projectType: client.projectType }
    );

    // Generate the same HTML structure as the email API
    return `
      <div style="background-color:#f3f4f6; padding:24px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
        <div style="width:600px; max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin: 0 auto;">
          
          <!-- Header -->
          <div style="padding:24px 24px 8px 24px; font:600 14px -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; color:#111827;">
            ${brandName}
          </div>
          
          <!-- Subject/Title -->
          <div style="padding:0 24px; font:700 22px/1.3 -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; color:#111827;">
            ${processedSubject}
          </div>
          
          <!-- Spacer -->
          <div style="line-height:16px; height:16px;">&nbsp;</div>

          <!-- Greeting -->
          <div style="padding:0 24px; font:400 16px/1.5 -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; color:#374151;">
            ${sections.greeting}
          </div>

          <!-- Spacer -->
          <div style="line-height:16px; height:16px;">&nbsp;</div>

          <!-- Lead paragraph -->
          <div style="padding:0 24px; font:400 16px/1.5 -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; color:#374151;">
            ${sections.leadParagraph}
          </div>

          <!-- Spacer -->
          <div style="line-height:24px; height:24px;">&nbsp;</div>

          ${sections.bodySections.map(section => `
          <!-- Body section -->
          <div style="padding:0 24px; font:400 16px/1.5 -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; color:#374151;">
            ${section.replace(/\n/g, '<br>')}
          </div>
          <!-- Spacer -->
          <div style="line-height:16px; height:16px;">&nbsp;</div>`).join('')}

          <!-- Primary CTA Button -->
          <div style="padding:0 24px 8px 24px; text-align:center;">
            <!-- Bulletproof button -->
            <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
              <tr>
                <td style="background:#2563eb; border-radius:8px; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);">
                  <a href="mailto:${user.email}" 
                     style="display:inline-block; padding:12px 24px; font:600 16px -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; color:#ffffff; text-decoration:none; border-radius:8px;">
                    Reply to this Email
                  </a>
                </td>
              </tr>
            </table>
          </div>

          <!-- Spacer after CTA -->
          <div style="line-height:24px; height:24px;">&nbsp;</div>

          <!-- Spacer before signature -->
          <div style="line-height:24px; height:24px;">&nbsp;</div>

          <!-- Signature -->
          <div style="padding:0 24px 24px 24px; font:400 16px/1.5 -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; color:#374151; border-top:1px solid #e5e7eb; padding-top:20px;">
            ${sections.signature.replace(/\n/g, '<br>')}
          </div>

          <!-- Footer -->
          <div style="padding:16px 24px 24px 24px; font:400 12px/1.5 -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; color:#6b7280; background-color:#f9fafb;">
            ${brandName}<br>
            Professional Services<br>
            <a href="mailto:${user.email}" style="color:#2563eb; text-decoration:underline;">Contact</a>
          </div>
          
        </div>
      </div>
    `;
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
                          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
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
                          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
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
                          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
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
                          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
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

                {showAIGenerator && (
                  <div className="border border-purple-200 rounded-lg p-4 bg-gradient-to-r from-purple-50 to-blue-50 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <SparklesIcon className="h-5 w-5 text-purple-500 mr-2" />
                        <h4 className="text-sm font-medium text-gray-900">🤖 AI Email Generator</h4>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Type</label>
                        <select
                          name="templateType"
                          value={aiFormData.templateType}
                          onChange={handleAIFormChange}
                          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
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
                          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
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
                          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Business Name</label>
                        <input
                          type="text"
                          name="brandName"
                          value={aiFormData.brandName}
                          onChange={handleAIFormChange}
                          placeholder="Your business name"
                          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                        />
                      </div>

                      <div className="md:col-span-2 flex justify-center pt-2">
                        <button
                          type="button"
                          onClick={handleGenerateAI}
                          disabled={generatingAI}
                          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {generatingAI ? (
                            <>
                              <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                              Generating Professional Email...
                            </>
                          ) : (
                            <>
                              <SparklesIcon className="h-5 w-5 mr-2" />
                              Generate Professional Email with AI
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-800">Email Content</label>
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      {showPreview ? 'Edit Content' : 'Preview Email'}
                    </button>
                  </div>
                  
                  {showPreview ? (
                    <div className="bg-gray-100 p-4 rounded-lg border">
                      <div className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                        📧 Live Email Preview - Exactly as it will appear to your client
                      </div>
                      <div className="bg-white rounded-lg overflow-hidden shadow-lg" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        <div 
                          dangerouslySetInnerHTML={{ __html: getHTMLPreview() }}
                          style={{ 
                            transform: 'scale(0.8)', 
                            transformOrigin: 'top left',
                            width: '125%',
                            height: 'auto'
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-2 flex items-center justify-between">
                        <span>✨ Professional table-based layout with bulletproof compatibility</span>
                        <span>Preview scaled to 80% for display</span>
                      </div>
                    </div>
                  ) : (
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows={12}
                      className="w-full px-4 py-3 text-gray-900 text-base leading-relaxed font-medium border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white resize-y"
                      placeholder="Click 'Generate Professional Email with AI' above to create your content..."
                      style={{ 
                        whiteSpace: 'pre-wrap', 
                        wordWrap: 'break-word',
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                        lineHeight: '1.8',
                        fontSize: '15px'
                      }}
                      required
                    />
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    💡 Use the AI generator above to create professional emails, or edit manually if needed
                  </div>
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