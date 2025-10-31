import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateAccessCode, generateUniqueLink } from '@/lib/utils/codeGenerator';

/**
 * POST /api/certificates/[id]/access/generate
 * توليد كود وصول جديد لقالب شهادة
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const templateId = params.id;

    // التحقق من تسجيل الدخول
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }

    // التحقق من أن المستخدم هو صاحب القالب
    const { data: template, error: templateError } = await supabase
      .from('certificate_templates')
      .select('id, instructor_id, course_name')
      .eq('id', templateId)
      .single();

    if (templateError || !template) {
      return NextResponse.json(
        { error: 'القالب غير موجود' },
        { status: 404 }
      );
    }

    if (template.instructor_id !== user.id) {
      return NextResponse.json(
        { error: 'غير مصرح لك بإنشاء أكواد لهذا القالب' },
        { status: 403 }
      );
    }

    // قراءة بيانات الطلب
    const body = await request.json();
    const { expires_at, max_uses } = body;

    // توليد كود ورابط فريدين
    let code = generateAccessCode(8);
    let uniqueLink = generateUniqueLink(12);
    let attempts = 0;
    const maxAttempts = 5;

    // التأكد من عدم تكرار الكود أو الرابط
    while (attempts < maxAttempts) {
      const { data: existingCode } = await supabase
        .from('access_codes')
        .select('id')
        .or(`code.eq.${code},unique_link.eq.${uniqueLink}`)
        .single();

      if (!existingCode) break;

      code = generateAccessCode(8);
      uniqueLink = generateUniqueLink(12);
      attempts++;
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json(
        { error: 'فشل توليد كود فريد، يرجى المحاولة مرة أخرى' },
        { status: 500 }
      );
    }

    // إنشاء الكود في قاعدة البيانات
    const { data: accessCode, error: insertError } = await supabase
      .from('access_codes')
      .insert({
        template_id: templateId,
        code: code,
        unique_link: uniqueLink,
        expires_at: expires_at || null,
        max_uses: max_uses || null,
        current_uses: 0,
        is_active: true,
      })
      .select()
      .single();

    if (insertError || !accessCode) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { error: 'فشل إنشاء الكود' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: accessCode,
    });
  } catch (error) {
    console.error('Generate access code error:', error);
    return NextResponse.json(
      { error: 'خطأ في الخادم' },
      { status: 500 }
    );
  }
}
