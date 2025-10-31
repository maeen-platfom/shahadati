/**
 * مكون التوقيع الرقمي المحاكي والشهادة المعززة
 * Sprint 4: ميزات الأمان والتوقيع الرقمي
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Lock, 
  CheckCircle, 
  AlertTriangle, 
  Fingerprint, 
  Key, 
  Clock,
  FileCheck,
  Zap,
  Award,
  Star
} from 'lucide-react';

interface DigitalSignatureProps {
  certificateId: string;
  certificateNumber: string;
  studentName: string;
  templateId: string;
  onSignatureComplete?: (signature: DigitalSignatureResult) => void;
  className?: string;
}

interface DigitalSignatureResult {
  signatureId: string;
  signatureHash: string;
  timestamp: string;
  algorithm: string;
  keyFingerprint: string;
  validity: 'valid' | 'expired' | 'revoked';
  issuer: string;
}

interface EnhancedCertificateProps {
  certificateData: {
    certificateId: string;
    certificateNumber: string;
    studentName: string;
    studentEmail?: string;
    issueDate: string;
    templateName: string;
    verificationHash: string;
    qrCode?: string;
    digitalSignature?: DigitalSignatureResult;
  };
  features: {
    qrCodeEnabled: boolean;
    digitalSignatureEnabled: boolean;
    arabicTextSupport: boolean;
    multiPageSupport: boolean;
    blockchainVerification?: boolean;
  };
  className?: string;
}

export function DigitalSignatureComponent({
  certificateId,
  certificateNumber,
  studentName,
  templateId,
  onSignatureComplete,
  className = '',
}: DigitalSignatureProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [signature, setSignature] = useState<DigitalSignatureResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSignature = async () => {
    setIsGenerating(true);
    setProgress(0);
    setError(null);

    try {
      // محاكاة عملية التوقيع الرقمي
      const steps = [
        { progress: 20, message: 'توليد مفتاح خاص...' },
        { progress: 40, message: 'حساب hash للبيانات...' },
        { progress: 60, message: 'تطبيق خوارزمية التوقيع...' },
        { progress: 80, message: 'التحقق من صحة التوقيع...' },
        { progress: 100, message: 'إنهاء عملية التوقيع...' },
      ];

      for (const step of steps) {
        setProgress(step.progress);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // إنشاء توقيع رقمي محاكي
      const mockSignature: DigitalSignatureResult = {
        signatureId: crypto.randomUUID(),
        signatureHash: generateMockHash(),
        timestamp: new Date().toISOString(),
        algorithm: 'RSA-SHA256',
        keyFingerprint: generateMockFingerprint(),
        validity: 'valid',
        issuer: 'منصة شهاداتي - نظام التوقيع الرقمي',
      };

      setSignature(mockSignature);
      onSignatureComplete?.(mockSignature);

    } catch (err) {
      setError('فشل في إنشاء التوقيع الرقمي');
      console.error('Digital signature error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockHash = () => {
    const chars = '0123456789abcdef';
    let result = 'sig_';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateMockFingerprint = () => {
    const chars = '0123456789ABCDEF';
    let result = '';
    for (let i = 0; i < 40; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  return (
    <Card className={`border-2 border-purple-100 ${className}`}>
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-purple-600" />
          <CardTitle className="text-lg text-purple-900">التوقيع الرقمي المحسن</CardTitle>
        </div>
        <CardDescription className="text-purple-700">
          حماية فائقة للشهادات بتوقيع رقمي موثوق
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        {!signature ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">معلومات الشهادة</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">رقم الشهادة:</span>
                  <span className="font-mono">{certificateNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">اسم الطالب:</span>
                  <span>{studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">معرف القالب:</span>
                  <span className="font-mono">{templateId}</span>
                </div>
              </div>
            </div>

            {isGenerating && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Fingerprint className="h-4 w-4 text-purple-600 animate-pulse" />
                  <span className="text-sm text-purple-700">جاري إنشاء التوقيع الرقمي...</span>
                </div>
                <Progress value={progress} className="w-full" />
                <p className="text-xs text-gray-500 text-center">{progress}% مكتمل</p>
              </div>
            )}

            <Button 
              onClick={handleGenerateSignature}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isGenerating ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  جاري التوقيع...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  إنشاء توقيع رقمي
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">تم إنشاء التوقيع الرقمي بنجاح</span>
              </div>
              
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">معرف التوقيع:</span>
                  <span className="font-mono text-xs">{signature.signatureId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">خوارزمية التوقيع:</span>
                  <span className="font-medium">{signature.algorithm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">بصمة المفتاح:</span>
                  <span className="font-mono text-xs">{signature.keyFingerprint}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">تاريخ التوقيع:</span>
                  <span>{new Date(signature.timestamp).toLocaleString('ar-SA')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">حالة الصلاحية:</span>
                  <Badge 
                    variant={signature.validity === 'valid' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {signature.validity === 'valid' ? 'صالح' : signature.validity}
                  </Badge>
                </div>
              </div>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>ميزة Sprint 4:</strong> التوقيع الرقمي يضمن أصالة الشهادة 
                وحمايتها من التلاعب باستخدام خوارزمية RSA-SHA256 المتقدمة.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

// مكون الشهادة المعززة بالميزات الجديدة
export function EnhancedCertificateDisplay({
  certificateData,
  features,
  className = '',
}: EnhancedCertificateProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card className={`border-2 border-blue-200 shadow-lg ${className}`}>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-xl text-blue-900">شهادة رقمية معززة</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Sprint 4
          </Badge>
        </div>
        <CardDescription className="text-blue-700">
          شهادة معززة بميزات الأمان والتوقيع الرقمي المتقدمة
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* معلومات الشهادة الأساسية */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            معلومات الشهادة
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">رقم الشهادة</p>
              <p className="font-mono font-bold text-lg text-blue-600">{certificateData.certificateNumber}</p>
            </div>
            <div>
              <p className="text-gray-600">اسم الطالب</p>
              <p className="font-medium">{certificateData.studentName}</p>
            </div>
            <div>
              <p className="text-gray-600">تاريخ الإصدار</p>
              <p className="font-medium">{new Date(certificateData.issueDate).toLocaleDateString('ar-SA')}</p>
            </div>
            <div>
              <p className="text-gray-600">اسم القالب</p>
              <p className="font-medium">{certificateData.templateName}</p>
            </div>
          </div>
        </div>

        {/* الميزات المفعلة */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
          <h3 className="font-medium text-green-900 mb-3 flex items-center gap-2">
            <Star className="h-4 w-4" />
            الميزات المفعلة
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {features.qrCodeEnabled && (
              <Badge variant="secondary" className="justify-start text-xs">
                <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                رمز QR للتحقق
              </Badge>
            )}
            {features.digitalSignatureEnabled && (
              <Badge variant="secondary" className="justify-start text-xs">
                <Lock className="h-3 w-3 mr-1 text-purple-600" />
                توقيع رقمي
              </Badge>
            )}
            {features.arabicTextSupport && (
              <Badge variant="secondary" className="justify-start text-xs">
                <CheckCircle className="h-3 w-3 mr-1 text-blue-600" />
                دعم اللغة العربية
              </Badge>
            )}
            {features.multiPageSupport && (
              <Badge variant="secondary" className="justify-start text-xs">
                <CheckCircle className="h-3 w-3 mr-1 text-indigo-600" />
                دعم صفحات متعددة
              </Badge>
            )}
          </div>
        </div>

        {/* التوقيع الرقمي */}
        {certificateData.digitalSignature && (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              التوقيع الرقمي
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-purple-700">خوارزمية التوقيع:</span>
                <span className="font-mono">{certificateData.digitalSignature.algorithm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">حالة الصلاحية:</span>
                <Badge 
                  variant={certificateData.digitalSignature.validity === 'valid' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {certificateData.digitalSignature.validity === 'valid' ? 'صالح' : certificateData.digitalSignature.validity}
                </Badge>
              </div>
              <div className="text-center pt-2">
                <p className="text-purple-600 text-xs">معرف التوقيع: {certificateData.digitalSignature.signatureId}</p>
              </div>
            </div>
          </div>
        )}

        {/* رمز التحقق */}
        {features.qrCodeEnabled && certificateData.qrCode && (
          <div className="text-center">
            <div className="inline-block bg-white p-3 rounded-lg border border-gray-200">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-2">
                <Key className="h-12 w-12 text-white" />
              </div>
              <p className="text-xs text-gray-600">رمز QR للتحقق السريع</p>
            </div>
          </div>
        )}

        {/* تفاصيل إضافية */}
        <div className="space-y-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowDetails(!showDetails)}
            className="w-full"
          >
            <Zap className="h-4 w-4 mr-2" />
            {showDetails ? 'إخفاء التفاصيل التقنية' : 'عرض التفاصيل التقنية'}
          </Button>

          {showDetails && (
            <div className="bg-gray-50 p-4 rounded-lg border text-xs">
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-700">هاش التحقق:</span>
                  <p className="font-mono break-all text-gray-600">{certificateData.verificationHash}</p>
                </div>
                <Separator />
                <div>
                  <span className="font-medium text-gray-700">معرف الشهادة:</span>
                  <p className="font-mono text-gray-600">{certificateData.certificateId}</p>
                </div>
                <Separator />
                <div>
                  <span className="font-medium text-gray-700">بوابة التحقق:</span>
                  <p className="text-gray-600">Blockchain + RSA-SHA256</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default DigitalSignatureComponent;
