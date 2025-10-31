# 📱 دليل معاينة المكونات - منصة شهاداتي

## 🌟 نظرة عامة

هذا الدليل يشرح جميع المكونات المطورة في **Sprint 5** لمنصة شهاداتي. يحتوي على معاينة شاملة لجميع المكونات من الأساسية إلى المتقدمة.

## 🚀 الوصول للمعاينة

```bash
# انتقل إلى صفحة المعاينة
http://localhost:3000/ui-demo
```

## 📋 المحتويات

### 1. 🎯 [المكونات الأساسية](#basic-ui-components)
- الأزرار (Buttons)
- البطاقات (Cards)
- المدخلات (Inputs)
- التسميات (Labels)
- العلامات (Badges)

### 2. ⚡ [الميزات المتقدمة](#advanced-features)
- نظام الإشعارات
- تبديل المظهر
- الرأس المتجاوب
- التبويبات التفاعلية

### 3. 🏢 [مكونات الميزات](#feature-components)
- لوحة تحكم المشرفين
- مولد أكواد الوصول
- نموذج الشهادة المعزز

### 4. 📊 [معلومات النظام](#system-information)
- إحصائيات المكونات
- المعلومات التقنية
- تقدم المشروع

---

## 🎯 المكونات الأساسية

### الأزرار (Buttons)

```typescript
import { Button } from '@/components/ui/button';

// الأنواع المختلفة
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// الأحجام المختلفة
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

**المميزات:**
- ✅ 6 أنواع مختلفة
- ✅ 4 أحجام متنوعة
- ✅ دعم الـ icons
- ✅ تفاعل مع الـ state
- ✅ loading states

### البطاقات (Cards)

```typescript
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>عنوان البطاقة</CardTitle>
    <CardDescription>وصف البطاقة</CardDescription>
  </CardHeader>
  <CardContent>
    <p>محتوى البطاقة</p>
  </CardContent>
</Card>
```

**الاستخدامات:**
- 📊 إحصائيات وسحب البيانات
- 📝 نماذج ومدخلات
- 📈 عرض معلومات معقدة
- 🎨 بطاقات تفاعلية

### المدخلات (Inputs)

```typescript
import { Input } from '@/components/ui/input';

<Input 
  type="text"
  placeholder="أدخل النص..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>

// مع أيقونة
<div className="relative">
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" />
  <Input className="pl-10" placeholder="بحث..." />
</div>
```

**الأنواع المدعومة:**
- `text` - نص عادي
- `email` - بريد إلكتروني
- `password` - كلمة مرور
- `number` - أرقام
- `tel` - هاتف
- `url` - رابط

### العلامات (Badges)

```typescript
import { Badge } from '@/components/ui/badge';

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Error</Badge>
```

---

## ⚡ الميزات المتقدمة

### نظام الإشعارات

```typescript
import { useNotifications } from '@/lib/hooks/useNotifications';

const { showSuccess, showError, showWarning, showInfo } = useNotifications();

// استخدام الإشعارات
showSuccess('نجح!', 'تمت العملية بنجاح');
showError('خطأ!', 'حدث خطأ في العملية');
showWarning('تحذير!', 'تحقق من البيانات');
showInfo('معلومة', 'هذه معلومة مفيدة');
```

**أنواع الإشعارات:**
- 🟢 **Success** - للعمليات الناجحة
- 🔴 **Error** - للأخطاء
- 🟡 **Warning** - للتحذيرات
- 🔵 **Info** - للمعلومات

### تبديل المظهر

```typescript
import ThemeToggle from '@/components/ui/ThemeToggle';

// زر عادي
<ThemeToggle variant="button" showLabel={true} />

// قائمة منسدلة
<ThemeToggle variant="dropdown" showLabel={true} />
```

**المميزات:**
- 🌙 دعم الوضع المظلم والفاتح
- 💾 حفظ التفضيلات
- 🎨 تبديل سلس للألوان
- 📱 متجاوب مع جميع الشاشات

### الرأس المتجاوب

```typescript
import ResponsiveHeader from '@/components/ui/ResponsiveHeader';

const user = {
  name: 'أحمد محمد',
  email: 'user@example.com',
  role: 'instructor',
  avatar: '/path/to/avatar.jpg'
};

<ResponsiveHeader 
  user={user}
  notificationsCount={5}
  onLogout={() => console.log('تسجيل الخروج')}
/>
```

**المميزات:**
- 📱 متجاوب بالكامل
- 🔔 إشعارات تفاعلية
- 👤 معلومات المستخدم
- 🚪 تسجيل خروج آمن

### التبويبات التفاعلية

```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">الملف الأول</TabsTrigger>
    <TabsTrigger value="tab2">الملف الثاني</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">محتوى الملف الأول</TabsContent>
  <TabsContent value="tab2">محتوى الملف الثاني</TabsContent>
</Tabs>
```

---

## 🏢 مكونات الميزات

### لوحة تحكم المشرفين

**المكونات:**
- 📊 رسوم بيانية تفاعلية
- 📈 إحصائيات شاملة
- 📋 أنشطة حديثة
- 🎯 مقاييس الأداء

```typescript
// مثال على استخدام
<AdminDashboard />
```

**الميزات:**
- 📊 Recharts للرسوم البيانية
- 🎨 تصميم متجاوب
- 🔄 تحديث في الوقت الفعلي
- 📱 دعم الأجهزة المحمولة

### مولد أكواد الوصول

```typescript
import AccessCodeGenerator from '@/components/instructor/AccessCodeGenerator';

