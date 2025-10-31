/**
 * استعادة البيانات المؤرشفة
 * Archive Restore Component
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArchiveRestore, 
  Search, 
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Filter,
  Calendar,
  FileText,
  Database,
  Play,
  Pause
} from 'lucide-react';

import { 
  ArchivedFile, 
  RestoreLog,
  ArchiveStatus,
  ArchiveSearchCriteria,
  ArchiveSearchResults,
  RestoreOperationResult,
  RestoreProgress
} from '@/types/archive';
import { formatFileSize } from '@/lib/utils/archive';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface ArchiveRestoreProps {
  onRestoreComplete?: () => void;
}

export default function ArchiveRestoreComponent({ onRestoreComplete }: ArchiveRestoreProps) {
  // حالة البيانات
  const [archivedFiles, setArchivedFiles] = useState<ArchivedFile[]>([]);
  const [restoreLogs, setRestoreLogs] = useState<RestoreLog[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  
  // حالة البحث والتصفية
  const [searchTerm, setSearchTerm] = useState('');
  const [dataTypeFilter, setDataTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('archived');
  const [dateRange, setDateRange] = useState<string>('all');
  
  // حالة العملية
  const [isSearching, setIsSearching] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreProgress, setRestoreProgress] = useState<RestoreProgress | null>(null);
  const [currentRestore, setCurrentRestore] = useState<string | null>(null);
  
  // حالة الرسائل
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>>([]);

  // تحميل البيانات الأولية
  useEffect(() => {
    loadArchivedFiles();
    loadRestoreLogs();
  }, []);

  /**
   * إضافة إشعار
   */
  const addNotification = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, type, message }]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 5000);
  };

  /**
   * تحميل الملفات المؤرشفة
   */
  const loadArchivedFiles = async () => {
    try {
      const response = await fetch('/api/archive/files');
      if (response.ok) {
        const data = await response.json();
        setArchivedFiles(data.archivedFiles || []);
      }
    } catch (error) {
      console.error('خطأ في تحميل الملفات المؤرشفة:', error);
      addNotification('error', 'خطأ في تحميل الملفات المؤرشفة');
    }
  };

  /**
   * تحميل سجلات الاستعادة
   */
  const loadRestoreLogs = async () => {
    try {
      const response = await fetch('/api/archive/restore/logs');
      if (response.ok) {
        const data = await response.json();
        setRestoreLogs(data.restoreLogs || []);
      }
    } catch (error) {
      console.error('خطأ في تحميل سجلات الاستعادة:', error);
      addNotification('error', 'خطأ في تحميل سجلات الاستعادة');
    }
  };

  /**
   * البحث في الملفات المؤرشفة
   */
  const searchArchivedFiles = async () => {
    if (!searchTerm.trim()) {
      addNotification('warning', 'يرجى إدخال مصطلح البحث');
      return;
    }

    try {
      setIsSearching(true);

      const criteria: ArchiveSearchCriteria = {
        fileName: searchTerm,
        ...(dataTypeFilter !== 'all' && { dataType: dataTypeFilter as any }),
        ...(statusFilter !== 'all' && { status: statusFilter as any }),
      };

      const response = await fetch('/api/archive/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(criteria)
      });

      if (!response.ok) {
        throw new Error('فشل في البحث');
      }

      const results: ArchiveSearchResults = await response.json();
      setArchivedFiles(results.archivedFiles);
      
      addNotification('success', `تم العثور على ${results.totalCount} ملف`);

    } catch (error) {
      console.error('خطأ في البحث:', error);
      addNotification('error', 'فشل في البحث في الملفات المؤرشفة');
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * تحديد/إلغاء تحديد الملف
   */
  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  /**
   * تحديد جميع الملفات
   */
  const selectAllFiles = () => {
    if (selectedFiles.length === archivedFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(archivedFiles.map(file => file.id));
    }
  };

  /**
   * بدء عملية الاستعادة
   */
  const startRestore = async () => {
    if (selectedFiles.length === 0) {
      addNotification('warning', 'يرجى تحديد ملف واحد على الأقل للاستعادة');
      return;
    }

    try {
      setIsRestoring(true);
      setCurrentRestore(selectedFiles[0]);
      setRestoreProgress({
        totalRecords: selectedFiles.length,
        restoredRecords: 0,
        failedRecords: 0,
        currentOperation: 'بدء عملية الاستعادة...',
        estimatedTimeRemaining: 0,
        percentage: 0
      });

      const response = await fetch('/api/archive/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileIds: selectedFiles,
          restoreOptions: {
            overwriteExisting: false,
            createBackup: true
          }
        })
      });

      if (!response.ok) {
        throw new Error('فشل في بدء عملية الاستعادة');
      }

      const result: RestoreOperationResult = await response.json();
      
      if (result.success) {
        addNotification('success', `تم استعادة ${result.restoredRecords} ملف بنجاح`);
        onRestoreComplete?.();
        await loadRestoreLogs();
      } else {
        addNotification('error', `فشل في استعادة ${result.failedRecords.length} ملف`);
      }

    } catch (error) {
      console.error('خطأ في الاستعادة:', error);
      addNotification('error', 'حدث خطأ أثناء عملية الاستعادة');
    } finally {
      setIsRestoring(false);
      setCurrentRestore(null);
      setRestoreProgress(null);
      setSelectedFiles([]);
    }
  };

  /**
   * معاينة الملف المؤرشف
   */
  const previewArchivedFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/archive/preview/${fileId}`);
      if (!response.ok) {
        throw new Error('فشل في معاينة الملف');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');

    } catch (error) {
      console.error('خطأ في معاينة الملف:', error);
      addNotification('error', 'فشل في معاينة الملف');
    }
  };

  /**
   * تنزيل الملف المؤرشف
   */
  const downloadArchivedFile = async (fileId: string, fileName: string) => {
    try {
      const response = await fetch(`/api/archive/download/${fileId}`);
      if (!response.ok) {
        throw new Error('فشل في تحميل الملف');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
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
   * الحصول على أيقونة نوع البيانات
   */
  const getDataTypeIcon = (dataType: string) => {
    switch (dataType) {
      case 'certificate':
        return <FileText className="w-4 h-4" />;
      case 'student_data':
      case 'verification_log':
      case 'activity_log':
        return <Database className="w-4 h-4" />;
      default:
        return <ArchiveRestore className="w-4 h-4" />;
    }
  };

  /**
   * الحصول على لون شارة الحالة
   */
  const getStatusBadgeVariant = (status: ArchiveStatus) => {
    switch (status) {
      case 'archived':
        return 'default';
      case 'restored':
        return 'secondary';
      case 'error':
        return 'destructive';
      case 'pending':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  // تصفية الملفات المؤرشفة
  const filteredFiles = archivedFiles.filter(file => {
    if (searchTerm && !file.fileName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (dataTypeFilter !== 'all' && file.dataType !== dataTypeFilter) {
      return false;
    }
    if (statusFilter !== 'all' && file.status !== statusFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* الإشعارات */}
      {notifications.map(notification => (
        <Alert key={notification.id} className="mb-4">
          {notification.type === 'error' && <XCircle className="h-4 w-4" />}
          {notification.type === 'success' && <CheckCircle className="h-4 w-4" />}
          {notification.type === 'warning' && <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      ))}

      {/* شريط التقدم للاستعادة */}
      {isRestoring && restoreProgress && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span className="font-medium">جاري الاستعادة...</span>
                </div>
                <Badge variant="secondary">
                  {restoreProgress.percentage}%
                </Badge>
              </div>
              
              <Progress value={restoreProgress.percentage} className="w-full" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">تم الاستعادة:</span>
                  <span className="font-medium mr-2">
                    {restoreProgress.restoredRecords} من {restoreProgress.totalRecords}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">فشلت:</span>
                  <span className="font-medium mr-2 text-red-600">
                    {restoreProgress.failedRecords}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">الوقت المتبقي:</span>
                  <span className="font-medium mr-2">
                    {Math.round(restoreProgress.estimatedTimeRemaining / 60)} دقيقة
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {restoreProgress.currentOperation}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ArchiveRestore className="w-6 h-6" />
            استعادة البيانات
          </h2>
          <p className="text-muted-foreground mt-1">
            البحث واستعادة الملفات والبيانات المؤرشفة
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={loadArchivedFiles}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="w-4 h-4 ml-2" />
            تحديث
          </Button>
        </div>
      </div>

      {/* أدوات البحث والتصفية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            البحث والتصفية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">البحث في الملفات</label>
              <div className="flex gap-2">
                <Input
                  placeholder="اسم الملف أو المعرف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchArchivedFiles()}
                />
                <Button 
                  onClick={searchArchivedFiles}
                  disabled={isSearching}
                  size="sm"
                >
                  {isSearching ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">نوع البيانات</label>
              <Select value={dataTypeFilter} onValueChange={setDataTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الأنواع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  <SelectItem value="certificate">الشهادات</SelectItem>
                  <SelectItem value="student_data">بيانات الطلاب</SelectItem>
                  <SelectItem value="verification_log">سجلات التحقق</SelectItem>
                  <SelectItem value="activity_log">سجلات النشاط</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">حالة الأرشيف</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الحالات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="archived">مؤرشف</SelectItem>
                  <SelectItem value="restored">مستعاد</SelectItem>
                  <SelectItem value="error">خطأ</SelectItem>
                  <SelectItem value="pending">معلق</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">الفترة الزمنية</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الفترات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الفترات</SelectItem>
                  <SelectItem value="today">اليوم</SelectItem>
                  <SelectItem value="week">آخر أسبوع</SelectItem>
                  <SelectItem value="month">آخر شهر</SelectItem>
                  <SelectItem value="year">آخر سنة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* التبويبات */}
      <Tabs defaultValue="files" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="files">الملفات المؤرشفة</TabsTrigger>
          <TabsTrigger value="history">سجل الاستعادة</TabsTrigger>
        </TabsList>

        {/* تبويب الملفات المؤرشفة */}
        <TabsContent value="files" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>الملفات المؤرشفة ({filteredFiles.length})</CardTitle>
                  <CardDescription>
                    حدد الملفات التي تريد استعادتها
                  </CardDescription>
                </div>
                
                {selectedFiles.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {selectedFiles.length} محدد
                    </Badge>
                    <Button
                      onClick={startRestore}
                      disabled={isRestoring}
                      size="sm"
                    >
                      {isRestoring ? (
                        <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 ml-2" />
                      )}
                      استعادة المحدد
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                        onCheckedChange={selectAllFiles}
                      />
                    </TableHead>
                    <TableHead>اسم الملف</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>الحجم</TableHead>
                    <TableHead>تاريخ الأرشفة</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedFiles.includes(file.id)}
                          onCheckedChange={() => toggleFileSelection(file.id)}
                        />
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{file.fileName}</p>
                          <p className="text-xs text-muted-foreground">
                            ID: {file.id}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getDataTypeIcon(file.dataType)}
                          <Badge variant="outline">
                            {file.dataType}
                          </Badge>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="text-sm">
                          <div>{formatFileSize(file.fileSize)}</div>
                          <div className="text-xs text-muted-foreground">
                            نسبة الضغط: {file.compressionRatio}%
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="text-sm">
                          <div>{file.archivedAt.toLocaleDateString('ar')}</div>
                          <div className="text-xs text-muted-foreground">
                            {file.archivedAt.toLocaleTimeString('ar')}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(file.status)}>
                          {file.status}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => previewArchivedFile(file.id)}
                          >
                            <Search className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => downloadArchivedFile(file.id, file.fileName)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {filteredFiles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {searchTerm ? 'لا توجد نتائج للبحث' : 'لا توجد ملفات مؤرشفة'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب سجل الاستعادة */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>سجل عمليات الاستعادة</CardTitle>
              <CardDescription>
                تاريخ عمليات الاستعادة السابقة وحالاتها
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {restoreLogs.map((log) => (
                  <div key={log.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">
                          {log.restoredAt?.toLocaleDateString('ar') || 'غير مكتمل'}
                        </span>
                        <Badge variant={getStatusBadgeVariant(log.restoreStatus)}>
                          {log.restoreStatus}
                        </Badge>
                      </div>
                      
                      <span className="text-sm text-muted-foreground">
                        بواسطة: {log.restoredBy}
                      </span>
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>الملفات المستهدفة: {log.recordsToRestore.length}</p>
                      {log.notes && <p>ملاحظات: {log.notes}</p>}
                      {log.errorMessage && (
                        <p className="text-red-600">خطأ: {log.errorMessage}</p>
                      )}
                    </div>
                  </div>
                ))}

                {restoreLogs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    لا توجد عمليات استعادة سابقة
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}