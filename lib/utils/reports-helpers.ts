// مكون مساعد للتحقق من صحة بيانات التقارير
export const validateReportConfig = (config: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!config.title || config.title.trim() === '') {
    errors.push('عنوان التقرير مطلوب');
  }
  
  if (!config.period || !config.period.start || !config.period.end) {
    errors.push('الفترة الزمنية مطلوبة');
  }
  
  if (config.period.start >= config.period.end) {
    errors.push('تاريخ البداية يجب أن يكون قبل تاريخ النهاية');
  }
  
  if (!config.metrics || config.metrics.length === 0) {
    errors.push('يجب اختيار مقياس واحد على الأقل');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// دالة مساعدة لتنسيق الأرقام باللغة العربية
export const formatArabicNumber = (num: number, options?: Intl.NumberFormatOptions): string => {
  return new Intl.NumberFormat('ar-SA', options).format(num);
};

// دالة مساعدة لتنسيق العملة
export const formatCurrency = (amount: number): string => {
  return `${formatArabicNumber(amount)} ر.س`;
};

// دالة مساعدة لتنسيق النسب المئوية
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `%${formatArabicNumber(value, { 
    minimumFractionDigits: decimals, 
    maximumFractionDigits: decimals 
  })}`;
};

// دالة مساعدة لتنسيق الوقت
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} دقيقة`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}س ${remainingMinutes}د`;
};

// حساب معدل النمو
export const calculateGrowthRate = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

// تحديد اتجاه الاتجاه
export const getTrendDirection = (rate: number): 'up' | 'down' | 'stable' => {
  if (Math.abs(rate) < 1) return 'stable';
  return rate > 0 ? 'up' : 'down';
};

// التحقق من صحة الفترة الزمنية
export const isValidDateRange = (start: Date, end: Date, maxDays: number = 365): boolean => {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= maxDays;
};

// إنتاج بيانات تجريبية للاختبار
export const generateMockTimeSeriesData = (
  days: number,
  baseValue: number = 100,
  volatility: number = 0.1
): Array<{ date: string; value: number; growth?: number }> => {
  const data = [];
  let currentValue = baseValue;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    
    const change = (Math.random() - 0.5) * volatility * baseValue;
    const newValue = Math.max(0, currentValue + change);
    const growth = i > 0 ? ((newValue - currentValue) / currentValue) * 100 : 0;
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(newValue),
      growth: Math.round(growth * 100) / 100
    });
    
    currentValue = newValue;
  }
  
  return data;
};

// تصدير كل شيء
export * from '../types/reports';