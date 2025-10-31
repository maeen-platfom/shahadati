"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard,
  FileText,
  Key,
  Award,
  Activity,
  Shield,
  Settings,
  Bell,
  User,
  ChevronDown,
  LogOut,
  Menu,
  X
} from 'lucide-react'

// Mock user data - في التطبيق الحقيقي سيتم جلب هذا من Auth Context أو API
interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
  avatar?: string;
  lastLogin: string;
  permissions: string[];
}

const mockAdminUser: AdminUser = {
  id: '1',
  name: 'أحمد محمد الإداري',
  email: 'admin@shahadati.sa',
  role: 'super_admin',
  avatar: null,
  lastLogin: new Date().toISOString(),
  permissions: [
    'read_all_certificates',
    'manage_users', 
    'view_reports',
    'system_settings',
    'export_data',
    'manage_templates'
  ]
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [user] = useState<AdminUser>(mockAdminUser);
  
  const router = useRouter();
  const { showSuccess, showError, showWarning } = useNotifications();

  // التحقق من الصلاحيات - في التطبيق الحقيقي سيتم هذا في middleware
  useEffect(() => {
    // mock permission check
    if (!user || !user.permissions.includes('read_all_certificates')) {
      showError('صلاحيات غير كافية', 'ليس لديك صلاحية للوصول إلى لوحة الإدارة');
      router.push('/');
      return;
    }

    showSuccess('مرحباً', `مرحباً ${user.name} في لوحة الإدارة`);
  }, [user, router, showSuccess, showError]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
        if (window.innerWidth < 1280) {
          setSidebarCollapsed(true);
        } else {
          setSidebarCollapsed(false);
        }
      }
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      // في التطبيق الحقيقي سيتم هذا عبر Auth Context
      showSuccess('تم تسجيل الخروج', 'تم تسجيل الخروج بنجاح');
      router.push('/login');
    } catch (error) {
      showError('خطأ في تسجيل الخروج', 'حدث خطأ أثناء تسجيل الخروج');
    }
  };

  // Auto-collapse sidebar on smaller screens
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 right-0 z-40 h-screen bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${sidebarCollapsed ? 'w-16' : 'w-72'}
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <div className="flex-1 overflow-hidden">
            <Navigation 
              collapsed={sidebarCollapsed} 
              onToggle={toggleSidebar}
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <AdminHeader
          user={user}
          onLogout={handleLogout}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          notificationsCount={notificationsCount}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500 dark:text-gray-400">
              <span>© 2025 نظام شهاداتي</span>
              <span>•</span>
              <span>الإصدار 2.1.0</span>
              <span>•</span>
              <span>حالة النظام: ممتاز</span>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse text-sm">
              <Link 
                href="/admin/help" 
                className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
              >
                المساعدة
              </Link>
              <Link 
                href="/admin/support" 
                className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
              >
                الدعم التقني
              </Link>
              <Link 
                href="/admin/feedback" 
                className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
              >
                إرسال ملاحظات
              </Link>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={toggleMobileMenu}
        className={`
          fixed top-4 right-4 z-50 lg:hidden
          p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700
          text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
          transition-colors duration-200
          ${isMobileMenuOpen ? 'rotate-180' : ''}
        `}
        aria-label={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Notification System for Admin */}
      <NotificationSystem position="top-left" />
    </div>
  );
};

export default AdminLayout;