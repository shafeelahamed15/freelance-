'use client';

import { useState } from 'react';
import { EllipsisVerticalIcon, PencilIcon, TrashIcon, EyeIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import type { Client } from '@/types';

interface SimpleClientActionsProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  onView: (client: Client) => void;
  onSendEmail: (client: Client) => void;
}

export function SimpleClientActions({ client, onEdit, onDelete, onView, onSendEmail }: SimpleClientActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  console.log('SimpleClientActions - isOpen:', isOpen);

  return (
    <div className="relative">
      <button
        onClick={() => {
          console.log('Button clicked, toggling from:', isOpen, 'to:', !isOpen);
          setIsOpen(!isOpen);
        }}
        className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
      >
        <EllipsisVerticalIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50" onClick={() => setIsOpen(false)}>
          <div 
            className="absolute bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 w-48"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-1">
              <button
                onClick={() => {
                  console.log('View clicked');
                  onView(client);
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              >
                <EyeIcon className="w-4 h-4 mr-3" />
                View Details
              </button>
              
              <button
                onClick={() => {
                  console.log('Edit clicked');
                  onEdit(client);
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-gray-100"
              >
                <PencilIcon className="w-4 h-4 mr-3" />
                Edit Client
              </button>
              
              <button
                onClick={() => {
                  console.log('Send Email clicked');
                  onSendEmail(client);
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:text-green-800 hover:bg-gray-100"
              >
                <EnvelopeIcon className="w-4 h-4 mr-3" />
                Send Email
              </button>
              
              <button
                onClick={() => {
                  console.log('Delete clicked');
                  onDelete(client);
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-gray-100"
              >
                <TrashIcon className="w-4 h-4 mr-3" />
                Delete Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}