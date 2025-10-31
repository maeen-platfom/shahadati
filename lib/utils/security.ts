/**
 * أدوات الأمان لمنصة شهاداتي
 * Security Utilities for Shahadati Platform
 */

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { 
  EncryptionMethod, 
  SensitiveDataType, 
  SecurityLevel,
  EncryptionSettings,
  SecurityLog,
  SecurityAlert,
  RiskAssessment
} from '@/types/security';

// إعدادات التشفير الافتراضية
export const DEFAULT_ENCRYPTION_SETTINGS: EncryptionSettings = {
  method: EncryptionMethod.AES_256_GCM,
  keyLength: 32,
  ivLength: 16,
  saltLength: 32,
  iterations: 100000,
  enabled: true,
  autoEncrypt: true,
  encryptSensitiveData: true,
  backupEncryption: true
};

/**
 * تشفير البيانات باستخدام AES-256-GCM
 */
export function encryptData(
  data: string, 
  key?: string, 
  settings: EncryptionSettings = DEFAULT_ENCRYPTION_SETTINGS
): string {
  if (!settings.enabled) return data;

  try {
    const encryptionKey = key || generateKey(settings.keyLength);
    const iv = crypto.randomBytes(settings.ivLength);
    const salt = crypto.randomBytes(settings.saltLength);
    
    // استخدام PBKDF2 لتوليد المفتاح
    const derivedKey = crypto.pbkdf2Sync(
      encryptionKey, 
      salt, 
      settings.iterations, 
      settings.keyLength, 
      'sha256'
    );
    
    const cipher = crypto.createCipherGCM(derivedKey, iv);
    let encrypted = cipher.update(data, 'utf8');
    cipher.final();
    
    const authTag = cipher.getAuthTag();
    
    // دمج البيانات المشفرة مع IV و Salt و Auth Tag
    const result = Buffer.concat([
      Buffer.from('SALT'), salt,
      Buffer.from('IV'), iv,
      Buffer.from('TAG'), authTag,
      encrypted
    ]).toString('base64');
    
    return result;
  } catch (error) {
    console.error('خطأ في تشفير البيانات:', error);
    throw new Error('فشل في تشفير البيانات');
  }
}

/**
 * فك التشفير
 */
export function decryptData(
  encryptedData: string, 
  key?: string, 
  settings: EncryptionSettings = DEFAULT_ENCRYPTION_SETTINGS
): string {
  if (!settings.enabled) return encryptedData;

  try {
    const buffer = Buffer.from(encryptedData, 'base64');
    
    // استخراج المكونات
    const salt = buffer.subarray(6, 38); // بعد 'SALT'
    const iv = buffer.subarray(42, 58);  // بعد 'IV'
    const authTag = buffer.subarray(62, 78); // بعد 'TAG'
    const encrypted = buffer.subarray(78);
    
    const encryptionKey = key || generateKey(settings.keyLength);
    
    // استرداد المفتاح المشتق
    const derivedKey = crypto.pbkdf2Sync(
      encryptionKey, 
      salt, 
      settings.iterations, 
      settings.keyLength, 
      'sha256'
    );
    
    const decipher = crypto.createDecipherGCM(derivedKey, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted);
    decipher.final();
    
    return decrypted.toString('utf8');
  } catch (error) {
    console.error('خطأ في فك التشفير:', error);
    throw new Error('فشل في فك التشفير');
  }
}

/**
 * تشفير البيانات الحساسة حسب النوع
 */
export function encryptSensitiveData(
  data: any, 
  dataType: SensitiveDataType,
  settings: EncryptionSettings = DEFAULT_ENCRYPTION_SETTINGS
): any {
  if (!settings.encryptSensitiveData) return data;

  const sensitiveTypes = [
    SensitiveDataType.PERSONAL_INFO,
    SensitiveDataType.CERTIFICATE_DATA,
    SensitiveDataType.STUDENT_RECORD
  ];

  if (sensitiveTypes.includes(dataType)) {
    return encryptData(JSON.stringify(data), undefined, settings);
  }

  return data;
}

/**
 * فك تشفير البيانات الحساسة
 */
export function decryptSensitiveData(
  encryptedData: any,
  dataType: SensitiveDataType,
  settings: EncryptionSettings = DEFAULT_ENCRYPTION_SETTINGS
): any {
  if (!settings.encryptSensitiveData || typeof encryptedData !== 'string') {
    return encryptedData;
  }

  try {
    const decrypted = decryptData(encryptedData, undefined, settings);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('خطأ في فك تشفير البيانات الحساسة:', error);
    return encryptedData;
  }
}

/**
 * توليد مفتاح تشفير عشوائي
 */
