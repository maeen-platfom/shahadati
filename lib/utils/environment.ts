// أدوات إدارة متغيرات البيئة والإعدادات
// أدوات إدارة متغيرات البيئة والإعدادات لإنتاج منصة شهاداتي

export interface EnvironmentVariable {
  id: string;
  name: string;
  value: string;
  description: string;
  category: 'database' | 'api' | 'email' | 'security' | 'monitoring' | 'general';
  isSecret: boolean;
  environment: 'development' | 'staging' | 'production' | 'all';
  lastUpdated: string;
  updatedBy: string;
  validation?: {
    required: boolean;
    pattern?: string;
    defaultValue?: string;
  };
}

export interface ProductionConfig {
  database: {
    connectionPool: number;
    timeout: number;
    retryAttempts: number;
    enableSSL: boolean;
  };
  security: {
    jwtExpiration: number;
    passwordMinLength: number;
    enable2FA: boolean;
    rateLimitEnabled: boolean;
    corsOrigins: string[];
  };
  email: {
    enabled: boolean;
    provider: 'smtp' | 'sendgrid' | 'mailgun';
    fromEmail: string;
    fromName: string;
    templates: {
      welcome: boolean;
      certificate: boolean;
      passwordReset: boolean;
    };
  };
  monitoring: {
    enabled: boolean;
    logLevel: 'error' | 'warn' | 'info' | 'debug';
    performanceTracking: boolean;
    errorReporting: boolean;
    analyticsEnabled: boolean;
  };
  features: {
    certificateQR: boolean;
    digitalSignature: boolean;
    bulkGeneration: boolean;
    apiAccess: boolean;
    webhookNotifications: boolean;
  };
}

export interface EnvironmentValidationResult {
  valid: boolean;
  errors: Array<{
    variable: string;
    message: string;
    type: 'missing' | 'invalid' | 'deprecated';
  }>;
  warnings: Array<{
    variable: string;
    message: string;
    suggestion?: string;
  }>;
}

