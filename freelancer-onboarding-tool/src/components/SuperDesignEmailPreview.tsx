'use client';

import { useState } from 'react';
import { 
  Mail, 
  Eye, 
  Send, 
  Copy,
  Check,
  X,
  Smartphone,
  Monitor,
  Palette,
  Settings
} from 'lucide-react';

interface SuperDesignEmailPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  template: {
    name: string;
    type: string;
    subject: string;
    content: string;
  };
  clientName?: string;
  freelancerName?: string;
  freelancerEmail?: string;
  companyName?: string;
  companyLogo?: string;
}

const PREVIEW_COLORS = {
  primary: '#4863eb',
  accent: '#22c55e',
  background: '#ffffff',
  text: '#111827',
  textSecondary: '#6b7280'
};

const EMAIL_TYPES = {
  welcome_email: { name: 'Welcome Email', icon: '👋', color: '#4863eb' },
  follow_up: { name: 'Follow-up', icon: '📅', color: '#22c55e' },
  invoice_reminder: { name: 'Invoice', icon: '💰', color: '#f59e0b' },
  project_completion: { name: 'Completion', icon: '✅', color: '#10b981' },
  proposal: { name: 'Proposal', icon: '📋', color: '#8b5cf6' },
  thank_you: { name: 'Thank You', icon: '🙏', color: '#ef4444' }
};

export function SuperDesignEmailPreview({
  isOpen,
  onClose,
  template,
  clientName = "John Smith",
  freelancerName = "Your Name",
  freelancerEmail = "your@email.com",
  companyName = "Your Company",
  companyLogo
}: SuperDesignEmailPreviewProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [customization, setCustomization] = useState({
    primaryColor: PREVIEW_COLORS.primary,
    accentColor: PREVIEW_COLORS.accent,
    showCustomizer: false
  });
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const emailTypeInfo = EMAIL_TYPES[template.type as keyof typeof EMAIL_TYPES] || {
    name: 'Custom Email',
    icon: '📧',
    color: PREVIEW_COLORS.primary
  };

  const brandName = companyName || freelancerName;

  const copyEmailCode = async () => {
    try {
      // Generate the email HTML with current customizations
      const emailHTML = generateEmailHTML();
      await navigator.clipboard.writeText(emailHTML);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const sendTestEmail = async () => {
    setSending(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'superdesign',
          clientName,
          clientEmail: freelancerEmail, // Send to self for testing
          freelancerName,
          freelancerEmail,
          companyName,
          companyLogo,
          subject: `[PREVIEW] ${template.subject}`,
          content: template.content,
          primaryColor: customization.primaryColor,
          accentColor: customization.accentColor
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      alert('Preview email sent successfully!');
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send preview email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const generateEmailHTML = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${template.subject}</title>
  <style>
    body { margin: 0; padding: 20px; background: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .email-container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, ${customization.primaryColor} 0%, ${customization.accentColor} 100%); padding: 32px 24px; text-align: center; color: white; }
    .company-name { font-size: 24px; font-weight: 700; margin: 16px 0 8px; }
    .email-title { font-size: 28px; font-weight: 800; margin: 16px 0 0; }
    .content { padding: 32px 24px; }
    .greeting { font-size: 18px; font-weight: 600; margin: 0 0 24px; color: #111827; }
    .content-body { font-size: 16px; line-height: 1.6; color: #6b7280; margin: 0 0 32px; }
    .cta-button { display: inline-block; background: ${customization.primaryColor}; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; }
    .signature { margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; color: #6b7280; }
    .footer { background: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 14px; }
    @media (max-width: 600px) { .email-container { margin: 0; border-radius: 0; } .header, .content { padding: 24px 16px; } }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="company-name">${brandName}</div>
      <h1 class="email-title">${template.subject}</h1>
    </div>
    <div class="content">
      <div class="greeting">Hi ${clientName},</div>
      <div class="content-body">${template.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</div>
      <div style="text-align: center; margin: 32px 0;">
        <a href="mailto:${freelancerEmail}?subject=Re: ${template.subject}" class="cta-button">Reply to this Email</a>
      </div>
      <div class="signature">
        Best regards,<br>
        <strong>${freelancerName}</strong>
      </div>
    </div>
    <div class="footer">
      Professional services • Reliable delivery • Quality results<br>
      Questions? Reply to this email or contact ${freelancerEmail}
    </div>
  </div>
</body>
</html>`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="modal-overlay fixed inset-0 transition-opacity" onClick={onClose}></div>
        
        <div className="modal-content inline-block w-full max-w-7xl my-8 text-left align-middle transition-all transform shadow-xl rounded-2xl modal-enter">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: emailTypeInfo.color + '20', color: emailTypeInfo.color }}
              >
                {emailTypeInfo.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Email Preview</h3>
                <p className="text-gray-600 dark:text-gray-400">{template.name} • {emailTypeInfo.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1 ${
                    viewMode === 'desktop'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  <span>Desktop</span>
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1 ${
                    viewMode === 'mobile'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Mobile</span>
                </button>
              </div>
              
              {/* Customization Toggle */}
              <button
                onClick={() => setCustomization(prev => ({ ...prev, showCustomizer: !prev.showCustomizer }))}
                className={`action-btn-primary ${customization.showCustomizer ? 'bg-blue-600' : ''}`}
                title="Customize colors"
              >
                <Palette className="w-5 h-5" />
              </button>
              
              {/* Actions */}
              <button
                onClick={copyEmailCode}
                className="action-btn-primary"
                title="Copy email HTML"
                disabled={copied}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
              
              <button
                onClick={sendTestEmail}
                className="action-btn-primary"
                title="Send test email"
                disabled={sending}
              >
                {sending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
              
              <button
                onClick={onClose}
                className="action-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex">
            {/* Customization Panel */}
            {customization.showCustomizer && (
              <div className="w-80 p-6 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Customization</span>
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Primary Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={customization.primaryColor}
                        onChange={(e) => setCustomization(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customization.primaryColor}
                        onChange={(e) => setCustomization(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="input text-sm"
                        placeholder="#4863eb"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Accent Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={customization.accentColor}
                        onChange={(e) => setCustomization(prev => ({ ...prev, accentColor: e.target.value }))}
                        className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customization.accentColor}
                        onChange={(e) => setCustomization(prev => ({ ...prev, accentColor: e.target.value }))}
                        className="input text-sm"
                        placeholder="#22c55e"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setCustomization({
                        primaryColor: PREVIEW_COLORS.primary,
                        accentColor: PREVIEW_COLORS.accent,
                        showCustomizer: true
                      })}
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Reset to defaults
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Email Preview */}
            <div className="flex-1 p-6">
              <div className={`mx-auto transition-all duration-300 ${
                viewMode === 'desktop' ? 'max-w-2xl' : 'max-w-sm'
              }`}>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  {/* Mock Email Client Header */}
                  <div className="bg-white dark:bg-gray-900 rounded-t-lg p-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span>From: {freelancerName} &lt;{freelancerEmail}&gt;</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span>To: {clientName} &lt;client@example.com&gt;</span>
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100 mt-2">
                      {template.subject}
                    </div>
                  </div>
                  
                  {/* Email Content Preview */}
                  <div 
                    className="bg-white rounded-b-lg overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: generateEmailHTML().replace('body>', 'div>').replace('<body', '<div') }}
                  />
                </div>
              </div>
              
              <div className="text-center mt-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Preview shown in {viewMode} view • Colors are customizable
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}