export function generateKey(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * توليد hash آمن للكلمة السرية
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * التحقق من الكلمة السرية
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * توليد token عشوائي آمن
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * حساب checksum للبيانات
 */
export function calculateChecksum(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * التحقق من integrity البيانات
 */
export function verifyChecksum(data: string, expectedChecksum: string): boolean {
  const actualChecksum = calculateChecksum(data);
  return actualChecksum === expectedChecksum;
}

/**
 * تسجيل نشاط أمني
 */
export function logSecurityActivity(log: Omit<SecurityLog, 'id' | 'timestamp'>): void {
  const securityLog: SecurityLog = {
    ...log,
    id: generateSecureToken(16),
    timestamp: new Date()
  };
  
  // حفظ في قاعدة البيانات (يمكن تنفيذها لاحقاً)
  console.log('سجل أمني:', securityLog);
}

/**
 * إنشاء تنبيه أمني
 */
export function createSecurityAlert(alert: Omit<SecurityAlert, 'id' | 'timestamp'>): SecurityAlert {
  return {
    ...alert,
    id: generateSecureToken(16),
    timestamp: new Date(),
    resolved: false
  };
}

/**
 * تقييم مستوى الأمان للبيانات
 */
export function assessDataSecurity(data: any, dataType: SensitiveDataType): RiskAssessment {
  const baseScore = getBaseSecurityScore(dataType);
  
  const factors = {
    dataSensitivity: getDataSensitivityScore(dataType),
    accessComplexity: assessAccessComplexity(data),
    externalThreats: assessExternalThreats(),
    internalRisks: assessInternalRisks()
  };
  
  const totalScore = Math.round(
    (factors.dataSensitivity * 0.3 + 
     factors.accessComplexity * 0.25 + 
     factors.externalThreats * 0.25 + 
     factors.internalRisks * 0.2) * 100
  );
  
  return {
    level: getSecurityLevelFromScore(totalScore),
    score: totalScore,
    factors,
    recommendations: generateSecurityRecommendations(factors),
    mitigation: generateMitigationStrategies(factors)
  };
}

/**
 * مسح IP address من البيانات الحساسة
 */
export function sanitizeIPAddress(ip: string): string {
  // إخفاء آخر octet للعنوان الخاص
  if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
    return ip.replace(/\.\d+$/, '.xxx');
  }
  return ip;
}

/**
 * تنظيف User Agent
 */
export function sanitizeUserAgent(userAgent: string): string {
  // إزالة معلومات حساسة من User Agent
  return userAgent.replace(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/g, '[IP]');
}

/**
 * تحقق من قوة الكلمة السرية
 */
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
  strength: 'weak' | 'medium' | 'strong' | 'very_strong';
} {
  const feedback: string[] = [];
  let score = 0;
  
  // طول الكلمة السرية
  if (password.length >= 8) score += 20;
  else feedback.push('يجب أن تكون الكلمة السرية 8 أحرف على الأقل');
  
  if (password.length >= 12) score += 10;
  
  // أحرف صغيرة
  if (/[a-z]/.test(password)) score += 10;
  else feedback.push('يجب أن تحتوي على أحرف صغيرة');
  
  // أحرف كبيرة
  if (/[A-Z]/.test(password)) score += 10;
  else feedback.push('يجب أن تحتوي على أحرف كبيرة');
  
  // أرقام
  if (/\d/.test(password)) score += 10;
  else feedback.push('يجب أن تحتوي على أرقام');
  
  // رموز خاصة
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 10;
  else feedback.push('يجب أن تحتوي على رموز خاصة');
  
  // تجنب الأنماط الشائعة
  if (!/(123|abc|password|qwerty)/i.test(password)) score += 20;
  else feedback.push('تجنب استخدام كلمات أو أنماط شائعة');
  
  let strength: 'weak' | 'medium' | 'strong' | 'very_strong';
  if (score < 40) strength = 'weak';
  else if (score < 60) strength = 'medium';
  else if (score < 80) strength = 'strong';
  else strength = 'very_strong';
  
  return { score, feedback, strength };
}

/**
 * وظائف مساعدة خاصة
 */

function getBaseSecurityScore(dataType: SensitiveDataType): number {
  const scores: Record<SensitiveDataType, number> = {
    [SensitiveDataType.PERSONAL_INFO]: 80,
    [SensitiveDataType.CERTIFICATE_DATA]: 70,
    [SensitiveDataType.TEMPLATE_CONTENT]: 60,
    [SensitiveDataType.ACCESS_CODE]: 90,
    [SensitiveDataType.STUDENT_RECORD]: 85
  };
  return scores[dataType] || 50;
}

function getDataSensitivityScore(dataType: SensitiveDataType): number {
  const sensitivity: Record<SensitiveDataType, number> = {
    [SensitiveDataType.PERSONAL_INFO]: 9,
    [SensitiveDataType.STUDENT_RECORD]: 8,
    [SensitiveDataType.ACCESS_CODE]: 9,
    [SensitiveDataType.CERTIFICATE_DATA]: 7,
    [SensitiveDataType.TEMPLATE_CONTENT]: 5
  };
  return sensitivity[dataType] || 5;
}

function assessAccessComplexity(data: any): number {
  // تقييم تعقيد الوصول للبيانات
  return Math.random() * 5 + 5; // مؤقتاً
}

function assessExternalThreats(): number {
  // تقييم التهديدات الخارجية
  return Math.random() * 5 + 3; // مؤقتاً
}

function assessInternalRisks(): number {
  // تقييم المخاطر الداخلية
  return Math.random() * 5 + 2; // مؤقتاً
}

function getSecurityLevelFromScore(score: number): SecurityLevel {
  if (score >= 80) return SecurityLevel.CRITICAL;
  if (score >= 60) return SecurityLevel.HIGH;
  if (score >= 40) return SecurityLevel.MEDIUM;
  return SecurityLevel.LOW;
}

function generateSecurityRecommendations(factors: any): string[] {
  const recommendations = [];
  
  if (factors.dataSensitivity > 7) {
    recommendations.push('استخدم تشفير قوي للبيانات الحساسة');
  }
  if (factors.accessComplexity > 6) {
    recommendations.push('قم بمراجعة وإدارة الوصول للبيانات');
  }
  if (factors.externalThreats > 6) {
    recommendations.push('فعّل مراقبة الشبكة والحماية من الهجمات');
  }
  
  return recommendations;
}

function generateMitigationStrategies(factors: any): string[] {
  const strategies = [];
  
  strategies.push('تطبيق التشفير المتقدم للبيانات');
  strategies.push('تفعيل نظام مراقبة الأمان');
  strategies.push('إجراء نسخ احتياطية منتظمة');
  strategies.push('تحديث دوري لصلاحيات المستخدمين');
  
  return strategies;
}