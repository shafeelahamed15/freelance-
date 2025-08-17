'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';
import { Layout } from '@/components/Layout';
import { AITemplateGenerator } from '@/components/AITemplateGenerator';
import { FirestoreService, collections } from '@/lib/firestore';
import type { Template } from '@/types';
import {
  DocumentDuplicateIcon,
  PlusIcon,
  SparklesIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const templateTypes = [
  { id: 'welcome', name: 'Welcome Message', description: 'Greet new clients professionally' },
  { id: 'scope', name: 'Scope of Work', description: 'Define project boundaries and deliverables' },
  { id: 'timeline', name: 'Project Timeline', description: 'Outline project phases and milestones' },
  { id: 'payment', name: 'Payment Terms', description: 'Set payment expectations and policies' },
  { id: 'invoice', name: 'Invoice Template', description: 'Professional invoice format' },
  { id: 'follow-up', name: 'Follow-up Email', description: 'Check in with clients professionally' }
] as const;

export default function TemplatesPage() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('welcome');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [aiGeneratedContent, setAiGeneratedContent] = useState<string>('');

  useEffect(() => {
    if (user) {
      loadTemplates();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadTemplates = async () => {
    try {
      if (!user) return;
      const templatesData = await FirestoreService.getUserTemplates(user.id);
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(template => 
    selectedType === 'all' || template.type === selectedType || template.category === selectedType
  );

  const handleSaveTemplate = async (name: string, content: string) => {
    try {
      if (!user) return;

      const templateData = {
        name,
        content,
        type: selectedType as 'onboarding' | 'invoice' | 'welcome' | 'scope' | 'timeline' | 'payment' | 'follow-up' | 'custom',
        category: selectedType,
        variables: extractVariables(content),
        isDefault: false,
        userId: user.id
      };

      if (editingTemplate) {
        await FirestoreService.update(collections.templates, editingTemplate.id, templateData);
      } else {
        await FirestoreService.create(collections.templates, templateData);
      }

      await loadTemplates();
      setShowCreateModal(false);
      setEditingTemplate(null);
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template. Please try again.');
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      await FirestoreService.delete(collections.templates, templateId);
      await loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Failed to delete template. Please try again.');
    }
  };

  const extractVariables = (content: string): string[] => {
    const variableRegex = /\{\{(\w+)\}\}/g;
    const variables: string[] = [];
    let match;

    while ((match = variableRegex.exec(content)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }

    return variables;
  };

  if (loading) {
    return (
      <AuthGuard>
        <Layout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </Layout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <Layout>
        <div className="p-6">
          <div className="sm:flex sm:items-center mb-6">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
              <p className="mt-2 text-sm text-gray-700">
                Create and manage templates for client onboarding and communication
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Template
              </button>
            </div>
          </div>

          {/* Template Types Filter */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedType === 'all'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  All Templates ({templates.length})
                </button>
                {templateTypes.map((type) => {
                  const count = templates.filter(t => t.type === type.id || t.category === type.id).length;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        selectedType === type.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {type.name} ({count})
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* AI Template Generator */}
          <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <div className="flex items-center mb-4">
              <SparklesIcon className="h-6 w-6 text-purple-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">AI-Powered Template Generator</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Generate professional templates instantly using AI. Customize for your brand and client needs.
            </p>
            <AITemplateGenerator
              templateType={selectedType as 'welcome' | 'scope' | 'timeline' | 'payment' | 'invoice' | 'follow-up'}
              onTemplateGenerated={(generatedContent) => {
                setAiGeneratedContent(generatedContent);
                setShowCreateModal(true);
              }}
            />
          </div>

          {/* Templates List */}
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <DocumentDuplicateIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {selectedType === 'all' 
                  ? 'Get started by creating your first template.'
                  : `No ${templateTypes.find(t => t.id === selectedType)?.name?.toLowerCase() || 'selected'} templates found.`
                }
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Template
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-900 truncate">{template.name}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {templateTypes.find(t => t.id === template.category)?.name || template.type}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {template.content.substring(0, 150)}...
                    </p>

                    {template.variables.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">Variables:</p>
                        <div className="flex flex-wrap gap-1">
                          {template.variables.slice(0, 3).map((variable) => (
                            <span key={variable} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
                              {variable}
                            </span>
                          ))}
                          {template.variables.length > 3 && (
                            <span className="text-xs text-gray-500">+{template.variables.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(template.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setPreviewTemplate(template)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Preview"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingTemplate(template)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create/Edit Template Modal */}
        {(showCreateModal || editingTemplate) && (
          <TemplateModal
            template={editingTemplate}
            selectedType={selectedType}
            aiGeneratedContent={aiGeneratedContent}
            onSave={handleSaveTemplate}
            onClose={() => {
              setShowCreateModal(false);
              setEditingTemplate(null);
              setAiGeneratedContent('');
            }}
          />
        )}

        {/* Preview Modal */}
        {previewTemplate && (
          <PreviewModal
            template={previewTemplate}
            onClose={() => setPreviewTemplate(null)}
          />
        )}
      </Layout>
    </AuthGuard>
  );
}

// Template Modal Component
interface TemplateModalProps {
  template: Template | null;
  selectedType: string;
  aiGeneratedContent: string;
  onSave: (name: string, content: string) => void;
  onClose: () => void;
}

function TemplateModal({ template, selectedType, aiGeneratedContent, onSave, onClose }: TemplateModalProps) {
  const [name, setName] = useState(template?.name || '');
  const [content, setContent] = useState(template?.content || aiGeneratedContent || '');
  const [type, setType] = useState<'onboarding' | 'invoice' | 'welcome' | 'scope' | 'timeline' | 'payment' | 'follow-up' | 'custom'>(template?.type || 'onboarding');

  // Update content when aiGeneratedContent changes
  React.useEffect(() => {
    if (aiGeneratedContent && !template) {
      setContent(aiGeneratedContent);
    }
  }, [aiGeneratedContent, template]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(name, content);
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-4 text-center">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {template ? 'Edit Template' : 'Create New Template'}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Template Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 text-gray-900 text-base font-medium border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    placeholder="Enter template name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'onboarding' | 'invoice' | 'welcome' | 'scope' | 'timeline' | 'payment' | 'follow-up' | 'custom')}
                    className="mt-1 block w-full px-4 py-3 text-gray-900 text-base font-medium border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="welcome">Welcome Message</option>
                    <option value="scope">Scope of Work</option>
                    <option value="timeline">Project Timeline</option>
                    <option value="payment">Payment Terms</option>
                    <option value="invoice">Invoice Template</option>
                    <option value="follow-up">Follow-up Email</option>
                    <option value="onboarding">General Onboarding</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Content</label>
                  <AITemplateGenerator
                    templateType={selectedType as 'welcome' | 'scope' | 'timeline' | 'payment' | 'invoice' | 'follow-up'}
                    onTemplateGenerated={(generatedContent) => {
                      setContent(generatedContent);
                    }}
                  />
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  className="mt-1 block w-full px-4 py-3 text-gray-900 text-base leading-relaxed font-medium border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white resize-y"
                  placeholder="Enter your template content... Use {{variableName}} for dynamic content"
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  Use double curly braces for variables: {`{{clientName}}`}, {`{{projectType}}`}, etc.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {template ? 'Update' : 'Create'} Template
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

// Preview Modal Component
interface PreviewModalProps {
  template: Template;
  onClose: () => void;
}

function PreviewModal({ template, onClose }: PreviewModalProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Preview: {template.name}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-700">{template.content}</pre>
            </div>

            {template.variables.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Available Variables:</h4>
                <div className="flex flex-wrap gap-2">
                  {template.variables.map((variable) => (
                    <span key={variable} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {variable}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}