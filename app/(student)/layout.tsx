import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // التحقق من تسجيل الدخول
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  return <>{children}</>;
}
