import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...emailData } = body;

    let result;

    switch (type) {
      case 'onboarding':
        result = await EmailService.sendOnboardingEmail(emailData);
        break;
      case 'invoice':
        result = await EmailService.sendInvoiceEmail(emailData);
        break;
      case 'welcome':
        result = await EmailService.sendWelcomeEmail(emailData);
        break;
      case 'custom':
        // Transform the custom email data to match EmailService.sendEmail expectations
        const textContent = emailData.content;
        const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${emailData.subject}</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .email-content {
                white-space: pre-wrap;
                background: #ffffff;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #e1e5e9;
              }
            </style>
          </head>
          <body>
            <div class="email-content">${textContent.replace(/\n/g, '<br>')}</div>
          </body>
          </html>
        `;

        const customEmailOptions = {
          to: emailData.clientEmail,
          subject: emailData.subject,
          text: textContent,
          html: htmlContent,
          from: emailData.freelancerEmail ? `${emailData.freelancerName} <${emailData.freelancerEmail}>` : undefined,
          replyTo: emailData.freelancerEmail
        };
        result = await EmailService.sendEmail(customEmailOptions);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Email API Error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}