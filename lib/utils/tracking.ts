/**
 * دوال مساعدة لتتبع ومتابعة الشهادات والأنشطة
 * تشمل تسجيل الأنشطة، حساب الإحصائيات، وتتبع الأداء
 * محسنة مع التخزين المؤقت ومراقبة الأداء
 */

import { cacheHelpers } from './cache';
import { performanceMonitor } from './performance';
import { dbOptimize } from './database';

/**
 * أنواع الأنشطة المختلفة في النظام
 */
export type ActivityType = 
  | 'certificate_created'
  | 'certificate_updated'
  | 'certificate_deleted'
  | 'certificate_verified'
  | 'certificate_failed_verification'
  | 'user_login'
  | 'user_logout'
  | 'template_created'
  | 'template_updated'
  | 'template_deleted'
  | 'export_performed'
  | 'bulk_operation'
  | 'performance_measured'
  | 'cache_cleared'
  | 'database_optimized'
  | 'system_alert';

/**
 * حالات الشهادات
 */
export type CertificateStatus = 
  | 'draft'
  | 'issued'
  | 'revoked'
  | 'expired'
  | 'pending_verification';

/**
 * واجهة بيانات النشاط
 */
export interface ActivityLog {
  id: string;
  type: ActivityType;
  userId: string;
  userName: string;
  userRole: string;
  entityId: string;
  entityType: 'certificate' | 'template' | 'user';
  description: string;
  metadata: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * واجهة بيانات الإحصائيات
 */
export interface TrackingStats {
  totalCertificates: number;
  certificatesByStatus: Record<CertificateStatus, number>;
  certificatesByTemplate: Record<string, number>;
  totalVerifications: number;
  successfulVerifications: number;
  failedVerifications: number;
  verificationRate: number;
  dailyActivity: {
    date: string;
    certificatesCreated: number;
    verificationsPerformed: number;
    activeUsers: number;
  }[];
  topTemplates: {
    templateId: string;
    templateName: string;
    count: number;
  }[];
  recentActivity: ActivityLog[];
  systemHealth: {
    responseTime: number;
    errorRate: number;
    uptime: number;
    lastUpdate: string;
  };
}

/**
 * تسجيل نشاط جديد مع تحسين الأداء
 * @param activity - بيانات النشاط
 */
export async function logActivity(activity: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<void> {
  const startTime = performance.now();
  
  try {
    const activityLog: ActivityLog = {
      ...activity,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    // استخدام التخزين المؤقت لحفظ السجلات
    await cacheHelpers.cacheQuery(
      'activity_logs',
      async () => {
        // حفظ في قاعدة البيانات
        // TODO: Implement database save logic
        
        // حفظ مؤقت في localStorage للتطوير
        const existingLogs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
        existingLogs.unshift(activityLog);
        
        // الاحتفاظ بآخر 1000 سجل فقط
        if (existingLogs.length > 1000) {
          existingLogs.splice(1000);
        }
        
        localStorage.setItem('activity_logs', JSON.stringify(existingLogs));
        return existingLogs;
      },
      defaultCache,
      5 * 60 * 1000 // 5 دقائق تخزين مؤقت
    );

    // تسجيل أداء العملية
    const duration = performance.now() - startTime;
    if (duration > 100) { // إذا استغرقت أكثر من 100ms
      console.warn(`تسجيل النشاط استغرق ${duration.toFixed(2)}ms`);
    }
  } catch (error) {
    console.error('خطأ في تسجيل النشاط:', error);
  }
}

/**
 * تسجيل نشاط إنشاء شهادة
 * @param userId - معرف المستخدم
 * @param userName - اسم المستخدم
 * @param certificateId - معرف الشهادة
 * @param certificateNumber - رقم الشهادة
 * @param metadata - بيانات إضافية
 */
export async function logCertificateCreated(
  userId: string,
  userName: string,
  certificateId: string,
  certificateNumber: string,
  metadata: Record<string, any> = {}
): Promise<void> {
  await logActivity({
    type: 'certificate_created',
    userId,
    userName,
    userRole: 'instructor', // أو student حسب السياق
    entityId: certificateId,
    entityType: 'certificate',
    description: `تم إنشاء شهادة جديدة: ${certificateNumber}`,
    metadata: {
      certificateNumber,
      ...metadata,
    },
    severity: 'low',
  });
}

/**
 * تسجيل نشاط التحقق من الشهادة
 * @param userId - معرف المستخدم
 * @param certificateId - معرف الشهادة
 * @param isSuccessful - نجح التحقق أم لا
 * @param metadata - بيانات إضافية
 */
export async function logCertificateVerification(
  userId: string,
  certificateId: string,
  isSuccessful: boolean,
  metadata: Record<string, any> = {}
): Promise<void> {
  await logActivity({
    type: isSuccessful ? 'certificate_verified' : 'certificate_failed_verification',
    userId,
    userName: metadata.userName || 'مجهول',
    userRole: metadata.userRole || 'visitor',
    entityId: certificateId,
    entityType: 'certificate',
    description: isSuccessful 
      ? `تحقق ناجح من الشهادة: ${metadata.certificateNumber || certificateId}`
      : `فشل التحقق من الشهادة: ${metadata.certificateNumber || certificateId}`,
    metadata: {
      isSuccessful,
      certificateNumber: metadata.certificateNumber,
      ...metadata,
    },
    severity: isSuccessful ? 'low' : 'medium',
  });
}

/**
 * تسجيل نشاط تسجيل الدخول
 * @param userId - معرف المستخدم
 * @param userName - اسم المستخدم
 * @param userRole - دور المستخدم
 * @param metadata - بيانات إضافية
 */
export async function logUserLogin(
  userId: string,
  userName: string,
  userRole: string,
  metadata: Record<string, any> = {}
): Promise<void> {
  await logActivity({
    type: 'user_login',
    userId,
    userName,
    userRole,
    entityId: userId,
    entityType: 'user',
    description: `تسجيل دخول: ${userName}`,
    metadata,
    severity: 'low',
    ipAddress: metadata.ipAddress,
    userAgent: metadata.userAgent,
  });
}

/**
 * حساب الإحصائيات الشاملة مع تحسين الأداء
 * @param startDate - تاريخ البداية (اختياري)
 * @param endDate - تاريخ النهاية (اختياري)
 * @returns إحصائيات شاملة
 */
export async function calculateTrackingStats(
  startDate?: string,
  endDate?: string
): Promise<TrackingStats> {
  const startTime = performance.now();
  
  try {
    // استخدام التخزين المؤقت للحصول على السجلات
    const logs = await cacheHelpers.cacheQuery(
      `stats_logs_${startDate || 'all'}_${endDate || 'all'}`,
      async () => {
        return JSON.parse(localStorage.getItem('activity_logs') || '[]');
      },
      userDataCache,
      2 * 60 * 1000 // دقيقتان تخزين مؤقت
    );
    
    // فلترة حسب التاريخ إذا تم تحديدها
    let filteredLogs = logs;
    if (startDate || endDate) {
      filteredLogs = logs.filter((log: ActivityLog) => {
        const logDate = new Date(log.timestamp);
        if (startDate && logDate < new Date(startDate)) return false;
        if (endDate && logDate > new Date(endDate)) return false;
        return true;
      });
    }

    // حساب إجمالي الشهادات
    const certificateLogs = filteredLogs.filter((log: ActivityLog) => 
      log.entityType === 'certificate'
    );
    const totalCertificates = certificateLogs.filter((log: ActivityLog) => 
      log.type === 'certificate_created'
    ).length;

    // حساب الشهادات حسب الحالة (محاكاة)
    const certificatesByStatus: Record<CertificateStatus, number> = {
      draft: Math.floor(totalCertificates * 0.1),
      issued: Math.floor(totalCertificates * 0.8),
      revoked: Math.floor(totalCertificates * 0.05),
      expired: Math.floor(totalCertificates * 0.03),
      pending_verification: Math.floor(totalCertificates * 0.02),
    };

    // حساب التحققات
    const verificationLogs = filteredLogs.filter((log: ActivityLog) => 
      log.type === 'certificate_verified' || log.type === 'certificate_failed_verification'
    );
    const successfulVerifications = verificationLogs.filter((log: ActivityLog) => 
      log.type === 'certificate_verified'
    ).length;
    const failedVerifications = verificationLogs.filter((log: ActivityLog) => 
      log.type === 'certificate_failed_verification'
    ).length;
    const totalVerifications = successfulVerifications + failedVerifications;
    const verificationRate = totalVerifications > 0 
      ? (successfulVerifications / totalVerifications) * 100 
      : 0;

    // حساب النشاط اليومي (آخر 30 يوم)
    const dailyActivity = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayLogs = filteredLogs.filter((log: ActivityLog) => 
        log.timestamp.startsWith(dateStr)
      );
      
      dailyActivity.push({
        date: dateStr,
        certificatesCreated: dayLogs.filter((log: ActivityLog) => 
          log.type === 'certificate_created'
        ).length,
        verificationsPerformed: dayLogs.filter((log: ActivityLog) => 
          log.type === 'certificate_verified' || log.type === 'certificate_failed_verification'
        ).length,
        activeUsers: new Set(dayLogs.map((log: ActivityLog) => log.userId)).size,
      });
    }

    // حساب أفضل القوالب (محاكاة)
    const topTemplates = [
      { templateId: '1', templateName: 'قالب الشهادة الأكاديمية', count: Math.floor(totalCertificates * 0.4) },
      { templateId: '2', templateName: 'قالب الشهادة المهنية', count: Math.floor(totalCertificates * 0.3) },
      { templateId: '3', templateName: 'قالب شهادة التدريب', count: Math.floor(totalCertificates * 0.2) },
    ];

    // آخر الأنشطة
    const recentActivity = filteredLogs
      .sort((a: ActivityLog, b: ActivityLog) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 50);

    // صحة النظام
    const systemHealth = {
      responseTime: Math.random() * 200 + 50, // محاكاة
      errorRate: Math.random() * 5, // محاكاة
      uptime: 99.5 + Math.random() * 0.5, // محاكاة
      lastUpdate: new Date().toISOString(),
    };

    const stats = {
      totalCertificates,
      certificatesByStatus,
      certificatesByTemplate: {},
      totalVerifications,
      successfulVerifications,
      failedVerifications,
      verificationRate,
      dailyActivity,
      topTemplates,
      recentActivity,
      systemHealth,
    };

    // حفظ الإحصائيات في التخزين المؤقت
    await cacheHelpers.cacheQuery(
      `calculated_stats_${startDate || 'all'}_${endDate || 'all'}`,
      async () => stats,
      userDataCache,
      5 * 60 * 1000 // 5 دقائق
    );

    // تسجيل أداء العملية
    const duration = performance.now() - startTime;
    performanceMonitor.recordMetric({
      name: 'stats_calculation',
      value: duration,
      unit: 'ms',
      timestamp: Date.now(),
      category: 'api'
    });

    console.log(`تم حساب الإحصائيات في ${duration.toFixed(2)}ms`);

    return stats;
  } catch (error) {
    console.error('خطأ في حساب الإحصائيات:', error);
    throw error;
  }
}

/**
 * تتبع أداء النظام المحسن
 * @param operation - اسم العملية
 * @param startTime - وقت البداية
 * @param success - نجح أم لا
 * @param metadata - بيانات إضافية
 */
export async function trackPerformance(
  operation: string,
  startTime: number,
  success: boolean,
  metadata: Record<string, any> = {}
): Promise<void> {
  const duration = Date.now() - startTime;
  
  // تسجيل في مراقبة الأداء
  performanceMonitor.recordMetric({
    name: `operation_${operation}`,
    value: duration,
    unit: 'ms',
    timestamp: Date.now(),
    category: 'api'
  });

  // تسجيل في أنشطة النظام
  await logActivity({
    type: 'performance_measured',
    userId: 'system',
    userName: 'النظام',
    userRole: 'system',
    entityId: 'performance',
    entityType: 'user',
    description: `قياس أداء ${operation}: ${duration}ms`,
    metadata: {
      operation,
      duration,
      success,
      memoryUsage: metadata.memoryUsage || 0,
      cacheHitRate: metadata.cacheHitRate || 0,
      ...metadata,
    },
    severity: duration > 5000 ? 'high' : duration > 2000 ? 'medium' : 'low',
  });

  // إرسال تنبيه إذا كانت العملية بطيئة
  if (duration > 3000) {
    await logActivity({
      type: 'system_alert',
      userId: 'system',
      userName: 'النظام',
      userRole: 'system',
      entityId: 'performance',
      entityType: 'user',
      description: `عملية بطيئة: ${operation} استغرقت ${duration}ms`,
      metadata: {
        operation,
        duration,
        threshold: 3000,
        ...metadata,
      },
      severity: 'medium',
    });
  }
}

/**
 * تحليل الأنماط والأنشطة المشبوهة
 * @param userId - معرف المستخدم (اختياري)
 * @param timeframe - الإطار الزمني (بالدقائق)
 * @returns تحليل للأنشطة المشبوهة
 */
export async function detectSuspiciousActivity(
  userId?: string,
  timeframe: number = 60
): Promise<{
  isSuspicious: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  reasons: string[];
  recommendations: string[];
}> {
  try {
    const logs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - timeframe * 60 * 1000);
    
    let filteredLogs = logs.filter((log: ActivityLog) => 
      new Date(log.timestamp) > cutoffTime
    );
    
    if (userId) {
      filteredLogs = filteredLogs.filter((log: ActivityLog) => log.userId === userId);
    }

    const reasons: string[] = [];
    const recommendations: string[] = [];
    let riskScore = 0;

    // فحص معدل المحاولات الفاشلة
    const failedAttempts = filteredLogs.filter((log: ActivityLog) => 
      log.type === 'certificate_failed_verification'
    ).length;
    
    if (failedAttempts > 10) {
      reasons.push(`عدد محاولات التحقق الفاشلة مرتفع (${failedAttempts})`);
      riskScore += 3;
      recommendations.push('مراجعة سجلات التحقق');
    }

    // فحص معدل الأنشطة السريع
    const activitiesPerMinute = filteredLogs.length / timeframe;
    if (activitiesPerMinute > 5) {
      reasons.push(`معدل الأنشطة عالي (${activitiesPerMinute.toFixed(1)} نشاط/دقيقة)`);
      riskScore += 2;
      recommendations.push('مراقبة معدل الأنشطة');
    }

    // فحص المحاولات من عناوين IP متعددة
    const uniqueIPs = new Set(filteredLogs.map((log: ActivityLog) => log.ipAddress).filter(Boolean));
    if (uniqueIPs.size > 3) {
      reasons.push(`محاولات من عناوين IP متعددة (${uniqueIPs.size})`);
      riskScore += 2;
      recommendations.push('مراجعة عناوين IP المشبوهة');
    }

    // تحديد مستوى المخاطر
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (riskScore >= 5) riskLevel = 'high';
    else if (riskScore >= 2) riskLevel = 'medium';

    const isSuspicious = riskLevel !== 'low';

    if (!isSuspicious) {
      recommendations.push('الأنشطة طبيعية');
    }

    return {
      isSuspicious,
      riskLevel,
      reasons,
      recommendations,
    };
  } catch (error) {
    console.error('خطأ في تحليل الأنشطة المشبوهة:', error);
    return {
      isSuspicious: false,
      riskLevel: 'low',
      reasons: ['خطأ في التحليل'],
      recommendations: ['إعادة المحاولة لاحقاً'],
    };
  }
}

/**
 * تصدير البيانات بصيغ مختلفة
 * @param data - البيانات المراد تصديرها
 * @param format - صيغة التصدير
 * @param filename - اسم الملف
 */
export function exportData(
  data: any[],
  format: 'csv' | 'excel' | 'pdf',
  filename: string
): void {
  try {
    let content: string;
    let mimeType: string;
    let extension: string;

    switch (format) {
      case 'csv':
        content = convertToCSV(data);
        mimeType = 'text/csv';
        extension = 'csv';
        break;
      case 'excel':
        // محاكاة تصدير Excel (يمكن استخدام مكتبة xlsx)
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        extension = 'xlsx';
        break;
      case 'pdf':
        // محاكاة تصدير PDF (يمكن استخدام مكتبة jsPDF)
        content = convertToPDFContent(data);
        mimeType = 'application/pdf';
        extension = 'pdf';
        break;
      default:
        throw new Error('صيغة غير مدعومة');
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // تسجيل نشاط التصدير
    logActivity({
      type: 'export_performed',
      userId: 'current_user',
      userName: 'المستخدم الحالي',
      userRole: 'admin',
      entityId: filename,
      entityType: 'user',
      description: `تصدير البيانات بصيغة ${format.toUpperCase()}: ${filename}`,
      metadata: {
        format,
        recordCount: data.length,
        filename,
      },
      severity: 'low',
    });
  } catch (error) {
    console.error('خطأ في تصدير البيانات:', error);
    throw error;
  }
}

/**
 * تحويل البيانات إلى CSV
 */
function convertToCSV(data: any[]): string {
  if (!data.length) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
}

/**
 * تحويل البيانات إلى محتوى PDF
 */
function convertToPDFContent(data: any[]): string {
  // محاكاة محتوى PDF - يمكن استخدام مكتبة PDF متقدمة
  let content = 'تقرير تتبع الشهادات\n\n';
  content += `تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}\n`;
  content += `عدد السجلات: ${data.length}\n\n`;
  
  data.forEach((item, index) => {
    content += `${index + 1}. ${JSON.stringify(item, null, 2)}\n\n`;
  });
  
  return content;
}

/**
 * تنظيف السجلات القديمة مع تحسين الأداء
 * @param daysToKeep - عدد الأيام للاحتفاظ بها
 */
export async function cleanOldLogs(daysToKeep: number = 90): Promise<void> {
  const startTime = performance.now();
  
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    const logs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
    const filteredLogs = logs.filter((log: ActivityLog) => 
      new Date(log.timestamp) > cutoffDate
    );
    
    localStorage.setItem('activity_logs', JSON.stringify(filteredLogs));
    
    // مسح التخزين المؤقت المرتبط
    cacheHelpers.clearApiCache();
    
    // تسجيل النشاط
    await logActivity({
      type: 'cache_cleared',
      userId: 'system',
      userName: 'النظام',
      userRole: 'system',
      entityId: 'cleanup',
      entityType: 'user',
      description: `تنظيف السجلات القديمة: ${logs.length - filteredLogs.length} سجل محذوف`,
      metadata: {
        deletedCount: logs.length - filteredLogs.length,
        keptCount: filteredLogs.length,
        daysKept: daysToKeep,
        duration: performance.now() - startTime,
      },
      severity: 'low',
    });
    
    console.log(`تم تنظيف السجلات القديمة في ${(performance.now() - startTime).toFixed(2)}ms. الاحتفاظ بـ ${filteredLogs.length} سجل`);
  } catch (error) {
    console.error('خطأ في تنظيف السجلات:', error);
  }
}

/**
 * تحسين قاعدة البيانات والعمليات
 */
export async function optimizeSystemPerformance(): Promise<{
  cacheOptimization: any;
  databaseOptimization: any;
  performanceImprovements: string[];
}> {
  const startTime = performance.now();
  const improvements: string[] = [];
  
  try {
    // تحسين التخزين المؤقت
    const cacheOptimization = await optimizeCachePerformance();
    if (cacheOptimization.improvements.length > 0) {
      improvements.push(...cacheOptimization.improvements);
    }

    // تحسين قاعدة البيانات
    const databaseOptimization = await optimizeDatabasePerformance();
    if (databaseOptimization.improvements.length > 0) {
      improvements.push(...databaseOptimization.improvements);
    }

    const duration = performance.now() - startTime;

    // تسجيل نشاط التحسين
    await logActivity({
      type: 'database_optimized',
      userId: 'system',
      userName: 'النظام',
      userRole: 'system',
      entityId: 'optimization',
      entityType: 'user',
      description: `تحسين أداء النظام: ${improvements.length} تحسين`,
      metadata: {
        improvements,
        cacheOptimization,
        databaseOptimization,
        duration,
      },
      severity: 'low',
    });

    return {
      cacheOptimization,
      databaseOptimization,
      performanceImprovements: improvements,
    };
  } catch (error) {
    console.error('خطأ في تحسين أداء النظام:', error);
    throw error;
  }
}

/**
 * تحسين أداء التخزين المؤقت
 */
async function optimizeCachePerformance() {
  const improvements: string[] = [];
  
  try {
    // فحص معدل ضرب التخزين المؤقت
    const apiCacheStats = apiCache.getStats();
    
    if (apiCacheStats.hitRate < 70) {
      improvements.push('تحسين معدل ضرب التخزين المؤقت');
      // اقتراح زيادة مدة البقاء
      apiCache.updateConfig({ ttl: 15 * 60 * 1000 }); // 15 دقيقة
    }

    if (apiCacheStats.totalSize > 8 * 1024 * 1024) { // 8MB
      improvements.push('تنظيف التخزين المؤقت القديم');
      apiCache.clear();
    }

    return {
      hitRate: apiCacheStats.hitRate,
      size: apiCacheStats.totalSize,
      improvements,
    };
  } catch (error) {
    console.error('خطأ في تحسين التخزين المؤقت:', error);
    return { improvements: ['خطأ في تحسين التخزين المؤقت'] };
  }
}

/**
 * تحسين أداء قاعدة البيانات
 */
async function optimizeDatabasePerformance() {
  const improvements: string[] = [];
  
  try {
    // فحص الاستعلامات البطيئة
    const stats = await dbOptimize.getComprehensiveStats?.();
    
    if (stats && stats.slowQueries.length > 0) {
      improvements.push(`تحسين ${stats.slowQueries.length} استعلام بطيء`);
    }

    // فحص الفهارس
    // TODO: Implement actual database index checking

    return {
      slowQueries: stats?.slowQueries.length || 0,
      totalIndexes: stats?.totalIndexes || 0,
      improvements,
    };
  } catch (error) {
    console.error('خطأ في تحسين قاعدة البيانات:', error);
    return { improvements: ['خطأ في تحسين قاعدة البيانات'] };
  }
}

/**
 * الحصول على تقرير أداء شامل
 */
export async function getPerformanceReport(): Promise<{
  trackingStats: TrackingStats;
  performanceMetrics: any;
  cacheStats: any;
  recommendations: string[];
}> {
  const startTime = performance.now();
  
  try {
    // جمع جميع البيانات
    const [trackingStats, performanceMetrics] = await Promise.all([
      calculateTrackingStats(),
      performanceMonitor.getStats()
    ]);

    // إحصائيات التخزين المؤقت
    const cacheStats = {
      default: defaultCache.getStats(),
      api: apiCache.getStats(),
      page: pageCache.getStats(),
      userData: userDataCache.getStats(),
    };

    // اقتراحات التحسين
    const recommendations: string[] = [];
    
    if (performanceMetrics.avgLoadTime > 3000) {
      recommendations.push('تحسين زمن تحميل الصفحات');
    }
    
    if (performanceMetrics.avgApiResponse > 1000) {
      recommendations.push('تحسين أداء استدعاءات API');
    }
    
    if (cacheStats.api.hitRate < 70) {
      recommendations.push('تحسين إعدادات التخزين المؤقت');
    }
    
    if (trackingStats.systemHealth.responseTime > 500) {
      recommendations.push('مراجعة أداء قاعدة البيانات');
    }

    const duration = performance.now() - startTime;
    console.log(`تم إنشاء تقرير الأداء في ${duration.toFixed(2)}ms`);

    return {
      trackingStats,
      performanceMetrics,
      cacheStats,
      recommendations,
    };
  } catch (error) {
    console.error('خطأ في إنشاء تقرير الأداء:', error);
    throw error;
  }
}