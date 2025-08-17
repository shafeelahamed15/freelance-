'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * SuperDesign Enhanced Dark Mode System
 * Features:
 * - System preference detection
 * - Smooth transitions
 * - localStorage persistence
 * - Custom event dispatching
 * - Accessibility support
 */
export class SuperDesignThemeManager {
  constructor() {
    this.init();
  }

  init() {
    this.setInitialTheme();
    this.listenForSystemChanges();
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.setupEventListeners();
        this.updateUI();
      });
    } else {
      this.setupEventListeners();
      this.updateUI();
    }
  }

  setInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (savedTheme === null && systemPrefersDark);

    if (shouldUseDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  getCurrentTheme() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }

  toggleTheme() {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  setTheme(theme: 'light' | 'dark') {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('theme', theme);
    this.updateUI();
    this.dispatchThemeChangeEvent(theme);
  }

  updateUI() {
    const isDark = this.getCurrentTheme() === 'dark';
    
    // Update theme toggle icons
    document.querySelectorAll('.theme-toggle').forEach(toggle => {
      const sunIcon = toggle.querySelector('.sun-icon');
      const moonIcon = toggle.querySelector('.moon-icon');
      
      if (sunIcon && moonIcon) {
        if (isDark) {
          (sunIcon as HTMLElement).style.display = 'block';
          (moonIcon as HTMLElement).style.display = 'none';
        } else {
          (sunIcon as HTMLElement).style.display = 'none';
          (moonIcon as HTMLElement).style.display = 'block';
        }
      }
    });

    // Re-initialize icons if using Lucide
    if ((window as any).lucide) {
      setTimeout(() => {
        (window as any).lucide.createIcons();
      }, 100);
    }
  }

  listenForSystemChanges() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  setupEventListeners() {
    // Add click listeners to all theme toggle buttons
    document.querySelectorAll('.theme-toggle').forEach(button => {
      button.addEventListener('click', () => {
        this.toggleTheme();
      });
    });

    // Add keyboard support
    document.querySelectorAll('.theme-toggle').forEach(button => {
      button.addEventListener('keydown', (e: any) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleTheme();
        }
      });
    });
  }

  dispatchThemeChangeEvent(theme: string) {
    const event = new CustomEvent('themechange', {
      detail: { theme }
    });
    document.dispatchEvent(event);
  }

  getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  resetToSystemPreference() {
    localStorage.removeItem('theme');
    this.setTheme(this.getSystemPreference() as 'light' | 'dark');
  }
}

/**
 * SuperDesign Theme Toggle Component
 * React component wrapper for the theme system
 */
export function SuperDesignThemeToggle({ className = '' }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check initial theme
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (savedTheme === null && systemPrefersDark);
    
    setIsDark(shouldUseDark);

    // Initialize theme manager
    const themeManager = new SuperDesignThemeManager();

    // Listen for theme changes
    const handleThemeChange = (e: any) => {
      setIsDark(e.detail.theme === 'dark');
    };

    document.addEventListener('themechange', handleThemeChange);

    return () => {
      document.removeEventListener('themechange', handleThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newTheme);
  };

  if (!mounted) {
    return (
      <button 
        className={`theme-toggle ${className}`}
        aria-label="Toggle dark mode"
        disabled
      >
        <div className="theme-toggle-icon w-5 h-5" />
      </button>
    );
  }

  return (
    <button 
      className={`theme-toggle ${className}`}
      aria-label="Toggle dark mode"
      onClick={toggleTheme}
    >
      <Sun className={`theme-toggle-icon sun-icon ${!isDark ? 'hidden' : 'block'}`} />
      <Moon className={`theme-toggle-icon moon-icon ${isDark ? 'hidden' : 'block'}`} />
    </button>
  );
}

// Global theme manager initialization
if (typeof window !== 'undefined') {
  window.superDesignThemeManager = new SuperDesignThemeManager();
}

// Global functions for backward compatibility
if (typeof window !== 'undefined') {
  (window as any).toggleTheme = () => window.superDesignThemeManager?.toggleTheme();
  (window as any).setTheme = (theme: string) => window.superDesignThemeManager?.setTheme(theme as 'light' | 'dark');
  (window as any).getCurrentTheme = () => window.superDesignThemeManager?.getCurrentTheme();
}

declare global {
  interface Window {
    superDesignThemeManager?: SuperDesignThemeManager;
  }
}