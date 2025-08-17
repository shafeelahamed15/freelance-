'use client';

import React from 'react';
import type { Invoice, Client, User } from '@/types';

interface SimplePDFTemplateProps {
  invoice: Invoice;
  client: Client;
  user: User;
}

export function SimplePDFTemplate({ invoice, client, user }: SimplePDFTemplateProps) {
  // Currency formatting function
  const formatCurrency = (amount: number, currency: string = invoice.currency) => {
    const currencySymbols = {
      USD: '$',
      INR: '₹',
      EUR: '€',
      GBP: '£',
      CAD: '$'
    };
    
    const symbol = currencySymbols[currency as keyof typeof currencySymbols] || '$';
    
    if (currency === 'INR') {
      return amount % 1 === 0 ? `${symbol}${amount.toLocaleString('en-IN')}` : `${symbol}${amount.toFixed(2)}`;
    }
    
    return `${symbol}${amount.toFixed(2)}`;
  };

  const formatDate = (date: Date | string | { toDate?: () => Date; seconds?: number } | null | undefined) => {
    if (!date) return 'N/A';
    
    let d: Date;
    if (date instanceof Date) {
      d = date;
    } else if (typeof date === 'string') {
      d = new Date(date);
    } else if (date.toDate && typeof date.toDate === 'function') {
      d = date.toDate();
    } else if (date.seconds) {
      d = new Date(date.seconds * 1000);
    } else {
      d = new Date(date as string | number | Date);
    }
    
    if (isNaN(d.getTime())) {
      return 'Invalid Date';
    }
    
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const baseStyle = {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#ffffff',
    color: '#000000',
    padding: '40px',
    width: '100%',
    minHeight: '800px'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '40px',
    borderBottom: '2px solid #e5e5e5',
    paddingBottom: '20px'
  };

  const companyTitleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: user.brandSettings?.primaryColor || '#2563eb',
    marginBottom: '8px'
  };

  const invoiceTitleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: '16px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginBottom: '30px'
  };

  const thStyle = {
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    padding: '12px',
    textAlign: 'left' as const,
    fontWeight: 'bold'
  };

  const tdStyle = {
    border: '1px solid #dee2e6',
    padding: '10px'
  };

  return (
    <div style={baseStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          {/* Company Info */}
          <div>
            <h1 style={companyTitleStyle}>
              {user.brandSettings?.companyName || user.name}
            </h1>
            <div style={{ fontSize: '14px', color: '#666666' }}>
              <p>Email: {user.email}</p>
              {user.brandSettings?.address && <p>{user.brandSettings.address}</p>}
              {user.brandSettings?.website && <p>{user.brandSettings.website}</p>}
            </div>
          </div>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <h2 style={invoiceTitleStyle}>INVOICE</h2>
          <div style={{ fontSize: '14px', color: '#666666' }}>
            <p><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
            <p><strong>Date:</strong> {formatDate(invoice.createdAt)}</p>
            <p><strong>Due Date:</strong> {formatDate(invoice.dueDate)}</p>
            <p><strong>Status:</strong> {invoice.status.toUpperCase()}</p>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          marginBottom: '16px',
          color: user.brandSettings?.secondaryColor || '#64748b'
        }}>
          Bill To:
        </h3>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '16px', 
          borderRadius: '4px',
          border: '1px solid #e5e5e5'
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>{client.name}</p>
          {client.company && <p style={{ marginBottom: '4px' }}>{client.company}</p>}
          <p style={{ marginBottom: '4px' }}>{client.email}</p>
          {client.phone && <p style={{ marginBottom: '4px' }}>{client.phone}</p>}
        </div>
      </div>

      {/* Project Title */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold',
          color: user.brandSettings?.secondaryColor || '#64748b'
        }}>
          Project: {invoice.title}
        </h3>
        {invoice.description && (
          <p style={{ fontSize: '14px', color: '#666666', marginTop: '8px' }}>
            {invoice.description}
          </p>
        )}
      </div>

      {/* Items Table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Description</th>
            <th style={{...thStyle, textAlign: 'center', width: '80px'}}>Qty</th>
            <th style={{...thStyle, textAlign: 'right', width: '120px'}}>Rate</th>
            <th style={{...thStyle, textAlign: 'right', width: '120px'}}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa' }}>
              <td style={tdStyle}>{item.description}</td>
              <td style={{...tdStyle, textAlign: 'center'}}>{item.quantity}</td>
              <td style={{...tdStyle, textAlign: 'right'}}>{formatCurrency(item.rate)}</td>
              <td style={{...tdStyle, textAlign: 'right', fontWeight: 'bold'}}>
                {formatCurrency(item.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
        <div style={{ width: '300px' }}>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '4px',
            border: '1px solid #e5e5e5'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '8px',
              fontSize: '14px'
            }}>
              <span><strong>Subtotal:</strong></span>
              <span><strong>{formatCurrency(invoice.subtotal)}</strong></span>
            </div>
            
            {invoice.discount > 0 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '8px',
                fontSize: '14px',
                color: '#059669'
              }}>
                <span><strong>Discount:</strong></span>
                <span><strong>-{formatCurrency(invoice.discount)}</strong></span>
              </div>
            )}
            
            {invoice.taxRate > 0 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '8px',
                fontSize: '14px'
              }}>
                <span><strong>Tax ({invoice.taxRate}%):</strong></span>
                <span><strong>{formatCurrency(invoice.taxAmount)}</strong></span>
              </div>
            )}
            
            <div style={{ 
              borderTop: '2px solid #e5e5e5', 
              paddingTop: '12px', 
              marginTop: '12px' 
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '18px'
              }}>
                <span><strong>Total:</strong></span>
                <span style={{ 
                  fontWeight: 'bold',
                  color: user.brandSettings?.primaryColor || '#2563eb'
                }}>
                  {formatCurrency(invoice.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        paddingTop: '30px', 
        borderTop: '1px solid #e5e5e5',
        fontSize: '12px',
        color: '#666666'
      }}>
        <p style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
          Thank you for your business!
        </p>
        <p style={{ marginBottom: '4px' }}>
          Invoice generated on {formatDate(new Date())} by {user.brandSettings?.companyName || user.name}
        </p>
        {user.brandSettings?.website && (
          <p>{user.brandSettings.website}</p>
        )}
      </div>
    </div>
  );
}