# دليل إعداد الإنتاج والنشر - منصة شهاداتي

## نظرة عامة

هذا الدليل الشامل يوضح كيفية إعداد ونشر منصة شهاداتي في بيئة الإنتاج مع ميزات متقدمة للأمان والمراقبة والنشر التلقائي.

## 🎯 المحتويات

- [متطلبات النظام](#متطلبات-النظام)
- [إعداد متغيرات البيئة](#إعداد-متغيرات-البيئة)
- [ملفات التكوين](#ملفات-التكوين)
- [سكريبت النشر](#سكريبت-النشر)
- [الواجهة الإدارية](#الواجهة-الإدارية)
- [المراقبة والصيانة](#المراقبة-والصيانة)
- [أفضل الممارسات](#أفضل-الممارسات)
- [استكشاف الأخطاء](#استكشاف-الأخطاء)

## 📋 متطلبات النظام

### متطلبات أساسية
- **Node.js**: الإصدار 18 أو أحدث
- **npm**: الإصدار 9 أو أحدث
- **Git**: أحدث إصدار
- **حساب Supabase**: مشروع نشط
- **حساب Vercel**: للنشر (اختياري)

### متطلبات اختيارية
- **Docker**: للحاويات
- **Postman**: لاختبار API
- **VS Code**: مع امتدادات TypeScript وESLint

## 🔧 إعداد متغيرات البيئة

### 1. متغيرات أساسية

```bash
# ملف .env.production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXTAUTH_SECRET=your-secret-key-min-32-chars
NEXTAUTH_URL=https://yourdomain.com
SENDGRID_API_KEY=your-sendgrid-key
```

### 2. متغيرات متقدمة للإنتاج

```bash
# أمان
ENABLE_RATE_LIMITING=true
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# قاعدة البيانات
DB_POOL_SIZE=10
DB_TIMEOUT=30000
DB_RETRY_ATTEMPTS=3
DB_SSL=true

# المراقبة
LOG_LEVEL=info
MONITORING_ENABLED=true
ERROR_REPORTING=true

# البريد الإلكتروني
EMAIL_ENABLED=true
EMAIL_PROVIDER=sendgrid
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=منصة شهاداتي

# الميزات
FEATURE_CERTIFICATE_QR=true
FEATURE_API_ACCESS=true
FEATURE_WEBHOOK_NOTIFICATIONS=false
```

### 3. إنشاء ملف الإنتاج

```bash
# نسخ النموذج
cp .env.production.example .env.production

# تحرير القيم
nano .env.production
```

## 📁 ملفات التكوين

### 1. Vercel Configuration (`vercel.json`)

```json
{
  "name": "shahadati",
  "version": 2,
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x",
      "maxDuration": 60
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

### 2. Next.js Configuration (`next.config.mjs`)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizeCss: true
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000'
          }
        ]
      }
    ];
  }
};
```

## 🚀 سكريبت النشر

### الاستخدام الأساسي

```bash
# منح صلاحيات التنفيذ
chmod +x scripts/deploy.sh

# نشر في بيئة الإنتاج
./scripts/deploy.sh

# نشر في بيئة التجربة
./scripts/deploy.sh --env staging

# نشر بدون اختبارات
./scripts/deploy.sh --skip-tests

# فرض النشر (حتى لو كانت هناك أخطاء)
./scripts/deploy.sh --force

# تشغيل تجريبي
./scripts/deploy.sh --dry-run
```

### الميزات

- ✅ فحص المتطلبات تلقائياً
- ✅ إنشاء نسخ احتياطية
- ✅ تثبيت التبعيات
- ✅ فحص TypeScript
- ✅ تشغيل ESLint
- ✅ بناء المشروع
- ✅ النشر على Vercel
- ✅ نشر Edge Functions
- ✅ فحص صحة النشر
- ✅ تسجيل مفصل
- ✅ إشعارات النشر

### مثال سكريبت مخصص

```bash
#!/bin/bash
# نشر مخصص مع إعدادات محددة

DEPLOY_ENV="production" \
SKIP_TESTS=false \
FORCE_DEPLOY=false \
VERBOSE=true \
./scripts/deploy.sh

# أو
./scripts/deploy.sh \
  --env production \
  --skip-tests \
  --verbose
```

## 🎛️ الواجهة الإدارية

### الوصول إلى لوحة النشر

```bash
# URL لوحة النشر
https://yourdomain.com/admin/deployment
```

### المكونات الرئيسية

#### 1. مدير النشر (`DeploymentManager.tsx`)
- بدء عملية النشر
- مراقبة التقدم
- التراجع للإصدار السابق
- سجلات النشر

#### 2. إعدادات الإنتاج (`ProductionSettings.tsx`)
- إعدادات قاعدة البيانات
- إعدادات الأمان
- إعدادات البريد الإلكتروني
- إعدادات المراقبة
- إعدادات الميزات

#### 3. مدير البيئة (`EnvironmentManager.tsx`)
- إدارة متغيرات البيئة
- إضافة وتعديل وحذف المتغيرات
- فلترة وبحث
- تصدير/استيراد

#### 4. مراقب النشر (`DeploymentMonitor.tsx`)
- مؤشرات النظام في الوقت الفعلي
- التنبيهات والسجلات
- رسوم الأداء
- فحص صحة النظام

## 📊 المراقبة والصيانة

### مراقبة النظام

#### 1. مؤشرات الأداء
- استخدام المعالج والذاكرة
- وقت الاستجابة
- معدل الأخطاء
- عدد الطلبات

#### 2. التنبيهات
- حد معدل الطلبات
- فشل الخدمات
- استخدام عالي للموارد
- انتهاء صلاحية الرموز

#### 3. السجلات
- سجلات التطبيق
- سجلات قاعدة البيانات
- سجلات الأمان
- سجلات الأداء

### المهام التلقائية

```bash
# تنظيف يومي (2:00 صباحاً)
0 2 * * * curl -X POST https://yourdomain.com/api/cron/cleanup

# نسخة احتياطية أسبوعية (الأحد 3:00)
0 3 * * 0 curl -X POST https://yourdomain.com/api/cron/backup

# مراجعة الأداء شهرياً
0 9 1 * * curl -X POST https://yourdomain.com/api/cron/performance-review
```

## 🔒 الأمان

### إعدادات الأمان الأساسية

```javascript
// إعدادات الأمان في next.config.mjs
headers: [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'"
  }
]
```

### حماية API

```javascript
// Rate Limiting
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // حد أقصى 100 طلب
  message: 'تم تجاوز حد الطلبات'
};

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : true,
  credentials: true
};
```

### تشفير البيانات

```javascript
// متغيرات敏感ة
const sensitiveData = {
  encryption: 'aes-256-gcm',
  keyRotation: '30 days',
  backup: 'encrypted'
};
```

## 📋 أفضل الممارسات

### 1. بيئة التطوير

```bash
# إعداد البيئة المحلية
npm install
npm run dev

# اختبار الوظائف
npm run test
npm run test:e2e

# فحص الكود
npm run lint
npm run type-check
```

### 2. بيئة الإنتاج

```bash
# بناء الإنتاج
NODE_ENV=production npm run build

# اختبار البناء
npm run start

# مراقبة الأداء
npm run analyze
```

### 3. النسخ الاحتياطية

```bash
# إنشاء نسخة احتياطية يدوية
npm run backup:create

# استعادة من نسخة احتياطية
npm run backup:restore

# جدولة النسخ الاحتياطية
0 3 * * 0 npm run backup:schedule
```

### 4. التحديثات

```bash
# فحص التحديثات
npm run update:check

# تحديث التبعيات
npm run update:dependencies

# تحديث قاعدة البيانات
npm run migrate:up
```

## 🛠️ استكشاف الأخطاء

### مشاكل شائعة

#### 1. فشل النشر

```bash
# فحص السجلات
tail -f deployment-$(date +%Y%m%d).log

# فحص البيئة
./scripts/deploy.sh --dry-run

# فحص المتطلبات
node --version
npm --version
git --version
```

#### 2. مشاكل قاعدة البيانات

```bash
# فحص الاتصال
psql -h your-host -U your-user -d your-db

# فحص السجلات
tail -f /var/log/postgresql/postgresql.log

# إصلاح الاتصال
sudo systemctl restart postgresql
```

#### 3. مشاكل الشبكة

```bash
# فحص الاتصال
curl -I https://yourdomain.com

# فحص DNS
nslookup yourdomain.com

# فحص SSL
openssl s_client -connect yourdomain.com:443
```

#### 4. مشاكل الذاكرة

```bash
# فحص استخدام الذاكرة
free -h
df -h

# مراقبة العمليات
top
htop

# تنظيف الذاكرة
echo 3 > /proc/sys/vm/drop_caches
```

### أدوات التشخيص

```bash
# مراقبة النظام
htop
iotop
netstat -tulpn

# مراقبة التطبيق
pm2 monit
pm2 logs

# مراقبة قواعد البيانات
pg_top
mongo-top
```

## 🔄 دورة النشر

### 1. المرحلة التجريبية

```bash
# نشر في بيئة التجربة
./scripts/deploy.sh --env staging

# اختبار شامل
npm run test:e2e --env staging

# فحص الأداء
npm run test:performance --env staging
```

### 2. المراجعة والاختبار

```bash
# مراجعة الكود
git review

# فحص الأمان
npm audit
npm run security:scan

# اختبار الضغط
npm run test:load
```

### 3. النشر للإنتاج

```bash
# إنشاء نسخة احتياطية
npm run backup:create

# نشر في الإنتاج
./scripts/deploy.sh --env production

# فحص صحة النشر
npm run health:check

# مراقبة أولية
npm run monitor:initial
```

### 4. ما بعد النشر

```bash
# فحص الأداء
npm run performance:check

# مراقبة الأخطاء
npm run error:monitor

# تحديث الوثائق
npm run docs:update
```

## 📈 تحسين الأداء

### 1. تحسين البناء

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
```

### 2. تحسين التخزين المؤقت

```javascript
// إعدادات Cache
const cacheConfig = {
  browser: '1 year',
  server: '1 hour',
  cdn: '1 month'
};
```

### 3. تحسين الصور

```javascript
// إعدادات الصور
images: {
  formats: ['image/webp', 'image/avif'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  minimumCacheTTL: 31536000
}
```

## 🔧 صيانة دورية

### مهام أسبوعية

```bash
# فحص التحديثات
npm outdated

# تنظيف التبعيات القديمة
npm run clean:dependencies

# فحص مساحة التخزين
du -sh /var/log/*
```

### مهام شهرية

```bash
# مراجعة سجلات الأمان
npm run security:review

# فحص أداء قاعدة البيانات
npm run db:analyze

# تحديث النسخ الاحتياطية
npm run backup:rotate
```

### مهام سنوية

```bash
# مراجعة شاملة للأمان
npm run security:audit

# تحديث الوثائق
npm run docs:regenerate

# مراجعة البنية
npm run architecture:review
```

## 📞 الدعم والمساعدة

### موارد مفيدة

- [وثائق Next.js](https://nextjs.org/docs)
- [وثائق Supabase](https://supabase.com/docs)
- [وثائق Vercel](https://vercel.com/docs)
- [دليل TypeScript](https://www.typescriptlang.org/docs/)

### فريق الدعم

- **المطور الرئيسي**: [email]
- **أمن المعلومات**: [email]
- **البنية التحتية**: [email]

### قنوات الاتصال

- **GitHub Issues**: [repository-url]/issues
- **Slack**: [workspace-url]
- **Email**: support@yourdomain.com

---

## 📝 ملاحظات إضافية

### التحديثات المستقبلية

- [ ] دعم Kubernetes
- [ ] تحسين CI/CD Pipeline
- [ ] إضافة مراقبة متقدمة
- [ ] تحسين الأمان
- [ ] دعم النسخ المتعددة

### رخصة الاستخدام

هذا المشروع مرخص تحت [اسم الرخصة] - راجع ملف LICENSE للتفاصيل.

---

**تم إنشاؤه بواسطة**: فريق تطوير منصة شهاداتي  
**آخر تحديث**: 2025-10-31  
**الإصدار**: 1.0.0