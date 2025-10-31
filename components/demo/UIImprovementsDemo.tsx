'use client';

import React from 'react';
import ResponsiveHeader from '@/components/ui/ResponsiveHeader';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useNotifications } from '@/lib/hooks/useNotifications';

export default function UIImprovementsDemo() {
  const { showSuccess, showError, showWarning, showInfo } = useNotifications();

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

  const demoUser = {
    name: 'أحمد محمد علي',
    email: 'ahmed@example.com',
    role: 'student' as const,
    avatar: undefined
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header with all features */}
      <ResponsiveHeader 
        user={demoUser}
        onLogout={() => console.log('تم تسجيل الخروج')}
        notificationsCount={3}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">
              تحسينات الواجهة والتنبيهات
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              منصة شهاداتي - تجربة مستخدم محسنة ومتجاوبة
            </p>
            
            {/* Theme Toggle Demo */}
            <div className="flex justify-center mb-8">
              <ThemeToggle variant="dropdown" showLabel={true} />
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            
            {/* Notification Demo Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-card-foreground">
                نظام الإشعارات
              </h3>
              <p className="text-muted-foreground mb-4">
                جرب أنواع الإشعارات المختلفة
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => handleNotificationDemo('success')}
                  className="w-full px-4 py-2 bg-success text-success-foreground rounded-lg hover:bg-success/90 transition-colors"
                >
                  إشعار نجاح
                </button>
                <button
                  onClick={() => handleNotificationDemo('error')}
                  className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                >
                  إشعار خطأ
                </button>
                <button
                  onClick={() => handleNotificationDemo('warning')}
                  className="w-full px-4 py-2 bg-warning text-warning-foreground rounded-lg hover:bg-warning/90 transition-colors"
                >
                  إشعار تحذير
                </button>
                <button
                  onClick={() => handleNotificationDemo('info')}
                  className="w-full px-4 py-2 bg-info text-info-foreground rounded-lg hover:bg-info/90 transition-colors"
                >
                  إشعار معلومات
                </button>
              </div>
            </div>

            {/* Theme Demo Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-card-foreground">
                تبديل المظهر
              </h3>
              <p className="text-muted-foreground mb-4">
                جرب تبديل الوضع الداكن والفاتح
              </p>
              <div className="flex flex-col space-y-3">
                <ThemeToggle variant="button" showLabel={true} />
                <ThemeToggle variant="dropdown" showLabel={true} />
              </div>
            </div>

            {/* Responsive Design Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-card-foreground">
                التصميم المتجاوب
              </h3>
              <p className="text-muted-foreground mb-4">
                تجربة مثالية على جميع الأجهزة
              </p>
              <div className="flex space-x-2 space-x-reverse text-sm text-muted-foreground">
                <span className="px-2 py-1 bg-primary/10 text-primary rounded">📱 phones</span>
                <span className="px-2 py-1 bg-secondary/10 text-secondary rounded">📲 tablets</span>
                <span className="px-2 py-1 bg-accent/10 text-accent rounded">💻 desktop</span>
              </div>
            </div>

          </div>

          {/* Feature Details */}
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              الميزات الرئيسية
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-primary">🎨 تصميم متجاوب</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• دعم كامل للهواتف والأجهزة اللوحية</li>
                  <li>• تصميم مرن يتكيف مع جميع الشاشات</li>
                  <li>• واجهة سلسة ومتسقة</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-secondary">🔔 نظام إشعارات متقدم</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• إشعارات في الوقت الفعلي</li>
                  <li>• 4 أنواع مع ألوان مميزة</li>
                  <li>• تأثيرات بصرية متقدمة</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-accent">🌙 الوضع الداكن/الفاتح</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• تبديل سلس بين الأوضاع</li>
                  <li>• حفظ التفضيلات تلقائياً</li>
                  <li>• متوافق مع إعدادات النظام</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-info">♿ إمكانية الوصول</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• دعم قارئات الشاشة</li>
                  <li>• ألوان متدرجة للمكفوفين</li>
                  <li>• تباين عالي في الألوان</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Code Example */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-card-foreground">
              مثال على الاستخدام
            </h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import { useNotifications } from '@/lib/hooks/useNotifications';
import ThemeToggle from '@/components/ui/ThemeToggle';
import ResponsiveHeader from '@/components/ui/ResponsiveHeader';

const { showSuccess, showError } = useNotifications();

// إظهار إشعار
showSuccess('تم بنجاح!', 'تمت العملية بنجاح');

// تبديل المظهر
<ThemeToggle variant="dropdown" showLabel={true} />

// رأس الصفحة المتجاوب
<ResponsiveHeader 
  user={user}
  notificationsCount={5}
/>`}
            </pre>
          </div>

        </div>
      </main>
    </div>
  );
}