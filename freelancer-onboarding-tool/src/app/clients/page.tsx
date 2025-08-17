'use client';

import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';
import Link from 'next/link';
import { useState } from 'react';
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
  UserPlus,
  Download,
  List,
  Grid3x3,
  LayoutDashboard,
  Eye,
  Edit
} from 'lucide-react';

const clients = [
  {
    id: 1,
    name: 'ABC Corporation',
    email: 'john@abccorp.com',
    phone: '+1-555-0123',
    projects: 3,
    revenue: '$15,000',
    status: 'Active',
    statusColor: 'green',
    lastContact: '2 days ago',
    lastContactDate: 'Jan 10, 2024',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&auto=format'
  },
  {
    id: 2,
    name: 'XYZ Limited',
    email: 'contact@xyz.com',
    phone: '+1-555-0456',
    projects: 1,
    revenue: '$8,500',
    status: 'Pending',
    statusColor: 'amber',
    lastContact: '1 week ago',
    lastContactDate: 'Jan 5, 2024',
    avatar: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=40&h=40&fit=crop&auto=format'
  },
  {
    id: 3,
    name: 'TechFlow Inc.',
    email: 'admin@techflow.io',
    phone: '+1-555-0789',
    projects: 5,
    revenue: '$32,000',
    status: 'Active',
    statusColor: 'green',
    lastContact: '3 days ago',
    lastContactDate: 'Jan 9, 2024',
    avatar: 'https://images.unsplash.com/photo-1572059686606-b1b91b8be5ad?w=40&h=40&fit=crop&auto=format'
  },
  {
    id: 4,
    name: 'StartupCo',
    email: 'hello@startup.co',
    phone: '+1-555-0321',
    projects: 2,
    revenue: '$12,000',
    status: 'Onboarding',
    statusColor: 'blue',
    lastContact: '5 days ago',
    lastContactDate: 'Jan 7, 2024',
    avatar: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=40&h=40&fit=crop&auto=format'
  }
];

const sidebarLinks = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/clients', icon: Users, label: 'Clients', badge: '42', active: true },
  { href: '/invoices', icon: Receipt, label: 'Invoices', badge: '8' },
  { href: '/templates', icon: Mail, label: 'Templates' }
];

const sidebarBottomLinks = [
  { href: '/settings', icon: Settings, label: 'Settings' },
  { href: '/admin', icon: Wrench, label: 'Admin' }
];

const filterOptions = [
  { label: 'All (42)', active: true, count: 42 },
  { label: 'Active (28)', color: 'bg-green-500', count: 28 },
  { label: 'Pending (8)', color: 'bg-amber-500', count: 8 },
  { label: 'Onboarding (6)', color: 'bg-blue-500', count: 6 },
  { label: 'Inactive (0)', color: 'bg-gray-400', count: 0 }
];

