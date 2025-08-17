'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CommandPalette, useCommandPalette } from '@/components/CommandPalette';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  HomeIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  CogIcon,
  ArrowRightOnRectangleIcon,
  DocumentDuplicateIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Clients', href: '/clients', icon: UserGroupIcon },
  { name: 'Invoices', href: '/invoices', icon: DocumentTextIcon },
  { name: 'Templates', href: '/templates', icon: DocumentDuplicateIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { isOpen, openPalette, closePalette } = useCommandPalette();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="flex flex-col w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  ClientHandle
                </h1>
              </div>
            </div>
            <ThemeToggle variant="minimal" size="sm" />
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-4 py-3 rounded-lg transition-all duration-200
                    ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`
                      p-2 rounded-lg transition-all duration-200
                      ${
                        isActive 
                          ? 'bg-white/20' 
                          : 'bg-gray-200 dark:bg-gray-600 group-hover:bg-gray-300 dark:group-hover:bg-gray-500'
                      }
                    `}>
                      <item.icon className={`
                        w-5 h-5 transition-all duration-200
                        ${
                          isActive 
                            ? 'text-white' 
                            : 'text-blue-600 dark:text-blue-400'
                        }
                      `} />
                    </div>
                    <span className="font-medium text-sm">
                      {item.name}
                    </span>
                  </div>
                  {isActive && (
                    <div className="ml-auto w-1 h-6 rounded-full bg-white/30"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Command Palette Trigger */}
          <div className="px-6 pb-4">
            <button
              onClick={openPalette}
              className="w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
            >
              <div className="flex items-center space-x-2">
                <CommandLineIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Quick Actions</span>
              </div>
              <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded border">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* User Profile Section */}
          <div className="mx-6 mb-6 p-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                    <span className="text-lg font-bold text-white">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                      Online
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                title="Sign out"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
          <main className="flex-1 overflow-y-auto p-8">
            <div className="w-full max-w-none">
              {children}
            </div>
          </main>
        </div>
      </div>
      
      {/* Command Palette */}
      <CommandPalette isOpen={isOpen} onClose={closePalette} />
    </div>
  );
}