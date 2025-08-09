'use client';

import { useState } from 'react';
import { OpenAIService } from '@/lib/openai';
import { SparklesIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface AITemplateGeneratorProps {
  onTemplateGenerated: (content: string) => void;
  templateType: 'welcome' | 'scope' | 'timeline' | 'payment' | 'invoice' | 'follow-up' | 'onboarding' | 'custom' | 'all';
  clientName?: string;
  projectType?: string;
  businessType?: string;
}

export function AITemplateGenerator({
  onTemplateGenerated,
  templateType,
  clientName = '',
  projectType = '',
  businessType = ''
}: AITemplateGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    clientName: clientName,
    projectType: projectType,
    businessType: businessType,
    tone: 'professional' as 'professional' | 'friendly' | 'casual',
    brandName: ''
  });
  const [showForm, setShowForm] = useState(false);

  const handleGenerate = async () => {
    if (!formData.clientName.trim()) {
      alert('Please enter a client name');
      return;
    }

    setIsGenerating(true);
    try {
      const content = await OpenAIService.generateTemplate({
        type: templateType,
        ...formData
      });
      onTemplateGenerated(content);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to generate template:', error);
      alert('Failed to generate template. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getTemplateTypeLabel = () => {
    const labels = {
      welcome: 'Welcome Message',
      scope: 'Scope of Work',
      timeline: 'Project Timeline',
      payment: 'Payment Terms',
      invoice: 'Invoice Template',
      'follow-up': 'Follow-up Email',
      onboarding: 'Onboarding Template',
      custom: 'Custom Template',
      all: 'Template'
    } as const;
    return labels[templateType] || 'Template';
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <SparklesIcon className="h-4 w-4 mr-2 text-purple-500" />
        Generate with AI
      </button>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-purple-50 to-blue-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <SparklesIcon className="h-5 w-5 text-purple-500 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">
            AI Template Generator - {getTemplateTypeLabel()}
          </h3>
        </div>
        <button
          onClick={() => setShowForm(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="clientName" className="block text-sm font-semibold text-gray-800 mb-2">
            Client Name *
          </label>
          <input
            type="text"
            name="clientName"
            id="clientName"
            required
            className="w-full px-4 py-3 text-gray-900 text-base font-medium border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            placeholder="Enter client name"
            value={formData.clientName}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="projectType" className="block text-sm font-semibold text-gray-800 mb-2">
            Project Type
          </label>
          <input
            type="text"
            name="projectType"
            id="projectType"
            className="w-full px-4 py-3 text-gray-900 text-base font-medium border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            placeholder="e.g., Website Development, Brand Design"
            value={formData.projectType}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="businessType" className="block text-sm font-semibold text-gray-800 mb-2">
            Your Service Type
          </label>
          <input
            type="text"
            name="businessType"
            id="businessType"
            className="w-full px-4 py-3 text-gray-900 text-base font-medium border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            placeholder="e.g., Web Developer, Graphic Designer"
            value={formData.businessType}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="brandName" className="block text-sm font-semibold text-gray-800 mb-2">
            Your Brand/Company Name
          </label>
          <input
            type="text"
            name="brandName"
            id="brandName"
            className="w-full px-4 py-3 text-gray-900 text-base font-medium border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            placeholder="Your business name"
            value={formData.brandName}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="tone" className="block text-sm font-semibold text-gray-800 mb-2">
            Tone
          </label>
          <select
            name="tone"
            id="tone"
            className="w-full px-4 py-3 text-gray-900 text-base font-medium border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            value={formData.tone}
            onChange={handleInputChange}
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="casual">Casual</option>
          </select>
        </div>

        <div className="flex items-center justify-between pt-4">
          <p className="text-xs text-gray-500">
            AI will generate a customized {getTemplateTypeLabel()?.toLowerCase() || 'template'} based on your inputs
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowForm(false)}
              className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !formData.clientName.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  Generate Template
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}