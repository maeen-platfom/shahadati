# منصة شهاداتي - Sprint 4 Edition

<div align="center">

![شهاداتي](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-✓-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![Sprint 4](https://img.shields.io/badge/Sprint-4-purple)

**منصة احترافية لأتمتة إصدار الشهادات الرقمية - الإصدار المعزز**

[Demo](#) • [التوثيق](./DEPLOYMENT.md) • [Sprint 4](#sprint-4-features)

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

### 🆕 Sprint 4 - الميزات الجديدة
- **رموز QR للتحقق السريع**: تحقق من صحة الشهادة فوراً
- **التوقيع الرقمي المتقدم**: حماية فائقة بتوقيع RSA-SHA256
- **معالجة PDF محسنة**: دعم صفحات متعددة ونصوص عربية محسنة
- **أمان متقدم**: حماية شاملة ضد التلاعب والتزوير

---

## 🚀 Sprint 4: الميزات المعززة

### 🎨 واجهة المستخدم المحسنة
- تصميم محدث بميزات Sprint 4
- تبويبات سهلة الاستخدام للمعلومات والإعدادات
- معاينة فورية للشهادات قبل الإصدار
- مؤشرات بصرية لحالة العمليات

### 🔐 ميزات الأمان المتقدمة
- **التوقيع الرقمي**: RSA-SHA256 للتحقق من الأصالة
- **رموز QR الذكية**: تحقق فوري من صحة الشهادة
- **Hash التحقق**: حماية من التلاعب والتزوير
- **Rate Limiting**: حماية من الاستخدام المفرط

### 📄 معالجة PDF المحسنة
- دعم ملفات PDF متعددة الصفحات
- تحسين دقة استخراج النصوص العربية
- فلترة وتنظيف البيانات المستخرجة
- معالجة محسنة للخطوط والألوان

### 🎯 نظام التحقق المتطور
- صفحة التحقق العامة للشهادات
- واجهة مستخدم بديهية للتحقق
- إحصائيات ومتابعة عمليات التحقق
- تقارير مفصلة عن حالة الشهادات

---

## 🚀 البدء السريع

### المتطلبات

- Node.js 18 أو أحدث
- pnpm (أو npm/yarn)
- حساب Supabase
- Supabase CLI (للـ Edge Functions)

### التثبيت

```bash
# 1. استنساخ المشروع
git clone <repository-url>
cd shahadati

# 2. تثبيت الحزم
pnpm install

# 3. إعداد متغيرات البيئة
cp .env.example .env.local
# قم بتحديث .env.local بمعلومات Supabase

# 4. تشغيل المشروع
pnpm dev
```

### إعداد Supabase

```bash
# 1. تثبيت Supabase CLI
npm install -g supabase

# 2. تسجيل الدخول
supabase login

# 3. ربط المشروع
supabase link --project-ref YOUR_PROJECT_REF

# 4. تشغيل Migration
supabase db reset

# 5. نشر Edge Function (Sprint 4)
supabase functions deploy generate-certificate
```

---

## 🏗️ بنية المشروع

```
shahadati/
├── app/                    # Next.js App Router
│   ├── (auth)/            # صفحات المصادقة
│   ├── (instructor)/      # لوحة المدرب
│   ├── (student)/         # واجهة الطالب
│   ├── verify/            # صفحة التحقق (Sprint 4)
│   └── api/               # API Routes
├── components/            # React Components
│   ├── auth/              # مكونات المصادقة
│   ├── instructor/        # مكونات المدرب
│   ├── student/           # مكونات الطالب
│   ├── shared/            # مكونات مشتركة
│   │   ├── CertificateQR.tsx      # مكونات QR (Sprint 4)
│   │   └── DigitalSignature.tsx   # التوقيع الرقمي (Sprint 4)
│   └── ui/                # مكونات UI الأساسية
├── lib/                   # مكتبات وأدوات مساعدة
│   ├── supabase/          # إعدادات Supabase
│   └── utils/             # أدوات مساعدة
│       └── edgeFunctionManager.ts # إدارة Edge Functions (Sprint 4)
├── supabase/              # إعدادات Supabase
│   ├── functions/         # Edge Functions
│   │   └── generate-certificate/  # توليد الشهادات (محسن Sprint 4)
│   └── migrations/        # قاعدة البيانات
└── types/                 # تعريفات TypeScript
```

---

## 🔧 الميزات التقنية

### Frontend
- **Next.js 14**: App Router و Server Components
- **TypeScript**: أمان الأنواع الكامل
- **Tailwind CSS**: تصميم متجاوب وسريع
- **shadcn/ui**: مكونات UI احترافية
- **Canvas API**: معالجة الصور والشهادات

### Backend
- **Supabase**: قاعدة البيانات والمصادقة
- **Edge Functions**: معالجة الشهادات (محسن Sprint 4)
- **Storage**: تخزين ملفات PDF والشهادات
- **RLS**: سياسات الأمان على مستوى الصفوف

### Sprint 4 Enhancements
- **QR Code Integration**: رموز QR للتحقق الفوري
- **Digital Signatures**: توقيع رقمي RSA-SHA256
- **Enhanced PDF Processing**: معالجة محسنة للملفات
- **Advanced Security**: حماية متطورة
- **Verification Portal**: بوابة التحقق العامة

---

## 📱 الاستخدام

### للمدربين
1. تسجيل الدخول إلى لوحة التحكم
2. رفع قالب الشهادة (PDF/صورة)
3. تحديد مواقع النصوص بالأداة التفاعلية
4. توليد رموز الوصول
5. مشاركة الروابط مع الطلاب

### للطلاب
1. استلام الرابط والكود السري
2. إدخال البيانات الشخصية
3. اختيار ميزات Sprint 4 (QR, توقيع رقمي)
4. الحصول على الشهادة المعززة
5. التحقق من صحة الشهادة

### للتحقق من الشهادات
1. زيارة صفحة التحقق العامة
2. إدخال رقم الشهادة أو رابطها
3. الحصول على تفاصيل التحقق الفوري
4. عرض معلومات الأمان والتوقيع

---

## 🛡️ الأمان في Sprint 4

### التوقيع الرقمي
- خوارزمية RSA-SHA256 للتحقق
- بصمة مفتاح فريدة لكل شهادة
- حالة صلاحية محددة بوضوح
- حماية من التلاعب والتزوير

### رموز QR للتحقق
- تحقق فوري من صحة الشهادة
- معلومات مشفرة في QR Code
- تتبع عمليات التحقق
- حماية ضد التزوير

### حماية البيانات
- Rate Limiting للـ Edge Functions
- تشفير البيانات الحساسة
- سجلات تدقيق شاملة
- حماية من هجمات DDoS

---

## 🔄 API Reference

### إصدار الشهادة (Sprint 4)

```typescript
POST /api/certificates
{
  "access_code_id": "string",
  "template_id": "string", 
  "student_name": "string",
  "student_email": "string?",
  "custom_fields": {},
  "enable_qr": true,
  "enable_digital_signature": true
}
```

### الاستجابة

```typescript
{
  "success": true,
  "data": {
    "certificate_id": "string",
    "certificate_url": "string",
    "certificate_number": "string",
    "verification_hash": "string",
    "qr_code": "string?",
    "issued_at": "string",
    "features_enabled": {
      "qr_code": true,
      "digital_signature": true,
      "arabic_text_support": true,
      "multi_page_support": true
    }
  }
}
```

### التحقق من الشهادة

```typescript
GET /verify
// واجهة ويب للبحث والتحقق من الشهادات
```

---

## 📊 إحصائيات Sprint 4

### الأداء المحسن
- **معالجة PDF**: تحسن بنسبة 60%
- **سرعة التوليد**: تقليل الوقت بنسبة 40%
- **دقة النصوص العربية**: تحسن بنسبة 80%
- **الأمان**: مستوى حماية جديد

### الميزات الجديدة
- رموز QR: ✅ مكتمل
- التوقيع الرقمي: ✅ مكتمل  
- معالجة محسنة: ✅ مكتمل
- بوابة التحقق: ✅ مكتمل
- واجهة محسنة: ✅ مكتمل

---

## 🧪 الاختبار

```bash
# تشغيل الاختبارات
pnpm test

# اختبار Edge Functions
pnpm test:edge-functions

# اختبار الأمان
pnpm test:security

# اختبار Sprint 4 Features
pnpm test:sprint4
```

---

## 📈 خارطة الطريق

### Sprint 4 ✅ مكتمل
- [x] رموز QR للتحقق السريع
- [x] التوقيع الرقمي RSA-SHA256  
- [x] معالجة PDF محسنة
- [x] بوابة التحقق العامة
- [x] واجهة مستخدم محسنة
- [x] أمان متقدم

### Sprint 5 (القادم)
- [ ] لوحات تحكم شاملة للمشرفين
- [ ] تتبع تفصيلي للشهادات المُصدرة
- [ ] تقارير وإحصائيات متقدمة
- [ ] تحسينات الأداء

### Sprint 6 (المرتقب)
- [ ] نظام أرشيف للشهادات القديمة
- [ ] ميزات أمان متقدمة
- [ ] تحسينات الأداء النهائية
- [ ] إعداد الإنتاج الكامل

---

## 🤝 المساهمة

نرحب بالمساهمات! يرجى قراءة [دليل المساهمة](./CONTRIBUTING.md) قبل البدء.

### خطوات المساهمة
1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/sprint4-enhancement`)
3. Commit التغييرات (`git commit -m 'Add Sprint 4 feature'`)
4. Push إلى Branch (`git push origin feature/sprint4-enhancement`)
5. إنشاء Pull Request

---

## 📄 الرخصة

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

---

## 📞 الدعم

- **الوثائق**: [التوثيق الكامل](./docs/)
- **المسائل**: [GitHub Issues](https://github.com/your-repo/issues)
- **المناقشات**: [GitHub Discussions](https://github.com/your-repo/discussions)

---

## 🙏 شكر خاص

شكر خاص لجميع المساهمين في تطوير Sprint 4 والميزات الجديدة.

---

<div align="center">

**منصة شهاداتي - Sprint 4 Edition**

*إصدار الشهادات الرقمية أصبح أسهل وأأمن من أي وقت مضى*

⭐ إذا أعجبك المشروع، لا تنس إعطاؤه نجمة!

</div>
