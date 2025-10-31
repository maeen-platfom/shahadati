import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/cert/generate
 * استدعاء Edge Function لتوليد الشهادة
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { access_code_id, template_id, student_name, student_email } = body;

    if (!access_code_id || !template_id || !student_name) {
      return NextResponse.json(
        { error: 'البيانات المطلوبة ناقصة' },
        { status: 400 }
      );
    }

    // الحصول على session token للمستخدم (إذا كان مسجلاً)
    const { data: { session } } = await supabase.auth.getSession();

    // استدعاء Edge Function
    const { data, error } = await supabase.functions.invoke('generate-certificate', {
      body: {
        access_code_id,
        template_id,
        student_name,
        student_email,
      },
      headers: session?.access_token ? {
        Authorization: `Bearer ${session.access_token}`,
      } : undefined,
    });

    if (error) {
      console.error('Edge function error:', error);
      return NextResponse.json(
        { error: 'فشل إصدار الشهادة' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data,
    });
  } catch (error) {
    console.error('Generate certificate error:', error);
    return NextResponse.json(
      { error: 'خطأ في الخادم' },
      { status: 500 }
    );
  }
}
