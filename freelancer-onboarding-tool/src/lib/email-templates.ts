// SuperDesign Email Templates
// Professional email templates with consistent branding and responsive design

export interface SuperDesignEmailOptions {
  clientName: string;
  clientEmail: string;
  freelancerName: string;
  freelancerEmail: string;
  companyName?: string;
  companyLogo?: string;
  subject: string;
  content: string;
  primaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  ctaText?: string;
  ctaUrl?: string;
  footerText?: string;
}

export interface InvoiceEmailOptions extends SuperDesignEmailOptions {
  invoiceNumber: string;
  amount: string;
  dueDate: string;
  paymentLink?: string;
  invoiceUrl?: string;
  items?: Array<{
    description: string;
    quantity: number;
    rate: number;
    total: number;
  }>;
}

export interface ProjectUpdateOptions extends SuperDesignEmailOptions {
  projectName: string;
  progress: number;
  nextSteps: string[];
  attachments?: Array<{
    name: string;
    url: string;
  }>;
}

// SuperDesign Color Palette
export const SUPERDESIGN_COLORS = {
  primary: '#4863eb',
  primaryDark: '#3b4fd8', 
  accent: '#22c55e',
  accentDark: '#16a34a',
  background: '#ffffff',
  backgroundAlt: '#f9fafb',
  text: '#111827',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  border: '#e5e7eb',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444'
};

export class SuperDesignEmailTemplates {
  private static getBaseEmailTemplate(options: SuperDesignEmailOptions): string {
    const {
      clientName,
      freelancerName,
      companyName,
      companyLogo,
      subject,
      content,
      primaryColor = SUPERDESIGN_COLORS.primary,
      accentColor = SUPERDESIGN_COLORS.accent,
      backgroundColor = SUPERDESIGN_COLORS.background,
      ctaText = "Reply to this Email",
      ctaUrl = `mailto:${options.freelancerEmail}?subject=Re: ${subject}`,
      footerText
    } = options;

    const brandName = companyName || freelancerName;
    const preheader = `${subject} - Professional services from ${brandName}`.substring(0, 100);

    return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${subject}</title>
  
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->

  <style>
    /* Reset styles */
    * { box-sizing: border-box; }
    body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    
    /* Client-specific styles */
    #outlook a { padding: 0; }
    .ReadMsgBody { width: 100%; }
    .ExternalClass { width: 100%; }
    .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }
    
    /* SuperDesign base styles */
    body {
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: ${SUPERDESIGN_COLORS.text};
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: ${backgroundColor};
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    .header {
      background: linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%);
      padding: 32px 24px;
      text-align: center;
    }
    
    .header-content {
      color: white;
    }
    
    .logo {
      width: 64px;
      height: 64px;
      border-radius: 12px;
      margin: 0 auto 16px;
      display: block;
    }
    
    .company-name {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 8px;
      letter-spacing: -0.025em;
    }
    
    .email-title {
      font-size: 28px;
      font-weight: 800;
      margin: 16px 0 0;
      letter-spacing: -0.025em;
    }
    
    .content {
      padding: 32px 24px;
    }
    
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: ${SUPERDESIGN_COLORS.text};
      margin: 0 0 24px;
    }
    
    .content-body {
      font-size: 16px;
      line-height: 1.6;
      color: ${SUPERDESIGN_COLORS.textSecondary};
      margin: 0 0 32px;
    }
    
    .content-body p {
      margin: 0 0 16px;
    }
    
    .content-body p:last-child {
      margin: 0;
    }
    
    .cta-container {
      text-align: center;
      margin: 32px 0;
    }
    
    .cta-button {
      display: inline-block;
      background: ${primaryColor};
      color: white;
      padding: 16px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(72, 99, 235, 0.2);
    }
    
    .cta-button:hover {
      background: ${SUPERDESIGN_COLORS.primaryDark};
      box-shadow: 0 4px 12px rgba(72, 99, 235, 0.3);
      transform: translateY(-2px);
    }
    
    .signature {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid ${SUPERDESIGN_COLORS.border};
      font-size: 16px;
      color: ${SUPERDESIGN_COLORS.textSecondary};
    }
    
    .footer {
      background: ${SUPERDESIGN_COLORS.backgroundAlt};
      padding: 24px;
      text-align: center;
      border-top: 1px solid ${SUPERDESIGN_COLORS.border};
    }
    
    .footer-text {
      font-size: 14px;
      color: ${SUPERDESIGN_COLORS.textMuted};
      margin: 0 0 8px;
    }
    
    .footer-brand {
      font-size: 16px;
      font-weight: 600;
      color: ${SUPERDESIGN_COLORS.text};
      margin: 8px 0 0;
    }
    
    /* Mobile responsive */
    @media screen and (max-width: 600px) {
      .email-container {
        margin: 0;
        border-radius: 0;
      }
      
      .header {
        padding: 24px 16px;
      }
      
      .content {
        padding: 24px 16px;
      }
      
      .email-title {
        font-size: 24px;
      }
      
      .cta-button {
        padding: 14px 24px;
        font-size: 14px;
      }
    }
    
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .email-container {
        background: #1f2937;
      }
      
      .content {
        color: #f9fafb;
      }
      
      .greeting {
        color: #f9fafb;
      }
      
      .content-body {
        color: #d1d5db;
      }
      
      .signature {
        color: #d1d5db;
        border-color: #374151;
      }
      
      .footer {
        background: #111827;
        border-color: #374151;
      }
      
      .footer-brand {
        color: #f9fafb;
      }
    }
  </style>
