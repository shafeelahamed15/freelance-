'use client';

import { XMarkIcon, CalendarIcon, EnvelopeIcon, PhoneIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import type { Client } from '@/types';

interface ClientDetailsModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ClientDetailsModal({ client, isOpen, onClose }: ClientDetailsModalProps) {
  if (!isOpen || !client) return null;

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

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Client Details</h3>
            <p className="text-sm text-gray-500 mt-1">View and manage client information</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Client Header */}
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xl font-medium text-blue-600">
                {client.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-medium text-gray-900">{client.name}</h4>
              {client.company && (
                <p className="text-gray-600 flex items-center mt-1">
                  <BuildingOfficeIcon className="w-4 h-4 mr-1" />
                  {client.company}
                </p>
              )}
              <div className="flex items-center space-x-3 mt-2">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
                  {client.status}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStageColor(client.onboardingStage)}`}>
                  {client.onboardingStage}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h5>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <EnvelopeIcon className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-gray-900">{client.email}</span>
                </div>
                {client.phone && (
                  <div className="flex items-center text-sm">
                    <PhoneIcon className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="text-gray-900">{client.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">Account Information</h5>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <CalendarIcon className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-900 ml-2">{formatDate(client.createdAt)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <CalendarIcon className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-gray-600">Updated:</span>
                  <span className="text-gray-900 ml-2">{formatDate(client.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Onboarding Progress */}
          <div className="mb-6">
            <h5 className="text-sm font-medium text-gray-700 mb-3">Onboarding Progress</h5>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Stage:</span>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStageColor(client.onboardingStage)}`}>
                  {client.onboardingStage}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Welcome</span>
                  <span>Scope</span>
                  <span>Timeline</span>
                  <span>Payment</span>
                  <span>Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        client.onboardingStage === 'welcome' ? '20%' :
                        client.onboardingStage === 'scope' ? '40%' :
                        client.onboardingStage === 'timeline' ? '60%' :
                        client.onboardingStage === 'payment' ? '80%' :
                        client.onboardingStage === 'completed' ? '100%' : '20%'
                      }`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Send Onboarding Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}