/**
 * API Route لسجلات الأرشيف
 * Archive Logs API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { ArchiveLog } from '@/types/archive';
import { filterArchiveLogs, calculateArchiveStats } from '@/lib/utils/archive';

// قاعدة بيانات وهمية لسجلات الأرشيف
let archiveLogsStore: ArchiveLog[] = [];

// بيانات وهمية للسجلات
const mockArchiveLogs: ArchiveLog[] = [
  {
    id: 'log_001',
    operationType: 'archive',
    archiveId: 'archive_001',
    status: 'archived',
    startTime: new Date('2024-01-15T10:30:00Z'),
    endTime: new Date('2024-01-15T10:35:00Z'),
    processedRecords: 150,
    archiveType: 'automatic',
    operatorId: 'system',
    compressionStats: {
      originalSize: 15728640, // 15MB
      compressedSize: 4718592, // 4.5MB
      compressionRatio: 70
    }
  },
  {
    id: 'log_002',
    operationType: 'archive',
    archiveId: 'archive_002',
    status: 'error',
    startTime: new Date('2024-01-16T14:20:00Z'),
    processedRecords: 0,
    archiveType: 'manual',
    operatorId: 'admin_user',
    errorMessage: 'فشل في الاتصال بقاعدة البيانات'
  },
  {
    id: 'log_003',
    operationType: 'restore',
    archiveId: 'archive_001',
    status: 'restored',
    startTime: new Date('2024-01-17T09:15:00Z'),
    endTime: new Date('2024-01-17T09:18:00Z'),
    processedRecords: 50,
    archiveType: 'manual',
    operatorId: 'admin_user'
  },
  {
    id: 'log_004',
    operationType: 'archive',
    archiveId: 'archive_003',
    status: 'archived',
    startTime: new Date('2024-01-18T16:45:00Z'),
    endTime: new Date('2024-01-18T16:52:00Z'),
    processedRecords: 200,
    archiveType: 'automatic',
    operatorId: 'system',
    compressionStats: {
      originalSize: 20971520, // 20MB
      compressedSize: 6291456, // 6MB
      compressionRatio: 70
    }
  },
  {
    id: 'log_005',
    operationType: 'compress',
    archiveId: 'archive_004',
    status: 'archived',
    startTime: new Date('2024-01-19T11:30:00Z'),
    endTime: new Date('2024-01-19T11:35:00Z'),
    processedRecords: 75,
    archiveType: 'manual',
    operatorId: 'admin_user',
    compressionStats: {
      originalSize: 8388608, // 8MB
      compressedSize: 2516582, // 2.4MB
      compressionRatio: 70
    }
  }
];

// تهيئة البيانات الوهمية في الذاكرة
archiveLogsStore = [...mockArchiveLogs];

/**
 * GET - الحصول على سجلات الأرشيف
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const operationType = searchParams.get('operationType');
    const status = searchParams.get('status');
    const operatorId = searchParams.get('operatorId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // معايير التصفية
    const filterCriteria: any = {};

    if (operationType && operationType !== 'all') {
      filterCriteria.operationType = operationType;
    }

    if (status && status !== 'all') {
      filterCriteria.status = status;
    }

    if (operatorId) {
      filterCriteria.operatorId = operatorId;
    }

    if (startDate) {
      filterCriteria.startDate = new Date(startDate);
    }

    if (endDate) {
      filterCriteria.endDate = new Date(endDate);
    }

    // تصفية السجلات
    let filteredLogs = filterArchiveLogs(archiveLogsStore, filterCriteria);

    // ترتيب حسب تاريخ البداية (الأحدث أولاً)
    filteredLogs.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

    // التقسيم إلى صفحات
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    // حساب الإحصائيات
    const stats = calculateArchiveStats([], filteredLogs);

    return NextResponse.json({
      success: true,
      archiveLogs: paginatedLogs,
      totalCount: filteredLogs.length,
      page,
      limit,
      totalPages: Math.ceil(filteredLogs.length / limit),
      stats
    });

  } catch (error) {
    console.error('خطأ في GET /api/archive/logs:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'خطأ في تحميل السجلات' 
      },
      { status: 500 }
    );
  }
}

/**
 * POST - إنشاء سجل جديد (للاختبار)
 */
export async function POST(request: NextRequest) {
  try {
    const logData = await request.json();
    
    // إنشاء سجل جديد
    const newLog: ArchiveLog = {
      id: `log_${Date.now()}`,
      operationType: logData.operationType || 'archive',
      archiveId: logData.archiveId || `archive_${Date.now()}`,
      status: logData.status || 'pending',
      startTime: new Date(),
      processedRecords: logData.processedRecords || 0,
      archiveType: logData.archiveType || 'manual',
      operatorId: logData.operatorId || 'admin_user',
      ...(logData.errorMessage && { errorMessage: logData.errorMessage }),
      ...(logData.compressionStats && { compressionStats: logData.compressionStats })
    };

    // إضافة السجل للمتجر
    archiveLogsStore.push(newLog);

    return NextResponse.json({
      success: true,
      log: newLog,
      message: 'تم إنشاء السجل بنجاح'
    });

  } catch (error) {
    console.error('خطأ في POST /api/archive/logs:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'خطأ في إنشاء السجل' 
      },
      { status: 500 }
    );
  }
}

/**
 * PUT - تحديث سجل موجود
 */
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const logId = searchParams.get('id');

    if (!logId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'معرف السجل مطلوب' 
        },
        { status: 400 }
      );
    }

    const updateData = await request.json();
    
    // البحث عن السجل
    const logIndex = archiveLogsStore.findIndex(log => log.id === logId);
    
    if (logIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'السجل غير موجود' 
        },
        { status: 404 }
      );
    }

    // تحديث السجل
    archiveLogsStore[logIndex] = {
      ...archiveLogsStore[logIndex],
      ...updateData,
      ...(updateData.endTime && { endTime: new Date(updateData.endTime) })
    };

    return NextResponse.json({
      success: true,
      log: archiveLogsStore[logIndex],
      message: 'تم تحديث السجل بنجاح'
    });

  } catch (error) {
    console.error('خطأ في PUT /api/archive/logs:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'خطأ في تحديث السجل' 
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE - حذف سجلات قديمة
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const daysOld = parseInt(searchParams.get('daysOld') || '90');
    const operationType = searchParams.get('operationType');

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    // تحديد السجلات المراد حذفها
    const logsToDelete = archiveLogsStore.filter(log => {
      if (log.startTime < cutoffDate) {
        if (operationType && log.operationType !== operationType) {
          return false;
        }
        return true;
      }
      return false;
    });

    // حذف السجلات
    const remainingLogs = archiveLogsStore.filter(log => {
      return !logsToDelete.some(deleteLog => deleteLog.id === log.id);
    });

    const deletedCount = archiveLogsStore.length - remainingLogs.length;
    archiveLogsStore = remainingLogs;

    return NextResponse.json({
      success: true,
      deletedCount,
      message: `تم حذف ${deletedCount} سجل قديم`
    });

  } catch (error) {
    console.error('خطأ في DELETE /api/archive/logs:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'خطأ في حذف السجلات' 
      },
      { status: 500 }
    );
  }
}