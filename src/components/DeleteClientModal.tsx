'use client';

import { useState } from 'react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { FirestoreService, collections } from '@/lib/firestore';
import type { Client } from '@/types';

interface DeleteClientModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteClientModal({ client, isOpen, onClose, onSuccess }: DeleteClientModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!client) return;

    setIsDeleting(true);
    setError('');

    try {
      await FirestoreService.delete(collections.clients, client.id);
      onSuccess();
    } catch (error) {
      console.error('Error deleting client:', error);
      setError('Failed to delete client. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-start p-6">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
          </div>
          <div className="mt-0 ml-4 text-left">
            <h3 className="text-lg font-medium text-gray-900">Delete Client</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete <strong>{client.name}</strong>? 
                This action cannot be undone and will permanently remove all client data, 
                including onboarding progress and communication history.
              </p>
            </div>
          </div>
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Delete Client'}
          </button>
        </div>
      </div>
    </div>
  );
}