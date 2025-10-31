/**
 * أنواع الأمان لمنصة شهاداتي
 * Security Types for Shahadati Platform
 */

// أنواع التشفير
export enum EncryptionMethod {
  AES_256_GCM = 'aes-256-gcm',
  AES_256_CBC = 'aes-256-cbc',
  RSA_2048 = 'rsa-2048',
  RSA_4096 = 'rsa-4096'
}

// أنواع البيانات الحساسة
export enum SensitiveDataType {
  PERSONAL_INFO = 'personal_info',
  CERTIFICATE_DATA = 'certificate_data',
  TEMPLATE_CONTENT = 'template_content',
  ACCESS_CODE = 'access_code',
  STUDENT_RECORD = 'student_record'
}

// مستويات الأمان
export enum SecurityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// أنواع الأدوار
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  INSTRUCTOR = 'instructor',
  STUDENT = 'student',
  VIEWER = 'viewer'
}

// أنواع الصلاحيات
export enum Permission {
  CREATE_CERTIFICATE = 'create_certificate',
  READ_CERTIFICATE = 'read_certificate',
  UPDATE_CERTIFICATE = 'update_certificate',
  DELETE_CERTIFICATE = 'delete_certificate',
  GENERATE_ACCESS_CODE = 'generate_access_code',
  MANAGE_USERS = 'manage_users',
  MANAGE_SECURITY = 'manage_security',
  VIEW_LOGS = 'view_logs',
  BACKUP_DATA = 'backup_data',
  RESTORE_DATA = 'restore_data'
}

// أنواع التنبيهات
export enum AlertType {
  SECURITY_BREACH = 'security_breach',
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  FAILED_LOGIN = 'failed_login',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  DATA_BREACH = 'data_breach',
  BACKUP_FAILED = 'backup_failed',
  ENCRYPTION_FAILED = 'encryption_failed',
  SYSTEM_ERROR = 'system_error'
}

// مستويات التنبيه
export enum AlertLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// إعدادات التشفير
export interface EncryptionSettings {
  method: EncryptionMethod;
  keyLength: number;
  ivLength: number;
  saltLength: number;
  iterations: number;
  enabled: boolean;
  autoEncrypt: boolean;
  encryptSensitiveData: boolean;
  backupEncryption: boolean;
}

// إعدادات الصلاحيات
export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
  resourceRestrictions: {
    certificates?: number;
    templates?: number;
    accessCodes?: number;
  };
  timeRestrictions?: {
    activeHours?: string; // Example: "09:00-17:00"
    daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  };
}

// سجل الأمان
export interface SecurityLog {
  id: string;
  timestamp: Date;
  userId?: string;
  userEmail?: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  result: 'success' | 'failure' | 'blocked';
  severity: SecurityLevel;
  details: Record<string, any>;
  sessionId?: string;
}

// تنبيه الأمان
export interface SecurityAlert {
  id: string;
  timestamp: Date;
  type: AlertType;
  level: AlertLevel;
  title: string;
  message: string;
  userId?: string;
  ipAddress?: string;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  actions: string[];
  metadata: Record<string, any>;
}

// إعدادات النسخ الاحتياطي
export interface BackupSettings {
  enabled: boolean;
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  retentionDays: number;
  compressionLevel: 'fast' | 'normal' | 'maximum';
  encryption: boolean;
  storageLocation: 'local' | 'cloud' | 'both';
  includeAttachments: boolean;
  maxSize: number; // in MB
}

// عملية النسخ الاحتياطي
export interface BackupOperation {
  id: string;
  timestamp: Date;
  type: 'full' | 'incremental' | 'differential';
  status: 'pending' | 'running' | 'completed' | 'failed';
  size: number;
  duration: number; // in seconds
  filesCount: number;
  compressionRatio: number;
  location: string;
  checksum: string;
  encrypted: boolean;
}

// إعدادات المراقبة
export interface MonitoringSettings {
  enabled: boolean;
  realTimeMonitoring: boolean;
  alertThresholds: {
    failedLogins: number; // per hour
    suspiciousActivities: number; // per hour
    dataAccess: number; // per hour
    backupFailures: number; // per day
  };
  ipWhitelist: string[];
  ipBlacklist: string[];
  geoBlocking: {
    enabled: boolean;
    blockedCountries: string[];
  };
}

// جلسة المستخدم
export interface UserSession {
  id: string;
  userId: string;
  userEmail: string;
  ipAddress: string;
  userAgent: string;
  startTime: Date;
  lastActivity: Date;
  isActive: boolean;
  location?: {
    country: string;
    city: string;
    timezone: string;
  };
}

// إعدادات الأمان العامة
export interface SecurityConfig {
  sessionTimeout: number; // in minutes
  maxLoginAttempts: number;
  lockoutDuration: number; // in minutes
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
    preventReuse: number; // last N passwords
  };
  twoFactorAuth: {
    enabled: boolean;
    required: boolean;
    backupCodes: number;
  };
  encryption: EncryptionSettings;
  backup: BackupSettings;
  monitoring: MonitoringSettings;
}

// تقرير الأمان
export interface SecurityReport {
  id: string;
  generatedAt: Date;
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalEvents: number;
    securityIncidents: number;
    failedLogins: number;
    blockedAttempts: number;
    activeUsers: number;
  };
  trends: {
    loginAttempts: { date: string; count: number }[];
    securityAlerts: { date: string; count: number }[];
    dataAccess: { resource: string; count: number }[];
  };
  recommendations: string[];
}

// تحليل المخاطر
export interface RiskAssessment {
  level: SecurityLevel;
  score: number; // 0-100
  factors: {
    dataSensitivity: number;
    accessComplexity: number;
    externalThreats: number;
    internalRisks: number;
  };
  recommendations: string[];
  mitigation: string[];
}