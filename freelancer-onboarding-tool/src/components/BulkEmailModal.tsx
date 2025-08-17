'use client';

import React, { useState, useEffect } from 'react';
import { XMarkIcon, EnvelopeIcon, ArrowPathIcon, SparklesIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import type { Client, Template } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { FirestoreService } from '@/lib/firestore';
import { OpenAIService } from '@/lib/openai';
import { TemplateVariableService } from '@/lib/templateVariables';

interface BulkEmailModalProps {
  clients: Client[];
  onClose: () => void;
}

interface EmailStatus {
  clientId: string;
  status: 'pending' | 'sending' | 'sent' | 'failed';
  error?: string;
}

export function BulkEmailModal({ clients, onClose }: BulkEmailModalProps) {
  const { user } = useAuth();
  
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [formData, setFormData] = useState({
    subject: 'Important Update',
    content: `Hi {{clientName}},\n\nI hope this email finds you well. I wanted to reach out with an important update.\n\nBest regards,\n{{freelancerName}}`,
    selectedTemplate: '' as string
  });
  const [sending, setSending] = useState(false);
  const [emailStatuses, setEmailStatuses] = useState<EmailStatus[]>([]);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiFormData, setAiFormData] = useState({
    tone: 'professional' as 'professional' | 'friendly' | 'casual',
    templateType: 'custom' as 'welcome' | 'scope' | 'timeline' | 'payment' | 'invoice' | 'follow-up' | 'custom',
    projectType: '',
    businessType: '',
    brandName: ''
  });
  const [showPreview, setShowPreview] = useState(false);

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

  // Initialize email statuses
  useEffect(() => {
    setEmailStatuses(clients.map(client => ({
      clientId: client.id,
      status: 'pending'
    })));
  }, [clients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSending(true);
    
    // Process emails one by one to show progress
    for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      
      // Update status to sending
      setEmailStatuses(prev => prev.map(status => 
        status.clientId === client.id 
          ? { ...status, status: 'sending' }
          : status
      ));

      try {
        // Process template variables for this specific client
        const processedContent = TemplateVariableService.replaceVariables(
          formData.content,
          {
            client,
            user: user || undefined,
            projectType: client.projectType,
          }
        );

        const processedSubject = TemplateVariableService.replaceVariables(
          formData.subject,
          {
            client,
            user: user || undefined,
            projectType: client.projectType,
          }
        );

        const emailData = {
          type: 'custom',
          clientEmail: client.email,
          clientName: client.name,
          freelancerName: user.name || 'Freelancer',
          freelancerEmail: user.email,
          subject: processedSubject,
          content: processedContent
        };

        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData),
        });

        if (!response.ok) {
          throw new Error(`Failed to send email to ${client.name}`);
        }

        // Update status to sent
        setEmailStatuses(prev => prev.map(status => 
          status.clientId === client.id 
            ? { ...status, status: 'sent' }
            : status
        ));

        // Small delay between emails to avoid overwhelming the server
        if (i < clients.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } catch (error) {
        console.error(`Failed to send email to ${client.name}:`, error);
        
        // Update status to failed
        setEmailStatuses(prev => prev.map(status => 
          status.clientId === client.id 
            ? { ...status, status: 'failed', error: error instanceof Error ? error.message : 'Unknown error' }
            : status
        ));
      }
    }

    setSending(false);
    
    // Show summary
    const successCount = emailStatuses.filter(status => status.status === 'sent').length;
    const failedCount = emailStatuses.filter(status => status.status === 'failed').length;
    
    if (failedCount === 0) {
      alert(`All ${successCount} emails sent successfully!`);
    } else {
      alert(`${successCount} emails sent successfully, ${failedCount} failed. Check the status below for details.`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUserTemplateSelect = async (templateId: string) => {
    if (!templateId) {
      setFormData(prev => ({
        ...prev,
        selectedTemplate: '',
        subject: 'Important Update',
        content: `Hi {{clientName}},\n\nI hope this email finds you well. I wanted to reach out with an important update.\n\nBest regards,\n{{freelancerName}}`
      }));
      return;
    }

    const selectedTemplate = templates.find(t => t.id === templateId);
    if (selectedTemplate) {
      let subject = '';
      if (selectedTemplate.type === 'welcome') {
        subject = `Welcome {{clientName}} - Let's Get Started!`;
      } else if (selectedTemplate.type === 'scope') {
        subject = `Project Scope - {{projectType}}`;
      } else if (selectedTemplate.type === 'timeline') {
        subject = `Project Timeline - {{clientName}}`;
      } else if (selectedTemplate.type === 'payment') {
        subject = `Payment Information - {{clientName}}`;
      } else if (selectedTemplate.type === 'follow-up') {
        subject = `Following Up - {{projectType}}`;
      } else {
        subject = `${selectedTemplate.name} - {{clientName}}`;
      }

      setFormData(prev => ({
        ...prev,
        selectedTemplate: templateId,
        subject: subject,
        content: selectedTemplate.content
      }));
    }
  };

  const handleGenerateAI = async () => {
    setGeneratingAI(true);
    try {
      const content = await OpenAIService.generateTemplate({
        type: aiFormData.templateType === 'custom' ? 'follow-up' : aiFormData.templateType,
        projectType: aiFormData.projectType,
        businessType: aiFormData.businessType,
        tone: aiFormData.tone,
        brandName: aiFormData.brandName,
        freelancerName: user?.name,
        useClientData: false // Use placeholders for bulk emails
      });
      
      const templateTypeLabels = {
        welcome: 'Welcome Message',
        scope: 'Scope of Work', 
        timeline: 'Project Timeline',
        payment: 'Payment Terms',
        invoice: 'Invoice Template',
        'follow-up': 'Follow-up Email',
        custom: 'Custom Message'
      };
      
      setFormData(prev => ({
        ...prev,
        subject: `${templateTypeLabels[aiFormData.templateType]} - {{clientName}}`,
        content: content
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

  const getPreviewContent = () => {
    if (!user) return formData.content;
    
    // Use the first client as example for preview
    const sampleClient = clients[0];
    return TemplateVariableService.replaceVariables(
      formData.content,
      {
        client: sampleClient,
        user: user || undefined,
        projectType: sampleClient.projectType,
      }
    );
  };

  const getStatusIcon = (status: EmailStatus['status']) => {
    switch (status) {
      case 'sent':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'sending':
        return <ArrowPathIcon className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <div className="h-5 w-5 bg-gray-300 rounded-full" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-4 text-center">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all max-w-4xl w-full max-h-[90vh] flex flex-col">
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <EnvelopeIcon className="h-6 w-6 text-green-500 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Bulk Email to {clients.length} Clients
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Email Composition */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-gray-800">Email Template</label>
                      <button
                        type="button"
                        onClick={() => setShowAIGenerator(!showAIGenerator)}
                        className="inline-flex items-center px-3 py-1 border border-purple-300 shadow-sm text-xs font-medium rounded-md text-purple-700 bg-purple-50 hover:bg-purple-100"
                      >
                        <SparklesIcon className="h-3 w-3 mr-1" />
                        AI Generate
                      </button>
                    </div>
                    {loadingTemplates ? (
                      <div className="w-full px-4 py-3 text-gray-500 bg-gray-50 border-2 border-gray-200 rounded-lg">
                        Loading templates...
                      </div>
                    ) : templates.length > 0 ? (
                      <select
                        value={formData.selectedTemplate}
                        onChange={(e) => handleUserTemplateSelect(e.target.value)}
                        className="w-full px-4 py-3 text-gray-900 text-base font-medium border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        <option value="">Create custom bulk email...</option>
                        {templates.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name} ({template.type || 'custom'})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="w-full px-4 py-3 text-gray-500 bg-gray-50 border-2 border-gray-200 rounded-lg text-sm">
                        No saved templates found.
                      </div>
                    )}
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
                            <option value="custom">Custom Message</option>
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
                          <label className="block text-sm font-medium text-gray-700 mb-1">Your Brand Name</label>
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
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-gray-800">Message</label>
                      <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        {showPreview ? 'Edit' : 'Preview'}
                      </button>
                    </div>
                    
                    {showPreview ? (
                      <div className="w-full px-4 py-3 text-gray-900 text-base leading-relaxed bg-gray-50 border-2 border-gray-200 rounded-lg min-h-[200px] whitespace-pre-line">
                        <div className="text-xs text-gray-500 mb-2">Preview (using {clients[0]?.name} as example):</div>
                        {getPreviewContent()}
                      </div>
                    ) : (
                      <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        rows={10}
                        className="w-full px-4 py-3 text-gray-900 text-base leading-relaxed font-medium border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white resize-y"
                        placeholder="Type your message here... Use template variables for personalization"
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
                      Use variables like {'{{clientName}}'}, {'{{clientCompany}}'}, {'{{projectType}}'} for personalization
                    </div>
                  </div>
                </div>

                {/* Recipients and Status */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">Recipients ({clients.length})</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                      {clients.map((client) => {
                        const status = emailStatuses.find(s => s.clientId === client.id);
                        return (
                          <div key={client.id} className="px-4 py-3 border-b border-gray-200 last:border-b-0">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <span className="text-sm font-medium text-gray-900">{client.name}</span>
                                  {client.company && (
                                    <span className="ml-2 text-sm text-gray-500">• {client.company}</span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">{client.email}</div>
                                {status?.error && (
                                  <div className="text-xs text-red-600 mt-1">{status.error}</div>
                                )}
                              </div>
                              <div className="flex items-center ml-4">
                                {getStatusIcon(status?.status || 'pending')}
                                <span className="ml-2 text-xs text-gray-500 capitalize">
                                  {status?.status || 'pending'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={sending}
                className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                    Sending Emails...
                  </>
                ) : (
                  <>
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    Send to All ({clients.length})
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={sending}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {sending ? 'Sending...' : 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}