'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MagnifyingGlassIcon,
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CogIcon,
  DocumentDuplicateIcon,
  PlusIcon,
  ArrowRightIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';

interface Command {
  id: string;
  title: string;
  subtitle?: string;
  icon: any;
  action: () => void;
  keywords: string[];
  category: 'navigation' | 'actions' | 'settings';
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const commands: Command[] = useMemo(() => [
    // Navigation
    {
      id: 'nav-dashboard',
      title: 'Go to Dashboard',
      subtitle: 'View your business overview',
      icon: HomeIcon,
      action: () => router.push('/dashboard'),
      keywords: ['dashboard', 'home', 'overview', 'stats'],
      category: 'navigation'
    },
    {
      id: 'nav-clients',
      title: 'Go to Clients',
      subtitle: 'Manage your clients',
      icon: UserGroupIcon,
      action: () => router.push('/clients'),
      keywords: ['clients', 'customers', 'people', 'manage'],
      category: 'navigation'
    },
    {
      id: 'nav-invoices',
      title: 'Go to Invoices',
      subtitle: 'View and manage invoices',
      icon: DocumentTextIcon,
      action: () => router.push('/invoices'),
      keywords: ['invoices', 'billing', 'payments', 'money'],
      category: 'navigation'
    },
    {
      id: 'nav-templates',
      title: 'Go to Templates',
      subtitle: 'Email and document templates',
      icon: DocumentDuplicateIcon,
      action: () => router.push('/templates'),
      keywords: ['templates', 'email', 'documents'],
      category: 'navigation'
    },
    {
      id: 'nav-settings',
      title: 'Go to Settings',
      subtitle: 'Configure your account',
      icon: CogIcon,
      action: () => router.push('/settings'),
      keywords: ['settings', 'config', 'preferences', 'account'],
      category: 'navigation'
    },
    
    // Actions
    {
      id: 'action-add-client',
      title: 'Add New Client',
      subtitle: 'Create a new client record',
      icon: PlusIcon,
      action: () => {
        router.push('/clients');
        // Trigger add client modal here if available
      },
      keywords: ['add', 'new', 'client', 'create', 'customer'],
      category: 'actions'
    },
    {
      id: 'action-create-invoice',
      title: 'Create Invoice',
      subtitle: 'Generate a new invoice',
      icon: DocumentTextIcon,
      action: () => {
        router.push('/invoices');
        // Trigger create invoice modal here if available
      },
      keywords: ['create', 'invoice', 'bill', 'payment', 'new'],
      category: 'actions'
    }
  ], [router]);

  const filteredCommands = useMemo(() => {
    if (!search.trim()) return commands;
    
    const searchLower = search.toLowerCase();
    return commands.filter(command => 
      command.title.toLowerCase().includes(searchLower) ||
      command.subtitle?.toLowerCase().includes(searchLower) ||
      command.keywords.some(keyword => keyword.toLowerCase().includes(searchLower))
    );
  }, [commands, search]);

  const executeCommand = (command: Command) => {
    command.action();
    onClose();
    setSearch('');
    setSelectedIndex(0);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  if (!isOpen) return null;

  const categoryColors = {
    navigation: 'var(--primary)',
    actions: 'var(--success)',
    settings: 'var(--warning)'
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 backdrop-blur-md"
      style={{
        background: 'hsla(var(--neutral-h), var(--neutral-s), 0%, 0.4)',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        className="glass-card w-full max-w-2xl mx-4 overflow-hidden"
        style={{
          animation: 'slideInUp 0.3s cubic-bezier(0.23, 1, 0.320, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center border-b" style={{ 
          padding: 'var(--space-lg)',
          borderColor: 'var(--border)'
        }}>
          <MagnifyingGlassIcon className="w-5 h-5 mr-3" style={{ color: 'var(--foreground-muted)' }} />
          <input
            type="text"
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-lg"
            style={{
              color: 'var(--foreground)',
              fontFamily: 'var(--font-primary)',
              fontSize: '1rem'
            }}
            autoFocus
          />
          <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 text-xs font-mono rounded border" style={{
              background: 'var(--surface)',
              color: 'var(--foreground-muted)',
              borderColor: 'var(--border)'
            }}>
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Commands List */}
        <div className="max-h-96 overflow-y-auto scrollbar-hide">
          {filteredCommands.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <CommandLineIcon className="w-12 h-12 mx-auto mb-4 opacity-40" style={{ color: 'var(--foreground-muted)' }} />
                <p style={{ color: 'var(--foreground-muted)', fontSize: '0.875rem' }}>
                  No commands found for "{search}"
                </p>
              </div>
            </div>
          ) : (
            <div style={{ padding: 'var(--space-sm) 0' }}>
              {['navigation', 'actions', 'settings'].map(category => {
                const categoryCommands = filteredCommands.filter(cmd => cmd.category === category);
                if (categoryCommands.length === 0) return null;

                return (
                  <div key={category} className="mb-6 last:mb-0">
                    <div style={{ 
                      padding: 'var(--space-sm) var(--space-lg)',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: 'var(--foreground-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontFamily: 'var(--font-heading)'
                    }}>
                      {category}
                    </div>
                    {categoryCommands.map((command, index) => {
                      const globalIndex = filteredCommands.indexOf(command);
                      const isSelected = globalIndex === selectedIndex;
                      
                      return (
                        <div
                          key={command.id}
                          className={`flex items-center justify-between cursor-pointer transition-all duration-200 ${
                            isSelected ? 'neuro-card' : ''
                          }`}
                          style={{
                            padding: 'var(--space-md) var(--space-lg)',
                            margin: isSelected ? 'var(--space-xs) var(--space-sm)' : '0',
                            borderRadius: isSelected ? 'var(--space-md)' : '0',
                            background: isSelected ? 'var(--surface-elevated)' : 'transparent',
                          }}
                          onClick={() => executeCommand(command)}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                        >
                          <div className="flex items-center space-x-3">
                            <div 
                              className="p-2 rounded-lg"
                              style={{
                                background: isSelected 
                                  ? `${categoryColors[command.category]}20` 
                                  : 'var(--surface)',
                                color: categoryColors[command.category]
                              }}
                            >
                              <command.icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p style={{
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: 'var(--foreground)',
                                fontFamily: 'var(--font-heading)'
                              }}>
                                {command.title}
                              </p>
                              {command.subtitle && (
                                <p style={{
                                  fontSize: '0.75rem',
                                  color: 'var(--foreground-muted)',
                                  marginTop: '2px'
                                }}>
                                  {command.subtitle}
                                </p>
                              )}
                            </div>
                          </div>
                          {isSelected && (
                            <ArrowRightIcon 
                              className="w-4 h-4 opacity-60"
                              style={{ color: 'var(--foreground-muted)' }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t text-xs" style={{
          padding: 'var(--space-md) var(--space-lg)',
          borderColor: 'var(--border)',
          color: 'var(--foreground-muted)'
        }}>
          <div className="flex items-center space-x-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>esc Close</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)' }}>
            {filteredCommands.length} commands
          </div>
        </div>
      </div>
    </div>
  );
}

// Global hook for command palette
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    openPalette: () => setIsOpen(true),
    closePalette: () => setIsOpen(false)
  };
}