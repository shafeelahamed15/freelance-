'use client';

import { useState } from 'react';
import { 
  Monitor, 
  Smartphone, 
  Settings, 
  Share, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Lightbulb, 
  Send, 
  Download, 
  Check,
  Star,
  Archive,
  Trash2,
  X
} from 'lucide-react';

interface EmailTemplate {
  subject: string;
  content: string;
  senderName: string;
  senderEmail: string;
  recipientName: string;
  recipientEmail: string;
}

interface MultiClientEmailPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  template: EmailTemplate;
}

const EMAIL_CLIENTS = [
  {
    id: 'gmail',
    name: 'Gmail',
    icon: 'G',
    color: 'bg-red-500',
    compatibility: 98,
    status: 'excellent'
  },
  {
    id: 'outlook',
    name: 'Outlook',
    icon: 'O', 
    color: 'bg-blue-600',
    compatibility: 94,
    status: 'good'
  },
  {
    id: 'apple',
    name: 'Apple Mail',
    icon: 'A',
    color: 'bg-gray-800',
    compatibility: 96,
    status: 'excellent'
  },
  {
    id: 'thunderbird',
    name: 'Thunderbird',
    icon: 'T',
    color: 'bg-orange-500',
    compatibility: 92,
    status: 'warning'
  }
];

const COMPATIBILITY_ISSUES = [
  {
    client: 'Outlook 2016/2019',
    issue: 'Gradient backgrounds may not render correctly',
    severity: 'warning',
    icon: Info
  },
  {
    client: 'Mobile Optimization', 
    issue: 'Consider larger touch targets for mobile devices',
    severity: 'info',
    icon: Smartphone
  }
];

const OPTIMIZATION_TIPS = [
  {
    title: 'Font fallbacks',
    description: 'Using web-safe font fallbacks for maximum compatibility',
    status: 'good',
    icon: Check
  },
  {
    title: 'Alt text',
    description: 'Images include descriptive alt text for accessibility', 
    status: 'good',
    icon: Check
  },
  {
    title: 'CSS support',
    description: 'Consider inline styles for better client support',
    status: 'warning',
    icon: AlertTriangle
  }
];

