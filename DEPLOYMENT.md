# دليل النشر - منصة شهاداتي

## ✅ الحالة الحالية
التطبيق جاهز تماماً للنشر. تم اكتمال Sprint 1 بنجاح!

## 📦 ما تم إنجازه

### 1. قاعدة البيانات (Supabase)
- ✅ 8 جداول رئيسية مع جميع العلاقات
- ✅ Row Level Security (RLS) Policies لجميع الجداول
- ✅ Database Functions (is_code_valid)
- ✅ Triggers (increment_usage_counters, create_profile_on_signup)
- ✅ Views (instructor_dashboard_view, student_certificates_view)

### 2. نظام المصادقة (Authentication)
- ✅ صفحة تسجيل حساب جديد (/signup)
  - اختيار الدور (محاضر/طالب)
  - اسم المؤسسة للمحاضرين
  - Form validation كامل
- ✅ صفحة تسجيل الدخول (/login)
- ✅ صفحة نسيت كلمة المرور (/forgot-password)
- ✅ صفحة إعادة تعيين كلمة المرور (/reset-password)

### 3. صفحة الهبوط (Landing Page)
- ✅ Hero Section مع CTA واضح
- ✅ قسم "كيف يعمل" (4 خطوات)
- ✅ قسم المميزات (6 مميزات)
- ✅ CTA Section
- ✅ Navbar و Footer احترافيين

### 4. التصميم (UI/UX)
- ✅ دعم كامل للعربية (RTL)
- ✅ خط Cairo من Google Fonts
- ✅ نظام ألوان متناسق
- ✅ Responsive Design (جميع الشاشات)
- ✅ Animations وتفاعلات سلسة

## 🚀 خيارات النشر

### الخيار 1: Vercel (موصى به)
الأسرع والأسهل لمشاريع Next.js

```bash
# 1. تثبيت Vercel CLI
npm install -g vercel

# 2. تسجيل الدخول
vercel login

# 3. النشر
cd /workspace/shahadati
vercel

# 4. إضافة متغيرات البيئة في Vercel Dashboard
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
```

### الخيار 2: Netlify
```bash
# 1. تثبيت Netlify CLI
npm install -g netlify-cli

# 2. تسجيل الدخول
netlify login

# 3. النشر
cd /workspace/shahadati
netlify deploy --prod

# 4. إضافة متغيرات البيئة في Netlify Dashboard
```

### الخيار 3: Railway
```bash
# 1. تثبيت Railway CLI
npm install -g @railway/cli

# 2. تسجيل الدخول
railway login

# 3. إنشاء مشروع جديد
railway init

# 4. إضافة متغيرات البيئة
railway variables set NEXT_PUBLIC_SUPABASE_URL="https://qnborzrmsqhqidnyntrs.supabase.co"
railway variables set NEXT_PUBLIC_SUPABASE_ANON_KEY="..."

# 5. النشر
railway up
```

## 📝 متغيرات البيئة المطلوبة

```env
NEXT_PUBLIC_SUPABASE_URL=https://qnborzrmsqhqidnyntrs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🧪 الاختبار المحلي

```bash
# 1. تشغيل في وضع التطوير
cd /workspace/shahadati
pnpm dev

# 2. فتح المتصفح
# http://localhost:3000

# 3. اختبار الصفحات:
# - الصفحة الرئيسية: http://localhost:3000
# - تسجيل حساب: http://localhost:3000/signup
# - تسجيل دخول: http://localhost:3000/login
```

## ✨ الخطوات التالية (Sprint 2)

بعد نشر التطبيق، الخطوات التالية في Sprint 2:
1. لوحة تحكم المحاضر
2. رفع قوالب الشهادات
3. نظام التحديد التفاعلي للحقول
4. نظام الأكواد والروابط

## 📞 الدعم الفني

إذا واجهتك أي مشكلة:
1. تحقق من أن جميع المتغيرات البيئية مضبوطة بشكل صحيح
2. تأكد من أن Supabase Database Migration تم تطبيقه
3. راجع ملف `README.md` للتفاصيل الإضافية

---

**تم إنجاز Sprint 1 بنجاح! 🎉**