</head>

<body style="margin: 0; padding: 0; background-color: #f3f4f6;">
  <!-- Preheader -->
  <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all;">
    ${preheader}
  </div>
  
  <!-- Email background -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f3f4f6; padding: 20px 0;">
    <tr>
      <td align="center">
        
        <!-- Main email container -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="email-container" style="max-width: 600px; background: ${backgroundColor}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td class="header" style="background: linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%); padding: 32px 24px; text-align: center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" class="header-content">
                    ${companyLogo ? `<img src="${companyLogo}" alt="${brandName}" class="logo" style="width: 64px; height: 64px; border-radius: 12px; margin: 0 auto 16px; display: block;">` : ''}
                    <div class="company-name" style="font-size: 24px; font-weight: 700; margin: 0 0 8px; letter-spacing: -0.025em; color: white;">
                      ${brandName}
                    </div>
                    <h1 class="email-title" style="font-size: 28px; font-weight: 800; margin: 16px 0 0; letter-spacing: -0.025em; color: white;">
                      ${subject}
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Main content -->
          <tr>
            <td class="content" style="padding: 32px 24px;">
              <div class="greeting" style="font-size: 18px; font-weight: 600; color: ${SUPERDESIGN_COLORS.text}; margin: 0 0 24px;">
                Hi ${clientName},
              </div>
              
              <div class="content-body" style="font-size: 16px; line-height: 1.6; color: ${SUPERDESIGN_COLORS.textSecondary}; margin: 0 0 32px;">
                ${content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}
              </div>
              
              <div class="cta-container" style="text-align: center; margin: 32px 0;">
                <a href="${ctaUrl}" class="cta-button" style="display: inline-block; background: ${primaryColor}; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                  ${ctaText}
                </a>
              </div>
              
              <div class="signature" style="margin-top: 32px; padding-top: 24px; border-top: 1px solid ${SUPERDESIGN_COLORS.border}; font-size: 16px; color: ${SUPERDESIGN_COLORS.textSecondary};">
                Best regards,<br>
                <strong>${freelancerName}</strong>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td class="footer" style="background: ${SUPERDESIGN_COLORS.backgroundAlt}; padding: 24px; text-align: center; border-top: 1px solid ${SUPERDESIGN_COLORS.border};">
              <div class="footer-text" style="font-size: 14px; color: ${SUPERDESIGN_COLORS.textMuted}; margin: 0 0 8px;">
                ${footerText || 'Professional services • Reliable delivery • Quality results'}
              </div>
              <div class="footer-text" style="font-size: 14px; color: ${SUPERDESIGN_COLORS.textMuted}; margin: 0 0 8px;">
                Questions? Reply to this email or contact <a href="mailto:${options.freelancerEmail}" style="color: ${primaryColor};">${options.freelancerEmail}</a>
              </div>
              <div class="footer-brand" style="font-size: 16px; font-weight: 600; color: ${SUPERDESIGN_COLORS.text}; margin: 8px 0 0;">
                ${brandName}
              </div>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  static generateWelcomeEmail(options: SuperDesignEmailOptions): string {
    return this.getBaseEmailTemplate({
      ...options,
      content: options.content || `Welcome aboard! I'm thrilled to be working with you on this project.

This email kicks off our professional collaboration, and I want to ensure everything runs smoothly from start to finish.

What happens next:

• Project Scope & Timeline - I'll send you a detailed scope of work and timeline within 24 hours
• Kickoff Call - We'll schedule a brief call to align on expectations and answer any questions  
• Project Begins - Once everything is approved, we'll dive into the exciting work!

Quick reminder: Feel free to reach out anytime with questions, ideas, or feedback. Clear communication is key to a successful project.

Looking forward to creating something amazing together!`,
      ctaText: "Reply to Get Started",
      footerText: "Welcome to professional project management • Let's build something great together"
    });
  }

  static generateFollowUpEmail(options: SuperDesignEmailOptions & { projectName?: string; progress?: number }): string {
    const { projectName, progress } = options;
    
    return this.getBaseEmailTemplate({
      ...options,
      content: options.content || `I wanted to give you a quick update on${projectName ? ` ${projectName}` : ' your project'}.

${progress ? `Current Progress: ${progress}% complete` : ''}

Here's what we've accomplished recently:
• [Key milestone 1 completed]
• [Key milestone 2 in progress]  
• [Next milestone planned]

Everything is progressing smoothly and we're on track for our planned timeline. I'll continue keeping you updated as we move forward.

If you have any questions or feedback, please don't hesitate to reach out.`,
      ctaText: "Reply with Questions",
      footerText: "Project updates • Transparent communication • Quality results"
    });
  }

  static generateInvoiceEmail(options: InvoiceEmailOptions): string {
    const { invoiceNumber, amount, dueDate, paymentLink, invoiceUrl, items } = options;
    
    let itemsHtml = '';
    if (items && items.length > 0) {
      itemsHtml = `
      <div style="margin: 24px 0; padding: 20px; background: ${SUPERDESIGN_COLORS.backgroundAlt}; border-radius: 8px; border: 1px solid ${SUPERDESIGN_COLORS.border};">
        <h3 style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: ${SUPERDESIGN_COLORS.text};">Invoice Details</h3>
        <table role="presentation" width="100%" cellpadding="8" cellspacing="0" border="0" style="border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 2px solid ${SUPERDESIGN_COLORS.border};">
              <th style="text-align: left; font-weight: 600; color: ${SUPERDESIGN_COLORS.text};">Description</th>
              <th style="text-align: center; font-weight: 600; color: ${SUPERDESIGN_COLORS.text};">Qty</th>
              <th style="text-align: right; font-weight: 600; color: ${SUPERDESIGN_COLORS.text};">Rate</th>
              <th style="text-align: right; font-weight: 600; color: ${SUPERDESIGN_COLORS.text};">Total</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
            <tr style="border-bottom: 1px solid ${SUPERDESIGN_COLORS.border};">
              <td style="padding: 8px 0; color: ${SUPERDESIGN_COLORS.textSecondary};">${item.description}</td>
              <td style="padding: 8px 0; text-align: center; color: ${SUPERDESIGN_COLORS.textSecondary};">${item.quantity}</td>
              <td style="padding: 8px 0; text-align: right; color: ${SUPERDESIGN_COLORS.textSecondary};">$${item.rate}</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600; color: ${SUPERDESIGN_COLORS.text};">$${item.total}</td>
            </tr>
            `).join('')}
            <tr>
              <td colspan="3" style="padding: 16px 0 8px; text-align: right; font-weight: 700; font-size: 18px; color: ${SUPERDESIGN_COLORS.text};">Total Amount:</td>
              <td style="padding: 16px 0 8px; text-align: right; font-weight: 700; font-size: 24px; color: ${SUPERDESIGN_COLORS.success};">${amount}</td>
            </tr>
          </tbody>
        </table>
      </div>`;
    }

    const ctaButtons = [];
    if (paymentLink) {
      ctaButtons.push(`<a href="${paymentLink}" style="display: inline-block; background: ${SUPERDESIGN_COLORS.success}; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 0 8px 16px 0;">Pay Now</a>`);
    }
    if (invoiceUrl) {
      ctaButtons.push(`<a href="${invoiceUrl}" style="display: inline-block; background: ${SUPERDESIGN_COLORS.primary}; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 0 8px 16px 0;">View Invoice</a>`);
    }

    return this.getBaseEmailTemplate({
      ...options,
      content: `Thank you for your business! Please find your invoice details below:

