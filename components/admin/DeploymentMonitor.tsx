'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Monitor, 
  Activity, 
  Server, 
  Database, 
  Wifi, 
  HardDrive,
  Cpu,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Eye
} from 'lucide-react';
import { deploymentService } from '@/lib/utils/deployment';

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: {
    in: number;
    out: number;
  };
  responseTime: number;
  uptime: number;
  errorRate: number;
  requestsPerMinute: number;
  activeConnections: number;
}

interface PerformanceData {
  timestamp: string;
  cpu: number;
  memory: number;
  responseTime: number;
  errorRate: number;
}

interface AlertItem {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  resolved: boolean;
  source: 'system' | 'application' | 'database' | 'network';
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  source: string;
  details?: string;
}

export default function DeploymentMonitor() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: { in: 0, out: 0 },
    responseTime: 0,
    uptime: 0,
    errorRate: 0,
    requestsPerMinute: 0,
    activeConnections: 0
  });

  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  useEffect(() => {
    loadSystemMetrics();
    loadAlerts();
    loadLogs();
    generatePerformanceData();

    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadSystemMetrics();
        loadAlerts();
        loadLogs();
        generatePerformanceData();
        setLastUpdate(new Date());
      }, refreshInterval * 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval]);

  const loadSystemMetrics = async () => {
    try {
      const systemMetrics = await deploymentService.getSystemMetrics();
      setMetrics(systemMetrics);
    } catch (error) {
      console.error('خطأ في تحميل مؤشرات النظام:', error);
      // بيانات وهمية للعرض
      setMetrics({
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        disk: Math.random() * 100,
        network: {
          in: Math.random() * 1000,
          out: Math.random() * 1000
        },
        responseTime: 50 + Math.random() * 200,
        uptime: 99.5 + Math.random() * 0.5,
        errorRate: Math.random() * 5,
        requestsPerMinute: Math.random() * 1000,
        activeConnections: Math.floor(Math.random() * 50)
      });
    }
  };

  const loadAlerts = async () => {
    try {
      const systemAlerts = await deploymentService.getAlerts();
      setAlerts(systemAlerts);
    } catch (error) {
      console.error('خطأ في تحميل التنبيهات:', error);
      // تنبيهات وهمية
      setAlerts([
        {
          id: '1',
          type: 'warning',
          message: 'استخدام الذاكرة يتجاوز 80%',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          resolved: false,
          source: 'system'
        },
        {
          id: '2',
          type: 'info',
          message: 'تم نشر تحديث بنجاح',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          resolved: true,
          source: 'application'
        }
      ]);
    }
  };

  const loadLogs = async () => {
    try {
      const systemLogs = await deploymentService.getLogs();
      setLogs(systemLogs);
    } catch (error) {
      console.error('خطأ في تحميل السجلات:', error);
      // سجلات وهمية
      setLogs([
        {
          id: '1',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          level: 'info',
          message: 'تم استلام طلب HTTP',
          source: 'api',
          details: 'GET /api/certificates'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 120000).toISOString(),
          level: 'warn',
          message: 'تحذير: استخدام عالي للذاكرة',
          source: 'system',
          details: 'Memory usage: 85%'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 180000).toISOString(),
          level: 'error',
          message: 'خطأ في الاتصال بقاعدة البيانات',
          source: 'database',
          details: 'Connection timeout'
        }
      ]);
    }
  };

  const generatePerformanceData = () => {
    const now = new Date();
    const newData: PerformanceData = {
      timestamp: now.toISOString(),
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      responseTime: 50 + Math.random() * 200,
      errorRate: Math.random() * 5
    };

    setPerformanceData(prev => {
      const updated = [...prev, newData];
      return updated.slice(-50); // الاحتفاظ بآخر 50 نقطة
    });
  };

  const resolveAlert = async (id: string) => {
    try {
      await deploymentService.resolveAlert(id);
      setAlerts(prev => prev.map(alert => 
        alert.id === id ? { ...alert, resolved: true } : alert
      ));
    } catch (error) {
      console.error('خطأ في حل التنبيه:', error);
    }
  };

  const exportLogs = () => {
    const logData = logs.map(log => ({
      timestamp: log.timestamp,
      level: log.level,
      message: log.message,
      source: log.source,
      details: log.details
    }));

    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'text-red-500';
    if (value >= thresholds.warning) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertCircle className="h-3 w-3 text-red-500" />;
      case 'warn': return <AlertCircle className="h-3 w-3 text-yellow-500" />;
      case 'info': return <CheckCircle className="h-3 w-3 text-blue-500" />;
      default: return <Activity className="h-3 w-3 text-gray-500" />;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}يوم ${hours}ساعة`;
    if (hours > 0) return `${hours}ساعة ${minutes}دقيقة`;
    return `${minutes}دقيقة`;
  };

  return (
    <div className="space-y-6">
      {/* العنوان والتحكم */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            مراقب النشر
          </CardTitle>
          <CardDescription>
            مراقبة النظام والأداء في الوقت الفعلي
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant={metrics.errorRate < 1 ? 'default' : 'destructive'}>
                حالة النظام: {metrics.errorRate < 1 ? 'طبيعي' : 'تحذير'}
              </Badge>
              <p className="text-sm text-muted-foreground">
                آخر تحديث: {lastUpdate.toLocaleTimeString('ar-SA')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={exportLogs}>
                <Download className="h-4 w-4 mr-2" />
                تصدير السجلات
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  loadSystemMetrics();
                  loadAlerts();
                  loadLogs();
                  generatePerformanceData();
                  setLastUpdate(new Date());
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                تحديث
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* مؤشرات النظام */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">استخدام المعالج</p>
                <p className={`text-2xl font-bold ${getStatusColor(metrics.cpu, { warning: 70, critical: 90 })}`}>
                  {metrics.cpu.toFixed(1)}%
                </p>
              </div>
              <Cpu className="h-8 w-8 text-muted-foreground" />
            </div>
            <Progress value={metrics.cpu} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">استخدام الذاكرة</p>
                <p className={`text-2xl font-bold ${getStatusColor(metrics.memory, { warning: 70, critical: 90 })}`}>
                  {metrics.memory.toFixed(1)}%
                </p>
              </div>
              <Database className="h-8 w-8 text-muted-foreground" />
            </div>
            <Progress value={metrics.memory} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">استخدام القرص</p>
                <p className={`text-2xl font-bold ${getStatusColor(metrics.disk, { warning: 80, critical: 95 })}`}>
                  {metrics.disk.toFixed(1)}%
                </p>
              </div>
              <HardDrive className="h-8 w-8 text-muted-foreground" />
            </div>
            <Progress value={metrics.disk} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">وقت الاستجابة</p>
                <p className={`text-2xl font-bold ${getStatusColor(metrics.responseTime, { warning: 200, critical: 500 })}`}>
                  {metrics.responseTime.toFixed(0)}مللي
                </p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
            <Progress value={Math.min(metrics.responseTime / 10, 100)} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* معلومات إضافية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Wifi className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium text-muted-foreground">وقت التشغيل</p>
              <p className="text-lg font-bold">{metrics.uptime.toFixed(2)}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium text-muted-foreground">معدل الأخطاء</p>
              <p className="text-lg font-bold text-red-500">{metrics.errorRate.toFixed(2)}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Activity className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium text-muted-foreground">طلبات/دقيقة</p>
              <p className="text-lg font-bold">{metrics.requestsPerMinute.toFixed(0)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Server className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium text-muted-foreground">الاتصالات النشطة</p>
              <p className="text-lg font-bold">{metrics.activeConnections}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* التفاصيل */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="performance">الأداء</TabsTrigger>
              <TabsTrigger value="alerts">التنبيهات</TabsTrigger>
              <TabsTrigger value="logs">السجلات</TabsTrigger>
            </TabsList>

            {/* رسم الأداء */}
            <TabsContent value="performance" className="space-y-4">
              <div className="h-64 border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">رسم الأداء</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>استخدام المعالج</span>
                      <span>{metrics.cpu.toFixed(1)}%</span>
                    </div>
                    <Progress value={metrics.cpu} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>استخدام الذاكرة</span>
                      <span>{metrics.memory.toFixed(1)}%</span>
                    </div>
                    <Progress value={metrics.memory} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>وقت الاستجابة</span>
                      <span>{metrics.responseTime.toFixed(0)}ms</span>
                    </div>
                    <Progress value={Math.min(metrics.responseTime / 10, 100)} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>معدل الأخطاء</span>
                      <span>{metrics.errorRate.toFixed(2)}%</span>
                    </div>
                    <Progress value={metrics.errorRate * 10} />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* التنبيهات */}
            <TabsContent value="alerts" className="space-y-4">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{alert.message}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant={alert.resolved ? 'secondary' : 'destructive'}>
                            {alert.source}
                          </Badge>
                          {!alert.resolved && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => resolveAlert(alert.id)}
                            >
                              حل
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleString('ar-SA')}
                      </p>
                    </div>
                  </div>
                ))}
                
                {alerts.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-muted-foreground">لا توجد تنبيهات نشطة</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* السجلات */}
            <TabsContent value="logs" className="space-y-4">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-2 border rounded text-sm">
                    {getLogIcon(log.level)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleTimeString('ar-SA')}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {log.source}
                        </Badge>
                      </div>
                      <p className="font-medium">{log.message}</p>
                      {log.details && (
                        <p className="text-muted-foreground text-xs">{log.details}</p>
                      )}
                    </div>
                  </div>
                ))}
                
                {logs.length === 0 && (
                  <div className="text-center py-8">
                    <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">لا توجد سجلات متاحة</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}