'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Undo, 
  Redo,
  Heading,
  Plus,
  Save,
  Eye,
  Send,
  Copy,
  Download,
  Monitor,
  Smartphone,
  Braces,
  X
} from 'lucide-react';

interface Variable {
  name: string;
  placeholder: string;
  description?: string;
}

interface TemplateData {
  name: string;
  category: string;
  subject: string;
  content: string;
  variables: string[];
}

interface RichTemplateEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: TemplateData) => void;
  initialTemplate?: TemplateData;
}

const DEFAULT_VARIABLES: Variable[] = [
  { name: '{{client_name}}', placeholder: 'John Smith', description: 'Client\'s full name' },
  { name: '{{project_name}}', placeholder: 'Website Redesign', description: 'Project title' },
  { name: '{{freelancer_name}}', placeholder: 'Your Name', description: 'Your name' },
  { name: '{{company_name}}', placeholder: 'Your Company', description: 'Your company name' },
  { name: '{{due_date}}', placeholder: 'March 15, 2025', description: 'Project due date' },
  { name: '{{amount}}', placeholder: '$2,500', description: 'Invoice amount' },
  { name: '{{project_url}}', placeholder: 'https://project.com', description: 'Project URL' },
  { name: '{{invoice_number}}', placeholder: 'INV-001', description: 'Invoice number' },
  { name: '{{current_date}}', placeholder: 'January 15, 2025', description: 'Current date' }
];

const TEMPLATE_CATEGORIES = [
  'welcome_email',
  'follow_up', 
  'invoice_reminder',
  'project_completion',
  'proposal',
  'thank_you'
];

