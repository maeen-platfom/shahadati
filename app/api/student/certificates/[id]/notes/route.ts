import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * PUT /api/student/certificates/[id]/notes
 * تحديث ملاحظات شهادة
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const body = await request.json();
    const { notes } = body;

    // البحث عن السجل في الأرشيف
    const { data: archiveRecord, error: fetchError } = await supabase
      .from('certificate_archive')
      .select('*')
      .eq('certificate_id', params.id)
      .eq('student_id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Fetch archive error:', fetchError);
      return NextResponse.json(
        { error: 'فشل جلب معلومات الشهادة' },
        { status: 500 }
      );
    }

    // إذا لم يوجد سجل، نقوم بإنشائه
    if (!archiveRecord) {
      const { data: newArchive, error: insertError } = await supabase
        .from('certificate_archive')
        .insert({
          student_id: user.id,
          certificate_id: params.id,
          is_favorite: false,
          notes: notes || '',
        })
        .select()
        .single();

      if (insertError || !newArchive) {
        console.error('Insert archive error:', insertError);
        return NextResponse.json(
          { error: 'فشل إضافة الملاحظات' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: newArchive,
      });
    }

    // تحديث السجل الموجود
    const { data: updatedArchive, error: updateError } = await supabase
      .from('certificate_archive')
      .update({ notes: notes || '' })
      .eq('id', archiveRecord.id)
      .select()
      .single();

    if (updateError || !updatedArchive) {
      console.error('Update archive error:', updateError);
      return NextResponse.json(
        { error: 'فشل تحديث الملاحظات' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedArchive,
    });
  } catch (error) {
    console.error('Update notes error:', error);
    return NextResponse.json(
      { error: 'خطأ في الخادم' },
      { status: 500 }
    );
  }
}
