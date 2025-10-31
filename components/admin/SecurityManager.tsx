/**
 * مدير الأمان الرئيسي لمنصة شهاداتي
 * Main Security Manager for Shahadati Platform
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Users, 
  AlertTriangle, 
  Database,
  Settings,
  Activity,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';
import { 
  SecurityConfig, 
  SecurityLevel, 
  AlertLevel,
  SecurityAlert,
  SecurityReport,
  UserSession
} from '@/types/security';

interface SecurityManagerProps {
  onTabChange?: (tab: string) => void;
  activeTab?: string;
}

export default function SecurityManager({ onTabChange, activeTab = 'overview' }: SecurityManagerProps) {
  const [securityConfig, setSecurityConfig] = useState<SecurityConfig | null>(null);
  const [recentAlerts, setRecentAlerts] = useState<SecurityAlert[]>([]);
  const [activeSessions, setActiveSessions] = useState<UserSession[]>([]);
  const [securityReport, setSecurityReport] = useState<SecurityReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // جلب بيانات الأمان عند تحميل المكون
  useEffect(() => {
    loadSecurityData();
  }, []);

  // جلب بيانات الأمان
  const loadSecurityData = async () => {
    try {
      setLoading(true);
      
      // جلب إعدادات الأمان
      const configResponse = await fetch('/api/security');
      if (configResponse.ok) {
        const config = await configResponse.json();
        setSecurityConfig(config);
      }
      
      // جلب التنبيهات الحديثة
      const alertsResponse = await fetch('/api/security?alerts=true&limit=10');
      if (alertsResponse.ok) {
        const alerts = await alertsResponse.json();
        setRecentAlerts(alerts);
      }
      
      // جلب الجلسات النشطة
      const sessionsResponse = await fetch('/api/security?sessions=true');
      if (sessionsResponse.ok) {
        const sessions = await sessionsResponse.json();
        setActiveSessions(sessions);
      }
      
      // جلب تقرير الأمان
      const reportResponse = await fetch('/api/security?report=true');
      if (reportResponse.ok) {
        const report = await reportResponse.json();
        setSecurityReport(report);
      }
    } catch (error) {
      console.error('خطأ في جلب بيانات الأمان:', error);
    } finally {
      setLoading(false);
    }
  };

  // تحديث البيانات
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSecurityData();
    setRefreshing(false);
  };

  // إعداد دالة تغيير التبويب
  const handleTabChange = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="mr-3 text-lg">جاري تحميل بيانات الأمان...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* رأس القسم */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-green-600 ml-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">مدير الأمان</h1>
              <p className="text-gray-600">مراقبة وإدارة أمان المنصة</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ml-2 ${refreshing ? 'animate-spin' : ''}`} />
              تحديث
            </button>
            
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Download className="h-4 w-4 ml-2" />
              تصدير التقرير
            </button>
          </div>
        </div>
      </div>

      {/* بطاقات الإحصائيات السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="التنبيهات النشطة"
          value={recentAlerts.filter(alert => !alert.resolved).length.toString()}
          icon={<AlertTriangle className="h-6 w-6 text-red-500" />}
          color="red"
          trend={recentAlerts.filter(alert => !alert.resolved).length > 0 ? 'increase' : 'stable'}
        />
        
        <StatCard
          title="الجلسات النشطة"
          value={activeSessions.length.toString()}
          icon={<Activity className="h-6 w-6 text-blue-500" />}
          color="blue"
          trend="stable"
        />
        
        <StatCard
          title="مستوى الأمان"
          value={getSecurityLevelText(getCurrentSecurityLevel())}
          icon={<Shield className="h-6 w-6 text-green-500" />}
          color="green"
          trend="stable"
        />
        
        <StatCard
          title="العمليات اليوم"
          value={getTodayOperationsCount().toString()}
          icon={<Database className="h-6 w-6 text-purple-500" />}
          color="purple"
          trend="stable"
        />
      </div>

      {/* التبويبات الرئيسية */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <TabButton
              active={activeTab === 'overview'}
              onClick={() => handleTabChange('overview')}
              icon={<Activity className="h-4 w-4" />}
            >
              نظرة عامة
            </TabButton>
            
            <TabButton
              active={activeTab === 'alerts'}
              onClick={() => handleTabChange('alerts')}
              icon={<AlertTriangle className="h-4 w-4" />}
            >
              التنبيهات
            </TabButton>
            
            <TabButton
              active={activeTab === 'sessions'}
              onClick={() => handleTabChange('sessions')}
              icon={<Users className="h-4 w-4" />}
            >
              الجلسات
            </TabButton>
            
            <TabButton
              active={activeTab === 'logs'}
              onClick={() => handleTabChange('logs')}
              icon={<Eye className="h-4 w-4" />}
            >
              السجلات
            </TabButton>
            
            <TabButton
              active={activeTab === 'settings'}
              onClick={() => handleTabChange('settings')}
              icon={<Settings className="h-4 w-4" />}
            >
              الإعدادات
            </TabButton>
          </nav>
        </div>

        <div className="p-6">
          {/* محتوى التبويبات */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* تنبيهات الأمان الحديثة */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">التنبيهات الحديثة</h3>
                <div className="space-y-3">
                  {recentAlerts.slice(0, 5).map((alert) => (
                    <AlertItem key={alert.id} alert={alert} />
                  ))}
                  
                  {recentAlerts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Shield className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>لا توجد تنبيهات أمنية حديثة</p>
                    </div>
                  )}
                </div>
              </div>

              {/* ملخص الأمان */}
              {securityReport && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">ملخص الأمان</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {securityReport.summary.totalEvents}
                        </div>
                        <div className="text-sm text-gray-600">إجمالي الأحداث</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {securityReport.summary.securityIncidents}
                        </div>
                        <div className="text-sm text-gray-600">حوادث أمنية</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {securityReport.summary.failedLogins}
                        </div>
                        <div className="text-sm text-gray-600">محاولات دخول فاشلة</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {securityReport.summary.activeUsers}
                        </div>
                        <div className="text-sm text-gray-600">مستخدمين نشطين</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">جميع التنبيهات</h3>
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  تحديد الكل كمقروء
                </button>
              </div>
              
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <AlertItem key={alert.id} alert={alert} showActions={true} />
                ))}
                
                {recentAlerts.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">لا توجد تنبيهات أمنية</p>
                    <p className="text-sm">المنصة تعمل بأمان تام</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">الجلسات النشطة</h3>
              
              <div className="space-y-3">
                {activeSessions.map((session) => (
                  <SessionItem key={session.id} session={session} />
                ))}
                
                {activeSessions.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">لا توجد جلسات نشطة</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">سجلات الأمان</h3>
              <p className="text-gray-600">سجلات مفصلة بأنشطة الأمان متوفرة في صفحة منفصلة</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">إعدادات الأمان</h3>
              <p className="text-gray-600">سيتم فتح صفحة الإعدادات المتقدمة</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * مكون بطاقة الإحصائيات
 */
function StatCard({ 
  title, 
  value, 
  icon, 
  color, 
  trend 
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'purple' | 'orange';
  trend: 'increase' | 'decrease' | 'stable';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200'
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 border-r-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="flex-shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}

/**
 * مكون زر التبويب
 */
function TabButton({ 
  active, 
  onClick, 
  icon, 
  children 
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
        active
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      <span className="ml-2">{icon}</span>
      {children}
    </button>
  );
}

/**
 * مكون عنصر التنبيه
 */
function AlertItem({ 
  alert, 
  showActions = false 
}: { 
  alert: SecurityAlert; 
  showActions?: boolean;
}) {
  const getLevelColor = (level: AlertLevel) => {
    switch (level) {
      case AlertLevel.CRITICAL: return 'text-red-700 bg-red-50 border-red-200';
      case AlertLevel.ERROR: return 'text-orange-700 bg-orange-50 border-orange-200';
      case AlertLevel.WARNING: return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-700 bg-blue-50 border-blue-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'security_breach': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'unauthorized_access': return <Eye className="h-4 w-4 text-orange-500" />;
      case 'failed_login': return <Lock className="h-4 w-4 text-yellow-500" />;
      default: return <Shield className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getLevelColor(alert.level)}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {getTypeIcon(alert.type)}
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{alert.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <span>{new Date(alert.timestamp).toLocaleString('ar-SA')}</span>
              {alert.userEmail && (
                <>
                  <span className="mx-2">•</span>
                  <span>{alert.userEmail}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {showActions && (
          <div className="flex items-center space-x-2">
            {alert.resolved ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                تم الحل
              </span>
            ) : (
              <button className="text-xs text-blue-600 hover:text-blue-800">
                تحديد كحل
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * مكون عنصر الجلسة
 */
function SessionItem({ session }: { session: UserSession }) {
  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900">{session.userEmail}</h4>
            <p className="text-sm text-gray-500">
              بدأت: {new Date(session.startTime).toLocaleString('ar-SA')}
            </p>
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <span>IP: {session.ipAddress}</span>
              {session.location && (
                <>
                  <span className="mx-2">•</span>
                  <span>{session.location.city}, {session.location.country}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {session.isActive ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              نشطة
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              غير نشطة
            </span>
          )}
          
          <button className="text-red-600 hover:text-red-800 text-sm">
            إنهاء الجلسة
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * وظائف مساعدة
 */
function getSecurityLevelText(level: SecurityLevel): string {
  const levels = {
    [SecurityLevel.LOW]: 'منخفض',
    [SecurityLevel.MEDIUM]: 'متوسط',
    [SecurityLevel.HIGH]: 'مرتفع',
    [SecurityLevel.CRITICAL]: 'حرج'
  };
  return levels[level] || 'غير معروف';
}

function getCurrentSecurityLevel(): SecurityLevel {
  // تحديد مستوى الأمان الحالي بناءً على البيانات
  return SecurityLevel.MEDIUM; // مؤقتاً
}

function getTodayOperationsCount(): number {
  // حساب عدد العمليات اليوم
  return 142; // مؤقتاً
}