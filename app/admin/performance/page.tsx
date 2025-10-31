'use client'

import PerformanceMonitor from '@/components/admin/PerformanceMonitor';
import CacheSettings from '@/components/admin/CacheSettings';
import DatabaseOptimizer from '@/components/admin/DatabaseOptimizer';
import QueryOptimizer from '@/components/admin/QueryOptimizer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  HardDrive, 
  Database, 
  Zap, 
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Settings,
  RefreshCw,
  Download
} from 'lucide-react';

export const metadata = {
  title: 'مراقبة الأداء | نظام الإدارة',
  description: 'إدارة ومراقبة أداء منصة شهاداتي',
};

export default function PerformancePage() {
  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">مراقبة الأداء</h1>
          <p className="text-gray-600 mt-2">
            مراقبة وتحسين أداء منصة شهاداتي في الوقت الفعلي
          </p>
        </div>
        
        <div className="flex items-center space-x-3 space-x-reverse">
          <Badge variant="default" className="px-3 py-1">
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>مراقبة نشطة</span>
            </div>
          </Badge>
          
          <button className="p-2 rounded-lg border hover:bg-gray-50 transition-colors">
            <RefreshCw className="h-5 w-5 text-gray-600" />
          </button>
          
          <button className="p-2 rounded-lg border hover:bg-gray-50 transition-colors">
            <Download className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* نظرة عامة سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">حالة النظام</p>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-xl font-bold text-green-600">ممتاز</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">متوسط الاستجابة</p>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-xl font-bold">245ms</span>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="p-2 bg-purple-100 rounded-lg">
                <HardDrive className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">استخدام الذاكرة</p>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-xl font-bold">67%</span>
                  <span className="text-sm text-orange-600">234MB</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Database className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">قاعدة البيانات</p>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-xl font-bold text-green-600">مُحسنة</span>
                  <Zap className="h-4 w-4 text-green-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* علامات الأداء */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <TrendingUp className="h-5 w-5" />
            <span>علامات الأداء الرئيسية</span>
          </CardTitle>
          <CardDescription>
            مؤشرات الأداء المهمة للمنصة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-medium text-green-800">الأداء ممتاز</h4>
              <p className="text-sm text-green-600 mt-1">
                جميع مؤشرات الأداء ضمن المستويات المثلى
              </p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Settings className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-medium text-blue-800">مُحسنة تلقائياً</h4>
              <p className="text-sm text-blue-600 mt-1">
                النظام يطبق التحسينات تلقائياً
              </p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <Activity className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h4 className="font-medium text-purple-800">مراقبة مستمرة</h4>
              <p className="text-sm text-purple-600 mt-1">
                مراقبة الأداء على مدار الساعة
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* تبويبات أدوات الأداء */}
      <Tabs defaultValue="monitor" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="monitor" className="flex items-center space-x-2 space-x-reverse">
            <Activity className="h-4 w-4" />
            <span>مراقبة الأداء</span>
          </TabsTrigger>
          
          <TabsTrigger value="cache" className="flex items-center space-x-2 space-x-reverse">
            <HardDrive className="h-4 w-4" />
            <span>التخزين المؤقت</span>
          </TabsTrigger>
          
          <TabsTrigger value="database" className="flex items-center space-x-2 space-x-reverse">
            <Database className="h-4 w-4" />
            <span>قاعدة البيانات</span>
          </TabsTrigger>
          
          <TabsTrigger value="query" className="flex items-center space-x-2 space-x-reverse">
            <Zap className="h-4 w-4" />
            <span>الاستعلامات</span>
          </TabsTrigger>
          
          <TabsTrigger value="settings" className="flex items-center space-x-2 space-x-reverse">
            <Settings className="h-4 w-4" />
            <span>الإعدادات</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monitor" className="mt-6">
          <PerformanceMonitor 
            refreshInterval={5000}
            showAlerts={true}
          />
        </TabsContent>

        <TabsContent value="cache" className="mt-6">
          <CacheSettings 
            onConfigChange={(config) => {
              console.log('تحديث إعدادات التخزين المؤقت:', config);
            }}
            showAdvanced={true}
          />
        </TabsContent>

        <TabsContent value="database" className="mt-6">
          <DatabaseOptimizer 
            onOptimizationApply={(optimization) => {
              console.log('تطبيق تحسين قاعدة البيانات:', optimization);
            }}
            showAdvanced={true}
          />
        </TabsContent>

        <TabsContent value="query" className="mt-6">
          <QueryOptimizer 
            onApplyOptimization={(suggestion) => {
              console.log('تطبيق تحسين الاستعلام:', suggestion);
            }}
            showHistory={true}
          />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Settings className="h-5 w-5" />
                  <span>إعدادات الأداء العامة</span>
                </CardTitle>
                <CardDescription>
                  تخصيص إعدادات مراقبة وتحسين الأداء
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">إعدادات المراقبة</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm">التفعيل التلقائي للمراقبة</label>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                          <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer"/>
                          <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm">فترة التحديث (ثانية)</label>
                        <input 
                          type="number" 
                          defaultValue="5"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm">عدد المقاييس المحفوظة</label>
                        <input 
                          type="number" 
                          defaultValue="1000"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">إعدادات التنبيهات</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm">حد زمن التحميل (ms)</label>
                        <input 
                          type="number" 
                          defaultValue="3000"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm">حد استجابة API (ms)</label>
                        <input 
                          type="number" 
                          defaultValue="1000"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm">حد استخدام الذاكرة (MB)</label>
                        <input 
                          type="number" 
                          defaultValue="100"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">إجراءات سريعة</h4>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 space-x-reverse">
                      <RefreshCw className="h-4 w-4" />
                      <span>إعادة تشغيل المراقبة</span>
                    </button>
                    
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 space-x-reverse">
                      <CheckCircle className="h-4 w-4" />
                      <span>تحسين تلقائي</span>
                    </button>
                    
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 space-x-reverse">
                      <Download className="h-4 w-4" />
                      <span>تصدير الإعدادات</span>
                    </button>
                    
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2 space-x-reverse">
                      <AlertTriangle className="h-4 w-4" />
                      <span>إعادة تعيين</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* معلومات النظام */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات النظام</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">نسخة منصة شهاداتي:</span>
                    <span className="mr-2 text-gray-600">v2.1.0</span>
                  </div>
                  <div>
                    <span className="font-medium">آخر تحديث:</span>
                    <span className="mr-2 text-gray-600">2025-10-31 04:35:32</span>
                  </div>
                  <div>
                    <span className="font-medium">بيئة التشغيل:</span>
                    <span className="mr-2 text-gray-600">Production</span>
                  </div>
                  <div>
                    <span className="font-medium">إصدار المراقب:</span>
                    <span className="mr-2 text-gray-600">Performance v1.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}