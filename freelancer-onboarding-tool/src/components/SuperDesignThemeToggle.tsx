'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

export function SuperDesignThemeToggle({ className = '' }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      const currentTheme = document.documentElement.classList.contains('dark');
      setIsDark(currentTheme);
    };

    checkTheme();

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newTheme);
    setIsDark(!isDark);
    
    // Dispatch theme change event
    const event = new CustomEvent('themechange', {
      detail: { theme: newTheme }
    });
    document.dispatchEvent(event);
  };

  return (
    <button 
      onClick={toggleTheme}
      className={`theme-toggle relative inline-flex items-center justify-center w-10 h-10 rounded-lg cursor-pointer transition-all duration-200 ${className}`}
      style={{
        backgroundColor: 'oklch(var(--card))',
        border: '1px solid oklch(var(--border))',
        boxShadow: 'var(--shadow-xs)'
      }}
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <Sun 
          className="w-5 h-5 transition-all duration-200" 
          style={{ color: 'oklch(var(--muted-foreground))' }}
        />
      ) : (
        <Moon 
          className="w-5 h-5 transition-all duration-200" 
          style={{ color: 'oklch(var(--muted-foreground))' }}
        />
      )}
    </button>
  );
}

export default SuperDesignThemeToggle;