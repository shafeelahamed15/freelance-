// Only import OpenAI on server side to prevent client-side exposure
let openai: unknown = null;

// Initialize OpenAI only in server environment
if (typeof window === 'undefined' && process.env.OPENAI_API_KEY) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const OpenAI = require('openai');
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export interface TemplateGenerationOptions {
  type: 'welcome' | 'scope' | 'timeline' | 'payment' | 'invoice' | 'follow-up';
  clientName?: string;
  clientEmail?: string;
  clientCompany?: string;
  projectType?: string;
  businessType?: string;
  tone?: 'professional' | 'friendly' | 'casual';
  brandName?: string;
  freelancerName?: string;
  useClientData?: boolean; // Whether to use actual client data or placeholders
}

export class OpenAIService {
  static async generateTemplate(options: TemplateGenerationOptions): Promise<string> {
    try {
      const response = await fetch('/api/generate-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        throw new Error('Failed to generate template');
      }

      const data = await response.json();
      return data.template;
    } catch (error) {
      console.error('Template generation error:', error);
      throw new Error('Failed to generate template with AI');
    }
  }

  static async generateTemplateServer(options: TemplateGenerationOptions): Promise<string> {
    if (!openai) {
      throw new Error('OpenAI client not initialized. Please check your API key configuration.');
    }

    const { 
      type, 
      clientName, 
      clientCompany, 
      projectType, 
      businessType, 
      tone = 'professional', 
      brandName, 
      freelancerName,
      useClientData = true 
    } = options;

    // Use actual data if available and useClientData is true, otherwise use placeholders
    const clientNameText = (useClientData && clientName) ? clientName : '{{clientName}}';
    const clientCompanyText = (useClientData && clientCompany) ? clientCompany : (clientCompany || '{{clientCompany}}');
    const projectTypeText = (useClientData && projectType) ? projectType : (projectType || '{{projectType}}');
    const freelancerNameText = (useClientData && freelancerName) ? freelancerName : (freelancerName || '{{freelancerName}}');
    const businessNameText = (useClientData && brandName) ? brandName : (brandName || '{{businessName}}');
    
    const prompts = {
      welcome: `Create a professional welcome email following the structured email format.

        Context:
        ${useClientData && clientName ? `Client name: ${clientName}` : 'Use {{clientName}} as placeholder for client name'}
        ${useClientData && clientCompany ? `Client company: ${clientCompany}` : 'Use {{clientCompany}} as placeholder for client company'}  
        ${useClientData && projectType ? `Project type: ${projectType}` : 'Use {{projectType}} as placeholder for project type'}
        ${useClientData && freelancerName ? `Freelancer name: ${freelancerName}` : 'Use {{freelancerName}} as placeholder for freelancer name'}
        ${useClientData && brandName ? `Business name: ${brandName}` : 'Use {{businessName}} as placeholder for business name'}
        ${businessType ? `Service type: ${businessType}` : ''}
        Tone: ${tone}

        Generate ONLY the content sections in this format (no HTML, just clean text):

        GREETING:
        Hi ${clientNameText},

        LEAD_PARAGRAPH:
        Welcome to ${businessNameText}! I'm excited to begin our ${projectTypeText} collaboration and help ${clientCompanyText || 'your business'} achieve remarkable results.

        BODY_SECTION_1:
        **What happens next:**
        
        • Project scope and timeline within 24 hours
        • Kickoff call to discuss your goals and requirements  
        • Clear milestones and regular progress updates

        BODY_SECTION_2:
        I'm committed to delivering exceptional results through open communication and professional collaboration. Together, we'll create a ${projectTypeText} solution that exceeds your expectations.

        SIGNATURE:
        Best regards,
        ${freelancerNameText}
        ${businessNameText}

        IMPORTANT: 
        - Keep content scannable and professional
        - Use bullet points for lists
        - Each section should be 1-3 lines max
        - Maintain a confident, professional tone
        ${!useClientData ? '- Keep {{variableName}} placeholders exactly as shown' : ''}`,

      scope: `Create a detailed scope of work email following the structured email format.

        Context:
        ${useClientData && clientName ? `Client name: ${clientName}` : 'Use {{clientName}} as placeholder for client name'}
        ${useClientData && projectType ? `Project type: ${projectType}` : 'Use {{projectType}} as placeholder for project type'}
        ${businessType ? `Service type: ${businessType}` : ''}
        Tone: ${tone}
        
        Generate ONLY the content sections in this format:

        GREETING:
        Hi ${clientNameText},

        LEAD_PARAGRAPH:
        Here's the detailed project scope for your ${projectTypeText}. This ensures we're perfectly aligned on deliverables, timeline, and expectations.

        BODY_SECTION_1:
        **Project Objectives:**
        • Deliver a professional ${projectTypeText} solution
        • Meet your specific business requirements
        • Ensure seamless user experience and functionality

        BODY_SECTION_2:
        **What's Included:**
        • Complete ${projectTypeText} development and implementation
        • 2 rounds of revisions based on your feedback
        • Final delivery with all source files and documentation
        • Post-launch support for the first 30 days

        BODY_SECTION_3:
        **Timeline:** 4-week delivery schedule with weekly milestones and progress updates.

        SIGNATURE:
        Best regards,
        ${freelancerNameText}

        ${!useClientData ? 'IMPORTANT: Keep {{variableName}} placeholders exactly as shown.' : ''}`,

      timeline: `Create a project timeline email following the structured email format.

        Context:
        ${useClientData && clientName ? `Client name: ${clientName}` : 'Use {{clientName}} as placeholder for client name'}
        ${useClientData && projectType ? `Project type: ${projectType}` : 'Use {{projectType}} as placeholder for project type'}
        Tone: ${tone}
        
        Generate ONLY the content sections in this format:

        GREETING:
        Hi ${clientNameText},

        LEAD_PARAGRAPH:
        Here's your detailed project timeline for the ${projectTypeText}. This schedule ensures quality delivery with clear milestones and regular communication.

        BODY_SECTION_1:
        **📅 Week 1-2: Discovery & Planning**
        • Initial consultation and requirements gathering
        • Project strategy and approach finalization
        • Deliverable: Complete project plan and concepts

        BODY_SECTION_2:
        **📅 Week 3-4: Development & Implementation**
        • Core development with regular progress updates
        • First draft delivery for your review and feedback
        • Deliverable: Working prototype or initial version

        BODY_SECTION_3:
        **📅 Week 5-6: Refinement & Final Delivery**
        • Revisions based on your feedback
        • Final testing, quality assurance, and delivery
        • Includes all source files and documentation

        SIGNATURE:
        Best regards,
        ${freelancerNameText}

        ${!useClientData ? 'IMPORTANT: Keep {{variableName}} placeholders exactly as shown.' : ''}`,

      payment: `Create a payment terms email following the structured email format.

        Context:
        ${useClientData && clientName ? `Client name: ${clientName}` : 'Use {{clientName}} as placeholder for client name'}
        ${useClientData && projectType ? `Project type: ${projectType}` : 'Use {{projectType}} as placeholder for project type'}
        ${businessType ? `Service type: ${businessType}` : ''}
        Tone: ${tone}
        
        Generate ONLY the content sections in this format:

        GREETING:
        Hi ${clientNameText},

        LEAD_PARAGRAPH:
        Here are the payment terms for your ${projectTypeText}. I believe in transparent pricing with no hidden costs or surprises.

        BODY_SECTION_1:
        **Payment Schedule:**
        • 50% deposit required to begin work
        • 50% final payment due upon project completion
        • All payments due within 5 business days of invoice

        BODY_SECTION_2:
        **Payment Methods:**
        • Bank transfer (preferred) • PayPal • Credit/Debit cards
        
        Your custom quote will be sent within 24 hours with the exact project investment.

        BODY_SECTION_3:
        **Simple Terms:** Work begins after deposit confirmation. Final deliverables are released upon full payment. Minor revisions are included at no extra cost.

        SIGNATURE:
        Best regards,
        ${freelancerNameText}

        ${!useClientData ? 'IMPORTANT: Keep {{variableName}} placeholders exactly as shown.' : ''}`,

      invoice: `Create a professional invoice email following the structured email format.

        Context:
        ${useClientData && clientName ? `Client name: ${clientName}` : 'Use {{clientName}} as placeholder for client name'}
        ${useClientData && projectType ? `Project type: ${projectType}` : 'Use {{projectType}} as placeholder for project type'}
        
        Generate ONLY the content sections in this format:

        GREETING:
        Hi ${clientNameText},

        LEAD_PARAGRAPH:
        Thank you for your business! Here's your invoice for the completed ${projectTypeText} project.

        BODY_SECTION_1:
        **Invoice Details:**
        • Project: ${projectTypeText} for ${clientCompanyText}
        • Invoice Date: {{currentDate}}
        • Payment Due: Within 5 business days

        BODY_SECTION_2:
        **Services Provided:**
        • ${projectTypeText} Development: $[Amount]
        • Project Management & Support: $[Amount]
        • **Total Due: $[Final Amount]**

        BODY_SECTION_3:
        **Payment Methods:** Bank transfer, PayPal, Credit Card. Once payment is confirmed, I'll send all final project deliverables.

        SIGNATURE:
        Best regards,
        ${freelancerNameText}

        ${!useClientData ? 'IMPORTANT: Keep {{variableName}} placeholders exactly as shown.' : ''}`,

      'follow-up': `Create a professional follow-up email following the structured email format.

        Context:
        ${useClientData && clientName ? `Client name: ${clientName}` : 'Use {{clientName}} as placeholder for client name'}
        ${useClientData && projectType ? `Project type: ${projectType}` : 'Use {{projectType}} as placeholder for project type'}
        Tone: ${tone}
        
        Generate ONLY the content sections in this format:

        GREETING:
        Hi ${clientNameText},

        LEAD_PARAGRAPH:
        I hope you're doing well! I wanted to check in on your ${projectTypeText} and see how everything is performing for you.

        BODY_SECTION_1:
        **Quick Check-in:**
        • How has the ${projectTypeText} been working for you?
        • Are you seeing the results you hoped for?
        • Do you need any adjustments or additional support?

        BODY_SECTION_2:
        **Ongoing Support:** I'm here to help with any updates, modifications, or questions about our work together.

        BODY_SECTION_3:
        **Future Collaboration:** If you're planning related projects or need ongoing support, I'd love to discuss how we can continue achieving great results together.

        SIGNATURE:
        Best regards,
        ${freelancerNameText}
        ${businessNameText}

        ${!useClientData ? 'IMPORTANT: Keep {{variableName}} placeholders exactly as shown.' : ''}`
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await (openai as any).chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a professional email content generator. Generate structured, professional email content that follows the EXACT sectioned format provided.

            CRITICAL FORMATTING RULES:
            - Generate content for EACH labeled section (GREETING, LEAD_PARAGRAPH, BODY_SECTION_X, SIGNATURE)
            - Keep each section concise and scannable (1-3 lines maximum)
            - Use bullet points for lists to improve readability
            - Maintain professional, confident tone throughout
            - Each section should be clearly separated and labeled
            
            PLACEHOLDER RULES:
            - Keep {{variableName}} placeholders EXACTLY as shown when requested
            - Never use [brackets] or other placeholder formats
            - Replace placeholders with actual data only when specified
            
            SECTIONED EMAIL STRUCTURE:
            - GREETING: Brief, personalized salutation
            - LEAD_PARAGRAPH: 1-2 sentences explaining why they should care
            - BODY_SECTION_1/2/3: Skimmable content blocks with clear headings
            - SIGNATURE: Professional closing with name and business
            
            CONTENT REQUIREMENTS:
            - Write at 7th-9th grade reading level
            - Use short, clear sentences
            - Focus on benefits and next steps
            - Avoid jargon and overly technical language
            - Make content scannable with bullet points and bold headings
            
            Generate ONLY the requested sections with clear section labels. The email must be professional, actionable, and easy to scan.`
          },
          {
            role: 'user',
            content: prompts[type]
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const generatedContent = response.choices[0]?.message?.content || 'Unable to generate template. Please try again.';
      
      // Post-process the generated content for better structure
      return this.formatEmailContent(generatedContent);
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate template with AI');
    }
  }

  static formatEmailContent(content: string): string {
    // Preserve the AI-generated structure as much as possible
    const formatted = content
      // Remove any subject lines from the content
      .replace(/^Subject:.*?\n\n?/i, '')
      
      // Ensure greeting starts properly
      .replace(/^[\n\s]*/, '')
      
      // Normalize line breaks - preserve double line breaks, clean up inconsistent spacing
      .replace(/\r\n/g, '\n') // Convert Windows line endings
      .replace(/\r/g, '\n') // Convert Mac line endings
      .replace(/\n\s+\n/g, '\n\n') // Clean up spacing between paragraphs
      .replace(/\n{3,}/g, '\n\n') // Maximum 2 line breaks (one blank line)
      
      // Ensure greeting has proper spacing
      .replace(/(Hi [^,]+,)\s*/i, '$1\n\n')
      .replace(/(Dear [^,]+,)\s*/i, '$1\n\n')
      
      // Ensure signature has proper spacing
      .replace(/\n+(Best regards|Sincerely|Thank you),?\s*/gi, '\n\nBest regards,\n')
      
      // Fix specific formatting patterns for professional emails
      .replace(/\n([A-Z][^.!?]*[.!?])\s*\n([A-Z])/g, '\n$1\n\n$2') // Separate sentences into paragraphs
      .replace(/:\s*\n\n([A-Z])/g, ':\n\n$1') // Proper spacing after colons
      
      // Clean up any remaining formatting issues
      .replace(/[ \t]+/g, ' ') // Multiple spaces to single space
      .replace(/\n /g, '\n') // Remove leading spaces after line breaks
      .replace(/\n+$/, ''); // Remove trailing line breaks

    return formatted.trim();
  }

  static async improveContent(content: string, improvements: string[]): Promise<string> {
    if (!openai) {
      throw new Error('OpenAI client not initialized. Please check your API key configuration.');
    }

    const improvementsList = improvements.join(', ');
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await (openai as any).chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional writing assistant. Improve the given content based on the requested improvements while maintaining the original tone and intent.'
          },
          {
            role: 'user',
            content: `Please improve this content with the following requirements: ${improvementsList}

Content to improve:
${content}

Return only the improved content without additional commentary.`
          }
        ],
        max_tokens: 1200,
        temperature: 0.5,
      });

      return response.choices[0]?.message?.content || content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to improve content with AI');
    }
  }

  static async generateProjectSuggestions(clientDescription: string): Promise<string[]> {
    if (!openai) {
      return [
        'Website Development',
        'Brand Identity Design',
        'Content Strategy',
        'Digital Marketing',
        'Consultation Services'
      ];
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await (openai as any).chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a business consultant. Generate 5 practical project suggestions based on client needs.'
          },
          {
            role: 'user',
            content: `Based on this client description, suggest 5 relevant project types or services:
            ${clientDescription}
            
            Return as a simple array of project suggestions, one per line.`
          }
        ],
        max_tokens: 300,
        temperature: 0.8,
      });

      const suggestions = response.choices[0]?.message?.content?.split('\n')
        .filter((line: string) => line.trim().length > 0)
        .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
        .slice(0, 5) || [];

      return suggestions;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return [
        'Website Development',
        'Brand Identity Design',
        'Content Strategy',
        'Digital Marketing',
        'Consultation Services'
      ];
    }
  }

  static async processTemplateContent(options: {
    content: string;
    newClientName: string;
    newCompany?: string;
    newProjectType?: string;
    freelancerName: string;
  }): Promise<string> {
    console.log('OpenAI client status:', !!openai);
    
    if (!openai) {
      console.log('OpenAI not available, returning original content');
      throw new Error('OpenAI client not initialized. Please check your API key configuration.');
    }

    const { content, newClientName, newCompany, newProjectType, freelancerName } = options;
    
    console.log('Processing with options:', {
      newClientName,
      newCompany,
      newProjectType,
      freelancerName,
      hasContent: !!content
    });

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await (openai as any).chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional email editor. Your task is to replace any client names, company names, or project references in the email content with the new client information provided, while keeping the email structure, tone, and freelancer name unchanged. Only replace client-related information, not the sender\'s information.'
          },
          {
            role: 'user',
            content: `Please update this email template to use the new client information:

NEW CLIENT INFORMATION:
- Client Name: ${newClientName}
- Company: ${newCompany || 'Not specified'}
- Project Type: ${newProjectType || 'Not specified'}
- Freelancer Name: ${freelancerName} (DO NOT CHANGE)

EMAIL CONTENT TO UPDATE:
${content}

Instructions:
1. Replace any client names or company names with the new information
2. Keep the freelancer name (${freelancerName}) unchanged
3. Replace any project type references with the new project type if provided
4. Maintain the same email structure, tone, and formatting
5. Keep all email signatures and contact information for the freelancer unchanged
6. Return ONLY the updated email content, no additional commentary`
          }
        ],
        max_tokens: 1500,
        temperature: 0.3,
      });

      const processedContent = response.choices[0]?.message?.content || content;
      
      // Apply formatting to the processed content
      return this.formatEmailContent(processedContent);
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to process template content with AI');
    }
  }

  static async summarizeClientNeeds(clientInfo: string): Promise<{
    summary: string;
    suggestedActions: string[];
    estimatedTimeframe: string;
  }> {
    if (!openai) {
      return {
        summary: 'Client analysis not available - OpenAI not configured',
        suggestedActions: ['Schedule discovery call', 'Send project proposal', 'Define project scope'],
        estimatedTimeframe: 'To be determined'
      };
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await (openai as any).chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a project manager analyzing client requirements. Provide structured analysis in JSON format.'
          },
          {
            role: 'user',
            content: `Analyze this client information and return a JSON response with:
            - summary: Brief client needs summary
            - suggestedActions: Array of 3-4 recommended next steps
            - estimatedTimeframe: Rough project duration estimate
            
            Client Info: ${clientInfo}`
          }
        ],
        max_tokens: 500,
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from OpenAI');

      try {
        return JSON.parse(content);
      } catch {
        return {
          summary: content,
          suggestedActions: ['Schedule discovery call', 'Send project proposal', 'Define project scope'],
          estimatedTimeframe: '2-4 weeks'
        };
      }
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return {
        summary: 'Client analysis not available',
        suggestedActions: ['Schedule discovery call', 'Send project proposal', 'Define project scope'],
        estimatedTimeframe: 'To be determined'
      };
    }
  }
}