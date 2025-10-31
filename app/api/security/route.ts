/**
 * API route لإعدادات الأمان العامة
 * General Security Settings API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  SecurityConfig,
  SecurityAlert,
  UserSession,
  AlertType,
  AlertLevel,
  SecurityReport,
  UserRole,
  Permission
} from '@/types/security';
import { createSecurityAlert, logSecurityActivity } from '@/lib/utils/security';

// إعدادات الأمان الافتراضية
const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  sessionTimeout: 60, // 60 minutes
  maxLoginAttempts: 5,
  lockoutDuration: 30, // 30 minutes
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    preventReuse: 5
  },
  twoFactorAuth: {
    enabled: false,
    required: false,
    backupCodes: 5
  },
  encryption: {
    method: 'aes-256-gcm',
    keyLength: 32,
    ivLength: 16,
    saltLength: 32,
    iterations: 100000,
    enabled: true,
    autoEncrypt: true,
    encryptSensitiveData: true,
    backupEncryption: true
  },
  backup: {
    enabled: true,
    frequency: 'daily',
    retentionDays: 30,
    compressionLevel: 'normal',
    encryption: true,
    storageLocation: 'cloud',
    includeAttachments: true,
    maxSize: 5000
  },
  monitoring: {
    enabled: true,
    realTimeMonitoring: true,
    alertThresholds: {
      failedLogins: 10,
      suspiciousActivities: 5,
      dataAccess: 100,
      backupFailures: 3
    },
    ipWhitelist: [],
    ipBlacklist: [],
    geoBlocking: {
      enabled: false,
      blockedCountries: []
    }
  }
};

// بيانات وهمية للأمان
let securityAlerts: SecurityAlert[] = [
  {
    id: 'alert1',
    timestamp: new Date(),
    type: AlertType.FAILED_LOGIN,
    level: AlertLevel.WARNING,
    title: 'محاولات دخول متعددة فاشلة',
    message: 'تم رصد عدة محاولات دخول فاشلة من نفس العنوان',
    userEmail: 'suspicious@example.com',
    ipAddress: '192.168.1.100',
    resolved: false,
    actions: [
      'التحقق من صحة كلمة السر',
      'مراجعة سجلات الدخول'
    ],
    metadata: {
      attempts: 5,
      timeWindow: '15 minutes'
    }
  }
];

let activeSessions: UserSession[] = [
  {
    id: 'session1',
    userId: 'user1',
    userEmail: 'instructor@shahadati.com',
    ipAddress: '192.168.1.10',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    startTime: new Date(),
    lastActivity: new Date(),
    isActive: true,
    location: {
      country: 'المملكة العربية السعودية',
      city: 'الرياض',
      timezone: 'Asia/Riyadh'
    }
  }
];

let rolePermissions = [
  {
    role: UserRole.SUPER_ADMIN,
    permissions: Object.values(Permission),
    resourceRestrictions: {},
    timeRestrictions: undefined
  },
  {
    role: UserRole.ADMIN,
    permissions: [
      Permission.CREATE_CERTIFICATE,
      Permission.READ_CERTIFICATE,
      Permission.UPDATE_CERTIFICATE,
      Permission.GENERATE_ACCESS_CODE,
      Permission.MANAGE_USERS,
      Permission.VIEW_LOGS
    ],
    resourceRestrictions: {
      certificates: 1000,
      templates: 100,
      accessCodes: 50
    }
  },
  {
    role: UserRole.INSTRUCTOR,
    permissions: [
      Permission.CREATE_CERTIFICATE,
      Permission.READ_CERTIFICATE,
      Permission.UPDATE_CERTIFICATE,
      Permission.GENERATE_ACCESS_CODE
    ],
    resourceRestrictions: {
      certificates: 100,
      templates: 20,
      accessCodes: 10
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'alerts':
        const limit = Number(searchParams.get('limit')) || 10;
        const alerts = securityAlerts
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, limit);
        return NextResponse.json(alerts);

      case 'sessions':
        return NextResponse.json(activeSessions.filter(s => s.isActive));

      case 'roles':
        return NextResponse.json(rolePermissions);

      case 'report':
        const report: SecurityReport = {
          id: 'report1',
          generatedAt: new Date(),
          period: {
            start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            end: new Date()
          },
          summary: {
            totalEvents: 1450,
            securityIncidents: 3,
            failedLogins: 12,
            blockedAttempts: 7,
            activeUsers: activeSessions.length
          },
          trends: {
            loginAttempts: [
              { date: '2024-01-01', count: 150 },
              { date: '2024-01-02', count: 142 },
              { date: '2024-01-03', count: 138 },
              { date: '2024-01-04', count: 155 },
              { date: '2024-01-05', count: 149 },
              { date: '2024-01-06', count: 142 },
              { date: '2024-01-07', count: 147 }
            ],
            securityAlerts: [
              { date: '2024-01-01', count: 1 },
              { date: '2024-01-02', count: 0 },
              { date: '2024-01-03', count: 1 },
              { date: '2024-01-04', count: 1 },
              { date: '2024-01-05', count: 0 },
              { date: '2024-01-06', count: 0 },
              { date: '2024-01-07', count: 0 }
            ],
            dataAccess: [
              { resource: 'certificates', count: 450 },
              { resource: 'users', count: 320 },
              { resource: 'templates', count: 280 },
              { resource: 'access_codes', count: 200 }
            ]
          },
          recommendations: [
            'تفعيل التحقق بخطوتين للمدراء',
            'مراجعة دوري لقوائم IP المسموحة',
            'زيادة تكرار النسخ الاحتياطية'
          ]
        };
        return NextResponse.json(report);

      case 'active_users':
        const activeUsers = [
          {
            id: 'user1',
            email: 'instructor@shahadati.com',
            role: 'instructor',
            lastActive: 'الآن'
          },
          {
            id: 'user2',
            email: 'admin@shahadati.com',
            role: 'admin',
            lastActive: 'منذ 5 دقائق'
          }
        ];
        return NextResponse.json(activeUsers);

      default:
        // إعدادات الأمان الافتراضية
        return NextResponse.json(DEFAULT_SECURITY_CONFIG);
    }
  } catch (error) {
    console.error('خطأ في جلب بيانات الأمان:', error);
    return NextResponse.json(
      { error: 'خطأ في جلب بيانات الأمان' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'save_role':
        const newRole = body.role;
        
        // التحقق من صحة الدور
        if (!newRole.role || !newRole.permissions) {
          return NextResponse.json(
            { error: 'بيانات الدور غير صحيحة' },
            { status: 400 }
          );
        }

        // البحث عن دور موجود
        const existingIndex = rolePermissions.findIndex(r => r.role === newRole.role);
        
        if (existingIndex >= 0) {
          // تحديث دور موجود
          rolePermissions[existingIndex] = newRole;
        } else {
          // إضافة دور جديد
          rolePermissions.push(newRole);
        }

        // تسجيل النشاط
        logSecurityActivity({
          userId: 'admin_user',
          userEmail: 'admin@shahadati.com',
          action: 'role_updated',
          resource: `role_${newRole.role}`,
          ipAddress: request.ip || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          result: 'success',
          severity: 'medium',
          details: {
            role: newRole.role,
            permissionsCount: newRole.permissions.length
          }
        });

        return NextResponse.json({ 
          success: true, 
          message: 'تم حفظ الدور بنجاح' 
        });

      default:
        return NextResponse.json(
          { error: 'عملية غير مدعومة' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('خطأ في العمليات الأمنية:', error);
    return NextResponse.json(
      { error: 'خطأ في تنفيذ العملية' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'mark_alert_read':
        const alertId = body.alertId;
        const alertIndex = securityAlerts.findIndex(a => a.id === alertId);
        
        if (alertIndex >= 0) {
          securityAlerts[alertIndex] = {
            ...securityAlerts[alertIndex],
            resolved: true,
            resolvedAt: new Date(),
            resolvedBy: 'admin@shahadati.com'
          };

          return NextResponse.json({ 
            success: true, 
            message: 'تم تحديد التنبيه كمقروء' 
          });
        }

        return NextResponse.json(
          { error: 'التنبيه غير موجود' },
          { status: 404 }
        );

      case 'resolve_alert':
        const resolveAlertId = body.alertId;
        const resolveAlertIndex = securityAlerts.findIndex(a => a.id === resolveAlertId);
        
        if (resolveAlertIndex >= 0) {
          securityAlerts[resolveAlertIndex] = {
            ...securityAlerts[resolveAlertIndex],
            resolved: true,
            resolvedAt: new Date(),
            resolvedBy: 'admin@shahadati.com'
          };

          // تسجيل النشاط
          logSecurityActivity({
            userId: 'admin_user',
            userEmail: 'admin@shahadati.com',
            action: 'alert_resolved',
            resource: `alert_${resolveAlertId}`,
            ipAddress: request.ip || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
            result: 'success',
            severity: 'low',
            details: {
              alertId: resolveAlertId,
              resolutionMethod: 'manual'
            }
          });

          return NextResponse.json({ 
            success: true, 
            message: 'تم حل التنبيه' 
          });
        }

        return NextResponse.json(
          { error: 'التنبيه غير موجود' },
          { status: 404 }
        );

      default:
        return NextResponse.json(
          { error: 'عملية غير مدعومة' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('خطأ في تحديث بيانات الأمان:', error);
    return NextResponse.json(
      { error: 'خطأ في تحديث البيانات' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'delete_role':
        const roleId = body.roleId;
        const roleIndex = rolePermissions.findIndex(r => r.role === roleId);
        
        if (roleIndex >= 0) {
          rolePermissions.splice(roleIndex, 1);
          
          // تسجيل النشاط
          logSecurityActivity({
            userId: 'admin_user',
            userEmail: 'admin@shahadati.com',
            action: 'role_deleted',
            resource: `role_${roleId}`,
            ipAddress: request.ip || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
            result: 'success',
            severity: 'high',
            details: {
              role: roleId
            }
          });

          return NextResponse.json({ 
            success: true, 
            message: 'تم حذف الدور بنجاح' 
          });
        }

        return NextResponse.json(
          { error: 'الدور غير موجود' },
          { status: 404 }
        );

      case 'terminate_session':
        const sessionId = body.sessionId;
        const sessionIndex = activeSessions.findIndex(s => s.id === sessionId);
        
        if (sessionIndex >= 0) {
          activeSessions[sessionIndex] = {
            ...activeSessions[sessionIndex],
            isActive: false
          };

          // تسجيل النشاط
          logSecurityActivity({
            userId: 'admin_user',
            userEmail: 'admin@shahadati.com',
            action: 'session_terminated',
            resource: `session_${sessionId}`,
            ipAddress: request.ip || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
            result: 'success',
            severity: 'medium',
            details: {
              sessionId,
              userId: activeSessions[sessionIndex].userId
            }
          });

          return NextResponse.json({ 
            success: true, 
            message: 'تم إنهاء الجلسة' 
          });
        }

        return NextResponse.json(
          { error: 'الجلسة غير موجودة' },
          { status: 404 }
        );

      case 'delete_alert':
        const deleteAlertId = body.alertId;
        const deleteAlertIndex = securityAlerts.findIndex(a => a.id === deleteAlertId);
        
        if (deleteAlertIndex >= 0) {
          securityAlerts.splice(deleteAlertIndex, 1);
          
          return NextResponse.json({ 
            success: true, 
            message: 'تم حذف التنبيه' 
          });
        }

        return NextResponse.json(
          { error: 'التنبيه غير موجود' },
          { status: 404 }
        );

      default:
        return NextResponse.json(
          { error: 'عملية غير مدعومة' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('خطأ في حذف بيانات الأمان:', error);
    return NextResponse.json(
      { error: 'خطأ في حذف البيانات' },
      { status: 500 }
    );
  }
}