'use client';

import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import type { Client, Invoice, InvoiceItem } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { FirestoreService } from '@/lib/firestore';

interface CreateInvoiceModalProps {
  onClose: () => void;
  onSave: (invoice: Invoice) => void;
  clients: Client[];
  preSelectedClient?: Client;
}

export function CreateInvoiceModal({ onClose, onSave, clients, preSelectedClient }: CreateInvoiceModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientId: preSelectedClient?.id || '',
    title: preSelectedClient ? `${preSelectedClient.projectType || 'Services'} for ${preSelectedClient.company || preSelectedClient.name}` : '',
    description: '',
    dueDate: '',
    taxRate: 0,
    discount: 0,
    currency: 'USD'
  });
  const [items, setItems] = useState<Omit<InvoiceItem, 'id'>[]>([
    { description: '', quantity: 1, rate: 0, amount: 0 }
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const clientDropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target as Node)) {
        setIsClientDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get selected client for display
  const getSelectedClient = () => {
    return clients.find(client => client.id === formData.clientId);
  };

  // Handle client selection
  const handleClientSelect = (clientId: string) => {
    setFormData(prev => ({ ...prev, clientId }));
    setIsClientDropdownOpen(false);
  };

  // Currency formatting function
  const formatCurrency = (amount: number, currency: string = formData.currency) => {
    const currencySymbols = {
      USD: '$',
      INR: '₹',
      EUR: '€',
      GBP: '£',
      CAD: '$'
    };
    
    const symbol = currencySymbols[currency as keyof typeof currencySymbols] || '$';
    
    // For INR, show without decimals for whole numbers, with decimals for fractional amounts
    if (currency === 'INR') {
      return amount % 1 === 0 ? `${symbol}${amount.toLocaleString('en-IN')}` : `${symbol}${amount.toFixed(2)}`;
    }
    
    return `${symbol}${amount.toFixed(2)}`;
  };

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = (subtotal - formData.discount) * (formData.taxRate / 100);
  const total = subtotal - formData.discount + taxAmount;

  // Update item amount when quantity or rate changes
  const updateItem = (index: number, field: keyof Omit<InvoiceItem, 'id'>, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculate amount for this item
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}${day}-${random}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId) {
      newErrors.clientId = 'Client is required';
    }
    if (!formData.title) {
      newErrors.title = 'Invoice title is required';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    if (items.length === 0) {
      newErrors.items = 'At least one item is required';
    }
    if (items.some(item => !item.description || item.quantity <= 0 || item.rate < 0)) {
      newErrors.items = 'All items must have description, quantity > 0, and rate ≥ 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!validateForm()) return;

    setLoading(true);
    try {
      const invoiceData = {
        clientId: formData.clientId,
        userId: user.id,
        invoiceNumber: generateInvoiceNumber(),
        title: formData.title,
        description: formData.description,
        items: items.map((item, index) => ({
          ...item,
          id: `item-${index + 1}`
        })),
        subtotal,
        taxRate: formData.taxRate,
        taxAmount,
        discount: formData.discount,
        total,
        currency: formData.currency,
        status: 'draft' as const,
        dueDate: new Date(formData.dueDate),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const invoiceId = await FirestoreService.create<Invoice>('invoices', invoiceData);
      const newInvoice = { id: invoiceId, ...invoiceData };
      
      onSave(newInvoice);
      onClose();
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'taxRate' || name === 'discount' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-4 text-center">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-6 pt-6 pb-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Create New Invoice</h3>
                  {preSelectedClient && (
                    <p className="text-sm text-gray-700 mt-1 font-medium">
                      For {preSelectedClient.name} {preSelectedClient.company && `(${preSelectedClient.company})`}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Client Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Client *
                  </label>
                  <div className="relative" ref={clientDropdownRef}>
                    <button
                      type="button"
                      onClick={() => !preSelectedClient && setIsClientDropdownOpen(!isClientDropdownOpen)}
                      disabled={!!preSelectedClient}
                      className={`w-full px-3 py-2 text-left text-gray-900 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between ${
                        errors.clientId ? 'border-red-500' : 'border-gray-300'
                      } ${preSelectedClient ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400'}`}
                    >
                      <span className={getSelectedClient() ? 'text-gray-900' : 'text-gray-500'}>
                        {getSelectedClient() 
                          ? `${getSelectedClient()!.name} ${getSelectedClient()!.company ? `(${getSelectedClient()!.company})` : ''}` 
                          : 'Select a client...'
                        }
                      </span>
                      <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform ${isClientDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isClientDropdownOpen && !preSelectedClient && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {clients.length === 0 ? (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            No clients found - Add clients in the Clients page first
                          </div>
                        ) : (
                          <>
                            <div 
                              className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-500 border-b border-gray-100"
                              onClick={() => handleClientSelect('')}
                            >
                              Select a client...
                            </div>
                            {clients.map((client) => (
                              <div
                                key={client.id}
                                className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-900 flex items-center justify-between"
                                onClick={() => handleClientSelect(client.id)}
                              >
                                <span>
                                  <span className="font-medium">{client.name}</span>
                                  {client.company && <span className="text-gray-600 ml-1">({client.company})</span>}
                                </span>
                                <span className="text-xs text-gray-500">{client.email}</span>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  {errors.clientId && (
                    <p className="mt-1 text-xs text-red-700 font-medium bg-red-50 px-2 py-1 rounded">{errors.clientId}</p>
                  )}
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-gray-900 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.dueDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.dueDate && (
                    <p className="mt-1 text-xs text-red-700 font-medium bg-red-50 px-2 py-1 rounded">{errors.dueDate}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Invoice Title */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Invoice Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Website Development Services"
                    className={`w-full px-3 py-2 text-gray-900 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-red-700 font-medium bg-red-50 px-2 py-1 rounded">{errors.title}</p>
                  )}
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Additional notes or description for this invoice..."
                  className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
                />
              </div>

              {/* Invoice Items */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-bold text-gray-800">
                    Invoice Items *
                  </label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    <PlusIcon className="h-3 w-3 mr-1" />
                    Add Item
                  </button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-20">
                          Qty
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-24">
                          Rate
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-24">
                          Amount
                        </th>
                        <th className="px-4 py-3 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => updateItem(index, 'description', e.target.value)}
                              placeholder="Item description..."
                              className="w-full px-2 py-1 text-sm text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                              min="1"
                              placeholder="1"
                              className="w-full px-2 py-1 text-sm text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.rate}
                              onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              className="w-full px-2 py-1 text-sm text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-bold text-gray-900">
                              {formatCurrency(item.amount)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="text-red-400 hover:text-red-600"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {errors.items && (
                  <p className="mt-1 text-xs text-red-700 font-medium bg-red-50 px-2 py-1 rounded">{errors.items}</p>
                )}
              </div>

              {/* Totals Section */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {/* Tax Rate */}
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-2">
                        Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        name="taxRate"
                        value={formData.taxRate}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="0"
                        className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
                      />
                    </div>

                    {/* Discount */}
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-2">
                        Discount ({formData.currency === 'USD' || formData.currency === 'CAD' ? '$' : formData.currency === 'INR' ? '₹' : formData.currency === 'EUR' ? '€' : '£'})
                      </label>
                      <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Totals Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-base font-bold text-gray-900 mb-3">Invoice Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">Subtotal:</span>
                        <span className="font-bold text-gray-900">{formatCurrency(subtotal)}</span>
                      </div>
                      {formData.discount > 0 && (
                        <div className="flex justify-between text-green-700">
                          <span className="font-medium">Discount:</span>
                          <span className="font-bold">-{formatCurrency(formData.discount)}</span>
                        </div>
                      )}
                      {formData.taxRate > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-700 font-medium">Tax ({formData.taxRate}%):</span>
                          <span className="font-bold text-gray-900">{formatCurrency(taxAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="font-bold text-gray-900 text-base">Total:</span>
                        <span className="font-bold text-xl text-blue-600">{formatCurrency(total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  'Create Invoice'
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}