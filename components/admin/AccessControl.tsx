/**
 * نظام الصلاحيات لمنصة شهاداتي
 * Access Control System for Shahadati Platform
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  EyeOff,
  Plus,
  Edit,
  Trash2,
  Save,
  RotateCcw,
  Search,
  Filter,
  UserCheck,
  UserX,
  Clock,
  Globe,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { 
  UserRole, 
  Permission, 
  RolePermissions,
  UserSession,
  SecurityLevel 
} from '@/types/security';

interface AccessControlProps {
  onRoleChange?: (roleId: string) => void;
}

export default function AccessControl({ onRoleChange }: AccessControlProps) {
  const [roles, setRoles] = useState<RolePermissions[]>([]);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [showPermissions, setShowPermissions] = useState(false);

  // جلب بيانات الصلاحيات عند تحميل المكون
  useEffect(() => {
    loadAccessControlData();
  }, []);

  // تحميل بيانات التحكم في الوصول
  const loadAccessControlData = async () => {
    try {
      setLoading(true);
      
      // جلب الأدوار والصلاحيات
      const rolesResponse = await fetch('/api/security?roles=true');
      if (rolesResponse.ok) {
        const rolesData = await rolesResponse.json();
        setRoles(rolesData);
      }
      
      // جلب المستخدمين النشطين
      const usersResponse = await fetch('/api/security?active_users=true');
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setActiveUsers(usersData);
      }
      
      // جلب الجلسات النشطة
      const sessionsResponse = await fetch('/api/security?sessions=true');
      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json();
        setSessions(sessionsData);
      }
    } catch (error) {
      console.error('خطأ في تحميل بيانات التحكم في الوصول:', error);
    } finally {
      setLoading(false);
    }
  };

  // حفظ دور جديد أو تحديث دور موجود
  const handleSaveRole = async (role: RolePermissions) => {
    try {
      const response = await fetch('/api/security', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'save_role',
          role
        }),
      });
      
      if (response.ok) {
        await loadAccessControlData();
        setEditingRole(null);
      }
    } catch (error) {
      console.error('خطأ في حفظ الدور:', error);
    }
  };

  // حذف دور
  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الدور؟')) return;
    
    try {
      const response = await fetch('/api/security', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete_role',
          roleId
        }),
      });
      
      if (response.ok) {
        await loadAccessControlData();
      }
    } catch (error) {
      console.error('خطأ في حذف الدور:', error);
    }
  };

  // إنهاء جلسة مستخدم
  const handleTerminateSession = async (sessionId: string) => {
    try {
      const response = await fetch('/api/security', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'terminate_session',
          sessionId
        }),
      });
      
      if (response.ok) {
        await loadAccessControlData();
      }
    } catch (error) {
      console.error('خطأ في إنهاء الجلسة:', error);
    }
  };

  // تصفية المستخدمين
  const filteredUsers = activeUsers.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="mr-3 text-lg">جاري تحميل بيانات التحكم في الوصول...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-purple-600 ml-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">نظام الصلاحيات</h1>
              <p className="text-gray-600">إدارة أدوار المستخدمين وصلاحياتهم</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowPermissions(!showPermissions)}
              className={`flex items-center px-4 py-2 rounded-lg ${
                showPermissions 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Key className="h-4 w-4 ml-2" />
              {showPermissions ? 'إخفاء الصلاحيات' : 'إظهار الصلاحيات'}
            </button>
            
            <button
              onClick={() => setEditingRole('new')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة دور جديد
            </button>
          </div>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي الأدوار"
          value={roles.length.toString()}
          icon={<Users className="h-6 w-6 text-blue-500" />}
          color="blue"
        />
        
        <StatCard
          title="المستخدمين النشطين"
          value={activeUsers.length.toString()}
          icon={<UserCheck className="h-6 w-6 text-green-500" />}
          color="green"
        />
        
        <StatCard
          title="الجلسات النشطة"
          value={sessions.filter(s => s.isActive).length.toString()}
          icon={<Clock className="h-6 w-6 text-orange-500" />}
          color="orange"
        />
        
        <StatCard
          title="مستوى الأمان"
          value="مرتفع"
          icon={<Shield className="h-6 w-6 text-red-500" />}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* إدارة الأدوار */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">إدارة الأدوار</h2>
            <button
              onClick={loadAccessControlData}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              تحديث
            </button>
          </div>

          <div className="space-y-4">
            {/* أدوار موجودة */}
            {roles.map((role) => (
              <RoleCard
                key={role.role}
                role={role}
                onEdit={() => setEditingRole(role.role)}
                onDelete={() => handleDeleteRole(role.role)}
                showPermissions={showPermissions}
                editing={editingRole === role.role}
                onSave={(updatedRole) => {
                  handleSaveRole(updatedRole);
                  setEditingRole(null);
                }}
                onCancel={() => setEditingRole(null)}
              />
            ))}

            {/* دور جديد */}
            {editingRole === 'new' && (
              <RoleCard
                role={{
                  role: UserRole.VIEWER,
                  permissions: [],
                  resourceRestrictions: {}
                }}
                isNew={true}
                onSave={(newRole) => {
                  handleSaveRole(newRole);
                  setEditingRole(null);
                }}
                onCancel={() => setEditingRole(null)}
                showPermissions={showPermissions}
              />
            )}
          </div>
        </div>

        {/* إدارة المستخدمين */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">المستخدمين النشطين</h2>
            
            <div className="flex items-center space-x-4">
              {/* بحث */}
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="بحث..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* فلتر حسب الدور */}
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as UserRole | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">جميع الأدوار</option>
                {Object.values(UserRole).map(role => (
                  <option key={role} value={role}>
                    {getRoleLabel(role)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onTerminate={() => handleTerminateSession(user.sessionId)}
              />
            ))}
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>لا توجد مستخدمين مطابقين للبحث</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* الجلسات النشطة */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">الجلسات النشطة</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المستخدم
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الموقع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  وقت البدء
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  آخر نشاط
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          {session.userEmail.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900">
                          {session.userEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {session.ipAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {session.location ? (
                      `${session.location.city}, ${session.location.country}`
                    ) : (
                      'غير محدد'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(session.startTime).toLocaleString('ar-SA')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(session.lastActivity).toLocaleString('ar-SA')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      session.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {session.isActive ? 'نشطة' : 'غير نشطة'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleTerminateSession(session.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      إنهاء
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/**
 * مكون بطاقة الدور
 */
function RoleCard({ 
  role, 
  isNew = false,
  onEdit, 
  onDelete, 
  onSave, 
  onCancel,
  showPermissions,
  editing = false
}: {
  role: RolePermissions;
  isNew?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onSave: (role: RolePermissions) => void;
  onCancel: () => void;
  showPermissions: boolean;
  editing?: boolean;
}) {
  const [editRole, setEditRole] = useState<RolePermissions>(role);

  const handleSave = () => {
    if (isNew) {
      onSave({
        ...editRole,
        role: editRole.role || UserRole.VIEWER
      });
    } else {
      onSave(editRole);
    }
  };

  const handlePermissionToggle = (permission: Permission) => {
    const permissions = editRole.permissions.includes(permission)
      ? editRole.permissions.filter(p => p !== permission)
      : [...editRole.permissions, permission];
    
    setEditRole({ ...editRole, permissions });
  };

  if (editing) {
    return (
      <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم الدور
            </label>
            <select
              value={editRole.role}
              onChange={(e) => setEditRole({ ...editRole, role: e.target.value as UserRole })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {Object.values(UserRole).map(roleOption => (
                <option key={roleOption} value={roleOption}>
                  {getRoleLabel(roleOption)}
                </option>
              ))}
            </select>
          </div>

          {showPermissions && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الصلاحيات
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {Object.values(Permission).map(permission => (
                  <label key={permission} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editRole.permissions.includes(permission)}
                      onChange={() => handlePermissionToggle(permission)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="mr-2 text-sm text-gray-700">
                      {getPermissionLabel(permission)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              <Save className="h-3 w-3 ml-1" />
              حفظ
            </button>
            <button
              onClick={onCancel}
              className="flex items-center px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
            >
              <RotateCcw className="h-3 w-3 ml-1" />
              إلغاء
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">
            {getRoleLabel(role.role)}
          </h3>
          <p className="text-sm text-gray-500">
            {role.permissions.length} صلاحية
          </p>
          
          {showPermissions && (
            <div className="mt-2 flex flex-wrap gap-1">
              {role.permissions.slice(0, 3).map(permission => (
                <span 
                  key={permission}
                  className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
                >
                  {getPermissionLabel(permission)}
                </span>
              ))}
              {role.permissions.length > 3 && (
                <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                  +{role.permissions.length - 3} أخرى
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit className="h-4 w-4" />
          </button>
          {!isNew && (
            <button
              onClick={onDelete}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * مكون بطاقة المستخدم
 */
function UserCard({ 
  user, 
  onTerminate 
}: { 
  user: any; 
  onTerminate: () => void; 
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {user.email.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900">{user.email}</h4>
            <div className="flex items-center text-sm text-gray-500">
              <span>{getRoleLabel(user.role)}</span>
              <span className="mx-2">•</span>
              <span>{user.lastActive || 'الآن'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            نشط
          </span>
          <button
            onClick={onTerminate}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            إنهاء الجلسة
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * مكون بطاقة الإحصائيات
 */
function StatCard({ 
  title, 
  value, 
  icon, 
  color 
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200'
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 border-r-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="flex-shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}

/**
 * وظائف مساعدة
 */
function getRoleLabel(role: UserRole): string {
  const labels = {
    [UserRole.SUPER_ADMIN]: 'مدير عام',
    [UserRole.ADMIN]: 'مدير',
    [UserRole.INSTRUCTOR]: 'محاضر',
    [UserRole.STUDENT]: 'طالب',
    [UserRole.VIEWER]: 'مشاهد'
  };
  return labels[role] || role;
}

function getPermissionLabel(permission: Permission): string {
  const labels = {
    [Permission.CREATE_CERTIFICATE]: 'إنشاء شهادة',
    [Permission.READ_CERTIFICATE]: 'قراءة شهادة',
    [Permission.UPDATE_CERTIFICATE]: 'تحديث شهادة',
    [Permission.DELETE_CERTIFICATE]: 'حذف شهادة',
    [Permission.GENERATE_ACCESS_CODE]: 'توليد رمز وصول',
    [Permission.MANAGE_USERS]: 'إدارة المستخدمين',
    [Permission.MANAGE_SECURITY]: 'إدارة الأمان',
    [Permission.VIEW_LOGS]: 'عرض السجلات',
    [Permission.BACKUP_DATA]: 'نسخ احتياطية',
    [Permission.RESTORE_DATA]: 'استعادة البيانات'
  };
  return labels[permission] || permission;
}