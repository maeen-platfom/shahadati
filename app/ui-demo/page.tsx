'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  // Lucide Icons
  Monitor, 
  Smartphone, 
  Tablet,
  Code, 
  Palette, 
  Layout, 
  Settings, 
  Eye, 
  Sparkles,
  ArrowRight,
  Copy,
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  Award,
  Users,
  FileText,
  BarChart3,
  Zap,
  Shield,
  QrCode,
  Lock,
  Key,
  Mail,
  Search,
  Filter,
  Bell,
  Menu,
  Home,
  User,
  LogOut,
  Moon,
  Sun,
  Download,
  Upload,
  Calendar,
  Clock,
  TrendingUp,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  RefreshCw,
  ExternalLink,
  GitBranch,
  Database,
  Server,
  Globe,
  Cpu,
  HardDrive,
  Network
} from 'lucide-react';

// Import UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

// Import Feature Components
import ResponsiveHeader from '@/components/ui/ResponsiveHeader';
import ThemeToggle from '@/components/ui/ThemeToggle';
import NotificationSystem from '@/components/ui/NotificationSystem';
import { useNotifications } from '@/lib/hooks/useNotifications';

// Demo Data
const demoUser = {
  name: 'أحمد محمد علي',
  email: 'ahmed@example.com',
  role: 'instructor' as const,
  avatar: undefined
};

const chartData = [
  { name: 'يناير', certificates: 400, verifications: 340 },
  { name: 'فبراير', certificates: 300, verifications: 280 },
  { name: 'مارس', certificates: 200, verifications: 180 },
  { name: 'أبريل', certificates: 278, verifications: 240 },
  { name: 'مايو', certificates: 189, verifications: 160 },
  { name: 'يونيو', certificates: 239, verifications: 200 },
];

