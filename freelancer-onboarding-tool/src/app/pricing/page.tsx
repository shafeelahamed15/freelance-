'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SuperDesignThemeToggle } from '@/components/SuperDesignThemeSystem';
import { 
  Check, 
  X, 
  Briefcase,
  Star,
  Users,
  FileText,
  Mail,
  Zap,
  Crown,
  Building,
  Shield,
  Headphones,
  ArrowRight
} from 'lucide-react';

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for beginners',
      monthlyPrice: 0,
      yearlyPrice: 0,
      tag: 'Forever free',
      tagColor: 'text-green-500',
      buttonClass: 'btn-secondary',
      buttonText: 'Get Started Free',
      popular: false,
      features: [
        { name: 'Up to 3 clients', included: true },
        { name: '5 invoices per month', included: true },
        { name: 'Basic email templates', included: true },
        { name: 'AI template generation', included: false },
        { name: 'Analytics dashboard', included: false },
        { name: 'Priority support', included: false }
      ]
    },
    {
      name: 'Professional',
      description: 'For growing freelancers',
      monthlyPrice: 19,
      yearlyPrice: 15,
      tag: 'Most Popular',
      tagColor: 'text-white',
      buttonClass: 'btn-primary',
      buttonText: 'Start Professional',
      popular: true,
      features: [
        { name: 'Up to 15 clients', included: true },
        { name: 'Unlimited invoices', included: true },
        { name: 'AI template generation', included: true },
        { name: 'Analytics dashboard', included: true },
        { name: 'Email automation', included: true },
        { name: 'Priority support', included: false }
      ]
    },
    {
      name: 'Business',
      description: 'For agencies & teams',
      monthlyPrice: 39,
      yearlyPrice: 31,
      tag: 'Team Ready',
      tagColor: 'text-white',
      buttonClass: 'btn-primary',
      buttonText: 'Start Business',
      popular: false,
      features: [
        { name: 'Up to 50 clients', included: true },
        { name: 'Unlimited invoices', included: true },
        { name: 'AI template generation', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Team collaboration', included: true },
        { name: 'Priority support', included: true }
      ]
    },
    {
      name: 'Enterprise',
      description: 'For large organizations',
      monthlyPrice: 99,
      yearlyPrice: 79,
      tag: 'Full Power',
      tagColor: 'text-white',
      buttonClass: 'btn-primary',
      buttonText: 'Contact Sales',
      popular: false,
      features: [
        { name: 'Unlimited clients', included: true },
        { name: 'Unlimited invoices', included: true },
        { name: 'Custom AI training', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'White-label options', included: true },
        { name: 'Dedicated support', included: true }
      ]
    }
  ];

  const faqs = [
    {
      question: 'How does the free plan work?',
      answer: 'Our Starter plan is completely free forever. You can manage up to 3 clients and send 5 invoices per month with basic features. No credit card required.'
    },
    {
      question: 'Can I upgrade or downgrade anytime?',
      answer: 'Yes! You can change your plan anytime. When upgrading, you\'ll be charged the prorated amount. When downgrading, the change takes effect at your next billing cycle.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for Enterprise plans.'
    },
    {
      question: 'Is there a money-back guarantee?',
      answer: 'Yes! We offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied, contact us for a full refund.'
    },
    {
      question: 'Do you offer discounts for nonprofits?',
      answer: 'Yes! We provide 50% discounts for verified nonprofit organizations and educational institutions. Contact our support team to learn more.'
    }
  ];

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-400 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-lg gradient-text">ClientHandle</span>
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/dashboard" className="nav-link">Dashboard</Link>
                <Link href="/clients" className="nav-link">Clients</Link>
                <Link href="/invoices" className="nav-link">Invoices</Link>
                <Link href="/pricing" className="nav-link active">Pricing</Link>
              </div>
            </div>
            
            {/* Right side */}
            <div className="flex items-center space-x-4">
              <SuperDesignThemeToggle />
              <Link href="/auth/login">
                <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  <Users className="w-5 h-5" />
                </button>
              </Link>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Choose Your <span className="gradient-text">Perfect Plan</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              Scale your freelance business with powerful client management tools. 
              Start free and upgrade as you grow.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-12">
              <span className="text-gray-600 dark:text-gray-400 mr-3">Monthly</span>
              <div className="relative">
                <input 
                  type="checkbox" 
                  id="billingToggle" 
                  className="sr-only" 
                  checked={isYearly}
                  onChange={(e) => setIsYearly(e.target.checked)}
                />
                <label htmlFor="billingToggle" className="flex items-center cursor-pointer">
                  <div className="relative">
                    <div className="block bg-gray-300 dark:bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${
                      isYearly ? 'translate-x-6 bg-green-400' : ''
                    }`}></div>
                  </div>
                </label>
              </div>
              <span className="text-gray-600 dark:text-gray-400 ml-3">Yearly</span>
              <span className="ml-3 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-sm font-medium rounded-full">
                Save 20%
              </span>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-8">
              
              {plans.map((plan, index) => (
                <div key={plan.name} className={`pricing-card bg-white dark:bg-gray-800 rounded-xl p-8 transition-all duration-300 shadow-sm hover:shadow-lg ${
                  plan.popular 
                    ? 'border-2 border-green-400 relative' 
                    : 'border border-gray-200 dark:border-gray-700'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="popular-badge bg-green-400 text-gray-900 px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                        <Star className="w-3 h-3" />
                        <span>{plan.tag}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{plan.description}</p>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                        ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 ml-1">/month</span>
                    </div>
                    {!plan.popular ? (
                      <p className={plan.tagColor + ' text-sm mt-1'}>{plan.tag}</p>
                    ) : (
                      isYearly && (
                        <p className="text-green-500 text-sm mt-1">
                          ${(plan.monthlyPrice - plan.yearlyPrice) * 12} saved yearly
                        </p>
                      )
                    )}
                  </div>
                  
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className={`flex items-center gap-3 ${
                        feature.included 
                          ? 'text-gray-700 dark:text-gray-300' 
                          : 'text-gray-500 dark:text-gray-500'
                      }`}>
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                        <span>{feature.name}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href="/auth/register">
                    <button className={`w-full ${plan.buttonClass} py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2`}>
                      <span>{plan.buttonText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Everything You Need to <span className="gradient-text">Succeed</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Powerful features to streamline your freelance business
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
              {[
                {
                  icon: Users,
                  title: 'Client Management',
                  description: 'Organize client information, track projects, and manage relationships in one place.'
                },
                {
                  icon: FileText,
                  title: 'Smart Invoicing',
                  description: 'Create professional invoices with automated reminders and payment tracking.'
                },
                {
                  icon: Zap,
                  title: 'AI Templates',
                  description: 'Generate professional emails and documents with our AI-powered system.'
                },
                {
                  icon: Mail,
                  title: 'Email Automation',
                  description: 'Set up automated workflows for onboarding, follow-ups, and project updates.'
                },
                {
                  icon: Shield,
                  title: 'Secure & Reliable',
                  description: 'Your data is protected with enterprise-grade security and regular backups.'
                },
                {
                  icon: Headphones,
                  title: 'Expert Support',
                  description: 'Get help when you need it with our responsive customer support team.'
                }
              ].map((feature, index) => (
                <div key={index} className="feature-card bg-gray-50 dark:bg-gray-900 p-8 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Everything you need to know about ClientHandle
              </p>
            </div>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="card border border-gray-200 dark:border-gray-700">
                  <button
                    className="w-full p-6 text-left flex items-center justify-between"
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{faq.question}</h3>
                    <div className={`transform transition-transform duration-200 ${
                      openFaqIndex === index ? 'rotate-45' : ''
                    }`}>
                      <div className="w-4 h-4 relative">
                        <div className="absolute inset-0 w-0.5 bg-gray-400 left-1/2 transform -translate-x-1/2"></div>
                        <div className="absolute inset-0 h-0.5 bg-gray-400 top-1/2 transform -translate-y-1/2"></div>
                      </div>
                    </div>
                  </button>
                  {openFaqIndex === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Ready to <span className="gradient-text">Transform</span> Your Business?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of freelancers who trust ClientHandle to manage their client relationships and grow their business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <button className="btn-primary px-8 py-4 text-lg font-semibold rounded-lg flex items-center space-x-2">
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/auth/login">
                <button className="btn-secondary px-8 py-4 text-lg font-semibold rounded-lg">
                  View Demo
                </button>
              </Link>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}