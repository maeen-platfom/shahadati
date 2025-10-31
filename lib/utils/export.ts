import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import { performanceMonitor } from './performance';
import { cacheHelpers } from './cache';
import { trackPerformance } from './tracking';

// أنواع البيانات المدعومة
export interface ExportData {
  title: string;
  data: any[];
  headers?: string[];
  metadata?: {
    generatedAt: Date;
    period?: string;
    totalRecords: number;
  };
}

// تصدير إلى Excel مع التنسيق والأداء المحسن
export const exportToExcel = async (exportData: ExportData, filename?: string): Promise<void> => {
  const startTime = performance.now();
  
  try {
    // تسجيل بدء العملية
    performanceMonitor.recordMetric({
      name: 'export_excel_start',
      value: 0,
      unit: 'count',
      timestamp: Date.now(),
      category: 'api'
    });

    // استخدام التخزين المؤقت للبيانات الكبيرة
    const cacheKey = `excel_export_${exportData.title}_${exportData.metadata?.totalRecords || 0}`;
    const cachedResult = await cacheHelpers.cacheQuery(
      cacheKey,
      async () => {
        // إنشاء workbook جديد
        const wb = XLSX.utils.book_new();
    
    // تحويل البيانات إلى worksheet
    const ws = XLSX.utils.json_to_sheet(exportData.data);
    
    // إضافة العناوين إذا لم تكن موجودة
    if (!exportData.headers && exportData.data.length > 0) {
      exportData.headers = Object.keys(exportData.data[0]);
    }
    
    if (exportData.headers) {
      // تخصيص عرض الأعمدة
      const columnWidths = exportData.headers.map(header => ({
        wch: Math.max(header.length, 15)
      }));
      ws['!cols'] = columnWidths;
      
      // إضافة تنسيق للعناوين
      const headerStyle = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '366092' } },
        alignment: { horizontal: 'center', vertical: 'center' }
      };
      
      // تطبيق التنسيق على العناوين
      exportData.headers.forEach((header, index) => {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: index });
        if (!ws[cellRef]) return;
        ws[cellRef].s = headerStyle;
      });
    }
    
    // إضافة metadata في ورقة منفصلة
    if (exportData.metadata) {
      const metadataSheet = XLSX.utils.aoa_to_sheet([
        ['معلومات التقرير'],
        ['العنوان', exportData.title],
        ['تاريخ الإنشاء', format(exportData.metadata.generatedAt, 'PPpp', { locale: ar })],
        ['الفترة الزمنية', exportData.metadata.period || 'غير محدد'],
        ['إجمالي السجلات', exportData.metadata.totalRecords],
        [],
        ['البيانات']
      ]);
      
      XLSX.utils.book_append_sheet(wb, metadataSheet, 'المعلومات');
    }
    
    // إضافة البيانات الرئيسية
    XLSX.utils.book_append_sheet(wb, ws, 'البيانات');
    
        // تصدير الملف
        const fileName = filename || `تقرير_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
        XLSX.writeFile(wb, fileName);
        
        return { fileName, success: true };
      },
      defaultCache,
      10 * 60 * 1000 // 10 دقائق تخزين مؤقت
    );

    const duration = performance.now() - startTime;
    
    // تسجيل نتائج الأداء
    await trackPerformance('export_excel', startTime, true, {
      recordsCount: exportData.metadata?.totalRecords || 0,
      fileSize: cachedResult?.fileName || 'unknown'
    });
    
    console.log(`تم تصدير Excel في ${duration.toFixed(2)}ms`);
    
  } catch (error) {
    const duration = performance.now() - startTime;
    
    // تسجيل فشل العملية
    await trackPerformance('export_excel', startTime, false, {
      error: error.message,
      duration
    });
    
    console.error('خطأ في تصدير Excel:', error);
    throw new Error('فشل في تصدير الملف إلى Excel');
  }
};

// تصدير إلى PDF مع تحسين الأداء
export const exportToPDF = async (
  elementId: string, 
  filename?: string,
  title?: string
): Promise<void> => {
  const startTime = performance.now();
  
  try {
    // تسجيل بدء العملية
    performanceMonitor.recordMetric({
      name: 'export_pdf_start',
      value: 0,
      unit: 'count',
      timestamp: Date.now(),
      category: 'api'
    });

    // العثور على العنصر
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('العنصر غير موجود');
    }

    // تحويل HTML إلى canvas مع تحسينات الأداء
    const canvas = await html2canvas(element, {
      scale: 1.5, // تقليل الدقة لتحسين الأداء
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      height: Math.min(element.scrollHeight, 2000), // حد أقصى للارتفاع
      width: Math.min(element.scrollWidth, 1200), // حد أقصى للعرض
      logging: false // تعطيل اللوغز لتحسين الأداء
    });

    // إنشاء PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    // إضافة عنوان إذا تم توفيره
    if (title) {
      pdf.setFontSize(16);
      pdf.text(title, 20, 30);
    }

    // إضافة الصورة
    pdf.addImage(imgData, 'PNG', 0, title ? 50 : 20, canvas.width, canvas.height - (title ? 50 : 20));

    // حفظ الملف
    const fileName = filename || `تقرير_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    
    // استخدام التخزين المؤقت للنتائج المتكررة
    await cacheHelpers.cacheQuery(
      `pdf_export_${elementId}_${fileName}`,
      async () => {
        pdf.save(fileName);
        return { success: true, fileName };
      },
      defaultCache,
      5 * 60 * 1000 // 5 دقائق
    );

    const duration = performance.now() - startTime;
    
    // تسجيل نتائج الأداء
    await trackPerformance('export_pdf', startTime, true, {
      elementId,
      canvasSize: `${canvas.width}x${canvas.height}`,
      fileName
    });
    
    console.log(`تم تصدير PDF في ${duration.toFixed(2)}ms`);

  } catch (error) {
    const duration = performance.now() - startTime;
    
    // تسجيل فشل العملية
    await trackPerformance('export_pdf', startTime, false, {
      error: error.message,
      duration,
      elementId
    });
    
    console.error('خطأ في تصدير PDF:', error);
    throw new Error('فشل في تصدير الملف إلى PDF');
  }
};

