/**
 * أداة مراقبة وتحسين الأداء
 * وظائف لقياس ومراقبة أداء التطبيق
 */

export interface PerformanceStats {
  totalMetrics: number;
  totalAlerts: number;
  avgLoadTime: number;
  avgApiResponse: number;
  memoryUsage: number;
  alertsBySeverity: Record<string, number>;
  hitRate?: number;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  category: 'load' | 'render' | 'api' | 'memory' | 'network';
}

export interface PerformanceAlert {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  timestamp: number;
  metric?: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private alerts: PerformanceAlert[] = [];
  private maxMetrics = 1000;
  private thresholds = {
    pageLoad: 3000, // 3 ثوان
    apiResponse: 1000, // ثانية واحدة
    memoryUsage: 100, // 100MB
    renderTime: 16, // 16ms للإطار الواحد
  };

  /**
   * قياس زمن تحميل الصفحة
   */
  measurePageLoad(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
      
      this.recordMetric({
        name: 'page_load_time',
        value: loadTime,
        unit: 'ms',
        timestamp: Date.now(),
        category: 'load'
      });

      this.recordMetric({
        name: 'dom_content_loaded',
        value: domContentLoaded,
        unit: 'ms',
        timestamp: Date.now(),
        category: 'load'
      });

      // فحص العتبات
      if (loadTime > this.thresholds.pageLoad) {
        this.createAlert(
          `زمن تحميل الصفحة بطيء (${loadTime}ms)`,
          'warning',
          'page_load_time'
        );
      }
    });
  }

  /**
   * قياس زمن استجابة API
   */
  measureApiCall(url: string, startTime: number): void {
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    this.recordMetric({
      name: `api_${this.getApiName(url)}`,
      value: responseTime,
      unit: 'ms',
      timestamp: Date.now(),
      category: 'api'
    });

    // فحص العتبات
    if (responseTime > this.thresholds.apiResponse) {
      this.createAlert(
        `استجابة API بطيئة: ${this.getApiName(url)} (${responseTime}ms)`,
        'warning',
        'api_response'
      );
    }
  }

  /**
   * قياس زمن استدعاء دالة
   */
  measureFunction<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    const duration = end - start;

    this.recordMetric({
      name: `function_${name}`,
      value: duration,
      unit: 'ms',
      timestamp: Date.now(),
      category: 'render'
    });

    if (duration > this.thresholds.renderTime) {
      this.createAlert(
        `دالة ${name} تستغرق وقتًا طويلاً (${duration}ms)`,
        'info',
        'function_execution'
      );
    }

    return result;
  }

  /**
   * قياس استخدام الذاكرة
   */
  measureMemory(): void {
    if (typeof window === 'undefined' || !('memory' in performance)) return;

    const memory = (performance as any).memory;
    const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
    const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);

    this.recordMetric({
      name: 'memory_used',
      value: usedMB,
      unit: 'MB',
      timestamp: Date.now(),
      category: 'memory'
    });

    this.recordMetric({
      name: 'memory_total',
      value: totalMB,
      unit: 'MB',
      timestamp: Date.now(),
      category: 'memory'
    });

    // فحص العتبات
    if (usedMB > this.thresholds.memoryUsage) {
      this.createAlert(
        `استخدام عالي للذاكرة (${usedMB}MB)`,
        'warning',
        'memory_usage'
      );
    }
  }

  /**
   * قياس سرعة الشبكة
   */
  measureNetworkSpeed(): void {
    if (typeof window === 'undefined') return;

    const connection = (navigator as any).connection;
    if (!connection) return;

    const { downlink, effectiveType, rtt } = connection;

    this.recordMetric({
      name: 'network_downlink',
      value: downlink,
      unit: 'Mbps',
      timestamp: Date.now(),
      category: 'network'
    });

    this.recordMetric({
      name: 'network_rtt',
      value: rtt,
      unit: 'ms',
      timestamp: Date.now(),
      category: 'network'
    });

    this.recordMetric({
      name: 'network_type',
      value: this.getNetworkTypeScore(effectiveType),
      unit: 'score',
      timestamp: Date.now(),
      category: 'network'
    });
  }

  /**
   * تسجيل مقياس أداء
   */
  private recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    
    // حذف المقياسات القديمة إذا تجاوز الحد الأقصى
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.splice(0, this.metrics.length - this.maxMetrics);
    }
  }

  /**
   * إنشاء تنبيه أداء
   */
  private createAlert(message: string, severity: PerformanceAlert['severity'], metric?: string): void {
    const alert: PerformanceAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message,
      severity,
      timestamp: Date.now(),
      metric
    };

    this.alerts.push(alert);
  }

  /**
   * الحصول على اسم API من الرابط
   */
  private getApiName(url: string): string {
    try {
      const pathname = new URL(url, window.location.origin).pathname;
      const segments = pathname.split('/');
      return segments[segments.length - 1];
    } catch {
      return 'unknown';
    }
  }

  /**
   * تحويل نوع الشبكة إلى نقاط
   */
  private getNetworkTypeScore(type: string): number {
    const scores = {
      '2g': 1,
      'slow-2g': 0.5,
      '3g': 2,
      '4g': 3,
      '5g': 4,
      'wifi': 5
    };
    return scores[type] || 0;
  }

  /**
   * الحصول على جميع القياسات
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * الحصول على التنبيهات
   */
  getAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }

  /**
   * الحصول على إحصائيات الأداء
   */
  getStats(): {
    totalMetrics: number;
    totalAlerts: number;
    avgLoadTime: number;
    avgApiResponse: number;
    memoryUsage: number;
    alertsBySeverity: Record<string, number>;
  } {
    const loadTimes = this.metrics.filter(m => m.name === 'page_load_time');
    const apiTimes = this.metrics.filter(m => m.name.startsWith('api_'));
    const memoryUsage = this.metrics.find(m => m.name === 'memory_used');

    const avgLoadTime = loadTimes.length > 0
      ? loadTimes.reduce((sum, m) => sum + m.value, 0) / loadTimes.length
      : 0;

    const avgApiResponse = apiTimes.length > 0
      ? apiTimes.reduce((sum, m) => sum + m.value, 0) / apiTimes.length
      : 0;

    const alertsBySeverity = this.alerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalMetrics: this.metrics.length,
      totalAlerts: this.alerts.length,
      avgLoadTime,
      avgApiResponse,
      memoryUsage: memoryUsage?.value || 0,
      alertsBySeverity
    };
  }

  /**
   * مسح البيانات القديمة
   */
  clearOldData(hoursOld: number = 24): void {
    const cutoff = Date.now() - (hoursOld * 60 * 60 * 1000);
    
    this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
    this.alerts = this.alerts.filter(a => a.timestamp > cutoff);
  }

  /**
   * تصدير البيانات للاستخدام الخارجي
   */
  exportData(): string {
    return JSON.stringify({
      metrics: this.metrics,
      alerts: this.alerts,
      timestamp: Date.now(),
      version: '1.0.0'
    }, null, 2);
  }

  /**
   * إعادة تعيين جميع البيانات
   */
  reset(): void {
    this.metrics = [];
    this.alerts = [];
  }
}

