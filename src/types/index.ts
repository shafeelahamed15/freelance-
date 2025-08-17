export interface User {
  id: string;
  email: string;
  name: string;
  brandSettings: BrandSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandSettings {
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  companyName: string;
  tagline?: string;
  website?: string;
  address?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  projectType?: string;
  status: ClientStatus;
  onboardingStage: OnboardingStage;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ClientStatus = 'new' | 'onboarding' | 'active' | 'completed' | 'inactive';
export type OnboardingStage = 'welcome' | 'scope' | 'timeline' | 'payment' | 'completed';

export interface OnboardingFlow {
  id: string;
  clientId: string;
  userId: string;
  steps: OnboardingStep[];
  currentStep: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OnboardingStep {
  id: string;
  type: 'welcome' | 'scope' | 'timeline' | 'payment' | 'custom';
  title: string;
  content: string;
  completed: boolean;
  completedAt?: Date;
  emailSent: boolean;
  emailSentAt?: Date;
}

export interface Invoice {
  id: string;
  clientId: string;
  userId: string;
  invoiceNumber: string;
  title: string;
  description?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  currency: string;
  status: InvoiceStatus;
  dueDate: Date;
  paidAt?: Date;
  paymentLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Template {
  id: string;
  userId: string;
  name: string;
  type: 'onboarding' | 'invoice' | 'welcome' | 'scope' | 'timeline' | 'payment' | 'follow-up' | 'custom';
  category?: string;
  content: string;
  variables: string[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailLog {
  id: string;
  clientId: string;
  userId: string;
  type: 'onboarding' | 'invoice' | 'reminder';
  subject: string;
  content: string;
  sentAt: Date;
  opened: boolean;
  openedAt?: Date;
}