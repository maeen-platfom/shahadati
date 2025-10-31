/**
 * دوال الأدوات المساعدة لنظام الأرشيف
 * Archive System Utility Functions
 */

import { 
  ArchivedFile, 
  ArchiveLog, 
  ArchiveSettings, 
  ArchiveStats, 
  ArchiveSearchCriteria, 
  ArchiveSearchResults,
  ArchiveOperationResult,
  RestoreOperationResult,
  BackupInfo,
  CompressionOptions,
  ArchiveDatabaseQuery
} from '@/types/archive';

// الإعدادات الافتراضية للأرشيف
export const DEFAULT_ARCHIVE_SETTINGS: ArchiveSettings = {
  autoArchiveEnabled: false,
  archiveAfterDays: 365,
  compressionLevel: 'medium',
  retentionPeriod: 2555, // 7 سنوات
  backupEnabled: true,
  notificationEnabled: true,
  allowedFileTypes: ['pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx'],
  maxArchiveSize: 1024 * 1024 * 1024 // 1GB
};

/**
 * حساب تاريخ الأرشيف التلقائي
 * Calculate auto-archive date
 */
export function calculateAutoArchiveDate(
  createDate: Date, 
  archiveAfterDays: number = 365
): Date {
  const archiveDate = new Date(createDate);
  archiveDate.setDate(archiveDate.getDate() + archiveAfterDays);
  return archiveDate;
}

/**
 * تحديد ما إذا كانت البيانات تحتاج أرشفة
 * Determine if data needs archiving
 */
export function needsArchiving(
  createDate: Date, 
  settings: ArchiveSettings = DEFAULT_ARCHIVE_SETTINGS
): boolean {
  const archiveDate = calculateAutoArchiveDate(createDate, settings.archiveAfterDays);
  return new Date() >= archiveDate;
}

/**
 * حساب حجم الملف المنسق
 * Calculate formatted file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * حساب نسبة الضغط
 * Calculate compression ratio
 */
export function calculateCompressionRatio(
  originalSize: number, 
  compressedSize: number
): number {
  if (originalSize === 0) return 0;
  return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}

/**
 * إنشاء اسم ملف مؤرشف
 * Generate archived file name
 */
export function generateArchiveFileName(
  dataType: string, 
  recordId: string, 
  archiveDate: Date
): string {
  const dateStr = archiveDate.toISOString().split('T')[0];
  const timestamp = Date.now();
  return `${dataType}_${recordId}_${dateStr}_${timestamp}.archive`;
}

/**
 * التحقق من صحة إعدادات الأرشيف
 * Validate archive settings
 */
