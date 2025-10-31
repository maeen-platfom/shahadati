"use client"

import React, { useState, useEffect } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts'
import { 
  Users, 
  FileText, 
  Award, 
  CheckCircle, 
  TrendingUp, 
  Clock,
  AlertCircle,
  Activity,
  Database,
  Zap,
  HardDrive,
  Settings,
  RefreshCw,
  Target,
  TrendingDown
} from 'lucide-react'
import { performanceMonitor, type PerformanceMetric, type PerformanceAlert, type PerformanceStats } from '@/lib/utils/performance'
import { cacheHelpers } from '@/lib/utils/cache'
import { dbOptimize } from '@/lib/utils/database'

interface DashboardStats {
  totalCertificates: number
  totalTemplates: number
  totalUsers: number
  totalVerifications: number
  todayCertificates: number
  weekCertificates: number
  monthCertificates: number
  activeUsers: number
}

interface PerformanceStats {
  avgLoadTime: number
  avgApiResponse: number
  memoryUsage: number
  cacheHitRate: number
  activeAlerts: number
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical'
}

interface ChartData {
  date: string
  certificates: number
  verifications: number
  users: number
}

interface TemplateUsage {
  name: string
  count: number
  percentage: number
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCertificates: 0,
    totalTemplates: 0,
    totalUsers: 0,
    totalVerifications: 0,
    todayCertificates: 0,
    weekCertificates: 0,
    monthCertificates: 0,
    activeUsers: 0
  })

  const [performanceStats, setPerformanceStats] = useState<PerformanceStats>({
    avgLoadTime: 0,
    avgApiResponse: 0,
    memoryUsage: 0,
    cacheHitRate: 0,
    activeAlerts: 0,
    systemHealth: 'excellent'
  })

  const [chartData, setChartData] = useState<ChartData[]>([])
  const [templateUsage, setTemplateUsage] = useState<TemplateUsage[]>([])
  const [recentMetrics, setRecentMetrics] = useState<PerformanceMetric[]>([])
  const [recentAlerts, setRecentAlerts] = useState<PerformanceAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week')

  // جلب بيانات لوحة التحكم مع بيانات الأداء
  const fetchDashboardData = async () => {
    setRefreshing(true)
    
    try {
      // استخدام التخزين المؤقت لتحسين الأداء
      const data = await cacheHelpers.cacheQuery('dashboard-data', async () => {
        // محاكاة استدعاء API
        await new Promise(resolve => setTimeout(resolve, 800))
        
        return {
          stats: {
            totalCertificates: 15420,
            totalTemplates: 48,
            totalUsers: 3240,
            totalVerifications: 12850,
            todayCertificates: 156,
            weekCertificates: 892,
            monthCertificates: 3240,
            activeUsers: 215
          },
          chartData: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('ar-SA'),
            certificates: Math.floor(Math.random() * 200) + 50,
            verifications: Math.floor(Math.random() * 180) + 30,
            users: Math.floor(Math.random() * 50) + 10
          })),
          templateUsage: [
            { name: 'شهادة حضور دورة تدريبية', count: 3240, percentage: 35.2 },
            { name: 'شهادة إتمام برنامج تدريبي', count: 2890, percentage: 31.4 },
            { name: 'شهادة مشاركة في ورشة عمل', count: 2156, percentage: 23.4 },
            { name: 'شهادة إنجاز مشروع', count: 892, percentage: 9.7 },
            { name: 'أخرى', count: 42, percentage: 0.3 }
          ]
        }
      }, defaultCache, 5 * 60 * 1000) // 5 دقائق تخزين مؤقت

      // تطبيق البيانات المحصلة
      setStats(data.stats)
      setChartData(data.chartData)
      setTemplateUsage(data.templateUsage)
      
    } catch (error) {
      console.error('خطأ في جلب بيانات لوحة التحكم:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // جلب بيانات الأداء
  const fetchPerformanceData = () => {
    try {
      const monitorStats = performanceMonitor.getStats()
      const metrics = performanceMonitor.getMetrics()
      const alerts = performanceMonitor.getAlerts()
      
      // تحديد حالة النظام
      let systemHealth: PerformanceStats['systemHealth'] = 'excellent'
      if (monitorStats.avgLoadTime > 3000 || monitorStats.avgApiResponse > 2000) {
        systemHealth = 'warning'
      }
      if (monitorStats.avgLoadTime > 5000 || monitorStats.avgApiResponse > 5000) {
        systemHealth = 'critical'
      }
      if (monitorStats.avgLoadTime < 1000 && monitorStats.avgApiResponse < 500) {
        systemHealth = 'excellent'
      }

      setPerformanceStats({
        avgLoadTime: Math.round(monitorStats.avgLoadTime),
        avgApiResponse: Math.round(monitorStats.avgApiResponse),
        memoryUsage: Math.round(monitorStats.memoryUsage),
        cacheHitRate: Math.round(monitorStats.hitRate || 0),
        activeAlerts: monitorStats.totalAlerts,
        systemHealth
      })

      setRecentMetrics(metrics.slice(-10))
      setRecentAlerts(alerts.slice(-5))
    } catch (error) {
      console.error('خطأ في جلب بيانات الأداء:', error)
    }
  }

  // محاكاة البيانات - يجب استبدالها ببيانات حقيقية من API
  useEffect(() => {
    fetchDashboardData()
    fetchPerformanceData()
  }, [timeRange])

  // تحديث دوري لبيانات الأداء
  useEffect(() => {
    const interval = setInterval(fetchPerformanceData, 30000) // كل 30 ثانية
    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number) => num.toLocaleString('ar-SA')
  
  const StatCard = ({ title, value, description, icon: Icon, trend, color }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatNumber(value)}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
        {trend && (
          <div className="flex items-center mt-2">
            <TrendingUp className="h-3 w-3 text-green-500 ml-1" />
            <span className="text-xs text-green-500">+12% عن الأسبوع الماضي</span>
          </div>
        )}
      </CardContent>
    </Card>
  )

  // بطاقة أداء النظام
  const PerformanceCard = () => {
    const getHealthColor = (health: PerformanceStats['systemHealth']) => {
      switch (health) {
        case 'excellent': return 'text-green-500'
        case 'good': return 'text-blue-500'
        case 'warning': return 'text-orange-500'
        case 'critical': return 'text-red-500'
        default: return 'text-gray-500'
      }
    }

    const getHealthText = (health: PerformanceStats['systemHealth']) => {
      switch (health) {
        case 'excellent': return 'ممتاز'
        case 'good': return 'جيد'
        case 'warning': return 'يحتاج انتباه'
        case 'critical': return 'حرج'
        default: return 'غير معروف'
      }
    }

    const getHealthIcon = (health: PerformanceStats['systemHealth']) => {
      switch (health) {
        case 'excellent': return <CheckCircle className="h-5 w-5 text-green-500" />
        case 'good': return <Activity className="h-5 w-5 text-blue-500" />
        case 'warning': return <AlertCircle className="h-5 w-5 text-orange-500" />
        case 'critical': return <AlertCircle className="h-5 w-5 text-red-500" />
        default: return <Activity className="h-5 w-5 text-gray-500" />
      }
    }

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            أداء النظام
          </CardTitle>
          {getHealthIcon(performanceStats.systemHealth)}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold">حالة النظام</div>
              <p className={`text-sm font-medium ${getHealthColor(performanceStats.systemHealth)}`}>
                {getHealthText(performanceStats.systemHealth)}
              </p>
            </div>
            <div className="text-left text-xs text-muted-foreground">
              <div>تحميل: {performanceStats.avgLoadTime}ms</div>
              <div>API: {performanceStats.avgApiResponse}ms</div>
              <div>ذاكرة: {performanceStats.memoryUsage}MB</div>
              <div>تخزين مؤقت: {performanceStats.cacheHitRate}%</div>
            </div>
          </div>
          {performanceStats.activeAlerts > 0 && (
            <div className="mt-2 flex items-center">
              <AlertCircle className="h-3 w-3 text-orange-500 ml-1" />
              <span className="text-xs text-orange-500">
                {performanceStats.activeAlerts} تنبيه نشط
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6" dir="rtl">
      {/* العنوان الرئيسي */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم المشرفين</h1>
          <p className="text-muted-foreground mt-2">
            نظرة عامة على منصة شهاداتي - آخر تحديث: {new Date().toLocaleString('ar-SA')}
          </p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <Badge 
            variant="outline" 
            className={
              performanceStats.systemHealth === 'excellent' ? 'text-green-600' :
              performanceStats.systemHealth === 'good' ? 'text-blue-600' :
              performanceStats.systemHealth === 'warning' ? 'text-orange-600' :
              'text-red-600'
            }
          >
            <Activity className="h-3 w-3 ml-1" />
            {performanceStats.systemHealth === 'excellent' ? 'نظام ممتاز' :
             performanceStats.systemHealth === 'good' ? 'نظام جيد' :
             performanceStats.systemHealth === 'warning' ? 'يحتاج انتباه' :
             'وضع حرج'}
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchDashboardData()
              fetchPerformanceData()
            }}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ml-2 ${refreshing ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          
          <Button variant="outline" size="sm" asChild>
            <a href="/admin/performance">
              <Zap className="h-4 w-4 ml-2" />
              مراقبة الأداء
            </a>
          </Button>
        </div>
      </div>

      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="إجمالي الشهادات"
          value={stats.totalCertificates}
          description={`+${stats.todayCertificates} اليوم`}
          icon={FileText}
          color="text-blue-500"
          trend
        />
        <StatCard
          title="القوالب المتاحة"
          value={stats.totalTemplates}
          description="قوالب معتمدة"
          icon={Award}
          color="text-purple-500"
        />
        <StatCard
          title="المستخدمين المسجلين"
          value={stats.totalUsers}
          description={`${stats.activeUsers} نشط اليوم`}
          icon={Users}
          color="text-green-500"
          trend
        />
        <StatCard
          title="التحققات المكتملة"
          value={stats.totalVerifications}
          description="عمليات تحقق ناجحة"
          icon={CheckCircle}
          color="text-orange-500"
        />
        <PerformanceCard />
      </div>

      {/* الإحصائيات الزمنية */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 ml-2 text-blue-500" />
              إحصائيات اليوم
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{formatNumber(stats.todayCertificates)}</div>
            <p className="text-sm text-muted-foreground">شهادة تم إنشاؤها اليوم</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 ml-2 text-green-500" />
              إحصائيات الأسبوع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{formatNumber(stats.weekCertificates)}</div>
            <p className="text-sm text-muted-foreground">شهادة هذا الأسبوع</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 ml-2 text-purple-500" />
              إحصائيات الشهر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{formatNumber(stats.monthCertificates)}</div>
            <p className="text-sm text-muted-foreground">شهادة هذا الشهر</p>
          </CardContent>
        </Card>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* رسم بياني للإحصائيات الزمنية */}
        <Card>
          <CardHeader>
            <CardTitle>نمو النشاط خلال الأسبوع</CardTitle>
            <CardDescription>
              إحصائيات الشهادات والتحققات والمستخدمين الجدد
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    fontSize={12}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="certificates"
                    stackId="1"
                    stroke="#4f46e5"
                    fill="#4f46e5"
                    fillOpacity={0.6}
                    name="الشهادات"
                  />
                  <Area
                    type="monotone"
                    dataKey="verifications"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                    name="التحققات"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* رسم دائري لاستخدام القوالب */}
        <Card>
          <CardHeader>
            <CardTitle>استخدام القوالب</CardTitle>
            <CardDescription>
              توزيع الشهادات حسب نوع القالب
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={templateUsage}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {templateUsage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* تفاصيل استخدام القوالب */}
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل استخدام القوالب</CardTitle>
          <CardDescription>
            قائمة تفصيلية بأنواع القوالب الأكثر استخداماً
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {templateUsage.map((template, index) => (
              <div key={template.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm font-medium">{template.name}</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-sm text-muted-foreground">
                    {formatNumber(template.count)}
                  </span>
                  <Badge variant="secondary">
                    {template.percentage}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* الأنشطة الحديثة والتنبيهات */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 ml-2 text-orange-500" />
              الأنشطة الحديثة
            </CardTitle>
            <CardDescription>
              آخر العمليات والأنشطة على المنصة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'تم إنشاء شهادة جديدة', user: 'أحمد محمد', time: 'منذ 5 دقائق', type: 'certificate' },
                { action: 'تم التحقق من شهادة', user: 'فاطمة علي', time: 'منذ 12 دقيقة', type: 'verification' },
                { action: 'تسجيل مستخدم جديد', user: 'محمد السعد', time: 'منذ 25 دقيقة', type: 'user' },
                { action: 'تم إنشاء قالب جديد', user: 'نورا أحمد', time: 'منذ ساعة', type: 'template' },
                { action: 'تم تحديث قالب موجود', user: 'عبدالله خالد', time: 'منذ ساعتين', type: 'template' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'certificate' ? 'bg-blue-500' :
                      activity.type === 'verification' ? 'bg-green-500' :
                      activity.type === 'user' ? 'bg-purple-500' : 'bg-orange-500'
                    }`} />
                    <span className="text-sm">{activity.action}</span>
                    <span className="text-sm text-muted-foreground">بواسطة {activity.user}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 ml-2 text-purple-500" />
              تنبيهات الأداء
            </CardTitle>
            <CardDescription>
              أحدث تنبيهات وأخبار الأداء
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.length > 0 ? recentAlerts.map((alert, index) => (
                <div key={alert.id} className="flex items-start space-x-3 space-x-reverse p-3 border rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.severity === 'error' ? 'bg-red-500' :
                    alert.severity === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant={
                        alert.severity === 'error' ? 'destructive' :
                        alert.severity === 'warning' ? 'secondary' : 'outline'
                      }>
                        {alert.severity === 'error' ? 'خطأ' :
                         alert.severity === 'warning' ? 'تحذير' : 'معلومات'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleTimeString('ar-SA')}
                      </span>
                    </div>
                    <p className="text-sm">{alert.message}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p>لا توجد تنبيهات أداء جديدة</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}