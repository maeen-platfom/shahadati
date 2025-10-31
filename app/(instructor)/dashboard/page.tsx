import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Plus, FileText, Award, Calendar } from 'lucide-react';
import TemplateCard from '@/components/instructor/TemplateCard';

export default async function InstructorDashboard() {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  // الحصول على ملف المستخدم
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, organization_name, total_certificates_created')
    .eq('id', userId)
    .single();

  // الحصول على القوالب
  const { data: templates, count } = await supabase
    .from('certificate_templates')
    .select('*, template_fields(count)', { count: 'exact' })
    .eq('instructor_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  // إحصائيات
  const activeTemplates = templates?.length || 0;
  const totalIssued = templates?.reduce((sum, t) => sum + (t.total_issued || 0), 0) || 0;

  // القوالب الأخيرة (آخر 7 أيام)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentTemplates = templates?.filter(
    (t) => new Date(t.created_at) > sevenDaysAgo
  ).length || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          مرحباً، {profile?.full_name || 'المحاضر'}
        </h2>
        {profile?.organization_name && (
          <p className="text-gray-600">{profile.organization_name}</p>
        )}
      </div>

      {/* إحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FileText className="text-indigo-600" size={24} />
            </div>
            <span className="text-3xl font-bold text-indigo-600">{activeTemplates}</span>
          </div>
          <h3 className="text-gray-900 font-semibold">القوالب النشطة</h3>
          <p className="text-sm text-gray-600">إجمالي القوالب المتاحة</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="text-green-600" size={24} />
            </div>
            <span className="text-3xl font-bold text-green-600">{totalIssued}</span>
          </div>
          <h3 className="text-gray-900 font-semibold">الشهادات المُصدرة</h3>
          <p className="text-sm text-gray-600">من جميع القوالب</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-purple-600" size={24} />
            </div>
            <span className="text-3xl font-bold text-purple-600">{recentTemplates}</span>
          </div>
          <h3 className="text-gray-900 font-semibold">القوالب الأخيرة</h3>
          <p className="text-sm text-gray-600">آخر 7 أيام</p>
        </div>
      </div>

      {/* زر إنشاء قالب جديد */}
      <div className="mb-8">
        <Link
          href="/certificates/new"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg font-bold text-lg"
        >
          <Plus size={24} />
          إنشاء شهادة جديدة
        </Link>
      </div>

      {/* قائمة القوالب */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">قوالب الشهادات</h3>
        
        {templates && templates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-xl shadow-md text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-gray-400" size={40} />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              لم تقم بإنشاء أي قوالب بعد
            </h4>
            <p className="text-gray-600 mb-6">
              ابدأ بإنشاء أول قالب شهادة وابدأ في إصدار شهادات احترافية
            </p>
            <Link
              href="/certificates/new"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <Plus size={20} />
              إنشاء أول قالب
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
