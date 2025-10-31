'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Activity, 
  Zap, 
  Clock, 
  HardDrive, 
  Wifi, 
  AlertTriangle, 
  TrendingUp,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react';
import { performanceMonitor, PerformanceMetric, PerformanceAlert, type PerformanceStats } from '@/lib/utils/performance';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface PerformanceMonitorProps {
  refreshInterval?: number;
  showAlerts?: boolean;
  compact?: boolean;
}

export default function PerformanceMonitor({ 
  refreshInterval = 5000, 
  showAlerts = true,
  compact = false 
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [isRealTime, setIsRealTime] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('1h');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // تحديث البيانات
  const refreshData = () => {
    setMetrics([...performanceMonitor.getMetrics()]);
    setAlerts([...performanceMonitor.getAlerts()]);
    setStats(performanceMonitor.getStats());
  };

  // تفعيل/إلغاء التحديث التلقائي
  useEffect(() => {
    if (isRealTime) {
      intervalRef.current = setInterval(refreshData, refreshInterval);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRealTime, refreshInterval]);

  // تحميل البيانات الأولية
  useEffect(() => {
    refreshData();
  }, []);

  // تصدير البيانات
  const exportData = () => {
    const data = {
      metrics: metrics,
      alerts: alerts,
      stats: stats,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // تصفية البيانات حسب الوقت
  const filterMetricsByTime = (metrics: PerformanceMetric[]): PerformanceMetric[] => {
    const now = Date.now();
    const ranges = {
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000
    };
    
    const cutoff = now - (ranges[timeRange as keyof typeof ranges] || ranges['1h']);
    return metrics.filter(m => m.timestamp > cutoff);
  };

  // تحويل البيانات للرسوم البيانية
  const getChartData = () => {
    const filtered = filterMetricsByTime(metrics);
    const grouped = filtered.reduce((acc, metric) => {
      const time = new Date(metric.timestamp).toLocaleTimeString('ar-EG', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      if (!acc[time]) {
        acc[time] = { time, load: 0, render: 0, api: 0, memory: 0 };
      }
      
      acc[time][metric.category] = metric.value;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped).slice(-20); // آخر 20 نقطة
  };

  // إحصائيات سريعة
  const QuickStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Clock className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">متوسط التحميل</p>
              <p className="text-lg font-semibold">
                {stats ? `${Math.round(stats.avgLoadTime)}ms` : '---'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Zap className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">متوسط API</p>
              <p className="text-lg font-semibold">
                {stats ? `${Math.round(stats.avgApiResponse)}ms` : '---'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 space-x-reverse">
            <HardDrive className="h-4 w-4 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">استخدام الذاكرة</p>
              <p className="text-lg font-semibold">
                {stats ? `${Math.round(stats.memoryUsage)}MB` : '---'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 space-x-reverse">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">التنبيهات</p>
              <p className="text-lg font-semibold">
                {stats ? stats.totalAlerts : '---'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // الرسم البياني الرئيسي
  const PerformanceChart = () => {
    const chartData = getChartData();

    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <Activity className="h-5 w-5" />
              <span>مراقبة الأداء في الوقت الفعلي</span>
            </CardTitle>
            <div className="flex space-x-2 space-x-reverse">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRealTime(!isRealTime)}
              >
                <RefreshCw className={`h-4 w-4 ${isRealTime ? 'animate-spin' : ''}`} />
              </Button>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-sm border rounded px-2"
              >
                <option value="15m">آخر 15 دقيقة</option>
                <option value="1h">آخر ساعة</option>
                <option value="6h">آخر 6 ساعات</option>
                <option value="24h">آخر 24 ساعة</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(value) => `الوقت: ${value}`}
                  formatter={(value, name) => [`${value}ms`, name]}
                />
                <Line 
                  type="monotone" 
                  dataKey="load" 
                  stroke="#0088FE" 
                  name="زمن التحميل"
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="api" 
                  stroke="#00C49F" 
                  name="استجابة API"
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="render" 
                  stroke="#FFBB28" 
                  name="زمن العرض"
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="memory" 
                  stroke="#FF8042" 
                  name="استخدام الذاكرة"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  };

  // جدول التنبيهات
  const AlertsTable = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 space-x-reverse">
          <AlertTriangle className="h-5 w-5" />
          <span>التنبيهات والتحذيرات</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {alerts.slice(-10).reverse().map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border ${
                alert.severity === 'error' 
                  ? 'bg-red-50 border-red-200' 
                  : alert.severity === 'warning'
                  ? 'bg-orange-50 border-orange-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Badge 
                    variant={
                      alert.severity === 'error' 
                        ? 'destructive' 
                        : alert.severity === 'warning'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {alert.severity === 'error' ? 'خطأ' : 
                     alert.severity === 'warning' ? 'تحذير' : 'معلومات'}
                  </Badge>
                  <span className="text-sm">{alert.message}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(alert.timestamp).toLocaleTimeString('ar-EG')}
                </span>
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>لا توجد تنبيهات حالياً</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // توزيع الأداء حسب الفئة
  const CategoryDistribution = () => {
    const categoryData = metrics.reduce((acc, metric) => {
      const category = metric.category;
      if (!acc[category]) {
        acc[category] = { name: category, value: 0, count: 0 };
      }
      acc[category].value += metric.value;
      acc[category].count++;
      return acc;
    }, {} as Record<string, any>);

    const chartData = Object.values(categoryData).map((item: any) => ({
      name: item.name === 'load' ? 'التحميل' :
            item.name === 'render' ? 'العرض' :
            item.name === 'api' ? 'API' :
            item.name === 'memory' ? 'الذاكرة' :
            item.name === 'network' ? 'الشبكة' : item.name,
      value: Math.round(item.value / item.count)
    }));

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <PieChart className="h-5 w-5" />
            <span>متوسط الأداء حسب الفئة</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}ms`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}ms`, 'المتوسط']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (compact) {
    return (
      <div className="space-y-4">
        <QuickStats />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PerformanceChart />
          <AlertsTable />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* الإحصائيات السريعة */}
      <QuickStats />

      {/* الرسوم البيانية والتحليلات */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="alerts">التنبيهات</TabsTrigger>
          <TabsTrigger value="metrics">المقاييس</TabsTrigger>
          <TabsTrigger value="export">تصدير</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PerformanceChart />
            <CategoryDistribution />
          </div>
          <AlertsTable />
        </TabsContent>

        <TabsContent value="alerts">
          <AlertsTable />
        </TabsContent>

        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل المقاييس</CardTitle>
              <CardDescription>جميع مقاييس الأداء المسجلة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {metrics.slice(-50).reverse().map((metric, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 border rounded"
                  >
                    <div>
                      <span className="font-medium">{metric.name}</span>
                      <Badge variant="outline" className="ml-2">
                        {metric.category}
                      </Badge>
                    </div>
                    <div className="text-left">
                      <span className="font-mono">{metric.value} {metric.unit}</span>
                      <div className="text-xs text-gray-500">
                        {new Date(metric.timestamp).toLocaleTimeString('ar-EG')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <Download className="h-5 w-5" />
                <span>تصدير البيانات</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                قم بتصدير بيانات الأداء لتحليلها خارجياً أو مشاركتها
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button onClick={exportData} className="flex items-center space-x-2 space-x-reverse">
                  <Download className="h-4 w-4" />
                  <span>تصدير JSON</span>
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.print()}
                  className="flex items-center space-x-2 space-x-reverse"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>طباعة التقرير</span>
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => performanceMonitor.reset()}
                  className="flex items-center space-x-2 space-x-reverse text-red-600"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>إعادة تعيين</span>
                </Button>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>عدد المقاييس: {metrics.length}</p>
                <p>عدد التنبيهات: {alerts.length}</p>
                <p>آخر تحديث: {new Date().toLocaleString('ar-EG')}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}