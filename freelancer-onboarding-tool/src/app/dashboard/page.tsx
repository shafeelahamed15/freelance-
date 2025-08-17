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
  DollarSign,
  Clock,
  UserPlus,
  FilePlus,
  TrendingUp
} from 'lucide-react';

const stats = [
  {
    title: 'Total Revenue',
    value: '$28,450',
    change: '+12.5%',
    icon: DollarSign,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    changeBg: 'bg-green-50'
  },
  {
    title: 'Active Clients',
    value: '42',
    change: '42',
    icon: Users,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    changeBg: 'bg-blue-50'
  },
  {
    title: 'Pending Invoices',
    value: '8',
    change: '8',
    icon: Clock,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    changeBg: 'bg-amber-50'
  },
  {
    title: 'Email Templates',
    value: '15',
    change: '15',
    icon: Mail,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    changeBg: 'bg-purple-50'
  }
];

const recentActivity = [
  { text: 'Invoice #1234 paid', time: '2 minutes ago', color: 'bg-green-500' },
  { text: 'New client onboarded', time: '1 hour ago', color: 'bg-blue-500' },
  { text: 'Email template created', time: '3 hours ago', color: 'bg-purple-500' },
  { text: 'Payment reminder sent', time: '5 hours ago', color: 'bg-amber-500' }
];

const sidebarLinks = [
  { href: '/dashboard', icon: Home, label: 'Dashboard', active: true },
  { href: '/clients', icon: Users, label: 'Clients', badge: '42' },
  { href: '/invoices', icon: Receipt, label: 'Invoices', badge: '8' },
  { href: '/templates', icon: Mail, label: 'Templates' }
];

const sidebarBottomLinks = [
  { href: '/settings', icon: Settings, label: 'Settings' },
  { href: '/admin', icon: Wrench, label: 'Admin' }
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
                placeholder="Search clients, invoices... (⌘K)"
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
            {/* Dashboard Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'oklch(var(--foreground))' }}>
                Dashboard Overview
              </h2>
              <p style={{ color: 'oklch(var(--muted-foreground))' }}>
                Welcome back! Here's what's happening with your business.
              </p>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div 
                    key={stat.title}
                    className="metric-card animate-hover-lift animate-slideUp"
                    style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 ${stat.iconBg} rounded-lg`}>
                        <IconComponent className={`w-5 h-5 ${stat.iconColor}`} />
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${stat.changeBg}`}
                            style={{ color: 'oklch(var(--muted-foreground))' }}>
                        {stat.change}
                      </span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold" style={{ color: 'oklch(var(--foreground))' }}>
                        {stat.value}
                      </p>
                      <p className="text-sm" style={{ color: 'oklch(var(--muted-foreground))' }}>
                        {stat.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Quick Actions Panel */}
              <div className="lg:col-span-1">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4" style={{ color: 'oklch(var(--foreground))' }}>
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <UserPlus className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: 'oklch(var(--foreground))' }}>Add New Client</p>
                        <p className="text-sm" style={{ color: 'oklch(var(--muted-foreground))' }}>Create client profile</p>
                      </div>
                    </button>
                    
                    <button className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FilePlus className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: 'oklch(var(--foreground))' }}>Create Invoice</p>
                        <p className="text-sm" style={{ color: 'oklch(var(--muted-foreground))' }}>Generate new invoice</p>
                      </div>
                    </button>
                    
                    <button className="w-full flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Mail className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: 'oklch(var(--foreground))' }}>Send Email</p>
                        <p className="text-sm" style={{ color: 'oklch(var(--muted-foreground))' }}>Compose message</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Revenue Analytics */}
              <div className="lg:col-span-2">
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold" style={{ color: 'oklch(var(--foreground))' }}>
                      Revenue Analytics
                    </h3>
                    <select className="input text-sm px-3 py-2">
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Last 3 months</option>
                    </select>
                  </div>
                  
                  {/* Mock Chart */}
                  <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                      <p style={{ color: 'oklch(var(--muted-foreground))' }}>Revenue trend chart</p>
                      <p className="text-sm" style={{ color: 'oklch(var(--muted-foreground))' }}>$5,200 increase this month</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity & Client Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-1">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4" style={{ color: 'oklch(var(--foreground))' }}>
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
                        <div className="flex-1">
                          <p className="text-sm" style={{ color: 'oklch(var(--foreground))' }}>{activity.text}</p>
                          <p className="text-xs" style={{ color: 'oklch(var(--muted-foreground))' }}>{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Client Overview */}
              <div className="lg:col-span-2">
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold" style={{ color: 'oklch(var(--foreground))' }}>
                      Client Overview
                    </h3>
                    <Link href="/clients">
                      <button className="text-sm font-medium" style={{ color: 'oklch(var(--primary))' }}>
                        View All
                      </button>
                    </Link>
                  </div>
                  
                  <div className="overflow-hidden">
                    <table className="w-full">
                      <thead style={{ backgroundColor: 'oklch(var(--muted))' }}>
                        <tr>
                          <th className="text-left py-3 px-4 font-medium" style={{ color: 'oklch(var(--foreground))' }}>Client</th>
                          <th className="text-left py-3 px-4 font-medium" style={{ color: 'oklch(var(--foreground))' }}>Status</th>
                          <th className="text-left py-3 px-4 font-medium" style={{ color: 'oklch(var(--foreground))' }}>Revenue</th>
                          <th className="text-left py-3 px-4 font-medium" style={{ color: 'oklch(var(--foreground))' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: 'oklch(var(--border))' }}>
                        <tr className="table-row">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=32&h=32&fit=crop&auto=format" 
                                alt="TechFlow" 
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <p className="font-medium text-sm" style={{ color: 'oklch(var(--foreground))' }}>TechFlow Inc.</p>
                                <p className="text-xs" style={{ color: 'oklch(var(--muted-foreground))' }}>john@techflow.com</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="status-dot status-dot-active mr-2"></span>
                            <span className="text-sm status-active">Active</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm font-medium" style={{ color: 'oklch(var(--foreground))' }}>$12,400</span>
                          </td>
                          <td className="py-4 px-4">
                            <button className="action-btn text-sm">View Details</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
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