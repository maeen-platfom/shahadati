'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Home, 
  Code, 
  Palette, 
  Layout, 
  Settings, 
  Monitor,
  Eye,
  Sparkles
} from 'lucide-react';

export default function UIDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header متخصص للمعاينة */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo والمعلومات */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link 
                href="/" 
                className="flex items-center space-x-3 space-x-reverse hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="hidden md:block">
                  <h1 className="text-xl font-bold">معاينة المكونات</h1>
                  <p className="text-sm text-muted-foreground">منصة شهاداتي - Sprint 5</p>
                </div>
              </Link>
            </div>

            {/* Navigation للمعاينة */}
            <nav className="flex items-center space-x-1 space-x-reverse">
              <Link 
                href="/"
                className="flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">الرئيسية</span>
              </Link>
              
              <div className="hidden md:flex items-center space-x-1 space-x-reverse">
                <span className="px-3 py-2 text-sm font-medium text-muted-foreground">
                  |
                </span>
                <Link 
                  href="/ui-demo"
                  className="flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground"
                >
                  <Eye className="w-4 h-4" />
                  <span>معاينة المكونات</span>
                </Link>
              </div>

              {/* Theme Toggle */}
              <div className="mr-4">
                {/* Theme toggle component would go here */}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

      {/* Quick Navigation */}
      <div className="bg-muted/50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-6 space-x-reverse py-3 overflow-x-auto">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              انتقل إلى:
            </span>
            <a 
              href="#basic-ui" 
              className="flex items-center space-x-1 space-x-reverse text-sm hover:text-primary transition-colors whitespace-nowrap"
            >
              <Monitor className="w-3 h-3" />
              <span>المكونات الأساسية</span>
            </a>
            <a 
              href="#forms" 
              className="flex items-center space-x-1 space-x-reverse text-sm hover:text-primary transition-colors whitespace-nowrap"
            >
              <Layout className="w-3 h-3" />
              <span>النماذج والحقول</span>
            </a>
            <a 
              href="#navigation" 
              className="flex items-center space-x-1 space-x-reverse text-sm hover:text-primary transition-colors whitespace-nowrap"
            >
              <Settings className="w-3 h-3" />
              <span>التنقل والهيكل</span>
            </a>
            <a 
              href="#features" 
              className="flex items-center space-x-1 space-x-reverse text-sm hover:text-primary transition-colors whitespace-nowrap"
            >
              <Code className="w-3 h-3" />
              <span>المكونات المتقدمة</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer للمعاينة */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* معلومات المشروع */}
            <div>
              <div className="flex items-center space-x-2 space-x-reverse mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold">منصة شهاداتي</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                منصة شاملة لإصدار وإدارة الشهادات الرقمية مع ميزات متقدمة 
                للأمان والتحقق والمتابعة.
              </p>
            </div>

            {/* Sprint Information */}
            <div>
              <h3 className="font-semibold mb-3">معلومات Sprint 5</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>تحسينات الواجهة والتنبيهات</span>
                </li>
                <li className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>النماذج المحسنة</span>
                </li>
                <li className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>لوحة تحكم المشرفين</span>
                </li>
                <li className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>مكونات المحاضرين</span>
                </li>
              </ul>
            </div>

            {/* روابط مفيدة */}
            <div>
              <h3 className="font-semibold mb-3">روابط مفيدة</h3>
              <div className="space-y-2">
                <Link 
                  href="/ui-demo" 
                  className="flex items-center space-x-2 space-x-reverse text-sm hover:text-primary transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>معاينة المكونات</span>
                </Link>
                <Link 
                  href="/" 
                  className="flex items-center space-x-2 space-x-reverse text-sm hover:text-primary transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>الصفحة الرئيسية</span>
                </Link>
                <Link 
                  href="/(auth)/login" 
                  className="flex items-center space-x-2 space-x-reverse text-sm hover:text-primary transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>تسجيل الدخول</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 منصة شهاداتي - Sprint 5 Demo | تم التطوير باستخدام Next.js و TypeScript
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}