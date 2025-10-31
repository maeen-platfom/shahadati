import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/certificates/[id]/access/[codeId]
 * الحصول على تفاصيل كود وصول
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; codeId: string } }
) {
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

    // جلب الكود مع التحقق من الصلاحيات
    const { data: accessCode, error } = await supabase
      .from('access_codes')
      .select(`
        *,
        certificate_templates!inner(
          id,
          instructor_id,
          course_name
        )
      `)
      .eq('id', params.codeId)
      .eq('template_id', params.id)
      .single();

    if (error || !accessCode) {
      return NextResponse.json(
        { error: 'الكود غير موجود' },
        { status: 404 }
      );
    }

    // التحقق من الصلاحيات
    if (accessCode.certificate_templates.instructor_id !== user.id) {
      return NextResponse.json(
        { error: 'غير مصرح لك بالوصول لهذا الكود' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: accessCode,
    });
  } catch (error) {
    console.error('Get access code error:', error);
    return NextResponse.json(
      { error: 'خطأ في الخادم' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/certificates/[id]/access/[codeId]
 * تحديث إعدادات كود وصول
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; codeId: string } }
) {
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

    // التحقق من الصلاحيات
    const { data: accessCode, error: fetchError } = await supabase
      .from('access_codes')
      .select(`
        *,
        certificate_templates!inner(
          id,
          instructor_id
        )
      `)
      .eq('id', params.codeId)
      .eq('template_id', params.id)
      .single();

    if (fetchError || !accessCode) {
      return NextResponse.json(
        { error: 'الكود غير موجود' },
        { status: 404 }
      );
    }

    if (accessCode.certificate_templates.instructor_id !== user.id) {
      return NextResponse.json(
        { error: 'غير مصرح لك بتعديل هذا الكود' },
        { status: 403 }
      );
    }

    // قراءة البيانات المراد تحديثها
    const body = await request.json();
    const { expires_at, max_uses, is_active } = body;

    // تحديث الكود
    const { data: updatedCode, error: updateError } = await supabase
      .from('access_codes')
      .update({
        expires_at: expires_at !== undefined ? expires_at : accessCode.expires_at,
        max_uses: max_uses !== undefined ? max_uses : accessCode.max_uses,
        is_active: is_active !== undefined ? is_active : accessCode.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.codeId)
      .select()
      .single();

    if (updateError || !updatedCode) {
      return NextResponse.json(
        { error: 'فشل تحديث الكود' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedCode,
    });
  } catch (error) {
    console.error('Update access code error:', error);
    return NextResponse.json(
      { error: 'خطأ في الخادم' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/certificates/[id]/access/[codeId]
 * حذف كود وصول
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; codeId: string } }
) {
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

    // التحقق من الصلاحيات
    const { data: accessCode, error: fetchError } = await supabase
      .from('access_codes')
      .select(`
        *,
        certificate_templates!inner(
          id,
          instructor_id
        )
      `)
      .eq('id', params.codeId)
      .eq('template_id', params.id)
      .single();

    if (fetchError || !accessCode) {
      return NextResponse.json(
        { error: 'الكود غير موجود' },
        { status: 404 }
      );
    }

    if (accessCode.certificate_templates.instructor_id !== user.id) {
      return NextResponse.json(
        { error: 'غير مصرح لك بحذف هذا الكود' },
        { status: 403 }
      );
    }

    // حذف الكود
    const { error: deleteError } = await supabase
      .from('access_codes')
      .delete()
      .eq('id', params.codeId);

    if (deleteError) {
      return NextResponse.json(
        { error: 'فشل حذف الكود' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم حذف الكود بنجاح',
    });
  } catch (error) {
    console.error('Delete access code error:', error);
    return NextResponse.json(
      { error: 'خطأ في الخادم' },
      { status: 500 }
    );
  }
}
