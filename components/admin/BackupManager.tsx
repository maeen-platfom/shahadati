/**
 * مدير النسخ الاحتياطية لمنصة شهاداتي
 * Backup Manager Component for Shahadati Platform
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  Settings, 
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Play,
  Pause,
  Trash2,
  Eye,
  Shield,
  HardDrive,
  Cloud,
  Archive,
  Calendar,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { 
  BackupSettings, 
  BackupOperation,
  SecurityLevel 
} from '@/types/security';
import { 
  createFullBackup,
  createIncrementalBackup,
  restoreFromBackup,
  getBackupHistory,
  cleanupOldBackups,
  DEFAULT_BACKUP_SETTINGS
} from '@/lib/utils/backup';

export default function BackupManager() {
  const [settings, setSettings] = useState<BackupSettings>(DEFAULT_BACKUP_SETTINGS);
  const [backupHistory, setBackupHistory] = useState<BackupOperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState<'none' | 'full' | 'incremental'>('none');
  const [restoring, setRestoring] = useState<string | null>(null);
  const [selectedBackup, setSelectedBackup] = useState<BackupOperation | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    loadBackupData();
  }, []);

  // تحميل بيانات النسخ الاحتياطية
  const loadBackupData = async () => {
    try {
      setLoading(true);
      
      // جلب الإعدادات
      const settingsResponse = await fetch('/api/security/backup?settings=true');
      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json();
        setSettings(settingsData);
      }
      
      // جلب التاريخ
      const historyResponse = await fetch('/api/security/backup?history=true');
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setBackupHistory(historyData);
      }
    } catch (error) {
      console.error('خطأ في تحميل بيانات النسخ الاحتياطية:', error);
    } finally {
      setLoading(false);
    }
  };

  // حفظ الإعدادات
  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/security/backup', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'save_settings',
          settings
        }),
      });
      
      if (response.ok) {
        await loadBackupData();
        setShowSettings(false);
      }
    } catch (error) {
      console.error('خطأ في حفظ الإعدادات:', error);
    }
  };

  // إنشاء نسخة احتياطية كاملة
  const handleCreateFullBackup = async () => {
    setCreating('full');
    
    try {
      const response = await fetch('/api/security/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_backup',
          type: 'full'
        }),
      });
      
      if (response.ok) {
        await loadBackupData();
      }
    } catch (error) {
      console.error('خطأ في إنشاء النسخة الاحتياطية:', error);
    } finally {
      setCreating('none');
    }
  };

  // إنشاء نسخة احتياطية تزايدية
  const handleCreateIncrementalBackup = async () => {
    setCreating('incremental');
    
    try {
      const response = await fetch('/api/security/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_backup',
          type: 'incremental'
        }),
      });
      
      if (response.ok) {
        await loadBackupData();
      }
    } catch (error) {
      console.error('خطأ في إنشاء النسخة الاحتياطية التزايدية:', error);
    } finally {
      setCreating('none');
    }
  };

  // استعادة من نسخة احتياطية
  const handleRestoreBackup = async (operationId: string) => {
    if (!confirm('هل أنت متأكد من الاستعادة؟ سيتم استبدال البيانات الحالية.')) {
      return;
    }
    
    setRestoring(operationId);
    
    try {
      const response = await fetch('/api/security/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'restore_backup',
          operationId
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`تم الاستعادة بنجاح. السجلات المستعادة: ${result.restoredRecords}`);
        await loadBackupData();
      }
    } catch (error) {
      console.error('خطأ في الاستعادة:', error);
      alert('فشل في الاستعادة');
    } finally {
      setRestoring(null);
    }
  };

  // حذف نسخة احتياطية
  const handleDeleteBackup = async (operationId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه النسخة الاحتياطية؟')) {
      return;
    }
    
    try {
      const response = await fetch('/api/security/backup', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete_backup',
          operationId
        }),
      });
      
      if (response.ok) {
        await loadBackupData();
      }
    } catch (error) {
      console.error('خطأ في حذف النسخة الاحتياطية:', error);
    }
  };

  // تنظيف النسخ القديمة
  const handleCleanup = async () => {
    try {
      const response = await fetch('/api/security/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'cleanup_old_backups'
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`تم حذف ${result.deletedCount} نسخة احتياطية قديمة`);
        await loadBackupData();
      }
    } catch (error) {
      console.error('خطأ في التنظيف:', error);
    }
  };

  // حساب الإحصائيات
  const backupStats = {
    total: backupHistory.length,
    completed: backupHistory.filter(b => b.status === 'completed').length,
    failed: backupHistory.filter(b => b.status === 'failed').length,
    totalSize: backupHistory
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + b.size, 0),
    averageDuration: backupHistory
      .filter(b => b.status === 'completed')
      .reduce((sum, b, _, arr) => sum + b.duration / arr.length, 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="mr-3 text-lg">جاري تحميل بيانات النسخ الاحتياطية...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Database className="h-8 w-8 text-indigo-600 ml-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">مدير النسخ الاحتياطية</h1>
              <p className="text-gray-600">إدارة وحماية البيانات بالنسخ الاحتياطية الآمنة</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`flex items-center px-4 py-2 rounded-lg ${
                showSettings 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Settings className="h-4 w-4 ml-2" />
              الإعدادات
            </button>
            
            <button
              onClick={loadBackupData}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4 ml-2" />
              تحديث
            </button>
          </div>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي النسخ"
          value={backupStats.total.toString()}
          icon={<Archive className="h-6 w-6 text-blue-500" />}
          color="blue"
        />
        
        <StatCard
          title="مكتملة"
          value={backupStats.completed.toString()}
          icon={<CheckCircle className="h-6 w-6 text-green-500" />}
          color="green"
        />
        
        <StatCard
          title="فاشلة"
          value={backupStats.failed.toString()}
          icon={<XCircle className="h-6 w-6 text-red-500" />}
          color="red"
        />
        
        <StatCard
          title="الحجم الإجمالي"
          value={formatBytes(backupStats.totalSize)}
          icon={<HardDrive className="h-6 w-6 text-purple-500" />}
          color="purple"
        />
      </div>

      {/* إعدادات النسخ الاحتياطي */}
      {showSettings && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">إعدادات النسخ الاحتياطي</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">تفعيل النسخ الاحتياطي</label>
                  <p className="text-sm text-gray-500">تشغيل أو إيقاف النظام</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enabled}
                    onChange={(e) => setSettings({...settings, enabled: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تكرار النسخ
                </label>
                <select
                  value={settings.frequency}
                  onChange={(e) => setSettings({...settings, frequency: e.target.value as any})}
                  disabled={!settings.enabled}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                >
                  <option value="hourly">كل ساعة</option>
                  <option value="daily">يومي</option>
                  <option value="weekly">أسبوعي</option>
                  <option value="monthly">شهري</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  مدة الاحتفاظ (يوم)
                </label>
                <input
                  type="number"
                  value={settings.retentionDays}
                  onChange={(e) => setSettings({...settings, retentionDays: Number(e.target.value)})}
                  disabled={!settings.enabled}
                  min="1"
                  max="365"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  مستوى الضغط
                </label>
                <select
                  value={settings.compressionLevel}
                  onChange={(e) => setSettings({...settings, compressionLevel: e.target.value as any})}
                  disabled={!settings.enabled}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                >
                  <option value="fast">سريع (ضغط أقل)</option>
                  <option value="normal">متوسط</option>
                  <option value="maximum">أقصى ضغط</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">تشفير النسخ</label>
                  <p className="text-sm text-gray-500">حماية النسخ بالتشفير</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.encryption}
                    onChange={(e) => setSettings({...settings, encryption: e.target.checked})}
                    disabled={!settings.enabled}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  موقع التخزين
                </label>
                <select
                  value={settings.storageLocation}
                  onChange={(e) => setSettings({...settings, storageLocation: e.target.value as any})}
                  disabled={!settings.enabled}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                >
                  <option value="local">محلي فقط</option>
                  <option value="cloud">سحابي فقط</option>
                  <option value="both">محلي وسحابي</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحد الأقصى للحجم (MB)
                </label>
                <input
                  type="number"
                  value={settings.maxSize}
                  onChange={(e) => setSettings({...settings, maxSize: Number(e.target.value)})}
                  disabled={!settings.enabled}
                  min="100"
                  max="50000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">تضمين المرفقات</label>
                  <p className="text-sm text-gray-500">نسخ الملفات والملفات المرفقة</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.includeAttachments}
                    onChange={(e) => setSettings({...settings, includeAttachments: e.target.checked})}
                    disabled={!settings.enabled}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end mt-6">
            <button
              onClick={handleSaveSettings}
              className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <CheckCircle className="h-4 w-4 ml-2" />
              حفظ الإعدادات
            </button>
          </div>
        </div>
      )}

      {/* أزرار العمليات */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">عمليات النسخ الاحتياطي</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleCreateFullBackup}
            disabled={creating !== 'none' || !settings.enabled}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating === 'full' ? (
              <>
                <RefreshCw className="h-5 w-5 ml-2 animate-spin" />
                جاري الإنشاء...
              </>
            ) : (
              <>
                <Database className="h-5 w-5 ml-2" />
                نسخة احتياطية كاملة
              </>
            )}
          </button>

          <button
            onClick={handleCreateIncrementalBackup}
            disabled={creating !== 'none' || !settings.enabled}
            className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating === 'incremental' ? (
              <>
                <RefreshCw className="h-5 w-5 ml-2 animate-spin" />
                جاري الإنشاء...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 ml-2" />
                نسخة تزايدية
              </>
            )}
          </button>

          <button
            onClick={handleCleanup}
            className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Trash2 className="h-5 w-5 ml-2" />
            تنظيف النسخ القديمة
          </button>
        </div>
      </div>

      {/* تاريخ النسخ الاحتياطية */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            تاريخ النسخ الاحتياطية ({backupHistory.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  النوع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحجم
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المدة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الضغط
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {backupHistory.map((backup) => (
                <BackupRow
                  key={backup.id}
                  backup={backup}
                  onView={() => setSelectedBackup(backup)}
                  onRestore={() => handleRestoreBackup(backup.id)}
                  onDelete={() => handleDeleteBackup(backup.id)}
                  restoring={restoring === backup.id}
                />
              ))}
            </tbody>
          </table>
          
          {backupHistory.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Archive className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">لا توجد نسخ احتياطية</p>
              <p className="text-sm">ابدأ بإنشاء أول نسخة احتياطية</p>
            </div>
          )}
        </div>
      </div>

      {/* تفاصيل النسخة الاحتياطية */}
      {selectedBackup && (
        <BackupDetails 
          backup={selectedBackup} 
          onClose={() => setSelectedBackup(null)}
          onRestore={() => handleRestoreBackup(selectedBackup.id)}
          onDelete={() => handleDeleteBackup(selectedBackup.id)}
          restoring={restoring === selectedBackup.id}
        />
      )}
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
  color: 'blue' | 'green' | 'red' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    purple: 'bg-purple-50 border-purple-200'
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
 * مكون صف النسخة الاحتياطية
 */
function BackupRow({ 
  backup, 
  onView, 
  onRestore, 
  onDelete, 
  restoring 
}: {
  backup: BackupOperation;
  onView: () => void;
  onRestore: () => void;
  onDelete: () => void;
  restoring: boolean;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'مكتمل';
      case 'failed': return 'فاشل';
      case 'running': return 'جاري';
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'full': return 'كاملة';
      case 'incremental': return 'تزايدية';
      case 'differential': return 'تفاضلية';
      default: return type;
    }
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 ml-2 text-gray-400" />
          {new Date(backup.timestamp).toLocaleString('ar-SA')}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
          {getTypeLabel(backup.type)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(backup.status)}`}>
          {getStatusLabel(backup.status)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatBytes(backup.size)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {Math.floor(backup.duration / 60)}:{String(backup.duration % 60).padStart(2, '0')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {(backup.compressionRatio * 100).toFixed(1)}%
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button
            onClick={onView}
            className="text-blue-600 hover:text-blue-900"
          >
            <Eye className="h-4 w-4" />
          </button>
          {backup.status === 'completed' && (
            <>
              <button
                onClick={onRestore}
                disabled={restoring}
                className="text-green-600 hover:text-green-900 disabled:opacity-50"
              >
                {restoring ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={onDelete}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

/**
 * مكون تفاصيل النسخة الاحتياطية
 */
function BackupDetails({ 
  backup, 
  onClose, 
  onRestore, 
  onDelete, 
  restoring 
}: {
  backup: BackupOperation;
  onClose: () => void;
  onRestore: () => void;
  onDelete: () => void;
  restoring: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">تفاصيل النسخة الاحتياطية</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">المعرف</label>
              <div className="mt-1 text-sm text-gray-900 font-mono">{backup.id}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">النوع</label>
              <div className="mt-1 text-sm text-gray-900">{backup.type}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">الحالة</label>
              <div className="mt-1 text-sm text-gray-900">{backup.status}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">التاريخ</label>
              <div className="mt-1 text-sm text-gray-900">
                {new Date(backup.timestamp).toLocaleString('ar-SA')}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">الحجم</label>
              <div className="mt-1 text-sm text-gray-900">{formatBytes(backup.size)}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">المدة</label>
              <div className="mt-1 text-sm text-gray-900">
                {Math.floor(backup.duration / 60)}:{String(backup.duration % 60).padStart(2, '0')}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">ملفات</label>
              <div className="mt-1 text-sm text-gray-900">{backup.filesCount}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">معدل الضغط</label>
              <div className="mt-1 text-sm text-gray-900">{(backup.compressionRatio * 100).toFixed(1)}%</div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">الموقع</label>
            <div className="mt-1 text-sm text-gray-900 font-mono">{backup.location}</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Checksum</label>
            <div className="mt-1 text-sm text-gray-900 font-mono">{backup.checksum}</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">مشفر</label>
            <div className="mt-1 text-sm text-gray-900">
              {backup.encrypted ? 'نعم' : 'لا'}
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-4">
          {backup.status === 'completed' && (
            <button
              onClick={onRestore}
              disabled={restoring}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {restoring ? (
                <>
                  <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                  جاري الاستعادة...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 ml-2" />
                  استعادة
                </>
              )}
            </button>
          )}
          
          <button
            onClick={onDelete}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 ml-2" />
            حذف
          </button>
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * وظائف مساعدة
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}