class EnvironmentService {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN || ''}`
    };
  }

  /**
   * الحصول على جميع متغيرات البيئة
   */
  async getEnvironmentVariables(): Promise<EnvironmentVariable[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/environment/variables`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('خطأ في الحصول على متغيرات البيئة:', error);
      
      // إرجاع متغيرات افتراضية
      return this.getDefaultVariables();
    }
  }

  /**
   * إضافة متغير بيئة جديد
   */
  async addEnvironmentVariable(variable: EnvironmentVariable): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/environment/variables`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(variable)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('خطأ في إضافة متغير البيئة:', error);
      throw error;
    }
  }

  /**
   * تحديث متغير بيئة موجود
   */
  async updateEnvironmentVariable(variable: EnvironmentVariable): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/environment/variables/${variable.id}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(variable)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('خطأ في تحديث متغير البيئة:', error);
      throw error;
    }
  }

  /**
   * حذف متغير بيئة
   */
  async deleteEnvironmentVariable(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/environment/variables/${id}`, {
        method: 'DELETE',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('خطأ في حذف متغير البيئة:', error);
      throw error;
    }
  }

  /**
   * الحصول على إعدادات الإنتاج
   */
  async getProductionConfig(): Promise<ProductionConfig> {
    try {
      const response = await fetch(`${this.baseUrl}/api/environment/production-config`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('خطأ في الحصول على إعدادات الإنتاج:', error);
      
      // إرجاع إعدادات افتراضية
      return this.getDefaultProductionConfig();
    }
  }

  /**
   * تحديث إعدادات الإنتاج
   */
  async updateProductionConfig(config: ProductionConfig): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/environment/production-config`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('خطأ في تحديث إعدادات الإنتاج:', error);
      throw error;
    }
  }

  /**
   * التحقق من صحة متغيرات البيئة
   */
  async validateEnvironment(): Promise<EnvironmentValidationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/environment/validate`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ 
          environment: process.env.NODE_ENV || 'development' 
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('خطأ في التحقق من البيئة:', error);
      
      // إرجاع نتيجة افتراضية
      return {
        valid: false,
        errors: [
          {
            variable: 'NEXT_PUBLIC_SUPABASE_URL',
            message: 'متغير مطلوب',
            type: 'missing'
          }
        ],
        warnings: []
      };
    }
  }

  /**
   * تصدير متغيرات البيئة
   */
  async exportEnvironment(format: 'env' | 'json' = 'env'): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/environment/export?format=${format}`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      return data;
    } catch (error) {
      console.error('خطأ في تصدير البيئة:', error);
      throw error;
    }
  }

  /**
   * استيراد متغيرات البيئة
   */
  async importEnvironment(environmentData: string, format: 'env' | 'json' = 'env'): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/environment/import`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ 
          data: environmentData, 
          format 
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('خطأ في استيراد البيئة:', error);
      throw error;
    }
  }

  /**
   * إعادة تعيين متغيرات البيئة للقيم الافتراضية
   */
  async resetToDefaults(environment: 'development' | 'staging' | 'production'): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/environment/reset`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ environment })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('خطأ في إعادة التعيين:', error);
      throw error;
    }
  }

  /**
   * إنشاء نسخة احتياطية من الإعدادات
   */
  async createBackup(): Promise<{
    id: string;
    timestamp: string;
    variables: EnvironmentVariable[];
    config: ProductionConfig;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/environment/backup`, {
        method: 'POST',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('خطأ في إنشاء النسخة الاحتياطية:', error);
      throw error;
    }
  }

  /**
   * استعادة من نسخة احتياطية
   */
  async restoreFromBackup(backupId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/environment/restore/${backupId}`, {
        method: 'POST',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('خطأ في الاستعادة:', error);
      throw error;
    }
  }

  /**
   * الحصول على المتغيرات المطلوبة للإنتاج
   */
  getRequiredVariablesForProduction(): string[] {
    return [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'DATABASE_URL',
      'SENDGRID_API_KEY'
    ];
  }

  /**
   * إنشاء ملف .env.production
   */
  generateProductionEnvFile(variables: EnvironmentVariable[]): string {
    const productionVars = variables.filter(v => 
      v.environment === 'production' || v.environment === 'all'
    );

    let envContent = `# متغيرات بيئة الإنتاج - منصة شهاداتي
# تم إنشاؤه تلقائياً في ${new Date().toISOString()}
# لا تشارك هذا الملف مع أي شخص

`;

    productionVars.forEach(variable => {
      const value = variable.isSecret ? 
        (variable.value || 'CHANGE_ME_REQUIRED') : 
        (variable.value || variable.validation?.defaultValue || '');
      
      envContent += `# ${variable.description}\n`;
      envContent += `${variable.name}=${value}\n\n`;
    });

    return envContent;
  }

  /**
   * الحصول على متغيرات افتراضية
   */
  private getDefaultVariables(): EnvironmentVariable[] {
    return [
      {
        id: '1',
        name: 'NEXT_PUBLIC_SUPABASE_URL',
        value: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        description: 'رابط مشروع Supabase',
        category: 'database',
        isSecret: false,
        environment: 'all',
        lastUpdated: new Date().toISOString(),
        updatedBy: 'system',
        validation: {
          required: true,
          pattern: '^https://.*\\.supabase\\.co$'
        }
      },
      {
        id: '2',
        name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        description: 'مفتاح Supabase العام',
        category: 'database',
        isSecret: false,
        environment: 'all',
        lastUpdated: new Date().toISOString(),
        updatedBy: 'system',
        validation: {
          required: true
        }
      },
      {
        id: '3',
        name: 'SUPABASE_SERVICE_ROLE_KEY',
        value: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
        description: 'مفتاح Supabase للخدمة',
        category: 'database',
        isSecret: true,
        environment: 'production',
        lastUpdated: new Date().toISOString(),
        updatedBy: 'system',
        validation: {
          required: true
        }
      },
      {
        id: '4',
        name: 'NEXTAUTH_SECRET',
        value: process.env.NEXTAUTH_SECRET || '',
        description: 'سر مصادقة NextAuth',
        category: 'security',
        isSecret: true,
        environment: 'production',
        lastUpdated: new Date().toISOString(),
        updatedBy: 'system',
        validation: {
          required: true,
          pattern: '^[a-zA-Z0-9]{32,}$'
        }
      },
      {
        id: '5',
        name: 'NEXTAUTH_URL',
        value: process.env.NEXTAUTH_URL || '',
        description: 'URL التطبيق للمصادقة',
        category: 'security',
        isSecret: false,
        environment: 'all',
        lastUpdated: new Date().toISOString(),
        updatedBy: 'system',
        validation: {
          required: true,
          pattern: '^https?://.*'
        }
      },
      {
        id: '6',
        name: 'SENDGRID_API_KEY',
        value: process.env.SENDGRID_API_KEY || '',
        description: 'مفتاح SendGrid API للرسائل',
        category: 'email',
        isSecret: true,
        environment: 'production',
        lastUpdated: new Date().toISOString(),
        updatedBy: 'system',
        validation: {
          required: false
        }
      },
      {
        id: '7',
        name: 'NODE_ENV',
        value: process.env.NODE_ENV || 'development',
        description: 'بيئة التطبيق',
        category: 'general',
        isSecret: false,
        environment: 'all',
        lastUpdated: new Date().toISOString(),
        updatedBy: 'system',
        validation: {
          required: true,
          defaultValue: 'development'
        }
      },
      {
        id: '8',
        name: 'PORT',
        value: process.env.PORT || '3000',
        description: 'رقم منفذ الخادم',
        category: 'general',
        isSecret: false,
        environment: 'all',
        lastUpdated: new Date().toISOString(),
        updatedBy: 'system',
        validation: {
          required: true,
          defaultValue: '3000',
          pattern: '^[0-9]{4,5}$'
        }
      }
    ];
  }

  /**
   * الحصول على إعدادات إنتاج افتراضية
   */
  private getDefaultProductionConfig(): ProductionConfig {
    return {
      database: {
        connectionPool: 10,
        timeout: 30000,
        retryAttempts: 3,
        enableSSL: true
      },
      security: {
        jwtExpiration: 24 * 60 * 60, // 24 hours
        passwordMinLength: 8,
        enable2FA: false,
        rateLimitEnabled: true,
        corsOrigins: ['https://shahadati.app', 'https://www.shahadati.app']
      },
      email: {
        enabled: true,
        provider: 'sendgrid',
        fromEmail: 'noreply@shahadati.app',
        fromName: 'منصة شهاداتي',
        templates: {
          welcome: true,
          certificate: true,
          passwordReset: true
        }
      },
      monitoring: {
        enabled: true,
        logLevel: 'info',
        performanceTracking: true,
        errorReporting: true,
        analyticsEnabled: true
      },
      features: {
        certificateQR: true,
        digitalSignature: false,
        bulkGeneration: false,
        apiAccess: true,
        webhookNotifications: false
      }
    };
  }
}

