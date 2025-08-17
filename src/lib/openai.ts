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
  clientName: string;
  projectType?: string;
  businessType?: string;
  tone?: 'professional' | 'friendly' | 'casual';
  brandName?: string;
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

    const { type, clientName, projectType, businessType, tone = 'professional', brandName } = options;

    const prompts = {
      welcome: `Create a professional welcome message for a new client named ${clientName}. 
        ${businessType ? `The freelancer's business type is: ${businessType}` : ''}
        ${projectType ? `The project type is: ${projectType}` : ''}
        ${brandName ? `The freelancer's brand name is: ${brandName}` : ''}
        Tone should be ${tone}. Include:
        - Warm welcome
        - Brief introduction
        - What to expect next
        - Contact information placeholder
        Keep it concise and professional.`,

      scope: `Generate a scope of work template for ${clientName}.
        ${projectType ? `Project type: ${projectType}` : ''}
        ${businessType ? `Service type: ${businessType}` : ''}
        Tone: ${tone}. Include:
        - Project objectives
        - Deliverables section
        - Timeline placeholder
        - Revision process
        - Out of scope items
        Use professional formatting with clear sections.`,

      timeline: `Create a project timeline template for ${clientName}.
        ${projectType ? `Project: ${projectType}` : ''}
        Tone: ${tone}. Include:
        - Project phases
        - Key milestones
        - Delivery dates (use placeholder dates)
        - Dependencies
        - Buffer time considerations
        Format as a clear, easy-to-follow timeline.`,

      payment: `Generate payment terms and conditions for ${clientName}.
        ${businessType ? `Service: ${businessType}` : ''}
        Tone: ${tone}. Include:
        - Payment schedule
        - Accepted payment methods
        - Late payment policy
        - Refund policy
        - Terms and conditions
        Keep it clear and legally appropriate.`,

      invoice: `Create a professional invoice template.
        Client: ${clientName}
        ${projectType ? `Project: ${projectType}` : ''}
        Include:
        - Invoice header with placeholders
        - Itemized services section
        - Subtotal, taxes, total
        - Payment terms
        - Thank you message
        Format for easy reading and processing.`,

      'follow-up': `Write a professional follow-up email template for ${clientName}.
        ${projectType ? `Regarding: ${projectType}` : ''}
        Tone: ${tone}. Include:
        - Friendly check-in
        - Project status update request
        - Next steps
        - Availability for questions
        - Professional closing
        Keep it concise and action-oriented.`
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await (openai as any).chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional freelancer assistant helping to create business communications. Generate clear, professional, and actionable content.'
          },
          {
            role: 'user',
            content: prompts[type]
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || 'Unable to generate template. Please try again.';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate template with AI');
    }
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
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
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