# منصة شهاداتي - Shahadati Platform

![Project Status](https://img.shields.io/badge/Status-Completed-brightgreen)
![Platform](https://img.shields.io/badge/Platform-Vercel-blue)
![Tech Stack](https://img.shields.io/badge/Tech%20Stack-Next.js%20%7C%20Supabase-orange)

**منصة إدارة الشهادات الرقمية الآمنة** | **Secure Digital Certificate Management Platform**

---

## 🎯 **نظرة عامة**

منصة شهاداتي هي منصة شاملة لإدارة وإصدار الشهادات الرقمية بطريقة آمنة ومتطورة. توفر المنصة نظاماً متكاملاً لإدارة القوالب، إصدار الشهادات، التحقق من صحتها، والأرشفة الذكية.

---

## ✨ **الميزات الرئيسية**

### 🔐 **نظام المصادقة والأمان**
- مصادقة آمنة باستخدام Supabase Auth
- تشفير AES-256-GCM للبيانات الحساسة
- نظام صلاحيات متقدم (RBAC)
- حماية من CSRF و XSS

### 📜 **إدارة الشهادات**
- إنشاء وتحرير قوالب الشهادات
- إصدار شهادات مخصصة
- نظام QR codes للتحقق السريع
- توقيعات رقمية للأصالة

### 📊 **لوحة التحكم الإدارية**
- مراقبة الأداء في الوقت الفعلي
- إحصائيات مفصلة وتقارير
- إدارة المستخدمين والصلاحيات
- تتبع نشاطات النظام

### 🏛️ **نظام الأرشيف الذكي**
- أرشفة تلقائية للشهادات
- نظام بحث متقدم
- فلترة وتصنيف ذكي
- نسخ احتياطية آمنة

### 📈 **المراقبة والتحليلات**
- مراقبة الأداء والأخطاء
- تحليلات استخدام النظام
- تقارير دورية
- إنذارات فورية للمشاكل

---

## 🚀 **الروابط**

- **🌐 الموقع المباشر**: [https://shahadati-4saofd05f-maeen-platfoms-projects.vercel.app](https://shahadati-4saofd05f-maeen-platfoms-projects.vercel.app)
- **🔗 الدومين المخصص**: [shahadati.vercel.app](https://shahadati.vercel.app)
- **💻 كود المصدر**: [GitHub Repository](https://github.com/maeen-platfom/shahadati)

---

## 🛠️ **التقنيات المستخدمة**

### **Frontend**
- **Next.js 14** - React Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Utility-First CSS
- **shadcn/ui** - Modern UI Components
- **Lucide React** - Beautiful Icons

### **Backend**
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Authentication & Authorization
  - Real-time subscriptions
  - Edge Functions
  - File Storage

### **Deployment**
- **Vercel** - Hosting & CI/CD
- **GitHub Actions** - Automated Deployment
- **Docker** - Containerization

### **Security**
- **AES-256-GCM** - Data Encryption
- **JWT** - Secure Authentication
- **RBAC** - Role-Based Access Control
- **Rate Limiting** - API Protection

---

## 📋 **الصفحات المتاحة**

| الصفحة | المسار | الوصف |
|--------|--------|--------|
| 🏠 **الرئيسية** | `/` | صفحة الترحيب والمقدمة |
| 🔐 **تسجيل الدخول** | `/auth/login` | تسجيل دخول المستخدمين |
| 📋 **تسجيل جديد** | `/auth/register` | إنشاء حساب جديد |
| 👨‍💼 **لوحة التحكم** | `/admin/dashboard` | نظرة عامة على النظام |
| 📄 **إدارة القوالب** | `/admin/templates` | إنشاء وتحرير قوالب الشهادات |
| 📜 **إدارة الشهادات** | `/admin/certificates` | إصدار ومتابعة الشهادات |
| 🗄️ **نظام الأرشيف** | `/admin/archive` | أرشفة وبحث في الشهادات |
| 🔒 **إدارة الأمان** | `/admin/security` | إعدادات الأمان والصلاحيات |
| 📊 **مراقبة الأداء** | `/admin/performance` | إحصائيات ومراقبة الأداء |
| ✅ **التحقق من الشهادات** | `/verify` | التحقق من صحة الشهادات |
| 🎨 **معاينة الواجهة** | `/ui-demo` | عرض جميع مكونات الواجهة |

---

## 📊 **الإحصائيات**

- **🗓️ المدة الزمنية**: 6 sprints مكتملة
- **📁 عدد الملفات**: 119+ ملف برمجي
- **💻 أسطر الكود**: 37,000+ سطر
- **⚛️ مكونات React**: 45+ مكون
- **📄 صفحات الواجهة**: 25+ صفحة
- **🔌 API Endpoints**: 40+ نقطة نهاية

---

## 🔧 **التثبيت والتشغيل**

### **المتطلبات**
- Node.js 18+
- pnpm أو npm
- حساب Supabase
- حساب Vercel (للنشر)

### **التثبيت المحلي**

```bash
# استنساخ المستودع
git clone https://github.com/maeen-platfom/shahadati.git

# الدخول للمجلد
cd shahadati

# تثبيت التبعيات
pnpm install

# إعداد متغيرات البيئة
cp .env.example .env.local
# قم بتعديل .env.local بالقيم الصحيحة

# تشغيل الخادم المحلي
pnpm dev
```

### **متغيرات البيئة المطلوبة**

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 📝 **المساهمة**

نرحب بالمساهمات! يرجى اتباع الخطوات التالية:

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push للـ branch (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

---

## 📞 **الدعم**

للحصول على الدعم أو الإبلاغ عن مشاكل:

- **📧 البريد الإلكتروني**: [support@example.com]
- **🐛 الإبلاغ عن مشاكل**: [GitHub Issues](https://github.com/maeen-platfom/shahadati/issues)
- **💬 المناقشات**: [GitHub Discussions](https://github.com/maeen-platfom/shahadati/discussions)

---

## 📄 **الترخيص**

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

---

## 🙏 **شكر وتقدير**

- **MiniMax Agent** - التطوير والتصميم
- **Supabase** - Backend Infrastructure
- **Vercel** - Hosting Platform
- **Tailwind CSS** - Styling Framework
- **shadcn/ui** - UI Components

---

<div align="center">

**🌟 تم التطوير بواسطة MiniMax Agent | Built with ❤️ by MiniMax Agent**

[زيارة الموقع](https://shahadati-4saofd05f-maeen-platfoms-projects.vercel.app) •
[كود المصدر](https://github.com/maeen-platfom/shahadati) •
[توثيق إضافي](./docs/)

</div>