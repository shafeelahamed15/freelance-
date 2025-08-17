'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';
import { Layout } from '@/components/Layout';
import { ClientModal } from '@/components/ClientModal';
import { SimpleClientActions } from '@/components/SimpleClientActions';
import { ClientDetailsModal } from '@/components/ClientDetailsModal';
import { EditClientModal } from '@/components/EditClientModal';
import { DeleteClientModal } from '@/components/DeleteClientModal';
import { SendEmailModal } from '@/components/SendEmailModal';
import { FirestoreService } from '@/lib/firestore';
import type { Client } from '@/types';
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

export default function ClientsPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Debug logging
  console.log('ClientsPage render:', { user: !!user, loading, clientsCount: clients.length, showAddModal });

  useEffect(() => {
    if (user) {
      loadClients();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadClients = async () => {
    try {
      if (!user) return;
      const clientsData = await FirestoreService.getUserClients(user.id);
      setClients(clientsData);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Client action handlers
  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setShowDetailsModal(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setShowEditModal(true);
  };

  const handleDeleteClient = (client: Client) => {
    setSelectedClient(client);
    setShowDeleteModal(true);
  };

  const handleSendEmail = (client: Client) => {
    setSelectedClient(client);
    setShowEmailModal(true);
  };

  const handleModalSuccess = () => {
    loadClients();
    setSelectedClient(null);
    setShowDetailsModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowEmailModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'onboarding': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'payment': return 'bg-purple-100 text-purple-800';
      case 'timeline': return 'bg-orange-100 text-orange-800';
      case 'scope': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <Layout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </Layout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <Layout>
        <div className="p-6">
          <div className="sm:flex sm:items-center mb-6">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
              <p className="mt-2 text-sm text-gray-700">
                Manage your client relationships and onboarding progress
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Client
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search clients..."
                className="block w-full pl-10 pr-3 py-2 text-gray-900 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Clients List */}
          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">No clients found</h3>
              <p className="text-sm text-gray-500 mb-4">
                {searchTerm ? 'No clients match your search.' : 'Get started by adding your first client.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Your First Client
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <li key={client.id}>
                    <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {client.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-gray-900">{client.name}</p>
                              {client.company && (
                                <span className="ml-2 text-sm text-gray-500">• {client.company}</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{client.email}</p>
                            <div className="mt-2 flex items-center space-x-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
                                {client.status}
                              </span>
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStageColor(client.onboardingStage)}`}>
                                {client.onboardingStage}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleSendEmail(client)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <EnvelopeIcon className="w-4 h-4 mr-2" />
                            Send Email
                          </button>
                          <SimpleClientActions
                            client={client}
                            onView={handleViewClient}
                            onEdit={handleEditClient}
                            onDelete={handleDeleteClient}
                            onSendEmail={handleSendEmail}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <ClientModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadClients();
          }}
        />

        <ClientDetailsModal
          client={selectedClient}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedClient(null);
          }}
        />

        <EditClientModal
          client={selectedClient}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedClient(null);
          }}
          onSuccess={handleModalSuccess}
        />

        <DeleteClientModal
          client={selectedClient}
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedClient(null);
          }}
          onSuccess={handleModalSuccess}
        />

        {/* Send Email Modal */}
        {selectedClient && showEmailModal && (
          <SendEmailModal
            client={selectedClient}
            onClose={() => {
              setShowEmailModal(false);
              setSelectedClient(null);
            }}
          />
        )}
      </Layout>
    </AuthGuard>
  );
}