// إنشاء مثيل عام للمراقب
export const performanceMonitor = new PerformanceMonitor();

// تفعيل المراقبة التلقائية
if (typeof window !== 'undefined') {
  performanceMonitor.measurePageLoad();
  performanceMonitor.measureNetworkSpeed();
  
  // قياس الذاكرة كل دقيقة
  setInterval(() => {
    performanceMonitor.measureMemory();
  }, 60000);
}

// دوال مساعدة للتصدير
export const createPerformanceObserver = (callback: (metric: PerformanceMetric) => void) => {
  if (typeof window === 'undefined') return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'navigation') {
        callback({
          name: entry.name,
          value: entry.duration,
          unit: 'ms',
          timestamp: Date.now(),
          category: 'load'
        });
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['navigation', 'resource'] });
  } catch (error) {
    console.warn('Performance Observer not supported:', error);
  }

  return observer;
};

export const measureWebVitals = () => {
  if (typeof window === 'undefined') return;

  // قياس Core Web Vitals
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS((metric) => {
      performanceMonitor.recordMetric({
        name: 'web_vital_cls',
        value: metric.value,
        unit: 'score',
        timestamp: Date.now(),
        category: 'render'
      });
    });

    getFID((metric) => {
      performanceMonitor.recordMetric({
        name: 'web_vital_fid',
        value: metric.value,
        unit: 'ms',
        timestamp: Date.now(),
        category: 'render'
      });
    });

    getFCP((metric) => {
      performanceMonitor.recordMetric({
        name: 'web_vital_fcp',
        value: metric.value,
        unit: 'ms',
        timestamp: Date.now(),
        category: 'load'
      });
    });

    getLCP((metric) => {
      performanceMonitor.recordMetric({
        name: 'web_vital_lcp',
        value: metric.value,
        unit: 'ms',
        timestamp: Date.now(),
        category: 'load'
      });
    });

    getTTFB((metric) => {
      performanceMonitor.recordMetric({
        name: 'web_vital_ttfb',
        value: metric.value,
        unit: 'ms',
        timestamp: Date.now(),
        category: 'load'
      });
    });
  }).catch(() => {
    // مكتبة web-vitals غير متوفرة
    console.warn('Web Vitals library not available');
  });
};

// تفعيل قياس Core Web Vitals
measureWebVitals();