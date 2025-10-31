'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  FileText,
  DollarSign,
  Clock,
  Eye,
  Download,
  Calendar,
  Filter
} from 'lucide-react';
import { format, subDays, subMonths, startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';
import { ar } from 'date-fns/locale';

interface AnalyticsData {
  trends: {
    certificates_issued: Array<{ date: string; value: number; growth?: number }>;
    users_registered: Array<{ date: string; value: number; growth?: number }>;
    revenue: Array<{ date: string; value: number; growth?: number }>;
  };
  kpis: {
    total_certificates: number;
    total_users: number;
    total_revenue: number;
    avg_processing_time: number;
    growth_rate: number;
    conversion_rate: number;
  };
  templates_performance: Array<{
    name: string;
    certificates: number;
    percentage: number;
    color: string;
  }>;
  user_analytics: {
    new_users: number;
    active_users: number;
    returning_users: number;
    churn_rate: number;
    avg_session_duration: number;
  };
  comparison: {
    current_period: any;
    previous_period: any;
    improvements: string[];
  };
}

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState<'trends' | 'templates' | 'users' | 'comparison'>('trends');

  // ألوان للمخططات
  const chartColors = {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B',
    danger: '#EF4444',
    purple: '#8B5CF6',
    pink: '#EC4899'
  };

  const COLORS = [chartColors.primary, chartColors.secondary, chartColors.accent, chartColors.danger, chartColors.purple, chartColors.pink];

  // توليد بيانات وهمية للتحليلات
  const generateAnalyticsData = (): AnalyticsData => {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case '7d':
        startDate = subDays(now, 7);
        break;
      case '30d':
        startDate = subDays(now, 30);
        break;
      case '90d':
        startDate = subDays(now, 90);
        break;
      case '1y':
        startDate = subDays(now, 365);
        break;
      default:
        startDate = subDays(now, 30);
    }

    // توليد بيانات الاتجاهات
    const trends = {
      certificates_issued: [] as any[],
      users_registered: [] as any[],
      revenue: [] as any[]
    };

    const daysDiff = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i < Math.min(daysDiff, 30); i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = format(date, 'MM/dd', { locale: ar });

      const baseValue = 100 + Math.random() * 50;
      const growth = i > 0 ? ((baseValue - (trends.certificates_issued[i-1]?.value || 100)) / (trends.certificates_issued[i-1]?.value || 100)) * 100 : 0;

      trends.certificates_issued.push({
        date: dateStr,
        value: Math.round(baseValue),
        growth: Math.round(growth * 100) / 100
      });

      trends.users_registered.push({
        date: dateStr,
        value: Math.round(baseValue * 0.6),
        growth: Math.round(growth * 100) / 100
      });

      trends.revenue.push({
        date: dateStr,
        value: Math.round(baseValue * 15),
        growth: Math.round(growth * 100) / 100
      });
    }

    // المقاييس الرئيسية
    const kpis = {
      total_certificates: trends.certificates_issued.reduce((sum, item) => sum + item.value, 0),
      total_users: trends.users_registered.reduce((sum, item) => sum + item.value, 0),
      total_revenue: trends.revenue.reduce((sum, item) => sum + item.value, 0),
      avg_processing_time: Math.round(15 + Math.random() * 10),
      growth_rate: Math.round((Math.random() * 20 - 5) * 100) / 100, // -5% to +15%
      conversion_rate: Math.round((75 + Math.random() * 20) * 100) / 100 // 75% to 95%
    };

    // أداء القوالب
    const templates = [
      { name: 'قالب التدريب المهني', certificates: 1250, percentage: 35 },
      { name: 'قالب الشهادة الأكاديمية', certificates: 980, percentage: 28 },
      { name: 'قالب الإنجاز', certificates: 750, percentage: 21 },
      { name: 'قالب المشاركة', certificates: 520, percentage: 16 }
    ].map((template, index) => ({
      ...template,
      color: COLORS[index % COLORS.length]
    }));

    // تحليلات المستخدمين
    const user_analytics = {
      new_users: Math.round(trends.users_registered[trends.users_registered.length - 1]?.value * 0.4 || 0),
      active_users: Math.round(trends.users_registered[trends.users_registered.length - 1]?.value * 0.8 || 0),
      returning_users: Math.round(trends.users_registered[trends.users_registered.length - 1]?.value * 0.2 || 0),
      churn_rate: Math.round((Math.random() * 10 + 2) * 100) / 100,
      avg_session_duration: Math.round(8 + Math.random() * 12)
    };

    return {
      trends,
      kpis,
      templates_performance: templates,
      user_analytics,
      comparison: {
        current_period: kpis,
        previous_period: {
          total_certificates: kpis.total_certificates * 0.85,
          total_users: kpis.total_users * 0.9,
          total_revenue: kpis.total_revenue * 0.8,
          avg_processing_time: kpis.avg_processing_time + 3,
          growth_rate: kpis.growth_rate - 5,
          conversion_rate: kpis.conversion_rate - 8
        },
        improvements: [
          'زيادة في معدل إصدار الشهادات بنسبة 15%',
          'تحسن في سرعة المعالجة بنسبة 12%',
          'ارتفاع معدل رضا المستخدمين إلى 94%'
        ]
      }
    };
  };

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        // محاكاة جلب البيانات
        await new Promise(resolve => setTimeout(resolve, 1500));
        const data = generateAnalyticsData();
        setAnalyticsData(data);
      } catch (error) {
        console.error('خطأ في تحميل التحليلات:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [timeRange]);

  const exportAnalytics = () => {
    if (!analyticsData) return;

    // تصدير التحليلات كـ JSON
    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics_${format(new Date(), 'yyyy-MM-dd')}.json`;
    link.click();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8" dir="rtl">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="mr-3 text-lg text-gray-600">جاري تحميل التحليلات...</span>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8" dir="rtl">
        <div className="text-center text-gray-500">
          <Eye className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>لا يمكن تحميل بيانات التحليلات</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* رأس الصفحة والتحكم */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">التحليلات المتقدمة</h2>
            <p className="text-gray-600">تحليل شامل لأداء النظام والاتجاهات</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">آخر 7 أيام</option>
              <option value="30d">آخر 30 يوم</option>
              <option value="90d">آخر 90 يوم</option>
              <option value="1y">آخر سنة</option>
            </select>
            
            <button
              onClick={exportAnalytics}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              تصدير
            </button>
          </div>
        </div>
      </div>

      {/* المقاييس الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">إجمالي الشهادات</p>
              <p className="text-2xl font-bold text-gray-800">{analyticsData.kpis.total_certificates.toLocaleString('ar-SA')}</p>
              <div className="flex items-center mt-2">
                {analyticsData.kpis.growth_rate >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 ml-1" />
                )}
                <span className={`text-sm ${analyticsData.kpis.growth_rate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(analyticsData.kpis.growth_rate)}%
                </span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">إجمالي المستخدمين</p>
              <p className="text-2xl font-bold text-gray-800">{analyticsData.kpis.total_users.toLocaleString('ar-SA')}</p>
              <div className="flex items-center mt-2">
                <Users className="w-4 h-4 text-green-500 ml-1" />
                <span className="text-sm text-green-600">نشط</span>
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">إجمالي الإيرادات</p>
              <p className="text-2xl font-bold text-gray-800">{analyticsData.kpis.total_revenue.toLocaleString('ar-SA')} ر.س</p>
              <div className="flex items-center mt-2">
                <DollarSign className="w-4 h-4 text-green-500 ml-1" />
                <span className="text-sm text-green-600">شهرياً</span>
              </div>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">وقت المعالجة</p>
              <p className="text-2xl font-bold text-gray-800">{analyticsData.kpis.avg_processing_time} دقيقة</p>
              <div className="flex items-center mt-2">
                <Clock className="w-4 h-4 text-blue-500 ml-1" />
                <span className="text-sm text-blue-600">متوسط</span>
              </div>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* أزرار التنقل بين المخططات */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'trends', label: 'الاتجاهات', icon: TrendingUp },
            { key: 'templates', label: 'أداء القوالب', icon: FileText },
            { key: 'users', label: 'تحليل المستخدمين', icon: Users },
            { key: 'comparison', label: 'المقارنات', icon: Calendar }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveChart(tab.key as any)}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                activeChart === tab.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* المخططات */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {activeChart === 'trends' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">اتجاهات الأداء</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={analyticsData.trends.certificates_issued}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => `التاريخ: ${value}`}
                    formatter={(value, name) => [value.toLocaleString('ar-SA'), name === 'value' ? 'الشهادات' : name]}
                    contentStyle={{ direction: 'rtl' }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    fill={chartColors.primary} 
                    fillOpacity={0.2} 
                    stroke={chartColors.primary} 
                    strokeWidth={2}
                    name="الشهادات"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeChart === 'templates' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">أداء القوالب</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.templates_performance}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="certificates"
                    >
                      {analyticsData.templates_performance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value.toLocaleString('ar-SA'), 'الشهادات']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-4">
                {analyticsData.templates_performance.map((template, index) => (
                  <div key={template.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: template.color }}
                      />
                      <span className="font-medium text-gray-800">{template.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-800">{template.certificates.toLocaleString('ar-SA')}</div>
                      <div className="text-sm text-gray-600">{template.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeChart === 'users' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">تحليل المستخدمين</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{analyticsData.user_analytics.new_users}</div>
                <div className="text-sm text-gray-600">مستخدمين جدد</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{analyticsData.user_analytics.active_users}</div>
                <div className="text-sm text-gray-600">مستخدمين نشطين</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{analyticsData.user_analytics.returning_users}</div>
                <div className="text-sm text-gray-600">مستخدمين عائدين</div>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.trends.users_registered}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => `التاريخ: ${value}`}
                    formatter={(value) => [value.toLocaleString('ar-SA'), 'المستخدمين']}
                    contentStyle={{ direction: 'rtl' }}
                  />
                  <Bar dataKey="value" fill={chartColors.secondary} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeChart === 'comparison' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">مقارنة الفترات</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">الفترة الحالية</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>الشهادات:</span>
                      <span className="font-medium">{analyticsData.comparison.current_period.total_certificates.toLocaleString('ar-SA')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>المستخدمين:</span>
                      <span className="font-medium">{analyticsData.comparison.current_period.total_users.toLocaleString('ar-SA')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الإيرادات:</span>
                      <span className="font-medium">{analyticsData.comparison.current_period.total_revenue.toLocaleString('ar-SA')} ر.س</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">الفترة السابقة</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>الشهادات:</span>
                      <span className="font-medium">{Math.round(analyticsData.comparison.previous_period.total_certificates).toLocaleString('ar-SA')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>المستخدمين:</span>
                      <span className="font-medium">{Math.round(analyticsData.comparison.previous_period.total_users).toLocaleString('ar-SA')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الإيرادات:</span>
                      <span className="font-medium">{Math.round(analyticsData.comparison.previous_period.total_revenue).toLocaleString('ar-SA')} ر.س</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">التحسينات الملاحظة</h4>
                <ul className="space-y-2">
                  {analyticsData.comparison.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;