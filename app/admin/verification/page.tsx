'use client'

import VerificationTracking from '@/components/admin/VerificationTracking'

export default function VerificationPage() {
  return (
    <div className="space-y-6">
      {/* عنوان الصفحة ووصف */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">تتبع التحققات</h1>
            <p className="mt-2 text-gray-600">
              مراقبة وتتبع عمليات التحقق من الشهادات - تحليلات الأمان والحماية 
              من التلاعب والتزوير
            </p>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* نظرة عامة على الأمان */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="mr-4">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              نظام الحماية والتحقق المتقدم
            </h3>
            <p className="text-red-800 text-sm leading-relaxed">
              يوفر نظام تتبع التحققات حماية شاملة ضد الشهادات المزورة والمتلاعب بها. 
              يتم التحقق من صحة كل شهادة من خلال تقنيات متقدمة تشمل التوقيع الرقمي، 
              الرموز الفريدة، وإدارة الصيرورة الآمنة.
            </p>
          </div>
        </div>
      </div>

      {/* إحصائيات الأمان السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">تحققات ناجحة</p>
              <p className="text-lg font-bold text-gray-900">12,847</p>
              <p className="text-xs text-green-600">99.2% من الإجمالي</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">تحققات فاشلة</p>
              <p className="text-lg font-bold text-gray-900">103</p>
              <p className="text-xs text-red-600">0.8% من الإجمالي</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">محاولات مشبوهة</p>
              <p className="text-lg font-bold text-gray-900">17</p>
              <p className="text-xs text-yellow-600">تحتاج مراجعة</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">متوسط وقت التحقق</p>
              <p className="text-lg font-bold text-gray-900">0.8 ثانية</p>
              <p className="text-xs text-blue-600">أداء ممتاز</p>
            </div>
          </div>
        </div>
      </div>

      {/* عرض مكون تتبع التحققات */}
      <VerificationTracking />

      {/* تحليل أمان مفصل */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">تحليل الأمان التفصيلي</h3>
          <span className="text-sm text-gray-500">آخر 7 أيام</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-semibold text-green-800 mb-2">مستوى الأمان</h4>
            <div className="flex items-center">
              <div className="flex-1 bg-green-200 rounded-full h-2 ml-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
              <span className="text-sm font-bold text-green-800">95%</span>
            </div>
            <p className="text-xs text-green-600 mt-1">حماية ممتازة</p>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">دقة التحقق</h4>
            <div className="flex items-center">
              <div className="flex-1 bg-blue-200 rounded-full h-2 ml-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '99.2%' }}></div>
              </div>
              <span className="text-sm font-bold text-blue-800">99.2%</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">دقة عالية</p>
          </div>
          
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="text-sm font-semibold text-purple-800 mb-2">سرعة الاستجابة</h4>
            <div className="flex items-center">
              <div className="flex-1 bg-purple-200 rounded-full h-2 ml-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
              <span className="text-sm font-bold text-purple-800">92%</span>
            </div>
            <p className="text-xs text-purple-600 mt-1">أداء سريع</p>
          </div>
        </div>
      </div>

      {/* مستويات الحماية */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">مستويات الحماية</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-green-500 rounded-full ml-3"></div>
              <span className="text-sm font-medium text-green-800">التوقيع الرقمي</span>
            </div>
            <span className="text-sm text-green-600">مفعل ✅</span>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-green-500 rounded-full ml-3"></div>
              <span className="text-sm font-medium text-green-800">الرموز الفريدة</span>
            </div>
            <span className="text-sm text-green-600">مفعل ✅</span>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-green-500 rounded-full ml-3"></div>
              <span className="text-sm font-medium text-green-800">تشفير البيانات</span>
            </div>
            <span className="text-sm text-green-600">مفعل ✅</span>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-green-500 rounded-full ml-3"></div>
              <span className="text-sm font-medium text-green-800">مراجعة قاعدة البيانات</span>
            </div>
            <span className="text-sm text-green-600">مفعل ✅</span>
          </div>
        </div>
      </div>

      {/* إرشادات الأمان */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="mr-3">
            <h3 className="text-sm font-medium text-yellow-800">
              مؤشرات الأمان المهمة
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>راقب محاولات التحقق المشبوهة وأي أنماط غير طبيعية</li>
                <li>تأكد من تحديث أنظمة التشفير والحماية بانتظام</li>
                <li>قم بمراجعة الشهادات المشكوك فيها فوراً</li>
                <li>استخدم التحليلات المتقدمة لاكتشاف التهديدات الجديدة</li>
                <li>تابع أداء النظام وتأكد من عدم وجود تأخير في التحققات</li>
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
                تقرير أمني شامل
              </h4>
              <p className="text-xs text-gray-500">
                تحميل تقرير مفصل
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="mr-3">
              <h4 className="text-sm font-medium text-gray-900">
                إعدادات الأمان
              </h4>
              <p className="text-xs text-gray-500">
                تخصيص مستويات الحماية
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.122 2.122" />
              </svg>
            </div>
            <div className="mr-3">
              <h4 className="text-sm font-medium text-gray-900">
                تحليل التهديدات
              </h4>
              <p className="text-xs text-gray-500">
                تقييم المخاطر الأمنية
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* معلومات تقنية */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="mr-3">
            <h3 className="text-sm font-medium text-gray-800">
              معلومات تقنية عن نظام التحقق
            </h3>
            <div className="mt-2 text-sm text-gray-600">
              <ul className="list-disc list-inside space-y-1">
                <li><strong>خوارزمية التشفير:</strong> RSA 4096-bit مع SHA-256</li>
                <li><strong>قاعدة البيانات:</strong> PostgreSQL مع تشفير شامل</li>
                <li><strong>التحقق الفوري:</strong> أقل من ثانية واحدة لكل عملية</li>
                <li><strong>السجلات الآمنة:</strong> حفظ في نظام مراقب ومشفّر</li>
                <li><strong>النسخ الاحتياطية:</strong> يتم أخذها كل 6 ساعات</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}