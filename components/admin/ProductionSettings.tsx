'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Database, 
  Lock, 
  Mail, 
  Monitor, 
  Shield, 
  Server,
  CheckCircle,
  AlertTriangle,
  Save,
  RotateCcw
} from 'lucide-react';
import { environmentService } from '@/lib/utils/environment';

interface ProductionConfig {
  database: {
    connectionPool: number;
    timeout: number;
    retryAttempts: number;
    enableSSL: boolean;
  };
  security: {
    jwtExpiration: number;
    passwordMinLength: number;
    enable2FA: boolean;
    rateLimitEnabled: boolean;
    corsOrigins: string[];
  };
  email: {
    enabled: boolean;
    provider: 'smtp' | 'sendgrid' | 'mailgun';
    fromEmail: string;
    fromName: string;
    templates: {
      welcome: boolean;
      certificate: boolean;
      passwordReset: boolean;
    };
  };
  monitoring: {
    enabled: boolean;
    logLevel: 'error' | 'warn' | 'info' | 'debug';
    performanceTracking: boolean;
    errorReporting: boolean;
    analyticsEnabled: boolean;
  };
  features: {
    certificateQR: boolean;
    digitalSignature: boolean;
    bulkGeneration: boolean;
    apiAccess: boolean;
    webhookNotifications: boolean;
  };
}

const defaultConfig: ProductionConfig = {
  database: {
    connectionPool: 10,
    timeout: 30000,
    retryAttempts: 3,
    enableSSL: true
  },
  security: {
    jwtExpiration: 24 * 60 * 60, // 24 hours
    passwordMinLength: 8,
    enable2FA: false,
    rateLimitEnabled: true,
    corsOrigins: ['https://shahadati.app', 'https://www.shahadati.app']
  },
  email: {
    enabled: true,
    provider: 'sendgrid',
    fromEmail: 'noreply@shahadati.app',
    fromName: 'منصة شهاداتي',
    templates: {
      welcome: true,
      certificate: true,
      passwordReset: true
    }
  },
  monitoring: {
    enabled: true,
    logLevel: 'info',
    performanceTracking: true,
    errorReporting: true,
    analyticsEnabled: true
  },
  features: {
    certificateQR: true,
    digitalSignature: false,
    bulkGeneration: false,
    apiAccess: true,
    webhookNotifications: false
  }
};

