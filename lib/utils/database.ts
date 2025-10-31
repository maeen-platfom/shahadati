/**
 * أدوات تحسين قاعدة البيانات
 * تحليل وتحسين أداء الاستعلامات والعمليات
 */

import { createClient } from '@supabase/supabase-js';

export interface QueryOptimization {
  query: string;
  estimatedTime: number;
  suggestions: string[];
  indexRecommendations: string[];
  complexity: 'low' | 'medium' | 'high';
}

export interface DatabaseStats {
  totalTables: number;
  totalIndexes: number;
  tableStats: Record<string, TableStats>;
  queryPerformance: QueryPerformance[];
  slowQueries: QueryPerformance[];
}

export interface TableStats {
  rowCount: number;
  size: string;
  indexes: number;
  lastUpdated: number;
  fragmentation: number;
}

export interface QueryPerformance {
  query: string;
  avgTime: number;
  callCount: number;
  lastExecuted: number;
  errors: number;
  cacheHitRate: number;
}

class DatabaseOptimizer {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  private optimizations: Map<string, QueryOptimization> = new Map();
  private performanceHistory: QueryPerformance[] = [];

  /**
   * تحليل استعلام SQL
   */
  analyzeQuery(sql: string): QueryOptimization {
    const suggestions: string[] = [];
    const indexRecommendations: string[] = [];
    let estimatedTime = 1; // milliseconds
    
    // تحليل WHERE clauses
    if (sql.includes('WHERE') && !sql.includes('INDEX') && !sql.includes('idx_')) {
      suggestions.push('أضف فهرساً على الأعمدة المستخدمة في WHERE clause');
      estimatedTime += 10;
    }

    // تحليل JOIN operations
    if (sql.includes('JOIN')) {
      suggestions.push('تأكد من وجود فهارس على أعمدة الربط (JOIN columns)');
      indexRecommendations.push(
        `CREATE INDEX CONCURRENTLY idx_${this.extractTableName(sql)}_join_columns ON ${this.extractTableName(sql)} (column1, column2);`
      );
      estimatedTime += 15;
    }

    // تحليل ORDER BY
    if (sql.includes('ORDER BY')) {
      const orderColumn = this.extractOrderByColumn(sql);
      if (orderColumn && !sql.includes(`idx_${orderColumn}`)) {
        suggestions.push(`أضف فهرساً ترتيبياً على عمود ${orderColumn}`);
        estimatedTime += 8;
      }
    }

    // تحليل LIMIT
    if (sql.includes('LIMIT')) {
      const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
      if (limitMatch && parseInt(limitMatch[1]) > 1000) {
        suggestions.push('استخدم LIMIT أصغر لتحسين الأداء');
        estimatedTime -= 5; // LIMIT يحسن الأداء
      }
    }

    // تحليل COUNT operations
    if (sql.toLowerCase().includes('count(')) {
      suggestions.push('استخدم COUNT مع INDEXed columns فقط');
      estimatedTime += 20;
    }

    // تحليل DISTINCT
    if (sql.includes('DISTINCT')) {
      suggestions.push('تأكد من ضرورة استخدام DISTINCT أو استخدم GROUP BY بدلاً منه');
      estimatedTime += 12;
    }

    // تحديد مستوى التعقيد
    let complexity: QueryOptimization['complexity'] = 'low';
    if (sql.includes('JOIN') && sql.includes('WHERE') && sql.includes('ORDER BY')) {
      complexity = 'high';
      estimatedTime += 50;
    } else if (sql.includes('JOIN') || sql.includes('WHERE')) {
      complexity = 'medium';
      estimatedTime += 25;
    }

    const optimization: QueryOptimization = {
      query: sql,
      estimatedTime,
      suggestions,
      indexRecommendations,
      complexity
    };

    this.optimizations.set(this.generateQueryHash(sql), optimization);
    return optimization;
  }

