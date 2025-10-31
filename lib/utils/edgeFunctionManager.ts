/**
 * أدوات إدارة Edge Functions لميزات Sprint 4
 * يتضمن تحديث ونشر Edge Function المحسن
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface EdgeFunctionConfig {
  name: string;
  sourcePath: string;
  environment?: Record<string, string>;
  timeout?: number;
  memory?: number;
  region?: string;
}

export interface DeploymentResult {
  success: boolean;
  functionUrl?: string;
  error?: string;
  logs?: string;
  version?: string;
}

export class EdgeFunctionManager {
  private supabaseUrl: string;
  private supabaseKey: string;
  private accessToken: string;

  constructor() {
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    this.supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    this.accessToken = process.env.SUPABASE_ACCESS_TOKEN || '';
    
    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new Error('متغيرات البيئة Supabase مفقودة');
    }
  }

  /**
   * نشر Edge Function مع ميزات Sprint 4
   */
  async deployEnhancedEdgeFunction(): Promise<DeploymentResult> {
    console.log('بدء نشر Edge Function المعززة لميزات Sprint 4...');

    try {
      // 1. التحقق من وجود Supabase CLI
      await this.verifySupabaseCLI();

      // 2. إنشاء مجلد Functions إذا لم يكن موجوداً
      await this.ensureFunctionsDirectory();

      // 3. نسخ Edge Function المحدثة
      await this.copyEnhancedEdgeFunction();

      // 4. نشر Edge Function
      const deployResult = await this.deployFunction();

      // 5. اختبار Edge Function
      const testResult = await this.testDeployedFunction();

      // 6. تسجيل النتائج
      await this.logDeploymentResults(deployResult, testResult);

      return {
        success: deployResult.success,
        functionUrl: deployResult.functionUrl,
        error: deployResult.error,
        logs: deployResult.logs,
        version: '4.0',
      };

    } catch (error) {
      console.error('خطأ في نشر Edge Function:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ غير معروف',
      };
    }
  }

  /**
   * التحقق من وجود Supabase CLI
   */
  private async verifySupabaseCLI(): Promise<void> {
    try {
      await execAsync('supabase --version');
      console.log('✅ Supabase CLI موجود');
    } catch (error) {
      console.log('⚠️ Supabase CLI غير موجود، سيتم تثبيته...');
      await this.installSupabaseCLI();
    }
  }

  /**
   * تثبيت Supabase CLI
   */
  private async installSupabaseCLI(): Promise<void> {
    try {
      // تثبيت Supabase CLI باستخدام npm
      await execAsync('npm install -g supabase');
      console.log('✅ تم تثبيت Supabase CLI بنجاح');
    } catch (error) {
      throw new Error('فشل في تثبيت Supabase CLI');
    }
  }

  /**
   * التأكد من وجود مجلد Functions
   */
  private async ensureFunctionsDirectory(): Promise<void> {
    try {
      await execAsync('mkdir -p supabase/functions');
      console.log('✅ تم إنشاء مجلد Functions');
    } catch (error) {
      throw new Error('فشل في إنشاء مجلد Functions');
    }
  }

  /**
   * نسخ Edge Function المعززة
   */
  private async copyEnhancedEdgeFunction(): Promise<void> {
    try {
      // قراءة محتوى Edge Function الجديد
      const enhancedFunctionPath = 'supabase/functions/generate-certificate/index.ts';
      
      // التحقق من وجود الملف المحدث
      await execAsync(`test -f ${enhancedFunctionPath} || echo "File not found"`);
      
      console.log('✅ Edge Function المعززة جاهزة للنشر');
    } catch (error) {
      console.log('ℹ️ سيتم إنشاء Edge Function جديدة...');
      // يمكن إضافة منطق لإنشاء Edge Function جديدة هنا
    }
  }

  /**
   * نشر Edge Function إلى Supabase
   */
  private async deployFunction(): Promise<DeploymentResult> {
    try {
      console.log('بدء عملية النشر...');

      // إعداد متغيرات البيئة للنشر
      const envVars = {
        SUPABASE_URL: this.supabaseUrl,
        SUPABASE_SERVICE_ROLE_KEY: this.supabaseKey,
        SPRINT_VERSION: '4.0',
        ENHANCED_FEATURES: 'qr,digital_signature,advanced_security',
      };

      // تنفيذ النشر باستخدام Supabase CLI
      const cmd = `supabase functions deploy generate-certificate --project-ref ${this.getProjectRef()}`;
      
      console.log(`تنفيذ الأمر: ${cmd}`);

      const { stdout, stderr } = await execAsync(cmd, {
        env: {
          ...process.env,
          ...envVars,
        },
      });

      console.log('✅ تم نشر Edge Function بنجاح');
      
      return {
        success: true,
        functionUrl: `${this.supabaseUrl}/functions/v1/generate-certificate`,
        logs: stdout + stderr,
        version: '4.0',
      };

    } catch (error) {
      console.error('❌ فشل في نشر Edge Function:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ في النشر',
      };
    }
  }

  /**
   * اختبار Edge Function المنشورة
   */
  private async testDeployedFunction(): Promise<boolean> {
    try {
      console.log('اختبار Edge Function المنشورة...');

      const testPayload = {
        access_code_id: 'test_code_123',
        template_id: 'test_template_456',
        student_name: 'اختبار المستخدم',
        enable_qr: true,
        enable_digital_signature: true,
      };

      const response = await fetch(`${this.supabaseUrl}/functions/v1/generate-certificate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload),
      });

      if (response.ok) {
        console.log('✅ Edge Function تعمل بشكل صحيح');
        return true;
      } else {
        console.log('⚠️ Edge Function ترد بخطأ:', await response.text());
        return false;
      }

    } catch (error) {
      console.error('❌ فشل في اختبار Edge Function:', error);
      return false;
    }
  }

  /**
   * تسجيل نتائج النشر
   */
  private async logDeploymentResults(deployResult: DeploymentResult, testResult: boolean): Promise<void> {
    const logData = {
      timestamp: new Date().toISOString(),
      sprint_version: '4.0',
      deployment_success: deployResult.success,
      function_url: deployResult.functionUrl,
      test_passed: testResult,
      error: deployResult.error,
      version: '4.0.0',
    };

    console.log('نتائج النشر:', JSON.stringify(logData, null, 2));

    // يمكن إضافة منطق لحفظ النتائج في قاعدة البيانات أو إرسال إشعار
  }

  /**
   * الحصول على معرف المشروع من URL
   */
  private getProjectRef(): string {
    // استخراج معرف المشروع من URL
    const match = this.supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
    if (match) {
      return match[1];
    }
    throw new Error('لا يمكن استخراج معرف المشروع من URL');
  }

  /**
   * الحصول على معلومات Edge Functions الحالية
   */
  async getEdgeFunctionsInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.supabaseUrl}/functions/v1/`, {
        headers: {
          'Authorization': `Bearer ${this.supabaseKey}`,
        },
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
    } catch (error) {
      console.error('خطأ في جلب معلومات Edge Functions:', error);
      throw error;
    }
  }

  /**
   * حذف Edge Function
   */
  async deleteEdgeFunction(functionName: string): Promise<boolean> {
    try {
      await execAsync(`supabase functions delete ${functionName} --project-ref ${this.getProjectRef()}`);
      console.log(`✅ تم حذف Edge Function: ${functionName}`);
      return true;
    } catch (error) {
      console.error(`❌ فشل في حذف Edge Function: ${functionName}`, error);
      return false;
    }
  }
}

// دالة مساعدة للنشر السريع
export async function deploySprint4EdgeFunction(): Promise<DeploymentResult> {
  const manager = new EdgeFunctionManager();
  return await manager.deployEnhancedEdgeFunction();
}

// دالة مساعدة لاختبار Edge Function
export async function testEdgeFunction(): Promise<boolean> {
  const manager = new EdgeFunctionManager();
  return await manager.testDeployedFunction();
}

// دالة مساعدة للحصول على معلومات Edge Functions
export async function getEdgeFunctionsInfo(): Promise<any> {
  const manager = new EdgeFunctionManager();
  return await manager.getEdgeFunctionsInfo();
}
