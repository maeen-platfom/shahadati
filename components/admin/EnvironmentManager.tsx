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
import { Separator } from '@/components/ui/separator';
import { 
  Globe, 
  Key, 
  Lock, 
  Eye, 
  EyeOff, 
  Copy, 
  Trash2,
  Plus,
  Edit,
  CheckCircle,
  AlertTriangle,
  Settings,
  Server,
  Database,
  Mail
} from 'lucide-react';
import { environmentService } from '@/lib/utils/environment';

interface EnvironmentVariable {
  id: string;
  name: string;
  value: string;
  description: string;
  category: 'database' | 'api' | 'email' | 'security' | 'monitoring' | 'general';
  isSecret: boolean;
  environment: 'development' | 'staging' | 'production' | 'all';
  lastUpdated: string;
  updatedBy: string;
}

const defaultVariables: EnvironmentVariable[] = [
  {
    id: '1',
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    value: '',
    description: 'رابط مشروع Supabase',
    category: 'database',
    isSecret: false,
    environment: 'all',
    lastUpdated: '',
    updatedBy: 'system'
  },
  {
    id: '2',
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    value: '',
    description: 'مفتاح Supabase العام',
    category: 'database',
    isSecret: false,
    environment: 'all',
    lastUpdated: '',
    updatedBy: 'system'
  },
  {
    id: '3',
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    value: '',
    description: 'مفتاح Supabase للخدمة',
    category: 'database',
    isSecret: true,
    environment: 'production',
    lastUpdated: '',
    updatedBy: 'system'
  },
  {
    id: '4',
    name: 'NEXTAUTH_SECRET',
    value: '',
    description: 'سر مصادقة NextAuth',
    category: 'security',
    isSecret: true,
    environment: 'production',
    lastUpdated: '',
    updatedBy: 'system'
  },
  {
    id: '5',
    name: 'SENDGRID_API_KEY',
    value: '',
    description: 'مفتاح SendGrid API',
    category: 'email',
    isSecret: true,
    environment: 'production',
    lastUpdated: '',
    updatedBy: 'system'
  },
  {
    id: '6',
    name: 'DATABASE_URL',
    value: '',
    description: 'رابط قاعدة البيانات',
    category: 'database',
    isSecret: true,
    environment: 'production',
    lastUpdated: '',
    updatedBy: 'system'
  },
  {
    id: '7',
    name: 'NODE_ENV',
    value: 'production',
    description: 'بيئة التطبيق',
    category: 'general',
    isSecret: false,
    environment: 'all',
    lastUpdated: '',
    updatedBy: 'system'
  },
  {
    id: '8',
    name: 'PORT',
    value: '3000',
    description: 'رقم منفذ الخادم',
    category: 'general',
    isSecret: false,
    environment: 'all',
    lastUpdated: '',
    updatedBy: 'system'
  }
];

