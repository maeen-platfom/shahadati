# منصة شهاداتي

<div align="center">

![شهاداتي](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-✓-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

**منصة احترافية لأتمتة إصدار الشهادات الرقمية**

[Demo](#) • [التوثيق](./DEPLOYMENT.md) • [دليل المطور](#)

</div>

---

## 📖 نظرة عامة

منصة شهاداتي هي حل متكامل يساعد المحاضرين والمدربين على إصدار شهادات رقمية احترافية في دقائق معدودة، بدلاً من ساعات من العمل اليدوي المرهق.

### 🎯 المشكلة
- النسخ واللصق اليدوي لأسماء مئات الطلاب
- ساعات من العمل المتكرر
- احتمالية الأخطاء الإملائية
- صعوبة المتابعة والأرشفة

### ✨ الحل
منصة آلية بالكامل تتيح للمحاضر:
1. رفع قالب شهادته المخصص
2. تحديد مكان اسم الطالب بنقرة واحدة
3. توليد رابط آمن مع كود سري
4. مشاركة الرابط مع الطلاب
5. الطلاب يحصلون على شهاداتهم تلقائياً

---

## 🚀 البدء السريع

### المتطلبات

- Node.js 18 أو أحدث
- pnpm (أو npm/yarn)
- حساب Supabase

### التثبيت

```bash
# 1. استنساخ المشروع
git clone <repository-url>
cd shahadati

# 2. تثبيت المكتبات
pnpm install

# 3. نسخ ملف البيئة
cp .env.local.example .env.local

# 4. تعديل المتغيرات البيئية
# أضف معلومات Supabase الخاصة بك

# 5. تطبيق Database Migration
# افتح Supabase Dashboard > SQL Editor
# الصق محتوى supabase/migrations/001_initial_schema.sql
# نفّذ الاستعلام

# 6. تشغيل المشروع
pnpm dev
```

المشروع سيعمل على: http://localhost:3000

---

## 🏗️ البنية التقنية

### Frontend
- **Next.js 14** - App Router
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **React Hook Form + Zod** - Forms & Validation
- **Lucide React** - Icons

### Backend
- **Supabase** - BaaS
  - PostgreSQL Database
  - Authentication
  - Row Level Security
  - Edge Functions (قريباً)
  - Storage (قريباً)

### الميزات الرئيسية
- ✅ نظام مصادقة كامل (تسجيل، دخول، إعادة تعيين كلمة المرور)
- ✅ دعم كامل للعربية (RTL)
- ✅ Responsive Design
- ✅ 8 جداول بقاعدة بيانات محسنة
- ✅ RLS Policies لحماية البيانات
- ✅ Database Triggers & Functions

---

## 📂 هيكل المشروع

```
shahadati/
├── app/                    # Next.js App Router
│   ├── (auth)/            # صفحات المصادقة
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── layout.tsx         # Root Layout
│   ├── page.tsx           # Landing Page
│   └── globals.css        # Global Styles
├── components/
│   ├── auth/              # مكونات المصادقة
│   ├── shared/            # مكونات مشتركة (Navbar, Footer)
│   └── ui/                # مكونات UI القابلة لإعادة الاستخدام
├── lib/
│   ├── supabase/          # Supabase Clients
│   └── utils/             # Utilities (Validators, Helpers)
├── types/
│   └── database.ts        # TypeScript Types
├── supabase/
│   └── migrations/        # Database Migrations
└── public/                # Static Assets
```

---

## 🗄️ قاعدة البيانات

### الجداول (8 جداول رئيسية)

1. **profiles** - ملفات المستخدمين
2. **certificate_templates** - قوالب الشهادات
3. **template_fields** - حقول القوالب الديناميكية
4. **access_codes** - أكواد الوصول الآمنة
5. **issued_certificates** - الشهادات المُصدرة
6. **certificate_archive** - أرشيف الطلاب
7. **admin_logs** - سجل عمليات الأدمن
8. **platform_templates** - القوالب الجاهزة

### الأمان
- ✅ Row Level Security (RLS) على جميع الجداول
- ✅ Database Triggers للتحديثات التلقائية
- ✅ Functions للتحقق من الصلاحيات

---

## 🧪 الاختبار

### اختبار المصادقة

```bash
# 1. افتح المشروع
pnpm dev

# 2. انتقل إلى /signup
# 3. أنشئ حساب محاضر
# 4. تحقق من البريد الإلكتروني
# 5. سجل الدخول من /login
```

### اختبار قاعدة البيانات

```sql
-- تحقق من أن الجداول تم إنشاؤها
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- تحقق من RLS Policies
SELECT * FROM pg_policies;

-- اختبار دالة التحقق من الكود
SELECT * FROM is_code_valid('TEST123');
```

---

## 📚 التوثيق الإضافي

- [دليل النشر](./DEPLOYMENT.md) - خطوات النشر التفصيلية
- [تصميم قاعدة البيانات](./docs/database-schema.md) - ERD والعلاقات
- [المواصفات التقنية](./docs/technical-specification.md) - قرارات معمارية
- [خارطة الطريق](./docs/implementation-roadmap.md) - خطة التنفيذ

---

## 🛠️ التطوير

### معايير الكود

- استخدم TypeScript لجميع الملفات
- اتبع ESLint rules
- استخدم Prettier للتنسيق
- اكتب كود نظيف وموثق

### Git Workflow

```bash
# 1. أنشئ branch جديد
git checkout -b feature/your-feature

# 2. قم بالتغييرات
git add .
git commit -m "وصف التغيير"

# 3. ادفع للريبو
git push origin feature/your-feature

# 4. أنشئ Pull Request
```

---

## 📊 حالة التطوير

### Sprint 1 ✅ (مكتمل)
- [x] إعداد المشروع
- [x] تطبيق Database Schema
- [x] نظام المصادقة
- [x] صفحة الهبوط
- [x] Layout أساسي

### Sprint 2 🔄 (قادم)
- [ ] لوحة تحكم المحاضر
- [ ] رفع القوالب
- [ ] نظام التحديد التفاعلي

### Sprint 3 📅 (مخطط)
- [ ] نظام الأكواد
- [ ] توليد الروابط
- [ ] إصدار الشهادات

---

## 🤝 المساهمة

نرحب بالمساهمات! يرجى:
1. Fork المشروع
2. إنشاء Branch جديد
3. Commit التغييرات
4. Push إلى Branch
5. فتح Pull Request

---

## 📄 الترخيص

هذا المشروع مرخص تحت MIT License - انظر ملف [LICENSE](LICENSE) للتفاصيل.

---

## 📞 التواصل

- الموقع: [shahadati.com](#)
- البريد: info@shahadati.com
- Twitter: [@shahadati](#)

---

<div align="center">

**صُنع بـ ❤️ في السعودية**

[⬆ العودة للأعلى](#منصة-شهاداتي)

</div>
