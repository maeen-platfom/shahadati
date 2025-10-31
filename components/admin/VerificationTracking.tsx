/**
 * مكون تتبع عمليات التحقق
 * يوفر إحصائيات وتحليلات شاملة لعمليات التحقق من الشهادات
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
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  AlertTriangle,
  Lock,
  Unlock,
  EyeOff,
  RotateCcw
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  calculateTrackingStats,
  detectSuspiciousActivity,
  exportData,
  type CertificateStatus 
} from '@/lib/utils/tracking';

interface VerificationRecord {
  id: string;
  certificateNumber: string;
  studentName: string;
  isValid: boolean;
  verificationHash: string;
  verifiedBy: string;
  verifiedAt: string;
  ipAddress: string;
  userAgent: string;
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  location?: string;
  responseTime: number;
  errorMessage?: string;
  isSuspicious: boolean;
}

interface VerificationStats {
  total: number;
  successful: number;
  failed: number;
  successRate: number;
  averageResponseTime: number;
  dailyStats: {
    date: string;
    successful: number;
    failed: number;
    successRate: number;
  }[];
  deviceStats: Record<string, number>;
  locationStats: Record<string, number>;
  topCertificates: {
    number: string;
    studentName: string;
    verifiedCount: number;
    lastVerified: string;
  }[];
  suspiciousActivity: {
    count: number;
    riskLevel: 'low' | 'medium' | 'high';
    reasons: string[];
  };
}

interface FilterOptions {
  search: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  device: string;
  location: string;
  suspicious: string;
}

const deviceIcons = {
  desktop: <Monitor className="h-4 w-4" />,
  mobile: <Smartphone className="h-4 w-4" />,
  tablet: <Monitor className="h-4 w-4" />,
  unknown: <Globe className="h-4 w-4" />,
};

const deviceLabels = {
  desktop: 'سطح المكتب',
  mobile: 'الهاتف المحمول',
  tablet: 'الجهاز اللوحي',
  unknown: 'غير معروف',
};

export function VerificationTracking() {
  const [verificationRecords, setVerificationRecords] = useState<VerificationRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<VerificationRecord[]>([]);
  const [verificationStats, setVerificationStats] = useState<VerificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<VerificationRecord | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    device: '',
    location: '',
    suspicious: '',
  });

  // بيانات تجريبية لسجلات التحقق
  const mockVerificationRecords: VerificationRecord[] = [
    {
      id: '1',
      certificateNumber: 'CERT-2025-001234',
      studentName: 'أحمد محمد علي',
      isValid: true,
      verificationHash: 'abc123def456',
      verifiedBy: 'أحمد محمد',
      verifiedAt: '2025-01-22T10:30:00Z',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      deviceType: 'desktop',
      location: 'الرياض، السعودية',
      responseTime: 250,
      isSuspicious: false,
    },
    {
      id: '2',
      certificateNumber: 'CERT-2025-001235',
      studentName: 'فاطمة علي حسن',
      isValid: true,
      verificationHash: 'def456ghi789',
      verifiedBy: 'فاطمة علي',
      verifiedAt: '2025-01-22T11:15:00Z',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      deviceType: 'mobile',
      location: 'جدة، السعودية',
      responseTime: 180,
      isSuspicious: false,
    },
    {
      id: '3',
      certificateNumber: 'CERT-2025-999999',
      studentName: 'مجهول',
      isValid: false,
      verificationHash: '',
      verifiedBy: 'مجهول',
      verifiedAt: '2025-01-22T12:00:00Z',
      ipAddress: '203.0.113.45',
      userAgent: 'curl/7.68.0',
      deviceType: 'unknown',
      location: 'غير معروف',
      responseTime: 50,
      errorMessage: 'رقم شهادة غير صحيح',
      isSuspicious: true,
    },
    {
      id: '4',
      certificateNumber: 'CERT-2025-001234',
      studentName: 'أحمد محمد علي',
      isValid: true,
      verificationHash: 'abc123def456',
      verifiedBy: 'خالد يوسف',
      verifiedAt: '2025-01-22T14:30:00Z',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      deviceType: 'desktop',
      location: 'الدمام، السعودية',
      responseTime: 320,
      isSuspicious: true, // نفس الشهادة من IP مختلف
    },
    {
      id: '5',
      certificateNumber: 'CERT-2025-001236',
      studentName: 'سارة أحمد',
      isValid: true,
      verificationHash: 'ghi789jkl012',
      verifiedBy: 'سارة أحمد',
      verifiedAt: '2025-01-22T15:45:00Z',
      ipAddress: '192.168.1.103',
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)',
      deviceType: 'tablet',
      location: 'الرياض، السعودية',
      responseTime: 290,
      isSuspicious: false,
    },
  ];

  useEffect(() => {
    loadVerificationData();
  }, []);

  // تطبيق الفلاتر
  useEffect(() => {
    applyFilters();
  }, [verificationRecords, filters]);

  const loadVerificationData = async () => {
    setLoading(true);
    try {
      // محاكاة تحميل البيانات
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVerificationRecords(mockVerificationRecords);
      
      // حساب الإحصائيات
      const stats = calculateVerificationStats(mockVerificationRecords);
      setVerificationStats(stats);
    } catch (error) {
      console.error('خطأ في تحميل بيانات التحقق:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateVerificationStats = (records: VerificationRecord[]): VerificationStats => {
    const total = records.length;
    const successful = records.filter(r => r.isValid).length;
    const failed = total - successful;
    const successRate = total > 0 ? (successful / total) * 100 : 0;
    
    const averageResponseTime = total > 0 
      ? records.reduce((sum, r) => sum + r.responseTime, 0) / total 
      : 0;

    // إحصائيات يومية (آخر 7 أيام)
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayRecords = records.filter(r => r.verifiedAt.startsWith(dateStr));
      const daySuccessful = dayRecords.filter(r => r.isValid).length;
      const dayFailed = dayRecords.length - daySuccessful;
      const daySuccessRate = dayRecords.length > 0 ? (daySuccessful / dayRecords.length) * 100 : 0;
      
      dailyStats.push({
        date: dateStr,
        successful: daySuccessful,
        failed: dayFailed,
        successRate: daySuccessRate,
      });
    }

    // إحصائيات الأجهزة
    const deviceStats = records.reduce((acc, record) => {
      acc[record.deviceType] = (acc[record.deviceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // إحصائيات المواقع
    const locationStats = records.reduce((acc, record) => {
      if (record.location) {
        acc[record.location] = (acc[record.location] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // الشهادات الأكثر تحققاً
    const certificateCounts = records.reduce((acc, record) => {
      if (!acc[record.certificateNumber]) {
        acc[record.certificateNumber] = {
          number: record.certificateNumber,
          studentName: record.studentName,
          verifiedCount: 0,
          lastVerified: '',
        };
      }
      acc[record.certificateNumber].verifiedCount++;
      if (record.verifiedAt > acc[record.certificateNumber].lastVerified) {
        acc[record.certificateNumber].lastVerified = record.verifiedAt;
      }
      return acc;
    }, {} as Record<string, any>);

    const topCertificates = Object.values(certificateCounts)
      .sort((a: any, b: any) => b.verifiedCount - a.verifiedCount)
      .slice(0, 5);

    // النشاط المشبوه
    const suspiciousRecords = records.filter(r => r.isSuspicious);
    const suspiciousActivity = {
      count: suspiciousRecords.length,
      riskLevel: suspiciousRecords.length > 5 ? 'high' as const : 
                suspiciousRecords.length > 2 ? 'medium' as const : 'low' as const,
      reasons: [
        ...(suspiciousRecords.length > 0 ? ['محاولات متعددة لنفس الشهادة'] : []),
        ...(records.filter(r => r.ipAddress?.startsWith('203.')).length > 0 
          ? ['محاولات من عناوين IP غير مألوفة'] : []),
      ],
    };

    return {
      total,
      successful,
      failed,
      successRate,
      averageResponseTime,
      dailyStats,
      deviceStats,
      locationStats,
      topCertificates,
      suspiciousActivity,
    };
  };

  const applyFilters = () => {
    let filtered = [...verificationRecords];

    // البحث النصي
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(record => 
        record.certificateNumber.toLowerCase().includes(searchLower) ||
        record.studentName.toLowerCase().includes(searchLower) ||
        record.verifiedBy.toLowerCase().includes(searchLower)
      );
    }

    // فلتر النتيجة
    if (filters.status === 'success') {
      filtered = filtered.filter(record => record.isValid);
    } else if (filters.status === 'failed') {
      filtered = filtered.filter(record => !record.isValid);
    }

    // فلتر الجهاز
    if (filters.device) {
      filtered = filtered.filter(record => record.deviceType === filters.device);
    }

    // فلتر الموقع
    if (filters.location) {
      filtered = filtered.filter(record => record.location === filters.location);
    }

    // فلتر النشاط المشبوه
    if (filters.suspicious === 'suspicious') {
      filtered = filtered.filter(record => record.isSuspicious);
    } else if (filters.suspicious === 'normal') {
      filtered = filtered.filter(record => !record.isSuspicious);
    }

    // فلتر التاريخ
    if (filters.dateFrom) {
      filtered = filtered.filter(record => 
        new Date(record.verifiedAt) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(record => 
        new Date(record.verifiedAt) <= new Date(filters.dateTo)
      );
    }

    // ترتيب حسب الوقت (الأحدث أولاً)
    filtered.sort((a, b) => new Date(b.verifiedAt).getTime() - new Date(a.verifiedAt).getTime());

    setFilteredRecords(filtered);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      device: '',
      location: '',
      suspicious: '',
    });
  };

  const exportData = () => {
    const exportData = filteredRecords.map(record => ({
      'رقم الشهادة': record.certificateNumber,
      'اسم الطالب': record.studentName,
      'الحالة': record.isValid ? 'نجح' : 'فشل',
      'المُتحقق': record.verifiedBy,
      'التاريخ': new Date(record.verifiedAt).toLocaleString('ar-SA'),
      'عنوان IP': record.ipAddress,
      'الجهاز': deviceLabels[record.deviceType],
      'الموقع': record.location || 'غير معروف',
      'وقت الاستجابة': `${record.responseTime}ms`,
      'نشط مشبوه': record.isSuspicious ? 'نعم' : 'لا',
    }));
    
    const jsonData = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `verification_records_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getResponseTimeColor = (time: number) => {
    if (time <= 200) return 'text-green-600';
    if (time <= 500) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>جاري تحميل بيانات التحقق...</span>
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
          <h1 className="text-3xl font-bold text-gray-900">تتبع التحقق</h1>
          <p className="text-gray-600 mt-1">متابعة وتحليل عمليات التحقق من الشهادات</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={loadVerificationData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 ml-2" />
            تحديث
          </Button>
          <Button onClick={exportData} variant="outline" size="sm">
            <Download className="h-4 w-4 ml-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* التحذيرات */}
      {verificationStats && verificationStats.suspiciousActivity.count > 0 && (
        <Alert className={`${
          verificationStats.suspiciousActivity.riskLevel === 'high' 
            ? 'border-red-200 bg-red-50' 
            : 'border-yellow-200 bg-yellow-50'
        }`}>
          <AlertTriangle className={`h-4 w-4 ${
            verificationStats.suspiciousActivity.riskLevel === 'high' 
              ? 'text-red-600' 
              : 'text-yellow-600'
          }`} />
          <AlertDescription>
            <strong>تحذير:</strong> تم اكتشاف {verificationStats.suspiciousActivity.count} محاولة مشبوهة. 
            مستوى المخاطر: {verificationStats.suspiciousActivity.riskLevel === 'high' ? 'عالي' : 
                           verificationStats.suspiciousActivity.riskLevel === 'medium' ? 'متوسط' : 'منخفض'}
          </AlertDescription>
        </Alert>
      )}

      {/* الإحصائيات الرئيسية */}
      {verificationStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي التحققات</p>
                  <p className="text-2xl font-bold text-gray-900">{verificationStats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">معدل النجاح</p>
                  <p className={`text-2xl font-bold ${getSuccessRateColor(verificationStats.successRate)}`}>
                    {verificationStats.successRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-blue-600" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">متوسط وقت الاستجابة</p>
                  <p className={`text-2xl font-bold ${getResponseTimeColor(verificationStats.averageResponseTime)}`}>
                    {verificationStats.averageResponseTime.toFixed(0)}ms
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className={`h-8 w-8 ${
                  verificationStats.suspiciousActivity.riskLevel === 'high' ? 'text-red-600' :
                  verificationStats.suspiciousActivity.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                }`} />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">أنشطة مشبوهة</p>
                  <p className={`text-2xl font-bold ${
                    verificationStats.suspiciousActivity.riskLevel === 'high' ? 'text-red-600' :
                    verificationStats.suspiciousActivity.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {verificationStats.suspiciousActivity.count}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
                  placeholder="بحث في التحققات..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>النتيجة</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع النتائج" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع النتائج</SelectItem>
                  <SelectItem value="success">نجح</SelectItem>
                  <SelectItem value="failed">فشل</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>الجهاز</Label>
              <Select value={filters.device} onValueChange={(value) => handleFilterChange('device', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الأجهزة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع الأجهزة</SelectItem>
                  <SelectItem value="desktop">سطح المكتب</SelectItem>
                  <SelectItem value="mobile">هاتف محمول</SelectItem>
                  <SelectItem value="tablet">جهاز لوحي</SelectItem>
                  <SelectItem value="unknown">غير معروف</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>الموقع</Label>
              <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع المواقع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع المواقع</SelectItem>
                  {verificationStats && Object.keys(verificationStats.locationStats).map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>النشاط</Label>
              <Select value={filters.suspicious} onValueChange={(value) => handleFilterChange('suspicious', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="الكل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">الكل</SelectItem>
                  <SelectItem value="normal">عادي</SelectItem>
                  <SelectItem value="suspicious">مشبوه</SelectItem>
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
              عرض {filteredRecords.length} من أصل {verificationRecords.length} تحقق
            </p>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              مسح الفلاتر
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* عرض البيانات */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="records">السجلات</TabsTrigger>
          <TabsTrigger value="analytics">تحليلات</TabsTrigger>
          <TabsTrigger value="security">الأمان</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {verificationStats && (
            <>
              {/* الرسم البياني اليومي */}
              <Card>
                <CardHeader>
                  <CardTitle>التحققات اليومية (آخر 7 أيام)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {verificationStats.dailyStats.map((day) => (
                      <div key={day.date} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">
                            {new Date(day.date).toLocaleDateString('ar-SA', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <Badge variant="outline">{day.successful + day.failed}</Badge>
                            <Badge className={`${
                              day.successRate >= 90 ? 'bg-green-100 text-green-800' :
                              day.successRate >= 70 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {day.successRate.toFixed(0)}%
                            </Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2 space-x-reverse">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ 
                                width: `${day.successful + day.failed > 0 ? (day.successful / (day.successful + day.failed) * 100) : 0}%` 
                              }}
                            />
                          </div>
                          <div className="text-sm text-gray-500">
                            نجح: {day.successful} | فشل: {day.failed}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* إحصائيات الأجهزة والمواقع */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>توزيع الأجهزة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(verificationStats.deviceStats).map(([device, count]) => (
                        <div key={device} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            {deviceIcons[device as keyof typeof deviceIcons]}
                            <span>{deviceLabels[device as keyof typeof deviceLabels]}</span>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ 
                                  width: `${verificationStats.total > 0 ? (count / verificationStats.total * 100) : 0}%` 
                                }}
                              />
                            </div>
                            <Badge variant="outline">{count}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>الشهادات الأكثر تحققاً</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {verificationStats.topCertificates.map((cert, index) => (
                        <div key={cert.number} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{cert.number}</p>
                            <p className="text-sm text-gray-600">{cert.studentName}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{cert.verifiedCount} مرة</Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(cert.lastVerified).toLocaleDateString('ar-SA')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الشهادة</TableHead>
                    <TableHead>اسم الطالب</TableHead>
                    <TableHead>النتيجة</TableHead>
                    <TableHead>المُتحقق</TableHead>
                    <TableHead>التاريخ والوقت</TableHead>
                    <TableHead>الجهاز</TableHead>
                    <TableHead>الموقع</TableHead>
                    <TableHead>وقت الاستجابة</TableHead>
                    <TableHead>الأمان</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-sm">{record.certificateNumber}</TableCell>
                      <TableCell className="font-medium">{record.studentName}</TableCell>
                      <TableCell>
                        {record.isValid ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 ml-1" />
                            نجح
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">
                            <XCircle className="h-3 w-3 ml-1" />
                            فشل
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{record.verifiedBy}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(record.verifiedAt).toLocaleString('ar-SA')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          {deviceIcons[record.deviceType]}
                          <span className="text-sm">{deviceLabels[record.deviceType]}</span>
                        </div>
                      </TableCell>
                      <TableCell>{record.location || 'غير معروف'}</TableCell>
                      <TableCell>
                        <span className={`font-mono text-sm ${getResponseTimeColor(record.responseTime)}`}>
                          {record.responseTime}ms
                        </span>
                      </TableCell>
                      <TableCell>
                        {record.isSuspicious ? (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 ml-1" />
                            مشبوه
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <Shield className="h-3 w-3 ml-1" />
                            آمن
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedRecord(record)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredRecords.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  لا توجد سجلات تحقق تطابق معايير البحث
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          {verificationStats && (
            <>
              {/* تحليل الأداء */}
              <Card>
                <CardHeader>
                  <CardTitle>تحليل الأداء</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {verificationStats.successRate.toFixed(1)}%
                      </div>
                      <p className="text-sm text-gray-600 mt-1">معدل النجاح</p>
                      <div className="flex items-center justify-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600 mr-1">ممتاز</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {verificationStats.averageResponseTime.toFixed(0)}ms
                      </div>
                      <p className="text-sm text-gray-600 mt-1">متوسط وقت الاستجابة</p>
                      <div className="flex items-center justify-center mt-2">
                        <Activity className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-600 mr-1">
                          {verificationStats.averageResponseTime <= 200 ? 'سريع' : 
                           verificationStats.averageResponseTime <= 500 ? 'متوسط' : 'بطيء'}
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">
                        {verificationStats.total}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">إجمالي العمليات</p>
                      <div className="flex items-center justify-center mt-2">
                        <BarChart3 className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-purple-600 mr-1">نشط</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* توزيع المواقع */}
              <Card>
                <CardHeader>
                  <CardTitle>توزيع المواقع الجغرافية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(verificationStats.locationStats)
                      .sort(([,a], [,b]) => b - a)
                      .map(([location, count]) => (
                        <div key={location} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{location}</span>
                            <span className="text-gray-600">{count} عملية</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ 
                                width: `${verificationStats.total > 0 ? (count / verificationStats.total * 100) : 0}%` 
                              }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          {verificationStats && (
            <>
              {/* تنبيهات الأمان */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 ml-2" />
                    حالة الأمان
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>مستوى المخاطر الحالي</span>
                      <Badge className={`${
                        verificationStats.suspiciousActivity.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                        verificationStats.suspiciousActivity.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {verificationStats.suspiciousActivity.riskLevel === 'high' ? 'عالي' :
                         verificationStats.suspiciousActivity.riskLevel === 'medium' ? 'متوسط' : 'منخفض'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>الأنشطة المشبوهة المكتشفة</span>
                      <span className="font-bold">{verificationStats.suspiciousActivity.count}</span>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-gray-600">الأسباب المحتملة:</span>
                      {verificationStats.suspiciousActivity.reasons.length > 0 ? (
                        <ul className="text-sm text-gray-600 space-y-1">
                          {verificationStats.suspiciousActivity.reasons.map((reason, index) => (
                            <li key={index} className="flex items-center">
                              <AlertTriangle className="h-3 w-3 ml-2 text-yellow-500" />
                              {reason}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-green-600">لا توجد أسباب مشبوهة</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* السجلات المشبوهة */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 ml-2" />
                    السجلات المشبوهة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {verificationRecords
                      .filter(record => record.isSuspicious)
                      .slice(0, 10)
                      .map((record) => (
                        <div key={record.id} className="p-4 border rounded-lg bg-red-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-red-900">{record.certificateNumber}</p>
                              <p className="text-sm text-red-700">{record.studentName}</p>
                              <p className="text-xs text-red-600 mt-1">
                               尝试者: {record.verifiedBy} | IP: {record.ipAddress}
                              </p>
                              <p className="text-xs text-red-600">
                                الوقت: {new Date(record.verifiedAt).toLocaleString('ar-SA')}
                              </p>
                            </div>
                            <Badge className="bg-red-100 text-red-800">
                              مشبوه
                            </Badge>
                          </div>
                          {record.errorMessage && (
                            <p className="text-sm text-red-700 mt-2">
                              سبب الفشل: {record.errorMessage}
                            </p>
                          )}
                        </div>
                      ))}
                    {verificationRecords.filter(record => record.isSuspicious).length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        لا توجد سجلات مشبوهة
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* حوار عرض التفاصيل */}
      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل عملية التحقق</DialogTitle>
            <DialogDescription>
              معلومات مفصلة عن عملية التحقق {selectedRecord?.certificateNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">رقم الشهادة</Label>
                  <p className="font-mono text-lg">{selectedRecord.certificateNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">النتيجة</Label>
                  <div className="mt-1">
                    {selectedRecord.isValid ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 ml-1" />
                        نجح
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        <XCircle className="h-3 w-3 ml-1" />
                        فشل
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">اسم الطالب</Label>
                  <p className="font-medium">{selectedRecord.studentName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">المُتحقق</Label>
                  <p className="font-medium">{selectedRecord.verifiedBy}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">التاريخ والوقت</Label>
                  <p className="font-medium">{new Date(selectedRecord.verifiedAt).toLocaleString('ar-SA')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">وقت الاستجابة</Label>
                  <p className={`font-mono font-medium ${getResponseTimeColor(selectedRecord.responseTime)}`}>
                    {selectedRecord.responseTime}ms
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-sm font-medium text-gray-600">معلومات تقنية</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    {deviceIcons[selectedRecord.deviceType]}
                    <span className="font-medium">{deviceLabels[selectedRecord.deviceType]}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">عنوان IP:</span>
                    <span className="font-mono text-sm mr-2">{selectedRecord.ipAddress}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">الموقع:</span>
                    <span className="mr-2">{selectedRecord.location || 'غير معروف'}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">متصفح المستخدم:</span>
                    <p className="text-xs text-gray-500 mt-1 break-all">{selectedRecord.userAgent}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-sm font-medium text-gray-600">حالة الأمان</Label>
                <div className="mt-2">
                  {selectedRecord.isSuspicious ? (
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <Badge className="bg-red-100 text-red-800">نشاط مشبوه</Badge>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Shield className="h-4 w-4 text-green-500" />
                      <Badge className="bg-green-100 text-green-800">آمن</Badge>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedRecord.errorMessage && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">رسالة الخطأ</Label>
                    <p className="mt-1 text-red-600">{selectedRecord.errorMessage}</p>
                  </div>
                </>
              )}
              
              {selectedRecord.verificationHash && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">تجزئة التحقق</Label>
                    <p className="font-mono text-sm bg-gray-100 p-2 rounded">{selectedRecord.verificationHash}</p>
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