<AccessCodeGenerator
  templateId="template-123"
  courseName="دورة البرمجة"
  onCodeGenerated={(code) => console.log(code)}
/>
```

**المميزات:**
- 🔐 أكواد سرية آمنة
- ⏰ تاريخ انتهاء الصلاحية
- 📊 عدد الاستخدامات المحدود
- 🔗 روابط مشاركة فريدة

### نموذج الشهادة المعزز

```typescript
import EnhancedCertificateForm from '@/components/student/EnhancedCertificateForm';

<EnhancedCertificateForm link="unique-link" />
```

**الميزات الجديدة (Sprint 4):**
- 🔒 **التوقيع الرقمي** - حماية RSA-SHA256
- 📱 **رمز QR** - للتحقق السريع
- 🛡️ **الأمان المعزز** - حماية متقدمة
- 🎨 **واجهة محسنة** - تجربة مستخدم أفضل

---

## 📊 إحصائيات المشروع

### توزيع المكونات

| النوع | العدد | الوصف |
|-------|-------|--------|
| 🔘 مكونات أساسية | 12 | الأزرار، البطاقات، المدخلات |
| ⚡ مكونات متقدمة | 8 | الإشعارات، المظهر، التبويبات |
| 👨‍💼 مكونات المشرفين | 8 | لوحة التحكم، التقارير |
| 👨‍🏫 مكونات المحاضرين | 5 | مولد الأكواد، إدارة القوالب |
| 👨‍🎓 مكونات الطلاب | 3 | نماذج الشهادات، التحقق |
| 🔗 مكونات مشتركة | 4 | رأس الصفحة، التذييل |

### التقنيات المستخدمة

| التقنية | الغرض | الحالة |
|---------|-------|--------|
| ⚛️ **Next.js 14** | React Framework | ✅ مطبق |
| 🔷 **TypeScript** | Type Safety | ✅ مطبق |
| 🎨 **Tailwind CSS** | Styling | ✅ مطبق |
| 🎯 **Radix UI** | Base Components | ✅ مطبق |
| 📊 **Recharts** | Charts & Graphs | ✅ مطبق |
| ✨ **Lucide Icons** | Icon System | ✅ مطبق |

### معدل الإنجاز

```
📈 معدل التقدم الإجمالي: 85%
✅ المكونات المكتملة: 38/45
✅ الصفحات المطورة: 12/15
✅ الميزات المتقدمة: 8/10
```

---

## 🛠️ معلومات التطوير

### هيكل المشروع

```
components/
├── ui/                 # المكونات الأساسية
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
├── admin/             # مكونات المشرفين
├── instructor/        # مكونات المحاضرين
├── student/           # مكونات الطلاب
└── shared/            # المكونات المشتركة
```

### دليل المساهمة

#### إضافة مكون جديد

1. **إنشاء الملف:**
```bash
# مثال: components/ui/newComponent.tsx
```

2. **كتابة الكود:**
```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

export interface NewComponentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary'
}

const NewComponent = React.forwardRef<HTMLDivElement, NewComponentProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "base-styles",
          variant === 'secondary' && "secondary-styles",
          className
        )}
        {...props}
      />
    )
  }
)

NewComponent.displayName = "NewComponent"

export { NewComponent }
```

3. **إضافة للـ exports:**
```typescript
// components/ui/index.ts
export { NewComponent } from './newComponent'
```

4. **اختبار المكون:**
```typescript
// في ui-demo/page.tsx
import { NewComponent } from '@/components/ui'

<NewComponent variant="default">
  محتوى المكون
</NewComponent>
```

### أفضل الممارسات

#### 📝 Naming Conventions
- استخدم PascalCase للـ components
- استخدم camelCase للـ props
- استخدم kebab-case للملفات

#### 🎨 Styling
- استخدم Tailwind CSS classes
- اتبع design system متسق
- دعم الوضع المظلم والفاتح

#### 🔧 TypeScript
- استخدم strict typing
- Define interfaces للـ props
- استخدم proper error handling

---

## 🔗 روابط مفيدة

- 📖 [التوثيق الكامل](./README.md)
- 🎯 [تقرير Sprint 5](./SPRINT5_COMPLETION_REPORT.md)
- 🔧 [تحسينات TypeScript](./TYPESCRIPT_IMPROVEMENTS.md)
- 🎨 [تحسينات الواجهة](./UI_IMPROVEMENTS_README.md)

---

## 📞 الدعم والمساعدة

إذا كان لديك أي استفسارات حول المكونات:

1. 📖 راجع هذا الدليل
2. 🔍 استكشف صفحة المعاينة
3. 💬 راجع التوثيق الفني
4. 🐛 ابلغ عن الأخطاء في GitHub

---

**© 2024 منصة شهاداتي - Sprint 5 UI Demo**

*تم التطوير بـ ❤️ باستخدام Next.js و TypeScript*