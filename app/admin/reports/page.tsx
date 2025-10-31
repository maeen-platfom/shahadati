'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  FileText,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Award,
  DollarSign
} from 'lucide-react';
import { format, subDays, subMonths, startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';
import { ar } from 'date-fns/locale';
import Analytics from '@/components/admin/Analytics';
import ReportsGenerator from '@/components/admin/ReportsGenerator';

interface DashboardStats {
  totalCertificates: number;
  totalUsers: number;
  totalRevenue: number;
  processingTime: number;
  growthRate: number;
  activeTemplates: number;
}

interface RecentActivity {
  id: string;
  type: 'certificate_issued' | 'user_registered' | 'template_created' | 'payment_received';
  description: string;
  timestamp: Date;
  amount?: number;
}

type ActiveTab = 'overview' | 'analytics' | 'reports' | 'templates' | 'users';

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // تحميل إحصائيات لوحة التحكم
  const loadDashboardStats = async () => {
    try {
      // محاكاة جلب البيانات من API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStats: DashboardStats = {
        totalCertificates: 12847,
        totalUsers: 3241,
        totalRevenue: 95430,
        processingTime: 12,
        growthRate: 15.8,
        activeTemplates: 18
      };

      setDashboardStats(mockStats);

      // الأنشطة الأخيرة
      const mockActivity: RecentActivity[] = [
        {
          id: '1',
          type: 'certificate_issued',
          description: 'تم إصدار شهادة جديدة للدورة التدريبية',
          timestamp: subDays(new Date(), 0.5),
          amount: 150
        },
        {
          id: '2',
          type: 'user_registered',
          description: 'انضم مستخدم جديد للمنصة',
          timestamp: subDays(new Date(), 1)
        },
        {
          id: '3',
          type: 'template_created',
          description: 'تم إنشاء قالب جديد للشهادات الأكاديمية',
          timestamp: subDays(new Date(), 2)
        },
        {
          id: '4',
          type: 'payment_received',
          description: 'تم استلام دفعة جديدة',
          timestamp: subDays(new Date(), 3),
          amount: 450
        },
        {
          id: '5',
          type: 'certificate_issued',
          description: 'تم إصدار 25 شهادة للدورة المهنية',
          timestamp: subDays(new Date(), 4),
          amount: 750
        }
      ];

      setRecentActivity(mockActivity);

    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardStats();
    setRefreshing(false);
  };

  useEffect(() => {
    loadDashboardStats();
  }, [dateRange]);

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'certificate_issued':
        return <Award className="w-5 h-5 text-green-500" />;
      case 'user_registered':
        return <Users className="w-5 h-5 text-blue-500" />;
      case 'template_created':
        return <FileText className="w-5 h-5 text-purple-500" />;
      case 'payment_received':
        return <DollarSign className="w-5 h-5 text-yellow-500" />;
    }
  };

  const formatActivityTime = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'منذ أقل من ساعة';
    } else if (diffInHours < 24) {
      return `منذ ${diffInHours} ساعة`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `منذ ${diffInDays} يوم`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">جاري تحميل التقارير...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* شريط التنقل العلوي */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">لوحة التقارير والإحصائيات</h1>
              <p className="text-gray-600">تحليل شامل لأداء النظام والإحصائيات</p>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">آخر 7 أيام</option>
                <option value="30d">آخر 30 يوم</option>
                <option value="90d">آخر 90 يوم</option>
                <option value="1y">آخر سنة</option>
              </select>
              
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                تحديث
              </button>
            </div>
          </div>
          
          {/* أزرار التنقل */}
          <div className="flex space-x-1 pb-4">
            {[
              { key: 'overview', label: 'نظرة عامة', icon: BarChart3 },
              { key: 'analytics', label: 'التحليلات المتقدمة', icon: TrendingUp },
              { key: 'reports', label: 'إنشاء التقارير', icon: FileText },
              { key: 'templates', label: 'إحصائيات القوالب', icon: PieChart },
              { key: 'users', label: 'تحليل المستخدمين', icon: Users }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as ActiveTab)}
                className={`px-4 py-2 rounded-t-lg flex items-center gap-2 transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-500 text-white border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* الإحصائيات السريعة */}
            {dashboardStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">إجمالي الشهادات</p>
                      <p className="text-2xl font-bold text-gray-800">{dashboardStats.totalCertificates.toLocaleString('ar-SA')}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                        <span className="text-sm text-green-600">+{dashboardStats.growthRate}%</span>
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
                      <p className="text-2xl font-bold text-gray-800">{dashboardStats.totalUsers.toLocaleString('ar-SA')}</p>
                      <div className="flex items-center mt-2">
                        <Users className="w-4 h-4 text-blue-500 ml-1" />
                        <span className="text-sm text-blue-600">نشط</span>
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
                      <p className="text-2xl font-bold text-gray-800">{dashboardStats.totalRevenue.toLocaleString('ar-SA')} ر.س</p>
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
                      <p className="text-sm text-gray-600 mb-1">متوسط وقت المعالجة</p>
                      <p className="text-2xl font-bold text-gray-800">{dashboardStats.processingTime} دقيقة</p>
                      <div className="flex items-center mt-2">
                        <Clock className="w-4 h-4 text-green-500 ml-1" />
                        <span className="text-sm text-green-600">مُحسّن</span>
                      </div>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* الأنشطة الأخيرة والتحليلات السريعة */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* الأنشطة الأخيرة */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  الأنشطة الأخيرة
                </h3>
                <div className="space-y-4">
                  {recentActivity.map(activity => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">{formatActivityTime(activity.timestamp)}</span>
                          {activity.amount && (
                            <span className="text-sm font-medium text-green-600">{activity.amount.toLocaleString('ar-SA')} ر.س</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* إحصائيات سريعة */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  إحصائيات سريعة
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">معدل التحويل</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">89.2%</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">معدل الرضا</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">94.7%</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">القوالب النشطة</span>
                    </div>
                    <span className="text-lg font-bold text-purple-600">{dashboardStats?.activeTemplates || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-700">متوسط التحميل اليومي</span>
                    </div>
                    <span className="text-lg font-bold text-yellow-600">247</span>
                  </div>
                </div>
              </div>
            </div>

            {/* تحذيرات وإشعارات */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                التنبيهات والملاحظات
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-green-800">النظام يعمل بكفاءة عالية</p>
                    <p className="text-xs text-green-600">جميع العمليات تعمل بشكل طبيعي</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">نمو مستمر في الاستخدام</p>
                    <p className="text-xs text-blue-600">زيادة 15.8% مقارنة بالشهر الماضي</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && <Analytics />}
        
        {activeTab === 'reports' && <ReportsGenerator />}
        
        {activeTab === 'templates' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center" dir="rtl">
            <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">إحصائيات القوالب</h3>
            <p className="text-gray-500 mb-4">قسم تحليل أداء القوالب سيكون متاحاً قريباً</p>
            <button 
              onClick={() => setActiveTab('analytics')}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              عرض التحليلات المتقدمة
            </button>
          </div>
        )}
        
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center" dir="rtl">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">تحليل المستخدمين</h3>
            <p className="text-gray-500 mb-4">قسم تحليل المستخدمين سيكون متاحاً قريباً</p>
            <button 
              onClick={() => setActiveTab('analytics')}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              عرض التحليلات المتقدمة
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;