export default function EnvironmentManager() {
  const [variables, setVariables] = useState<EnvironmentVariable[]>(defaultVariables);
  const [filteredVariables, setFilteredVariables] = useState<EnvironmentVariable[]>(defaultVariables);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSecrets, setShowSecrets] = useState(false);
  const [editingVariable, setEditingVariable] = useState<EnvironmentVariable | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadVariables();
  }, []);

  useEffect(() => {
    filterVariables();
  }, [variables, selectedCategory, selectedEnvironment, searchTerm, showSecrets]);

  const loadVariables = async () => {
    try {
      const loadedVariables = await environmentService.getEnvironmentVariables();
      if (loadedVariables.length > 0) {
        setVariables(loadedVariables);
      }
    } catch (error) {
      console.error('خطأ في تحميل متغيرات البيئة:', error);
    }
  };

  const filterVariables = () => {
    let filtered = variables;

    // فلترة حسب الفئة
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(v => v.category === selectedCategory);
    }

    // فلترة حسب البيئة
    if (selectedEnvironment !== 'all') {
      filtered = filtered.filter(v => v.environment === selectedEnvironment || v.environment === 'all');
    }

    // فلترة حسب البحث
    if (searchTerm) {
      filtered = filtered.filter(v => 
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // إخفاء الأسرار إذا لم تكن مفعلة
    if (!showSecrets) {
      filtered = filtered.filter(v => !v.isSecret);
    }

    setFilteredVariables(filtered);
  };

  const handleEdit = (variable: EnvironmentVariable) => {
    setEditingVariable({ ...variable });
    setValidationErrors({});
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingVariable({
      id: '',
      name: '',
      value: '',
      description: '',
      category: 'general',
      isSecret: false,
      environment: 'production',
      lastUpdated: '',
      updatedBy: 'admin'
    });
    setValidationErrors({});
  };

  const handleSave = async () => {
    if (!editingVariable) return;

    const errors = validateVariable(editingVariable);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const updatedVariable = {
        ...editingVariable,
        id: editingVariable.id || Date.now().toString(),
        lastUpdated: new Date().toISOString(),
        updatedBy: 'admin'
      };

      if (isAdding) {
        await environmentService.addEnvironmentVariable(updatedVariable);
        setVariables(prev => [...prev, updatedVariable]);
      } else {
        await environmentService.updateEnvironmentVariable(updatedVariable);
        setVariables(prev => prev.map(v => v.id === updatedVariable.id ? updatedVariable : v));
      }

      setEditingVariable(null);
      setIsAdding(false);
    } catch (error) {
      console.error('خطأ في حفظ متغير البيئة:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المتغير؟')) return;

    try {
      await environmentService.deleteEnvironmentVariable(id);
      setVariables(prev => prev.filter(v => v.id !== id));
    } catch (error) {
      console.error('خطأ في حذف متغير البيئة:', error);
    }
  };

  const validateVariable = (variable: EnvironmentVariable): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!variable.name.trim()) {
      errors.name = 'اسم المتغير مطلوب';
    } else if (!/^[A-Z_][A-Z0-9_]*$/.test(variable.name)) {
      errors.name = 'اسم المتغير يجب أن يكون بأحرف كبيرة مع شرطات سفلية فقط';
    }

    if (!variable.description.trim()) {
      errors.description = 'وصف المتغير مطلوب';
    }

    if (!variable.value.trim() && !variable.isSecret) {
      errors.value = 'قيمة المتغير مطلوبة';
    }

    return errors;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // يمكن إضافة إشعار هنا
    } catch (error) {
      console.error('خطأ في نسخ النص:', error);
    }
  };

  const maskValue = (value: string, isSecret: boolean) => {
    if (!isSecret || showSecrets) return value;
    return '•'.repeat(8);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'database': return <Database className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'security': return <Lock className="h-4 w-4" />;
      case 'monitoring': return <Settings className="h-4 w-4" />;
      default: return <Server className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'database': return 'bg-blue-100 text-blue-800';
      case 'email': return 'bg-green-100 text-green-800';
      case 'security': return 'bg-red-100 text-red-800';
      case 'monitoring': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEnvironmentColor = (environment: string) => {
    switch (environment) {
      case 'production': return 'bg-red-100 text-red-800';
      case 'staging': return 'bg-yellow-100 text-yellow-800';
      case 'development': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* العنوان والتحكم */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            مدير متغيرات البيئة
          </CardTitle>
          <CardDescription>
            إدارة وإدارة متغيرات البيئة للإعدادات المختلفة
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* أدوات الفلترة والبحث */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="البحث في المتغيرات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">جميع الفئات</option>
              <option value="database">قاعدة البيانات</option>
              <option value="api">API</option>
              <option value="email">البريد الإلكتروني</option>
              <option value="security">الأمان</option>
              <option value="monitoring">المراقبة</option>
              <option value="general">عام</option>
            </select>
            <select
              value={selectedEnvironment}
              onChange={(e) => setSelectedEnvironment(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">جميع البيئات</option>
              <option value="production">الإنتاج</option>
              <option value="staging">التجربة</option>
              <option value="development">التطوير</option>
            </select>
          </div>

          {/* التحكم في إظهار الأسرار */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="showSecrets"
                checked={showSecrets}
                onCheckedChange={setShowSecrets}
              />
              <Label htmlFor="showSecrets">إظهار المتغيرات السرية</Label>
            </div>
            <Button onClick={handleAdd} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              إضافة متغير
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* قائمة المتغيرات */}
      <Card>
        <CardHeader>
          <CardTitle>متغيرات البيئة ({filteredVariables.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredVariables.map((variable) => (
              <div key={variable.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {/* اسم المتغير */}
                  <div>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(variable.category)}
                      <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {variable.name}
                      </code>
                      {variable.isSecret && (
                        <Lock className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {variable.description}
                    </p>
                  </div>

                  {/* قيمة المتغير */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono bg-gray-50 px-2 py-1 rounded flex-1">
                        {maskValue(variable.value, variable.isSecret)}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(variable.value)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(variable)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* معلومات إضافية */}
                  <div className="flex flex-col gap-1">
                    <Badge className={getCategoryColor(variable.category)} variant="secondary">
                      {variable.category}
                    </Badge>
                    <Badge className={getEnvironmentColor(variable.environment)} variant="outline">
                      {variable.environment}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {new Date(variable.lastUpdated).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {filteredVariables.length === 0 && (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">لا توجد متغيرات تطابق المعايير المحددة</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* نافذة التحرير */}
      {editingVariable && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isAdding ? 'إضافة متغير جديد' : 'تحرير متغير'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="varName">اسم المتغير</Label>
                <Input
                  id="varName"
                  value={editingVariable.name}
                  onChange={(e) => setEditingVariable(prev => prev ? {...prev, name: e.target.value} : null)}
                  placeholder="NEXT_PUBLIC_EXAMPLE"
                  className={validationErrors.name ? 'border-red-500' : ''}
                />
                {validationErrors.name && (
                  <p className="text-sm text-red-500">{validationErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="varValue">القيمة</Label>
                <Input
                  id="varValue"
                  type={editingVariable.isSecret && !showSecrets ? 'password' : 'text'}
                  value={editingVariable.value}
                  onChange={(e) => setEditingVariable(prev => prev ? {...prev, value: e.target.value} : null)}
                  placeholder="القيمة..."
                  className={validationErrors.value ? 'border-red-500' : ''}
                />
                {validationErrors.value && (
                  <p className="text-sm text-red-500">{validationErrors.value}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="varDescription">الوصف</Label>
                <Input
                  id="varDescription"
                  value={editingVariable.description}
                  onChange={(e) => setEditingVariable(prev => prev ? {...prev, description: e.target.value} : null)}
                  placeholder="وصف المتغير..."
                  className={validationErrors.description ? 'border-red-500' : ''}
                />
                {validationErrors.description && (
                  <p className="text-sm text-red-500">{validationErrors.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="varCategory">الفئة</Label>
                <select
                  id="varCategory"
                  value={editingVariable.category}
                  onChange={(e) => setEditingVariable(prev => prev ? {...prev, category: e.target.value as any} : null)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="database">قاعدة البيانات</option>
                  <option value="api">API</option>
                  <option value="email">البريد الإلكتروني</option>
                  <option value="security">الأمان</option>
                  <option value="monitoring">المراقبة</option>
                  <option value="general">عام</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="varEnvironment">البيئة</Label>
                <select
                  id="varEnvironment"
                  value={editingVariable.environment}
                  onChange={(e) => setEditingVariable(prev => prev ? {...prev, environment: e.target.value as any} : null)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="all">الكل</option>
                  <option value="production">الإنتاج</option>
                  <option value="staging">التجربة</option>
                  <option value="development">التطوير</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="varIsSecret"
                  checked={editingVariable.isSecret}
                  onCheckedChange={(checked) => setEditingVariable(prev => prev ? {...prev, isSecret: checked} : null)}
                />
                <Label htmlFor="varIsSecret">متغير سري</Label>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave}>
                <CheckCircle className="h-4 w-4 mr-2" />
                حفظ
              </Button>
              <Button variant="outline" onClick={() => {
                setEditingVariable(null);
                setIsAdding(false);
                setValidationErrors({});
              }}>
                إلغاء
              </Button>
              {!isAdding && (
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    if (editingVariable?.id) {
                      handleDelete(editingVariable.id);
                      setEditingVariable(null);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  حذف
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}