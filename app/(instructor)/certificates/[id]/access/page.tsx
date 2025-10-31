import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AccessCodeGenerator from '@/components/instructor/AccessCodeGenerator';

export default async function AccessCodePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  // التحقق من تسجيل الدخول
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect('/login');
  }

  // جلب معلومات القالب
  const { data: template, error: templateError } = await supabase
    .from('certificate_templates')
    .select('id, instructor_id, course_name, status')
    .eq('id', params.id)
    .single();

  if (templateError || !template) {
    redirect('/dashboard');
  }

  // التحقق من الصلاحيات
  if (template.instructor_id !== user.id) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            العودة
          </button>

          <h1 className="text-3xl font-bold text-gray-900">إنشاء كود وصول</h1>
          <p className="text-gray-600 mt-2">
            قم بإنشاء كود وصول فريد لمشاركته مع الطلاب للحصول على شهاداتهم
          </p>
        </div>

        {/* بطاقة التوليد */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <AccessCodeGenerator templateId={template.id} courseName={template.course_name} />
        </div>

        {/* ملاحظة أمنية */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="font-semibold text-yellow-900 mb-1">ملاحظة أمنية</h4>
              <p className="text-sm text-yellow-800">
                لا تشارك الكود السري علناً. شاركه فقط مع الطلاب المسجلين في الدورة.
                يمكنك مشاركة الرابط علناً، ولكن احتفظ بالكود السري للمشاركين فقط.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
