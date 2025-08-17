import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  replyTo?: string;
}

export interface OnboardingEmailOptions {
  clientEmail: string;
  clientName: string;
  freelancerName: string;
  freelancerEmail: string;
  content: string;
  subject: string;
  step?: string;
}

export class EmailService {
  static async sendEmail(options: EmailOptions) {
    try {
      const { to, subject, text, html, from, replyTo } = options;
      
      const emailOptions: Record<string, unknown> = {
        from: from || process.env.FROM_EMAIL || 'onboarding@yourdomain.com',
        to: Array.isArray(to) ? to : [to],
        subject,
        replyTo,
      };

      if (html) {
        emailOptions.html = html;
      } else if (text) {
        emailOptions.text = text;
      } else {
        throw new Error('Either html or text content is required');
      }

      const data = await resend.emails.send(emailOptions as never);

      console.log('Email sent successfully:', data);
      return data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  static async sendOnboardingEmail(options: OnboardingEmailOptions) {
    const { clientEmail, clientName, freelancerName, freelancerEmail, content, subject, step } = options;

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background: #ffffff;
            padding: 30px 20px;
            border: 1px solid #e1e5e9;
            border-top: none;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-radius: 0 0 8px 8px;
            border: 1px solid #e1e5e9;
            border-top: none;
            font-size: 14px;
            color: #6c757d;
          }
          .step-badge {
            display: inline-block;
            background: #28a745;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            margin-bottom: 20px;
          }
          .content-body {
            white-space: pre-wrap;
            margin: 20px 0;
          }
          .cta {
            text-align: center;
            margin: 30px 0;
          }
          .cta-button {
            display: inline-block;
            background: #007bff;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${subject}</h1>
          ${step ? `<div class="step-badge">${step}</div>` : ''}
        </div>
        
        <div class="content">
          <p>Hi ${clientName},</p>
          
          <div class="content-body">${content}</div>
          
          <div class="cta">
            <a href="mailto:${freelancerEmail}" class="cta-button">Reply to this Email</a>
          </div>
          
          <p>Best regards,<br>${freelancerName}</p>
        </div>
        
        <div class="footer">
          <p>This email was sent as part of your project onboarding process.</p>
          <p>If you have any questions, please reply to this email or contact ${freelancerEmail}</p>
        </div>
      </body>
      </html>
    `;

    const text = `
Hi ${clientName},

${content}

Best regards,
${freelancerName}

---
This email was sent as part of your project onboarding process.
If you have any questions, please reply to this email or contact ${freelancerEmail}
    `;

    return this.sendEmail({
      to: clientEmail,
      subject,
      html,
      text,
      from: `${freelancerName} <${freelancerEmail}>`,
      replyTo: freelancerEmail,
    });
  }

  static async sendInvoiceEmail(options: {
    clientEmail: string;
    clientName: string;
    freelancerName: string;
    freelancerEmail: string;
    invoiceNumber: string;
    amount: string;
    dueDate: string;
    paymentLink?: string;
    invoiceUrl?: string;
  }) {
    const { 
      clientEmail, 
      clientName, 
      freelancerName, 
      freelancerEmail, 
      invoiceNumber, 
      amount, 
      dueDate, 
      paymentLink,
      invoiceUrl 
    } = options;

    const subject = `Invoice ${invoiceNumber} from ${freelancerName}`;

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background: #ffffff;
            padding: 30px 20px;
            border: 1px solid #e1e5e9;
            border-top: none;
          }
          .invoice-details {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .detail-label {
            font-weight: 600;
            color: #495057;
          }
          .amount {
            font-size: 24px;
            font-weight: 700;
            color: #28a745;
          }
          .cta {
            text-align: center;
            margin: 30px 0;
          }
          .cta-button {
            display: inline-block;
            background: #28a745;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 5px;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-radius: 0 0 8px 8px;
            border: 1px solid #e1e5e9;
            border-top: none;
            font-size: 14px;
            color: #6c757d;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Invoice ${invoiceNumber}</h1>
          <p>Payment Due: ${dueDate}</p>
        </div>
        
        <div class="content">
          <p>Hi ${clientName},</p>
          
          <p>Thank you for your business! Please find your invoice details below:</p>
          
          <div class="invoice-details">
            <div class="detail-row">
              <span class="detail-label">Invoice Number:</span>
              <span>${invoiceNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Due Date:</span>
              <span>${dueDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Total Amount:</span>
              <span class="amount">${amount}</span>
            </div>
          </div>
          
          <div class="cta">
            ${paymentLink ? `<a href="${paymentLink}" class="cta-button">Pay Now</a>` : ''}
            ${invoiceUrl ? `<a href="${invoiceUrl}" class="cta-button">View Invoice</a>` : ''}
          </div>
          
          <p>If you have any questions about this invoice, please don't hesitate to contact me.</p>
          
          <p>Best regards,<br>${freelancerName}</p>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing ${freelancerName} for your project needs.</p>
          <p>Questions? Reply to this email or contact ${freelancerEmail}</p>
        </div>
      </body>
      </html>
    `;

    const text = `
Hi ${clientName},

Thank you for your business! Please find your invoice details below:

Invoice Number: ${invoiceNumber}
Total Amount: ${amount}
Due Date: ${dueDate}

${paymentLink ? `Pay online: ${paymentLink}` : ''}
${invoiceUrl ? `View full invoice: ${invoiceUrl}` : ''}

If you have any questions about this invoice, please don't hesitate to contact me.

Best regards,
${freelancerName}

---
Thank you for choosing ${freelancerName} for your project needs.
Questions? Reply to this email or contact ${freelancerEmail}
    `;

    return this.sendEmail({
      to: clientEmail,
      subject,
      html,
      text,
      from: `${freelancerName} <${freelancerEmail}>`,
      replyTo: freelancerEmail,
    });
  }

  static async sendWelcomeEmail(options: {
    clientEmail: string;
    clientName: string;
    freelancerName: string;
    freelancerEmail: string;
    projectType?: string;
  }) {
    const { clientEmail, clientName, freelancerName, freelancerEmail, projectType } = options;

    const subject = `Welcome ${clientName}! Let's get started on your project`;


    return this.sendOnboardingEmail({
      clientEmail,
      clientName,
      freelancerName,
      freelancerEmail,
      content: `Welcome aboard! I'm thrilled to be working with you ${projectType ? `on your ${projectType} project` : ''}. This email kicks off our professional collaboration, and I want to ensure everything runs smoothly from start to finish.

What happens next:

1. Project Scope & Timeline - I'll send you a detailed scope of work and timeline within 24 hours
2. Kickoff Call - We'll schedule a brief call to align on expectations and answer any questions  
3. Project Begins - Once everything is approved, we'll dive into the exciting work!

Quick reminder: Feel free to reach out anytime with questions, ideas, or feedback. Clear communication is key to a successful project.

Looking forward to creating something amazing together!`,
      subject,
      step: 'Welcome'
    });
  }

  static async testConnection() {
    try {
      // Test the connection by sending a test email to yourself
      const testEmail = process.env.FROM_EMAIL || 'test@example.com';
      
      const data = await resend.emails.send({
        from: 'onboarding@resend.dev', // Resend's test email
        to: [testEmail],
        subject: 'Resend Connection Test',
        html: '<p>Your Resend integration is working correctly!</p>',
      } as never);

      console.log('Test email sent successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Test email failed:', error);
      return { success: false, error };
    }
  }
}