import AccessCodeManagement from '@/components/admin/AccessCodeManagement'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'إدارة رموز الوصول - إدارة شهاداتي',
  description: 'إدارة رموز الوصول والمستخدمين - إنشاء وإدارة وتتبع رموز الوصول',
  keywords: ['رموز وصول', 'مستخدمين', 'إدارة', 'أمان', 'صلاحيات'],
}

export default function AccessCodesPage() {
  return (
    <div className="space-y-6">
      {/* عنوان الصفحة ووصف */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة رموز الوصول</h1>
            <p className="mt-2 text-gray-600">
              إدارة رموز الوصول للمستخدمين والمدربين - إنشاء رموز جديدة، 
              تتبع استخدامها، ومراقبة الصلاحيات
            </p>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
        </div>
      </div>

      {/* نظرة عامة على النظام */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="mr-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              نظام إدارة رموز الوصول
            </h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              يتيح هذا النظام إدارة آمنة لصلاحيات الوصول للمنصة. يمكنك إنشاء رموز وصول 
              خاصة بالمدربين والطلاب، تتبع استخدامها، وإلغاؤها عند الحاجة. النظام يدعم 
              مستويات صلاحيات مختلفة ويوفر سجلات تفصيلية للأنشطة.
            </p>
          </div>
        </div>
      </div>

      {/* عرض مكون إدارة رموز الوصول */}
      <AccessCodeManagement />

      {/* إحصائيات سريعة */}
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
              <p className="text-sm font-medium text-gray-600">الرموز النشطة</p>
              <p className="text-lg font-bold text-gray-900">1,240</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">المستخدمين الجدد</p>
              <p className="text-lg font-bold text-gray-900">89 اليوم</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">منتهية الصلاحية</p>
              <p className="text-lg font-bold text-gray-900">23</p>
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
              <p className="text-sm font-medium text-gray-600">محاولات غير صحيحة</p>
              <p className="text-lg font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* توجيهات الاستخدام */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="mr-3">
            <h3 className="text-sm font-medium text-yellow-800">
              إرشادات الأمان الهامة
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>قم بمراجعة رموز الوصول المنتهية الصلاحية بانتظام</li>
                <li>راقب محاولات الدخول غير الصحيحة وأنشئ تنبيهات أمنية</li>
                <li>استخدم رموز وصول فريدة لكل مستخدم لتتبع الاستخدام</li>
                <li>قم بإلغاء تفعيل الرموز غير المستخدمة لفترة طويلة</li>
                <li>تأكد من قوة كلمات المرور والرمز السري للرموز</li>
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
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="mr-3">
              <h4 className="text-sm font-medium text-gray-900">
                إنشاء رمز جديد
              </h4>
              <p className="text-xs text-gray-500">
                إضافة رمز وصول جديد
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="mr-3">
              <h4 className="text-sm font-medium text-gray-900">
                تقارير الاستخدام
              </h4>
              <p className="text-xs text-gray-500">
                إحصائيات تفصيلية
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
                إعدادات الأمان
              </h4>
              <p className="text-xs text-gray-500">
                تخصيص إعدادات الحماية
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}