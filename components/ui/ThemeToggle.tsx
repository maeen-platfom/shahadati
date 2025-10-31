'use client';

import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

type Theme = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'dropdown';
  showLabel?: boolean;
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  size = 'md',
  variant = 'button',
  showLabel = false,
  className = ''
}) => {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);
    
    // Get saved theme from localStorage or default to system
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('system');
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    let effectiveTheme: 'dark' | 'light';
    if (theme === 'system') {
      effectiveTheme = systemTheme;
    } else {
      effectiveTheme = theme;
    }

    // Apply theme
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(systemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const getThemeIcon = (currentTheme: Theme) => {
    switch (currentTheme) {
      case 'light':
        return <SunIcon className={getSizeClasses(size)} />;
      case 'dark':
        return <MoonIcon className={getSizeClasses(size)} />;
      case 'system':
        return <ComputerDesktopIcon className={getSizeClasses(size)} />;
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-6 h-6';
      default:
        return 'w-5 h-5';
    }
  };

  const getButtonSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'p-1.5';
      case 'lg':
        return 'p-3';
      default:
        return 'p-2';
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  if (!mounted) {
    return (
      <div className={`inline-flex items-center space-x-2 ${className}`}>
        <div className={`${getButtonSizeClasses(size)} rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse`} />
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={`relative inline-block ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            ${getButtonSizeClasses(size)}
            inline-flex items-center justify-center rounded-lg
            bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
            text-gray-700 dark:text-gray-200
            hover:bg-gray-50 dark:hover:bg-gray-700
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50
          `}
          aria-label="تبديل المظهر"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {getThemeIcon(theme)}
          {showLabel && (
            <span className="mr-2 text-sm font-medium">
              {theme === 'light' ? 'فاتح' : theme === 'dark' ? 'داكن' : 'النظام'}
            </span>
          )}
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-20">
              <div className="py-1">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`
                    w-full px-4 py-2 text-right text-sm
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    transition-colors duration-200
                    ${theme === 'light' ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-200'}
                  `}
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <SunIcon className="w-4 h-4" />
                    <span>المظهر الفاتح</span>
                  </div>
                </button>
                
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`
                    w-full px-4 py-2 text-right text-sm
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    transition-colors duration-200
                    ${theme === 'dark' ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-200'}
                  `}
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <MoonIcon className="w-4 h-4" />
                    <span>المظهر الداكن</span>
                  </div>
                </button>
                
                <button
                  onClick={() => handleThemeChange('system')}
                  className={`
                    w-full px-4 py-2 text-right text-sm
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    transition-colors duration-200
                    ${theme === 'system' ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-200'}
                  `}
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <ComputerDesktopIcon className="w-4 h-4" />
                    <span>تابع النظام</span>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Simple button variant
  return (
    <button
      onClick={() => handleThemeChange(theme === 'light' ? 'dark' : 'light')}
      className={`
        ${getButtonSizeClasses(size)}
        inline-flex items-center justify-center rounded-lg
        bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
        text-gray-700 dark:text-gray-200
        hover:bg-gray-50 dark:hover:bg-gray-700
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50
        ${className}
      `}
      aria-label="تبديل المظهر"
    >
      {getThemeIcon(theme)}
      {showLabel && (
        <span className="mr-2 text-sm font-medium">
          {theme === 'light' ? 'فاتح' : 'داكن'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;