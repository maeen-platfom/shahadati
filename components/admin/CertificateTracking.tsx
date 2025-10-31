/**
 * مكون تتبع الشهادات الشامل
 * يوفر جدولاً تفصيلياً مع فلترة وبحث متقدم
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
  Edit, 
  Trash2, 
  RefreshCw,
  FileText,
  Calendar,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  Plus,
  BarChart3
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { 
  calculateTrackingStats, 
  exportData, 
  type CertificateStatus,
  type ActivityType 
} from '@/lib/utils/tracking';

interface Certificate {
  id: string;
  number: string;
  studentName: string;
  studentEmail: string;
  templateName: string;
  templateId: string;
  status: CertificateStatus;
  issueDate: string;
  expiryDate?: string;
  createdBy: string;
  verifiedCount: number;
  lastVerified?: string;
  isRevoked: boolean;
  revokeReason?: string;
  metadata: Record<string, any>;
}

interface FilterOptions {
  search: string;
  status: string;
  template: string;
  dateFrom: string;
  dateTo: string;
  verified: string;
}

const statusColors: Record<CertificateStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  issued: 'bg-green-100 text-green-800',
  revoked: 'bg-red-100 text-red-800',
  expired: 'bg-orange-100 text-orange-800',
  pending_verification: 'bg-yellow-100 text-yellow-800',
};

const statusIcons: Record<CertificateStatus, React.ReactNode> = {
  draft: <Clock className="h-4 w-4" />,
  issued: <CheckCircle className="h-4 w-4" />,
  revoked: <XCircle className="h-4 w-4" />,
  expired: <AlertTriangle className="h-4 w-4" />,
  pending_verification: <Shield className="h-4 w-4" />,
};

export function CertificateTracking() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [filteredCertificates, setFilteredCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [activeTab, setActiveTab] = useState('table');
  
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    status: '',
    template: '',
    dateFrom: '',
    dateTo: '',
    verified: '',
  });

  const [templates, setTemplates] = useState<{id: string, name: string}[]>([
    { id: '1', name: 'القالب الأكاديمي' },
    { id: '2', name: 'القالب المهني' },
    { id: '3', name: 'قالب التدريب' },
  ]);

  // بيانات تجريبية للشهادات
  const mockCertificates: Certificate[] = [
    {
      id: '1',
      number: 'CERT-2025-001234',
      studentName: 'أحمد محمد علي',
      studentEmail: 'ahmed@example.com',
      templateName: 'القالب الأكاديمي',
      templateId: '1',
      status: 'issued',
      issueDate: '2025-01-15',
      createdBy: 'د. سارة أحمد',
      verifiedCount: 5,
      lastVerified: '2025-01-20',
      isRevoked: false,
      metadata: { grade: 'ممتاز', specialization: 'علوم الحاسوب' }
    },
    {
      id: '2',
      number: 'CERT-2025-001235',
      studentName: 'فاطمة علي حسن',
      studentEmail: 'fatima@example.com',
      templateName: 'القالب المهني',
      templateId: '2',
      status: 'pending_verification',
      issueDate: '2025-01-18',
      createdBy: 'أ. محمد خالد',
      verifiedCount: 2,
      lastVerified: '2025-01-22',
      isRevoked: false,
      metadata: { certification: 'AWS Cloud Practitioner', level: 'مبتدئ' }
    },
    {
      id: '3',
      number: 'CERT-2025-001236',
      studentName: 'خالد يوسف أحمد',
      studentEmail: 'khalid@example.com',
      templateName: 'قالب التدريب',
      templateId: '3',
      status: 'expired',
      issueDate: '2024-06-01',
      expiryDate: '2025-06-01',
      createdBy: 'د. سارة أحمد',
      verifiedCount: 0,
      isRevoked: false,
      metadata: { trainingHours: 40, instructor: 'أ. أحمد علي' }
    },
  ];

  useEffect(() => {
    loadCertificates();
  }, []);

  // تطبيق الفلاتر
  useEffect(() => {
    applyFilters();
  }, [certificates, filters]);

  const loadCertificates = async () => {
    setLoading(true);
    try {
      // محاكاة تحميل البيانات
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCertificates(mockCertificates);
      setFilteredCertificates(mockCertificates);
    } catch (error) {
      console.error('خطأ في تحميل الشهادات:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...certificates];

    // البحث النصي
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(cert => 
        cert.number.toLowerCase().includes(searchLower) ||
        cert.studentName.toLowerCase().includes(searchLower) ||
        cert.studentEmail.toLowerCase().includes(searchLower) ||
        cert.templateName.toLowerCase().includes(searchLower)
      );
    }

    // فلتر الحالة
    if (filters.status) {
      filtered = filtered.filter(cert => cert.status === filters.status);
    }

    // فلتر القالب
    if (filters.template) {
      filtered = filtered.filter(cert => cert.templateId === filters.template);
    }

    // فلتر التاريخ
    if (filters.dateFrom) {
      filtered = filtered.filter(cert => new Date(cert.issueDate) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(cert => new Date(cert.issueDate) <= new Date(filters.dateTo));
    }

    // فلتر التحقق
    if (filters.verified === 'verified') {
      filtered = filtered.filter(cert => cert.verifiedCount > 0);
    } else if (filters.verified === 'not_verified') {
      filtered = filtered.filter(cert => cert.verifiedCount === 0);
    }

    setFilteredCertificates(filtered);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      template: '',
      dateFrom: '',
      dateTo: '',
      verified: '',
    });
  };

  const exportToExcel = () => {
    exportData(filteredCertificates, 'excel', 'certificates_report');
  };

  const exportToCSV = () => {
    exportData(filteredCertificates, 'csv', 'certificates_report');
  };

  const exportToPDF = () => {
    exportData(filteredCertificates, 'pdf', 'certificates_report');
  };

  const getStatusText = (status: CertificateStatus) => {
    const statusTexts = {
      draft: 'مسودة',
      issued: 'مُصدرة',
      revoked: 'ملغية',
      expired: 'منتهية الصلاحية',
      pending_verification: 'في انتظار التحقق',
    };
    return statusTexts[status];
  };

  const getVerificationStatus = (cert: Certificate) => {
    if (cert.verifiedCount > 0) {
      return { text: 'تم التحقق', color: 'text-green-600' };
    }
    return { text: 'لم يتم التحقق', color: 'text-gray-500' };
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>جاري تحميل البيانات...</span>
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
          <h1 className="text-3xl font-bold text-gray-900">تتبع الشهادات</h1>
          <p className="text-gray-600 mt-1">إدارة ومتابعة جميع الشهادات الصادرة</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={loadCertificates} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 ml-2" />
            تحديث
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 ml-2" />
                تصدير
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportToExcel}>
                <FileText className="h-4 w-4 ml-2" />
                تصدير إلى Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToCSV}>
                <FileText className="h-4 w-4 ml-2" />
                تصدير إلى CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToPDF}>
                <FileText className="h-4 w-4 ml-2" />
                تصدير إلى PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* الإحصائيات السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي الشهادات</p>
                <p className="text-2xl font-bold text-gray-900">{certificates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">الشهادات المُصدرة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {certificates.filter(c => c.status === 'issued').length}
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
                <p className="text-sm font-medium text-gray-600">التحققات</p>
                <p className="text-2xl font-bold text-gray-900">
                  {certificates.reduce((sum, c) => sum + c.verifiedCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">منتهية الصلاحية</p>
                <p className="text-2xl font-bold text-gray-900">
                  {certificates.filter(c => c.status === 'expired').length}
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label>البحث</Label>
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="بحث في الشهادات..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>الحالة</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الحالات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع الحالات</SelectItem>
                  <SelectItem value="draft">مسودة</SelectItem>
                  <SelectItem value="issued">مُصدرة</SelectItem>
                  <SelectItem value="pending_verification">في انتظار التحقق</SelectItem>
                  <SelectItem value="revoked">ملغية</SelectItem>
                  <SelectItem value="expired">منتهية الصلاحية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>القالب</Label>
              <Select value={filters.template} onValueChange={(value) => handleFilterChange('template', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع القوالب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع القوالب</SelectItem>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
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
            <div className="space-y-2">
              <Label>التحقق</Label>
              <Select value={filters.verified} onValueChange={(value) => handleFilterChange('verified', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="الكل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">الكل</SelectItem>
                  <SelectItem value="verified">تم التحقق</SelectItem>
                  <SelectItem value="not_verified">لم يتم التحقق</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              عرض {filteredCertificates.length} من أصل {certificates.length} شهادة
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
          <TabsTrigger value="table">جدول</TabsTrigger>
          <TabsTrigger value="cards">بطاقات</TabsTrigger>
          <TabsTrigger value="analytics">تحليلات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الشهادة</TableHead>
                    <TableHead>اسم الطالب</TableHead>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead>القالب</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>تاريخ الإصدار</TableHead>
                    <TableHead>التحققات</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCertificates.map((certificate) => (
                    <TableRow key={certificate.id}>
                      <TableCell className="font-mono text-sm">{certificate.number}</TableCell>
                      <TableCell className="font-medium">{certificate.studentName}</TableCell>
                      <TableCell className="text-gray-600">{certificate.studentEmail}</TableCell>
                      <TableCell>{certificate.templateName}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[certificate.status]}>
                          <div className="flex items-center space-x-1 space-x-reverse">
                            {statusIcons[certificate.status]}
                            <span>{getStatusText(certificate.status)}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(certificate.issueDate).toLocaleDateString('ar-SA')}</TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-medium">{certificate.verifiedCount}</div>
                          {certificate.lastVerified && (
                            <div className="text-xs text-gray-500">
                              {new Date(certificate.lastVerified).toLocaleDateString('ar-SA')}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedCertificate(certificate)}>
                              <Eye className="h-4 w-4 ml-2" />
                              عرض التفاصيل
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 ml-2" />
                              تحرير
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 ml-2" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredCertificates.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  لا توجد شهادات تطابق معايير البحث
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCertificates.map((certificate) => {
            const verificationStatus = getVerificationStatus(certificate);
            return (
              <Card key={certificate.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{certificate.number}</CardTitle>
                    <Badge className={statusColors[certificate.status]}>
                      {statusIcons[certificate.status]}
                      <span className="mr-1">{getStatusText(certificate.status)}</span>
                    </Badge>
                  </div>
                  <CardDescription>{certificate.studentName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">البريد الإلكتروني:</span>
                      <span className="font-medium">{certificate.studentEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">القالب:</span>
                      <span className="font-medium">{certificate.templateName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">تاريخ الإصدار:</span>
                      <span className="font-medium">
                        {new Date(certificate.issueDate).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">التحققات:</span>
                      <span className={`font-medium ${verificationStatus.color}`}>
                        {verificationStatus.text} ({certificate.verifiedCount})
                      </span>
                    </div>
                    <Separator />
                    <div className="flex space-x-2 space-x-reverse">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setSelectedCertificate(certificate)}
                      >
                        <Eye className="h-4 w-4 ml-1" />
                        عرض
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="h-4 w-4 ml-1" />
                        تحرير
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات الحالات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    certificates.reduce((acc, cert) => {
                      acc[cert.status] = (acc[cert.status] || 0) + 1;
                      return acc;
                    }, {} as Record<CertificateStatus, number>)
                  ).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {statusIcons[status as CertificateStatus]}
                        <span>{getStatusText(status as CertificateStatus)}</span>
                      </div>
                      <Badge className={statusColors[status as CertificateStatus]}>
                        {count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>القوالب الأكثر استخداماً</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {templates.map(template => {
                    const count = certificates.filter(c => c.templateId === template.id).length;
                    const percentage = certificates.length > 0 ? (count / certificates.length * 100) : 0;
                    return (
                      <div key={template.id} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{template.name}</span>
                          <span className="text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* حوار عرض التفاصيل */}
      <Dialog open={!!selectedCertificate} onOpenChange={() => setSelectedCertificate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل الشهادة</DialogTitle>
            <DialogDescription>
              معلومات مفصلة عن الشهادة {selectedCertificate?.number}
            </DialogDescription>
          </DialogHeader>
          {selectedCertificate && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">رقم الشهادة</Label>
                  <p className="font-mono text-lg">{selectedCertificate.number}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">الحالة</Label>
                  <div className="mt-1">
                    <Badge className={statusColors[selectedCertificate.status]}>
                      {statusIcons[selectedCertificate.status]}
                      <span className="mr-1">{getStatusText(selectedCertificate.status)}</span>
                    </Badge>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">اسم الطالب</Label>
                  <p className="font-medium">{selectedCertificate.studentName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">البريد الإلكتروني</Label>
                  <p>{selectedCertificate.studentEmail}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">القالب</Label>
                  <p>{selectedCertificate.templateName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">تاريخ الإصدار</Label>
                  <p>{new Date(selectedCertificate.issueDate).toLocaleDateString('ar-SA')}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">عدد التحققات</Label>
                  <p className="font-bold text-lg">{selectedCertificate.verifiedCount}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">آخر تحقق</Label>
                  <p>{selectedCertificate.lastVerified 
                    ? new Date(selectedCertificate.lastVerified).toLocaleDateString('ar-SA')
                    : 'لا يوجد'
                  }</p>
                </div>
              </div>
              
              {selectedCertificate.metadata && Object.keys(selectedCertificate.metadata).length > 0 && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-gray-600 mb-3 block">بيانات إضافية</Label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap">
                        {JSON.stringify(selectedCertificate.metadata, null, 2)}
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