'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bars3Icon, 
  XMarkIcon, 
  BellIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon 
} from '@heroicons/react/24/outline';
import ThemeToggle from './ThemeToggle';
import NotificationSystem from './NotificationSystem';
import { useNotifications } from '@/lib/hooks/useNotifications';

interface User {
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  avatar?: string;
}

interface ResponsiveHeaderProps {
  user?: User;
  onLogout?: () => void;
  notificationsCount?: number;
  onNotificationClick?: () => void;
}

const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({
  user,
  onLogout,
  notificationsCount = 0,
  onNotificationClick
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const { showInfo } = useNotifications();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      showInfo('البحث', `البحث عن: ${searchQuery}`);
      // Implement search logic here
    }
  };

  const navigationItems = [
    { name: 'الرئيسية', href: '/', current: pathname === '/' },
    { name: 'الشهادات', href: '/certificates', current: pathname.startsWith('/certificates') },
    { name: 'التحقق', href: '/verify', current: pathname.startsWith('/verify') },
  ];

  const getRoleDisplay = (role: User['role']) => {
    switch (role) {
      case 'student': return 'طالب';
      case 'instructor': return 'محاضر';
      case 'admin': return 'مدير';
      default: return 'مستخدم';
    }
  };

  return (
    <>
      <header className={`
        sticky top-0 z-40 transition-all duration-300
        ${isScrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg border-b border-gray-200/20 dark:border-gray-700/20' 
          : 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'
        }
      `}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 space-x-reverse">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ش</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  شهاداتي
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                    ${item.current
                      ? 'bg-primary text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4 space-x-reverse">
              
              {/* Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="البحث..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="
                    w-64 pl-10 pr-4 py-2 text-sm
                    bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                    rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                    transition-colors duration-200
                  "
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </form>

              {/* Notifications */}
              <button
                onClick={onNotificationClick}
                className="
                  relative p-2 rounded-lg text-gray-600 dark:text-gray-300
                  hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800
                  transition-colors duration-200
                "
                aria-label="الإشعارات"
              >
                <BellIcon className="w-5 h-5" />
                {notificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notificationsCount > 99 ? '99+' : notificationsCount}
                  </span>
                )}
              </button>

              {/* Theme Toggle */}
              <ThemeToggle variant="button" size="md" />

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="
                      flex items-center space-x-3 space-x-reverse p-2 rounded-lg
                      text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800
                      transition-colors duration-200
                    "
                    aria-label="قائمة المستخدم"
                    aria-expanded={isProfileMenuOpen}
                    aria-haspopup="true"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <UserCircleIcon className="w-8 h-8" />
                    )}
                    <div className="hidden lg:block text-right">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {getRoleDisplay(user.role)}
                      </p>
                    </div>
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>

                  {isProfileMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsProfileMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-20">
                        <div className="py-1">
                          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {user.email}
                            </p>
                          </div>
                          
                          <Link
                            href="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            الملف الشخصي
                          </Link>
                          
                          <Link
                            href="/settings"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            الإعدادات
                          </Link>
                          
                          <button
                            onClick={() => {
                              setIsProfileMenuOpen(false);
                              onLogout?.();
                            }}
                            className="block w-full text-right px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            تسجيل الخروج
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="
                    px-4 py-2 text-sm font-medium text-white bg-primary
                    hover:bg-primary-dark rounded-lg transition-colors duration-200
                  "
                >
                  تسجيل الدخول
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2 space-x-reverse">
              <ThemeToggle variant="button" size="sm" />
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="
                  p-2 rounded-lg text-gray-600 dark:text-gray-300
                  hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800
                  transition-colors duration-200
                "
                aria-label="فتح القائمة"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
              <div className="py-4 space-y-2">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="px-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="البحث..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="
                        w-full pl-10 pr-4 py-2 text-sm
                        bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                        rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                        transition-colors duration-200
                      "
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </form>

                {/* Mobile Navigation Items */}
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      block px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                      ${item.current
                        ? 'bg-primary text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Mobile User Actions */}
                {user ? (
                  <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                    <div className="flex items-center space-x-3 space-x-reverse mb-3">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <UserCircleIcon className="w-8 h-8 text-gray-400" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {getRoleDisplay(user.role)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Link
                        href="/profile"
                        className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        الملف الشخصي
                      </Link>
                      
                      <Link
                        href="/settings"
                        className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        الإعدادات
                      </Link>
                      
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          onLogout?.();
                        }}
                        className="block w-full text-right px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                      >
                        تسجيل الخروج
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                    <Link
                      href="/login"
                      className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      تسجيل الدخول
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Notification System */}
      <NotificationSystem />
    </>
  );
};

export default ResponsiveHeader;