// إنشاء مثيل واحد من الخدمة
export const environmentService = new EnvironmentService();

// دوال مساعدة إضافية
export const environmentHelpers = {
  /**
   * التحقق من صحة اسم متغير البيئة
   */
  validateVariableName: (name: string): boolean => {
    return /^[A-Z_][A-Z0-9_]*$/.test(name);
  },

  /**
   * إخفاء قيمة متغير سري
   */
  maskSecret: (value: string, length: number = 8): string => {
    if (!value) return '';
    return '•'.repeat(Math.min(length, value.length)) + 
           (value.length > length ? value.slice(-4) : '');
  },

  /**
   * تحويل فئة المتغير إلى نص عربي
   */
  getCategoryLabel: (category: string): string => {
    const labels: Record<string, string> = {
      database: 'قاعدة البيانات',
      api: 'واجهة البرمجة',
      email: 'البريد الإلكتروني',
      security: 'الأمان',
      monitoring: 'المراقبة',
      general: 'عام'
    };
    return labels[category] || category;
  },

  /**
   * تحويل بيئة التشغيل إلى نص عربي
   */
  getEnvironmentLabel: (environment: string): string => {
    const labels: Record<string, string> = {
      development: 'التطوير',
      staging: 'التجربة',
      production: 'الإنتاج',
      all: 'الكل'
    };
    return labels[environment] || environment;
  },

  /**
   * فحص وجود متغير مطلوب
   */
  checkRequiredVariable: (variableName: string): boolean => {
    return process.env[variableName] !== undefined && process.env[variableName] !== '';
  },

  /**
   * الحصول على جميع متغيرات البيئة من process.env
   */
  getAllProcessEnv: (): Record<string, string> => {
    const env: Record<string, string> = {};
    Object.keys(process.env).forEach(key => {
      if (process.env[key]) {
        env[key] = process.env[key]!;
      }
    });
    return env;
  }
};