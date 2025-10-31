import TemplateManagement from '@/components/admin/TemplateManagement'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'إدارة القوالب - إدارة شهاداتي',
  description: 'إدارة قوالب الشهادات - إنشاء وتحرير ومتابعة استخدام القوالب',
  keywords: ['قوالب', 'شهادات', 'إدارة', 'تحرير', 'إنشاء'],
}

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      {/* عنوان الصفحة ووصف */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة القوالب</h1>
            <p className="mt-2 text-gray-600">
              قم بإدارة قوالب الشهادات المتاحة في النظام - إنشاء قوالب جديدة، 
              تحرير الموجودة، ومراقبة استخدامها
            </p>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* إرشادات الاستخدام */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="mr-3">
            <h3 className="text-sm font-medium text-blue-800">
              إرشادات استخدام إدارة القوالب
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>استخدم شريط البحث للعثور على القوالب بسرعة</li>
                <li>استخدم الفلاتر لتصنيف القوالب حسب النوع أو الحالة</li>
                <li>قم بمراجعة إحصائيات الاستخدام لتحسين الفعالية</li>
                <li>تأكد من مراجعة القوالب قبل نشرها للطلاب</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* عرض مكون إدارة القوالب */}
      <TemplateManagement />

      {/* أزرار التنقل السريع */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="mr-3">
              <h4 className="text-sm font-medium text-gray-900">
                إنشاء قالب جديد
              </h4>
              <p className="text-xs text-gray-500">
                إضافة قالب شهادة جديد
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
                تحليل الأداء
              </h4>
              <p className="text-xs text-gray-500">
                إحصائيات استخدام القوالب
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
                إعدادات القوالب
              </h4>
              <p className="text-xs text-gray-500">
                تخصيص الإعدادات العامة
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* معلومات إضافية */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="mr-3">
            <h3 className="text-sm font-medium text-gray-800">
              نصائح مهمة
            </h3>
            <div className="mt-2 text-sm text-gray-600">
              <ul className="list-disc list-inside space-y-1">
                <li>احرص على تسمية القوالب بأسماء واضحة ومفهومة</li>
                <li>استخدم أوصاف مفصلة لتسهيل عملية البحث والفرز</li>
                <li>تأكد من أن جميع الحقول المطلوبة محددة بشكل صحيح</li>
                <li>قم بمراجعة القوالب بانتظام وتحديثها حسب الحاجة</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}