/**
 * صفحة التحقق من الشهادات
 * Sprint 4: واجهة متقدمة للتحقق من صحة الشهادات
 */

'use client';

import { useState } from 'react';
import { CertificateVerification } from '@/components/shared/CertificateQR';
import { EnhancedCertificateDisplay } from '@/components/shared/DigitalSignature';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  QrCode, 
  FileCheck, 
  Search, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Zap
} from 'lucide-react';

interface VerifiedCertificate {
  certificateId: string;
  certificateNumber: string;
  studentName: string;
  studentEmail?: string;
  issueDate: string;
  templateName: string;
  templateId: string;
  verificationHash: string;
  qrCode?: string;
  digitalSignature?: {
    signatureId: string;
    algorithm: string;
    validity: 'valid' | 'expired' | 'revoked';
    timestamp: string;
  };
  features: {
    qrCodeEnabled: boolean;
    digitalSignatureEnabled: boolean;
    arabicTextSupport: boolean;
    multiPageSupport: boolean;
  };
  verificationStats: {
    views: number;
    verificationCount: number;
    lastVerified: string;
  };
}

export default function VerifyCertificatePage() {
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [verifiedCertificate, setVerifiedCertificate] = useState<VerifiedCertificate | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('search');

  // محاكاة البحث عن الشهادة
  const handleSearch = async (input: string) => {
    if (!input.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setVerifiedCertificate(null);

    try {
      // محاكاة عملية البحث
      await new Promise(resolve => setTimeout(resolve, 1500));

      // فحص إذا كان المدخل صحيح
      if (input.startsWith('CERT-') || input.includes('certificate')) {
        // شهادة صالحة
        const mockCertificate: VerifiedCertificate = {
          certificateId: 'cert_' + Math.random().toString(36).substr(2, 9),
          certificateNumber: input.startsWith('CERT-') ? input : 'CERT-2025-123456',
          studentName: 'أحمد محمد علي',
          studentEmail: 'ahmed@example.com',
          issueDate: new Date().toISOString(),
          templateName: 'قالب شهادة التخرج',
          templateId: 'template_graduation_001',
          verificationHash: 'sha256_' + Math.random().toString(36).substr(2, 16),
          qrCode: 'qr_' + Math.random().toString(36).substr(2, 8),
          digitalSignature: {
            signatureId: 'sig_' + Math.random().toString(36).substr(2, 12),
            algorithm: 'RSA-SHA256',
            validity: 'valid',
            timestamp: new Date().toISOString(),
          },
          features: {
            qrCodeEnabled: true,
            digitalSignatureEnabled: true,
            arabicTextSupport: true,
            multiPageSupport: true,
          },
          verificationStats: {
            views: Math.floor(Math.random() * 50) + 1,
            verificationCount: Math.floor(Math.random() * 20) + 1,
            lastVerified: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          },
        };

        setVerifiedCertificate(mockCertificate);
        setActiveTab('certificate');
      } else {
        // شهادة غير صالحة
        setSearchError('الشهادة غير موجودة أو رقمها غير صحيح');
      }

    } catch (error) {
      setSearchError('حدث خطأ أثناء البحث عن الشهادة');
      console.error('Certificate search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchInput);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Shield className="h-10 w-10 text-blue-600" />
            منصة التحقق من الشهادات
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            تحقق من صحة ومصداقية أي شهادة صادرة من منصة شهاداتي بسهولة وأمان
          </p>
          
          {/* Sprint 4 Features Banner */}
          <div className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full">
            <Star className="h-5 w-5" />
            <span className="font-medium">ميزة Sprint 4 الجديدة</span>
            <Zap className="h-5 w-5" />
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                البحث والتحقق
              </TabsTrigger>
              <TabsTrigger value="certificate" disabled={!verifiedCertificate} className="flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                تفاصيل الشهادة
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                إحصائيات المنصة
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Search and Verification */}
            <TabsContent value="search" className="space-y-6">
              {/* Quick Search */}
              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-blue-600" />
                    بحث سريع عن الشهادة
                  </CardTitle>
                  <CardDescription>
                    أدخل رقم الشهادة أو رابط الشهادة للتحقق من صحتها فوراً
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleSearchSubmit} className="flex gap-3">
                    <Input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="رقم الشهادة (مثال: CERT-2025-123456) أو رابط الشهادة"
                      className="flex-1"
                      disabled={isSearching}
                    />
                    <Button 
                      type="submit"
                      disabled={!searchInput.trim() || isSearching}
                      className="px-8"
                    >
                      {isSearching ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          جاري البحث...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          بحث
                        </>
                      )}
                    </Button>
                  </form>

                  {searchError && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{searchError}</AlertDescription>
                    </Alert>
                  )}

                  {verifiedCertificate && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        ✅ تم العثور على الشهادة! 
                        انقر على تبويب "تفاصيل الشهادة" لعرض المعلومات الكاملة
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Advanced Verification Component */}
              <CertificateVerification 
                onVerificationComplete={(result) => {
                  if (result.isValid) {
                    setActiveTab('certificate');
                  }
                }}
              />

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center">
                  <CardContent className="p-6">
                    <QrCode className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">رمز QR للتحقق السريع</h3>
                    <p className="text-gray-600 text-sm">
                      تحقق من الشهادة فوراً باستخدام رمز QR المدمج
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-6">
                    <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">توقيع رقمي متقدم</h3>
                    <p className="text-gray-600 text-sm">
                      حماية فائقة بتوقيع رقمي باستخدام خوارزمية RSA-SHA256
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-6">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">تتبع شامل</h3>
                    <p className="text-gray-600 text-sm">
                      تتبع عمليات التحقق ومعلومات الأمان الشاملة
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab 2: Certificate Details */}
            <TabsContent value="certificate">
              {verifiedCertificate ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      ✅ شهادة صالحة ومصدقة
                    </Badge>
                  </div>

                  {/* Enhanced Certificate Display */}
                  <EnhancedCertificateDisplay
                    certificateData={{
                      certificateId: verifiedCertificate.certificateId,
                      certificateNumber: verifiedCertificate.certificateNumber,
                      studentName: verifiedCertificate.studentName,
                      studentEmail: verifiedCertificate.studentEmail,
                      issueDate: verifiedCertificate.issueDate,
                      templateName: verifiedCertificate.templateName,
                      verificationHash: verifiedCertificate.verificationHash,
                      qrCode: verifiedCertificate.qrCode,
                      digitalSignature: verifiedCertificate.digitalSignature,
                    }}
                    features={verifiedCertificate.features}
                  />

                  {/* Verification Statistics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        إحصائيات التحقق
                      </CardTitle>
                      <CardDescription>
                        معلومات إضافية حول عمليات التحقق من هذه الشهادة
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-blue-600">{verifiedCertificate.verificationStats.views}</p>
                          <p className="text-sm text-gray-600">عدد المشاهدات</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">{verifiedCertificate.verificationStats.verificationCount}</p>
                          <p className="text-sm text-gray-600">عمليات التحقق</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-purple-600">
                            {new Date(verifiedCertificate.verificationStats.lastVerified).toLocaleDateString('ar-SA')}
                          </p>
                          <p className="text-sm text-gray-600">آخر تحقق</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">لم يتم العثور على شهادة للعرض</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Tab 3: Platform Statistics */}
            <TabsContent value="stats">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <p className="text-3xl font-bold text-green-600">1,247</p>
                    <p className="text-gray-600">شهادات صادرة</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <p className="text-3xl font-bold text-blue-600">98.7%</p>
                    <p className="text-gray-600">معدل نجاح التحقق</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <QrCode className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <p className="text-3xl font-bold text-purple-600">856</p>
                    <p className="text-gray-600">رموز QR مُولدة</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <Zap className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                    <p className="text-3xl font-bold text-orange-600">324</p>
                    <p className="text-gray-600">توقيعات رقمية</p>
                  </CardContent>
                </Card>
              </div>

              {/* Sprint 4 Features Summary */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    ميزات Sprint 4 الجديدة
                  </CardTitle>
                  <CardDescription>
                    تم تطبيق التحسينات والميزات الجديدة في هذا السبرنت
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">تحسينات معالجة PDF</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• دعم ملفات PDF متعددة الصفحات</li>
                        <li>• تحسين دقة استخراج النصوص العربية</li>
                        <li>• فلترة وتنظيف البيانات المستخرجة</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium">ميزات الأمان الجديدة</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• رموز QR للتحقق السريع</li>
                        <li>• التوقيع الرقمي RSA-SHA256</li>
                        <li>• نظام التحقق من الصلاحية</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
