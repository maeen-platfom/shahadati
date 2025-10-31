'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  UserIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useNotifications } from '@/lib/hooks/useNotifications';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
  avatar?: string;
  lastLogin?: string;
  permissions: string[];
}

interface AdminHeaderProps {
  user: AdminUser;
  onLogout: () => void;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  notificationsCount?: number;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  user,
  onLogout,
  sidebarCollapsed = false,
  onToggleSidebar,
  notificationsCount = 0
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSystemMenuOpen, setIsSystemMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const { showInfo, showSuccess } = useNotifications();

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsProfileMenuOpen(false);
      setIsSystemMenuOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      showInfo('البحث', `البحث عن: ${searchQuery}`);
      // Implement admin search logic here
    }
  };

  const currentPageName = getCurrentPageName(pathname);
  
  const getCurrentPageName = (path: string): string => {
    const pageNames: Record<string, string> = {
      '/admin': 'لوحة التحكم',
      '/admin/certificates': 'الشهادات',
      '/admin/reports': 'التقارير',
      '/admin/users': 'المستخدمين',
      '/admin/settings': 'الإعدادات',
      '/admin/help': 'المساعدة',
    };

    for (const [route, name] of Object.entries(pageNames)) {
      if (path.startsWith(route)) {
        return name;
      }
    }
    return 'لوحة الإدارة';
  };

  const quickActions = [
    {
      name: 'إصدار شهادة جديدة',
      href: '/admin/certificates/new',
      icon: '📜',
      color: 'bg-blue-500',
    },
    {
      name: 'عرض التقارير',
      href: '/admin/reports',
      icon: '📊',
      color: 'bg-green-500',
    },
    {
      name: 'إعدادات النظام',
      href: '/admin/settings',
      icon: '⚙️',
      color: 'bg-purple-500',
    },
  ];

  const systemInfo = {
    version: '2.1.0',
    lastUpdate: '2025-10-31',
    uptime: '15 يوم، 3 ساعات',
    storageUsed: '68%',
    activeUsers: 1247,
    totalCertificates: 15842,
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4">
        
        {/* Right Section - Sidebar Toggle + Page Title */}
        <div className="flex items-center space-x-4 space-x-reverse">
          {/* Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            className={`
              p-2 rounded-lg text-gray-500 dark:text-gray-400
              hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200
              transition-colors duration-200
              ${sidebarCollapsed ? 'mx-auto' : ''}
            `}
            aria-label={sidebarCollapsed ? 'توسيع القائمة' : 'طي القائمة'}
          >
            <Bars3Icon className="w-5 h-5" />
          </button>

          {/* Page Title */}
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentPageName}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              مرحباً {user.name} • {new Date().toLocaleDateString('ar-SA', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="البحث في النظام..."
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
          </form>
        </div>

        {/* Left Section - Actions + User Menu */}
        <div className="flex items-center space-x-3 space-x-reverse">
          
          {/* Quick Actions */}
          <div className="hidden lg:flex items-center space-x-2 space-x-reverse">
            {quickActions.map((action, index) => (
              <Link
                key={action.name}
                href={action.href}
                className={`
                  p-2 rounded-lg transition-colors duration-200
                  hover:bg-gray-100 dark:hover:bg-gray-800
                  group relative
                `}
                title={action.name}
              >
                <span className="text-lg">{action.icon}</span>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                  {action.name}
                </div>
              </Link>
            ))}
          </div>

          {/* System Info Button */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsSystemMenuOpen(!isSystemMenuOpen);
              }}
              className={`
                p-2 rounded-lg text-gray-500 dark:text-gray-400
                hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200
                transition-colors duration-200
                ${isSystemMenuOpen ? 'bg-gray-100 dark:bg-gray-800' : ''}
              `}
              aria-label="معلومات النظام"
              aria-expanded={isSystemMenuOpen}
            >
              <CogIcon className="w-5 h-5" />
            </button>

            {isSystemMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsSystemMenuOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-80 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-20">
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      معلومات النظام
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">الإصدار:</span>
                        <span className="text-gray-900 dark:text-white font-medium">{systemInfo.version}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">آخر تحديث:</span>
                        <span className="text-gray-900 dark:text-white">{systemInfo.lastUpdate}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">وقت التشغيل:</span>
                        <span className="text-gray-900 dark:text-white">{systemInfo.uptime}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">المستخدمون النشطون:</span>
                        <span className="text-gray-900 dark:text-white">{systemInfo.activeUsers.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">إجمالي الشهادات:</span>
                        <span className="text-gray-900 dark:text-white">{systemInfo.totalCertificates.toLocaleString()}</span>
                      </div>
                      
                      {/* Storage Usage */}
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500 dark:text-gray-400">التخزين المستخدم:</span>
                          <span className="text-gray-900 dark:text-white">{systemInfo.storageUsed}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: systemInfo.storageUsed }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Notifications */}
          <button
            className={`
              relative p-2 rounded-lg text-gray-500 dark:text-gray-400
              hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200
              transition-colors duration-200
              ${notificationsCount > 0 ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''}
            `}
            aria-label={`الإشعارات (${notificationsCount})`}
            onClick={() => showInfo('الإشعارات', 'فتح قائمة الإشعارات')}
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
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsProfileMenuOpen(!isProfileMenuOpen);
              }}
              className={`
                flex items-center space-x-3 space-x-reverse p-2 rounded-lg
                text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800
                transition-colors duration-200
                ${isProfileMenuOpen ? 'bg-gray-100 dark:bg-gray-800' : ''}
              `}
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
              
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user.role === 'super_admin' ? 'مدير عام' : 'مدير'}
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
                <div className="absolute left-0 mt-2 w-64 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-20">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <UserCircleIcon className="w-10 h-10 text-gray-400" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          آخر دخول: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('ar-SA') : 'اليوم'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <Link
                      href="/admin/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <UserIcon className="w-4 h-4 ml-3" />
                      الملف الشخصي
                    </Link>
                    
                    <Link
                      href="/admin/settings/account"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <CogIcon className="w-4 h-4 ml-3" />
                      إعدادات الحساب
                    </Link>
                    
                    <Link
                      href="/admin/help"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <QuestionMarkCircleIcon className="w-4 h-4 ml-3" />
                      المساعدة والدعم
                    </Link>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                    
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onLogout();
                        showSuccess('تم تسجيل الخروج', 'تم تسجيل الخروج بنجاح');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4 ml-3" />
                      تسجيل الخروج
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Page Title */}
      <div className="md:hidden px-4 pb-3 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          {currentPageName}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString('ar-SA', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
    </header>
  );
};

export default AdminHeader;