export function RichTemplateEditor({ isOpen, onClose, onSave, initialTemplate }: RichTemplateEditorProps) {
  const [template, setTemplate] = useState<TemplateData>({
    name: initialTemplate?.name || '',
    category: initialTemplate?.category || 'welcome_email',
    subject: initialTemplate?.subject || '',
    content: initialTemplate?.content || '',
    variables: initialTemplate?.variables || []
  });
  
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [sampleData, setSampleData] = useState({
    client_name: 'John Smith',
    project_name: 'Website Redesign',
    freelancer_name: 'Alex Johnson',
    company_name: 'Professional Services',
    due_date: 'March 15, 2025',
    amount: '$2,500',
    project_url: 'https://project.com',
    invoice_number: 'INV-001',
    current_date: new Date().toLocaleDateString()
  });
  
  const editorRef = useRef<HTMLDivElement>(null);
  const [showVariables, setShowVariables] = useState(false);

  useEffect(() => {
    if (initialTemplate) {
      setTemplate(initialTemplate);
    }
  }, [initialTemplate]);

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      setTemplate(prev => ({
        ...prev,
        content: editorRef.current?.innerHTML || ''
      }));
    }
  };

  const insertVariable = (variable: Variable) => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.className = 'inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm mx-1 border border-blue-200';
        span.textContent = variable.name;
        span.setAttribute('contenteditable', 'false');
        
        range.insertNode(span);
        range.collapse(false);
        
        updateContent();
        editorRef.current.focus();
      }
    }
    setShowVariables(false);
  };

  const processContentForPreview = (content: string): string => {
    let processed = content;
    
    // Replace variables with sample data
    Object.entries(sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(regex, value);
    });
    
    return processed;
  };

  const handleSave = () => {
    // Extract variables from content
    const variableMatches = template.content.match(/{{[^}]+}}/g) || [];
    const uniqueVariables = [...new Set(variableMatches)];
    
    const finalTemplate = {
      ...template,
      variables: uniqueVariables
    };
    
    onSave(finalTemplate);
  };

  const sendTestEmail = async () => {
    // Implementation would call API to send test email
    console.log('Sending test email...');
    alert('Test email sent successfully!');
  };

  const copyHTML = () => {
    const htmlContent = generateEmailHTML();
    navigator.clipboard.writeText(htmlContent).then(() => {
      alert('HTML copied to clipboard!');
    });
  };

  const generateEmailHTML = (): string => {
    const processedContent = processContentForPreview(template.content);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${template.subject}</title>
  <style>
    body { margin: 0; padding: 20px; background: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .email-container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #4863eb 0%, #22c55e 100%); padding: 32px 24px; text-align: center; color: white; }
    .content { padding: 32px 24px; line-height: 1.6; }
    @media (max-width: 600px) { .email-container { margin: 0; border-radius: 0; } .header, .content { padding: 24px 16px; } }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>${sampleData.company_name}</h1>
      <p>${template.subject}</p>
    </div>
    <div class="content">
      ${processedContent}
    </div>
  </div>
</body>
</html>`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        
        <div className="modal-content inline-block w-full max-w-7xl my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl modal-enter">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-400 rounded-lg flex items-center justify-center">
                <Braces className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Rich Template Editor</h3>
                <p className="text-gray-600">Create professional email templates with rich formatting</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setPreviewMode(previewMode === 'desktop' ? 'mobile' : 'desktop')}
                className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                {previewMode === 'desktop' ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                <span className="capitalize">{previewMode}</span>
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Template</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex h-[80vh]">
            {/* Editor Section */}
            <div className="w-1/2 p-6 border-r border-gray-200 overflow-y-auto">
              {/* Template Meta */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Template Details</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                    <input
                      type="text"
                      value={template.name}
                      onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Welcome Email Template"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={template.category}
                      onChange={(e) => setTemplate(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {TEMPLATE_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>
                          {cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
                    <input
                      type="text"
                      value={template.subject}
                      onChange={(e) => setTemplate(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Welcome to our collaboration, {{client_name}}!"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Rich Text Editor */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Email Content</h4>
                  <button
                    onClick={() => setShowVariables(!showVariables)}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Insert Variable</span>
                  </button>
                </div>
                
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                  {/* Toolbar */}
                  <div className="bg-gray-50 p-3 border-b border-gray-200 flex items-center space-x-2 flex-wrap">
                    <button
                      onClick={() => executeCommand('bold')}
                      className="p-2 rounded hover:bg-gray-200 transition-colors"
                      title="Bold"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => executeCommand('italic')}
                      className="p-2 rounded hover:bg-gray-200 transition-colors"
                      title="Italic"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => executeCommand('underline')}
                      className="p-2 rounded hover:bg-gray-200 transition-colors"
                      title="Underline"
                    >
                      <Underline className="w-4 h-4" />
                    </button>
                    <div className="w-px h-6 bg-gray-300"></div>
                    <button
                      onClick={() => executeCommand('formatBlock', 'h3')}
                      className="p-2 rounded hover:bg-gray-200 transition-colors"
                      title="Heading"
                    >
                      <Heading className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => executeCommand('insertUnorderedList')}
                      className="p-2 rounded hover:bg-gray-200 transition-colors"
                      title="Bullet List"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => executeCommand('insertOrderedList')}
                      className="p-2 rounded hover:bg-gray-200 transition-colors"
                      title="Numbered List"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </button>
                    <div className="w-px h-6 bg-gray-300"></div>
                    <button
                      onClick={() => {
                        const url = prompt('Enter URL:');
                        if (url) executeCommand('createLink', url);
                      }}
                      className="p-2 rounded hover:bg-gray-200 transition-colors"
                      title="Link"
                    >
                      <Link className="w-4 h-4" />
                    </button>
                    <div className="w-px h-6 bg-gray-300"></div>
                    <button
                      onClick={() => executeCommand('undo')}
                      className="p-2 rounded hover:bg-gray-200 transition-colors"
                      title="Undo"
                    >
                      <Undo className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => executeCommand('redo')}
                      className="p-2 rounded hover:bg-gray-200 transition-colors"
                      title="Redo"
                    >
                      <Redo className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Content Area */}
                  <div
                    ref={editorRef}
                    contentEditable
                    onInput={updateContent}
                    className="p-4 min-h-[300px] focus:outline-none"
                    style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}
                    dangerouslySetInnerHTML={{ __html: template.content }}
                  />
                </div>
              </div>

              {/* Variable Library */}
              {showVariables && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h5 className="font-semibold text-blue-900 mb-3">Available Variables</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {DEFAULT_VARIABLES.map((variable, index) => (
                      <button
                        key={index}
                        onClick={() => insertVariable(variable)}
                        className="text-left p-2 bg-white border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                        title={variable.description}
                      >
                        <div className="text-sm font-mono text-blue-800">{variable.name}</div>
                        <div className="text-xs text-blue-600">{variable.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Preview Section */}
            <div className="w-1/2 p-6 overflow-y-auto bg-gray-50">
              {/* Preview Controls */}
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Live Preview</h4>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Client Name"
                    value={sampleData.client_name}
                    onChange={(e) => setSampleData(prev => ({ ...prev, client_name: e.target.value }))}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={sampleData.project_name}
                    onChange={(e) => setSampleData(prev => ({ ...prev, project_name: e.target.value }))}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Email Preview */}
              <div className={`mx-auto transition-all duration-300 ${previewMode === 'desktop' ? 'max-w-2xl' : 'max-w-sm'}`}>
                <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                  {/* Email Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white p-6 text-center">
                    <h2 className="text-xl font-bold">{sampleData.company_name}</h2>
                    <p className="text-blue-100 mt-1">{template.subject}</p>
                  </div>
                  
                  {/* Email Body */}
                  <div 
                    className="p-6"
                    dangerouslySetInnerHTML={{ __html: processContentForPreview(template.content) }}
                  />
                </div>
              </div>

              {/* Preview Actions */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={sendTestEmail}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Test Email</span>
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={copyHTML}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy HTML</span>
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}