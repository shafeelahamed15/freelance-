'use client';

import { useTheme } from '@/hooks/useTheme';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { SunIcon as SunIconSolid, MoonIcon as MoonIconSolid } from '@heroicons/react/24/solid';

interface ThemeToggleProps {
  variant?: 'default' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
}

export function ThemeToggle({ variant = 'default', size = 'md' }: ThemeToggleProps) {
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const getIcon = () => {
    if (theme === 'system') {
      return <ComputerDesktopIcon className={iconSizes[size]} />;
    }
    
    if (resolvedTheme === 'dark') {
      return variant === 'minimal' ? 
        <SunIcon className={iconSizes[size]} /> : 
        <SunIconSolid className={iconSizes[size]} />;
    }
    
    return variant === 'minimal' ? 
      <MoonIcon className={iconSizes[size]} /> : 
      <MoonIconSolid className={iconSizes[size]} />;
  };

  const getLabel = () => {
    if (theme === 'system') return 'System theme';
    return theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
        relative inline-flex items-center justify-center
        rounded-lg border border-gray-200 dark:border-gray-800
        bg-white dark:bg-gray-900
        text-gray-700 dark:text-gray-300
        hover:bg-gray-50 dark:hover:bg-gray-800
        hover:text-gray-900 dark:hover:text-gray-100
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
        transition-all duration-200
        hover:scale-105 active:scale-95
      `}
      aria-label={getLabel()}
      title={getLabel()}
    >
      {getIcon()}
    </button>
  );
}