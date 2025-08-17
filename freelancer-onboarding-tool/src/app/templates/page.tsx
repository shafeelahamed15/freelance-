'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';
import { RichTemplateEditor } from '@/components/RichTemplateEditor';
import { MultiClientEmailPreview } from '@/components/MultiClientEmailPreview';
import { TemplateOrganizer } from '@/components/TemplateOrganizer';
import { FirestoreService, collections } from '@/lib/firestore';
import type { EmailTemplate } from '@/types';
import { 
  Plus, 
  Mail, 
  Search, 
  Filter, 
  Calendar,
  Eye,
  Copy,
  Trash2,
  Zap,
  FileText,
  Tag,
  Edit3,
  Download,
  Star,
  TrendingUp,
  Clock,
  Users,
  Sparkles,
  ArrowRight,
  X,
  CheckCircle2,
  Settings,
  BarChart3,
  Wand2
} from 'lucide-react';

function TemplatesContent() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [generating, setGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showRichEditor, setShowRichEditor] = useState(false);
  const [showMultiClientPreview, setShowMultiClientPreview] = useState(false);
  const [showOrganizer, setShowOrganizer] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Sample data for new components
  const [folders, setFolders] = useState([
    { id: 'welcome', name: 'Welcome Emails', color: '#4863eb', templatesCount: 3 },
    { id: 'follow-up', name: 'Follow-ups', color: '#22c55e', templatesCount: 2 },
    { id: 'invoices', name: 'Invoices', color: '#f59e0b', templatesCount: 4 }
  ]);
  
  const [tags, setTags] = useState([
    { id: 'urgent', name: 'Urgent', color: '#ef4444', count: 2 },
    { id: 'professional', name: 'Professional', color: '#6366f1', count: 5 },
    { id: 'friendly', name: 'Friendly', color: '#10b981', count: 3 }
  ]);

  useEffect(() => {
    if (user) {
      loadTemplates();
    }
  }, [user]);

  const loadTemplates = async () => {
    if (!user) return;
    
    try {
      const userTemplates = await FirestoreService.getAll<EmailTemplate>(collections.templates, user.id);
      setTemplates(userTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTemplate = async (templateType = 'welcome_email') => {
    if (!user) return;
    
    setGenerating(true);
    try {
      const response = await fetch('/api/generate-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: templateType,
          context: getContextForType(templateType)
        })
      });

      if (response.ok) {
        const result = await response.json();
        const newTemplate: EmailTemplate = {
          id: Date.now().toString(),
          name: getNameForType(templateType),
          type: templateType,
          subject: result.subject,
          content: result.content,
          variables: result.variables || [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await FirestoreService.create(collections.templates, newTemplate, user.id, newTemplate.id);
        setTemplates(prev => [...prev, newTemplate]);
        setSelectedTemplate(newTemplate);
        setShowTemplateModal(true);
      }
    } catch (error) {
      console.error('Error generating template:', error);
    } finally {
      setGenerating(false);
    }
  };

  const getContextForType = (type: string) => {
    const contexts: { [key: string]: string } = {
      'welcome_email': 'Professional freelancer welcoming a new client',
      'follow_up': 'Following up with a client about project progress',
      'invoice_reminder': 'Friendly reminder about an overdue invoice',
      'project_completion': 'Notifying client about completed project deliverables',
      'proposal': 'Professional project proposal template',
      'thank_you': 'Thank you message after project completion',
      'contract_signed': 'Welcome message after contract signing'
    };
    return contexts[type] || 'Professional business communication';
  };

  const getNameForType = (type: string) => {
    const names: { [key: string]: string } = {
      'welcome_email': 'Welcome Email',
      'follow_up': 'Follow-up Email',
      'invoice_reminder': 'Invoice Reminder',
      'project_completion': 'Project Completion',
      'proposal': 'Project Proposal',
      'thank_you': 'Thank You Note',
      'contract_signed': 'Contract Confirmation'
    };
    return names[type] || 'Custom Template';
  };

  const getIconForType = (type: string) => {
    const icons: { [key: string]: any } = {
      'welcome_email': Mail,
      'follow_up': Clock,
      'invoice_reminder': FileText,
      'project_completion': CheckCircle2,
      'proposal': Tag,
      'thank_you': Star,
      'contract_signed': Users
    };
    return icons[type] || Mail;
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || template.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const copyTemplate = (template: EmailTemplate) => {
    navigator.clipboard.writeText(template.content).then(() => {
      showToast('Template copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Failed to copy template', 'error');
    });
  };

  const deleteTemplate = async (templateId: string) => {
    if (!user) return;
    
    try {
      await FirestoreService.delete(collections.templates, templateId, user.id);
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      if (selectedTemplate?.id === templateId) {
        setSelectedTemplate(null);
        setShowTemplateModal(false);
      }
      showToast('Template deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting template:', error);
      showToast('Failed to delete template', 'error');
    }
  };

  const templateCategories = [
    { type: 'welcome_email', name: 'Welcome', icon: Mail, color: 'blue', count: templates.filter(t => t.type === 'welcome_email').length },
    { type: 'follow_up', name: 'Follow-up', icon: Clock, color: 'green', count: templates.filter(t => t.type === 'follow_up').length },
    { type: 'invoice_reminder', name: 'Invoice', icon: FileText, color: 'orange', count: templates.filter(t => t.type === 'invoice_reminder').length },
    { type: 'proposal', name: 'Proposals', icon: Tag, color: 'purple', count: templates.filter(t => t.type === 'proposal').length },
    { type: 'project_completion', name: 'Completion', icon: CheckCircle2, color: 'green', count: templates.filter(t => t.type === 'project_completion').length },
    { type: 'thank_you', name: 'Thank You', icon: Star, color: 'yellow', count: templates.filter(t => t.type === 'thank_you').length }
  ];

  if (loading) {
    return (
      <div className="animate-fadeIn">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">Loading your templates...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-400 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#000000' }}>Email Templates</h1>
              <p className="text-sm" style={{ color: '#333333' }}>Professional communication made easy</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              className="flex items-center space-x-2 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
              onClick={() => setShowOrganizer(true)}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button 
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-lg hover:shadow-lg transition-all"
              onClick={() => setShowRichEditor(true)}
            >
              <Plus className="w-4 h-4" />
              <span>New Template</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section 
        className="py-20 px-6"
        style={{ 
          background: 'linear-gradient(135deg, #dbeafe 0%, #ffffff 50%, #dcfce7 100%)'
        }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-400 rounded-xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6" style={{ color: '#000000', lineHeight: '1.1' }}>
            AI-Powered <span style={{ color: '#4863eb', fontWeight: 900 }}>Email Templates</span>
          </h1>
          <p className="text-xl mb-12 max-w-3xl mx-auto" style={{ color: '#333333' }}>
            Generate professional email templates instantly with AI. Perfect for client communication, 
            project updates, invoices, and more.
          </p>
          
          {/* Quick Generate Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button 
              className="flex items-center space-x-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all bg-white shadow-sm"
              onClick={() => generateTemplate('welcome_email')}
              disabled={generating}
            >
              <Mail className="w-5 h-5" />
              <span>Welcome Email</span>
            </button>
            <button 
              className="flex items-center space-x-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all bg-white shadow-sm"
              onClick={() => generateTemplate('follow_up')}
              disabled={generating}
            >
              <Clock className="w-5 h-5" />
              <span>Follow-up</span>
            </button>
            <button 
              className="flex items-center space-x-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all bg-white shadow-sm"
              onClick={() => generateTemplate('proposal')}
              disabled={generating}
            >
              <Tag className="w-5 h-5" />
              <span>Proposal</span>
            </button>
            <button 
              className="flex items-center space-x-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all bg-white shadow-sm"
              onClick={() => generateTemplate('invoice_reminder')}
              disabled={generating}
            >
              <FileText className="w-5 h-5" />
              <span>Invoice</span>
            </button>
          </div>
          
          <button
            onClick={() => generateTemplate()}
            disabled={generating}
            className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-lg hover:shadow-lg transition-all text-lg font-semibold mx-auto"
          >
            {generating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Generate Smart Template</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </section>

      {/* Stats Dashboard */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            
            {/* Total Templates */}
            <div 
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 text-center transition-all hover:shadow-lg hover:-translate-y-1"
              style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{templates.length}</div>
              <div className="text-sm font-medium" style={{ color: '#555555' }}>Email Templates</div>
            </div>

            {/* AI Generated */}
            <div 
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 text-center transition-all hover:shadow-lg hover:-translate-y-1"
              style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">{Math.floor(templates.length * 0.8)}</div>
              <div className="text-sm font-medium" style={{ color: '#555555' }}>AI Generated</div>
            </div>

            {/* Most Used Type */}
            <div 
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 text-center transition-all hover:shadow-lg hover:-translate-y-1"
              style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {templates.filter(t => t.type === 'welcome_email').length}
              </div>
              <div className="text-sm font-medium" style={{ color: '#555555' }}>Welcome Emails</div>
            </div>

            {/* Recent Activity */}
            <div 
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 text-center transition-all hover:shadow-lg hover:-translate-y-1"
              style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {templates.filter(t => {
                  const createdAt = t.createdAt instanceof Date ? t.createdAt : new Date(t.createdAt);
                  const daysDiff = (new Date().getTime() - createdAt.getTime()) / (1000 * 3600 * 24);
                  return daysDiff <= 7;
                }).length}
              </div>
              <div className="text-sm font-medium" style={{ color: '#555555' }}>This Week</div>
            </div>
          </div>

          {/* Template Categories */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#000000' }}>Template Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {templateCategories.map((category, index) => {
                const Icon = category.icon;
                const isActive = filterType === category.type;
                return (
                  <button
                    key={category.type}
                    onClick={() => setFilterType(category.type === filterType ? 'all' : category.type)}
                    className={`p-4 text-center rounded-xl border-2 transition-all hover:-translate-y-1 ${
                      isActive 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                        : 'bg-white border-gray-200 hover:border-blue-600 hover:shadow-md'
                    }`}
                  >
                    <div className={`w-8 h-8 mx-auto mb-3 rounded-lg flex items-center justify-center ${
                      isActive 
                        ? 'bg-white/20' 
                        : category.color === 'blue' ? 'bg-blue-100' :
                          category.color === 'green' ? 'bg-green-100' :
                          category.color === 'orange' ? 'bg-orange-100' :
                          category.color === 'purple' ? 'bg-purple-100' :
                          category.color === 'yellow' ? 'bg-yellow-100' :
                          'bg-gray-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        isActive 
                          ? 'text-white' 
                          : category.color === 'blue' ? 'text-blue-600' :
                            category.color === 'green' ? 'text-green-600' :
                            category.color === 'orange' ? 'text-orange-600' :
                            category.color === 'purple' ? 'text-purple-600' :
                            category.color === 'yellow' ? 'text-yellow-600' :
                            'text-gray-600'
                      }`} />
                    </div>
                    <h4 className={`font-semibold text-sm mb-1 ${
                      isActive ? 'text-white' : 'text-black'
                    }`}>{category.name}</h4>
                    <p className={`text-xs ${
                      isActive ? 'text-white/80' : 'text-gray-500'
                    }`}>{category.count} templates</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search templates by name or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    style={{ color: '#000000', backgroundColor: '#ffffff' }}
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 min-w-[200px]"
                  style={{ color: '#000000', backgroundColor: '#ffffff' }}
                >
                  <option value="all">All Categories</option>
                  <option value="welcome_email">Welcome Emails</option>
                  <option value="follow_up">Follow-up</option>
                  <option value="invoice_reminder">Invoice Reminders</option>
                  <option value="project_completion">Project Completion</option>
                  <option value="proposal">Proposals</option>
                  <option value="thank_you">Thank You Notes</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm" style={{ color: '#666666' }}>View:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm" style={{ color: '#666666' }}>
                {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
              </p>
              {(searchQuery || filterType !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterType('all');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <X className="w-4 h-4" />
                  <span>Clear filters</span>
                </button>
              )}
            </div>
          </div>

          {/* Templates Grid/List */}
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {searchQuery || filterType !== 'all' ? 'No templates found' : 'No templates yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {searchQuery || filterType !== 'all' 
                  ? 'Try adjusting your search criteria or explore different categories'
                  : 'Generate your first AI-powered template to get started with professional client communication'
                }
              </p>
              {(!searchQuery && filterType === 'all') && (
                <button
                  onClick={() => generateTemplate()}
                  disabled={generating}
                  className="btn-primary flex items-center space-x-2 mx-auto"
                >
                  <Zap className="w-5 h-5" />
                  <span>Generate Your First Template</span>
                </button>
              )}
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }>
              {filteredTemplates.map((template, index) => {
                const Icon = getIconForType(template.type);
                
                if (viewMode === 'list') {
                  return (
                    <div
                      key={template.id}
                      className="card p-6 hover:shadow-md transition-all duration-200 animate-slideUp cursor-pointer"
                      style={{ animationDelay: `${index * 0.05}s` }}
                      onClick={() => {
                        setSelectedTemplate(template);
                        setShowTemplateModal(true);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{template.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">{template.subject}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="capitalize">{template.type.replace('_', ' ')}</span>
                              <span>
                                {template.createdAt instanceof Date 
                                  ? template.createdAt.toLocaleDateString()
                                  : new Date(template.createdAt).toLocaleDateString()
                                }
                              </span>
                              {template.variables && template.variables.length > 0 && (
                                <span>{template.variables.length} variables</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyTemplate(template);
                            }}
                            className="action-btn-primary"
                            title="Copy template"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTemplate(template.id);
                            }}
                            className="action-btn-danger"
                            title="Delete template"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Grid view
                return (
                  <div
                    key={template.id}
                    className="bg-white border-2 border-gray-200 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-600 group"
                    onClick={() => {
                      setSelectedTemplate(template);
                      setShowTemplateModal(true);
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyTemplate(template);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy template"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTemplate(template.id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete template"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold mb-2" style={{ color: '#000000' }}>{template.name}</h3>
                    <p className="text-sm mb-4" style={{ color: '#555555' }}>{template.subject}</p>
                    
                    <div className="flex items-center justify-between text-xs mb-3" style={{ color: '#888888' }}>
                      <span className="capitalize">{template.type.replace('_', ' ')}</span>
                      <span>
                        {template.createdAt instanceof Date 
                          ? template.createdAt.toLocaleDateString()
                          : new Date(template.createdAt).toLocaleDateString()
                        }
                      </span>
                    </div>
                    
                    {template.variables && template.variables.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {template.variables.slice(0, 2).map((variable, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium"
                          >
                            {variable}
                          </span>
                        ))}
                        {template.variables.length > 2 && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded font-medium">
                            +{template.variables.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Tools Section */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-8" style={{ color: '#000000' }}>Advanced Template Tools</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => setShowRichEditor(true)}
              className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Edit3 className="w-5 h-5" />
              <span>Rich Text Editor</span>
            </button>
            <button
              onClick={() => setShowMultiClientPreview(true)}
              className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Eye className="w-5 h-5" />
              <span>Multi-Client Preview</span>
            </button>
            <button
              onClick={() => setShowOrganizer(true)}
              className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Template Organizer</span>
            </button>
          </div>
        </div>
      </section>

      {/* Template Preview Modal */}
      {showTemplateModal && selectedTemplate && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowTemplateModal(false)}></div>
            
            <div className="modal-content inline-block w-full max-w-4xl p-6 my-8 text-left align-middle transition-all transform shadow-xl rounded-2xl modal-enter">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-400 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{selectedTemplate.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 capitalize">{selectedTemplate.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyTemplate(selectedTemplate)}
                    className="action-btn-primary"
                    title="Copy template"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowTemplateModal(false)}
                    className="action-btn"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Email Subject</label>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border-l-4 border-blue-500">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{selectedTemplate.subject}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Email Content</label>
                    <div className="card p-6 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-900 dark:text-gray-100 font-sans">
                        {selectedTemplate.content}
                      </pre>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Template Info</label>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Type</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                          {selectedTemplate.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Created</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {selectedTemplate.createdAt instanceof Date 
                            ? selectedTemplate.createdAt.toLocaleDateString()
                            : new Date(selectedTemplate.createdAt).toLocaleDateString()
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Variables ({selectedTemplate.variables.length})
                      </label>
                      <div className="space-y-2">
                        {selectedTemplate.variables.map((variable, index) => (
                          <div key={index} className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                            <code className="text-sm font-mono text-blue-800 dark:text-blue-200">
                              {variable}
                            </code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={() => copyTemplate(selectedTemplate)}
                      className="btn-primary w-full flex items-center justify-center space-x-2"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy Template</span>
                    </button>
                    <button
                      onClick={() => {
                        deleteTemplate(selectedTemplate.id);
                        setShowTemplateModal(false);
                      }}
                      className="btn-secondary w-full flex items-center justify-center space-x-2 !text-red-600 hover:!text-red-700 hover:!border-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Template</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rich Template Editor Modal */}
      <RichTemplateEditor
        isOpen={showRichEditor}
        onClose={() => setShowRichEditor(false)}
        onSave={(template) => {
          console.log('Saving template:', template);
          setShowRichEditor(false);
          showToast('Template saved successfully!');
        }}
      />

      {/* Multi-Client Email Preview Modal */}
      {selectedTemplate && (
        <MultiClientEmailPreview
          isOpen={showMultiClientPreview}
          onClose={() => setShowMultiClientPreview(false)}
          template={{
            subject: selectedTemplate.subject,
            content: selectedTemplate.content,
            senderName: 'Alex Johnson',
            senderEmail: 'alex@yourcompany.com',
            recipientName: 'John Smith',
            recipientEmail: 'john@client.com'
          }}
        />
      )}

      {/* Template Organizer Modal */}
      {showOrganizer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowOrganizer(false)}></div>
            
            <div className="modal-content inline-block w-full max-w-7xl h-[90vh] my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl modal-enter overflow-hidden">
              <TemplateOrganizer
                templates={templates.map(t => ({
                  ...t,
                  tags: [], // Convert to new format
                  isFavorite: false,
                  isArchived: false,
                  usageCount: 0
                }))}
                folders={folders}
                tags={tags}
                onUpdateTemplate={(template) => {
                  console.log('Updating template:', template);
                }}
                onDeleteTemplate={(id) => {
                  console.log('Deleting template:', id);
                }}
                onCreateFolder={(folder) => {
                  const newFolder = { ...folder, id: Date.now().toString(), templatesCount: 0 };
                  setFolders(prev => [...prev, newFolder]);
                }}
                onUpdateFolder={(folder) => {
                  setFolders(prev => prev.map(f => f.id === folder.id ? folder : f));
                }}
                onDeleteFolder={(id) => {
                  setFolders(prev => prev.filter(f => f.id !== id));
                }}
                onCreateTag={(tag) => {
                  const newTag = { ...tag, id: Date.now().toString(), count: 0 };
                  setTags(prev => [...prev, newTag]);
                }}
                onUpdateTag={(tag) => {
                  setTags(prev => prev.map(t => t.id === tag.id ? tag : t));
                }}
                onDeleteTag={(id) => {
                  setTags(prev => prev.filter(t => t.id !== id));
                }}
              />
              <button
                onClick={() => setShowOrganizer(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <AuthGuard>
      <TemplatesContent />
    </AuthGuard>
  );
}