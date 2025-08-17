'use client';

import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';
import { Layout } from '@/components/Layout';
import { EmailTester } from '@/components/EmailTester';
import Link from 'next/link';
import { 
  UserGroupIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const stats = [
  {
    name: 'Total Clients',
    value: '12',
    change: '+4.75%',
    changeType: 'positive',
    icon: UserGroupIcon,
  },
  {
    name: 'Active Invoices',
    value: '8',
    change: '+2.02%',
    changeType: 'positive',
    icon: DocumentTextIcon,
  },
  {
    name: 'Revenue This Month',
    value: '$12,426',
    change: '+12.05%',
    changeType: 'positive',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Conversion Rate',
    value: '87%',
    change: '-0.39%',
    changeType: 'negative',
    icon: ChartBarIcon,
  },
];

const recentClients = [
  { id: 1, name: 'Acme Corp', email: 'john@acme.com', status: 'onboarding', stage: 'welcome' },
  { id: 2, name: 'TechStart Inc', email: 'sarah@techstart.com', status: 'active', stage: 'completed' },
  { id: 3, name: 'Design Co', email: 'mike@designco.com', status: 'onboarding', stage: 'scope' },
];

const recentInvoices = [
  { id: 1, client: 'Acme Corp', amount: '$2,500', status: 'paid', dueDate: '2024-01-15' },
  { id: 2, client: 'TechStart Inc', amount: '$5,200', status: 'sent', dueDate: '2024-01-20' },
  { id: 3, client: 'Design Co', amount: '$1,800', status: 'draft', dueDate: '2024-01-25' },
];

function getStatusColor(status: string) {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800';
    case 'sent': return 'bg-yellow-100 text-yellow-800';
    case 'draft': return 'bg-gray-100 text-gray-800';
    case 'active': return 'bg-green-100 text-green-800';
    case 'onboarding': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <AuthGuard>
      <Layout>
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here&apos;s what&apos;s happening with your freelance business today.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stat.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span className={`font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-gray-500"> from last month</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Clients */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Clients</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {recentClients.map((client) => (
                  <div key={client.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{client.name}</p>
                        <p className="text-sm text-gray-500">{client.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
                          {client.status}
                        </span>
                        <span className="text-xs text-gray-500">{client.stage}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 bg-gray-50">
                <Link href="/clients" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View all clients →
                </Link>
              </div>
            </div>

            {/* Recent Invoices */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Invoices</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{invoice.client}</p>
                        <p className="text-sm text-gray-500">Due: {invoice.dueDate}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{invoice.amount}</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 bg-gray-50">
                <Link href="/invoices" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View all invoices →
                </Link>
              </div>
            </div>
          </div>

          {/* System Status & Quick Actions */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Link href="/clients" className="flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                    Add New Client
                  </Link>
                  <Link href="/invoices" className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Create Invoice
                  </Link>
                  <Link href="/templates" className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Create Templates
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">System Status</h2>
                <EmailTester />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  );
}