export function validateArchiveSettings(settings: ArchiveSettings): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (settings.archiveAfterDays < 30) {
    errors.push('يجب أن تكون فترة الأرشيف 30 يوماً على الأقل');
  }

  if (settings.retentionPeriod < settings.archiveAfterDays) {
    errors.push('فترة الاحتفاظ يجب أن تكون أطول من فترة الأرشيف');
  }

  if (settings.maxArchiveSize < 1024 * 1024) {
    errors.push('حجم الأرشيف الأقصى يجب أن يكون 1 ميجابايت على الأقل');
  }

  if (settings.allowedFileTypes.length === 0) {
    errors.push('يجب تحديد أنواع الملفات المسموحة');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * فلترة السجلات حسب المعايير
 * Filter records by criteria
 */
export function filterArchiveLogs(
  logs: ArchiveLog[], 
  criteria: {
    startDate?: Date;
    endDate?: Date;
    operationType?: string;
    status?: string;
  }
): ArchiveLog[] {
  return logs.filter(log => {
    if (criteria.startDate && log.startTime < criteria.startDate) {
      return false;
    }

    if (criteria.endDate && log.startTime > criteria.endDate) {
      return false;
    }

    if (criteria.operationType && log.operationType !== criteria.operationType) {
      return false;
    }

    if (criteria.status && log.status !== criteria.status) {
      return false;
    }

    return true;
  });
}

/**
 * حساب إحصائيات الأرشيف
 * Calculate archive statistics
 */
export function calculateArchiveStats(
  archivedFiles: ArchivedFile[],
  logs: ArchiveLog[]
): ArchiveStats {
  const totalFiles = archivedFiles.length;
  const totalSize = archivedFiles.reduce((sum, file) => sum + file.fileSize, 0);
  const compressedSize = archivedFiles.reduce((sum, file) => {
    return sum + (file.fileSize * (1 - file.compressionRatio / 100));
  }, 0);

  const averageCompressionRatio = totalFiles > 0 
    ? archivedFiles.reduce((sum, file) => sum + file.compressionRatio, 0) / totalFiles
    : 0;

  // حساب متوسط وقت الأرشفة
  const completedLogs = logs.filter(log => log.endTime && log.status === 'archived');
  const averageArchivalTime = completedLogs.length > 0
    ? completedLogs.reduce((sum, log) => {
        return sum + (log.endTime!.getTime() - log.startTime.getTime()) / 1000;
      }, 0) / completedLogs.length
    : 0;

  // تحديد نوع البيانات الأكثر أرشفة
  const typeCounts = archivedFiles.reduce((acc, file) => {
    acc[file.dataType] = (acc[file.dataType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostArchivedType = Object.entries(typeCounts).reduce((a, b) => 
    typeCounts[a[0]] > typeCounts[b[0]] ? a : b, ['certificate', 0]
  )[0];

  // تحديد أحدث وأقدم تواريخ الأرشفة
  const sortedFiles = [...archivedFiles].sort((a, b) => 
    a.archivedAt.getTime() - b.archivedAt.getTime()
  );

  return {
    totalArchivedFiles: totalFiles,
    totalArchiveSize: totalSize,
    totalCompressedSize: compressedSize,
    totalCompressionRatio: averageCompressionRatio,
    averageArchivalTime,
    mostArchivedDataType: mostArchivedType as any,
    oldestArchiveDate: sortedFiles[0]?.archivedAt,
    newestArchiveDate: sortedFiles[sortedFiles.length - 1]?.archivedAt,
    pendingArchiveCount: archivedFiles.filter(file => file.status === 'pending').length,
    errorArchiveCount: archivedFiles.filter(file => file.status === 'error').length
  };
}

/**
 * إنشاء استعلام قاعدة البيانات للأرشفة
 * Create database query for archiving
 */
export function createArchiveQuery(
  dataType: string,
  dateThreshold: Date,
  batchSize: number = 1000
): ArchiveDatabaseQuery {
  const tableMap = {
    certificate: 'certificates',
    student_data: 'students',
    verification_log: 'verification_logs',
    activity_log: 'activity_logs'
  };

  return {
    tables: [tableMap[dataType as keyof typeof tableMap]],
    filters: {},
    dateField: 'created_at',
    dateCondition: '<',
    dateValue: dateThreshold.toISOString(),
    batchSize
  };
}

/**
 * ضغط البيانات
 * Compress data
 */
export async function compressData(
  data: any,
  options: CompressionOptions
): Promise<Uint8Array> {
  const jsonString = JSON.stringify(data);
  
  switch (options.algorithm) {
    case 'gzip':
      // استخدام gzip للضغط
      if (typeof window === 'undefined') {
        // في الخادم
        const { gzip } = await import('zlib');
        return await gzip(Buffer.from(jsonString), { level: options.level });
      }
      break;
      
    case 'brotli':
      // استخدام brotli للضغط
      if (typeof window === 'undefined') {
        const { brotliCompress } = await import('zlib');
        return await brotliCompress(Buffer.from(jsonString), {
          params: { [2]: options.level }
        });
      }
      break;
  }
  
  // افتراضي: إرجاع البيانات غير مضغوطة
  return new TextEncoder().encode(jsonString);
}

/**
 * فك ضغط البيانات
 * Decompress data
 */
export async function decompressData(
  compressedData: Uint8Array,
  algorithm: string = 'gzip'
): Promise<any> {
  let decompressedBuffer: Buffer;
  
  switch (algorithm) {
    case 'gzip':
      if (typeof window === 'undefined') {
        const { gunzip } = await import('zlib');
        decompressedBuffer = await gunzip(Buffer.from(compressedData));
      }
      break;
      
    case 'brotli':
      if (typeof window === 'undefined') {
        const { brotliDecompress } = await import('zlib');
        decompressedBuffer = await brotliDecompress(Buffer.from(compressedData));
      }
      break;
  }
  
  const decompressedString = decompressedBuffer.toString('utf8');
  return JSON.parse(decompressedString);
}

/**
 * إنشاء checksum للملف
 * Create checksum for file
 */
export async function createFileChecksum(fileData: Uint8Array): Promise<string> {
  if (typeof window === 'undefined') {
    // في الخادم
    const { createHash } = await import('crypto');
    const hash = createHash('sha256');
    hash.update(fileData);
    return hash.digest('hex');
  } else {
    // في المتصفح
    const hashBuffer = await crypto.subtle.digest('SHA-256', fileData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

/**
 * تنظيف الملفات المؤرشفة القديمة
 * Clean up old archived files
 */
export function cleanupOldArchives(
  archivedFiles: ArchivedFile[],
  retentionPeriod: number = 2555
): ArchivedFile[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionPeriod);
  
  return archivedFiles.filter(file => file.archivedAt > cutoffDate);
}

/**
 * إنشاء تقرير الأرشيف
 * Generate archive report
 */
export function generateArchiveReport(
  archivedFiles: ArchivedFile[],
  logs: ArchiveLog[],
  period: { startDate: Date; endDate: Date }
) {
  const stats = calculateArchiveStats(archivedFiles, logs);
  
  // إحصائيات حسب نوع البيانات
  const typeStats = archivedFiles.reduce((acc, file) => {
    const existing = acc.find(item => item.dataType === file.dataType);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ dataType: file.dataType, count: 1, percentage: 0 });
    }
    return acc;
  }, [] as Array<{ dataType: string; count: number; percentage: number }>);
  
  // حساب النسب المئوية
  typeStats.forEach(item => {
    item.percentage = (item.count / archivedFiles.length) * 100;
  });
  
  // فلترة السجلات حسب الفترة
  const filteredLogs = filterArchiveLogs(logs, {
    startDate: period.startDate,
    endDate: period.endDate
  });
  
  return {
    id: `report_${Date.now()}`,
    generatedAt: new Date(),
    period,
    stats,
    topArchivedTypes: typeStats.sort((a, b) => b.count - a.count),
    archiveLogs: filteredLogs,
    recommendations: generateRecommendations(stats)
  };
}

/**
 * إنشاء توصيات لتحسين الأرشيف
 * Generate archive optimization recommendations
 */
function generateRecommendations(stats: ArchiveStats): string[] {
  const recommendations: string[] = [];
  
  if (stats.totalCompressionRatio < 30) {
    recommendations.push('يمكن تحسين نسبة الضغط من خلال استخدام خوارزمية ضغط أفضل');
  }
  
  if (stats.averageArchivalTime > 300) {
    recommendations.push('وقت الأرشفة طويل، يُنصح بزيادة حجم الدفعة أو تحسين الاستعلامات');
  }
  
  if (stats.pendingArchiveCount > 100) {
    recommendations.push('يوجد العديد من الأرشيفات المعلقة، يُنصح بمراجعة العمليات');
  }
  
  if (stats.errorArchiveCount > 10) {
    recommendations.push('يوجد أخطاء في الأرشفة، يُنصح بفحص السجلات وإصلاح المشاكل');
  }
  
  if (stats.diskUsage.percentage > 80) {
    recommendations.push('استخدام القرص مرتفع، يُنصح بحذف الملفات القديمة أو توسيع المساحة');
  }
  
  return recommendations;
}

/**
 * التحقق من حالة النظام
 * Check system status
 */
export function checkSystemStatus(): Promise<{
  isHealthy: boolean;
  issues: string[];
  recommendations: string[];
}> {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // فحص مساحة القرص
  if (typeof window === 'undefined') {
    // في الخادم
    // يمكن إضافة فحص مساحة القرص هنا
  }
  
  // فحص الذاكرة
  if (typeof window !== 'undefined') {
    // في المتصفح
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      const memoryUsagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      
      if (memoryUsagePercent > 80) {
        issues.push('استخدام الذاكرة مرتفع');
        recommendations.push('إعادة تشغيل التطبيق أو تقليل حجم البيانات');
      }
    }
  }
  
  return Promise.resolve({
    isHealthy: issues.length === 0,
    issues,
    recommendations
  });
}