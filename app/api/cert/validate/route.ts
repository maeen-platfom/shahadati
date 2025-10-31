import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/cert/validate
 * التحقق من صحة الكود والحصول على معلومات القالب
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { link, code } = body;

    if (!link || !code) {
      return NextResponse.json(
        { error: 'الرابط والكود مطلوبان' },
        { status: 400 }
      );
    }

    // البحث عن الكود باستخدام الرابط الفريد
    const { data: accessCode, error: codeError } = await supabase
      .from('access_codes')
      .select(`
        *,
        certificate_templates (
          id,
          course_name,
          course_description,
          template_file_url,
          instructor_id,
          profiles!certificate_templates_instructor_id_fkey (
            full_name,
            organization_name
          )
        )
      `)
      .eq('unique_link', link)
      .single();

    if (codeError || !accessCode) {
      return NextResponse.json(
        { error: 'الرابط غير صحيح' },
        { status: 404 }
      );
    }

    // التحقق من صحة الكود (case-insensitive)
    if (accessCode.code.toUpperCase() !== code.toUpperCase()) {
      return NextResponse.json(
        { error: 'الكود السري غير صحيح' },
        { status: 401 }
      );
    }

    // التحقق من حالة الكود
    if (!accessCode.is_active) {
      return NextResponse.json(
        { error: 'الكود غير نشط' },
        { status: 403 }
      );
    }

    // التحقق من انتهاء الصلاحية
    if (accessCode.expires_at && new Date(accessCode.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'انتهت صلاحية الكود' },
        { status: 403 }
      );
    }

    // التحقق من عدد الاستخدامات
    if (accessCode.max_uses && accessCode.current_uses >= accessCode.max_uses) {
      return NextResponse.json(
        { error: 'تم استنفاذ جميع الاستخدامات المسموحة لهذا الكود' },
        { status: 403 }
      );
    }

    // جلب الحقول المطلوبة للشهادة
    const { data: fields, error: fieldsError } = await supabase
      .from('template_fields')
      .select('*')
      .eq('template_id', accessCode.template_id)
      .order('display_order', { ascending: true });

    if (fieldsError) {
      console.error('Fields error:', fieldsError);
    }

    return NextResponse.json({
      success: true,
      data: {
        access_code_id: accessCode.id,
        template_id: accessCode.template_id,
        course_name: accessCode.certificate_templates.course_name,
        course_description: accessCode.certificate_templates.course_description,
        instructor_name: accessCode.certificate_templates.profiles?.full_name,
        organization_name: accessCode.certificate_templates.profiles?.organization_name,
        template_file_url: accessCode.certificate_templates.template_file_url,
        fields: fields || [],
      },
    });
  } catch (error) {
    console.error('Validate code error:', error);
    return NextResponse.json(
      { error: 'خطأ في الخادم' },
      { status: 500 }
    );
  }
}
