/**
 * تعريفات TypeScript لنظام الأرشيف
 * Shabadati Archive System Type Definitions
 */

// نوع حالة الأرشيف
export type ArchiveStatus = 
  | 'pending'
  | 'archiving'
  | 'archived'
  | 'restoring'
  | 'restored'
  | 'error'
  | 'expired';

// نوع عملية الأرشيف
export type ArchiveType = 
  | 'automatic'
  | 'manual'
  | 'scheduled';

// نوع البيانات المؤرشفة
export type ArchiveDataType = 
  | 'certificate'
  | 'student_data'
  | 'verification_log'
  | 'activity_log';

// نوع إعدادات الأرشيف
export interface ArchiveSettings {
  autoArchiveEnabled: boolean;
  archiveAfterDays: number; // افتراضي: 365 يوم
  compressionLevel: 'low' | 'medium' | 'high';
  retentionPeriod: number; // فترة الاحتفاظ بالملفات المؤرشفة
  backupEnabled: boolean;
  notificationEnabled: boolean;
  allowedFileTypes: string[];
  maxArchiveSize: number; // بالميجابايت
}

// معلومات الملف المؤرشف
export interface ArchivedFile {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number; // بالبايت
  compressionRatio: number;
  createdAt: Date;
  archivedAt: Date;
  status: ArchiveStatus;
  checksum: string;
  dataType: ArchiveDataType;
  originalRecordId: string;
}

// سجل عملية الأرشيف
export interface ArchiveLog {
  id: string;
  operationType: 'archive' | 'restore' | 'delete' | 'compress';
  archiveId: string;
  status: ArchiveStatus;
  startTime: Date;
  endTime?: Date;
  processedRecords: number;
  errorMessage?: string;
  operatorId?: string;
  archiveType: ArchiveType;
  compressionStats?: {
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
  };
}

// سجل استعادة البيانات
export interface RestoreLog {
  id: string;
  archiveId: string;
  recordsToRestore: string[];
  restoredAt?: Date;
  restoreStatus: ArchiveStatus;
  errorMessage?: string;
  restoredBy: string;
  notes?: string;
}

// إحصائيات الأرشيف
export interface ArchiveStats {
  totalArchivedFiles: number;
  totalArchiveSize: number;
  totalCompressedSize: number;
  totalCompressionRatio: number;
  averageArchivalTime: number; // بالثواني
  mostArchivedDataType: ArchiveDataType;
  oldestArchiveDate?: Date;
  newestArchiveDate?: Date;
  pendingArchiveCount: number;
  errorArchiveCount: number;
}

// تقرير الأرشيف
export interface ArchiveReport {
  id: string;
  generatedAt: Date;
  period: {
    startDate: Date;
    endDate: Date;
  };
  stats: ArchiveStats;
  topArchivedTypes: Array<{
    dataType: ArchiveDataType;
    count: number;
    percentage: number;
  }>;
  archiveLogs: ArchiveLog[];
  recommendations?: string[];
}

// معلومات حالة الاستعادة
export interface RestoreProgress {
  totalRecords: number;
  restoredRecords: number;
  failedRecords: number;
  currentOperation: string;
  estimatedTimeRemaining: number; // بالثواني
  percentage: number;
}

// معايير البحث في الأرشيف
export interface ArchiveSearchCriteria {
  startDate?: Date;
  endDate?: Date;
  dataType?: ArchiveDataType;
  status?: ArchiveStatus;
  archiveType?: ArchiveType;
  fileName?: string;
  minFileSize?: number;
  maxFileSize?: number;
}

// نتائج البحث في الأرشيف
export interface ArchiveSearchResults {
  archivedFiles: ArchivedFile[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// إعدادات الإشعارات
export interface ArchiveNotificationSettings {
  onArchiveComplete: boolean;
  onRestoreComplete: boolean;
  onError: boolean;
  weeklyReport: boolean;
  monthlyReport: boolean;
  emailRecipients: string[];
}

// معلومات النسخ الاحتياطي
export interface BackupInfo {
  id: string;
  backupPath: string;
  backupSize: number;
  createdAt: Date;
  isAutomatic: boolean;
  retentionDays: number;
  checksum: string;
  includesMetadata: boolean;
}

// استعلام قاعدة البيانات للأرشيف
export interface ArchiveDatabaseQuery {
  tables: string[];
  filters: Record<string, any>;
  dateField: string;
  dateCondition: '<' | '<=' | '>' | '>=' | 'BETWEEN';
  dateValue: any;
  batchSize: number;
}

// معايير ضغط البيانات
export interface CompressionOptions {
  algorithm: 'gzip' | 'brotli' | 'lz4';
  level: number;
  includeMetadata: boolean;
  preserveIntegrity: boolean;
}

// نتيجة عملية الأرشيف
export interface ArchiveOperationResult {
  success: boolean;
  archivedFiles: ArchivedFile[];
  errorMessage?: string;
  duration: number; // بالثواني
  compressionRatio?: number;
  processedRecords: number;
}

// نتيجة عملية الاستعادة
export interface RestoreOperationResult {
  success: boolean;
  restoredRecords: number;
  failedRecords: string[];
  errorMessage?: string;
  duration: number; // بالثواني
  restoreLog: RestoreLog;
}

// إعدادات الأداء
export interface ArchivePerformanceSettings {
  maxConcurrentOperations: number;
  batchSize: number;
  timeoutMinutes: number;
  retryAttempts: number;
  progressUpdateInterval: number; // بالثواني
}

// معلومات حالة النظام
export interface ArchiveSystemStatus {
  isRunning: boolean;
  currentOperations: number;
  queueSize: number;
  lastSuccessfulOperation: Date;
  systemHealth: 'healthy' | 'warning' | 'critical';
  diskUsage: {
    used: number;
    available: number;
    total: number;
    percentage: number;
  };
  memoryUsage: {
    used: number;
    available: number;
    total: number;
  };
}