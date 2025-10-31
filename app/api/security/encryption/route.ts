/**
 * API route لإعدادات التشفير
 * Encryption Settings API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  EncryptionSettings,
  EncryptionMethod,
  SensitiveDataType
} from '@/types/security';
import { 
  encryptData, 
  decryptData, 
  generateKey, 
  DEFAULT_ENCRYPTION_SETTINGS,
  logSecurityActivity 
} from '@/lib/utils/security';

// إعدادات التشفير الافتراضية
let encryptionSettings: EncryptionSettings = { ...DEFAULT_ENCRYPTION_SETTINGS };

// سجل عمليات التشفير
interface EncryptionLog {
  id: string;
  timestamp: Date;
  operation: 'encrypt' | 'decrypt' | 'test' | 'key_generate';
  dataType: SensitiveDataType;
  result: 'success' | 'failure';
  duration: number; // milliseconds
  errorMessage?: string;
  metadata: {
    method: EncryptionMethod;
    keyLength: number;
    dataSize: number;
  };
}

let encryptionLogs: EncryptionLog[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'test':
        // اختبار التشفير
        const testData = 'بيانات تجريبية للتشفير';
        const startTime = Date.now();
        
        try {
          const key = generateKey(32);
          const encrypted = encryptData(testData, key, encryptionSettings);
          const decrypted = decryptData(encrypted, key, encryptionSettings);
          const duration = Date.now() - startTime;
          
          const testResult = {
            success: decrypted === testData,
            encrypted,
            decrypted,
            duration,
            keyLength: key.length
          };
          
          // تسجيل الاختبار
          encryptionLogs.push({
            id: `test_${Date.now()}`,
            timestamp: new Date(),
            operation: 'test',
            dataType: SensitiveDataType.CERTIFICATE_DATA,
            result: 'success',
            duration,
            metadata: {
              method: encryptionSettings.method,
              keyLength: encryptionSettings.keyLength,
              dataSize: testData.length
            }
          });
          
          return NextResponse.json(testResult);
        } catch (error) {
          return NextResponse.json({
            success: false,
            error: 'فشل في اختبار التشفير',
            message: error.message
          }, { status: 500 });
        }

      case 'logs':
        // جلب سجلات التشفير
        const limit = Number(searchParams.get('limit')) || 100;
        const logs = encryptionLogs
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, limit);
        
        return NextResponse.json(logs);

      case 'stats':
        // إحصائيات التشفير
        const stats = {
          totalOperations: encryptionLogs.length,
          successfulOperations: encryptionLogs.filter(log => log.result === 'success').length,
          failedOperations: encryptionLogs.filter(log => log.result === 'failure').length,
          averageDuration: encryptionLogs.length > 0 
            ? encryptionLogs.reduce((sum, log) => sum + log.duration, 0) / encryptionLogs.length 
            : 0,
          operationTypes: {
            encrypt: encryptionLogs.filter(log => log.operation === 'encrypt').length,
            decrypt: encryptionLogs.filter(log => log.operation === 'decrypt').length,
            test: encryptionLogs.filter(log => log.operation === 'test').length,
            key_generate: encryptionLogs.filter(log => log.operation === 'key_generate').length
          }
        };
        
        return NextResponse.json(stats);

      default:
        // إعدادات التشفير
        return NextResponse.json(encryptionSettings);
    }
  } catch (error) {
    console.error('خطأ في جلب إعدادات التشفير:', error);
    return NextResponse.json(
      { error: 'خطأ في جلب إعدادات التشفير' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data, dataType, key } = body;

    switch (action) {
      case 'encrypt':
        if (!data || !dataType) {
          return NextResponse.json(
            { error: 'بيانات ونوع البيانات مطلوبان' },
            { status: 400 }
          );
        }

        const startTime = Date.now();
        
        try {
          const encryptionKey = key || generateKey(encryptionSettings.keyLength);
          const encrypted = encryptData(data, encryptionKey, encryptionSettings);
          const duration = Date.now() - startTime;
          
          // تسجيل العملية
          const logEntry: EncryptionLog = {
            id: `encrypt_${Date.now()}`,
            timestamp: new Date(),
            operation: 'encrypt',
            dataType: dataType,
            result: 'success',
            duration,
            metadata: {
              method: encryptionSettings.method,
              keyLength: encryptionSettings.keyLength,
              dataSize: data.length
            }
          };
          encryptionLogs.push(logEntry);
          
          // تسجيل النشاط الأمني
          logSecurityActivity({
            userId: 'system',
            userEmail: 'system@shahadati.com',
            action: 'data_encrypted',
            resource: `data_${dataType}`,
            ipAddress: request.ip || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
            result: 'success',
            severity: 'medium',
            details: {
              dataType,
              method: encryptionSettings.method,
              dataSize: data.length,
              duration
            }
          });
          
          return NextResponse.json({
            success: true,
            encrypted,
            key: encryptionKey,
            method: encryptionSettings.method,
            timestamp: new Date(),
            duration
          });
        } catch (error) {
          const duration = Date.now() - startTime;
          
          // تسجيل الفشل
          const logEntry: EncryptionLog = {
            id: `encrypt_${Date.now()}`,
            timestamp: new Date(),
            operation: 'encrypt',
            dataType: dataType,
            result: 'failure',
            duration,
            errorMessage: error.message,
            metadata: {
              method: encryptionSettings.method,
              keyLength: encryptionSettings.keyLength,
              dataSize: data.length
            }
          };
          encryptionLogs.push(logEntry);
          
          return NextResponse.json({
            success: false,
            error: 'فشل في التشفير',
            message: error.message
          }, { status: 500 });
        }

      case 'decrypt':
        if (!data || !dataType || !key) {
          return NextResponse.json(
            { error: 'البيانات المشفرة والمفتاح مطلوبان' },
            { status: 400 }
          );
        }

        const decryptStartTime = Date.now();
        
        try {
          const decrypted = decryptData(data, key, encryptionSettings);
          const duration = Date.now() - decryptStartTime;
          
          // تسجيل العملية
          const logEntry: EncryptionLog = {
            id: `decrypt_${Date.now()}`,
            timestamp: new Date(),
            operation: 'decrypt',
            dataType: dataType,
            result: 'success',
            duration,
            metadata: {
              method: encryptionSettings.method,
              keyLength: encryptionSettings.keyLength,
              dataSize: data.length
            }
          };
          encryptionLogs.push(logEntry);
          
          // تسجيل النشاط الأمني
          logSecurityActivity({
            userId: 'system',
            userEmail: 'system@shahadati.com',
            action: 'data_decrypted',
            resource: `data_${dataType}`,
            ipAddress: request.ip || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
            result: 'success',
            severity: 'low',
            details: {
              dataType,
              method: encryptionSettings.method,
              duration
            }
          });
          
          return NextResponse.json({
            success: true,
            decrypted,
            timestamp: new Date(),
            duration
          });
        } catch (error) {
          const duration = Date.now() - decryptStartTime;
          
          // تسجيل الفشل
          const logEntry: EncryptionLog = {
            id: `decrypt_${Date.now()}`,
            timestamp: new Date(),
            operation: 'decrypt',
            dataType: dataType,
            result: 'failure',
            duration,
            errorMessage: error.message,
            metadata: {
              method: encryptionSettings.method,
              keyLength: encryptionSettings.keyLength,
              dataSize: data.length
            }
          };
          encryptionLogs.push(logEntry);
          
          return NextResponse.json({
            success: false,
            error: 'فشل في فك التشفير',
            message: error.message
          }, { status: 500 });
        }

      case 'generate_key':
        const keyLength = Number(body.keyLength) || encryptionSettings.keyLength;
        const generatedKey = generateKey(keyLength);
        
        const generateStartTime = Date.now();
        
        // تسجيل عملية توليد المفتاح
        const logEntry: EncryptionLog = {
          id: `key_gen_${Date.now()}`,
          timestamp: new Date(),
          operation: 'key_generate',
          dataType: SensitiveDataType.PERSONAL_INFO,
          result: 'success',
          duration: Date.now() - generateStartTime,
          metadata: {
            method: encryptionSettings.method,
            keyLength: keyLength,
            dataSize: generatedKey.length
          }
        };
        encryptionLogs.push(logEntry);
        
        // تسجيل النشاط الأمني
        logSecurityActivity({
          userId: 'system',
          userEmail: 'system@shahadati.com',
          action: 'encryption_key_generated',
          resource: 'encryption_keys',
          ipAddress: request.ip || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          result: 'success',
          severity: 'medium',
          details: {
            keyLength,
            method: encryptionSettings.method
          }
        });
        
        return NextResponse.json({
          success: true,
          key: generatedKey,
          keyLength,
          timestamp: new Date()
        });

      default:
        return NextResponse.json(
          { error: 'عملية غير مدعومة' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('خطأ في عمليات التشفير:', error);
    return NextResponse.json(
      { error: 'خطأ في تنفيذ عملية التشفير' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings } = body;

    if (!settings) {
      return NextResponse.json(
        { error: 'الإعدادات مطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من صحة الإعدادات
    const validatedSettings: EncryptionSettings = {
      method: settings.method || encryptionSettings.method,
      keyLength: settings.keyLength || encryptionSettings.keyLength,
      ivLength: settings.ivLength || encryptionSettings.ivLength,
      saltLength: settings.saltLength || encryptionSettings.saltLength,
      iterations: settings.iterations || encryptionSettings.iterations,
      enabled: settings.enabled !== undefined ? settings.enabled : encryptionSettings.enabled,
      autoEncrypt: settings.autoEncrypt !== undefined ? settings.autoEncrypt : encryptionSettings.autoEncrypt,
      encryptSensitiveData: settings.encryptSensitiveData !== undefined ? settings.encryptSensitiveData : encryptionSettings.encryptSensitiveData,
      backupEncryption: settings.backupEncryption !== undefined ? settings.backupEncryption : encryptionSettings.backupEncryption
    };

    // التحقق من صحة القيم
    if (validatedSettings.keyLength < 16 || validatedSettings.keyLength > 64) {
      return NextResponse.json(
        { error: 'طول المفتاح يجب أن يكون بين 16 و 64 بايت' },
        { status: 400 }
      );
    }

    if (validatedSettings.iterations < 1000 || validatedSettings.iterations > 1000000) {
      return NextResponse.json(
        { error: 'عدد التكرارات يجب أن يكون بين 1000 و 1000000' },
        { status: 400 }
      );
    }

    const oldSettings = { ...encryptionSettings };
    encryptionSettings = validatedSettings;

    // تسجيل النشاط الأمني
    logSecurityActivity({
      userId: 'admin_user',
      userEmail: 'admin@shahadati.com',
      action: 'encryption_settings_updated',
      resource: 'encryption_settings',
      ipAddress: request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      result: 'success',
      severity: 'medium',
      details: {
        oldMethod: oldSettings.method,
        newMethod: validatedSettings.method,
        oldKeyLength: oldSettings.keyLength,
        newKeyLength: validatedSettings.keyLength,
        oldIterations: oldSettings.iterations,
        newIterations: validatedSettings.iterations,
        encryptionEnabled: validatedSettings.enabled
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم حفظ إعدادات التشفير بنجاح',
      settings: encryptionSettings
    });
  } catch (error) {
    console.error('خطأ في حفظ إعدادات التشفير:', error);
    return NextResponse.json(
      { error: 'خطأ في حفظ الإعدادات' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const logId = searchParams.get('id');

    switch (action) {
      case 'clear_logs':
        // حذف جميع سجلات التشفير
        const clearedLogsCount = encryptionLogs.length;
        encryptionLogs = [];
        
        // تسجيل النشاط
        logSecurityActivity({
          userId: 'admin_user',
          userEmail: 'admin@shahadati.com',
          action: 'encryption_logs_cleared',
          resource: 'encryption_logs',
          ipAddress: request.ip || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          result: 'success',
          severity: 'high',
          details: {
            logsCleared: clearedLogsCount
          }
        });

        return NextResponse.json({
          success: true,
          message: `تم حذف ${clearedLogsCount} سجل`,
          clearedCount: clearedLogsCount
        });

      case 'delete_log':
        if (!logId) {
          return NextResponse.json(
            { error: 'معرف السجل مطلوب' },
            { status: 400 }
          );
        }

        const logIndex = encryptionLogs.findIndex(log => log.id === logId);
        
        if (logIndex >= 0) {
          encryptionLogs.splice(logIndex, 1);
          
          return NextResponse.json({
            success: true,
            message: 'تم حذف السجل'
          });
        } else {
          return NextResponse.json(
            { error: 'السجل غير موجود' },
            { status: 404 }
          );
        }

      default:
        return NextResponse.json(
          { error: 'عملية غير مدعومة' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('خطأ في حذف بيانات التشفير:', error);
    return NextResponse.json(
      { error: 'خطأ في حذف البيانات' },
      { status: 500 }
    );
  }
}