export default function UIDemoPage() {
  const { showSuccess, showError, showWarning, showInfo } = useNotifications();
  const [activeSection, setActiveSection] = useState('basic-ui');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    showSuccess('تم النسخ', `تم نسخ ${label} بنجاح`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleNotificationDemo = (type: 'success' | 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'success':
        showSuccess('تم بنجاح!', 'تمت العملية بنجاح تام');
        break;
      case 'error':
        showError('حدث خطأ!', 'يرجى المحاولة مرة أخرى');
        break;
      case 'warning':
        showWarning('تحذير!', 'تحقق من البيانات المدخلة');
        break;
      case 'info':
        showInfo('معلومة', 'هذه معلومة مفيدة للمستخدم');
        break;
    }
  };

  const CodeExample = ({ code, language = 'tsx', label }: { code: string; language?: string; label?: string }) => (
    <div className="relative">
      <div className="flex items-center justify-between bg-muted px-4 py-2 rounded-t-lg border-b">
        <span className="text-sm font-medium">{label || 'مثال على الكود'}</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => copyToClipboard(code, 'الكود')}
          className="h-8 px-2"
        >
          {copiedCode === code ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        </Button>
      </div>
      <pre className="bg-black text-green-400 p-4 rounded-b-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-green-600">{change}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <NotificationSystem />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3 space-x-reverse mb-6">
              <Sparkles className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                معاينة شاملة للمكونات
              </h1>
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              استكشف جميع المكونات المطورة في Sprint 5 - من المكونات الأساسية إلى الميزات المتقدمة
            </p>
            
            <div className="flex items-center justify-center space-x-4 space-x-reverse mb-8">
              <Badge variant="outline" className="px-4 py-2 text-sm">
                <Star className="w-3 h-3 mr-1" />
                Sprint 5
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm">
                <GitBranch className="w-3 h-3 mr-1" />
                Next.js + TypeScript
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm">
                <Palette className="w-3 h-3 mr-1" />
                Tailwind CSS
              </Badge>
            </div>

            <div className="flex items-center justify-center space-x-3 space-x-reverse">
              <ThemeToggle variant="dropdown" showLabel={true} />
            </div>
          </div>
        </div>
      </section>

      {/* Main Demo Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Basic UI Components Section */}
          <section id="basic-ui" className="mb-16">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-3 space-x-reverse mb-4">
                <Monitor className="w-6 h-6 text-blue-600" />
                <h2 className="text-3xl font-bold">المكونات الأساسية</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                المكونات الأساسية لبناء الواجهات - الأزرار، البطاقات، المدخلات، والمزيد
              </p>
            </div>

            {/* Buttons Demo */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Button className="w-4 h-4" variant="ghost" size="sm">
                    🎯
                  </Button>
                  <span>الأزرار - Buttons</span>
                </CardTitle>
                <CardDescription>
                  مختلف أنواع الأزرار مع أحجام وألوان متنوعة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Button Variants */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">الأنواع المختلفة</Label>
                  <div className="flex flex-wrap gap-3">
                    <Button>Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                  </div>
                </div>

                {/* Button Sizes */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">الأحجام المختلفة</Label>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon"><Settings className="w-4 h-4" /></Button>
                  </div>
                </div>

                {/* Interactive Buttons */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">أزرار تفاعلية</Label>
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={() => handleNotificationDemo('success')}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      نجاح
                    </Button>
                    <Button variant="destructive" onClick={() => handleNotificationDemo('error')}>
                      <XCircle className="w-4 h-4 mr-2" />
                      خطأ
                    </Button>
                    <Button variant="outline" onClick={() => handleNotificationDemo('warning')}>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      تحذير
                    </Button>
                  </div>
                </div>

                <CodeExample 
                  code={`import { Button } from '@/components/ui/button';

// استخدام أساسي
<Button>انقر هنا</Button>

// أنواع مختلفة
<Button variant="secondary">ثانوي</Button>
<Button variant="destructive">حذف</Button>
<Button variant="outline">مخطط</Button>

// أحجام مختلفة
<Button size="sm">صغير</Button>
<Button size="default">عادي</Button>
<Button size="lg">كبير</Button>`}
                  label="استخدام الأزرار"
                />
              </CardContent>
            </Card>

            {/* Cards Demo */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Card className="w-4 h-4" />
                  <span>البطاقات - Cards</span>
                </CardTitle>
                <CardDescription>
                  بطاقات مرنة لعرض المحتوى مع头部 وfooter
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Basic Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>بطاقة بسيطة</CardTitle>
                      <CardDescription>وصف البطاقة</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        محتوى البطاقة هنا. يمكنك وضع أي محتوى تريده.
                      </p>
                    </CardContent>
                    <CardContent className="pt-0">
                      <Button size="sm">إجراء</Button>
                    </CardContent>
                  </Card>

                  {/* Statistics Card */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">المستخدمين النشطين</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">2,350</div>
                      <p className="text-xs text-muted-foreground">
                        +18% من الشهر الماضي
                      </p>
                    </CardContent>
                  </Card>

                  {/* Progress Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>التقدم</CardTitle>
                      <CardDescription>نسبة الإنجاز</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>المهام المكتملة</span>
                          <span>75%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      <Button size="sm" className="w-full">عرض التفاصيل</Button>
                    </CardContent>
                  </Card>
                </div>

                <CodeExample 
                  code={`import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// بطاقة أساسية
<Card>
  <CardHeader>
    <CardTitle>عنوان البطاقة</CardTitle>
    <CardDescription>وصف البطاقة</CardDescription>
  </CardHeader>
  <CardContent>
    <p>محتوى البطاقة</p>
  </CardContent>
</Card>`}
                  label="استخدام البطاقات"
                />
              </CardContent>
            </Card>

            {/* Form Components */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Layout className="w-4 h-4" />
                  <span>مكونات النماذج</span>
                </CardTitle>
                <CardDescription>
                  المدخلات، التسميات، والمكونات التفاعلية
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Input Examples */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">الاسم الكامل</Label>
                      <Input id="name" placeholder="أدخل اسمك الكامل" />
                    </div>
                    <div>
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input id="email" type="email" placeholder="user@example.com" />
                    </div>
                    <div>
                      <Label htmlFor="password">كلمة المرور</Label>
                      <Input id="password" type="password" placeholder="أدخل كلمة المرور" />
                    </div>
                    <div>
                      <Label htmlFor="search">بحث</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input id="search" placeholder="ابحث..." className="pl-10" />
                      </div>
                    </div>
                  </div>

                  {/* Select and Other Inputs */}
                  <div className="space-y-4">
                    <div>
                      <Label>حالة التشغيل</Label>
                      <div className="mt-2 space-y-2">
                        <Button size="sm" variant="outline">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          نشط
                        </Button>
                        <Button size="sm" variant="outline">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                          قيد المعالجة
                        </Button>
                        <Button size="sm" variant="outline">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                          غير نشط
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label>العلامات</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary">JavaScript</Badge>
                        <Badge variant="secondary">TypeScript</Badge>
                        <Badge variant="secondary">React</Badge>
                        <Badge variant="outline">Next.js</Badge>
                        <Badge variant="outline">Node.js</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <CodeExample 
                  code={`import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

// حقل إدخال
<div>
  <Label htmlFor="name">الاسم</Label>
  <Input id="name" placeholder="أدخل اسمك" />
</div>

// علامة
<Badge variant="secondary">Tag</Badge>`}
                  label="مكونات النماذج"
                />
              </CardContent>
            </Card>

          </section>

          {/* Advanced UI Features */}
          <section id="features" className="mb-16">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-3 space-x-reverse mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
                <h2 className="text-3xl font-bold">الميزات المتقدمة</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                المكونات المتطورة والمتفاعلة التي تعزز تجربة المستخدم
              </p>
            </div>

            {/* Theme Toggle and Notifications */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Theme Toggle */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <Sun className="w-4 h-4" />
                    <span>تبديل المظهر</span>
                  </CardTitle>
                  <CardDescription>
                    تبديل سلس بين الوضع الفاتح والداكن
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">مختلف أشكال التبديل</Label>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">زر عادي</Label>
                        <div className="mt-1">
                          <ThemeToggle variant="button" showLabel={true} />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">قائمة منسدلة</Label>
                        <div className="mt-1">
                          <ThemeToggle variant="dropdown" showLabel={true} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <CodeExample 
                    code={`import ThemeToggle from '@/components/ui/ThemeToggle';

// زر عادي
<ThemeToggle variant="button" showLabel={true} />

// قائمة منسدلة
<ThemeToggle variant="dropdown" showLabel={true} />`}
                  />
                </CardContent>
              </Card>

              {/* Notification System */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <Bell className="w-4 h-4" />
                    <span>نظام الإشعارات</span>
                  </CardTitle>
                  <CardDescription>
                    إشعارات تفاعلية مع 4 أنواع مختلفة
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      size="sm" 
                      onClick={() => handleNotificationDemo('success')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      نجاح
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleNotificationDemo('error')}
                    >
                      <XCircle className="w-3 h-3 mr-1" />
                      خطأ
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleNotificationDemo('warning')}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      تحذير
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleNotificationDemo('info')}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Info className="w-3 h-3 mr-1" />
                      معلومة
                    </Button>
                  </div>
                  
                  <CodeExample 
                    code={`import { useNotifications } from '@/lib/hooks/useNotifications';

const { showSuccess, showError } = useNotifications();

// إظهار إشعارات
showSuccess('نجح!', 'تمت العملية بنجاح');
showError('خطأ!', 'حدث خطأ في العملية');`}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Responsive Header */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Monitor className="w-4 h-4" />
                  <span>الرأس المتجاوب</span>
                </CardTitle>
                <CardDescription>
                  رأس صفحة متجاوب يدعم جميع أحجام الشاشات
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-lg overflow-hidden">
                  <ResponsiveHeader 
                    user={demoUser}
                    onLogout={() => handleNotificationDemo('info')}
                    notificationsCount={3}
                  />
                </div>
                
                <CodeExample 
                  code={`import ResponsiveHeader from '@/components/ui/ResponsiveHeader';

const user = {
  name: 'أحمد محمد',
  email: 'user@example.com',
  role: 'instructor'
};

<ResponsiveHeader 
  user={user}
  notificationsCount={5}
  onLogout={() => console.log('تسجيل الخروج')}
/>`}
                />
              </CardContent>
            </Card>

            {/* Advanced Components */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Layout className="w-4 h-4" />
                  <span>مكونات متقدمة</span>
                </CardTitle>
                <CardDescription>
                  تبويبات، مقسمات، وتنبيهات تفاعلية
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tabs Demo */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">تبويبات تفاعلية</Label>
                  <Tabs defaultValue="tab1" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="tab1">الملف الأول</TabsTrigger>
                      <TabsTrigger value="tab2">الملف الثاني</TabsTrigger>
                      <TabsTrigger value="tab3">الملف الثالث</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1" className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">المحتوى الأول</h4>
                      <p className="text-sm text-muted-foreground">
                        هذا هو محتوى الملف الأول. يمكن وضع أي محتوى هنا.
                      </p>
                    </TabsContent>
                    <TabsContent value="tab2" className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">المحتوى الثاني</h4>
                      <p className="text-sm text-muted-foreground">
                        هذا هو محتوى الملف الثاني مع معلومات مختلفة.
                      </p>
                    </TabsContent>
                    <TabsContent value="tab3" className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">المحتوى الثالث</h4>
                      <p className="text-sm text-muted-foreground">
                        هذا هو محتوى الملف الثالث مع بيانات إضافية.
                      </p>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Alert Types */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">أنواع التنبيهات</Label>
                  <div className="space-y-3">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        هذه معلومة مفيدة للمستخدم حول النظام.
                      </AlertDescription>
                    </Alert>
                    
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        حدث خطأ خطير يتطلب انتباهك الفوري.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                <CodeExample 
                  code={`import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert } from '@/components/ui/alert';

// تبويبات
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">الملف الأول</TabsTrigger>
    <TabsTrigger value="tab2">الملف الثاني</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">محتوى الملف الأول</TabsContent>
  <TabsContent value="tab2">محتوى الملف الثاني</TabsContent>
</Tabs>

// تنبيه
<Alert>
  <AlertCircle className="h-4 w-4" />
  <AlertDescription>رسالة تنبيه</AlertDescription>
</Alert>`}
                />
              </CardContent>
            </Card>
          </section>

          {/* Feature Components Section */}
          <section id="features" className="mb-16">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-3 space-x-reverse mb-4">
                <Award className="w-6 h-6 text-green-600" />
                <h2 className="text-3xl font-bold">مكونات الميزات</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                المكونات المتخصصة المطورصة لمتطلبات منصة الشهادات
              </p>
            </div>

            {/* Admin Dashboard Preview */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <BarChart3 className="w-4 h-4" />
                  <span>لوحة تحكم المشرفين</span>
                  <Badge variant="secondary">Sprint 5</Badge>
                </CardTitle>
                <CardDescription>
                  لوحة تحكم شاملة مع رسوم بيانية وإحصائيات متقدمة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    title="إجمالي الشهادات"
                    value="15,420"
                    icon={FileText}
                    color="text-blue-500"
                    change="+12% عن الأسبوع الماضي"
                  />
                  <StatCard
                    title="المستخدمين النشطين"
                    value="2,350"
                    icon={Users}
                    color="text-green-500"
                    change="+18% عن الشهر الماضي"
                  />
                  <StatCard
                    title="التحققات اليومية"
                    value="156"
                    icon={CheckCircle2}
                    color="text-purple-500"
                    change="+8% عن أمس"
                  />
                  <StatCard
                    title="نظام الحالة"
                    value="نشط"
                    icon={Activity}
                    color="text-green-500"
                  />
                </div>

                {/* Mock Chart */}
                <div className="h-64 bg-muted/30 rounded-lg p-4 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      رسم بياني للإحصائيات الزمنية
                    </p>
                    <p className="text-xs text-muted-foreground">
                      (يحتاج مكتبة Recharts للعرض الفعلي)
                    </p>
                  </div>
                </div>

                <CodeExample 
                  code={`// AdminDashboard.tsx - جزء من المشروع
import { BarChart, Bar, XAxis, YAxis } from 'recharts';

const stats = {
  totalCertificates: 15420,
  totalUsers: 2350,
  todayCertificates: 156,
  activeUsers: 215
};

<StatCard
  title="إجمالي الشهادات"
  value={stats.totalCertificates}
  icon={FileText}
  trend
/>`}
                  label="لوحة تحكم المشرفين"
                />
              </CardContent>
            </Card>

            {/* Certificate Components */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Access Code Generator */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <Key className="w-4 h-4" />
                    <span>مولد أكواد الوصول</span>
                    <Badge variant="secondary">Instructors</Badge>
                  </CardTitle>
                  <CardDescription>
                    إنشاء أكواد سرية آمنة للطلاب
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">كود مولد</Label>
                        <div className="flex items-center space-x-2 space-x-reverse mt-1">
                          <code className="text-sm bg-background px-2 py-1 rounded border">
                            CERT-2024-A7B9C2
                          </code>
                          <Button size="sm" variant="outline">
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs">حالة: نشط</span>
                      </div>
                    </div>
                  </div>
                  
                  <CodeExample 
                    code={`// AccessCodeGenerator.tsx
interface AccessCodeGeneratorProps {
  templateId: string;
  courseName: string;
  onCodeGenerated?: (code: AccessCode) => void;
}

const [loading, setLoading] = useState(false);
const [generatedCode, setGeneratedCode] = useState<AccessCode | null>(null);`}
                    label="مولد أكواد الوصول"
                  />
                </CardContent>
              </Card>

              {/* Enhanced Certificate Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <Shield className="w-4 h-4" />
                    <span>نموذج الشهادة المعزز</span>
                    <Badge variant="secondary">Sprint 4</Badge>
                  </CardTitle>
                  <CardDescription>
                    نموذج محسن مع ميزات الأمان المتقدمة
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <QrCode className="w-3 h-3 text-blue-500" />
                          <span>رمز QR</span>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Lock className="w-3 h-3 text-purple-500" />
                          <span>توقيع رقمي</span>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Shield className="w-3 h-3 text-orange-500" />
                          <span>أمان معزز</span>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span>Sprint 4</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CodeExample 
                    code={`// EnhancedCertificateForm.tsx
interface EnhancedCertificateFormProps {
  link: string;
}

const [enableQR, setEnableQR] = useState(true);
const [enableDigitalSignature, setEnableDigitalSignature] = useState(false);
const [enableEnhancedSecurity, setEnableEnhancedSecurity] = useState(true);`}
                    label="نموذج الشهادة المعزز"
                  />
                </CardContent>
              </Card>
            </div>

          </section>

          {/* Performance & System Info */}
          <section id="system" className="mb-16">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-3 space-x-reverse mb-4">
                <Server className="w-6 h-6 text-gray-600" />
                <h2 className="text-3xl font-bold">معلومات النظام</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                معلومات تقنية حول المشروع والتقنيات المستخدمة
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tech Stack */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <Code className="w-4 h-4" />
                    <span>المكتبات المستخدمة</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: 'Next.js 14', desc: 'React Framework' },
                    { name: 'TypeScript', desc: 'Type Safety' },
                    { name: 'Tailwind CSS', desc: 'Styling' },
                    { name: 'Radix UI', desc: 'Components' },
                    { name: 'Recharts', desc: 'Charts' },
                    { name: 'Lucide Icons', desc: 'Icons' }
                  ].map((tech, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="font-medium">{tech.name}</span>
                      <span className="text-muted-foreground text-xs">{tech.desc}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Component Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <Database className="w-4 h-4" />
                    <span>إحصائيات المكونات</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: 'مكونات أساسية', count: '12', color: 'bg-blue-500' },
                    { label: 'مكونات متقدمة', count: '8', color: 'bg-purple-500' },
                    { label: 'مكونات المشرفين', count: '8', color: 'bg-green-500' },
                    { label: 'مكونات المحاضرين', count: '5', color: 'bg-orange-500' },
                    { label: 'مكونات الطلاب', count: '3', color: 'bg-pink-500' },
                    { label: 'مكونات مشتركة', count: '4', color: 'bg-gray-500' }
                  ].map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                        <span className="text-sm">{stat.label}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {stat.count}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Sprint Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <GitBranch className="w-4 h-4" />
                    <span>معلومات Sprint 5</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium">تقدم المشروع</span>
                        <span className="text-muted-foreground">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>المكونات المكتملة</span>
                        <Badge variant="secondary">38/45</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>الصفحات المطورة</span>
                        <Badge variant="secondary">12/15</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>الميزات المتقدمة</span>
                        <Badge variant="secondary">8/10</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-xs text-muted-foreground">
                      آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="py-12">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center justify-center space-x-3 space-x-reverse mb-6">
                    <Sparkles className="w-8 h-8 text-blue-600" />
                    <h2 className="text-3xl font-bold">هل أعجبتك المكونات؟</h2>
                    <Sparkles className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-lg text-muted-foreground mb-8">
                    استكشف المزيد من الميزات في منصة شهاداتي أو ابدأ في إنشاء شهاداتك الخاصة
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/signup">
                      <Button size="lg" className="w-full sm:w-auto">
                        <Star className="w-4 h-4 mr-2" />
                        ابدأ الآن مجاناً
                      </Button>
                    </Link>
                    <Link href="/(auth)/login">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto">
                        <LogOut className="w-4 h-4 mr-2" />
                        تسجيل الدخول
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

        </div>
      </div>
    </div>
  );
}