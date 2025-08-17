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
      case 'superdesign':
        result = await EmailService.sendSuperDesignEmail(emailData);
        break;
      case 'superdesign-welcome':
        result = await EmailService.sendSuperDesignWelcomeEmail(emailData);
        break;
      case 'superdesign-invoice':
        result = await EmailService.sendSuperDesignInvoiceEmail(emailData);
        break;
      case 'superdesign-followup':
        result = await EmailService.sendSuperDesignFollowUpEmail(emailData);
        break;
      case 'superdesign-project-update':
        result = await EmailService.sendSuperDesignProjectUpdateEmail(emailData);
        break;
      case 'custom':
        // Transform the custom email data to match EmailService.sendEmail expectations
        const textContent = emailData.content;
        
        // Parse AI-generated structured content or regular content
        const parseEmailContent = (content: string) => {
          // Check if content has structured sections (from AI generation)
          if (content.includes('GREETING:') && content.includes('SIGNATURE:')) {
            const sections = {
              greeting: '',
              leadParagraph: '',
              bodySections: [] as string[],
              signature: ''
            };
            
            // Extract each section by its label
            const extractSection = (label: string) => {
              const regex = new RegExp(`${label}:\\\\s*([\\\\s\\\\S]*?)(?=(?:GREETING:|LEAD_PARAGRAPH:|BODY_SECTION_\\\\d+:|SIGNATURE:|$))`, 'i');
              const match = content.match(regex);
              return match ? match[1].trim() : '';
            };
            
            sections.greeting = extractSection('GREETING') || `Hi ${emailData.clientName},`;
            sections.leadParagraph = extractSection('LEAD_PARAGRAPH') || 'Thank you for your interest in working together.';
            sections.signature = extractSection('SIGNATURE') || `Best regards,\n${emailData.freelancerName}`;
            
            // Extract all body sections
            const bodyMatches = content.match(/BODY_SECTION_\\d+:\\s*([\\s\\S]*?)(?=(?:GREETING:|LEAD_PARAGRAPH:|BODY_SECTION_\\d+:|SIGNATURE:|$))/gi);
            if (bodyMatches) {
              sections.bodySections = bodyMatches.map(match => {
                return match.replace(/BODY_SECTION_\\d+:\\s*/i, '').trim();
              });
            }
            
            return sections;
          } else {
            // Fallback: Parse regular content into sections
            const lines = content.split('\n\n').filter(section => section.trim() !== '');
            
            return {
              greeting: lines[0] || `Hi ${emailData.clientName},`,
              leadParagraph: lines[1] || 'Thank you for your interest in working together.',
              bodySections: lines.slice(2, -1).filter(section => section.trim() !== ''),
              signature: lines[lines.length - 1] || `Best regards,\n${emailData.freelancerName}`
            };
          }
        };
        
        const parsedContent = parseEmailContent(textContent);
        const brandName = emailData.freelancerName || 'Professional Services';
        const preheader = `${emailData.subject} - Message from ${brandName}`.substring(0, 90);
        
        // Create bulletproof table-based email HTML
        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${emailData.subject}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0; padding:0; background-color:#f3f4f6; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <!-- Preheader -->
  <div style="display:none; font-size:1px; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; mso-hide:all;">
    ${preheader}
  </div>
  
  <!-- 100% background wrapper -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f3f4f6;">
    <tr>
      <td align="center" style="padding:24px;">
        <!-- 600px centered container -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px; max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td align="left" style="padding:24px 24px 8px 24px; font:600 14px -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; color:#111827;">
              ${brandName}
            </td>
          </tr>
          
          <!-- Subject/Title -->
          <tr>
            <td align="left" style="padding:0 24px; font:700 22px/1.3 -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; color:#111827;">
              ${emailData.subject.replace(/\[.*?\]\s*/, '')}
            </td>
          </tr>
          
          <!-- Spacer -->
          <tr><td style="line-height:16px; height:16px;">&nbsp;</td></tr>

          <!-- Greeting -->
          <tr>
            <td align="left" style="padding:0 24px; font:400 16px/1.5 -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; color:#374151;">
              ${parsedContent.greeting}
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="line-height:16px; height:16px;">&nbsp;</td></tr>

          <!-- Lead paragraph -->
          <tr>
            <td align="left" style="padding:0 24px; font:400 16px/1.5 -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; color:#374151;">
              ${parsedContent.leadParagraph}
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="line-height:24px; height:24px;">&nbsp;</td></tr>

          ${parsedContent.bodySections.map(section => `
          <!-- Body section -->
          <tr>
            <td align="left" style="padding:0 24px; font:400 16px/1.5 -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; color:#374151;">
              ${section.replace(/\n/g, '<br>')}
            </td>
          </tr>
          <!-- Spacer -->
          <tr><td style="line-height:16px; height:16px;">&nbsp;</td></tr>`).join('')}

          <!-- Primary CTA Button -->
          <tr>
            <td align="center" style="padding:0 24px 8px 24px;">
              <!-- Bulletproof button -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td bgcolor="#2563eb" style="border-radius:8px; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);">
                    <a href="mailto:${emailData.freelancerEmail}?subject=Re: ${emailData.subject.replace(/\\[.*?\\]\\s*/, '')}&body=Hi ${emailData.freelancerName},%0D%0A%0D%0A" 
                       style="display:inline-block; padding:12px 24px; font:600 16px -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; color:#ffffff; text-decoration:none; border-radius:8px;">
                      Reply to this Email
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Spacer after CTA -->
          <tr><td style="line-height:24px; height:24px;">&nbsp;</td></tr>

          <!-- Spacer before signature -->
          <tr><td style="line-height:24px; height:24px;">&nbsp;</td></tr>

          <!-- Signature -->
          <tr>
            <td align="left" style="padding:0 24px 24px 24px; font:400 16px/1.5 -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; color:#374151; border-top:1px solid #e5e7eb; padding-top:20px;">
              ${parsedContent.signature.replace(/\n/g, '<br>')}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="left" style="padding:16px 24px 24px 24px; font:400 12px/1.5 -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; color:#6b7280; background-color:#f9fafb;">
              ${brandName}<br>
              Professional Services<br>
              <a href="mailto:${emailData.freelancerEmail}" style="color:#2563eb; text-decoration:underline;">Contact</a>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

        // Create plain text version for multipart email
        const plainTextContent = `
${emailData.subject}
${'='.repeat(emailData.subject.length)}

${parsedContent.greeting}

${parsedContent.leadParagraph}

${parsedContent.bodySections.join('\n\n')}

${parsedContent.signature}

---
${brandName}
Professional Services
Email: ${emailData.freelancerEmail}
        `.trim();
        
        // For testing: send all emails to your verified address with client info
        const isTestMode = !process.env.CUSTOM_DOMAIN_VERIFIED;
        const testEmail = 'shafeelahamed15@gmail.com';
        
        const customEmailOptions = {
          to: isTestMode ? testEmail : emailData.clientEmail,
          subject: isTestMode ? `[FOR: ${emailData.clientName}] ${emailData.subject}` : emailData.subject,
          text: isTestMode ? `This email would be sent to: ${emailData.clientName} <${emailData.clientEmail}>\n\n---EMAIL CONTENT---\n\n${plainTextContent}` : plainTextContent,
          html: isTestMode ? `
          <!DOCTYPE html>
          <html><body>
            <div style="background: #dbeafe; padding: 16px; margin-bottom: 20px; border-left: 4px solid #3b82f6; border-radius: 6px;">
              <strong>📧 Test Mode:</strong> This email would be sent to <strong>${emailData.clientName}</strong> &lt;${emailData.clientEmail}&gt;
            </div>
            ${htmlContent.replace(/<body[^>]*>/i, '<div>').replace(/<\/body>/i, '</div>')}
          </body></html>` : htmlContent,
          from: `${emailData.freelancerName} <onboarding@resend.dev>`,
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
    console.error('Email API Error Details:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      type: body?.type,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error',
        type: body?.type || 'unknown'
      },
      { status: 500 }
    );
  }
}