'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Database, 
  Zap, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  BarChart3,
  Settings,
  Play,
  RefreshCw,
  Download,
  Eye,
  Target,
  Activity
} from 'lucide-react';
import { 
  databaseOptimizer,
  dbOptimize,
  QueryOptimization,
  DatabaseStats,
  TableStats,
  QueryPerformance
} from '@/lib/utils/database';

interface DatabaseOptimizerProps {
  onOptimizationApply?: (optimization: QueryOptimization) => void;
  showAdvanced?: boolean;
}

export default function DatabaseOptimizer({ 
  onOptimizationApply,
  showAdvanced = false 
}: DatabaseOptimizerProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dbStats, setDbStats] = useState<DatabaseStats | null>(null);
  const [queryAnalysis, setQueryAnalysis] = useState<QueryOptimization | null>(null);
  const [customQuery, setCustomQuery] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [optimizations, setOptimizations] = useState<QueryOptimization[]>([]);

  // تحميل الإحصائيات الأولية
  useEffect(() => {
    loadDatabaseStats();
  }, []);

  // تحميل إحصائيات قاعدة البيانات
  const loadDatabaseStats = async () => {
    setIsAnalyzing(true);
    try {
      const stats = await databaseOptimizer.getComprehensiveStats();
      setDbStats(stats);
    } catch (error) {
      console.error('فشل في تحميل إحصائيات قاعدة البيانات:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // تحليل استعلام مخصص
  const analyzeCustomQuery = () => {
    if (!customQuery.trim()) return;
    
    const optimization = databaseOptimizer.analyzeQuery(customQuery);
    setQueryAnalysis(optimization);
    setOptimizations(prev => [optimization, ...prev.slice(0, 9)]); // آخر 10 تحليلات
  };

  // إنشاء فهرس مقترح
  const createRecommendedIndex = async (tableName: string, columns: string[]) => {
    try {
      const success = await databaseOptimizer.createRecommendedIndexes(tableName, columns);
      if (success) {
        alert('تم إنشاء الفهرس بنجاح!');
        loadDatabaseStats(); // إعادة تحميل الإحصائيات
      } else {
        alert('فشل في إنشاء الفهرس');
      }
    } catch (error) {
      console.error('خطأ في إنشاء الفهرس:', error);
      alert('حدث خطأ أثناء إنشاء الفهرس');
    }
  };

  // اقتراح تحسينات للاستعلامات
  const suggestQueryOptimizations = (query: string): string[] => {
    return databaseOptimizer.suggestOptimizations(query);
  };

  // نظرة عامة على قاعدة البيانات
  const DatabaseOverview = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Database className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">الجداول</p>
                <p className="text-xl font-bold">{dbStats?.totalTables || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Target className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">الفهارس</p>
                <p className="text-xl font-bold">{dbStats?.totalIndexes || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">استعلامات بطيئة</p>
                <p className="text-xl font-bold">{dbStats?.slowQueries.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">متوسط الأداء</p>
                <p className="text-xl font-bold">
                  {dbStats?.queryPerformance.length ? 'جيد' : '---'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {dbStats?.tableStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <BarChart3 className="h-5 w-5" />
              <span>إحصائيات الجداول</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(dbStats.tableStats).map(([tableName, stats]) => (
                <div key={tableName} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Database className="h-4 w-4 text-blue-500" />
                    <div>
                      <span className="font-medium">{tableName}</span>
                      <p className="text-sm text-gray-600">{stats.rowCount} صف</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 space-x-reverse text-sm">
                    <span>{stats.size}</span>
                    <Badge variant="outline">{stats.indexes} فهرس</Badge>
                    {stats.fragmentation > 20 && (
                      <Badge variant="secondary">
                        تجزئة: {stats.fragmentation.toFixed(1)}%
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // تحليل الاستعلامات
  const QueryAnalysis = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Play className="h-5 w-5" />
            <span>تحليل الاستعلامات</span>
          </CardTitle>
          <CardDescription>
            تحليل وتحسين أداء الاستعلامات
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="query">استعلام SQL</Label>
            <Textarea
              id="query"
              placeholder="أدخل استعلام SQL لتحليله..."
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              className="min-h-[120px] font-mono"
            />
          </div>
          
          <Button 
            onClick={analyzeCustomQuery}
            disabled={!customQuery.trim() || isAnalyzing}
            className="w-full"
          >
            <Play className="h-4 w-4 mr-2" />
            تحليل الاستعلام
          </Button>
        </CardContent>
      </Card>

      {queryAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>نتائج التحليل</span>
              <Badge variant={
                queryAnalysis.complexity === 'low' ? 'default' :
                queryAnalysis.complexity === 'medium' ? 'secondary' : 'destructive'
              }>
                {queryAnalysis.complexity === 'low' ? 'منخفض التعقيد' :
                 queryAnalysis.complexity === 'medium' ? 'متوسط التعقيد' : 'عالي التعقيد'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <Clock className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">الزمن المقدر</p>
                <p className="text-lg font-bold">{queryAnalysis.estimatedTime}ms</p>
              </div>
              
              <div className="text-center p-3 border rounded-lg">
                <Target className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">اقتراحات التحسين</p>
                <p className="text-lg font-bold">{queryAnalysis.suggestions.length}</p>
              </div>
              
              <div className="text-center p-3 border rounded-lg">
                <Database className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">فهارس مقترحة</p>
                <p className="text-lg font-bold">{queryAnalysis.indexRecommendations.length}</p>
              </div>
            </div>

            {queryAnalysis.suggestions.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">اقتراحات التحسين</h4>
                <div className="space-y-2">
                  {queryAnalysis.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start space-x-2 space-x-reverse p-2 bg-blue-50 border border-blue-200 rounded">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span className="text-sm">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {queryAnalysis.indexRecommendations.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">فهارس مقترحة</h4>
                <div className="space-y-2">
                  {queryAnalysis.indexRecommendations.map((index, index_num) => (
                    <div key={index_num} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">{index}</code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // استخراج اسم الجدول والأعمدة من الاستعلام
                          const tableMatch = queryAnalysis.query.match(/FROM\s+([a-zA-Z_][a-zA-Z0-9_]*)/i);
                          if (tableMatch) {
                            const columns = ['id', 'created_at']; // افتراضي
                            createRecommendedIndex(tableMatch[1], columns);
                          }
                        }}
                      >
                        <Target className="h-4 w-4 mr-1" />
                        إنشاء الفهرس
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* تاريخ التحليلات */}
      {optimizations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>آخر التحليلات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {optimizations.map((opt, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => setQueryAnalysis(opt)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm truncate max-w-md">
                      {opt.query.substring(0, 100)}...
                    </span>
                    <Badge variant={
                      opt.complexity === 'low' ? 'default' :
                      opt.complexity === 'medium' ? 'secondary' : 'destructive'
                    }>
                      {opt.estimatedTime}ms
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // تحسين الفهارس
  const IndexOptimization = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Target className="h-5 w-5" />
            <span>تحسين الفهارس</span>
          </CardTitle>
          <CardDescription>
            إدارة وتحسين فهارس قاعدة البيانات
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>اختر جدولاً للتحليل</Label>
              <Select value={selectedTable} onValueChange={setSelectedTable}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر جدولاً" />
                </SelectTrigger>
                <SelectContent>
                  {dbStats && Object.keys(dbStats.tableStats).map(tableName => (
                    <SelectItem key={tableName} value={tableName}>
                      {tableName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={async () => {
                  if (selectedTable) {
                    const recommendations = await databaseOptimizer.optimizeTableIndexes(selectedTable);
                    console.log('اقتراحات الفهارس:', recommendations);
                  }
                }}
                disabled={!selectedTable}
                className="w-full"
              >
                <Zap className="h-4 w-4 mr-2" />
                تحليل الفهارس
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedTable && (
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل الجدول: {selectedTable}</CardTitle>
          </CardHeader>
          <CardContent>
            {dbStats?.tableStats[selectedTable] && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <Database className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">عدد الصفوف</p>
                    <p className="text-lg font-bold">{dbStats.tableStats[selectedTable].rowCount}</p>
                  </div>
                  
                  <div className="text-center p-3 border rounded-lg">
                    <Target className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">الفهارس</p>
                    <p className="text-lg font-bold">{dbStats.tableStats[selectedTable].indexes}</p>
                  </div>
                  
                  <div className="text-center p-3 border rounded-lg">
                    <BarChart3 className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">الحجم</p>
                    <p className="text-lg font-bold">{dbStats.tableStats[selectedTable].size}</p>
                  </div>
                  
                  <div className="text-center p-3 border rounded-lg">
                    <AlertCircle className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">التجزئة</p>
                    <p className="text-lg font-bold">
                      {dbStats.tableStats[selectedTable].fragmentation.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">إجراءات التحسين</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        const unusedIndexes = await databaseOptimizer.cleanupUnusedIndexes(selectedTable);
                        if (unusedIndexes.length > 0) {
                          alert(`فهارس غير مستخدمة: ${unusedIndexes.join(', ')}`);
                        } else {
                          alert('جميع الفهارس مستخدمة');
                        }
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      فحص الفهارس غير المستخدمة
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        const recommendations = await databaseOptimizer.optimizeTableIndexes(selectedTable);
                        if (recommendations.length > 0) {
                          alert(`اقتراحات:\n${recommendations.join('\n')}`);
                        }
                      }}
                    >
                      <Target className="h-4 w-4 mr-2" />
                      اقتراحات الفهارس
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  // إحصائيات الأداء
  const PerformanceStats = () => (
    <div className="space-y-4">
      {dbStats?.queryPerformance && dbStats.queryPerformance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <Activity className="h-5 w-5" />
              <span>أداء الاستعلامات</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dbStats.queryPerformance.slice(0, 10).map((perf, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-mono text-sm truncate max-w-md">
                      {perf.query.substring(0, 80)}...
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      تم التنفيذ: {perf.callCount} مرة | آخر مرة: {new Date(perf.lastExecuted).toLocaleTimeString('ar-EG')}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <Badge variant={perf.avgTime > 1000 ? 'destructive' : perf.avgTime > 100 ? 'secondary' : 'default'}>
                      {perf.avgTime.toFixed(1)}ms
                    </Badge>
                    <div className="text-right text-sm">
                      <div>معدل الضرب: {perf.cacheHitRate.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {dbStats?.slowQueries && dbStats.slowQueries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span>استعلامات بطيئة تحتاج تحسين</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dbStats.slowQueries.map((query, index) => (
                <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="font-mono text-sm mb-2">
                    {query.query.substring(0, 100)}...
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="destructive">
                      متوسط الوقت: {query.avgTime.toFixed(1)}ms
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setQueryAnalysis({
                        query: query.query,
                        estimatedTime: query.avgTime,
                        suggestions: suggestQueryOptimizations(query.query),
                        indexRecommendations: [],
                        complexity: 'high'
                      })}
                    >
                      <Zap className="h-4 w-4 mr-1" />
                      تحسين
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <Database className="h-6 w-6" />
                <span>مُحسن قاعدة البيانات</span>
              </CardTitle>
              <CardDescription>
                تحليل وتحسين أداء قاعدة البيانات والاستعلامات
              </CardDescription>
            </div>
            <Button
              onClick={loadDatabaseStats}
              disabled={isAnalyzing}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="queries">تحليل الاستعلامات</TabsTrigger>
          <TabsTrigger value="indexes">الفهارس</TabsTrigger>
          <TabsTrigger value="performance">الأداء</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <DatabaseOverview />
        </TabsContent>

        <TabsContent value="queries">
          <QueryAnalysis />
        </TabsContent>

        <TabsContent value="indexes">
          <IndexOptimization />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceStats />
        </TabsContent>
      </Tabs>
    </div>
  );
}