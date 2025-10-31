import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // التحقق من أن المستخدم محاضر
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'instructor') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">ش</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">لوحة تحكم المحاضر</h1>
                <p className="text-sm text-gray-600">إدارة قوالب الشهادات</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                الصفحة الرئيسية
              </a>
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-red-600 hover:text-red-700 transition-colors font-medium"
                >
                  تسجيل خروج
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
