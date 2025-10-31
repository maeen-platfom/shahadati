/**
 * نموذج إصدار الشهادة المحسن مع ميزات Sprint 4
 * - خيارات الأمان المتقدمة
 * - إعدادات التخصيص
 * - واجهة محسنة
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  QrCode, 
  Lock, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  Star,
  Zap,
  Eye,
  EyeOff,
  Info,
  Key
} from 'lucide-react';

interface CertificateFormProps {
  link: string;
}

interface EnhancedCertificateData {
  template_id: string;
  access_code_id: string;
  template_name: string;
  template_description: string;
  fields: any[];
  features: {
    qr_code_enabled: boolean;
    digital_signature_enabled: boolean;
    multi_page_support: boolean;
    arabic_text_support: boolean;
  };
}

interface CertificateSubmissionData {
  student_name: string;
  student_email?: string;
  custom_fields: Record<string, string>;
  enable_qr: boolean;
  enable_digital_signature: boolean;
  enable_enhanced_security: boolean;
}

export default function EnhancedCertificateForm({ link }: CertificateFormProps) {
  const router = useRouter();
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [templateData, setTemplateData] = useState<EnhancedCertificateData | null>(null);
  const [validationData, setValidationData] = useState<EnhancedCertificateData | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [customFields, setCustomFields] = useState<Record<string, string>>({});
  const [enableQR, setEnableQR] = useState(true);
  const [enableDigitalSignature, setEnableDigitalSignature] = useState(false);
  const [enableEnhancedSecurity, setEnableEnhancedSecurity] = useState(true);

  const handleValidateCode = async () => {
    if (!studentName.trim() || !code.trim()) {
      setError('الرجاء إدخال الاسم والكود السري');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/cert/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          link,
          code: code.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشل التحقق من الكود');
      }

      // حفظ بيانات القالب للاستخدام
      setValidationData(data.data);
      setTemplateData(data.data);
      
      // تهيئة الحقول المخصصة
      const initialCustomFields: Record<string, string> = {};
      if (data.data.fields) {
        data.data.fields.forEach((field: any) => {
          if (field.field_type !== 'student_name' && field.field_type !== 'date' && field.field_type !== 'certificate_number') {
            initialCustomFields[field.field_type] = '';
          }
        });
      }
      setCustomFields(initialCustomFields);

      // الانتقال إلى تبويب الإعدادات
      setActiveTab('settings');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!templateData) {
      setError('يرجى التحقق من الكود أولاً');
      return;
    }

    setLoading(true);

    try {
      // إرسال البيانات إلى Edge Function
      const response = await fetch('/api/certificates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_code_id: validationData?.access_code_id || '',
          template_id: validationData?.template_id || '',
          student_name: studentName.trim(),
          student_email: studentEmail.trim() || undefined,
          custom_fields: customFields,
          enable_qr: enableQR,
          enable_digital_signature: enableDigitalSignature,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشل في إصدار الشهادة');
      }

      // الانتقال إلى صفحة عرض الشهادة
      router.push(`/cert/${link}/result?certificate_id=${data.data.certificate_id}`);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateCustomField = (fieldName: string, value: string) => {
    setCustomFields(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-2xl text-blue-900">إصدار الشهادة المعززة</CardTitle>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Star className="h-3 w-3 mr-1" />
              Sprint 4
            </Badge>
          </div>
          <CardDescription className="text-blue-700">
            احصل على شهادة رقمية معززة بميزات الأمان والتحقق المتقدمة
          </CardDescription>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              المعلومات الأساسية
            </TabsTrigger>
            <TabsTrigger value="settings" disabled={!validationData} className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              إعدادات Sprint 4
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={!validationData} className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              معاينة
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Basic Information */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  المعلومات الأساسية
                </CardTitle>
                <CardDescription>
                  أدخل بياناتك الشخصية ومعلومات الشهادة
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* حقل الاسم */}
                <div className="space-y-2">
                  <Label htmlFor="studentName" className="text-base font-medium">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="studentName"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="محمد أحمد علي"
                    className="text-lg py-3"
                    disabled={loading}
                  />
                  <p className="text-sm text-gray-500">كما تريد أن يظهر في الشهادة</p>
                </div>

                {/* حقل البريد الإلكتروني */}
                <div className="space-y-2">
                  <Label htmlFor="studentEmail" className="text-base font-medium">
                    البريد الإلكتروني (اختياري)
                  </Label>
                  <Input
                    type="email"
                    id="studentEmail"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="text-lg py-3"
                    disabled={loading}
                  />
                  <p className="text-sm text-gray-500">للتواصل وإرسال رابط الشهادة</p>
                </div>

                {/* حقل الكود السري */}
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-base font-medium">
                    الكود السري <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showCode ? 'text' : 'password'}
                      id="code"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="أدخل الكود الذي تلقيته"
                      className="text-lg py-3 font-mono pl-10"
                      disabled={loading}
                    />
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowCode(!showCode)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* رسالة الخطأ */}
                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* زر التحقق */}
                <Button
                  type="button"
                  onClick={handleValidateCode}
                  disabled={loading || !studentName.trim() || !code.trim()}
                  className="w-full py-4 text-lg"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      جاري التحقق من الكود...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      التحقق من الكود والانتقال للإعدادات
                    </>
                  )}
                </Button>

                {/* معلومات القالب (إذا تم التحقق) */}
                {validationData && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-900">تم التحقق بنجاح!</h4>
                          <p className="text-sm text-green-700 mt-1">
                            القالب: {validationData.template_name}
                          </p>
                          <p className="text-sm text-green-600">
                            {validationData.template_description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Sprint 4 Settings */}
          <TabsContent value="settings" className="space-y-6">
            {templateData ? (
              <>
                {/* معلومات القالب */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-purple-600" />
                      إعدادات الشهادة المعززة
                    </CardTitle>
                    <CardDescription>
                      خصص ميزات الأمان والحماية لشهادتك
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* ميزات القالب المتاحة */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">الميزات المتاحة في هذا القالب:</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          {templateData.features.qr_code_enabled ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-gray-400" />
                          )}
                          <span className={templateData.features.qr_code_enabled ? 'text-green-700' : 'text-gray-500'}>
                            رمز QR للتحقق
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {templateData.features.digital_signature_enabled ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-gray-400" />
                          )}
                          <span className={templateData.features.digital_signature_enabled ? 'text-green-700' : 'text-gray-500'}>
                            التوقيع الرقمي
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {templateData.features.multi_page_support ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-gray-400" />
                          )}
                          <span className={templateData.features.multi_page_support ? 'text-green-700' : 'text-gray-500'}>
                            دعم صفحات متعددة
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {templateData.features.arabic_text_support ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-gray-400" />
                          )}
                          <span className={templateData.features.arabic_text_support ? 'text-green-700' : 'text-gray-500'}>
                            دعم اللغة العربية
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* إعدادات الأمان */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        إعدادات الأمان والحماية
                      </h4>
                      
                      <div className="space-y-4">
                        {/* رمز QR */}
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-start gap-3">
                            <QrCode className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <h5 className="font-medium">رمز QR للتحقق السريع</h5>
                              <p className="text-sm text-gray-600">
                                إضافة رمز QR للتحقق من صحة الشهادة فوراً
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={enableQR && templateData.features.qr_code_enabled}
                            onCheckedChange={setEnableQR}
                            disabled={!templateData.features.qr_code_enabled}
                          />
                        </div>

                        {/* التوقيع الرقمي */}
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-start gap-3">
                            <Lock className="h-5 w-5 text-purple-600 mt-0.5" />
                            <div>
                              <h5 className="font-medium">التوقيع الرقمي المتقدم</h5>
                              <p className="text-sm text-gray-600">
                                حماية فائقة بتوقيع رقمي خوارزمية RSA-SHA256
                              </p>
                              <Badge variant="secondary" className="mt-1 text-xs">
                                Sprint 4
                              </Badge>
                            </div>
                          </div>
                          <Switch
                            checked={enableDigitalSignature && templateData.features.digital_signature_enabled}
                            onCheckedChange={setEnableDigitalSignature}
                            disabled={!templateData.features.digital_signature_enabled}
                          />
                        </div>

                        {/* الأمان المعزز */}
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-start gap-3">
                            <Zap className="h-5 w-5 text-orange-600 mt-0.5" />
                            <div>
                              <h5 className="font-medium">الأمان المعزز</h5>
                              <p className="text-sm text-gray-600">
                                حماية متقدمة ضد التلاعب والتزوير
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={enableEnhancedSecurity}
                            onCheckedChange={setEnableEnhancedSecurity}
                          />
                        </div>
                      </div>
                    </div>

                    {/* الحقول المخصصة */}
                    {Object.keys(customFields).length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium text-gray-900 mb-4">الحقول المخصصة</h4>
                          <div className="grid gap-4">
                            {Object.entries(customFields).map(([fieldName, value]) => (
                              <div key={fieldName} className="space-y-2">
                                <Label className="text-sm font-medium">
                                  {fieldName.replace(/_/g, ' ').toUpperCase()}
                                </Label>
                                <Input
                                  type="text"
                                  value={value}
                                  onChange={(e) => updateCustomField(fieldName, e.target.value)}
                                  placeholder={`أدخل ${fieldName.replace(/_/g, ' ')}`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">يرجى التحقق من الكود أولاً للوصول إلى الإعدادات</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab 3: Preview */}
          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-green-600" />
                  معاينة الشهادة
                </CardTitle>
                <CardDescription>
                  مراجعة جميع المعلومات قبل إصدار الشهادة
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {validationData ? (
                  <>
                    {/* ملخص البيانات */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">البيانات الشخصية</h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-gray-600">الاسم:</span> {studentName}</p>
                          {studentEmail && <p><span className="text-gray-600">البريد:</span> {studentEmail}</p>}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">معلومات الشهادة</h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-gray-600">القالب:</span> {validationData.template_name}</p>
                          <p><span className="text-gray-600">الكود:</span> {code}</p>
                        </div>
                      </div>
                    </div>

                    {/* الميزات المختارة */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">الميزات المختارة</h4>
                      <div className="flex flex-wrap gap-2">
                        {enableQR && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            <QrCode className="h-3 w-3 mr-1" />
                            رمز QR
                          </Badge>
                        )}
                        {enableDigitalSignature && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            <Lock className="h-3 w-3 mr-1" />
                            توقيع رقمي
                          </Badge>
                        )}
                        {enableEnhancedSecurity && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            <Zap className="h-3 w-3 mr-1" />
                            أمان معزز
                          </Badge>
                        )}
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Star className="h-3 w-3 mr-1" />
                          Sprint 4
                        </Badge>
                      </div>
                    </div>

                    {/* زر الإصدار */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 text-lg"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          جاري إصدار الشهادة المعززة...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          إصدار الشهادة المعززة
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Eye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">يرجى إكمال الخطوات السابقة لعرض المعاينة</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
