'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';
import Link from 'next/link';
import {
  Home,
  Users,
  Receipt,
  Mail,
  Settings,
  Wrench,
  Menu,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Plus,
  Filter,
  Download,
  Send,
  Trash2,
  FileText,
  LayoutDashboard,
  Folder,
  Eye,
  Edit,
  MoreVertical,
  Copy
} from 'lucide-react';
import type { Invoice, Client } from '@/types';

interface InvoiceData {
  id: string;
  client: string;
  clientEmail: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
}

const invoices: InvoiceData[] = [
  { id: 'INV-2024-024', client: 'Acme Corp', clientEmail: 'john@acmecorp.com', date: '2024-01-15', dueDate: '2024-02-15', amount: 2500.00, status: 'paid' },
  { id: 'INV-2024-023', client: 'TechStart Inc', clientEmail: 'sarah@techstart.io', date: '2024-01-12', dueDate: '2024-02-12', amount: 1800.00, status: 'pending' },
  { id: 'INV-2024-022', client: 'BlueCorp Ltd', clientEmail: 'mike@bluecorp.com', date: '2024-01-10', dueDate: '2024-01-25', amount: 3200.00, status: 'overdue' },
  { id: 'INV-2024-021', client: 'GreenTech Solutions', clientEmail: 'emma@greentech.co', date: '2024-01-08', dueDate: '2024-02-08', amount: 1500.00, status: 'paid' },
  { id: 'INV-2024-020', client: 'RedTech Ventures', clientEmail: 'alex@redtech.com', date: '2024-01-05', dueDate: '2024-02-05', amount: 2100.00, status: 'pending' },
  { id: 'INV-2024-019', client: 'Acme Corp', clientEmail: 'john@acmecorp.com', date: '2024-01-03', dueDate: '2024-02-03', amount: 2800.00, status: 'paid' },
  { id: 'INV-2024-018', client: 'TechStart Inc', clientEmail: 'sarah@techstart.io', date: '2024-01-01', dueDate: '2024-01-15', amount: 1900.00, status: 'overdue' },
  { id: 'INV-2024-017', client: 'BlueCorp Ltd', clientEmail: 'mike@bluecorp.com', date: '2023-12-28', dueDate: '2024-01-28', amount: 2600.00, status: 'paid' },
  { id: 'INV-2024-016', client: 'GreenTech Solutions', clientEmail: 'emma@greentech.co', date: '2023-12-25', dueDate: '2024-01-25', amount: 1700.00, status: 'draft' },
  { id: 'INV-2024-015', client: 'RedTech Ventures', clientEmail: 'alex@redtech.com', date: '2023-12-22', dueDate: '2024-01-22', amount: 2300.00, status: 'pending' }
];

const sidebarLinks = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/clients', icon: Users, label: 'Clients', badge: '42' },
  { href: '/invoices', icon: Receipt, label: 'Invoices', badge: '8', active: true },
  { href: '/templates', icon: Mail, label: 'Templates' }
];

const sidebarBottomLinks = [
  { href: '/settings', icon: Settings, label: 'Settings' },
  { href: '/admin', icon: Wrench, label: 'Admin' }
];