Invoice Number: ${invoiceNumber}
Total Amount: ${amount}
Due Date: ${dueDate}

${itemsHtml ? 'Please see the detailed breakdown below.' : ''}

${ctaButtons.length > 0 ? '' : 'Please process payment at your earliest convenience.'}

If you have any questions about this invoice, please don't hesitate to contact me.`,
      ctaText: ctaButtons.length > 0 ? undefined : "Reply with Questions",
      ctaUrl: ctaButtons.length > 0 ? undefined : `mailto:${options.freelancerEmail}?subject=Re: Invoice ${invoiceNumber}`,
      footerText: "Professional invoicing • Secure payments • Quality service"
    }).replace(
      '<div class="cta-container" style="text-align: center; margin: 32px 0;">',
      `${itemsHtml}<div class="cta-container" style="text-align: center; margin: 32px 0;">${ctaButtons.length > 0 ? ctaButtons.join(' ') : ''}`
    );
  }

  static generateProjectUpdateEmail(options: ProjectUpdateOptions): string {
    const { projectName, progress, nextSteps, attachments } = options;
    
    let nextStepsHtml = '';
    if (nextSteps && nextSteps.length > 0) {
      nextStepsHtml = `
      <div style="margin: 24px 0; padding: 20px; background: ${SUPERDESIGN_COLORS.backgroundAlt}; border-radius: 8px; border-left: 4px solid ${SUPERDESIGN_COLORS.accent};">
        <h3 style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: ${SUPERDESIGN_COLORS.text};">Next Steps</h3>
        <ul style="margin: 0; padding-left: 20px; color: ${SUPERDESIGN_COLORS.textSecondary};">
          ${nextSteps.map(step => `<li style="margin: 8px 0;">${step}</li>`).join('')}
        </ul>
      </div>`;
    }

    let attachmentsHtml = '';
    if (attachments && attachments.length > 0) {
      attachmentsHtml = `
      <div style="margin: 24px 0; padding: 20px; background: ${SUPERDESIGN_COLORS.backgroundAlt}; border-radius: 8px;">
        <h3 style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: ${SUPERDESIGN_COLORS.text};">Attachments</h3>
        ${attachments.map(attachment => `
        <div style="margin: 8px 0;">
          <a href="${attachment.url}" style="color: ${SUPERDESIGN_COLORS.primary}; text-decoration: none; font-weight: 500;">📎 ${attachment.name}</a>
        </div>
        `).join('')}
      </div>`;
    }

    const progressBar = progress ? `
    <div style="margin: 24px 0;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span style="font-weight: 600; color: ${SUPERDESIGN_COLORS.text};">Project Progress</span>
        <span style="font-weight: 600; color: ${SUPERDESIGN_COLORS.accent};">${progress}%</span>
      </div>
      <div style="width: 100%; height: 12px; background: ${SUPERDESIGN_COLORS.border}; border-radius: 6px; overflow: hidden;">
        <div style="width: ${progress}%; height: 100%; background: linear-gradient(90deg, ${SUPERDESIGN_COLORS.accent} 0%, ${SUPERDESIGN_COLORS.accentDark} 100%); transition: width 0.3s ease;"></div>
      </div>
    </div>` : '';

    return this.getBaseEmailTemplate({
      ...options,
      content: `I wanted to give you a quick update on ${projectName || 'your project'}.

${progress ? `We're making great progress and are currently ${progress}% complete.` : 'Everything is moving along smoothly.'}

${options.content}

${progressBar}${nextStepsHtml}${attachmentsHtml}

I'll continue keeping you updated as we move forward. If you have any questions or feedback, please don't hesitate to reach out.`,
      ctaText: "Reply with Feedback",
      footerText: "Regular updates • Transparent progress • Quality delivery"
    });
  }

  static generateCustomEmail(options: SuperDesignEmailOptions): string {
    return this.getBaseEmailTemplate(options);
  }
}

// Plain text versions for accessibility and deliverability
export class SuperDesignTextTemplates {
  static generatePlainText(options: SuperDesignEmailOptions): string {
    const brandName = options.companyName || options.freelancerName;
    
    return `
${options.subject}
${'='.repeat(options.subject.length)}

Hi ${options.clientName},

${options.content}

Best regards,
${options.freelancerName}

---
${brandName}
${options.footerText || 'Professional services • Reliable delivery • Quality results'}

Questions? Reply to this email or contact ${options.freelancerEmail}
    `.trim();
  }
}