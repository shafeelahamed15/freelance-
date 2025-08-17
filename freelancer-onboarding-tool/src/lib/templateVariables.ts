import type { Client, User } from '@/types';

export interface TemplateContext {
  client?: Client;
  user?: User;
  projectType?: string;
  customVariables?: Record<string, string>;
}

export interface TemplateVariable {
  key: string;
  label: string;
  description: string;
  category: 'client' | 'user' | 'project' | 'custom';
}

// Standard template variables available in the system
export const TEMPLATE_VARIABLES: TemplateVariable[] = [
  // Client variables
  { key: 'clientName', label: 'Client Name', description: 'The client\'s full name', category: 'client' },
  { key: 'clientEmail', label: 'Client Email', description: 'The client\'s email address', category: 'client' },
  { key: 'clientCompany', label: 'Client Company', description: 'The client\'s company name', category: 'client' },
  { key: 'clientPhone', label: 'Client Phone', description: 'The client\'s phone number', category: 'client' },
  { key: 'onboardingStage', label: 'Onboarding Stage', description: 'Current stage in onboarding process', category: 'client' },
  { key: 'clientStatus', label: 'Client Status', description: 'Current client status', category: 'client' },
  
  // User/Freelancer variables
  { key: 'freelancerName', label: 'Your Name', description: 'Your name as the freelancer', category: 'user' },
  { key: 'freelancerEmail', label: 'Your Email', description: 'Your email address', category: 'user' },
  { key: 'businessName', label: 'Your Business Name', description: 'Your business or company name', category: 'user' },
  { key: 'brandName', label: 'Brand Name', description: 'Your brand or company name for headers', category: 'user' },
  { key: 'companyAddress', label: 'Company Address', description: 'Your business address for email footers', category: 'user' },
  { key: 'primaryColor', label: 'Primary Brand Color', description: 'Your primary brand color for styling', category: 'user' },
  { key: 'secondaryColor', label: 'Secondary Brand Color', description: 'Your secondary brand color for styling', category: 'user' },
  
  // Project variables
  { key: 'projectType', label: 'Project Type', description: 'Type of project or service', category: 'project' },
  { key: 'projectTimeline', label: 'Project Timeline', description: 'Estimated project duration', category: 'project' },
  
  // Email structure variables
  { key: 'emailSubject', label: 'Email Subject', description: 'Professional email subject line', category: 'custom' },
  { key: 'preheader', label: 'Preheader Text', description: 'Email preheader preview text (90 chars max)', category: 'custom' },
  { key: 'ctaText', label: 'CTA Button Text', description: 'Call-to-action button text', category: 'custom' },
  { key: 'ctaUrl', label: 'CTA Button URL', description: 'Call-to-action button link URL', category: 'custom' },
  
  // Date/Time variables
  { key: 'currentDate', label: 'Current Date', description: 'Today\'s date', category: 'custom' },
  { key: 'currentYear', label: 'Current Year', description: 'Current year', category: 'custom' },
];

export class TemplateVariableService {
  /**
   * Get all available variables for a given context
   */
  static getAvailableVariables(context: TemplateContext): Record<string, string> {
    const variables: Record<string, string> = {};

    // Client variables
    if (context.client) {
      variables.clientName = context.client.name || '';
      variables.clientEmail = context.client.email || '';
      variables.clientCompany = context.client.company || context.client.name || '';
      variables.clientPhone = context.client.phone || '';
      variables.onboardingStage = context.client.onboardingStage || '';
      variables.clientStatus = context.client.status || '';
    }

    // User variables
    if (context.user) {
      variables.freelancerName = context.user.name || '';
      variables.freelancerEmail = context.user.email || '';
      variables.businessName = context.user.brandSettings?.companyName || context.user.name || '';
      variables.brandName = context.user.brandSettings?.companyName || context.user.name || '';
      variables.companyAddress = context.user.brandSettings?.address || '';
      variables.primaryColor = context.user.brandSettings?.primaryColor || '#2563eb';
      variables.secondaryColor = context.user.brandSettings?.secondaryColor || '#64748b';
    }

    // Project variables
    variables.projectType = context.projectType || context.client?.projectType || '';

    // Email structure variables
    variables.emailSubject = context.customVariables?.emailSubject || `Professional Communication - ${variables.clientName || 'Client'}`;
    variables.preheader = context.customVariables?.preheader || `Message from ${variables.brandName || variables.freelancerName}`;
    variables.ctaText = context.customVariables?.ctaText || 'Reply to this Email';
    variables.ctaUrl = context.customVariables?.ctaUrl || `mailto:${variables.freelancerEmail}`;

    // Date variables
    const now = new Date();
    variables.currentDate = now.toLocaleDateString();
    variables.currentYear = now.getFullYear().toString();

    // Custom variables
    if (context.customVariables) {
      Object.assign(variables, context.customVariables);
    }

    return variables;
  }