export default function Clients() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [activeFilter, setActiveFilter] = useState(0);
  const [viewMode, setViewMode] = useState('list');

  const handleSelectClient = (clientId: number) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSelectAll = () => {
    setSelectedClients(
      selectedClients.length === clients.length 
        ? [] 
        : clients.map(client => client.id)
    );
  };

  const getStatusBadge = (status: string, color: string) => {
    const colorClasses = {
      green: 'bg-green-100 text-green-700',
      amber: 'bg-amber-100 text-amber-700',
      blue: 'bg-blue-100 text-blue-700',
      gray: 'bg-gray-100 text-gray-700'
    };

    const dotColors = {
      green: 'bg-green-600',
      amber: 'bg-amber-600',
      blue: 'bg-blue-600',
      gray: 'bg-gray-600'
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${dotColors[color as keyof typeof dotColors]}`}></div>
        {status}
      </span>
    );
  };

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
                placeholder="Search clients... (⌘K)"
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
              <span className="font-medium" style={{ color: 'oklch(var(--foreground))' }}>Clients</span>
            </nav>

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'oklch(var(--foreground))' }}>
                  Client Management
                </h2>
                <p style={{ color: 'oklch(var(--muted-foreground))' }}>
                  Manage your client relationships and track project progress.
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="btn-primary px-4 py-2 flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Add Client
                </button>
                
                <button className="btn-secondary px-4 py-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Bulk Email
                </button>
                
                <button className="btn-secondary px-4 py-2 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium" style={{ color: 'oklch(var(--foreground))' }}>
                  Filter by status:
                </span>
                {filterOptions.map((filter, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveFilter(index)}
                    className={`filter-pill flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                      activeFilter === index ? 'active' : ''
                    }`}
                  >
                    {filter.color && (
                      <span className={`w-2 h-2 ${filter.color} rounded-full`}></span>
                    )}
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Search & Controls */}
            <div className="card p-4 mb-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                {/* Search Inputs */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input 
                    type="text" 
                    placeholder="Search by name..."
                    className="input px-3 py-2"
                  />
                  <input 
                    type="text" 
                    placeholder="Search by email..."
                    className="input px-3 py-2"
                  />
                  <select className="input px-3 py-2">
                    <option>All Statuses</option>
                    <option>Active</option>
                    <option>Pending</option>
                    <option>Onboarding</option>
                  </select>
                </div>
                
                {/* Sort & View Controls */}
                <div className="flex items-center gap-3">
                  <select className="input px-3 py-2 text-sm">
                    <option>Sort by Name</option>
                    <option>Sort by Date</option>
                    <option>Sort by Revenue</option>
                  </select>
                  
                  <div className="flex items-center border rounded-lg" style={{ borderColor: 'oklch(var(--border))' }}>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-l-lg ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setViewMode('dashboard')}
                      className={`p-2 rounded-r-lg ${viewMode === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Table */}
            <div className="card overflow-hidden">
              {/* Table Header */}
              <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'oklch(var(--border))' }}>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={selectedClients.length === clients.length}
                    onChange={handleSelectAll}
                    className="rounded text-blue-600 focus:ring-blue-500"
                    style={{ borderColor: 'oklch(var(--border))' }}
                  />
                  <span className="text-sm font-medium" style={{ color: 'oklch(var(--foreground))' }}>
                    {clients.length} clients
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: 'oklch(var(--muted-foreground))' }}>
                    Bulk actions:
                  </span>
                  <select className="input text-sm px-2 py-1">
                    <option>Choose action...</option>
                    <option>Send email</option>
                    <option>Update status</option>
                    <option>Export selected</option>
                  </select>
                </div>
              </div>

              {/* Table Content */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: 'oklch(var(--muted))' }}>
                    <tr>
                      <th className="text-left py-4 px-6 font-medium" style={{ color: 'oklch(var(--foreground))' }}>
                        Client
                      </th>
                      <th className="text-left py-4 px-6 font-medium" style={{ color: 'oklch(var(--foreground))' }}>
                        Status
                      </th>
                      <th className="text-left py-4 px-6 font-medium" style={{ color: 'oklch(var(--foreground))' }}>
                        Revenue
                      </th>
                      <th className="text-left py-4 px-6 font-medium" style={{ color: 'oklch(var(--foreground))' }}>
                        Last Contact
                      </th>
                      <th className="text-left py-4 px-6 font-medium" style={{ color: 'oklch(var(--foreground))' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'oklch(var(--border))' }}>
                    {clients.map((client, index) => (
                      <tr 
                        key={client.id} 
                        className="client-row"
                        style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <input 
                              type="checkbox" 
                              checked={selectedClients.includes(client.id)}
                              onChange={() => handleSelectClient(client.id)}
                              className="rounded text-blue-600 focus:ring-blue-500"
                              style={{ borderColor: 'oklch(var(--border))' }}
                            />
                            <img 
                              src={client.avatar} 
                              alt={client.name} 
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <p className="font-semibold" style={{ color: 'oklch(var(--foreground))' }}>
                                {client.name}
                              </p>
                              <p className="text-sm" style={{ color: 'oklch(var(--muted-foreground))' }}>
                                {client.email}
                              </p>
                              <p className="text-xs" style={{ color: 'oklch(var(--muted-foreground))' }}>
                                {client.phone} • {client.projects} projects
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {getStatusBadge(client.status, client.statusColor)}
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-semibold" style={{ color: 'oklch(var(--foreground))' }}>
                            {client.revenue}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-sm" style={{ color: 'oklch(var(--foreground))' }}>
                              {client.lastContact}
                            </p>
                            <p className="text-xs" style={{ color: 'oklch(var(--muted-foreground))' }}>
                              {client.lastContactDate}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button 
                              className="action-btn animate-quick-action p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg" 
                              title="Send Email"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                            <button 
                              className="action-btn animate-quick-action p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg" 
                              title="Create Invoice"
                            >
                              <Receipt className="w-4 h-4" />
                            </button>
                            <button 
                              className="action-btn animate-quick-action p-2 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg" 
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              className="action-btn animate-quick-action p-2 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg" 
                              title="Edit Client"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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