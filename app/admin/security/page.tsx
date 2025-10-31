/**
 * صفحة الأمان الرئيسية لمنصة شهاداتي
 * Main Security Page for Shahadati Platform
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Users, 
  AlertTriangle, 
  Database,
  Settings,
  Activity,
  Eye,
  Key,
  Bell
} from 'lucide-react';
import SecurityManager from '@/components/admin/SecurityManager';
import EncryptionSettings from '@/components/admin/EncryptionSettings';
import AccessControl from '@/components/admin/AccessControl';
import SecurityAlerts from '@/components/admin/SecurityAlerts';
import BackupManager from '@/components/admin/BackupManager';

// بيانات تجربة للتطوير
const mockSecurityData = {
  alerts: [
    {
      id: '1',
      timestamp: new Date(),
      type: 'failed_login',
      level: 'warning',
      title: 'محاولات دخول متعددة فاشلة',
      message: 'تم رصد 5 محاولات دخول فاشلة من IP: 192.168.1.100',
      userId: null,
      userEmail: 'suspicious@example.com',
      ipAddress: '192.168.1.100',
      resolved: false,
      resolvedAt: null,
      resolvedBy: null,
      actions: [
        'تحقق من صحة كلمة السر',
        'فحص تاريخ الجهاز',
        'تمكين التحقق بخطوتين'
      ],
      metadata: {
        attempts: 5,
        lastAttempt: new Date().toISOString(),
        timeframe: '15 minutes'
      }
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 3600000),
      type: 'suspicious_activity',
      level: 'error',
      title: 'نشاط مشبوه في النظام',
      message: 'محاولة وصول غير عادية من جهاز جديد',
      userId: 'user123',
      userEmail: 'user@example.com',
      ipAddress: '203.0.113.1',
      resolved: true,
      resolvedAt: new Date(Date.now() - 1800000),
      resolvedBy: 'admin@shahadati.com',
      actions: [
        'مراجعة سجلات الوصول',
        'تحديث الصلاحيات'
      ],
      metadata: {
        location: 'Unknown',
        device: 'New Device',
        action: 'bulk_certificate_generation'
      }
    }
  ],
  sessions: [
    {
      id: 'session1',
      userId: 'user1',
      userEmail: 'instructor@shahadati.com',
      ipAddress: '192.168.1.10',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      startTime: new Date(),
      lastActivity: new Date(),
      isActive: true,
      location: {
        country: 'المملكة العربية السعودية',
        city: 'الرياض',
        timezone: 'Asia/Riyadh'
      }
    },
    {
      id: 'session2',
      userId: 'user2',
      userEmail: 'admin@shahadati.com',
      ipAddress: '192.168.1.15',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      startTime: new Date(Date.now() - 7200000),
      lastActivity: new Date(Date.now() - 300000),
      isActive: true,
      location: {
        country: 'المملكة العربية السعودية',
        city: 'جدة',
        timezone: 'Asia/Riyadh'
      }
    }
  ],
  roles: [
    {
      role: 'super_admin',
      permissions: [
        'create_certificate',
        'read_certificate', 
        'update_certificate',
        'delete_certificate',
        'generate_access_code',
        'manage_users',
        'manage_security',
        'view_logs',
        'backup_data',
        'restore_data'
      ],
      resourceRestrictions: {},
      timeRestrictions: undefined
    },
    {
      role: 'admin',
      permissions: [
        'create_certificate',
        'read_certificate',
        'update_certificate',
        'generate_access_code',
        'manage_users',
        'view_logs'
      ],
      resourceRestrictions: {
        certificates: 1000,
        accessCodes: 50
      }
    },
    {
      role: 'instructor',
      permissions: [
        'create_certificate',
        'read_certificate',
        'update_certificate',
        'generate_access_code'
      ],
      resourceRestrictions: {
        certificates: 100,
        accessCodes: 10
      }
    }
  ],
  backupHistory: [
    {
      id: 'backup1',
      timestamp: new Date(),
      type: 'full',
      status: 'completed',
      size: 52428800, // 50MB
      duration: 180, // 3 minutes
      filesCount: 1250,
      compressionRatio: 0.6,
      location: 'backup_backup1_1640995200000.json',
      checksum: 'a1b2c3d4e5f6789012345678901234567890abcd',
      encrypted: true
    },
    {
      id: 'backup2', 
      timestamp: new Date(Date.now() - 86400000), // yesterday
      type: 'incremental',
      status: 'completed',
      size: 10485760, // 10MB
      duration: 45,
      filesCount: 150,
      compressionRatio: 0.4,
      location: 'backup_backup2_1640908800000.json',
      checksum: 'fedcba0987654321fedcba0987654321fedcba09',
      encrypted: true
    }
  ]
};

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // محاكاة تحميل البيانات
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    {
      id: 'overview',
      label: 'نظرة عامة',
      icon: Activity,
      description: 'مراقبة أمان شاملة'
    },
    {
      id: 'encryption',
      label: 'التشفير',
      icon: Lock,
      description: 'إعدادات التشفير والأمان'
    },
    {
      id: 'access',
      label: 'الصلاحيات',
      icon: Users,
      description: 'إدارة أدوار وصلاحيات المستخدمين'
    },
    {
      id: 'alerts',
      label: 'التنبيهات',
      icon: Bell,
      description: 'مراقبة وإدارة التنبيهات الأمنية'
    },
    {
      id: 'backup',
      label: 'النسخ الاحتياطية',
      icon: Database,
      description: 'إدارة النسخ الاحتياطية والحماية'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">جاري تحميل لوحة الأمان</h2>
          <p className="text-gray-600">يرجى الانتظار...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* شريط التنقل العلوي */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 ml-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">مركز الأمان</h1>
                <p className="text-sm text-gray-500">منصة شهاداتي - إدارة الأمان المتقدمة</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <div className="h-2 w-2 bg-green-400 rounded-full ml-2"></div>
                النظام آمن
              </div>
              
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 left-0 block h-2 w-2 bg-red-400 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* شريط التبويبات */}
        <div className="mb-8">
          <nav className="flex space-x-8 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 ml-2" />
                  <div className="text-right">
                    <div className="font-semibold">{tab.label}</div>
                    <div className="text-xs opacity-75">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* محتوى التبويبات */}
        <div className="transition-all duration-300">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <SecurityManager 
                activeTab="overview" 
                onTabChange={setActiveTab}
              />
            </div>
          )}

          {activeTab === 'encryption' && (
            <div className="space-y-6">
              <EncryptionSettings />
            </div>
          )}

          {activeTab === 'access' && (
            <div className="space-y-6">
              <AccessControl 
                onRoleChange={(roleId) => console.log('Role changed:', roleId)}
              />
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <SecurityAlerts 
                autoRefresh={true}
                refreshInterval={30000}
              />
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-6">
              <BackupManager />
            </div>
          )}
        </div>
      </div>

      {/* شريط الحالة السفلي */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-400 rounded-full ml-2"></div>
                أمان نشط
              </div>
              <div>آخر تحديث: {new Date().toLocaleString('ar-SA')}</div>
              <div>الإصدار: 1.0.0</div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span>© 2024 منصة شهاداتي</span>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>محمي بأعلى معايير الأمان</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}