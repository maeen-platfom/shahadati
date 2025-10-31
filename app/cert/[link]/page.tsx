import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import CertificateForm from '@/components/student/CertificateForm';

export default async function CertificatePage({ params }: { params: { link: string } }) {
  const supabase = await createClient();

    // جلب معلومات الكود الأساسية (بدون التحقق من الكود السري)
  const { data: accessCode, error } = await supabase
    .from('access_codes')
    .select(`
      id,
      is_active,
      expires_at,
      max_uses,
      current_uses,
      certificate_templates!inner (
        id,
        course_name,
        course_description
      )
    `)
    .eq('unique_link', params.link)
    .single();

  if (error || !accessCode) {
    notFound();
  }

  // استخراج معلومات القالب
  const template = Array.isArray(accessCode.certificate_templates)
    ? accessCode.certificate_templates[0]
    : accessCode.certificate_templates;

  // التحقق من حالة الكود
  if (!accessCode.is_active) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">الكود غير نشط</h1>
          <p className="text-gray-600">هذا الرابط غير متاح حالياً. يرجى التواصل مع المحاضر.</p>
        </div>
      </div>
    );
  }

  // التحقق من انتهاء الصلاحية
  if (accessCode.expires_at && new Date(accessCode.expires_at) < new Date()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">انتهت صلاحية الرابط</h1>
          <p className="text-gray-600">انتهت صلاحية هذا الرابط. يرجى التواصل مع المحاضر للحصول على رابط جديد.</p>
        </div>
      </div>
    );
  }

  // التحقق من عدد الاستخدامات
  if (accessCode.max_uses && accessCode.current_uses >= accessCode.max_uses) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">تم استنفاذ الاستخدامات</h1>
          <p className="text-gray-600">تم استنفاذ جميع الاستخدامات المسموحة لهذا الرابط. يرجى التواصل مع المحاضر.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {template?.course_name}
          </h1>
          {template?.course_description && (
            <p className="text-gray-600">
              {template.course_description}
            </p>
          )}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">احصل على شهادتك الآن</h2>
            <p className="text-gray-600">
              أدخل بياناتك والكود السري الذي تلقيته من المحاضر للحصول على شهادتك
            </p>
          </div>

          <CertificateForm link={params.link} />
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            مدعوم بواسطة <span className="font-semibold text-teal-600">شهاداتي</span>
          </p>
        </div>
      </div>
    </div>
  );
}
