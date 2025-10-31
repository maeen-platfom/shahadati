'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  HardDrive, 
  Clock, 
  Zap, 
  Database, 
  Settings, 
  RefreshCw,
  Trash2,
  BarChart3,
  Cpu,
  CheckCircle,
  AlertCircle,
  Download,
  Upload
} from 'lucide-react';
import { 
  SmartCache, 
  defaultCache, 
  apiCache, 
  pageCache, 
  userDataCache,
  CacheStats,
  type CacheConfig 
} from '@/lib/utils/cache';

interface CacheSettingsProps {
  onConfigChange?: (config: CacheConfig) => void;
  showAdvanced?: boolean;
}

export default function CacheSettings({ onConfigChange, showAdvanced = false }: CacheSettingsProps) {
  const [caches, setCaches] = useState({
    default: defaultCache,
    api: apiCache,
    page: pageCache,
    userData: userDataCache
  });
  
  const [stats, setStats] = useState<Record<string, CacheStats>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // تحديث الإحصائيات
  const refreshStats = () => {
    const newStats: Record<string, CacheStats> = {};
    
    Object.entries(caches).forEach(([key, cache]) => {
      newStats[key] = cache.getStats();
    });
    
    setStats(newStats);
  };

  useEffect(() => {
    refreshStats();
    
    // تحديث كل 5 ثوان
    const interval = setInterval(refreshStats, 5000);
    return () => clearInterval(interval);
  }, []);

  // تحديث إعدادات التخزين المؤقت
  const updateCacheConfig = (cacheName: string, config: Partial<CacheConfig>) => {
    const cache = caches[cacheName as keyof typeof caches];
    if (cache) {
      cache.updateConfig(config);
      onConfigChange?.(config as CacheConfig);
      refreshStats();
    }
  };

  // مسح التخزين المؤقت
  const clearCache = (cacheName: string) => {
    const cache = caches[cacheName as keyof typeof caches];
    if (cache) {
      cache.clear();
      refreshStats();
    }
  };

  // معاينة البيانات المحفوظة
  const previewCacheData = (cacheName: string) => {
    const cache = caches[cacheName as keyof typeof caches];
    if (cache) {
      const keys = cache.keys();
      console.log(`بيانات التخزين المؤقت ${cacheName}:`, keys);
      alert(`عدد العناصر المحفوظة: ${keys.length}\nلتفاصيل أكثر، افتح Console`);
    }
  };

  // تحسين التخزين المؤقت
  const optimizeCache = (cacheName: string) => {
    const cache = caches[cacheName as keyof typeof caches];
    if (cache) {
      setIsLoading(true);
      
      // محاكاة التحسين
      setTimeout(() => {
        cache.clearOldData(1); // حذف البيانات الأقدم من ساعة
        refreshStats();
        setIsLoading(false);
      }, 1000);
    }
  };

  // إعدادات عامة
  const GeneralSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Settings className="h-5 w-5" />
            <span>الإعدادات العامة</span>
          </CardTitle>
          <CardDescription>
            إعدادات شاملة لتحسين أداء التخزين المؤقت
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">التخزين المؤقت الافتراضي</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="default-enabled">تفعيل التخزين المؤقت</Label>
                  <Switch 
                    id="default-enabled"
                    checked={true}
                    onCheckedChange={(checked) => updateCacheConfig('default', { enabled: checked })}
                  />
                </div>
                <div>
                  <Label htmlFor="default-ttl">مدة البقاء (دقيقة)</Label>
                  <Input
                    id="default-ttl"
                    type="number"
                    value={5}
                    onChange={(e) => updateCacheConfig('default', { ttl: parseInt(e.target.value) * 60000 })}
                  />
                </div>
                <div>
                  <Label htmlFor="default-size">الحجم الأقصى (MB)</Label>
                  <Input
                    id="default-size"
                    type="number"
                    value={50}
                    onChange={(e) => updateCacheConfig('default', { maxSize: parseInt(e.target.value) * 1024 * 1024 })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">API Cache</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="api-enabled">تفعيل</Label>
                  <Switch 
                    id="api-enabled"
                    checked={true}
                    onCheckedChange={(checked) => updateCacheConfig('api', { enabled: checked })}
                  />
                </div>
                <div>
                  <Label htmlFor="api-ttl">مدة البقاء (دقيقة)</Label>
                  <Input
                    id="api-ttl"
                    type="number"
                    value={10}
                    onChange={(e) => updateCacheConfig('api', { ttl: parseInt(e.target.value) * 60000 })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="api-compression">الضغط</Label>
                  <Switch 
                    id="api-compression"
                    checked={true}
                    onCheckedChange={(checked) => updateCacheConfig('api', { compression: checked })}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // إحصائيات الأداء
  const PerformanceStats = () => (
    <div className="space-y-4">
      {Object.entries(stats).map(([cacheName, cacheStats]) => (
        <Card key={cacheName}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <HardDrive className="h-5 w-5" />
                <span>
                  {cacheName === 'default' ? 'التخزين المؤقت الافتراضي' :
                   cacheName === 'api' ? 'تخزين مؤقت للـ API' :
                   cacheName === 'page' ? 'تخزين مؤقت للصفحات' :
                   cacheName === 'userData' ? 'بيانات المستخدم' : cacheName}
                </span>
                <Badge variant={cacheStats.entryCount > 0 ? 'default' : 'secondary'}>
                  {cacheStats.entryCount} عنصر
                </Badge>
              </CardTitle>
              <div className="flex space-x-2 space-x-reverse">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => optimizeCache(cacheName)}
                  disabled={isLoading}
                >
                  <Zap className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => clearCache(cacheName)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {cacheStats.hitRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">معدل الضرب</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {(cacheStats.totalSize / 1024 / 1024).toFixed(1)}MB
                </div>
                <div className="text-sm text-gray-600">الحجم المستخدم</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {cacheStats.hits}
                </div>
                <div className="text-sm text-gray-600">الضربات</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {cacheStats.misses}
                </div>
                <div className="text-sm text-gray-600">الفرص الفائتة</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>استخدام الذاكرة</span>
                <span>{((cacheStats.totalSize / (50 * 1024 * 1024)) * 100).toFixed(1)}%</span>
              </div>
              <Progress 
                value={(cacheStats.totalSize / (50 * 1024 * 1024)) * 100} 
                className="h-2"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                آخر تحديث: {new Date().toLocaleTimeString('ar-EG')}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => previewCacheData(cacheName)}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                معاينة البيانات
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // إدارة المتقدم
  const AdvancedSettings = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Database className="h-5 w-5" />
            <span>إعدادات متقدمة</span>
          </CardTitle>
          <CardDescription>
            إعدادات تفصيلية للتحسين المتقدم
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">صفحات التخزين المؤقت</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>الاحتفاظ في التخزين المحلي</Label>
                  <Switch 
                    checked={true}
                    onCheckedChange={(checked) => updateCacheConfig('page', { persist: checked })}
                  />
                </div>
                <div>
                  <Label>مدة البقاء (دقيقة)</Label>
                  <Input
                    type="number"
                    value={30}
                    onChange={(e) => updateCacheConfig('page', { ttl: parseInt(e.target.value) * 60000 })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">بيانات المستخدم</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>التخزين الدائم</Label>
                  <Switch 
                    checked={true}
                    onCheckedChange={(checked) => updateCacheConfig('userData', { persist: checked })}
                  />
                </div>
                <div>
                  <Label>تنظيف تلقائي (ساعة)</Label>
                  <Select defaultValue="1">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">30 دقيقة</SelectItem>
                      <SelectItem value="1">ساعة واحدة</SelectItem>
                      <SelectItem value="6">6 ساعات</SelectItem>
                      <SelectItem value="24">24 ساعة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">أدوات الإدارة</h4>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={refreshStats}>
                <RefreshCw className="h-4 w-4 mr-2" />
                تحديث الإحصائيات
              </Button>
              <Button variant="outline" onClick={() => Object.values(caches).forEach(cache => cache.clear())}>
                <Trash2 className="h-4 w-4 mr-2" />
                مسح جميع البيانات
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                تصدير الإعدادات
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                استيراد الإعدادات
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // تحليل الأداء
  const PerformanceAnalysis = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <BarChart3 className="h-5 w-5" />
            <span>تحليل الأداء</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-medium">الأداء الجيد</h4>
              <p className="text-sm text-gray-600">
                معدل ضرب عالي، استجابة سريعة
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <h4 className="font-medium">يحتاج تحسين</h4>
              <p className="text-sm text-gray-600">
                معدل ضرب متوسط، قد يحتاج ضبط
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Cpu className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <h4 className="font-medium">أداء ضعيف</h4>
              <p className="text-sm text-gray-600">
                معدل ضرب منخفض، يحتاج تدخل فوري
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">اقتراحات التحسين</h4>
            <div className="space-y-2">
              {Object.entries(stats).map(([cacheName, cacheStats]) => {
                if (cacheStats.hitRate < 50) {
                  return (
                    <div key={cacheName} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm">
                        <strong>{cacheName}</strong>: معدل ضرب منخفض ({cacheStats.hitRate.toFixed(1)}%)
                        - يُنصح بزيادة مدة البقاء أو حجم التخزين المؤقت
                      </p>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <HardDrive className="h-6 w-6" />
            <span>إعدادات التخزين المؤقت</span>
          </CardTitle>
          <CardDescription>
            إدارة وتحسين التخزين المؤقت لتحسين أداء التطبيق
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="performance">الأداء</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          <TabsTrigger value="analysis">التحليل</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceStats />
        </TabsContent>

        <TabsContent value="settings">
          <AdvancedSettings />
        </TabsContent>

        <TabsContent value="analysis">
          <PerformanceAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
}