// تصدير إلى CSV مع تحسين الأداء
export const exportToCSV = (exportData: ExportData, filename?: string): void => {
  const startTime = performance.now();
  
  try {
    if (exportData.data.length === 0) {
      throw new Error('لا توجد بيانات للتصدير');
    }

    // تسجيل بدء العملية
    performanceMonitor.recordMetric({
      name: 'export_csv_start',
      value: 0,
      unit: 'count',
      timestamp: Date.now(),
      category: 'api'
    });

    // الحصول على العناوين
    const headers = exportData.headers || Object.keys(exportData.data[0]);
    
    // إنشاء محتوى CSV مع تحسينات الأداء
    const csvLines: string[] = [];
    
    // إضافة العنوان
    csvLines.push(exportData.title);
    csvLines.push('');
    
    // إضافة العناوين
    csvLines.push(headers.join(','));
    
    // إضافة البيانات مع تحسين الأداء
    for (let i = 0; i < exportData.data.length; i++) {
      const row = exportData.data[i];
      const csvRow = headers.map(header => {
        const value = row[header];
        // تنظيف القيم للتأكد من عدم وجود فواصل التي تفسد CSV
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      }).join(',');
      csvLines.push(csvRow);
    }

    const csvContent = csvLines.join('\n');

    // إنشاء وربط الملف
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename || `تقرير_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    const duration = performance.now() - startTime;
    
    // تسجيل نتائج الأداء
    trackPerformance('export_csv', startTime, true, {
      recordsCount: exportData.data.length,
      headersCount: headers.length,
      fileSize: blob.size
    }).catch(console.error);
    
    console.log(`تم تصدير CSV في ${duration.toFixed(2)}ms`);

  } catch (error) {
    const duration = performance.now() - startTime;
    
    // تسجيل فشل العملية
    trackPerformance('export_csv', startTime, false, {
      error: error.message,
      duration
    }).catch(console.error);
    
    console.error('خطأ في تصدير CSV:', error);
    throw new Error('فشل في تصدير الملف إلى CSV');
  }
};

// تصدير إلى JSON مع تحسين الأداء
export const exportToJSON = (exportData: ExportData, filename?: string): void => {
  const startTime = performance.now();
  
  try {
    // تسجيل بدء العملية
    performanceMonitor.recordMetric({
      name: 'export_json_start',
      value: 0,
      unit: 'count',
      timestamp: Date.now(),
      category: 'api'
    });

    // استخدام التخزين المؤقت للبيانات المتكررة
    const cacheKey = `json_export_${exportData.title}_${exportData.metadata?.totalRecords || 0}`;
    
    cacheHelpers.cacheQuery(
      cacheKey,
      async () => {
        const jsonContent = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', filename || `تقرير_${format(new Date(), 'yyyy-MM-dd')}.json`);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
        
        return { success: true, fileName: filename || `تقرير_${format(new Date(), 'yyyy-MM-dd')}.json` };
      },
      defaultCache,
      15 * 60 * 1000 // 15 دقيقة تخزين مؤقت
    );

    const duration = performance.now() - startTime;
    
    // تسجيل نتائج الأداء
    trackPerformance('export_json', startTime, true, {
      recordsCount: exportData.metadata?.totalRecords || 0,
      dataSize: JSON.stringify(exportData).length
    }).catch(console.error);
    
    console.log(`تم تصدير JSON في ${duration.toFixed(2)}ms`);

  } catch (error) {
    const duration = performance.now() - startTime;
    
    // تسجيل فشل العملية
    trackPerformance('export_json', startTime, false, {
      error: error.message,
      duration
    }).catch(console.error);
    
    console.error('خطأ في تصدير JSON:', error);
    throw new Error('فشل في تصدير الملف إلى JSON');
  }
};

// دالة مساعدة لتنسيق البيانات للعرض مع تحسين الأداء
export const formatDataForExport = (data: any[], type: 'excel' | 'csv' | 'json'): ExportData => {
  const startTime = performance.now();
  
  try {
    // استخدام التخزين المؤقت للبيانات الكبيرة
    const cacheKey = `formatted_data_${type}_${data.length}`;
    
    return cacheHelpers.cacheQuery(
      cacheKey,
      async () => {
        // تحسين أداء التنسيق للبيانات الكبيرة
        const formattedData = data.length > 1000 
          ? data.map(item => ({
              ...item,
              created_at: item.created_at ? format(parseISO(item.created_at), 'PPpp', { locale: ar }) : '',
              updated_at: item.updated_at ? format(parseISO(item.updated_at), 'PPpp', { locale: ar }) : ''
            }))
          : data.map(item => ({
              ...item,
              created_at: item.created_at ? format(parseISO(item.created_at), 'PPpp', { locale: ar }) : '',
              updated_at: item.updated_at ? format(parseISO(item.updated_at), 'PPpp', { locale: ar }) : ''
            }));

        return {
          title: `تقرير الشهادات - ${format(new Date(), 'PPP', { locale: ar })}`,
          data: formattedData,
          metadata: {
            generatedAt: new Date(),
            totalRecords: data.length,
            format: type
          }
        };
      },
      userDataCache,
      10 * 60 * 1000 // 10 دقائق
    );
  } catch (error) {
    console.error('خطأ في تنسيق البيانات:', error);
    throw error;
  }
};

// دالة مساعدة لإنشاء تقرير شامل مع تحسين الأداء
export const createComprehensiveReport = (data: any): ExportData => {
  const startTime = performance.now();
  
  try {
    const report = {
      title: 'تقرير شامل للشهادات',
      data: [
        {
          'إجمالي الشهادات': data.totalCertificates || 0,
          'الشهادات النشطة': data.activeCertificates || 0,
          'الشهادات المستخرجة': data.downloadedCertificates || 0,
          'إجمالي المستخدمين': data.totalUsers || 0,
          'إجمالي القوالب': data.totalTemplates || 0,
          'متوسط وقت الاستجابة': data.avgResponseTime || 0,
          'معدل نجاح التحقق': data.verificationSuccessRate || 0,
          'حالة النظام': data.systemStatus || 'جيد'
        }
      ],
      metadata: {
        generatedAt: new Date(),
        totalRecords: 1,
        reportType: 'comprehensive'
      }
    };

    const duration = performance.now() - startTime;
    console.log(`تم إنشاء التقرير الشامل في ${duration.toFixed(2)}ms`);

    return report;
  } catch (error) {
    console.error('خطأ في إنشاء التقرير الشامل:', error);
    throw error;
  }
};

/**
 * دوال تحسين الأداء الجديدة
 */

// تحليل أداء التصدير
export const analyzeExportPerformance = async (): Promise<{
  totalExports: number;
  avgExportTime: number;
  successRate: number;
  popularFormats: { format: string; count: number }[];
  recommendations: string[];
}> => {
  try {
    // الحصول على بيانات أداء التصدير من مراقبة الأداء
    const metrics = performanceMonitor.getMetrics();
    const exportMetrics = metrics.filter(m => m.name.startsWith('export_'));
    
    const totalExports = exportMetrics.length;
    const avgExportTime = totalExports > 0 
      ? exportMetrics.reduce((sum, m) => sum + m.value, 0) / totalExports
      : 0;
    
    // حساب معدل النجاح (محاكاة)
    const successRate = 95.5; // يمكن حسابه من البيانات الفعلية
    
    // أكثر الصيغ استخداماً (محاكاة)
    const popularFormats = [
      { format: 'Excel', count: Math.floor(totalExports * 0.6) },
      { format: 'PDF', count: Math.floor(totalExports * 0.3) },
      { format: 'CSV', count: Math.floor(totalExports * 0.1) }
    ];
    
    // اقتراحات التحسين
    const recommendations: string[] = [];
    if (avgExportTime > 5000) {
      recommendations.push('تحسين أداء عمليات التصدير الكبيرة');
    }
    if (successRate < 90) {
      recommendations.push('مراجعة أخطاء التصدير المتكررة');
    }
    
    return {
      totalExports,
      avgExportTime,
      successRate,
      popularFormats,
      recommendations
    };
  } catch (error) {
    console.error('خطأ في تحليل أداء التصدير:', error);
    throw error;
  }
};

// تحسين حجم البيانات للتصدير
export const optimizeDataForExport = (data: any[], maxRecords: number = 10000): {
  optimizedData: any[];
  totalRecords: number;
  truncated: boolean;
  recommendation: string;
} => {
  const totalRecords = data.length;
  const truncated = totalRecords > maxRecords;
  const optimizedData = truncated ? data.slice(0, maxRecords) : data;
  
  let recommendation = '';
  if (truncated) {
    recommendation = `تم تقليص البيانات من ${totalRecords.toLocaleString()} إلى ${maxRecords.toLocaleString()} سجل لتحسين الأداء`;
  } else if (totalRecords > maxRecords * 0.8) {
    recommendation = 'اقتراب من الحد الأقصى المسموح. فكر في تقسيم البيانات';
  } else {
    recommendation = 'حجم البيانات مناسب للتصدير';
  }
  
  return {
    optimizedData,
    totalRecords,
    truncated,
    recommendation
  };
};

// تصدير مجمع متعدد الصيغ
export const exportMultipleFormats = async (
  exportData: ExportData,
  formats: Array<'excel' | 'csv' | 'json' | 'pdf'>
): Promise<{ successful: string[]; failed: string[]; duration: number }> => {
  const startTime = performance.now();
  const successful: string[] = [];
  const failed: string[] = [];
  
  for (const format of formats) {
    try {
      switch (format) {
        case 'excel':
          await exportToExcel(exportData);
          successful.push('Excel');
          break;
        case 'csv':
          exportToCSV(exportData);
          successful.push('CSV');
          break;
        case 'json':
          exportToJSON(exportData);
          successful.push('JSON');
          break;
        case 'pdf':
          // يتطلب elementId، يتم التعامل معه بشكل منفصل
          failed.push('PDF (يتطلب عنصر HTML محدد)');
          break;
      }
    } catch (error) {
      failed.push(format.toUpperCase());
      console.error(`فشل تصدير ${format}:`, error);
    }
  }
  
  const duration = performance.now() - startTime;
  
  return { successful, failed, duration };
};