export default function ProductionSettings() {
  const [config, setConfig] = useState<ProductionConfig>(defaultConfig);
  const [originalConfig, setOriginalConfig] = useState<ProductionConfig>(defaultConfig);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadProductionConfig();
  }, []);

  const loadProductionConfig = async () => {
    try {
      setIsLoading(true);
      const loadedConfig = await environmentService.getProductionConfig();
      setConfig(loadedConfig);
      setOriginalConfig(loadedConfig);
    } catch (error) {
      console.error('خطأ في تحميل إعدادات الإنتاج:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = (section: keyof ProductionConfig, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setIsDirty(true);
    setSaveStatus('idle');
  };

  const validateConfig = (): boolean => {
    const errors: Record<string, string> = {};

    // التحقق من إعدادات قاعدة البيانات
    if (config.database.connectionPool < 1 || config.database.connectionPool > 100) {
      errors.databasePool = 'يجب أن يكون عدد الاتصالات بين 1 و 100';
    }

    if (config.database.timeout < 1000 || config.database.timeout > 120000) {
      errors.databaseTimeout = 'يجب أن يكون المهلة بين 1 ثانية و 2 دقيقة';
    }

    // التحقق من إعدادات الأمان
    if (config.security.passwordMinLength < 6 || config.security.passwordMinLength > 128) {
      errors.passwordLength = 'يجب أن يكون طول كلمة المرور بين 6 و 128 حرف';
    }

    if (config.security.jwtExpiration < 300 || config.security.jwtExpiration > 7 * 24 * 60 * 60) {
      errors.jwtExpiration = 'يجب أن تكون مدة صلاحية JWT بين 5 دقائق و 7 أيام';
    }

    // التحقق من البريد الإلكتروني
    if (config.email.enabled && !config.email.fromEmail.includes('@')) {
      errors.emailFormat = 'صيغة البريد الإلكتروني غير صحيحة';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveConfig = async () => {
    if (!validateConfig()) {
      setSaveStatus('error');
      return;
    }

    try {
      setSaveStatus('saving');
      await environmentService.updateProductionConfig(config);
      setOriginalConfig(config);
      setIsDirty(false);
      setSaveStatus('success');
      
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('خطأ في حفظ الإعدادات:', error);
      setSaveStatus('error');
    }
  };

  const resetConfig = () => {
    setConfig(originalConfig);
    setIsDirty(false);
    setSaveStatus('idle');
    setValidationErrors({});
  };

  const hasChanges = () => {
    return JSON.stringify(config) !== JSON.stringify(originalConfig);
  };

  const getValidationStatus = () => {
    if (Object.keys(validationErrors).length > 0) {
      return 'error';
    }
    if (saveStatus === 'success') {
      return 'success';
    }
    if (saveStatus === 'error') {
      return 'error';
    }
    return 'idle';
  };

  const ValidationBadge = () => {
    if (Object.keys(validationErrors).length > 0) {
      return <Badge variant="destructive">خطأ في الإعدادات</Badge>;
    }
    if (saveStatus === 'success') {
      return <Badge variant="default">محفوظ</Badge>;
    }
    return <Badge variant="secondary">جاهز</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* العنوان والحالة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            إعدادات الإنتاج
          </CardTitle>
          <CardDescription>
            إدارة إعدادات الإنتاج والأمان والأداء لمنصة شهاداتي
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <ValidationBadge />
            <div className="flex gap-2">
              {hasChanges() && (
                <>
                  <Button variant="outline" onClick={resetConfig}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    إعادة تعيين
                  </Button>
                  <Button onClick={saveConfig} disabled={saveStatus === 'saving'}>
                    <Save className="h-4 w-4 mr-2" />
                    {saveStatus === 'saving' ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* رسائل الحالة */}
          {Object.keys(validationErrors).length > 0 && (
            <Alert className="mt-4" variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {Object.values(validationErrors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {saveStatus === 'success' && (
            <Alert className="mt-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                تم حفظ الإعدادات بنجاح
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* إعدادات الإنتاج */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="database" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="database">
                <Database className="h-4 w-4 mr-2" />
                قاعدة البيانات
              </TabsTrigger>
              <TabsTrigger value="security">
                <Lock className="h-4 w-4 mr-2" />
                الأمان
              </TabsTrigger>
              <TabsTrigger value="email">
                <Mail className="h-4 w-4 mr-2" />
                البريد
              </TabsTrigger>
              <TabsTrigger value="monitoring">
                <Monitor className="h-4 w-4 mr-2" />
                المراقبة
              </TabsTrigger>
              <TabsTrigger value="features">
                <Shield className="h-4 w-4 mr-2" />
                الميزات
              </TabsTrigger>
            </TabsList>

            {/* إعدادات قاعدة البيانات */}
            <TabsContent value="database" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pool">عدد الاتصالات (Connection Pool)</Label>
                  <Input
                    id="pool"
                    type="number"
                    value={config.database.connectionPool}
                    onChange={(e) => updateConfig('database', 'connectionPool', parseInt(e.target.value))}
                    min={1}
                    max={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeout">المهلة (بالميلي ثانية)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    value={config.database.timeout}
                    onChange={(e) => updateConfig('database', 'timeout', parseInt(e.target.value))}
                    min={1000}
                    max={120000}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retry">محاولات إعادة المحاولة</Label>
                  <Input
                    id="retry"
                    type="number"
                    value={config.database.retryAttempts}
                    onChange={(e) => updateConfig('database', 'retryAttempts', parseInt(e.target.value))}
                    min={1}
                    max={10}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="ssl"
                    checked={config.database.enableSSL}
                    onCheckedChange={(checked) => updateConfig('database', 'enableSSL', checked)}
                  />
                  <Label htmlFor="ssl">تفعيل SSL/TLS</Label>
                </div>
              </div>
            </TabsContent>

            {/* إعدادات الأمان */}
            <TabsContent value="security" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jwt">مدة صلاحية JWT (بالثواني)</Label>
                  <Input
                    id="jwt"
                    type="number"
                    value={config.security.jwtExpiration}
                    onChange={(e) => updateConfig('security', 'jwtExpiration', parseInt(e.target.value))}
                    min={300}
                    max={604800}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordLen">الحد الأدنى لطول كلمة المرور</Label>
                  <Input
                    id="passwordLen"
                    type="number"
                    value={config.security.passwordMinLength}
                    onChange={(e) => updateConfig('security', 'passwordMinLength', parseInt(e.target.value))}
                    min={6}
                    max={128}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="2fa"
                    checked={config.security.enable2FA}
                    onCheckedChange={(checked) => updateConfig('security', 'enable2FA', checked)}
                  />
                  <Label htmlFor="2fa">تفعيل المصادقة ثنائية العامل</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="rateLimit"
                    checked={config.security.rateLimitEnabled}
                    onCheckedChange={(checked) => updateConfig('security', 'rateLimitEnabled', checked)}
                  />
                  <Label htmlFor="rateLimit">تفعيل حد المعدل</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cors">أصول CORS (مفصولة بفواصل)</Label>
                <Input
                  id="cors"
                  value={config.security.corsOrigins.join(', ')}
                  onChange={(e) => updateConfig('security', 'corsOrigins', e.target.value.split(',').map(s => s.trim()))}
                  placeholder="https://shahadati.app, https://www.shahadati.app"
                />
              </div>
            </TabsContent>

            {/* إعدادات البريد الإلكتروني */}
            <TabsContent value="email" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="emailEnabled"
                  checked={config.email.enabled}
                  onCheckedChange={(checked) => updateConfig('email', 'enabled', checked)}
                />
                <Label htmlFor="emailEnabled">تفعيل البريد الإلكتروني</Label>
              </div>

              {config.email.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider">موفر الخدمة</Label>
                    <Input
                      id="provider"
                      value={config.email.provider}
                      onChange={(e) => updateConfig('email', 'provider', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fromEmail">البريد المرسل منه</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={config.email.fromEmail}
                      onChange={(e) => updateConfig('email', 'fromEmail', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fromName">اسم المرسل</Label>
                    <Input
                      id="fromName"
                      value={config.email.fromName}
                      onChange={(e) => updateConfig('email', 'fromName', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {config.email.enabled && (
                <div className="space-y-3">
                  <Label>القوالب المتاحة</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="welcome"
                        checked={config.email.templates.welcome}
                        onCheckedChange={(checked) => updateConfig('email', 'templates', {
                          ...config.email.templates,
                          welcome: checked
                        })}
                      />
                      <Label htmlFor="welcome">رسالة الترحيب</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="certificate"
                        checked={config.email.templates.certificate}
                        onCheckedChange={(checked) => updateConfig('email', 'templates', {
                          ...config.email.templates,
                          certificate: checked
                        })}
                      />
                      <Label htmlFor="certificate">إشعار الشهادة</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="passwordReset"
                        checked={config.email.templates.passwordReset}
                        onCheckedChange={(checked) => updateConfig('email', 'templates', {
                          ...config.email.templates,
                          passwordReset: checked
                        })}
                      />
                      <Label htmlFor="passwordReset">إعادة تعيين كلمة المرور</Label>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* إعدادات المراقبة */}
            <TabsContent value="monitoring" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="monitoringEnabled"
                  checked={config.monitoring.enabled}
                  onCheckedChange={(checked) => updateConfig('monitoring', 'enabled', checked)}
                />
                <Label htmlFor="monitoringEnabled">تفعيل المراقبة</Label>
              </div>

              {config.monitoring.enabled && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="logLevel">مستوى السجلات</Label>
                    <Input
                      id="logLevel"
                      value={config.monitoring.logLevel}
                      onChange={(e) => updateConfig('monitoring', 'logLevel', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="performance"
                        checked={config.monitoring.performanceTracking}
                        onCheckedChange={(checked) => updateConfig('monitoring', 'performanceTracking', checked)}
                      />
                      <Label htmlFor="performance">تتبع الأداء</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="errorReporting"
                        checked={config.monitoring.errorReporting}
                        onCheckedChange={(checked) => updateConfig('monitoring', 'errorReporting', checked)}
                      />
                      <Label htmlFor="errorReporting">تقارير الأخطاء</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="analytics"
                        checked={config.monitoring.analyticsEnabled}
                        onCheckedChange={(checked) => updateConfig('monitoring', 'analyticsEnabled', checked)}
                      />
                      <Label htmlFor="analytics">تفعيل التحليلات</Label>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* إعدادات الميزات */}
            <TabsContent value="features" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="qr"
                    checked={config.features.certificateQR}
                    onCheckedChange={(checked) => updateConfig('features', 'certificateQR', checked)}
                  />
                  <Label htmlFor="qr">QR Code للشهادات</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="signature"
                    checked={config.features.digitalSignature}
                    onCheckedChange={(checked) => updateConfig('features', 'digitalSignature', checked)}
                  />
                  <Label htmlFor="signature">التوقيع الرقمي</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="bulk"
                    checked={config.features.bulkGeneration}
                    onCheckedChange={(checked) => updateConfig('features', 'bulkGeneration', checked)}
                  />
                  <Label htmlFor="bulk">التوليد الجماعي</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="api"
                    checked={config.features.apiAccess}
                    onCheckedChange={(checked) => updateConfig('features', 'apiAccess', checked)}
                  />
                  <Label htmlFor="api">الوصول للـ API</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="webhooks"
                    checked={config.features.webhookNotifications}
                    onCheckedChange={(checked) => updateConfig('features', 'webhookNotifications', checked)}
                  />
                  <Label htmlFor="webhooks">إشعارات Webhook</Label>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}