export default function InvoicesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  
  const handleSelectInvoice = (invoiceId: string) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId) 
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const handleSelectAll = () => {
    setSelectedInvoices(
      selectedInvoices.length === invoices.length 
        ? [] 
        : invoices.map(invoice => invoice.id)
    );
  };

  const toggleDropdown = (invoiceId: string) => {
    setDropdownOpen(dropdownOpen === invoiceId ? null : invoiceId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
            <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
            <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
            Pending
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
            Overdue
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
            Draft
          </span>
        );
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = searchTerm === '' || 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || invoice.status === statusFilter;
    const matchesClient = clientFilter === '' || invoice.client === clientFilter;
    
    return matchesSearch && matchesStatus && matchesClient;
  });


  return (
    <AuthGuard>
      <div className="min-h-screen" style={{ backgroundColor: 'oklch(var(--background))' }}>
        {/* Navigation Header */}
        <header className="nav sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg transition-colors"
              style={{ backgroundColor: 'oklch(var(--muted))' }}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                   style={{ backgroundColor: 'oklch(var(--primary))' }}>
                <Users className="w-4 h-4" style={{ color: 'oklch(var(--primary-foreground))' }} />
              </div>
              <h1 className="text-xl font-semibold" style={{ color: 'oklch(var(--foreground))' }}>
                ClientHandle
              </h1>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
                      style={{ color: 'oklch(var(--muted-foreground))' }} />
              <input 
                type="text" 
                placeholder="Search invoices... (⌘K)"
                className="input w-full pl-10 pr-4 py-2"
              />
            </div>
          </div>
          
          {/* Header Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg relative transition-colors hover:bg-gray-100">
              <Bell className="w-5 h-5" style={{ color: 'oklch(var(--muted-foreground))' }} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </button>
            
            <div className="flex items-center gap-3">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format" 
                alt="Profile" 
                className="w-8 h-8 rounded-full"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-medium" style={{ color: 'oklch(var(--foreground))' }}>John Smith</p>
                <p className="text-xs" style={{ color: 'oklch(var(--muted-foreground))' }}>Admin</p>
              </div>
              <ChevronDown className="w-4 h-4" style={{ color: 'oklch(var(--muted-foreground))' }} />
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className={`w-64 sidebar min-h-screen transform transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:relative z-40`}>
            <nav className="p-4 space-y-2">
              {sidebarLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link key={link.href} href={link.href}>
                    <div className={`sidebar-link flex items-center gap-3 px-3 py-2 font-medium ${
                      link.active ? 'active' : ''
                    }`}>
                      <IconComponent className="w-5 h-5" />
                      <span>{link.label}</span>
                      {link.badge && (
                        <span className="ml-auto text-xs px-2 py-1 rounded-full"
                              style={{ 
                                backgroundColor: link.active ? 'oklch(var(--primary-foreground) / 0.2)' : 'oklch(var(--primary) / 0.1)',
                                color: link.active ? 'oklch(var(--primary-foreground))' : 'oklch(var(--primary))'
                              }}>
                          {link.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
              
              <div className="border-t pt-4 mt-4" style={{ borderColor: 'oklch(var(--sidebar-border))' }}>
                {sidebarBottomLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <Link key={link.href} href={link.href}>
                      <div className="sidebar-link flex items-center gap-3 px-3 py-2 font-medium">
                        <IconComponent className="w-5 h-5" />
                        <span>{link.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 animate-fadeIn">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: 'oklch(var(--muted-foreground))' }}>
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
              <ChevronRight className="w-4 h-4" />
              <span className="font-medium" style={{ color: 'oklch(var(--foreground))' }}>Invoices</span>
            </nav>

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'oklch(var(--foreground))' }}>
                  Invoices
                </h2>
                <p style={{ color: 'oklch(var(--muted-foreground))' }}>
                  Manage and track all your invoices
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="btn-primary px-4 py-2 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Invoice
                </button>
              </div>
            </div>

            {/* Filters & Search */}
            <div className="card p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder="Search invoices..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input w-full px-4 py-3 pr-12"
                  />
                  <Search className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" 
                          style={{ color: 'oklch(var(--muted-foreground))' }} />
                </div>
                
                {/* Filters */}
                <div className="flex gap-3">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="input px-4 py-3"
                  >
                    <option value="">All Statuses</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                    <option value="draft">Draft</option>
                  </select>
                  
                  <select 
                    value={clientFilter}
                    onChange={(e) => setClientFilter(e.target.value)}
                    className="input px-4 py-3"
                  >
                    <option value="">All Clients</option>
                    <option value="Acme Corp">Acme Corp</option>
                    <option value="TechStart Inc">TechStart Inc</option>
                    <option value="BlueCorp Ltd">BlueCorp Ltd</option>
                    <option value="GreenTech Solutions">GreenTech Solutions</option>
                  </select>
                  
                  <button className="btn-primary p-3">
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedInvoices.length > 0 && (
              <div className="card p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span style={{ color: 'oklch(var(--muted-foreground))' }}>
                    {selectedInvoices.length} invoice(s) selected
                  </span>
                  <div className="flex items-center gap-3">
                    <button className="btn-secondary px-4 py-2 flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Send Reminders
                    </button>
                    <button className="btn-secondary px-4 py-2 flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                    <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Invoices Table */}
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: 'oklch(var(--muted))' }}>
                    <tr>
                      <th className="w-12 px-6 py-4 text-left">
                        <input 
                          type="checkbox" 
                          checked={selectedInvoices.length === invoices.length}
                          onChange={handleSelectAll}
                          className="rounded text-blue-600 focus:ring-blue-500"
                          style={{ borderColor: 'oklch(var(--border))' }}
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" 
                          style={{ color: 'oklch(var(--muted-foreground))' }}>Invoice #</th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" 
                          style={{ color: 'oklch(var(--muted-foreground))' }}>Client</th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" 
                          style={{ color: 'oklch(var(--muted-foreground))' }}>Date</th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" 
                          style={{ color: 'oklch(var(--muted-foreground))' }}>Due Date</th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" 
                          style={{ color: 'oklch(var(--muted-foreground))' }}>Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" 
                          style={{ color: 'oklch(var(--muted-foreground))' }}>Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider w-24" 
                          style={{ color: 'oklch(var(--muted-foreground))' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'oklch(var(--border))' }}>
                    {filteredInvoices.map((invoice, index) => (
                      <tr 
                        key={invoice.id} 
                        className="table-row-enter hover:bg-gray-50 dark:hover:bg-gray-700"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="px-6 py-4">
                          <input 
                            type="checkbox" 
                            checked={selectedInvoices.includes(invoice.id)}
                            onChange={() => handleSelectInvoice(invoice.id)}
                            className="rounded text-blue-600 focus:ring-blue-500"
                            style={{ borderColor: 'oklch(var(--border))' }}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-mono font-medium" style={{ color: 'oklch(var(--foreground))' }}>
                            {invoice.id}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium" style={{ color: 'oklch(var(--foreground))' }}>
                              {invoice.client}
                            </div>
                            <div className="text-sm" style={{ color: 'oklch(var(--muted-foreground))' }}>
                              {invoice.clientEmail}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span style={{ color: 'oklch(var(--foreground))' }}>
                            {formatDate(invoice.date)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span style={{ color: 'oklch(var(--foreground))' }}>
                            {formatDate(invoice.dueDate)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium" style={{ color: 'oklch(var(--foreground))' }}>
                            {formatCurrency(invoice.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(invoice.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <button 
                              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" 
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" 
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" 
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <div className="relative">
                              <button 
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" 
                                title="More"
                                onClick={() => toggleDropdown(invoice.id)}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                              {dropdownOpen === invoice.id && (
                                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-40 z-10">
                                  <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                                    <Send className="w-4 h-4" />
                                    <span>Send</span>
                                  </button>
                                  <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                                    <Copy className="w-4 h-4" />
                                    <span>Duplicate</span>
                                  </button>
                                  <hr className="my-2 border-gray-200" />
                                  <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2">
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm" style={{ color: 'oklch(var(--muted-foreground))' }}>
                Showing 1 to {filteredInvoices.length} of {invoices.length} invoices
              </p>
              
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                        style={{ borderColor: 'oklch(var(--border))', color: 'oklch(var(--muted-foreground))' }}
                        disabled>
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </button>
                <button className="px-3 py-2 bg-blue-500 text-white rounded-lg">1</button>
                <button className="px-3 py-2 border rounded-lg transition-colors" 
                        style={{ borderColor: 'oklch(var(--border))', color: 'oklch(var(--muted-foreground))' }}>2</button>
                <button className="px-3 py-2 border rounded-lg transition-colors" 
                        style={{ borderColor: 'oklch(var(--border))', color: 'oklch(var(--muted-foreground))' }}>3</button>
                <button className="px-3 py-2 border rounded-lg transition-colors" 
                        style={{ borderColor: 'oklch(var(--border))', color: 'oklch(var(--muted-foreground))' }}>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </main>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </AuthGuard>
  );
}