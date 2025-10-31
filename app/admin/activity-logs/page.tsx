'use client'

import ActivityLogs from '@/components/admin/ActivityLogs'

export default function ActivityLogsPage() {
  return (
    <div className="space-y-6">
      {/* عنوان الصفحة ووصف */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">سجلات الأنشطة</h1>
            <p className="mt-2 text-gray-600">
              مراجعة وتتبع جميع الأنشطة والعمليات في النظام - سجلات شاملة للمراقبة والأمان
            </p>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* نظرة عامة على النظام */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="mr-4">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              نظام مراقبة الأنشطة المتقدم
            </h3>
            <p className="text-purple-800 text-sm leading-relaxed">
              يوفر نظام سجلات الأنشطة مراقبة شاملة لجميع العمليات في النظام، 
              بما في ذلك تسجيل دخول المستخدمين، إنشاء وتحرير الشهادات، 
              وأي أنشطة أخرى مهمة للأمان والإدارة.
            </p>
          </div>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">إجمالي الأنشطة</p>
              <p className="text-lg font-bold text-gray-900">48,392</p>
              <p className="text-xs text-blue-600">آخر 30 يوم</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">عمليات تسجيل دخول</p>
              <p className="text-lg font-bold text-gray-900">12,847</p>
              <p className="text-xs text-green-600">نجاح: 98.2%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">عمليات إنشاء</p>
              <p className="text-lg font-bold text-gray-900">5,639</p>
              <p className="text-xs text-orange-600">شهادات جديدة</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">محاولات مشبوهة</p>
              <p className="text-lg font-bold text-gray-900">23</p>
              <p className="text-xs text-red-600">تحتاج مراجعة</p>
            </div>
          </div>
        </div>
      </div>

      {/* عرض مكون سجلات الأنشطة */}
      <ActivityLogs />

      {/* تحليل الأنشطة الأخيرة */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">تحليل الأنشطة الحديثة</h3>
          <span className="text-sm text-gray-500">آخر 24 ساعة</span>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-500 rounded-full ml-3"></div>
              <span className="text-sm font-medium text-green-800">نشاط طبيعي</span>
            </div>
            <span className="text-sm text-green-600">94.2% من الأنشطة</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-yellow-500 rounded-full ml-3"></div>
              <span className="text-sm font-medium text-yellow-800">محاولات فاشلة</span>
            </div>
            <span className="text-sm text-yellow-600">4.8% من الأنشطة</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-red-500 rounded-full ml-3"></div>
              <span className="text-sm font-medium text-red-800">أنشطة مشبوهة</span>
            </div>
            <span className="text-sm text-red-600">1.0% من الأنشطة</span>
          </div>
        </div>
      </div>

      {/* إرشادات الأمان */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="mr-3">
            <h3 className="text-sm font-medium text-red-800">
              مؤشرات الأمان والتنبيه
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <ul className="list-disc list-inside space-y-1">
                <li>تحقق من الأنشطة المشبوهة بانتظام وتابع المصادر</li>
                <li>راقب محاولات تسجيل الدخول من مواقع غير معتادة</li>
                <li>تابع التغييرات غير المصرح بها في إعدادات النظام</li>
                <li>قم بمراجعة السجلات يومياً لضمان الأمان المستمر</li>
                <li>استخدم الفلاتر للعثور على أنشطة محددة بسرعة</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* أزرار التنقل السريع */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="mr-3">
              <h4 className="text-sm font-medium text-gray-900">
                تصدير السجلات
              </h4>
              <p className="text-xs text-gray-500">
                تحميل ملف CSV أو PDF
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="mr-3">
              <h4 className="text-sm font-medium text-gray-900">
                تحليل الأمان
              </h4>
              <p className="text-xs text-gray-500">
                تقرير أمان شامل
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="mr-3">
              <h4 className="text-sm font-medium text-gray-900">
                إعدادات التنبيه
              </h4>
              <p className="text-xs text-gray-500">
                تخصيص الإشعارات
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* نصائح للاستخدام الأمثل */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="mr-3">
            <h3 className="text-sm font-medium text-gray-800">
              أفضل الممارسات للمراقبة
            </h3>
            <div className="mt-2 text-sm text-gray-600">
              <ul className="list-disc list-inside space-y-1">
                <li>قم بمراجعة السجلات يومياً في أوقات محددة</li>
                <li>استخدم الفلاتر الزمنية لمتابعة الأنشطة في فترات معينة</li>
                <li>اتبع المؤشرات والأنماط غير العادية في الاستخدام</li>
                <li>احتفظ بنسخ احتياطية من السجلات المهمة</li>
                <li>استخدم البحث المتقدم للعثور على معلومات محددة</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}