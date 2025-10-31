/**
 * إعدادات الأرشيف
 * Archive Settings Component
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  AlertTriangle,
  Info,
  Shield,
  Clock,
  HardDrive,
  Bell
} from 'lucide-react';

import { 
  ArchiveSettings as ArchiveSettingsType,
  DEFAULT_ARCHIVE_SETTINGS 
} from '@/types/archive';
import { validateArchiveSettings } from '@/lib/utils/archive';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface ArchiveSettingsProps {
  settings: ArchiveSettingsType | null;
  onSettingsChange: (settings: ArchiveSettingsType) => void;
}

export default function ArchiveSettingsComponent({ 
  settings, 
  onSettingsChange 
}: ArchiveSettingsProps) {
  // حالة الإعدادات المحلية
  const [localSettings, setLocalSettings] = useState<ArchiveSettingsType>(
    settings || DEFAULT_ARCHIVE_SETTINGS
  );
  
  // حالة التحقق
  const [isValid, setIsValid] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // حالة الحفظ
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // تحديث الإعدادات المحلية عند تغيير الإعدادات الأصلية
  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  // التحقق من صحة الإعدادات عند التغيير
  useEffect(() => {
    const validation = validateArchiveSettings(localSettings);
    setIsValid(validation.isValid);
    setValidationErrors(validation.errors);
  }, [localSettings]);

  // التحقق من وجود تغييرات غير محفوظة
  useEffect(() => {
    const hasChanges = JSON.stringify(localSettings) !== JSON.stringify(settings);
    setHasUnsavedChanges(hasChanges);
  }, [localSettings, settings]);

  /**
   * تحديث قيمة معينة في الإعدادات
   */
  const updateSetting = (key: keyof ArchiveSettingsType, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  /**
   * حفظ الإعدادات
   */
  const saveSettings = async () => {
    if (!isValid) {
      setSaveMessage('يرجى إصلاح الأخطاء قبل الحفظ');
      return;
    }

    try {
      setIsSaving(true);
      setSaveMessage('');

      const response = await fetch('/api/archive/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localSettings)
      });

      if (!response.ok) {
        throw new Error('فشل في حفظ الإعدادات');
      }

      const result = await response.json();
      onSettingsChange(localSettings);
      setSaveMessage('تم حفظ الإعدادات بنجاح');
      setHasUnsavedChanges(false);

    } catch (error) {
      console.error('خطأ في حفظ الإعدادات:', error);
      setSaveMessage('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setIsSaving(false);
      
      // إزالة رسالة النجاح بعد 3 ثوانٍ
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  /**
   * إعادة تعيين الإعدادات
   */
  const resetSettings = () => {
    setLocalSettings(DEFAULT_ARCHIVE_SETTINGS);
    setSaveMessage('تم إعادة تعيين الإعدادات');
    setHasUnsavedChanges(true);
    
    setTimeout(() => setSaveMessage(''), 3000);
  };

  /**
   * إضافة نوع ملف مسموح
   */
  const addAllowedFileType = (fileType: string) => {
    if (fileType && !localSettings.allowedFileTypes.includes(fileType)) {
      updateSetting('allowedFileTypes', [...localSettings.allowedFileTypes, fileType]);
    }
  };

  /**
   * إزالة نوع ملف مسموح
   */
  const removeAllowedFileType = (fileType: string) => {
    updateSetting(
      'allowedFileTypes',
      localSettings.allowedFileTypes.filter(type => type !== fileType)
    );
  };

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6" />
            إعدادات الأرشيف
          </h2>
          <p className="text-muted-foreground mt-1">
            تكوين إعدادات الأرشيف التلقائي واليدوي
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <Badge variant="outline" className="text-orange-600">
              تغييرات غير محفوظة
            </Badge>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={resetSettings}
            disabled={isSaving}
          >
            <RotateCcw className="w-4 h-4 ml-2" />
            إعادة تعيين
          </Button>
          
          <Button
            onClick={saveSettings}
            disabled={isSaving || !isValid || !hasUnsavedChanges}
          >
            {isSaving ? (
              <RotateCcw className="w-4 h-4 ml-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 ml-2" />
            )}
            حفظ الإعدادات
          </Button>
        </div>
      </div>

      {/* رسالة الحفظ */}
      {saveMessage && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>{saveMessage}</AlertDescription>
        </Alert>
      )}

      {/* رسائل التحقق */}
      {!isValid && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">تحقق من الأخطاء التالية:</p>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* التبويبات الرئيسية */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">عام</TabsTrigger>
          <TabsTrigger value="storage">التخزين</TabsTrigger>
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
          <TabsTrigger value="advanced">متقدم</TabsTrigger>
        </TabsList>

        {/* تبويب الإعدادات العامة */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                الأرشفة التلقائية
              </CardTitle>
              <CardDescription>
                إعدادات الأرشفة التلقائية للبيانات القديمة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-archive">تفعيل الأرشفة التلقائية</Label>
                  <p className="text-sm text-muted-foreground">
                    أرشفة البيانات تلقائياً بعد فترة محددة
                  </p>
                </div>
                <Switch
                  id="auto-archive"
                  checked={localSettings.autoArchiveEnabled}
                  onCheckedChange={(checked) => updateSetting('autoArchiveEnabled', checked)}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="archive-days">الأرشفة بعد (يوم)</Label>
                  <Input
                    id="archive-days"
                    type="number"
                    min="30"
                    max="3650"
                    value={localSettings.archiveAfterDays}
                    onChange={(e) => updateSetting('archiveAfterDays', parseInt(e.target.value))}
                    disabled={!localSettings.autoArchiveEnabled}
                  />
                  <p className="text-xs text-muted-foreground">
                    الحد الأدنى: 30 يوم، الحد الأقصى: 10 سنوات
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retention-period">فترة الاحتفاظ (يوم)</Label>
                  <Input
                    id="retention-period"
                    type="number"
                    min="365"
                    max="36500"
                    value={localSettings.retentionPeriod}
                    onChange={(e) => updateSetting('retentionPeriod', parseInt(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    كم من الوقت تحتفظ بالبيانات المؤرشفة
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>أنواع الملفات المسموحة</CardTitle>
              <CardDescription>
                تحديد أنواع الملفات التي يمكن أرشفتها
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {localSettings.allowedFileTypes.map((type) => (
                  <Badge key={type} variant="outline" className="justify-between">
                    {type.toUpperCase()}
                    <button
                      onClick={() => removeAllowedFileType(type)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="نوع ملف جديد (مثال: pdf)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addAllowedFileType(e.currentTarget.value.toLowerCase());
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="نوع ملف جديد"]') as HTMLInputElement;
                    if (input) {
                      addAllowedFileType(input.value.toLowerCase());
                      input.value = '';
                    }
                  }}
                >
                  إضافة
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                الضغط على Enter أو النقر على "إضافة" لإضافة نوع جديد
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب إعدادات التخزين */}
        <TabsContent value="storage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                إعدادات الضغط
              </CardTitle>
              <CardDescription>
                تكوين خوارزمية ومستوى الضغط لتوفير المساحة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="compression-level">مستوى الضغط</Label>
                <Select
                  value={localSettings.compressionLevel}
                  onValueChange={(value) => updateSetting('compressionLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="space-y-1">
                        <div>منخفض</div>
                        <div className="text-xs text-muted-foreground">
                          ضغط سريع، توفير مسافة أقل
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="space-y-1">
                        <div>متوسط</div>
                        <div className="text-xs text-muted-foreground">
                          توازن بين السرعة والكفاءة
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="space-y-1">
                        <div>عالي</div>
                        <div className="text-xs text-muted-foreground">
                          ضغط أقوى، استهلاك وقت أكثر
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-size">حجم الأرشيف الأقصى (ميجابايت)</Label>
                <Input
                  id="max-size"
                  type="number"
                  min="1"
                  max="10240"
                  value={Math.round(localSettings.maxArchiveSize / (1024 * 1024))}
                  onChange={(e) => updateSetting('maxArchiveSize', parseInt(e.target.value) * 1024 * 1024)}
                />
                <p className="text-xs text-muted-foreground">
                  الحد الأقصى لحجم ملف الأرشيف الواحد
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                النسخ الاحتياطي
              </CardTitle>
              <CardDescription>
                إعدادات النسخ الاحتياطي للبيانات المؤرشفة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="backup-enabled">تفعيل النسخ الاحتياطي</Label>
                  <p className="text-sm text-muted-foreground">
                    إنشاء نسخة احتياطية من البيانات المؤرشفة
                  </p>
                </div>
                <Switch
                  id="backup-enabled"
                  checked={localSettings.backupEnabled}
                  onCheckedChange={(checked) => updateSetting('backupEnabled', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب الإشعارات */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                إعدادات الإشعارات
              </CardTitle>
              <CardDescription>
                تحديد متى يتم إرسال الإشعارات حول عمليات الأرشيف
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>تفعيل الإشعارات</Label>
                  <p className="text-sm text-muted-foreground">
                    إرسال إشعارات عند اكتمال عمليات الأرشيف
                  </p>
                </div>
                <Switch
                  checked={localSettings.notificationEnabled}
                  onCheckedChange={(checked) => updateSetting('notificationEnabled', checked)}
                />
              </div>

              {localSettings.notificationEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">أنواع الإشعارات</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notify-archive" className="text-sm">
                          اكتمال الأرشفة
                        </Label>
                        <Switch id="notify-archive" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notify-restore" className="text-sm">
                          اكتمال الاستعادة
                        </Label>
                        <Switch id="notify-restore" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notify-error" className="text-sm">
                          أخطاء الأرشفة
                        </Label>
                        <Switch id="notify-error" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">التقارير الدورية</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="weekly-report" className="text-sm">
                          تقرير أسبوعي
                        </Label>
                        <Switch id="weekly-report" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="monthly-report" className="text-sm">
                          تقرير شهري
                        </Label>
                        <Switch id="monthly-report" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب الإعدادات المتقدمة */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الأداء</CardTitle>
              <CardDescription>
                إعدادات متقدمة لتحسين أداء نظام الأرشيف
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  هذه الإعدادات متقدمة وقد تؤثر على أداء النظام. يُنصح بتغييرها فقط إذا كنت تعرف ما تفعل.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>حجم الدفعة (عدد السجلات)</Label>
                  <Input
                    type="number"
                    defaultValue="1000"
                    min="100"
                    max="10000"
                  />
                  <p className="text-xs text-muted-foreground">
                    عدد السجلات التي تتم معالجتها في كل دفعة
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>عدد العمليات المتزامنة</Label>
                  <Input
                    type="number"
                    defaultValue="3"
                    min="1"
                    max="10"
                  />
                  <p className="text-xs text-muted-foreground">
                    الحد الأقصى لعدد عمليات الأرشفة المتزامنة
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>مهلة الانتظار (دقيقة)</Label>
                  <Input
                    type="number"
                    defaultValue="30"
                    min="5"
                    max="120"
                  />
                  <p className="text-xs text-muted-foreground">
                    المهلة الزمنية لانتظار العمليات الطويلة
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>فترة تحديث التقدم (ثانية)</Label>
                  <Input
                    type="number"
                    defaultValue="5"
                    min="1"
                    max="60"
                  />
                  <p className="text-xs text-muted-foreground">
                    تكرار تحديث شريط التقدم
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">منطقة الخطر</CardTitle>
              <CardDescription>
                إجراءات خطرة قد تؤدي لفقدان البيانات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  هذه الإجراءات غير قابلة للتراجع. تأكد من عمل نسخة احتياطية قبل المتابعة.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Button variant="destructive" size="sm">
                  حذف جميع الأرشيفات القديمة
                </Button>
                <p className="text-xs text-muted-foreground">
                  حذف جميع البيانات المؤرشفة الأقدم من فترة الاحتفاظ
                </p>
              </div>

              <div className="space-y-3">
                <Button variant="destructive" size="sm">
                  إعادة تعيين جميع الإعدادات
                </Button>
                <p className="text-xs text-muted-foreground">
                  إعادة تعيين جميع إعدادات الأرشيف للقيم الافتراضية
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}