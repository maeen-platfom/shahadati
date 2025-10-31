/**
 * سجل الأرشيف
 * Archive History Component
 */

'use client';

import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Archive,
  ArchiveRestore,
  Trash2,
  Filter,
  Search,
  Download,
  Eye,
  Calendar,
  Activity
} from 'lucide-react';

import { 
  ArchiveLog, 
  ArchiveStatus,
  ArchiveOperationResult
} from '@/types/archive';
import { formatFileSize, filterArchiveLogs } from '@/lib/utils/archive';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ArchiveHistoryProps {
  logs: ArchiveLog[];
}

export default function ArchiveHistory({ logs }: ArchiveHistoryProps) {
  // حالة البحث والتصفية
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [operationFilter, setOperationFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<ArchiveLog | null>(null);

  // تصفية السجلات
  const filteredLogs = useMemo(() => {
    let filtered = [...logs];

    // البحث في النص
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.archiveId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.operationType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // تصفية حسب الحالة
    if (statusFilter !== 'all') {
      filtered = filtered.filter(log => log.status === statusFilter);
    }

    // تصفية حسب نوع العملية
    if (operationFilter !== 'all') {
      filtered = filtered.filter(log => log.operationType === operationFilter);
    }

    // تصفية حسب التاريخ
    if (dateRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();

      switch (dateRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(log => log.startTime >= cutoffDate);
    }

    return filtered.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }, [logs, searchTerm, statusFilter, operationFilter, dateRange]);

  /**
   * الحصول على أيقونة العملية
   */
  const getOperationIcon = (operationType: string) => {
    switch (operationType) {
      case 'archive':
        return <Archive className="w-4 h-4" />;
      case 'restore':
        return <ArchiveRestore className="w-4 h-4" />;
      case 'delete':
        return <Trash2 className="w-4 h-4" />;
      case 'compress':
        return <Activity className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  /**
   * الحصول على أيقونة الحالة
   */
  const getStatusIcon = (status: ArchiveStatus) => {
    switch (status) {
      case 'archived':
      case 'restored':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'archiving':
      case 'restoring':
        return <AlertCircle className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-blue-500" />;
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
      case 'restored':
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

  /**
   * حساب مدة العملية
   */
  const getOperationDuration = (log: ArchiveLog): string => {
    if (!log.endTime) {
      return 'غير مكتملة';
    }
    
    const duration = (log.endTime.getTime() - log.startTime.getTime()) / 1000;
    
    if (duration < 60) {
      return `${Math.round(duration)} ثانية`;
    } else if (duration < 3600) {
      return `${Math.round(duration / 60)} دقيقة`;
    } else {
      return `${Math.round(duration / 3600)} ساعة`;
    }
  };

  /**
   * تصدير السجلات
   */
  const exportLogs = () => {
    const csvContent = [
      ['التاريخ', 'نوع العملية', 'الحالة', 'السجلات المعالجة', 'المدة', 'المشغل'].join(','),
      ...filteredLogs.map(log => [
        log.startTime.toLocaleDateString('ar'),
        log.operationType,
        log.status,
        log.processedRecords,
        getOperationDuration(log),
        log.operatorId || 'غير محدد'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `archive_logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // إحصائيات السجلات
  const stats = useMemo(() => {
    const total = filteredLogs.length;
    const successful = filteredLogs.filter(log => 
      ['archived', 'restored'].includes(log.status)
    ).length;
    const errors = filteredLogs.filter(log => log.status === 'error').length;
    const totalRecords = filteredLogs.reduce((sum, log) => sum + log.processedRecords, 0);
    const averageDuration = filteredLogs
      .filter(log => log.endTime)
      .reduce((sum, log, _, arr) => {
        const duration = (log.endTime!.getTime() - log.startTime.getTime()) / 1000;
        return sum + duration / arr.length;
      }, 0);

    return {
      total,
      successful,
      errors,
      totalRecords,
      averageDuration: Math.round(averageDuration)
    };
  }, [filteredLogs]);

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="w-6 h-6" />
            سجل الأرشيف
          </h2>
          <p className="text-muted-foreground mt-1">
            تتبع جميع عمليات الأرشيف والاستعادة
          </p>
        </div>

        <Button onClick={exportLogs} variant="outline" size="sm">
          <Download className="w-4 h-4 ml-2" />
          تصدير السجلات
        </Button>
      </div>

      {/* الإحصائيات السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي العمليات</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">نجحت</p>
                <p className="text-2xl font-bold text-green-600">{stats.successful}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">أخطاء</p>
                <p className="text-2xl font-bold text-red-600">{stats.errors}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">السجلات المعالجة</p>
                <p className="text-2xl font-bold">{stats.totalRecords.toLocaleString('ar')}</p>
              </div>
              <Archive className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">متوسط المدة</p>
                <p className="text-2xl font-bold">
                  {stats.averageDuration < 60 
                    ? `${stats.averageDuration}s` 
                    : `${Math.round(stats.averageDuration / 60)}m`
                  }
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* أدوات التصفية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            تصفية وبحث
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">البحث</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في السجلات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">الحالة</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الحالات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="archived">مؤرشف</SelectItem>
                  <SelectItem value="error">خطأ</SelectItem>
                  <SelectItem value="pending">معلق</SelectItem>
                  <SelectItem value="archiving">جاري الأرشفة</SelectItem>
                  <SelectItem value="restoring">جاري الاستعادة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">نوع العملية</label>
              <Select value={operationFilter} onValueChange={setOperationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع العمليات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع العمليات</SelectItem>
                  <SelectItem value="archive">أرشفة</SelectItem>
                  <SelectItem value="restore">استعادة</SelectItem>
                  <SelectItem value="delete">حذف</SelectItem>
                  <SelectItem value="compress">ضغط</SelectItem>
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

          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              عرض {filteredLogs.length} من {logs.length} سجل
            </p>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setOperationFilter('all');
                setDateRange('all');
              }}
            >
              إعادة تعيين المرشحات
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* جدول السجلات */}
      <Card>
        <CardHeader>
          <CardTitle>سجل العمليات</CardTitle>
          <CardDescription>
            تفاصيل جميع عمليات الأرشيف والاستعادة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>التاريخ والوقت</TableHead>
                <TableHead>نوع العملية</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>السجلات</TableHead>
                <TableHead>المدة</TableHead>
                <TableHead>المشغل</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">
                        {log.startTime.toLocaleDateString('ar')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {log.startTime.toLocaleTimeString('ar')}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getOperationIcon(log.operationType)}
                      <span className="capitalize">{log.operationType}</span>
                      {log.archiveType && (
                        <Badge variant="outline" className="text-xs">
                          {log.archiveType}
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      <Badge variant={getStatusBadgeVariant(log.status)}>
                        {log.status}
                      </Badge>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="font-mono">
                      {log.processedRecords.toLocaleString('ar')}
                    </span>
                  </TableCell>

                  <TableCell>
                    {getOperationDuration(log)}
                  </TableCell>

                  <TableCell>
                    <span className="text-sm">
                      {log.operatorId || 'غير محدد'}
                    </span>
                  </TableCell>

                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>تفاصيل العملية</DialogTitle>
                          <DialogDescription>
                            معلومات مفصلة عن عملية {log.operationType}
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedLog && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">معرف الأرشيف</label>
                                <p className="text-sm font-mono bg-muted p-2 rounded">
                                  {selectedLog.archiveId}
                                </p>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium">نوع الأرشفة</label>
                                <p className="text-sm">{selectedLog.archiveType}</p>
                              </div>

                              <div>
                                <label className="text-sm font-medium">وقت البداية</label>
                                <p className="text-sm">
                                  {selectedLog.startTime.toLocaleString('ar')}
                                </p>
                              </div>

                              {selectedLog.endTime && (
                                <div>
                                  <label className="text-sm font-medium">وقت النهاية</label>
                                  <p className="text-sm">
                                    {selectedLog.endTime.toLocaleString('ar')}
                                  </p>
                                </div>
                              )}

                              <div>
                                <label className="text-sm font-medium">السجلات المعالجة</label>
                                <p className="text-sm">
                                  {selectedLog.processedRecords.toLocaleString('ar')}
                                </p>
                              </div>

                              <div>
                                <label className="text-sm font-medium">المدة</label>
                                <p className="text-sm">
                                  {getOperationDuration(selectedLog)}
                                </p>
                              </div>
                            </div>

                            {selectedLog.compressionStats && (
                              <div>
                                <label className="text-sm font-medium">إحصائيات الضغط</label>
                                <div className="bg-muted p-3 rounded text-sm space-y-1">
                                  <p>الحجم الأصلي: {formatFileSize(selectedLog.compressionStats.originalSize)}</p>
                                  <p>الحجم المضغوط: {formatFileSize(selectedLog.compressionStats.compressedSize)}</p>
                                  <p>نسبة الضغط: {selectedLog.compressionStats.compressionRatio}%</p>
                                </div>
                              </div>
                            )}

                            {selectedLog.errorMessage && (
                              <div>
                                <label className="text-sm font-medium text-red-600">رسالة الخطأ</label>
                                <Alert variant="destructive">
                                  <XCircle className="h-4 w-4" />
                                  <AlertDescription>
                                    {selectedLog.errorMessage}
                                  </AlertDescription>
                                </Alert>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}

              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    لا توجد سجلات تطابق المعايير المحددة
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}