  /**
   * Replace all template variables in content with actual values
   */
  static replaceVariables(content: string, context: TemplateContext): string {
    const variables = this.getAvailableVariables(context);
    
    let processedContent = content;

    // Replace {{variableName}} format
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'gi');
      processedContent = processedContent.replace(regex, value);
    });

    // Replace [variable name] format for backward compatibility
    Object.entries(variables).forEach(([key, value]) => {
      // Handle common variations
      const variations = [
        key.toLowerCase(),
        key.replace(/([A-Z])/g, ' $1').toLowerCase().trim(),
        key.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''),
      ];

      variations.forEach(variation => {
        const regex = new RegExp(`\\[\\s*${variation}\\s*\\]`, 'gi');
        processedContent = processedContent.replace(regex, value);
      });
    });

    return processedContent;
  }

  /**
   * Validate template content and return missing variables
   */
  static validateTemplate(content: string, context: TemplateContext): {
    isValid: boolean;
    missingVariables: string[];
    unusedVariables: string[];
  } {
    const availableVariables = this.getAvailableVariables(context);
    const missingVariables: string[] = [];
    const unusedVariables: string[] = [];

    // Find all template variables in content
    const templateVarRegex = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;
    const bracketVarRegex = /\[\s*([^\]]+)\s*\]/g;
    
    const usedVariables = new Set<string>();
    
    // Check {{variable}} format
    let match;
    while ((match = templateVarRegex.exec(content)) !== null) {
      const varName = match[1];
      usedVariables.add(varName);
      if (!availableVariables[varName] && availableVariables[varName] !== '') {
        missingVariables.push(varName);
      }
    }

    // Check [variable] format
    while ((match = bracketVarRegex.exec(content)) !== null) {
      const varName = match[1].toLowerCase().replace(/\\s+/g, '');
      
      // Try to find matching available variable
      const matchingVar = Object.keys(availableVariables).find(key => {
        const keyVariations = [
          key.toLowerCase(),
          key.replace(/([A-Z])/g, ' $1').toLowerCase().trim(),
          key.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''),
        ];
        return keyVariations.includes(varName);
      });

      if (matchingVar) {
        usedVariables.add(matchingVar);
      } else {
        missingVariables.push(varName);
      }
    }

    // Find unused variables
    Object.keys(availableVariables).forEach(varName => {
      if (!usedVariables.has(varName) && availableVariables[varName]) {
        unusedVariables.push(varName);
      }
    });

    return {
      isValid: missingVariables.length === 0,
      missingVariables: [...new Set(missingVariables)],
      unusedVariables
    };
  }

  /**
   * Get template variables by category
   */
  static getVariablesByCategory(category?: string): TemplateVariable[] {
    if (!category) return TEMPLATE_VARIABLES;
    return TEMPLATE_VARIABLES.filter(variable => variable.category === category);
  }

  /**
   * Generate a sample template with placeholders
   */
  static generateSampleTemplate(type: 'welcome' | 'scope' | 'timeline' | 'payment' | 'invoice' | 'follow-up'): string {
    const templates = {
      welcome: `Hi {{clientName}},

Welcome to {{businessName}}! I'm {{freelancerName}}, and I'm excited to work with you on your {{projectType}}.

Thank you for choosing my services. Here's what happens next:

• I'll send you a detailed project scope within 24 hours
• We'll schedule a brief kickoff call to discuss your goals  
• I'll provide you with a project timeline and milestones

I'm committed to delivering exceptional results and keeping you updated throughout the entire process.

Looking forward to working together!

Best regards,
{{freelancerName}}
{{businessName}}`,

      scope: `Hi {{clientName}},

Thank you for choosing to work with me on your {{projectType}}. I've outlined the project scope below to ensure we're aligned on deliverables and expectations.

**Project Objectives:**
• Create a comprehensive {{projectType}} solution for {{clientCompany}}
• Ensure all deliverables meet your business requirements
• Provide ongoing support during the implementation phase

**What You'll Receive:**
• Detailed project documentation
• All source files and assets
• 30 days of post-launch support

**Project Timeline:**
• Week 1: Discovery and planning phase
• Week 2-3: Development and implementation
• Week 4: Testing, revisions, and final delivery

Please review and let me know if you have any questions.

Best regards,
{{freelancerName}}`,

      timeline: `Hi {{clientName}},

Here's the detailed timeline for your {{projectType}}. This schedule ensures we deliver quality results on time.

**Project Schedule:**

📅 **Week 1 - Discovery & Planning**
• Initial consultation and requirements gathering
• Project strategy and approach finalization
• Deliverable: Project plan and initial concepts

📅 **Week 2-3 - Development Phase** 
• Core development and implementation
• Regular progress updates and check-ins
• Deliverable: First draft/prototype for your review

📅 **Week 4 - Refinement & Delivery**
• Revisions based on your feedback
• Final testing and quality assurance
• Deliverable: Complete {{projectType}} solution

**Important Notes:**
• Weekly progress updates every Friday
• 2-3 business days for feedback at each milestone
• Final delivery includes all source files and documentation

Best regards,
{{freelancerName}}`,

      payment: `Hi {{clientName}},

Thank you for choosing my services for your {{projectType}}. Below are the payment terms and schedule for our project.

**Payment Schedule:**
• 50% deposit required to begin work
• 50% final payment due upon project completion
• All payments due within 5 business days of invoice date

**Accepted Payment Methods:**
• Bank transfer (preferred)
• PayPal
• Credit/Debit cards

**Terms:**
• Work begins after deposit confirmation
• Final deliverables released upon full payment
• Minor revisions included; major changes may incur additional fees

I believe in transparent, fair pricing with no hidden costs.

Looking forward to working together!

Best regards,
{{freelancerName}}`,

      invoice: `Hi {{clientName}},

Thank you for your business! Please find your invoice for the {{projectType}} project below.

**Invoice Details:**
• Project: {{projectType}} for {{clientCompany}}
• Invoice Date: {{currentDate}}
• Payment Due: Within 5 business days

**Services Provided:**
• {{projectType}} Development: $[Amount]
• Project Management: $[Amount]
• Post-launch Support: $[Amount]

**Total Due:** $[Final Amount]

**Next Steps:**
Please process payment by the due date. Once payment is confirmed, I'll send all final project deliverables.

Thank you for choosing {{businessName}}!

Best regards,
{{freelancerName}}`,

      'follow-up': `Hi {{clientName}},

I hope you're doing well! I wanted to follow up on your {{projectType}} project and see how things are progressing.

**Quick Check-in:**
• How has the {{projectType}} been performing for you?
• Are you seeing the results you were hoping for?
• Do you need any adjustments or additional support?

**Available Support:**
I'm here to help if you need any updates, modifications, or have questions about our work together.

**Future Projects:**
If you're planning any related projects or need ongoing support, I'd love to discuss how I can help you achieve your goals.

Feel free to reach out anytime!

Best regards,
{{freelancerName}}
{{businessName}}`
    };

    return templates[type] || templates.welcome;
  }
}