export function MultiClientEmailPreview({ isOpen, onClose, template }: MultiClientEmailPreviewProps) {
  const [activeClient, setActiveClient] = useState('gmail');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  if (!isOpen) return null;

  const renderGmailPreview = () => (
    <div className="gmail-preview bg-white rounded-lg overflow-hidden font-roboto">
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            <strong className="text-gray-900">{template.senderName}</strong> &lt;{template.senderEmail}&gt;
          </div>
          <div className="text-gray-500">10:30 AM</div>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <div>to me</div>
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-gray-400 hover:text-yellow-400 cursor-pointer" />
            <Archive className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer" />
          </div>
        </div>
      </div>
      <div className="p-6">
        <h1 className="text-2xl font-normal text-gray-900 mb-5">{template.subject}</h1>
        <div 
          className="text-sm leading-relaxed text-gray-900"
          dangerouslySetInnerHTML={{ __html: template.content }}
        />
      </div>
    </div>
  );

  const renderOutlookPreview = () => (
    <div className="outlook-preview bg-white font-segoe">
      <div className="bg-gray-100 border-b border-gray-300 p-3">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div>
            <strong className="text-gray-800">{template.senderName}</strong> ({template.senderEmail})
          </div>
          <div>Today 10:30 AM</div>
        </div>
        <div className="text-xs mt-1">To: {template.recipientName}</div>
      </div>
      <div className="p-4">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">{template.subject}</h1>
        <div 
          className="text-sm leading-normal text-gray-800"
          dangerouslySetInnerHTML={{ __html: template.content }}
        />
      </div>
    </div>
  );

  const renderApplePreview = () => (
    <div className="apple-preview bg-white font-system">
      <div className="bg-gray-100 border-b border-gray-300 p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            <strong className="text-black">{template.senderName}</strong> &lt;{template.senderEmail}&gt;
          </div>
          <div>Today at 10:30 AM</div>
        </div>
        <div className="text-sm mt-1">To: {template.recipientName} &lt;{template.recipientEmail}&gt;</div>
      </div>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-black mb-5">{template.subject}</h1>
        <div 
          className="text-base leading-relaxed text-black"
          dangerouslySetInnerHTML={{ __html: template.content }}
        />
      </div>
    </div>
  );

  const renderThunderbirdPreview = () => (
    <div className="thunderbird-preview bg-white font-liberation">
      <div className="bg-gray-200 border-b border-gray-400 p-3">
        <div className="flex items-center justify-between text-xs text-gray-700">
          <div>
            From: <strong>{template.senderName}</strong> &lt;{template.senderEmail}&gt;
          </div>
          <div>01/15/2025 10:30 AM</div>
        </div>
        <div className="text-xs mt-1">To: {template.recipientName} &lt;{template.recipientEmail}&gt;</div>
      </div>
      <div className="p-3">
        <h1 className="text-lg font-semibold text-black mb-3">{template.subject}</h1>
        <div 
          className="text-sm leading-normal text-black"
          dangerouslySetInnerHTML={{ __html: template.content }}
        />
      </div>
    </div>
  );

  const renderClientPreview = () => {
    switch (activeClient) {
      case 'gmail': return renderGmailPreview();
      case 'outlook': return renderOutlookPreview();
      case 'apple': return renderApplePreview();
      case 'thunderbird': return renderThunderbirdPreview();
      default: return renderGmailPreview();
    }
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 95) return 'text-green-700 bg-green-50 border-green-200';
    if (score >= 90) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (score >= 85) return 'text-orange-700 bg-orange-50 border-orange-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return Check;
      case 'good': return Check;
      case 'warning': return AlertTriangle;
      default: return Check;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        
        <div className="modal-content inline-block w-full max-w-7xl my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl modal-enter">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-400 rounded-lg flex items-center justify-center">
                <Monitor className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Multi-Client Email Preview</h3>
                <p className="text-gray-600">See how your emails look across different email clients</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2">
                <Share className="w-4 h-4" />
                <span>Share Preview</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Email Client Tabs */}
            <div className="flex items-center justify-between mb-8 bg-white rounded-xl p-2 border border-gray-200">
              <div className="flex items-center space-x-2">
                {EMAIL_CLIENTS.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => setActiveClient(client.id)}
                    className={`px-4 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all ${
                      activeClient === client.id
                        ? 'bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100 hover:transform hover:-translate-y-0.5'
                    }`}
                  >
                    <div className={`w-5 h-5 ${client.color} rounded flex items-center justify-center text-white text-xs font-bold`}>
                      {client.icon}
                    </div>
                    <span>{client.name}</span>
                  </button>
                ))}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center space-x-1 ${
                    viewMode === 'desktop'
                      ? 'bg-gray-100 text-gray-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  <span>Desktop</span>
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center space-x-1 ${
                    viewMode === 'mobile'
                      ? 'bg-gray-100 text-gray-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Email Preview */}
              <div className="space-y-6">
                <div className="bg-gray-900 rounded-xl p-4 shadow-2xl">
                  <div className="flex items-center mb-3">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-gray-400 text-sm font-medium">
                        {EMAIL_CLIENTS.find(c => c.id === activeClient)?.name} - inbox@{activeClient}.com
                      </span>
                    </div>
                  </div>
                  <div className={`transition-all duration-300 ${viewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
                    {renderClientPreview()}
                  </div>
                </div>
              </div>

              {/* Comparison & Analytics */}
              <div className="space-y-6">
                {/* Compatibility Report */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Compatibility Report</span>
                  </h4>
                  <div className="space-y-3">
                    {EMAIL_CLIENTS.map((client) => {
                      const StatusIcon = getStatusIcon(client.status);
                      return (
                        <div key={client.id} className={`flex items-center justify-between p-3 rounded-lg border ${getCompatibilityColor(client.compatibility)}`}>
                          <div className="flex items-center space-x-3">
                            <div className={`w-5 h-5 ${client.color} rounded flex items-center justify-center text-white text-xs font-bold`}>
                              {client.icon}
                            </div>
                            <span className="font-medium">{client.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{client.compatibility}%</span>
                            <StatusIcon className="w-4 h-4" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Rendering Issues */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <span>Potential Issues</span>
                  </h4>
                  <div className="space-y-3">
                    {COMPATIBILITY_ISSUES.map((issue, index) => {
                      const IconComponent = issue.icon;
                      return (
                        <div key={index} className={`p-3 rounded-lg border-l-4 ${
                          issue.severity === 'warning' 
                            ? 'bg-yellow-50 border-yellow-400' 
                            : 'bg-blue-50 border-blue-400'
                        }`}>
                          <div className="flex items-start space-x-2">
                            <IconComponent className={`w-4 h-4 mt-0.5 ${
                              issue.severity === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                            }`} />
                            <div>
                              <h5 className={`font-medium ${
                                issue.severity === 'warning' ? 'text-yellow-800' : 'text-blue-800'
                              }`}>
                                {issue.client}
                              </h5>
                              <p className={`text-sm ${
                                issue.severity === 'warning' ? 'text-yellow-700' : 'text-blue-700'
                              }`}>
                                {issue.issue}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Best Practices */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                    <span>Optimization Tips</span>
                  </h4>
                  <div className="space-y-3">
                    {OPTIMIZATION_TIPS.map((tip, index) => {
                      const IconComponent = tip.icon;
                      return (
                        <div key={index} className="flex items-start space-x-3">
                          <IconComponent className={`w-5 h-5 mt-0.5 ${
                            tip.status === 'good' ? 'text-green-600' : 'text-orange-600'
                          }`} />
                          <div>
                            <h5 className="font-medium text-gray-900">{tip.title}</h5>
                            <p className="text-sm text-gray-600">{tip.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Preview Actions</h4>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                      <Send className="w-4 h-4" />
                      <span>Send Test to All Clients</span>
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>Export Report</span>
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                        <Share className="w-4 h-4" />
                        <span>Share URL</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}