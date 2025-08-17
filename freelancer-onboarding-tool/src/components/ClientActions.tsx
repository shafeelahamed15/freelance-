'use client';

import { useState, useRef, useEffect } from 'react';
import { EllipsisVerticalIcon, PencilIcon, TrashIcon, EyeIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import type { Client } from '@/types';

interface ClientActionsProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  onView: (client: Client) => void;
  onSendEmail: (client: Client) => void;
}

export function ClientActions({ client, onEdit, onDelete, onView, onSendEmail }: ClientActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debug logging
  console.log('ClientActions render:', { clientId: client.id, isOpen });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const actions = [
    {
      label: 'View Details',
      icon: EyeIcon,
      onClick: () => {
        onView(client);
        setIsOpen(false);
      },
      color: 'text-gray-600 hover:text-gray-800'
    },
    {
      label: 'Edit Client',
      icon: PencilIcon,
      onClick: () => {
        onEdit(client);
        setIsOpen(false);
      },
      color: 'text-blue-600 hover:text-blue-800'
    },
    {
      label: 'Send Email',
      icon: EnvelopeIcon,
      onClick: () => {
        onSendEmail(client);
        setIsOpen(false);
      },
      color: 'text-green-600 hover:text-green-800'
    },
    {
      label: 'Delete Client',
      icon: TrashIcon,
      onClick: () => {
        onDelete(client);
        setIsOpen(false);
      },
      color: 'text-red-600 hover:text-red-800'
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
      >
        <EllipsisVerticalIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl ring-1 ring-black ring-opacity-5 z-[100]"
          style={{ position: 'absolute', top: '100%', right: 0 }}
        >
          <div className="py-1" role="menu">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`flex items-center w-full px-4 py-2 text-sm text-left ${action.color} hover:bg-gray-100 transition-colors focus:outline-none focus:bg-gray-100`}
                  role="menuitem"
                >
                  <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}