'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Rocket, 
  Settings, 
  Monitor, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Info
} from 'lucide-react';
import DeploymentManager from '@/components/admin/DeploymentManager';
import ProductionSettings from '@/components/admin/ProductionSettings';
import EnvironmentManager from '@/components/admin/EnvironmentManager';
import DeploymentMonitor from '@/components/admin/DeploymentMonitor';

export default function DeploymentPage() {
  const [activeTab, setActiveTab] = useState('deploy');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* العنوان الرئيسي */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Rocket className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إعداد الإنتاج والنشر</h1>
            <p className="text-gray-600 mt-1">
              إدارة وإعداد منصة شهاداتي للنشر في بيئة الإنتاج
            </p>
          </div>
        </div>

        {/* معلومات الحالة العامة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">حالة النظام</p>
                  <p className="text-lg font-semibold text-green-600">جاهز للإنتاج</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">مستوى الأمان</p>
                  <p className="text-lg font-semibold text-blue-600">عالي</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Monitor className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">المراقبة</p>
                  <p className="text-lg font-semibold text-purple-600">مفعلة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* معلومات التهيئة */}
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>ملاحظة مهمة:</strong> تأكد من إعداد جميع متغيرات البيئة واختبار الإعدادات قبل النشر في بيئة الإنتاج.
            راجع قائمة المراجعة أدناه لضمان نجاح النشر.
          </AlertDescription>
        </Alert>

        {/* قائمة المراجعة */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">قائمة مراجعة النشر</CardTitle>
            <CardDescription>
              تأكد من إكمال جميع البنود قبل النشر
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">إعدادات قاعدة البيانات</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">إنشاء اتصال آمن SSL/TLS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">إعداد RLS policies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">تحسين الاستعلامات</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">إعدادات الأمان</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">مفاتيح JWT آمنة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">حدود المعدل (Rate Limiting)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">CORS policies</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">المراقبة والسجلات</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">سجلات النظام</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">مراقبة الأداء</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">تنبيهات الأخطاء</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">النسخ الاحتياطي</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">نسخة احتياطية من قاعدة البيانات</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">نسخة احتياطية من الملفات</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">اختبار الاستعادة</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* التبويبات الرئيسية */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="deploy" className="flex items-center gap-2">
                <Rocket className="h-4 w-4" />
                النشر
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                الإعدادات
              </TabsTrigger>
              <TabsTrigger value="environment" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                البيئة
              </TabsTrigger>
              <TabsTrigger value="monitor" className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                المراقبة
              </TabsTrigger>
            </TabsList>

            {/* محتوى التبويبات */}
            <div className="mt-6">
              <TabsContent value="deploy" className="mt-0">
                <DeploymentManager />
              </TabsContent>

              <TabsContent value="settings" className="mt-0">
                <ProductionSettings />
              </TabsContent>

              <TabsContent value="environment" className="mt-0">
                <EnvironmentManager />
              </TabsContent>

              <TabsContent value="monitor" className="mt-0">
                <DeploymentMonitor />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* معلومات إضافية */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">الموارد التعليمية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Info className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">دليل النشر</p>
                <p className="text-sm text-muted-foreground">
                  دليل شامل لنشر منصة شهاداتي
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">أفضل الممارسات</p>
                <p className="text-sm text-muted-foreground">
                  نصائح لضمان الأمان والأداء
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Monitor className="h-5 w-5 text-purple-500" />
              <div>
                <p className="font-medium">مراقبة الأداء</p>
                <p className="text-sm text-muted-foreground">
                  إعدادات المراقبة والتنبيهات
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">معلومات سريعة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">الإصدار الحالي</span>
              <Badge variant="secondary">1.0.0</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">بيئة التشغيل</span>
              <Badge variant="outline">Production</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">آخر نشر</span>
              <span className="text-sm">لم يتم النشر بعد</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">حالة النسخ الاحتياطي</span>
              <Badge variant="default">متوفر</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}