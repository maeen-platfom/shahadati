/**
 * نظام التخزين المؤقت الذكي
 * إدارة وتحسين التخزين المؤقت للبيانات والصفحات
 */

export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum cache size
  enabled: boolean;
  compression: boolean;
  persist: boolean; // Persist in localStorage/sessionStorage
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  size: number; // Size in bytes
  key: string;
}

export interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  hitRate: number;
  totalSize: number;
  entryCount: number;
  memoryUsage: number;
}

class SmartCache {
  private cache = new Map<string, any>();
  private config: CacheConfig;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    hitRate: 0,
    totalSize: 0,
    entryCount: 0,
    memoryUsage: 0
  };

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      ttl: config.ttl || 5 * 60 * 1000, // 5 minutes default
      maxSize: config.maxSize || 50 * 1024 * 1024, // 50MB default
      enabled: config.enabled !== undefined ? config.enabled : true,
      compression: config.compression || false,
      persist: config.persist || false
    };

    // تحميل البيانات المحفوظة إذا كانت متوفرة
    if (this.config.persist && typeof window !== 'undefined') {
      this.loadPersistedData();
    }

    // تنظيف البيانات المنتهية الصلاحية كل دقيقة
    setInterval(() => {
      this.cleanExpiredEntries();
    }, 60000);
  }

  /**
   * حفظ بيانات في التخزين المؤقت
   */
  set<T>(key: string, data: T, customTtl?: number): boolean {
    if (!this.config.enabled) return false;

    const ttl = customTtl || this.config.ttl;
    const size = this.calculateSize(data);
    
    // فحص الحد الأقصى للحجم
    if (this.stats.totalSize + size > this.config.maxSize) {
      this.evictLRU(size);
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      accessCount: 0,
      lastAccessed: Date.now(),
      size,
      key
    };

    // حذف العنصر القديم إذا كان موجوداً
    if (this.cache.has(key)) {
      this.stats.totalSize -= (this.cache.get(key) as CacheEntry<T>).size;
    }

    this.cache.set(key, entry);
    this.stats.totalSize += size;
    this.stats.entryCount = this.cache.size;

    // حفظ في التخزين الدائم إذا كان مفعلاً
    if (this.config.persist && typeof window !== 'undefined') {
      this.persistData(key, entry);
    }

    return true;
  }

  /**
   * استرجاع بيانات من التخزين المؤقت
   */
  get<T>(key: string): T | null {
    if (!this.config.enabled) return null;

    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // فحص انتهاء الصلاحية
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key);
      this.stats.misses++;
      return null;
    }

    // تحديث إحصائيات الوصول
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    
    this.stats.hits++;
    this.updateHitRate();

    return entry.data;
  }

  /**
   * حذف عنصر من التخزين المؤقت
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key) as CacheEntry<any>;
    if (entry) {
      this.stats.totalSize -= entry.size;
      this.cache.delete(key);
      this.stats.entryCount = this.cache.size;

      // حذف من التخزين الدائم
      if (this.config.persist && typeof window !== 'undefined') {
        this.removePersistedData(key);
      }

      return true;
    }
    return false;
  }

  /**
   * مسح جميع البيانات
   */
  clear(): void {
    this.cache.clear();
    this.stats.totalSize = 0;
    this.stats.entryCount = 0;

    if (this.config.persist && typeof window !== 'undefined') {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem('cache_data');
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('cache_data');
      }
    }
  }

  /**
   * الحصول على معلومات العنصر
   */
  getInfo(key: string): CacheEntry<any> | null {
    return this.cache.get(key) || null;
  }

  /**
   * الحصول على جميع المفاتيح
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * فحص وجود مفتاح
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // فحص انتهاء الصلاحية
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key);
      return false;
    }

    return true;
  }

  /**
   * تنظيف العناصر المنتهية الصلاحية
   */
  private cleanExpiredEntries(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.delete(key));
  }

  /**
   * إخلاء العنصر الأقل استخداماً مؤخراً
   */
  private evictLRU(requiredSpace: number): void {
    const entries = Array.from(this.cache.entries()) as [string, CacheEntry<any>][];
    
    // ترتيب حسب آخر مرة تم الوصول إليها
    entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);

    let freedSpace = 0;
    for (const [key, entry] of entries) {
      this.delete(key);
      freedSpace += entry.size;
      this.stats.evictions++;

      if (freedSpace >= requiredSpace) break;
    }
  }

  /**
   * حساب حجم البيانات
   */
  private calculateSize(data: any): number {
    if (data === null || data === undefined) return 0;

    try {
      const serialized = JSON.stringify(data);
      return new Blob([serialized]).size;
    } catch {
      // في حالة فشل التسلسل، افتراض حجم ثابت
      return 1024;
    }
  }

  /**
   * تحديث معدل الضرب (Hit Rate)
   */
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
  }

  /**
   * حفظ البيانات في التخزين الدائم
   */
  private persistData(key: string, entry: CacheEntry<any>): void {
    try {
      const storage = this.config.persist ? localStorage : sessionStorage;
      const existing = JSON.parse(storage.getItem('cache_data') || '{}');
      existing[key] = {
        ...entry,
        data: entry.data // حفظ البيانات كما هي
      };
      storage.setItem('cache_data', JSON.stringify(existing));
    } catch (error) {
      console.warn('Failed to persist cache data:', error);
    }
  }

  /**
   * إزالة البيانات المحفوظة
   */
  private removePersistedData(key: string): void {
    try {
      const storage = this.config.persist ? localStorage : sessionStorage;
      const existing = JSON.parse(storage.getItem('cache_data') || '{}');
      delete existing[key];
      storage.setItem('cache_data', JSON.stringify(existing));
    } catch (error) {
      console.warn('Failed to remove persisted cache data:', error);
    }
  }

  /**
   * تحميل البيانات المحفوظة
   */
  private loadPersistedData(): void {
    try {
      const storage = this.config.persist ? localStorage : sessionStorage;
      const persisted = JSON.parse(storage.getItem('cache_data') || '{}');
      
      for (const [key, entry] of Object.entries(persisted)) {
        // فحص انتهاء الصلاحية
        if (Date.now() - entry.timestamp <= entry.ttl) {
          this.cache.set(key, entry);
          this.stats.totalSize += entry.size;
        } else {
          // حذف البيانات المنتهية الصلاحية
          this.removePersistedData(key);
        }
      }
      
      this.stats.entryCount = this.cache.size;
    } catch (error) {
      console.warn('Failed to load persisted cache data:', error);
    }
  }

  /**
   * الحصول على إحصائيات التخزين المؤقت
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * تحديث الإعدادات
   */
  updateConfig(newConfig: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * ضغط البيانات المحفوظة
   */
  compress(key: string): boolean {
    if (!this.config.compression) return false;

    const entry = this.cache.get(key);
    if (!entry || typeof entry.data !== 'string') return false;

    try {
      // ضغط بسيط (يمكن تحسينه لاحقاً)
      const compressed = this.simpleCompress(entry.data);
      entry.data = compressed;
      entry.size = this.calculateSize(compressed);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * فك ضغط البيانات
   */
  decompress(key: string): boolean {
    if (!this.config.compression) return false;

    const entry = this.cache.get(key);
    if (!entry || typeof entry.data !== 'string') return false;

    try {
      const decompressed = this.simpleDecompress(entry.data);
      entry.data = decompressed;
      entry.size = this.calculateSize(decompressed);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * ضغط بسيط للنصوص
   */
  private simpleCompress(text: string): string {
    // خوارزمية ضغط بسيطة (يمكن تحسينها)
    return text
      .replace(/\s+/g, ' ')
      .replace(/(\w)\s+/g, '$1');
  }

  /**
   * فك ضغط النصوص
   */
  private simpleDecompress(compressed: string): string {
    // لا يمكن فك الضغط بدقة بدون خوارزمية كاملة
    return compressed;
  }
}

// إنشاء مثيلات مختلفة للتخزين المؤقت
export const defaultCache = new SmartCache();
export const apiCache = new SmartCache({
  ttl: 10 * 60 * 1000, // 10 دقائق لـ API calls
  maxSize: 10 * 1024 * 1024, // 10MB
  compression: true
});
export const pageCache = new SmartCache({
  ttl: 30 * 60 * 1000, // 30 دقيقة للصفحات
  maxSize: 20 * 1024 * 1024, // 20MB
  persist: true // حفظ الصفحات في التخزين الدائم
});
export const userDataCache = new SmartCache({
  ttl: 5 * 60 * 1000, // 5 دقائق لبيانات المستخدم
  maxSize: 5 * 1024 * 1024, // 5MB
  persist: true
});

// دوال مساعدة للاستخدام
export const cacheHelpers = {
  /**
   * تخزين مؤقت للاستعلامات
   */
  async cacheQuery<T>(
    key: string,
    queryFn: () => Promise<T>,
    cache: SmartCache = apiCache,
    ttl?: number
  ): Promise<T> {
    const cached = cache.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const startTime = performance.now();
    const result = await queryFn();
    const endTime = performance.now();

    // تسجيل زمن الاستعلام
    console.log(`Query ${key} took ${endTime - startTime}ms`);

    cache.set(key, result, ttl);
    return result;
  },

  /**
   * تخزين مؤقت للصفحات
   */
  cachePage<T>(key: string, componentFn: () => T, cache: SmartCache = pageCache): T {
    const cached = cache.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const result = componentFn();
    cache.set(key, result);
    return result;
  },

  /**
   * تخزين مؤقت لبيانات المستخدم
   */
  cacheUserData<T>(key: string, dataFn: () => T, cache: SmartCache = userDataCache): T {
    const cached = cache.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const result = dataFn();
    cache.set(key, result);
    return result;
  },

  /**
   * مسح التخزين المؤقت عند تسجيل الخروج
   */
  clearUserCache(): void {
    userDataCache.clear();
    pageCache.clear();
  },

  /**
   * مسح التخزين المؤقت للـ API
   */
  clearApiCache(): void {
    apiCache.clear();
  }
};

export default SmartCache;