  /**
   * إنشاء فهرس مقترح
   */
  async createRecommendedIndexes(tableName: string, columns: string[]): Promise<boolean> {
    try {
      const indexName = `idx_${tableName}_${columns.join('_')}_${Date.now()}`;
      const sql = `
        CREATE INDEX CONCURRENTLY ${indexName} 
        ON ${tableName} (${columns.join(', ')});
      `;

      const { error } = await this.supabase.rpc('exec_sql', { sql });
      
      if (error) throw error;
      
      console.log(`تم إنشاء الفهرس: ${indexName}`);
      return true;
    } catch (error) {
      console.error('فشل في إنشاء الفهرس:', error);
      return false;
    }
  }

  /**
   * تحليل أداء الاستعلامات المخزنة
   */
  async analyzeQueryPerformance(): Promise<QueryPerformance[]> {
    try {
      // في بيئة الإنتاج، يمكن استدعاء pg_stat_statements
      const { data, error } = await this.supabase
        .from('pg_stat_statements')
        .select('*')
        .order('total_time', { ascending: false })
        .limit(100);

      if (error) {
        console.warn('لا يمكن الوصول لإحصائيات الأداء:', error);
        return [];
      }

      const performances: QueryPerformance[] = data?.map((row: any) => ({
        query: row.query,
        avgTime: row.mean_time,
        callCount: row.calls,
        lastExecuted: Date.now(), // تقدير
        errors: 0, // لا يمكن الحصول على هذه المعلومة من pg_stat_statements
        cacheHitRate: this.calculateCacheHitRate(row)
      })) || [];

      this.performanceHistory = performances;
      return performances;
    } catch (error) {
      console.error('خطأ في تحليل أداء الاستعلامات:', error);
      return [];
    }
  }

  /**
   * تحليل الجداول والحصول على إحصائياتها
   */
  async getTableStats(): Promise<Record<string, TableStats>> {
    try {
      const { data: tables, error: tablesError } = await this.supabase
        .rpc('get_table_stats');

      if (tablesError) throw tablesError;

      const stats: Record<string, TableStats> = {};
      
      tables?.forEach((table: any) => {
        stats[table.schemaname + '.' + table.relname] = {
          rowCount: table.n_tup_ins - table.n_tup_del,
          size: this.formatBytes(table.pg_total_relation_size),
          indexes: table.indexes || 0,
          lastUpdated: Date.now(),
          fragmentation: this.calculateFragmentation(table)
        };
      });

      return stats;
    } catch (error) {
      console.error('خطأ في الحصول على إحصائيات الجداول:', error);
      return {};
    }
  }

  /**
   * تحسين الاستعلام باستخدام التخزين المؤقت
   */
  async optimizeQueryWithCache<T>(
    query: string,
    queryFn: () => Promise<T>,
    cacheKey: string,
    ttl: number = 300000 // 5 دقائق
  ): Promise<T> {
    // التحقق من التخزين المؤقت
    const cached = this.getCachedResult<T>(cacheKey);
    if (cached) {
      return cached;
    }

    // تنفيذ الاستعلام
    const startTime = performance.now();
    const result = await queryFn();
    const endTime = performance.now();

    // حفظ النتيجة في التخزين المؤقت
    this.cacheResult(cacheKey, result, ttl);

    // تسجيل الأداء
    const executionTime = endTime - startTime;
    this.recordQueryPerformance(query, executionTime);

    // تحليل الاستعلام إذا كان بطيئاً
    if (executionTime > 1000) { // أكثر من ثانية
      console.warn(`استعلام بطيء تم اكتشافه: ${executionTime}ms`);
      const optimization = this.analyzeQuery(query);
      console.log('اقتراحات التحسين:', optimization.suggestions);
    }

    return result;
  }

