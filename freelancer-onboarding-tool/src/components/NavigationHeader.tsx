'use client';

import { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  Users
} from 'lucide-react';

interface NavigationHeaderProps {
  onMenuClick?: () => void;
  searchPlaceholder?: string;
  title?: string;
  showSearch?: boolean;
}

export function NavigationHeader({ 
  onMenuClick, 
  searchPlaceholder = "Search...",
  title = "ClientHandle",
  showSearch = true 
}: NavigationHeaderProps) {
  const [searchValue, setSearchValue] = useState('');

  return (
    <header className="nav sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
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
            {title}
          </h1>
        </div>
      </div>
      
      {/* Search Bar */}
      {showSearch && (
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
                    style={{ color: 'oklch(var(--muted-foreground))' }} />
            <input 
              type="text" 
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="input w-full pl-10 pr-4 py-2"
            />
          </div>
        </div>
      )}
      
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
  );
}

export default NavigationHeader;