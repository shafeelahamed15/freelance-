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
  User,
  Building,
  Shield,
  CreditCard,
  Upload,
  Save,
  Plus,
  Monitor,
  Smartphone,
  QrCode,
  Check
} from 'lucide-react';

const sidebarLinks = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/clients', icon: Users, label: 'Clients', badge: '42' },
  { href: '/invoices', icon: Receipt, label: 'Invoices', badge: '8' },
  { href: '/templates', icon: Mail, label: 'Templates' }
];

const sidebarBottomLinks = [
  { href: '/settings', icon: Settings, label: 'Settings', active: true },
  { href: '/admin', icon: Wrench, label: 'Admin' }
];

const settingsTabs = [
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'company', icon: Building, label: 'Company' },
  { id: 'invoicing', icon: Receipt, label: 'Invoicing' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'security', icon: Shield, label: 'Security' },
  { id: 'billing', icon: CreditCard, label: 'Billing' }
];

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@clienthandle.com',
    phone: '+1 (555) 123-4567',
    bio: 'Experienced business consultant helping companies streamline their operations and improve client relationships.'
  });

  const [companyData, setCompanyData] = useState({
    name: 'ClientHandle Solutions',
    industry: 'Consulting',
    size: '1-10 employees',
    address: '123 Business Street',
    city: 'Business City',
    state: 'BC',
    zip: '12345',
    phone: '+1 (555) 987-6543',
    website: 'https://clienthandle.com',
    taxId: '12-3456789',
    taxRate: 8.5
  });

  const [invoicingData, setInvoicingData] = useState({
    paymentTerms: 'Net 30 days',
    numberFormat: 'INV-YYYY-NNNN',
    nextNumber: 1007,
    lateFee: 2.5,
    footer: 'Thank you for your business! Payment is due within the agreed terms.',
    terms: '1. Payment is due according to the terms specified above.\n2. Late payments may incur additional fees.\n3. All work is performed according to the agreed scope.\n4. Changes to scope may result in additional charges.'
  });

  const [notifications, setNotifications] = useState({
    newClients: true,
    invoicePayments: true,
    overdueInvoices: true,
    projectUpdates: false
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      // Add success animation
    }, 1000);
  };

  const handleToggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="max-w-4xl space-y-8">
            {/* Profile Picture */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'oklch(var(--foreground))' }}>Profile Picture</h3>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-green-500 flex items-center justify-center text-white text-2xl font-semibold cursor-pointer">
                  JD
                </div>
                <div>
                  <button className="btn-primary text-sm px-4 py-2 mr-2 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload New Photo
                  </button>
                  <button className="btn-secondary text-sm px-4 py-2">
                    Remove
                  </button>
                  <p className="text-sm mt-2" style={{ color: 'oklch(var(--muted-foreground))' }}>JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>
            </div>
            
            {/* Personal Information */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'oklch(var(--foreground))' }}>Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">First Name</label>
                  <input 
                    type="text" 
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="input w-full" 
                  />
                </div>
                <div>
                  <label className="form-label">Last Name</label>
                  <input 
                    type="text" 
                    value={profileData.lastName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="input w-full" 
                  />
                </div>
                <div>
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="input w-full" 
                  />
                </div>
                <div>
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="tel" 
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    className="input w-full" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="form-label">Bio</label>
                  <textarea 
                    rows={3} 
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    className="input w-full" 
                    placeholder="Tell us a little about yourself..."
                  />
                </div>
              </div>
            </div>
            
            {/* Change Password */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'oklch(var(--foreground))' }}>Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Current Password</label>
                  <input type="password" className="input w-full" />
                </div>
                <div></div>
                <div>
                  <label className="form-label">New Password</label>
                  <input type="password" className="input w-full" />
                </div>
                <div>
                  <label className="form-label">Confirm Password</label>
                  <input type="password" className="input w-full" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm" style={{ color: 'oklch(var(--muted-foreground))' }}>
                  <p className="mb-1">Password requirements:</p>
                  <ul className="text-xs space-y-1" style={{ color: 'oklch(var(--muted-foreground))' }}>
                    <li>• At least 8 characters long</li>
                    <li>• Contains uppercase and lowercase letters</li>
                    <li>• Contains at least one number</li>
                    <li>• Contains at least one special character</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'company':
        return (
          <div className="max-w-4xl space-y-8">
            {/* Company Logo */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'oklch(var(--foreground))' }}>Company Logo</h3>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-lg flex items-center justify-center border-2 border-dashed" 
                     style={{ backgroundColor: 'oklch(var(--muted))', borderColor: 'oklch(var(--border))' }}>
                  <Building className="w-8 h-8" style={{ color: 'oklch(var(--muted-foreground))' }} />
                </div>
                <div>
                  <button className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Logo
                  </button>
                  <p className="text-sm mt-2" style={{ color: 'oklch(var(--muted-foreground))' }}>PNG or SVG. Recommended 200x200px.</p>
                </div>
              </div>
            </div>
            
            {/* Company Information */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'oklch(var(--foreground))' }}>Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="form-label">Company Name</label>
                  <input 
                    type="text" 
                    value={companyData.name}
                    onChange={(e) => setCompanyData(prev => ({ ...prev, name: e.target.value }))}
                    className="input w-full" 
                  />
                </div>
                <div>
                  <label className="form-label">Industry</label>
                  <select 
                    value={companyData.industry}
                    onChange={(e) => setCompanyData(prev => ({ ...prev, industry: e.target.value }))}
                    className="input w-full"
                  >
                    <option>Consulting</option>
                    <option>Technology</option>
                    <option>Marketing</option>
                    <option>Finance</option>
                    <option>Healthcare</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Company Size</label>
                  <select 
                    value={companyData.size}
                    onChange={(e) => setCompanyData(prev => ({ ...prev, size: e.target.value }))}
                    className="input w-full"
                  >
                    <option>1-10 employees</option>
                    <option>11-50 employees</option>
                    <option>51-200 employees</option>
                    <option>201+ employees</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="form-label">Address</label>
                  <input 
                    type="text" 
                    value={companyData.address}
                    onChange={(e) => setCompanyData(prev => ({ ...prev, address: e.target.value }))}
                    className="input w-full mb-4" 
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input 
                      type="text" 
                      placeholder="City" 
                      value={companyData.city}
                      onChange={(e) => setCompanyData(prev => ({ ...prev, city: e.target.value }))}
                      className="input" 
                    />
                    <input 
                      type="text" 
                      placeholder="State/Province" 
                      value={companyData.state}
                      onChange={(e) => setCompanyData(prev => ({ ...prev, state: e.target.value }))}
                      className="input" 
                    />
                    <input 
                      type="text" 
                      placeholder="ZIP/Postal Code" 
                      value={companyData.zip}
                      onChange={(e) => setCompanyData(prev => ({ ...prev, zip: e.target.value }))}
                      className="input" 
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Phone</label>
                  <input 
                    type="tel" 
                    value={companyData.phone}
                    onChange={(e) => setCompanyData(prev => ({ ...prev, phone: e.target.value }))}
                    className="input w-full" 
                  />
                </div>
                <div>
                  <label className="form-label">Website</label>
                  <input 
                    type="url" 
                    value={companyData.website}
                    onChange={(e) => setCompanyData(prev => ({ ...prev, website: e.target.value }))}
                    className="input w-full" 
                  />
                </div>
              </div>
            </div>
            
            {/* Tax Information */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'oklch(var(--foreground))' }}>Tax Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Tax ID / EIN</label>
                  <input 
                    type="text" 
                    value={companyData.taxId}
                    onChange={(e) => setCompanyData(prev => ({ ...prev, taxId: e.target.value }))}
                    className="input w-full" 
                  />
                </div>
                <div>
                  <label className="form-label">Default Tax Rate (%)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={companyData.taxRate}
                    onChange={(e) => setCompanyData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) }))}
                    className="input w-full" 
                  />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'security':
        return (
          <div className="max-w-4xl space-y-8">
            {/* Two-Factor Authentication */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'oklch(var(--foreground))' }}>Two-Factor Authentication</h3>
              <div className="flex items-start gap-6">
                <div className="bg-white p-5 rounded-xl border" style={{ borderColor: 'oklch(var(--border))' }}>
                  <div className="w-32 h-32 border-2 border-dashed rounded flex items-center justify-center" 
                       style={{ backgroundColor: 'oklch(var(--muted))', borderColor: 'oklch(var(--border))' }}>
                    <QrCode className="w-12 h-12" style={{ color: 'oklch(var(--muted-foreground))' }} />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm mb-4" style={{ color: 'oklch(var(--muted-foreground))' }}>
                    Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.) to enable two-factor authentication.
                  </p>
                  <div className="mb-4">
                    <label className="form-label">Manual Entry Key</label>
                    <div className="font-mono text-sm p-3 rounded border" 
                         style={{ backgroundColor: 'oklch(var(--muted))', borderColor: 'oklch(var(--border))', color: 'oklch(var(--foreground))' }}>
                      MFRGG2LTMVZWS5DFNN2HE2LTMVZWS5DFNN2A
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Enter verification code</label>
                    <input type="text" placeholder="000000" className="input w-32 text-center font-mono" />
                  </div>
                  <button className="btn-primary">
                    Enable 2FA
                  </button>
                </div>
              </div>
            </div>
            
            {/* Active Sessions */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'oklch(var(--foreground))' }}>Active Sessions</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: 'oklch(var(--border))' }}>
                  <div className="flex items-center gap-3">
                    <Monitor className="w-5 h-5" style={{ color: 'oklch(var(--muted-foreground))' }} />
                    <div>
                      <p className="font-medium" style={{ color: 'oklch(var(--foreground))' }}>Windows Desktop</p>
                      <p className="text-sm" style={{ color: 'oklch(var(--muted-foreground))' }}>Chrome • 192.168.1.100 • Current session</p>
                    </div>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Active</span>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: 'oklch(var(--border))' }}>
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5" style={{ color: 'oklch(var(--muted-foreground))' }} />
                    <div>
                      <p className="font-medium" style={{ color: 'oklch(var(--foreground))' }}>iPhone</p>
                      <p className="text-sm" style={{ color: 'oklch(var(--muted-foreground))' }}>Safari • 192.168.1.105 • 2 hours ago</p>
                    </div>
                  </div>
                  <button className="text-sm text-red-600 font-medium hover:text-red-700">Revoke</button>
                </div>
              </div>
              <div className="mt-4">
                <button className="btn-secondary">
                  Sign Out All Devices
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="max-w-4xl">
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'oklch(var(--foreground))' }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
              <p style={{ color: 'oklch(var(--muted-foreground))' }}>This section is coming soon.</p>
            </div>
          </div>
        );
    }
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
                      <div className={`sidebar-link flex items-center gap-3 px-3 py-2 font-medium ${
                        link.active ? 'active' : ''
                      }`}>
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
          <main className="flex-1">
            {/* Page Header */}
            <div className="border-b p-6" style={{ borderColor: 'oklch(var(--border))' }}>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: 'oklch(var(--foreground))' }}>Settings</h1>
                <p className="mt-1" style={{ color: 'oklch(var(--muted-foreground))' }}>Manage your account and application preferences</p>
              </div>
            </div>
            
            <div className="flex">
              {/* Settings Navigation Tabs */}
              <div className="w-64 border-r min-h-screen p-6" style={{ borderColor: 'oklch(var(--border))' }}>
                <nav className="space-y-1">
                  {settingsTabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                          activeTab === tab.id 
                            ? 'bg-blue-50 text-blue-600' 
                            : 'hover:bg-gray-100'
                        }`}
                        style={{
                          backgroundColor: activeTab === tab.id ? 'oklch(var(--accent))' : 'transparent',
                          color: activeTab === tab.id ? 'oklch(var(--accent-foreground))' : 'oklch(var(--foreground))'
                        }}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
              
              {/* Settings Content */}
              <div className="flex-1 p-6">
                {renderTabContent()}
                
                {/* Save Button */}
                <div className="flex justify-end mt-8">
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary px-6 py-3 flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
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