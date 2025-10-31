'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Download, 
  FileText, 
  Filter, 
  Settings, 
  Eye,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Award,
  Clock
} from 'lucide-react';
import { format, subMonths, subYears, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { ar } from 'date-fns/locale';
import { exportToExcel, exportToPDF, exportToCSV, exportToJSON } from '@/lib/utils/export';

interface ReportConfig {
  title: string;
  type: 'monthly' | 'yearly' | 'custom' | 'summary';
  period: {
    start: Date;
    end: Date;
  };
  metrics: string[];
  groupBy: 'day' | 'week' | 'month' | 'year';
  filters: {
    status?: string;
    template?: string;
    instructor?: string;
  };
}

interface ReportData {
  title: string;
  data: any[];
  totalRecords: number;
  summary: {
    [key: string]: number;
  };
}

const ReportsGenerator: React.FC = () => {
  const [config, setConfig] = useState<ReportConfig>({
    title: '',
    type: 'monthly',
    period: {
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date())
    },
    metrics: ['certificates_count', 'users_count', 'templates_count'],
    groupBy: 'day',
    filters: {}
  });

  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf' | 'csv' | 'json'>('excel');

  // بيانات وهمية للعرض التوضيحي
  const generateMockData = (): ReportData => {
    const daysInPeriod = Math.ceil((config.period.end.getTime() - config.period.start.getTime()) / (1000 * 60 * 60 * 24));
    const data = [];

    for (let i = 0; i < Math.min(daysInPeriod, 30); i++) {
      const date = new Date(config.period.start);
      date.setDate(date.getDate() + i);
      
      data.push({
        date: format(date, 'yyyy-MM-dd', { locale: ar }),
        certificates_issued: Math.floor(Math.random() * 50) + 10,
        users_registered: Math.floor(Math.random() * 20) + 5,
        templates_used: Math.floor(Math.random() * 8) + 1,
        revenue: Math.floor(Math.random() * 5000) + 1000,
        average_time: Math.floor(Math.random() * 30) + 10
      });
    }

    const summary = data.reduce((acc, item) => ({
      certificates_issued: acc.certificates_issued + item.certificates_issued,
      users_registered: acc.users_registered + item.users_registered,
      templates_used: acc.templates_used + item.templates_used,
      revenue: acc.revenue + item.revenue,
      average_time: acc.average_time + item.average_time
    }), { certificates_issued: 0, users_registered: 0, templates_used: 0, revenue: 0, average_time: 0 });

    summary.average_time = Math.round(summary.average_time / data.length);

    return {
      title: config.title || `تقرير ${config.type === 'monthly' ? 'شهري' : config.type === 'yearly' ? 'سنوي' : 'مخصص'}`,
      data,
      totalRecords: data.length,
      summary
    };
  };

  const handleConfigChange = (field: keyof ReportConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePeriodChange = (type: 'monthly' | 'yearly' | 'custom', preset?: string) => {
    const now = new Date();
    
    switch (type) {
      case 'monthly':
        setConfig(prev => ({
          ...prev,
          type,
          period: {
            start: startOfMonth(now),
            end: endOfMonth(now)
          }
        }));
        break;
      case 'yearly':
        setConfig(prev => ({
          ...prev,
          type,
          period: {
            start: startOfYear(now),
            end: endOfYear(now)
          }
        }));
        break;
      case 'custom':
        // سيتم التعامل مع التواريخ المخصصة في واجهة المستخدم
        break;
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      // محاكاة جلب البيانات من API
      await new Promise(resolve => setTimeout(resolve, 2000));
      const data = generateMockData();
      setReportData(data);
    } catch (error) {
      console.error('خطأ في إنشاء التقرير:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    if (!reportData) return;

    try {
      const exportData = {
        title: reportData.title,
        data: reportData.data,
        headers: Object.keys(reportData.data[0] || {}),
        metadata: {
          generatedAt: new Date(),
          period: `${format(config.period.start, 'PPP', { locale: ar })} - ${format(config.period.end, 'PPP', { locale: ar })}`,
          totalRecords: reportData.totalRecords
        }
      };

      switch (exportFormat) {
        case 'excel':
          await exportToExcel(exportData, `${config.title || 'report'}.xlsx`);
          break;
        case 'pdf':
          await exportToPDF('report-preview', `${config.title || 'report'}.pdf`, reportData.title);
          break;
        case 'csv':
          exportToCSV(exportData, `${config.title || 'report'}.csv`);
          break;
        case 'json':
          exportToJSON(exportData, `${config.title || 'report'}.json`);
          break;
      }
    } catch (error) {
      console.error('خطأ في تصدير التقرير:', error);
      alert('حدث خطأ أثناء تصدير التقرير');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6" dir="rtl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">مولد التقارير المخصصة</h2>
        <p className="text-gray-600">إنشاء وتصدير التقارير المخصصة حسب احتياجاتك</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* لوحة التحكم */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              إعدادات التقرير
            </h3>

            {/* عنوان التقرير */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">عنوان التقرير</label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => handleConfigChange('title', e.target.value)}
                placeholder="أدخل عنوان التقرير"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* نوع التقرير */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نوع التقرير</label>
              <select
                value={config.type}
                onChange={(e) => handlePeriodChange(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="monthly">شهري</option>
                <option value="yearly">سنوي</option>
                <option value="custom">مخصص</option>
                <option value="summary">ملخص عام</option>
              </select>
            </div>

            {/* الفترة الزمنية */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">الفترة الزمنية</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handlePeriodChange('monthly')}
                  className={`px-3 py-2 text-sm rounded-md ${
                    config.type === 'monthly' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  هذا الشهر
                </button>
                <button
                  onClick={() => handlePeriodChange('yearly')}
                  className={`px-3 py-2 text-sm rounded-md ${
                    config.type === 'yearly' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  هذا العام
                </button>
              </div>
              
              {config.type === 'custom' && (
                <div className="space-y-2">
                  <input
                    type="date"
                    value={format(config.period.start, 'yyyy-MM-dd')}
                    onChange={(e) => handleConfigChange('period', { ...config.period, start: new Date(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    value={format(config.period.end, 'yyyy-MM-dd')}
                    onChange={(e) => handleConfigChange('period', { ...config.period, end: new Date(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            {/* المقاييس المطلوبة */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">المقاييس</label>
              <div className="space-y-2">
                {[
                  { key: 'certificates_count', label: 'عدد الشهادات', icon: Award },
                  { key: 'users_count', label: 'عدد المستخدمين', icon: Users },
                  { key: 'templates_count', label: 'عدد القوالب', icon: FileText },
                  { key: 'revenue', label: 'الإيرادات', icon: TrendingUp },
                  { key: 'processing_time', label: 'وقت المعالجة', icon: Clock }
                ].map(metric => (
                  <label key={metric.key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={config.metrics.includes(metric.key)}
                      onChange={(e) => {
                        const newMetrics = e.target.checked
                          ? [...config.metrics, metric.key]
                          : config.metrics.filter(m => m !== metric.key);
                        handleConfigChange('metrics', newMetrics);
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <metric.icon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{metric.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* أزرار العمليات */}
            <div className="space-y-2 pt-4 border-t">
              <button
                onClick={generateReport}
                disabled={loading}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <BarChart3 className="w-4 h-4" />
                )}
                {loading ? 'جاري الإنشاء...' : 'إنشاء التقرير'}
              </button>

              {reportData && (
                <>
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    {previewMode ? 'إخفاء المعاينة' : 'معاينة'}
                  </button>

                  <div className="flex gap-2">
                    <select
                      value={exportFormat}
                      onChange={(e) => setExportFormat(e.target.value as any)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="excel">Excel</option>
                      <option value="pdf">PDF</option>
                      <option value="csv">CSV</option>
                      <option value="json">JSON</option>
                    </select>
                    <button
                      onClick={exportReport}
                      className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      تصدير
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* معاينة التقرير */}
        <div className="lg:col-span-2">
          {previewMode && reportData ? (
            <div id="report-preview" className="bg-white border rounded-lg p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800">{reportData.title}</h3>
                <p className="text-gray-600">
                  {format(config.period.start, 'PPP', { locale: ar })} - {format(config.period.end, 'PPP', { locale: ar })}
                </p>
              </div>

              {/* ملخص التقرير */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {Object.entries(reportData.summary).map(([key, value]) => (
                  <div key={key} className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{value.toLocaleString('ar-SA')}</div>
                    <div className="text-sm text-gray-600">
                      {key === 'certificates_issued' && 'شهادات مُصدرة'}
                      {key === 'users_registered' && 'مستخدمين جدد'}
                      {key === 'templates_used' && 'قوالب مستخدمة'}
                      {key === 'revenue' && 'إيرادات'}
                      {key === 'average_time' && 'متوسط الوقت'}
                    </div>
                  </div>
                ))}
              </div>

              {/* جدول البيانات */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-right">التاريخ</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">الشهادات</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">المستخدمين</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">القوالب</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">الإيرادات</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">الوقت المتوسط</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.data.slice(0, 10).map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{row.date}</td>
                        <td className="border border-gray-300 px-4 py-2">{row.certificates_issued}</td>
                        <td className="border border-gray-300 px-4 py-2">{row.users_registered}</td>
                        <td className="border border-gray-300 px-4 py-2">{row.templates_used}</td>
                        <td className="border border-gray-300 px-4 py-2">{row.revenue.toLocaleString('ar-SA')} ر.س</td>
                        <td className="border border-gray-300 px-4 py-2">{row.average_time} دقيقة</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {reportData.data.length > 10 && (
                <p className="text-center text-gray-500 mt-4">
                  عرض أول 10 من أصل {reportData.totalRecords} سجل
                </p>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد معاينة</h3>
              <p className="text-gray-500">انقر على "إنشاء التقرير" لعرض معاينة البيانات</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsGenerator;