'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  UsersIcon,
  ShieldCheckIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  BellIcon,
  QrCodeIcon,
  ClockIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  LockClosedIcon,
  AdjustmentsHorizontalIcon,
  CloudIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';

interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ComponentType<any>;
  badge?: string;
  badgeColor?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  children?: NavigationItem[];
  description?: string;
}

interface NavigationProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  collapsed = false, 
  onToggle 
}) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const navigationItems: NavigationItem[] = [
    {
      name: 'لوحة التحكم',
      href: '/admin',
      icon: HomeIcon,
      description: 'نظرة عامة على النظام والإحصائيات'
    },
    {
      name: 'إدارة الشهادات',
      icon: DocumentTextIcon,
      description: 'إدارة وتتبع الشهادات الصادرة',
      children: [
        {
          name: 'جميع الشهادات',
          href: '/admin/certificates',
          icon: DocumentTextIcon,
          badge: '124',
          badgeColor: 'blue'
        },
        {
          name: 'تتبع التحقق',
          href: '/admin/verification',
          icon: EyeIcon,
          description: 'مراقبة عمليات التحقق'
        },
        {
          name: 'قوالب الشهادات',
          href: '/admin/templates',
          icon: DocumentDuplicateIcon,
          description: 'إدارة قوالب الشهادات'
        },
        {
          name: 'البحث السريع',
          href: '/admin/certificates/search',
          icon: QrCodeIcon,
          description: 'البحث في الشهادات باستخدام QR'
        }
      ]
    },
    {
      name: 'التقارير والإحصائيات',
      icon: ChartBarIcon,
      description: 'تقارير مفصلة وإحصائيات شاملة',
      children: [
        {
          name: 'تقرير النشاط',
          href: '/admin/reports/activity',
          icon: ClipboardDocumentListIcon,
          badge: 'جديد',
          badgeColor: 'green'
        },
        {
          name: 'إحصائيات التحقق',
          href: '/admin/reports/verification',
          icon: ChartBarIcon
        },
        {
          name: 'تقرير الأداء',
          href: '/admin/reports/performance',
          icon: ChartBarIcon
        },
        {
          name: 'تصدير البيانات',
          href: '/admin/reports/export',
          icon: CloudIcon,
          description: 'تصدير البيانات للتنسيقات المختلفة'
        }
      ]
    },
    {
      name: 'إدارة المستخدمين',
      icon: UsersIcon,
      description: 'إدارة حسابات المستخدمين والصلاحيات',
      children: [
        {
          name: 'المحاضرون',
          href: '/admin/users/instructors',
          icon: UserGroupIcon,
          badge: '45',
          badgeColor: 'blue'
        },
        {
          name: 'الطلاب',
          href: '/admin/users/students',
          icon: UsersIcon,
          badge: '1,234',
          badgeColor: 'green'
        },
        {
          name: 'رموز الوصول',
          href: '/admin/access-codes',
          icon: LockClosedIcon,
          description: 'إدارة رموز الوصول للمحاضرين'
        },
        {
          name: 'سجل النشاط',
          href: '/admin/activity-logs',
          icon: ClockIcon,
          description: 'سجل كامل لأنشطة المستخدمين'
        }
      ]
    },
    {
      name: 'الأمان والإعدادات',
      icon: ShieldCheckIcon,
      description: 'إعدادات الأمان والنظام',
      children: [
        {
          name: 'إعدادات النظام',
          href: '/admin/settings/system',
          icon: CogIcon
        },
        {
          name: 'الأمان والخصوصية',
          href: '/admin/settings/security',
          icon: ShieldCheckIcon,
          badge: 'مهم',
          badgeColor: 'red'
        },
        {
          name: 'النسخ الاحتياطية',
          href: '/admin/settings/backup',
          icon: CloudIcon
        },
        {
          name: 'التحديثات',
          href: '/admin/settings/updates',
          icon: AdjustmentsHorizontalIcon,
          badge: 'متوفر',
          badgeColor: 'purple'
        }
      ]
    },
    {
      name: 'المساعدة والدعم',
      icon: BellIcon,
      description: 'المساعدة والدعم التقني',
      children: [
        {
          name: 'مركز المساعدة',
          href: '/admin/help',
          icon: DocumentTextIcon
        },
        {
          name: 'الإشعارات',
          href: '/admin/notifications',
          icon: BellIcon,
          badge: '3',
          badgeColor: 'red'
        },
        {
          name: 'اتصل بالدعم',
          href: '/admin/support',
          icon: UsersIcon
        }
      ]
    }
  ];

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const isChildActive = (children: NavigationItem[] = []) => {
    return children.some(child => 
      child.href && isActive(child.href)
    );
  };

  const getBadgeColorClasses = (color: NavigationItem['badgeColor']) => {
    const classes = {
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    };
    return classes[color || 'blue'];
  };

  const renderNavItem = (item: NavigationItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const isCurrentActive = item.href ? isActive(item.href) : isChildActive(item.children);

    return (
      <div key={item.name}>
        {item.href ? (
          <Link
            href={item.href}
            className={`
              group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium
              transition-all duration-200 relative
              ${isCurrentActive
                ? 'bg-primary text-white shadow-lg'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary'
              }
              ${level > 0 ? 'mr-6 pr-6' : ''}
              ${collapsed ? 'justify-center px-3' : ''}
            `}
            title={collapsed ? item.name : undefined}
          >
            <div className="flex items-center">
              <item.icon className={`
                ${collapsed ? 'w-5 h-5' : 'w-5 h-5 ml-3'}
                ${isCurrentActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-primary'}
                transition-colors duration-200
              `} />
              
              {!collapsed && (
                <>
                  <span className="font-medium">{item.name}</span>
                  
                  {item.badge && (
                    <span className={`
                      inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                      ${getBadgeColorClasses(item.badgeColor)}
                      mr-auto mr-2
                    `}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </div>

            {!collapsed && hasChildren && (
              <ChevronLeftIcon className={`
                w-4 h-4 transition-transform duration-200
                ${isExpanded ? 'rotate-90' : 'rotate-0'}
                ${isCurrentActive ? 'text-white' : 'text-gray-400'}
              `} />
            )}
          </Link>
        ) : (
          <button
            onClick={() => hasChildren && toggleExpanded(item.name)}
            className={`
              group w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium
              transition-all duration-200
              ${isCurrentActive || isExpanded
                ? 'bg-primary text-white shadow-lg'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary'
              }
              ${level > 0 ? 'mr-6 pr-6' : ''}
              ${collapsed ? 'justify-center px-3' : ''}
            `}
            title={collapsed ? item.name : undefined}
          >
            <div className="flex items-center">
              <item.icon className={`
                ${collapsed ? 'w-5 h-5' : 'w-5 h-5 ml-3'}
                ${isCurrentActive || isExpanded ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-primary'}
                transition-colors duration-200
              `} />
              
              {!collapsed && (
                <>
                  <span className="font-medium">{item.name}</span>
                  
                  {item.badge && (
                    <span className={`
                      inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                      ${getBadgeColorClasses(item.badgeColor)}
                      mr-auto mr-2
                    `}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </div>

            {!collapsed && hasChildren && (
              <ChevronLeftIcon className={`
                w-4 h-4 transition-transform duration-200
                ${isExpanded ? 'rotate-90' : 'rotate-0'}
                ${isCurrentActive || isExpanded ? 'text-white' : 'text-gray-400'}
              `} />
            )}
          </button>
        )}

        {/* Children */}
        {!collapsed && hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children?.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={`
      bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700
      transition-all duration-300 ease-in-out
      ${collapsed ? 'w-16' : 'w-72'}
      flex flex-col h-full
    `}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                لوحة الإدارة
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                نظام إدارة شامل
              </p>
            </div>
          )}
          
          <button
            onClick={onToggle}
            className={`
              p-2 rounded-lg text-gray-500 dark:text-gray-400
              hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200
              transition-colors duration-200
              ${collapsed ? 'mx-auto' : ''}
            `}
            aria-label={collapsed ? 'توسيع القائمة' : 'طي القائمة'}
          >
            <ChevronLeftIcon className={`
              w-5 h-5 transition-transform duration-200
              ${collapsed ? 'rotate-180' : ''}
            `} />
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {navigationItems.map(item => renderNavItem(item))}
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            <p>نظام شهاداتي</p>
            <p>الإصدار 2.1.0</p>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;