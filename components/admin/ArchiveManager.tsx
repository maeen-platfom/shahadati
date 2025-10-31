/**
 * مدير الأرشيف الرئيسي
 * Main Archive Manager Component
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Archive, 
  ArchiveRestore, 
  Settings, 
  Download,
  Upload,
  Trash2,
  Clock,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

import { 
  ArchivedFile, 
  ArchiveLog, 
  ArchiveSettings, 
  ArchiveStats, 
  ArchiveStatus,
  ArchiveSearchCriteria,
  ArchiveSearchResults
} from '@/types/archive';
import { 
  calculateArchiveStats,
  generateArchiveFileName,
  formatFileSize,
  cleanupOldArchives,
  validateArchiveSettings
} from '@/lib/utils/archive';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

import ArchiveSettingsComponent from './ArchiveSettings';
import ArchiveHistory from './ArchiveHistory';
import ArchiveRestoreComponent from './ArchiveRestore';

interface ArchiveManagerProps {
  className?: string;
}

export default function ArchiveManager({ className = '' }: ArchiveManagerProps) {
  // حالة البيانات
  const [archivedFiles, setArchivedFiles] = useState<ArchivedFile[]>([]);
  const [archiveLogs, setArchiveLogs] = useState<ArchiveLog[]>([]);
  const [settings, setSettings] = useState<ArchiveSettings | null>(null);
  const [stats, setStats] = useState<ArchiveStats | null>(null);
  
  // حالة العمليات
  const [isLoading, setIsLoading] = useState(true);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentOperation, setCurrentOperation] = useState('');
  
  // حالة الرسائل
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>>>([]);

  // تحميل البيانات الأولية
  useEffect(() => {
    loadInitialData();
  }, []);

  // تحديث الإحصائيات عند تغيير البيانات
  useEffect(() => {
    if (archivedFiles.length > 0 || archiveLogs.length > 0) {
      setStats(calculateArchiveStats(archivedFiles, archiveLogs));
    }
  }, [archivedFiles, archiveLogs]);

  /**
   * تحميل البيانات الأولية
   */
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      
      // تحميل الإعدادات
      const settingsResponse = await fetch('/api/archive/settings');
      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json();
        setSettings(settingsData);
      }

      // تحميل الملفات المؤرشفة
      const filesResponse = await fetch('/api/archive/files');
      if (filesResponse.ok) {
        const filesData = await filesResponse.json();
        setArchivedFiles(filesData.archivedFiles || []);
      }

      // تحميل السجلات
      const logsResponse = await fetch('/api/archive/logs');
      if (logsResponse.ok) {
        const logsData = await logsResponse.json();
        setArchiveLogs(logsData.archiveLogs || []);
      }

    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
      addNotification('error', 'خطأ في تحميل البيانات من الخادم');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * إضافة إشعار
   */
  const addNotification = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, type, message }]);
    
    // إزالة الإشعار بعد 5 ثوانٍ
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 5000);
  };

  /**
   * بدء عملية أرشفة تلقائية
   */
  const startAutoArchive = useCallback(async () => {
    if (!settings) return;

    try {
      setIsArchiving(true);
      setProgress(0);
      setCurrentOperation('جاري فحص البيانات للأرشفة...');

      const response = await fetch('/api/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'auto' })
      });

      if (!response.ok) {
        throw new Error('فشل في بدء عملية الأرشفة');
      }

      const result = await response.json();
      
      setProgress(100);
      setCurrentOperation('تمت الأرشفة بنجاح');
      
      // تحديث البيانات
      await loadInitialData();
      
      addNotification('success', `تمت أرشفة ${result.archivedCount} سجل بنجاح`);

    } catch (error) {
      console.error('خطأ في الأرشفة:', error);
      addNotification('error', 'حدث خطأ أثناء عملية الأرشفة');
    } finally {
      setIsArchiving(false);
      setProgress(0);
      setCurrentOperation('');
    }
  }, [settings]);

  /**
   * بدء عملية الأرشفة اليدوية
   */
  const startManualArchive = useCallback(async (criteria: ArchiveSearchCriteria) => {
    try {
      setIsArchiving(true);
      setProgress(0);
      setCurrentOperation('جاري أرشفة البيانات المحددة...');

      const response = await fetch('/api/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'manual', 
          criteria 
        })
      });

      if (!response.ok) {
        throw new Error('فشل في بدء عملية الأرشفة اليدوية');
      }

      const result = await response.json();
      
      setProgress(100);
      setCurrentOperation('تمت الأرشفة اليدوية بنجاح');
      
      // تحديث البيانات
      await loadInitialData();
      
      addNotification('success', `تمت أرشفة ${result.archivedCount} سجل يدوياً`);

    } catch (error) {
      console.error('خطأ في الأرشفة اليدوية:', error);
      addNotification('error', 'حدث خطأ أثناء الأرشفة اليدوية');
    } finally {
      setIsArchiving(false);
      setProgress(0);
      setCurrentOperation('');
    }
  }, []);

  /**
   * تنزيل ملف مؤرشف
   */
  const downloadArchivedFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/archive/download/${fileId}`);
      if (!response.ok) {
        throw new Error('فشل في تحميل الملف');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `archive_${fileId}.archive`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      addNotification('success', 'تم تحميل الملف بنجاح');

    } catch (error) {
      console.error('خطأ في تحميل الملف:', error);
      addNotification('error', 'فشل في تحميل الملف');
    }
  };

  /**
   * حذف ملف مؤرشف
   */
  const deleteArchivedFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/archive/files/${fileId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('فشل في حذف الملف');
      }

      // تحديث القائمة
      setArchivedFiles(prev => prev.filter(file => file.id !== fileId));
      
      addNotification('success', 'تم حذف الملف المؤرشف بنجاح');

    } catch (error) {
      console.error('خطأ في حذف الملف:', error);
      addNotification('error', 'فشل في حذف الملف');
    }
  };

  /**
   * تنظيف الأرشيفات القديمة
   */
  const cleanupOldArchives = async () => {
    try {
      const response = await fetch('/api/archive/cleanup', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('فشل في تنظيف الأرشيفات');
      }

      const result = await response.json();
      await loadInitialData();
      
      addNotification('success', `تم حذف ${result.deletedCount} ملف مؤرشف قديم`);

    } catch (error) {
      console.error('خطأ في تنظيف الأرشيفات:', error);
      addNotification('error', 'فشل في تنظيف الأرشيفات القديمة');
    }
  };

  /**
   * الحصول على أيقونة حالة الأرشيف
   */
  const getStatusIcon = (status: ArchiveStatus) => {
    switch (status) {
      case 'archived':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'archiving':
      case 'restoring':
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  /**
   * الحصول على لون شارة الحالة
   */
  const getStatusBadgeVariant = (status: ArchiveStatus) => {
    switch (status) {
      case 'archived':
        return 'default';
      case 'error':
        return 'destructive';
      case 'archiving':
      case 'restoring':
        return 'secondary';
      case 'pending':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-96 ${className}`}>
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>جاري تحميل بيانات الأرشيف...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* الإشعارات */}
      {notifications.map(notification => (
        <Alert key={notification.id} className="mb-4">
          {notification.type === 'error' && <XCircle className="h-4 w-4" />}
          {notification.type === 'success' && <CheckCircle className="h-4 w-4" />}
          {notification.type === 'warning' && <AlertCircle className="h-4 w-4" />}
          {notification.type === 'info' && <Archive className="h-4 w-4" />}
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      ))}

      {/* شريط الأدوات العلوي */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            إدارة الأرشيف
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            إدارة وحفظ الشهادات والملفات القديمة
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={loadInitialData}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ml-2 ${isLoading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
        </div>
      </div>

      {/* الإحصائيات السريعة */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الملفات المؤرشفة</CardTitle>
              <Archive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalArchivedFiles}</div>
              <p className="text-xs text-muted-foreground">
                نسبة الضغط: {stats.totalCompressionRatio.toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">حجم التخزين المؤرشف</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatFileSize(stats.totalCompressedSize)}
              </div>
              <p className="text-xs text-muted-foreground">
                من {formatFileSize(stats.totalArchiveSize)} أصلي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">العمليات المعلقة</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingArchiveCount}</div>
              <p className="text-xs text-muted-foreground">
                خطأ: {stats.errorArchiveCount}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">متوسط وقت الأرشفة</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(stats.averageArchivalTime)} ثانية
              </div>
              <p className="text-xs text-muted-foreground">
                النوع الأكثر أرشفة: {stats.mostArchivedDataType}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* شريط التقدم للعملية الجارية */}
      {(isArchiving || isRestoring) && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{currentOperation}</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* التبويبات الرئيسية */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="archive">الأرشيف</TabsTrigger>
          <TabsTrigger value="restore">الاستعادة</TabsTrigger>
          <TabsTrigger value="history">السجل</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        {/* تبويب النظرة العامة */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* إجراءات سريعة */}
            <Card>
              <CardHeader>
                <CardTitle>إجراءات سريعة</CardTitle>
                <CardDescription>
                  العمليات الشائعة لإدارة الأرشيف
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={startAutoArchive}
                  disabled={isArchiving || !settings?.autoArchiveEnabled}
                  className="w-full justify-start"
                >
                  <Archive className="w-4 h-4 ml-2" />
                  أرشفة تلقائية
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {/* فتح حوار الأرشفة اليدوية */}}
                >
                  <Upload className="w-4 h-4 ml-2" />
                  أرشفة يدوية
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={cleanupOldArchives}
                >
                  <Trash2 className="w-4 h-4 ml-2" />
                  تنظيف الأرشيفات القديمة
                </Button>
              </CardContent>
            </Card>

            {/* إعدادات الأرشفة السريعة */}
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الأرشفة</CardTitle>
                <CardDescription>
                  عرض الإعدادات الحالية للأرشيف التلقائي
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">الأرشفة التلقائية</span>
                      <Badge variant={settings.autoArchiveEnabled ? 'default' : 'secondary'}>
                        {settings.autoArchiveEnabled ? 'مفعلة' : 'معطلة'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">فترة الأرشفة</span>
                      <span className="text-sm text-muted-foreground">
                        {settings.archiveAfterDays} يوم
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">مستوى الضغط</span>
                      <Badge variant="outline">
                        {settings.compressionLevel}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">فترة الاحتفاظ</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.floor(settings.retentionPeriod / 365)} سنة
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* الملفات المؤرشفة الحديثة */}
          <Card>
            <CardHeader>
              <CardTitle>الملفات المؤرشفة الحديثة</CardTitle>
              <CardDescription>
                آخر الملفات المؤرشفة في النظام
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {archivedFiles.slice(0, 5).map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(file.status)}
                      <div>
                        <p className="font-medium">{file.fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {file.dataType} • {formatFileSize(file.fileSize)} • {file.archivedAt.toLocaleDateString('ar')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusBadgeVariant(file.status)}>
                        {file.status}
                      </Badge>
                      
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => downloadArchivedFile(file.id)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteArchivedFile(file.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {archivedFiles.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    لا توجد ملفات مؤرشفة بعد
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب الأرشيف */}
        <TabsContent value="archive">
          <ArchiveManagerFiles 
            archivedFiles={archivedFiles}
            onDownload={downloadArchivedFile}
            onDelete={deleteArchivedFile}
          />
        </TabsContent>

        {/* تبويب الاستعادة */}
        <TabsContent value="restore">
          <ArchiveRestoreComponent 
            onRestoreComplete={() => loadInitialData()}
          />
        </TabsContent>

        {/* تبويب السجل */}
        <TabsContent value="history">
          <ArchiveHistory logs={archiveLogs} />
        </TabsContent>

        {/* تبويب الإعدادات */}
        <TabsContent value="settings">
          <ArchiveSettingsComponent 
            settings={settings}
            onSettingsChange={setSettings}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * مكون عرض الملفات المؤرشفة
 */
function ArchiveManagerFiles({
  archivedFiles,
  onDownload,
  onDelete
}: {
  archivedFiles: ArchivedFile[];
  onDownload: (fileId: string) => void;
  onDelete: (fileId: string) => void;
}) {
  return (
    <div className="space-y-4">
      {archivedFiles.map((file) => (
        <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Archive className="w-8 h-8 text-blue-500" />
            <div>
              <p className="font-medium">{file.fileName}</p>
              <p className="text-sm text-muted-foreground">
                {file.dataType} • {formatFileSize(file.fileSize)} • {file.archivedAt.toLocaleDateString('ar')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={file.status === 'archived' ? 'default' : 'secondary'}>
              {file.status}
            </Badge>
            
            <Button size="sm" variant="ghost" onClick={() => onDownload(file.id)}>
              <Download className="w-4 h-4" />
            </Button>
            
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => onDelete(file.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
      
      {archivedFiles.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          لا توجد ملفات مؤرشفة
        </div>
      )}
    </div>
  );
}