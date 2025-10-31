/**
 * API Route لإعدادات الأرشيف
 * Archive Settings API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { ArchiveSettings, DEFAULT_ARCHIVE_SETTINGS } from '@/types/archive';
import { validateArchiveSettings } from '@/lib/utils/archive';

// قاعدة بيانات وهمية للإعدادات
let archiveSettingsStore: ArchiveSettings = DEFAULT_ARCHIVE_SETTINGS;

/**
 * GET - الحصول على إعدادات الأرشيف
 */
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      settings: archiveSettingsStore
    });
  } catch (error) {
    console.error('خطأ في GET /api/archive/settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'خطأ في تحميل الإعدادات' 
      },
      { status: 500 }
    );
  }
}

/**
 * PUT - تحديث إعدادات الأرشيف
 */
export async function PUT(request: NextRequest) {
  try {
    const newSettings = await request.json();
    
    // التحقق من صحة الإعدادات
    const validation = validateArchiveSettings(newSettings);
    
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'إعدادات غير صحيحة',
          validationErrors: validation.errors
        },
        { status: 400 }
      );
    }

    // دمج الإعدادات الجديدة مع الحالية
    const updatedSettings = {
      ...archiveSettingsStore,
      ...newSettings
    };

    // حفظ الإعدادات (في التطبيق الحقيقي ستكون قاعدة بيانات)
    archiveSettingsStore = updatedSettings;

    return NextResponse.json({
      success: true,
      settings: archiveSettingsStore,
      message: 'تم حفظ الإعدادات بنجاح'
    });

  } catch (error) {
    console.error('خطأ في PUT /api/archive/settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'خطأ في حفظ الإعدادات' 
      },
      { status: 500 }
    );
  }
}

/**
 * POST - إعادة تعيين الإعدادات للافتراضية
 */
export async function POST() {
  try {
    archiveSettingsStore = { ...DEFAULT_ARCHIVE_SETTINGS };
    
    return NextResponse.json({
      success: true,
      settings: archiveSettingsStore,
      message: 'تم إعادة تعيين الإعدادات بنجاح'
    });

  } catch (error) {
    console.error('خطأ في POST /api/archive/settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'خطأ في إعادة تعيين الإعدادات' 
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE - حذف جميع الإعدادات المخصصة
 */
export async function DELETE() {
  try {
    archiveSettingsStore = { ...DEFAULT_ARCHIVE_SETTINGS };
    
    return NextResponse.json({
      success: true,
      message: 'تم حذف جميع الإعدادات المخصصة'
    });

  } catch (error) {
    console.error('خطأ في DELETE /api/archive/settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'خطأ في حذف الإعدادات' 
      },
      { status: 500 }
    );
  }
}