import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/student/certificates
 * الحصول على جميع الشهادات الصادرة للطالب
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // التحقق من تسجيل الدخول
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }

    // جلب جميع الشهادات الصادرة للطالب
    const { data: certificates, error } = await supabase
      .from('issued_certificates')
      .select(`
        *,
        certificate_templates (
          id,
          course_name,
          course_description,
          instructor_id,
          profiles!certificate_templates_instructor_id_fkey (
            full_name,
            organization_name
          )
        ),
        certificate_archive (
          id,
          notes,
          is_favorite,
          archived_at
        )
      `)
      .eq('student_id', user.id)
      .order('issued_at', { ascending: false });

    if (error) {
      console.error('Fetch certificates error:', error);
      return NextResponse.json(
        { error: 'فشل جلب الشهادات' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: certificates || [],
    });
  } catch (error) {
    console.error('Get certificates error:', error);
    return NextResponse.json(
      { error: 'خطأ في الخادم' },
      { status: 500 }
    );
  }
}
