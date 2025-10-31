/**
 * مكون جديد لعرض رموز QR للشهادات
 * يدعم التحقق من صحة الشهادة عبر QR code
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, Copy, Download, ExternalLink, QrCode, Shield, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CertificateQRProps {
  certificateId: string;
  certificateNumber: string;
  qrCode?: string;
  verificationHash?: string;
  certificateUrl?: string;
  studentName?: string;
  issueDate?: string;
  className?: string;
}

interface VerificationResult {
  isValid: boolean;
  certificateData?: {
    certificateNumber: string;
    studentName: string;
    issueDate: string;
    templateId: string;
    verificationHash: string;
  };
  error?: string;
  verificationTime?: string;
}

export function CertificateQRDisplay({
  certificateId,
  certificateNumber,
  qrCode,
  verificationHash,
  certificateUrl,
  studentName,
  issueDate,
  className = '',
}: CertificateQRProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // محاكاة بيانات QR للشهادة
  const qrData = {
    certificate_number: certificateNumber,
    student_name: studentName,
    issue_date: issueDate,
    verification_hash: verificationHash,
    certificate_id: certificateId,
  };

  const handleVerifyCertificate = async () => {
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      // محاكاة عملية التحقق
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockVerificationResult: VerificationResult = {
        isValid: true,
        certificateData: {
          certificateNumber,
          studentName: studentName || 'غير محدد',
          issueDate: issueDate || new Date().toISOString(),
          templateId: 'template_123',
          verificationHash: verificationHash || 'hash_456',
        },
        verificationTime: new Date().toLocaleString('ar-SA'),
      };

      setVerificationResult(mockVerificationResult);
    } catch (error) {
      setVerificationResult({
        isValid: false,
        error: 'فشل في التحقق من الشهادة',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopyQRData = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(qrData, null, 2));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('فشل في نسخ بيانات QR:', error);
    }
  };

  const handleDownloadCertificate = () => {
    if (certificateUrl) {
      window.open(certificateUrl, '_blank');
    }
  };

  return (
    <Card className={`border-2 border-blue-100 ${className}`}>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-2">
          <QrCode className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg text-blue-900">رمز التحقق الذكي</CardTitle>
        </div>
        <CardDescription className="text-blue-700">
          استخدم رمز QR للتحقق من صحة الشهادة فوراً
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        {/* عرض رمز QR */}
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            {/* محاكاة عرض رمز QR */}
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <QrCode className="h-16 w-16 text-white" />
              <div className="absolute text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                QR Code
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">رقم الشهادة</p>
            <p className="font-mono font-bold text-lg text-gray-900">{certificateNumber}</p>
          </div>
        </div>

        <Separator />

        {/* معلومات الشهادة */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">اسم الطالب</p>
            <p className="font-medium">{studentName || 'غير محدد'}</p>
          </div>
          <div>
            <p className="text-gray-500">تاريخ الإصدار</p>
            <p className="font-medium">{issueDate ? new Date(issueDate).toLocaleDateString('ar-SA') : 'غير محدد'}</p>
          </div>
        </div>

        <Separator />

        {/* أزرار الإجراءات */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={handleVerifyCertificate}
            disabled={isVerifying}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isVerifying ? (
              <Clock className="h-4 w-4 animate-spin" />
            ) : (
              <Shield className="h-4 w-4" />
            )}
            {isVerifying ? 'جاري التحقق...' : 'التحقق من الصدقية'}
          </Button>

          <Button 
            onClick={handleDownloadCertificate}
            disabled={!certificateUrl}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            تحميل الشهادة
          </Button>
        </div>

        {/* زر نسخ بيانات QR */}
        <Button
          onClick={handleCopyQRData}
          variant="ghost"
          size="sm"
          className="w-full flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <Copy className="h-4 w-4" />
          {copySuccess ? 'تم النسخ بنجاح!' : 'نسخ بيانات QR'}
        </Button>

        {/* نتائج التحقق */}
        {verificationResult && (
          <Alert className={verificationResult.isValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <div className="flex items-center gap-2">
              {verificationResult.isValid ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={verificationResult.isValid ? "text-green-800" : "text-red-800"}>
                {verificationResult.isValid ? (
                  <div className="space-y-2">
                    <p className="font-medium">✅ الشهادة صالحة ومصدقة</p>
                    {verificationResult.certificateData && (
                      <div className="text-sm space-y-1">
                        <p>• رقم الشهادة: {verificationResult.certificateData.certificateNumber}</p>
                        <p>• اسم الطالب: {verificationResult.certificateData.studentName}</p>
                        <p>• تاريخ الإصدار: {new Date(verificationResult.certificateData.issueDate).toLocaleDateString('ar-SA')}</p>
                        <p>• وقت التحقق: {verificationResult.verificationTime}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p>❌ {verificationResult.error || 'الشهادة غير صالحة'}</p>
                )}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* ميزات Sprint 4 */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">ميزات Sprint 4 الجديدة</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              توقيع رقمي
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <QrCode className="h-3 w-3 mr-1" />
              تحقق فوري
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              حماية متقدمة
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// مكون للتحقق من الشهادة باستخدام رابط أو رقم الشهادة
interface CertificateVerificationProps {
  onVerificationComplete?: (result: VerificationResult) => void;
}

export function CertificateVerification({ onVerificationComplete }: CertificateVerificationProps) {
  const [inputValue, setInputValue] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async () => {
    if (!inputValue.trim()) return;

    setIsVerifying(true);
    setResult(null);

    try {
      // محاكاة عملية التحقق من الرابط أو الرقم
      await new Promise(resolve => setTimeout(resolve, 2000));

      // فحص إذا كان المدخل رقم شهادة أو رابط
      if (inputValue.startsWith('CERT-')) {
        // رقم شهادة
        const mockResult: VerificationResult = {
          isValid: true,
          certificateData: {
            certificateNumber: inputValue,
            studentName: 'أحمد محمد علي',
            issueDate: new Date().toISOString(),
            templateId: 'template_456',
            verificationHash: 'verified_hash_789',
          },
          verificationTime: new Date().toLocaleString('ar-SA'),
        };
        setResult(mockResult);
      } else {
        // رابط شهادة
        const mockResult: VerificationResult = {
          isValid: false,
          error: 'رابط الشهادة غير صحيح أو منتهي الصلاحية',
        };
        setResult(mockResult);
      }

      onVerificationComplete?.(result!);
    } catch (error) {
      const errorResult: VerificationResult = {
        isValid: false,
        error: 'خطأ في الاتصال أو معالجة الطلب',
      };
      setResult(errorResult);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Shield className="h-6 w-6 text-blue-600" />
          التحقق من صحة الشهادة
        </CardTitle>
        <CardDescription>
          أدخل رقم الشهادة أو رابط الشهادة للتحقق من صحتها
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="رقم الشهادة (مثال: CERT-2025-123456) أو رابط الشهادة"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isVerifying}
          />
          <Button 
            onClick={handleVerify}
            disabled={!inputValue.trim() || isVerifying}
            className="px-6"
          >
            {isVerifying ? 'جاري التحقق...' : 'تحقق'}
          </Button>
        </div>

        {result && (
          <Alert className={result.isValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <div className="flex items-start gap-3">
              {result.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <AlertDescription className={result.isValid ? "text-green-800" : "text-red-800"}>
                  {result.isValid ? (
                    <div className="space-y-2">
                      <p className="font-medium">✅ الشهادة صالحة ومصدقة</p>
                      {result.certificateData && (
                        <div className="text-sm space-y-1 bg-white p-3 rounded border">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-gray-600">رقم الشهادة:</span>
                              <p className="font-mono font-bold">{result.certificateData.certificateNumber}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">اسم الطالب:</span>
                              <p>{result.certificateData.studentName}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">تاريخ الإصدار:</span>
                              <p>{new Date(result.certificateData.issueDate).toLocaleDateString('ar-SA')}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">وقت التحقق:</span>
                              <p>{result.verificationTime}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p>❌ {result.error}</p>
                  )}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

export default CertificateQRDisplay;
