'use client';

import React from 'react';
import type { Invoice, Client, User } from '@/types';

interface InvoicePDFTemplateProps {
  invoice: Invoice;
  client: Client;
  user: User;
  className?: string;
}

export function InvoicePDFTemplate({ invoice, client, user, className = '' }: InvoicePDFTemplateProps) {
  // Debug logging
  console.log('InvoicePDFTemplate received user data:', {
    name: user.name,
    email: user.email,
    brandSettings: user.brandSettings
  });
  // Currency formatting function
  const formatCurrency = (amount: number, currency: string = invoice.currency) => {
    const currencyConfig = {
      USD: { locale: 'en-US', currency: 'USD' },
      INR: { locale: 'en-IN', currency: 'INR' },
      EUR: { locale: 'de-DE', currency: 'EUR' },
      GBP: { locale: 'en-GB', currency: 'GBP' },
      CAD: { locale: 'en-CA', currency: 'CAD' }
    };
    
    const config = currencyConfig[currency as keyof typeof currencyConfig] || currencyConfig.USD;
    
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency,
      ...(currency === 'INR' && amount % 1 === 0 ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : {})
    }).format(amount);
  };

  const formatDate = (date: Date | string | { toDate?: () => Date; seconds?: number } | null | undefined) => {
    if (!date) return 'N/A';
    
    let d: Date;
    if (date instanceof Date) {
      d = date;
    } else if (typeof date === 'string') {
      d = new Date(date);
    } else if (date.toDate && typeof date.toDate === 'function') {
      // Handle Firestore Timestamp
      d = date.toDate();
    } else if (date.seconds) {
      // Handle Firestore Timestamp object
      d = new Date(date.seconds * 1000);
    } else {
      d = new Date(date as string | number | Date);
    }
    
    // Check if date is valid
    if (isNaN(d.getTime())) {
      return 'Invalid Date';
    }
    
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'sent': return 'text-blue-600';
      case 'overdue': return 'text-red-600';
      case 'draft': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div 
      className={`${className}`} 
      style={{ 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#ffffff',
        padding: '32px',
        maxWidth: '1024px',
        margin: '0 auto',
        color: '#000000'
      }}>
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex-1">
          {/* Company Name */}
          <div className="mb-4">
            <h1 style={{ 
              fontSize: '30px', 
              fontWeight: 'bold', 
              color: user.brandSettings?.primaryColor || '#2563eb',
              margin: '0'
            }}>
              {user.brandSettings?.companyName || user.name}
            </h1>
          </div>
          {user.brandSettings?.tagline && (
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>{user.brandSettings.tagline}</p>
          )}
          {user.brandSettings?.address && (
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              <p>{user.brandSettings.address}</p>
            </div>
          )}
          <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
            <p>Email: {user.email}</p>
            {user.brandSettings?.website && <p>Website: {user.brandSettings.website}</p>}
          </div>
        </div>
        
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">INVOICE</h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">Invoice #:</span> {invoice.invoiceNumber}</p>
            <p><span className="font-medium">Date:</span> {formatDate(invoice.createdAt)}</p>
            <p><span className="font-medium">Due Date:</span> {formatDate(invoice.dueDate)}</p>
            <p className={`font-medium ${getStatusColor(invoice.status)}`}>
              Status: {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </p>
          </div>
        </div>
      </div>

      {/* Bill To Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ color: user.brandSettings?.secondaryColor || '#64748b' }}>
          Bill To:
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-medium text-gray-900">{client.name}</p>
          {client.company && <p className="text-gray-600">{client.company}</p>}
          <p className="text-gray-600">{client.email}</p>
          {client.phone && <p className="text-gray-600">{client.phone}</p>}
        </div>
      </div>

      {/* Invoice Details */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ color: user.brandSettings?.secondaryColor || '#64748b' }}>
          Project: {invoice.title}
        </h3>
        {invoice.description && (
          <p className="text-gray-600 mb-4">{invoice.description}</p>
        )}
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ backgroundColor: user.brandSettings?.primaryColor + '10' || '#2563eb10' }}>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Description</th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900 w-20">Qty</th>
              <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900 w-32">Rate</th>
              <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900 w-32">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="border border-gray-300 px-4 py-3 text-gray-900">{item.description}</td>
                <td className="border border-gray-300 px-4 py-3 text-center text-gray-900">{item.quantity}</td>
                <td className="border border-gray-300 px-4 py-3 text-right text-gray-900">{formatCurrency(item.rate)}</td>
                <td className="border border-gray-300 px-4 py-3 text-right font-medium text-gray-900">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="space-y-2">
            <div className="flex justify-between py-2">
              <span className="font-medium text-gray-700">Subtotal:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(invoice.subtotal)}</span>
            </div>
            
            {invoice.discount > 0 && (
              <div className="flex justify-between py-2 text-green-600">
                <span className="font-medium">Discount:</span>
                <span className="font-semibold">-{formatCurrency(invoice.discount)}</span>
              </div>
            )}
            
            {invoice.taxRate > 0 && (
              <div className="flex justify-between py-2">
                <span className="font-medium text-gray-700">Tax ({invoice.taxRate}%):</span>
                <span className="font-semibold text-gray-900">{formatCurrency(invoice.taxAmount)}</span>
              </div>
            )}
            
            <div className="border-t-2 border-gray-300 pt-2">
              <div className="flex justify-between py-2">
                <span className="text-lg font-bold text-gray-900">Total:</span>
                <span className="text-lg font-bold" style={{ color: user.brandSettings?.primaryColor || '#2563eb' }}>
                  {formatCurrency(invoice.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3" style={{ color: user.brandSettings?.secondaryColor || '#64748b' }}>
          Payment Information
        </h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p><span className="font-medium">Due Date:</span> {formatDate(invoice.dueDate)}</p>
          <p><span className="font-medium">Amount Due:</span> <span className="font-bold text-gray-900">{formatCurrency(invoice.total)}</span></p>
          {invoice.paymentLink && (
            <p><span className="font-medium">Payment Link:</span> {invoice.paymentLink}</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-2">
          Thank you for your business!
        </p>
        <p className="text-xs text-gray-500">
          Invoice generated on {formatDate(new Date())} by {user.brandSettings?.companyName || user.name}
        </p>
        {user.brandSettings?.website && (
          <p className="text-xs text-gray-500 mt-1">
            {user.brandSettings.website}
          </p>
        )}
      </div>
    </div>
  );
}