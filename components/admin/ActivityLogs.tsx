/**
 * مكون سجلات العمليات والأنشطة
 * يوفر عرضاً شاملاً لجميع العمليات مع فلترة متقدمة
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  RefreshCw,
  FileText,
  Calendar,
  User,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Info,
  Warning,
  AlertTriangle,
  Shield,
  UserCheck,
  FileCheck,
  Trash2,
  Settings,
  BarChart3
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { 
  logActivity,
  type ActivityLog,
  type ActivityType 
} from '@/lib/utils/tracking';

interface FilterOptions {
  search: string;
  type: string;
  user: string;
  severity: string;
  dateFrom: string;
  dateTo: string;
  entityType: string;
}

const activityTypeLabels: Record<ActivityType, string> = {
  certificate_created: 'إنشاء شهادة',
  certificate_updated: 'تحديث شهادة',
  certificate_deleted: 'حذف شهادة',
  certificate_verified: 'تحقق من شهادة',
  certificate_failed_verification: 'فشل التحقق',
  user_login: 'تسجيل دخول',
  user_logout: 'تسجيل خروج',
  template_created: 'إنشاء قالب',
  template_updated: 'تحديث قالب',
  template_deleted: 'حذف قالب',
  export_performed: 'تصدير بيانات',
  bulk_operation: 'عملية مجمعة',
};

const activityIcons: Record<ActivityType, React.ReactNode> = {
  certificate_created: <FileCheck className="h-4 w-4" />,
  certificate_updated: <FileCheck className="h-4 w-4" />,
  certificate_deleted: <Trash2 className="h-4 w-4" />,
  certificate_verified: <Shield className="h-4 w-4" />,
  certificate_failed_verification: <AlertTriangle className="h-4 w-4" />,
  user_login: <UserCheck className="h-4 w-4" />,
  user_logout: <UserCheck className="h-4 w-4" />,
  template_created: <FileText className="h-4 w-4" />,
  template_updated: <Settings className="h-4 w-4" />,
  template_deleted: <Trash2 className="h-4 w-4" />,
  export_performed: <Download className="h-4 w-4" />,
  bulk_operation: <Settings className="h-4 w-4" />,
};

const severityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

const severityLabels = {
  low: 'منخفض',
  medium: 'متوسط',
  high: 'عالي',
  critical: 'حرج',
};

export function ActivityLogs() {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [activeTab, setActiveTab] = useState('timeline');
  
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    type: '',
    user: '',
    severity: '',
    dateFrom: '',
    dateTo: '',
    entityType: '',
  });

  // بيانات تجريبية لسجلات الأنشطة
  const mockActivityLogs: ActivityLog[] = [
    {
      id: '1',
      type: 'certificate_created',
      userId: 'user1',
      userName: 'د. سارة أحمد',
      userRole: 'instructor',
      entityId: 'cert1',
      entityType: 'certificate',
      description: 'تم إنشاء شهادة جديدة: CERT-2025-001234',
      metadata: { certificateNumber: 'CERT-2025-001234', templateName: 'القالب الأكاديمي' },
      timestamp: '2025-01-22T10:30:00Z',
      severity: 'low',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    {
      id: '2',
      type: 'certificate_verified',
      userId: 'user2',
      userName: 'أحمد محمد',
      userRole: 'student',
      entityId: 'cert1',
      entityType: 'certificate',
      description: 'تحقق ناجح من الشهادة: CERT-2025-001234',
      metadata: { certificateNumber: 'CERT-2025-001234', verificationHash: 'abc123' },
      timestamp: '2025-01-22T11:15:00Z',
      severity: 'low',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
    },
    {
      id: '3',
      type: 'certificate_failed_verification',
      userId: 'user3',
      userName: 'مجهول',
      userRole: 'visitor',
      entityId: 'cert999',
      entityType: 'certificate',
      description: 'فشل التحقق من الشهادة: CERT-2025-999999',
      metadata: { certificateNumber: 'CERT-2025-999999', reason: 'رقم شهادة غير صحيح' },
      timestamp: '2025-01-22T12:00:00Z',
      severity: 'medium',
      ipAddress: '203.0.113.45',
      userAgent: 'curl/7.68.0',
    },
    {
      id: '4',
      type: 'user_login',
      userId: 'user1',
      userName: 'د. سارة أحمد',
      userRole: 'instructor',
      entityId: 'user1',
      entityType: 'user',
      description: 'تسجيل دخول: د. سارة أحمد',
      metadata: { sessionId: 'sess123' },
      timestamp: '2025-01-22T09:00:00Z',
      severity: 'low',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    {
      id: '5',
      type: 'export_performed',
      userId: 'admin1',
      userName: 'مدير النظام',
      userRole: 'admin',
      entityId: 'certificates_report',
      entityType: 'user',
      description: 'تصدير البيانات بصيغة EXCEL: certificates_report',
      metadata: { format: 'excel', recordCount: 150, filename: 'certificates_report' },
      timestamp: '2025-01-22T08:30:00Z',
      severity: 'low',
      ipAddress: '192.168.1.50',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    },
  ];

  useEffect(() => {
    loadActivityLogs();
  }, []);

  // تطبيق الفلاتر
  useEffect(() => {
    applyFilters();
  }, [activityLogs, filters]);

  const loadActivityLogs = async () => {
    setLoading(true);
    try {
      // محاولة استرجاع من localStorage أولاً
      const storedLogs = localStorage.getItem('activity_logs');
      if (storedLogs) {
        const parsed = JSON.parse(storedLogs);
        setActivityLogs(parsed);
        setFilteredLogs(parsed);
      } else {
        // استخدام البيانات التجريبية
        setActivityLogs(mockActivityLogs);
        setFilteredLogs(mockActivityLogs);
      }
    } catch (error) {
      console.error('خطأ في تحميل سجلات الأنشطة:', error);
      setActivityLogs(mockActivityLogs);
      setFilteredLogs(mockActivityLogs);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...activityLogs];

    // البحث النصي
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(log => 
        log.description.toLowerCase().includes(searchLower) ||
        log.userName.toLowerCase().includes(searchLower) ||
        log.metadata.certificateNumber?.toLowerCase().includes(searchLower) ||
        log.type.toLowerCase().includes(searchLower)
      );
    }

    // فلتر نوع النشاط
    if (filters.type) {
      filtered = filtered.filter(log => log.type === filters.type);
    }

    // فلتر المستخدم
    if (filters.user) {
      filtered = filtered.filter(log => log.userName.includes(filters.user));
    }

    // فلتر الخطورة
    if (filters.severity) {
      filtered = filtered.filter(log => log.severity === filters.severity);
    }

    // فلتر نوع الكيان
    if (filters.entityType) {
      filtered = filtered.filter(log => log.entityType === filters.entityType);
    }

    // فلتر التاريخ
    if (filters.dateFrom) {
      filtered = filtered.filter(log => new Date(log.timestamp) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(log => new Date(log.timestamp) <= new Date(filters.dateTo));
    }

    // ترتيب حسب الوقت (الأحدث أولاً)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setFilteredLogs(filtered);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      user: '',
      severity: '',
      dateFrom: '',
      dateTo: '',
      entityType: '',
    });
  };

  const exportLogs = () => {
    const exportData = filteredLogs.map(log => ({
      'الوقت': new Date(log.timestamp).toLocaleString('ar-SA'),
      'النوع': activityTypeLabels[log.type],
      'المستخدم': log.userName,
      'الدور': log.userRole,
      'الوصف': log.description,
      'الخطورة': severityLabels[log.severity],
      'عنوان IP': log.ipAddress || '-',
    }));
    
    const jsonData = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `activity_logs_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateTestActivity = async () => {
    await logActivity({
      type: 'certificate_created',
      userId: 'current_user',
      userName: 'المستخدم الحالي',
      userRole: 'admin',
      entityId: 'test_cert',
      entityType: 'certificate',
      description: 'إنشاء شهادة تجريبية',
      metadata: { test: true, timestamp: new Date().toISOString() },
      severity: 'low',
    });
    loadActivityLogs(); // إعادة تحميل البيانات
  };

  const getActivityTypeStats = useMemo(() => {
    const stats = filteredLogs.reduce((acc, log) => {
      acc[log.type] = (acc[log.type] || 0) + 1;
      return acc;
    }, {} as Record<ActivityType, number>);
    
    return Object.entries(stats)
      .map(([type, count]) => ({
        type: type as ActivityType,
        label: activityTypeLabels[type as ActivityType],
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredLogs]);

  const getSeverityStats = useMemo(() => {
    const stats = filteredLogs.reduce((acc, log) => {
      acc[log.severity] = (acc[log.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(stats).map(([severity, count]) => ({
      severity,
      label: severityLabels[severity as keyof typeof severityLabels],
      count,
      color: severityColors[severity as keyof typeof severityColors],
    }));
  }, [filteredLogs]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>جاري تحميل سجلات الأنشطة...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">سجلات الأنشطة</h1>
          <p className="text-gray-600 mt-1">متابعة شاملة لجميع العمليات والأنشطة في النظام</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={generateTestActivity} variant="outline" size="sm">
            <Activity className="h-4 w-4 ml-2" />
            نشاط تجريبي
          </Button>
          <Button onClick={loadActivityLogs} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 ml-2" />
            تحديث
          </Button>
          <Button onClick={exportLogs} variant="outline" size="sm">
            <Download className="h-4 w-4 ml-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* الإحصائيات السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي الأنشطة</p>
                <p className="text-2xl font-bold text-gray-900">{activityLogs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">الأنشطة اليوم</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activityLogs.filter(log => 
                    new Date(log.timestamp).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">الأنشطة الأمنية</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activityLogs.filter(log => 
                    ['certificate_verified', 'certificate_failed_verification', 'user_login', 'user_logout'].includes(log.type)
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">تحذيرات عالية</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activityLogs.filter(log => log.severity === 'high' || log.severity === 'critical').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الفلاتر */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 ml-2" />
            البحث والفلترة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
            <div className="space-y-2">
              <Label>البحث</Label>
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="بحث في الأنشطة..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>نوع النشاط</Label>
              <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الأنواع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع الأنواع</SelectItem>
                  {Object.entries(activityTypeLabels).map(([type, label]) => (
                    <SelectItem key={type} value={type}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>المستخدم</Label>
              <Input
                placeholder="اسم المستخدم"
                value={filters.user}
                onChange={(e) => handleFilterChange('user', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>مستوى الخطورة</Label>
              <Select value={filters.severity} onValueChange={(value) => handleFilterChange('severity', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع المستويات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع المستويات</SelectItem>
                  <SelectItem value="low">منخفض</SelectItem>
                  <SelectItem value="medium">متوسط</SelectItem>
                  <SelectItem value="high">عالي</SelectItem>
                  <SelectItem value="critical">حرج</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>نوع الكيان</Label>
              <Select value={filters.entityType} onValueChange={(value) => handleFilterChange('entityType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الكيانات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع الكيانات</SelectItem>
                  <SelectItem value="certificate">شهادة</SelectItem>
                  <SelectItem value="template">قالب</SelectItem>
                  <SelectItem value="user">مستخدم</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>من تاريخ</Label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>إلى تاريخ</Label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              عرض {filteredLogs.length} من أصل {activityLogs.length} نشاط
            </p>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              مسح الفلاتر
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* عرض البيانات */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timeline">الخط الزمني</TabsTrigger>
          <TabsTrigger value="table">جدول</TabsTrigger>
          <TabsTrigger value="analytics">إحصائيات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="space-y-4">
          <div className="space-y-4">
            {filteredLogs.map((log, index) => (
              <Card key={log.id} className="relative">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    {/* أيقونة النشاط */}
                    <div className={`p-2 rounded-full ${
                      log.severity === 'critical' ? 'bg-red-100' :
                      log.severity === 'high' ? 'bg-orange-100' :
                      log.severity === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                      {activityIcons[log.type]}
                    </div>
                    
                    {/* محتوى النشاط */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">
                          {activityTypeLabels[log.type]}
                        </h3>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Badge className={severityColors[log.severity]}>
                            {severityLabels[log.severity]}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(log.timestamp).toLocaleString('ar-SA')}
                          </span>
                        </div>
                      </div>
                      
                      <p className="mt-1 text-sm text-gray-600">{log.description}</p>
                      
                      <div className="mt-2 flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                        <span className="flex items-center">
                          <User className="h-4 w-4 ml-1" />
                          {log.userName} ({log.userRole})
                        </span>
                        {log.ipAddress && (
                          <span className="flex items-center">
                            <Activity className="h-4 w-4 ml-1" />
                            {log.ipAddress}
                          </span>
                        )}
                      </div>
                      
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <div className="mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedLog(log)}
                          >
                            <Eye className="h-4 w-4 ml-1" />
                            عرض التفاصيل
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                
                {/* خط الربط */}
                {index < filteredLogs.length - 1 && (
                  <div className="absolute right-6 top-16 w-0.5 h-8 bg-gray-200" />
                )}
              </Card>
            ))}
            
            {filteredLogs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                لا توجد أنشطة تطابق معايير البحث
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الوقت</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>المستخدم</TableHead>
                    <TableHead>الوصف</TableHead>
                    <TableHead>الخطورة</TableHead>
                    <TableHead>عنوان IP</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        {new Date(log.timestamp).toLocaleString('ar-SA')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          {activityIcons[log.type]}
                          <span>{activityTypeLabels[log.type]}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.userName}</div>
                          <div className="text-sm text-gray-500">{log.userRole}</div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate">{log.description}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={severityColors[log.severity]}>
                          {severityLabels[log.severity]}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.ipAddress || '-'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* إحصائيات أنواع الأنشطة */}
            <Card>
              <CardHeader>
                <CardTitle>أنواع الأنشطة الأكثر تكراراً</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getActivityTypeStats.slice(0, 8).map(({ type, label, count }) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {activityIcons[type]}
                        <span className="font-medium">{label}</span>
                      </div>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* إحصائيات مستويات الخطورة */}
            <Card>
              <CardHeader>
                <CardTitle>توزيع مستويات الخطورة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getSeverityStats.map(({ severity, label, count, color }) => (
                    <div key={severity} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{label}</span>
                        <Badge className={color}>{count}</Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            severity === 'critical' ? 'bg-red-500' :
                            severity === 'high' ? 'bg-orange-500' :
                            severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ 
                            width: `${filteredLogs.length > 0 ? (count / filteredLogs.length * 100) : 0}%` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* النشاط اليومي */}
          <Card>
            <CardHeader>
              <CardTitle>النشاط اليومي (آخر 7 أيام)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 7 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - i);
                  const dateStr = date.toISOString().split('T')[0];
                  const dayLogs = filteredLogs.filter(log => 
                    log.timestamp.startsWith(dateStr)
                  );
                  
                  return (
                    <div key={dateStr} className="flex items-center justify-between">
                      <span className="font-medium">
                        {date.toLocaleDateString('ar-SA', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </span>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Badge variant="outline">{dayLogs.length}</Badge>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ 
                              width: `${filteredLogs.length > 0 ? Math.min((dayLogs.length / filteredLogs.length * 100) * 7, 100) : 0}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* حوار عرض التفاصيل */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل النشاط</DialogTitle>
            <DialogDescription>
              معلومات مفصلة عن النشاط المسجل
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">نوع النشاط</Label>
                  <div className="flex items-center space-x-2 space-x-reverse mt-1">
                    {activityIcons[selectedLog.type]}
                    <span className="font-medium">{activityTypeLabels[selectedLog.type]}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">مستوى الخطورة</Label>
                  <div className="mt-1">
                    <Badge className={severityColors[selectedLog.severity]}>
                      {severityLabels[selectedLog.severity]}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">المستخدم</Label>
                  <p className="font-medium">{selectedLog.userName}</p>
                  <p className="text-sm text-gray-500">{selectedLog.userRole}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">الوقت</Label>
                  <p className="font-medium">{new Date(selectedLog.timestamp).toLocaleString('ar-SA')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">نوع الكيان</Label>
                  <p className="font-medium">{selectedLog.entityType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">معرف الكيان</Label>
                  <p className="font-mono text-sm">{selectedLog.entityId}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-sm font-medium text-gray-600">الوصف</Label>
                <p className="mt-1">{selectedLog.description}</p>
              </div>
              
              {(selectedLog.ipAddress || selectedLog.userAgent) && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">معلومات تقنية</Label>
                    <div className="mt-2 space-y-2">
                      {selectedLog.ipAddress && (
                        <div>
                          <span className="text-sm text-gray-600">عنوان IP:</span>
                          <span className="font-mono text-sm mr-2">{selectedLog.ipAddress}</span>
                        </div>
                      )}
                      {selectedLog.userAgent && (
                        <div>
                          <span className="text-sm text-gray-600">متصفح المستخدم:</span>
                          <p className="text-xs text-gray-500 mt-1 break-all">{selectedLog.userAgent}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              
              {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">بيانات إضافية</Label>
                    <div className="mt-2 bg-gray-50 p-4 rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap">
                        {JSON.stringify(selectedLog.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ActivityLogs;