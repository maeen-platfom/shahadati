/**
 * تنبيهات الأمان لمنصة شهاداتي
 * Security Alerts Component for Shahadati Platform
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Shield, 
  Eye, 
  Filter, 
  Search, 
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MapPin,
  Zap,
  RefreshCw,
  Download,
  Archive,
  AlertCircle,
  Info,
  X
} from 'lucide-react';
import { 
  SecurityAlert, 
  AlertType, 
  AlertLevel 
} from '@/types/security';

interface SecurityAlertsProps {
  refreshInterval?: number;
  autoRefresh?: boolean;
}

export default function SecurityAlerts({ 
  refreshInterval = 30000, 
  autoRefresh = true 
}: SecurityAlertsProps) {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<AlertType | 'all'>('all');
  const [filterLevel, setFilterLevel] = useState<AlertLevel | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'resolved' | 'unresolved'>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // جلب التنبيهات عند تحميل المكون
  useEffect(() => {
    loadAlerts();
    
    // إعداد التحديث التلقائي
    if (autoRefresh) {
      const interval = setInterval(loadAlerts, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, autoRefresh]);

  // تصفية التنبيهات
  useEffect(() => {
    filterAlerts();
  }, [alerts, searchTerm, filterType, filterLevel, filterStatus, showUnreadOnly]);

  // تحميل التنبيهات
  const loadAlerts = async () => {
    try {
      const response = await fetch('/api/security?alerts=true');
      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('خطأ في تحميل التنبيهات:', error);
    } finally {
      setLoading(false);
    }
  };

  // تصفية التنبيهات
  const filterAlerts = () => {
    let filtered = alerts;

    // بحث
    if (searchTerm) {
      filtered = filtered.filter(alert => 
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // نوع التنبيه
    if (filterType !== 'all') {
      filtered = filtered.filter(alert => alert.type === filterType);
    }

    // مستوى التنبيه
    if (filterLevel !== 'all') {
      filtered = filtered.filter(alert => alert.level === filterLevel);
    }

    // حالة الحل
    if (filterStatus === 'resolved') {
      filtered = filtered.filter(alert => alert.resolved);
    } else if (filterStatus === 'unresolved') {
      filtered = filtered.filter(alert => !alert.resolved);
    }

    // غير مقروءة فقط
    if (showUnreadOnly) {
      filtered = filtered.filter(alert => !alert.resolved);
    }

    setFilteredAlerts(filtered);
  };

  // تحديد التنبيه كمقروء
  const handleMarkAsRead = async (alertId: string) => {
    try {
      const response = await fetch('/api/security', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'mark_alert_read',
          alertId
        }),
      });
      
      if (response.ok) {
        await loadAlerts();
      }
    } catch (error) {
      console.error('خطأ في تحديد التنبيه كمقروء:', error);
    }
  };

  // حل التنبيه
  const handleResolveAlert = async (alertId: string) => {
    try {
      const response = await fetch('/api/security', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'resolve_alert',
          alertId
        }),
      });
      
      if (response.ok) {
        await loadAlerts();
      }
    } catch (error) {
      console.error('خطأ في حل التنبيه:', error);
    }
  };

  // حذف التنبيه
  const handleDeleteAlert = async (alertId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التنبيه؟')) return;
    
    try {
      const response = await fetch('/api/security', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete_alert',
          alertId
        }),
      });
      
      if (response.ok) {
        await loadAlerts();
        setSelectedAlert(null);
      }
    } catch (error) {
      console.error('خطأ في حذف التنبيه:', error);
    }
  };

  // تصدير التنبيهات
  const handleExport = () => {
    const dataStr = JSON.stringify(filteredAlerts, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `security-alerts-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // إحصائيات التنبيهات
  const alertStats = {
    total: alerts.length,
    critical: alerts.filter(a => a.level === AlertLevel.CRITICAL && !a.resolved).length,
    warning: alerts.filter(a => a.level === AlertLevel.WARNING && !a.resolved).length,
    info: alerts.filter(a => a.level === AlertLevel.INFO && !a.resolved).length,
    resolved: alerts.filter(a => a.resolved).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="mr-3 text-lg">جاري تحميل تنبيهات الأمان...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600 ml-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">تنبيهات الأمان</h1>
              <p className="text-gray-600">مراقبة وإدارة التنبيهات الأمنية</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={loadAlerts}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4 ml-2" />
              تحديث
            </button>
            
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="h-4 w-4 ml-2" />
              تصدير
            </button>
          </div>
        </div>
        
        {/* آخر تحديث */}
        <div className="mt-4 text-sm text-gray-500">
          آخر تحديث: {lastUpdate.toLocaleString('ar-SA')}
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <StatCard
          title="إجمالي التنبيهات"
          value={alertStats.total.toString()}
          icon={<Bell className="h-6 w-6 text-blue-500" />}
          color="blue"
        />
        
        <StatCard
          title="حرجة"
          value={alertStats.critical.toString()}
          icon={<AlertCircle className="h-6 w-6 text-red-500" />}
          color="red"
        />
        
        <StatCard
          title="تحذيرات"
          value={alertStats.warning.toString()}
          icon={<AlertTriangle className="h-6 w-6 text-yellow-500" />}
          color="yellow"
        />
        
        <StatCard
          title="معلوماتية"
          value={alertStats.info.toString()}
          icon={<Info className="h-6 w-6 text-blue-500" />}
          color="blue"
        />
        
        <StatCard
          title="محلول"
          value={alertStats.resolved.toString()}
          icon={<CheckCircle className="h-6 w-6 text-green-500" />}
          color="green"
        />
      </div>

      {/* أدوات التصفية والبحث */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* بحث */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في التنبيهات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* فلتر النوع */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as AlertType | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">جميع الأنواع</option>
            {Object.values(AlertType).map(type => (
              <option key={type} value={type}>
                {getAlertTypeLabel(type)}
              </option>
            ))}
          </select>

          {/* فلتر المستوى */}
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value as AlertLevel | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">جميع المستويات</option>
            {Object.values(AlertLevel).map(level => (
              <option key={level} value={level}>
                {getAlertLevelLabel(level)}
              </option>
            ))}
          </select>

          {/* فلتر الحالة */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'resolved' | 'unresolved')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">جميع الحالات</option>
            <option value="unresolved">غير محلولة</option>
            <option value="resolved">محلولة</option>
          </select>

          {/* إظهار غير مقروءة فقط */}
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showUnreadOnly}
              onChange={(e) => setShowUnreadOnly(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="mr-2 text-sm text-gray-700">غير مقروءة فقط</span>
          </label>
        </div>
      </div>

      {/* قائمة التنبيهات */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* قائمة التنبيهات */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                التنبيهات ({filteredAlerts.length})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {filteredAlerts.map((alert) => (
                <AlertListItem
                  key={alert.id}
                  alert={alert}
                  onClick={() => setSelectedAlert(alert)}
                  onMarkAsRead={handleMarkAsRead}
                  onResolve={handleResolveAlert}
                />
              ))}
              
              {filteredAlerts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Shield className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">لا توجد تنبيهات مطابقة</p>
                  <p className="text-sm">جميع التنبيهات الأمنية سليمة</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* تفاصيل التنبيه */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">تفاصيل التنبيه</h2>
          </div>
          
          <div className="p-6">
            {selectedAlert ? (
              <AlertDetails alert={selectedAlert} onDelete={handleDeleteAlert} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Eye className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>اختر تنبيه لعرض التفاصيل</p>
              </div>
            )}
          </div>
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
  color 
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'yellow';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    yellow: 'bg-yellow-50 border-yellow-200'
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
 * مكون عنصر التنبيه في القائمة
 */
function AlertListItem({ 
  alert, 
  onClick, 
  onMarkAsRead, 
  onResolve 
}: {
  alert: SecurityAlert;
  onClick: () => void;
  onMarkAsRead: (id: string) => void;
  onResolve: (id: string) => void;
}) {
  const getLevelColor = (level: AlertLevel) => {
    switch (level) {
      case AlertLevel.CRITICAL: return 'border-r-red-500 bg-red-50';
      case AlertLevel.ERROR: return 'border-r-orange-500 bg-orange-50';
      case AlertLevel.WARNING: return 'border-r-yellow-500 bg-yellow-50';
      default: return 'border-r-blue-500 bg-blue-50';
    }
  };

  const getTypeIcon = (type: AlertType) => {
    switch (type) {
      case AlertType.SECURITY_BREACH: return <Shield className="h-4 w-4 text-red-500" />;
      case AlertType.UNAUTHORIZED_ACCESS: return <XCircle className="h-4 w-4 text-orange-500" />;
      case AlertType.FAILED_LOGIN: return <XCircle className="h-4 w-4 text-yellow-500" />;
      case AlertType.SUSPICIOUS_ACTIVITY: return <Eye className="h-4 w-4 text-purple-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div 
      className={`p-4 cursor-pointer border-r-4 ${getLevelColor(alert.level)} hover:bg-gray-50`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {getTypeIcon(alert.type)}
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">{alert.title}</h4>
              <div className="flex items-center space-x-2">
                {!alert.resolved && (
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    جديد
                  </span>
                )}
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  alert.resolved 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {alert.resolved ? 'محلول' : 'معلق'}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
            
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <Clock className="h-3 w-3 ml-1" />
              <span>{new Date(alert.timestamp).toLocaleString('ar-SA')}</span>
              
              {alert.userEmail && (
                <>
                  <User className="h-3 w-3 ml-2" />
                  <span>{alert.userEmail}</span>
                </>
              )}
              
              {alert.ipAddress && (
                <>
                  <MapPin className="h-3 w-3 ml-2" />
                  <span>{alert.ipAddress}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!alert.resolved && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onResolve(alert.id);
              }}
              className="text-green-600 hover:text-green-800 text-xs"
            >
              حل
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * مكون تفاصيل التنبيه
 */
function AlertDetails({ 
  alert, 
  onDelete 
}: {
  alert: SecurityAlert;
  onDelete: (id: string) => void;
}) {
  const getLevelColor = (level: AlertLevel) => {
    switch (level) {
      case AlertLevel.CRITICAL: return 'bg-red-100 text-red-800 border-red-200';
      case AlertLevel.ERROR: return 'bg-orange-100 text-orange-800 border-orange-200';
      case AlertLevel.WARNING: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getTypeIcon = (type: AlertType) => {
    switch (type) {
      case AlertType.SECURITY_BREACH: return <Shield className="h-5 w-5 text-red-500" />;
      case AlertType.UNAUTHORIZED_ACCESS: return <XCircle className="h-5 w-5 text-orange-500" />;
      case AlertType.FAILED_LOGIN: return <XCircle className="h-5 w-5 text-yellow-500" />;
      case AlertType.SUSPICIOUS_ACTIVITY: return <Eye className="h-5 w-5 text-purple-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* رأس التنبيه */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            {getTypeIcon(alert.type)}
            <div>
              <h3 className="font-semibold text-gray-900">{alert.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
            </div>
          </div>
          
          <button
            onClick={() => onDelete(alert.id)}
            className="text-red-600 hover:text-red-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* معلومات التنبيه */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">المستوى</label>
          <div className="mt-1">
            <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${getLevelColor(alert.level)}`}>
              {getAlertLevelLabel(alert.level)}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">النوع</label>
          <div className="mt-1 text-sm text-gray-900">
            {getAlertTypeLabel(alert.type)}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">الوقت</label>
          <div className="mt-1 text-sm text-gray-900">
            {new Date(alert.timestamp).toLocaleString('ar-SA')}
          </div>
        </div>

        {alert.userEmail && (
          <div>
            <label className="block text-sm font-medium text-gray-700">المستخدم</label>
            <div className="mt-1 text-sm text-gray-900">{alert.userEmail}</div>
          </div>
        )}

        {alert.ipAddress && (
          <div>
            <label className="block text-sm font-medium text-gray-700">عنوان IP</label>
            <div className="mt-1 text-sm text-gray-900">{alert.ipAddress}</div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">الحالة</label>
          <div className="mt-1">
            {alert.resolved ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 ml-1" />
                <span className="text-sm">محلول</span>
                {alert.resolvedAt && (
                  <span className="text-sm text-gray-500 mr-2">
                    ({new Date(alert.resolvedAt).toLocaleString('ar-SA')})
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <XCircle className="h-4 w-4 ml-1" />
                <span className="text-sm">معلق</span>
              </div>
            )}
          </div>
        </div>

        {alert.actions && alert.actions.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">الإجراءات المقترحة</label>
            <ul className="mt-1 text-sm text-gray-900">
              {alert.actions.map((action, index) => (
                <li key={index} className="flex items-start">
                  <Zap className="h-3 w-3 mt-1 ml-2 text-yellow-500" />
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}

        {Object.keys(alert.metadata).length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">بيانات إضافية</label>
            <div className="mt-1 bg-gray-50 rounded p-3 text-sm">
              <pre className="whitespace-pre-wrap text-gray-900">
                {JSON.stringify(alert.metadata, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * وظائف مساعدة
 */
function getAlertTypeLabel(type: AlertType): string {
  const labels = {
    [AlertType.SECURITY_BREACH]: 'اختراق أمني',
    [AlertType.UNAUTHORIZED_ACCESS]: 'وصول غير مصرح',
    [AlertType.FAILED_LOGIN]: 'فشل تسجيل الدخول',
    [AlertType.SUSPICIOUS_ACTIVITY]: 'نشاط مشبوه',
    [AlertType.DATA_BREACH]: 'تسريب بيانات',
    [AlertType.BACKUP_FAILED]: 'فشل النسخ الاحتياطي',
    [AlertType.ENCRYPTION_FAILED]: 'فشل التشفير',
    [AlertType.SYSTEM_ERROR]: 'خطأ في النظام'
  };
  return labels[type] || type;
}

function getAlertLevelLabel(level: AlertLevel): string {
  const labels = {
    [AlertLevel.CRITICAL]: 'حرج',
    [AlertLevel.ERROR]: 'خطأ',
    [AlertLevel.WARNING]: 'تحذير',
    [AlertLevel.INFO]: 'معلوماتي'
  };
  return labels[level] || level;
}