  /**
   * اقتراح تحسينات للاستعلامات المعقدة
   */
  suggestOptimizations(query: string): string[] {
    const suggestions: string[] = [];

    // تحليل للاستعلامات التي تنقص الأداء
    if (query.toLowerCase().includes('select *')) {
      suggestions.push('تجنب استخدام SELECT * - حدد الأعمدة المطلوبة فقط');
    }

    if (query.toLowerCase().includes('like') && query.includes('%')) {
      suggestions.push('تجنب LIKE مع % في البداية - استخدم فهرس نصي كامل (Full-text index)');
    }

    if (query.toLowerCase().includes('or')) {
      suggestions.push('استخدم UNION بدلاً من OR لتحسين الأداء');
    }

    if (query.toLowerCase().includes('not in')) {
      suggestions.push('استخدم NOT EXISTS بدلاً من NOT IN للاستعلامات المعقدة');
    }

    if (query.toLowerCase().includes('subquery') && query.toLowerCase().includes('from')) {
      suggestions.push('استخدم JOIN بدلاً من Subquery متداخلة');
    }

    return suggestions;
  }

  /**
   * إنشاء View محسنة للاستعلامات الشائعة
   */
  async createOptimizedView(viewName: string, query: string): Promise<boolean> {
    try {
      const viewQuery = `CREATE OR REPLACE VIEW ${viewName} AS ${query}`;
      const { error } = await this.supabase.rpc('exec_sql', { sql: viewQuery });
      
      if (error) throw error;
      
      console.log(`تم إنشاء View محسن: ${viewName}`);
      return true;
    } catch (error) {
      console.error('فشل في إنشاء View:', error);
      return false;
    }
  }

  /**
   * تحسين فهارس الجدول
   */
  async optimizeTableIndexes(tableName: string): Promise<string[]> {
    try {
      const recommendations: string[] = [];

      // الحصول على إحصائيات الجدول
      const { data: stats } = await this.supabase
        .from('pg_stat_user_tables')
        .select('*')
        .eq('relname', tableName)
        .single();

      if (!stats) return recommendations;

      // تحليل الفهارس الموجودة
      const { data: indexes } = await this.supabase
        .from('pg_indexes')
        .select('*')
        .eq('tablename', tableName);

      const existingIndexes = indexes?.map(idx => idx.indexname) || [];

      // اقتراح فهارس جديدة بناءً على الاستعلامات الشائعة
      const commonQueries = [
        'SELECT * FROM ' + tableName + ' WHERE created_at',
        'SELECT * FROM ' + tableName + ' WHERE status',
        'SELECT * FROM ' + tableName + ' WHERE user_id'
      ];

      for (const query of commonQueries) {
        const columns = this.extractColumnsFromQuery(query);
        const recommendedIndex = `idx_${tableName}_${columns.join('_')}`;

        if (!existingIndexes.includes(recommendedIndex)) {
          recommendations.push(
            `CREATE INDEX CONCURRENTLY ${recommendedIndex} ON ${tableName} (${columns.join(', ')});`
          );
        }
      }

      return recommendations;
    } catch (error) {
      console.error('خطأ في تحليل فهارس الجدول:', error);
      return [];
    }
  }

  /**
   * تنظيف الفهارس المعطلة
   */
  async cleanupUnusedIndexes(tableName: string): Promise<string[]> {
    try {
      // الحصول على إحصائيات استخدام الفهارس
      const { data: indexStats } = await this.supabase
        .from('pg_stat_user_indexes')
        .select('*')
        .eq('relname', tableName);

      const unusedIndexes: string[] = [];

      indexStats?.forEach((stat: any) => {
        if (stat.idx_scan === 0) { // لم يتم استخدام الفهرس مطلقاً
          unusedIndexes.push(stat.indexrelname);
        }
      });

      return unusedIndexes;
    } catch (error) {
      console.error('خطأ في تحليل استخدام الفهارس:', error);
      return [];
    }
  }

  /**
   * دوال مساعدة خاصة
   */
  private generateQueryHash(query: string): string {
    return btoa(query).slice(0, 16);
  }

  private extractTableName(sql: string): string {
    const match = sql.match(/FROM\s+([a-zA-Z_][a-zA-Z0-9_]*)/i);
    return match ? match[1] : 'unknown';
  }

  private extractOrderByColumn(sql: string): string | null {
    const match = sql.match(/ORDER\s+BY\s+([a-zA-Z_][a-zA-Z0-9_]*)/i);
    return match ? match[1] : null;
  }

