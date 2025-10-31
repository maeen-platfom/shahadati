'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Settings, 
  Monitor,
  Server,
  Database,
  Globe,
  Clock,
  TrendingUp
} from 'lucide-react';
import { deploymentService } from '@/lib/utils/deployment';

interface DeploymentStatus {
  status: 'idle' | 'running' | 'success' | 'error' | 'warning';
  message: string;
  timestamp: string;
  progress: number;
  environment: 'development' | 'staging' | 'production';
  version: string;
  buildTime?: number;
  performance?: {
    responseTime: number;
    uptime: number;
    errorRate: number;
  };
}

interface DeploymentLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  details?: string;
}

export default function DeploymentManager() {
  const [status, setStatus] = useState<DeploymentStatus>({
    status: 'idle',
    message: 'جاهز للنشر',
    timestamp: new Date().toISOString(),
    progress: 0,
    environment: 'production',
    version: '1.0.0'
  });

  const [logs, setLogs] = useState<DeploymentLog[]>([]);
  const [autoDeploy, setAutoDeploy] = useState(false);
  const [deploymentHistory, setDeploymentHistory] = useState<DeploymentStatus[]>([]);

  useEffect(() => {
    loadCurrentStatus();
    loadDeploymentHistory();
  }, []);

  const loadCurrentStatus = async () => {
    try {
      const currentStatus = await deploymentService.getStatus();
      setStatus(currentStatus);
    } catch (error) {
      console.error('خطأ في تحميل حالة النشر:', error);
    }
  };

  const loadDeploymentHistory = async () => {
    try {
      const history = await deploymentService.getHistory();
      setDeploymentHistory(history);
    } catch (error) {
      console.error('خطأ في تحميل تاريخ النشر:', error);
    }
  };

  const startDeployment = async () => {
    setStatus(prev => ({ ...prev, status: 'running', progress: 0 }));
    
    try {
      // محاكاة عملية النشر
      const steps = [
        { name: 'فحص البناء', duration: 2000 },
        { name: 'بناء المشروع', duration: 5000 },
        { name: 'اختبار التكامل', duration: 3000 },
        { name: 'نشر Edge Functions', duration: 4000 },
        { name: 'تحديث قاعدة البيانات', duration: 2000 },
        { name: 'النشر النهائي', duration: 1000 }
      ];

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        setStatus(prev => ({ 
          ...prev, 
          message: `جاري ${step.name}...`,
          progress: ((i + 1) / steps.length) * 100
        }));

        // إضافة سجل
        addLog('info', `بدء ${step.name}`, `البدء في تنفيذ خطوة ${step.name}`);

        await new Promise(resolve => setTimeout(resolve, step.duration));

        addLog('success', `${step.name} مكتمل`, `تمت خطوة ${step.name} بنجاح`);
      }

      const finalStatus: DeploymentStatus = {
        status: 'success',
        message: 'تم النشر بنجاح!',
        timestamp: new Date().toISOString(),
        progress: 100,
        environment: 'production',
        version: '1.0.1',
        buildTime: 17000,
        performance: {
          responseTime: 120,
          uptime: 99.9,
          errorRate: 0.1
        }
      };

      setStatus(finalStatus);
      setDeploymentHistory(prev => [finalStatus, ...prev.slice(0, 4)]);
      
      addLog('success', 'النشر مكتمل', 'تم نشر التطبيق بنجاح في بيئة الإنتاج');

    } catch (error) {
      const errorStatus: DeploymentStatus = {
        status: 'error',
        message: 'فشل في النشر',
        timestamp: new Date().toISOString(),
        progress: 0,
        environment: 'production',
        version: '1.0.0'
      };
      
      setStatus(errorStatus);
      addLog('error', 'فشل النشر', `خطأ في عملية النشر: ${error.message}`);
    }
  };

  const addLog = (level: DeploymentLog['level'], message: string, details?: string) => {
    const newLog: DeploymentLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      level,
      message,
      details
    };
    
    setLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  const rollbackDeployment = async () => {
    setStatus(prev => ({ ...prev, status: 'running', message: 'جاري العودة للإصدار السابق...' }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setStatus(prev => ({
        ...prev,
        status: 'success',
        message: 'تمت العودة للإصدار السابق بنجاح',
        progress: 100,
        version: '1.0.0'
      }));

      addLog('warning', 'العودة للإصدار السابق', 'تم التراجع للإصدار 1.0.0');

    } catch (error) {
      setStatus(prev => ({ ...prev, status: 'error', message: 'فشل في العودة للإصدار السابق' }));
      addLog('error', 'فشل العودة', 'حدث خطأ أثناء التراجع للإصدار السابق');
    }
  };

  const getStatusIcon = () => {
    switch (status.status) {
      case 'running':
        return <Play className="h-4 w-4 animate-pulse text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Pause className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status.status) {
      case 'running': return 'text-blue-500';
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('ar-SA', {
      hour12: true,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* الحالة الحالية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            مدير النشر
          </CardTitle>
          <CardDescription>
            إدارة عمليات النشر والمراقبة في بيئة الإنتاج
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* معلومات الحالة */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div>
                <p className={`font-medium ${getStatusColor()}`}>{status.message}</p>
                <p className="text-sm text-muted-foreground">
                  {formatTime(status.timestamp)}
                </p>
              </div>
            </div>
            <Badge variant={status.status === 'success' ? 'default' : 'secondary'}>
              {status.environment}
            </Badge>
          </div>

          {/* شريط التقدم */}
          {status.status === 'running' && (
            <div className="space-y-2">
              <Progress value={status.progress} className="w-full" />
              <p className="text-sm text-center text-muted-foreground">
                {Math.round(status.progress)}% مكتمل
              </p>
            </div>
          )}

          {/* معلومات الإصدار */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">الإصدار</p>
              <p className="font-mono text-lg">{status.version}</p>
            </div>
            {status.buildTime && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">وقت البناء</p>
                <p className="text-lg">{(status.buildTime / 1000).toFixed(1)}ث</p>
              </div>
            )}
            {status.performance && (
              <>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">وقت الاستجابة</p>
                  <p className="text-lg">{status.performance.responseTime}مللي</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">وقت التشغيل</p>
                  <p className="text-lg">{status.performance.uptime}%</p>
                </div>
              </>
            )}
          </div>

          {/* أزرار التحكم */}
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={startDeployment} 
              disabled={status.status === 'running'}
              className="flex-1"
            >
              {status.status === 'running' ? 'جاري النشر...' : 'بدء النشر'}
            </Button>
            
            {status.status === 'success' && (
              <Button 
                variant="outline" 
                onClick={rollbackDeployment}
                disabled={status.status === 'running'}
              >
                العودة للإصدار السابق
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={loadCurrentStatus}
            >
              تحديث الحالة
            </Button>
          </div>

          {/* النشر التلقائي */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-sm font-medium">النشر التلقائي</p>
              <p className="text-xs text-muted-foreground">
                نشر تلقائي عند تحديث الكود
              </p>
            </div>
            <Switch 
              checked={autoDeploy} 
              onCheckedChange={setAutoDeploy}
            />
          </div>
        </CardContent>
      </Card>

      {/* سجلات النشر */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            سجلات النشر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 text-sm">
                <div className="flex-shrink-0 w-16 text-xs text-muted-foreground">
                  {new Date(log.timestamp).toLocaleTimeString('ar-SA')}
                </div>
                <div className="flex-shrink-0">
                  {log.level === 'error' && <XCircle className="h-3 w-3 text-red-500 mt-1" />}
                  {log.level === 'warning' && <AlertTriangle className="h-3 w-3 text-yellow-500 mt-1" />}
                  {log.level === 'success' && <CheckCircle className="h-3 w-3 text-green-500 mt-1" />}
                  {log.level === 'info' && <div className="h-3 w-3 rounded-full bg-blue-500 mt-1" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{log.message}</p>
                  {log.details && (
                    <p className="text-muted-foreground text-xs">{log.details}</p>
                  )}
                </div>
              </div>
            ))}
            
            {logs.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                لا توجد سجلات حالياً
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* تاريخ النشر */}
      {deploymentHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              تاريخ النشر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deploymentHistory.map((deployment, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon()}
                    <div>
                      <p className="font-medium">{deployment.version}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(deployment.timestamp)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={deployment.status === 'success' ? 'default' : 'destructive'}>
                    {deployment.status === 'success' ? 'نجح' : 'فشل'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}