  private extractColumnsFromQuery(query: string): string[] {
    const columns: string[] = [];
    
    // استخراج أعمدة WHERE
    const whereMatch = query.match(/WHERE\s+([a-zA-Z_][a-zA-Z0-9_]*)/i);
    if (whereMatch) {
      columns.push(whereMatch[1]);
    }

    return columns;
  }

  private calculateCacheHitRate(row: any): number {
    // تقدير معدل ضرب التخزين المؤقت بناءً على الإحصائيات المتاحة
    const totalCalls = row.calls || 1;
    const bufferHits = row.heap_hit || 0;
    return Math.min((bufferHits / totalCalls) * 100, 100);
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private calculateFragmentation(table: any): number {
    // تقدير التجزئة بناءً على عدد الإدراجات والحذف
    const insertCount = table.n_tup_ins || 0;
    const deleteCount = table.n_tup_del || 0;
    return insertCount > 0 ? (deleteCount / insertCount) * 100 : 0;
  }

  private getCachedResult<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem(`query_cache_${key}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();
        const ttl = 300000; // 5 دقائق
        
        if (now - timestamp < ttl) {
          return data;
        } else {
          localStorage.removeItem(`query_cache_${key}`);
        }
      }
    } catch (error) {
      console.warn('خطأ في قراءة التخزين المؤقت:', error);
    }
    
    return null;
  }

  private cacheResult<T>(key: string, result: T, ttl: number): void {
    if (typeof window === 'undefined') return;
    
    try {
      const data = {
        data: result,
        timestamp: Date.now(),
        ttl
      };
      localStorage.setItem(`query_cache_${key}`, JSON.stringify(data));
    } catch (error) {
      console.warn('خطأ في حفظ التخزين المؤقت:', error);
    }
  }

  private recordQueryPerformance(query: string, executionTime: number): void {
    const existing = this.performanceHistory.find(p => p.query === query);
    
    if (existing) {
      existing.avgTime = (existing.avgTime * existing.callCount + executionTime) / (existing.callCount + 1);
      existing.callCount++;
      existing.lastExecuted = Date.now();
    } else {
      this.performanceHistory.push({
        query,
        avgTime: executionTime,
        callCount: 1,
        lastExecuted: Date.now(),
        errors: 0,
        cacheHitRate: 0
      });
    }
  }

  /**
   * الحصول على إحصائيات شاملة
   */
  async getComprehensiveStats(): Promise<DatabaseStats> {
    const tableStats = await this.getTableStats();
    const queryPerformance = await this.analyzeQueryPerformance();
    const slowQueries = queryPerformance.filter(q => q.avgTime > 1000);

    return {
      totalTables: Object.keys(tableStats).length,
      totalIndexes: Object.values(tableStats).reduce((sum, stat) => sum + stat.indexes, 0),
      tableStats,
      queryPerformance,
      slowQueries
    };
  }
}

// إنشاء مثيل عام للمحسن
export const databaseOptimizer = new DatabaseOptimizer();

// دوال مساعدة للاستخدام السريع
export const dbOptimize = {
  /**
   * تنفيذ استعلام محسن مع تخزين مؤقت
   */
  async executeOptimizedQuery<T>(
    key: string,
    queryFn: () => Promise<T>,
    cacheKey?: string
  ): Promise<T> {
    return databaseOptimizer.optimizeQueryWithCache(
      key,
      queryFn,
      cacheKey || `query_${key}`
    );
  },

  /**
   * تحليل استعلام سريع
   */
  analyzeQuery: (sql: string) => databaseOptimizer.analyzeQuery(sql),

  /**
   * اقتراح تحسينات
   */
  suggestOptimizations: (query: string) => databaseOptimizer.suggestOptimizations(query),

  /**
   * إنشاء فهرس مقترح
   */
  createIndex: (tableName: string, columns: string[]) => 
    databaseOptimizer.createRecommendedIndexes(tableName, columns)
};

export default DatabaseOptimizer;