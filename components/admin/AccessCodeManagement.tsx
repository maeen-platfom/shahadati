"use client"

import React, { useState, useEffect } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  Search, 
  Filter, 
  Plus, 
  Copy, 
  Edit, 
  Trash2, 
  Key,
  Users,
  Activity,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Download
} from 'lucide-react'

interface AccessCode {
  id: string
  code: string
  title: string
  description: string
  permission: 'read' | 'write' | 'admin'
  createdBy: string
  createdAt: string
  lastUsed: string | null
  usageCount: number
  maxUsage: number | null
  isActive: boolean
  validFrom: string
  validUntil: string | null
  userId: string
  instructorName: string
}

interface CodeStats {
  totalCodes: number
  activeCodes: number
  totalUsage: number
  avgUsagePerCode: number
  expiredCodes: number
  permissionStats: {
    read: number
    write: number
    admin: number
  }
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b']

export default function AccessCodeManagement() {
  const [codes, setCodes] = useState<AccessCode[]>([])
  const [filteredCodes, setFilteredCodes] = useState<AccessCode[]>([])
  const [stats, setStats] = useState<CodeStats>({
    totalCodes: 0,
    activeCodes: 0,
    totalUsage: 0,
    avgUsagePerCode: 0,
    expiredCodes: 0,
    permissionStats: { read: 0, write: 0, admin: 0 }
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPermission, setSelectedPermission] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sortBy, setSortBy] = useState<'usage' | 'created' | 'expires'>('usage')

  // محاكاة البيانات - يجب استبدالها ببيانات حقيقية من API
  useEffect(() => {
    const fetchCodesData = async () => {
      setLoading(true)
      
      // محاكاة استدعاء API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // بيانات وهمية لرموز الوصول
      const mockCodes: AccessCode[] = [
        {
          id: '1',
          code: 'EDU2024CERT001',
          title: 'رمز وصول الدورات التدريبية',
          description: 'للوصول إلى جميع الدورات التدريبية للشهادات',
          permission: 'write',
          createdBy: 'admin',
          createdAt: '2024-01-15',
          lastUsed: '2024-12-01',
          usageCount: 324,
          maxUsage: 500,
          isActive: true,
          validFrom: '2024-01-15',
          validUntil: '2024-12-31',
          userId: 'user_001',
          instructorName: 'أحمد محمد'
        },
        {
          id: '2',
          code: 'TRAIN2024WORK002',
          title: 'ورش العمل التدريبية',
          description: 'لورش العمل والندوات التدريبية',
          permission: 'read',
          createdBy: 'admin',
          createdAt: '2024-02-10',
          lastUsed: '2024-11-30',
          usageCount: 189,
          maxUsage: 200,
          isActive: true,
          validFrom: '2024-02-10',
          validUntil: '2024-12-31',
          userId: 'user_002',
          instructorName: 'فاطمة علي'
        },
        {
          id: '3',
          code: 'CERT2024ADV003',
          title: 'الشهادات المتقدمة',
          description: 'للشهادات المتقدمة والدبلومات المهنية',
          permission: 'admin',
          createdBy: 'admin',
          createdAt: '2024-03-05',
          lastUsed: '2024-11-29',
          usageCount: 145,
          maxUsage: 300,
          isActive: true,
          validFrom: '2024-03-05',
          validUntil: '2024-12-31',
          userId: 'user_003',
          instructorName: 'محمد السعد'
        },
        {
          id: '4',
          code: 'WORK2024PROJ004',
          title: 'مشاريع التخرج',
          description: 'لشهادات مشاريع التخرج والأكاديمية',
          permission: 'write',
          createdBy: 'admin',
          createdAt: '2024-01-20',
          lastUsed: '2024-11-28',
          usageCount: 92,
          maxUsage: 100,
          isActive: true,
          validFrom: '2024-01-20',
          validUntil: '2024-12-31',
          userId: 'user_004',
          instructorName: 'نورا أحمد'
        },
        {
          id: '5',
          code: 'APPREC2024BON005',
          title: 'شهادات التقدير',
          description: 'لشهادات التقدير والامتنان',
          permission: 'read',
          createdBy: 'admin',
          createdAt: '2024-04-12',
          lastUsed: '2024-11-20',
          usageCount: 67,
          maxUsage: null,
          isActive: false,
          validFrom: '2024-04-12',
          validUntil: '2024-11-30',
          userId: 'user_005',
          instructorName: 'عبدالله خالد'
        },
        {
          id: '6',
          code: 'DIP2024PRO006',
          title: 'الدبلومات المهنية',
          description: 'للدبلومات والشهادات المهنية المعتمدة',
          permission: 'write',
          createdBy: 'admin',
          createdAt: '2024-05-08',
          lastUsed: '2024-11-27',
          usageCount: 45,
          maxUsage: 150,
          isActive: true,
          validFrom: '2024-05-08',
          validUntil: '2024-12-31',
          userId: 'user_006',
          instructorName: 'سارة عبدالله'
        }
      ]

      setCodes(mockCodes)
      setFilteredCodes(mockCodes)
      
      // حساب الإحصائيات
      const totalCodes = mockCodes.length
      const activeCodes = mockCodes.filter(c => c.isActive).length
      const totalUsage = mockCodes.reduce((sum, c) => sum + c.usageCount, 0)
      const avgUsagePerCode = totalUsage / totalCodes
      const expiredCodes = mockCodes.filter(c => 
        c.validUntil && new Date(c.validUntil) < new Date()
      ).length
      const permissionStats = {
        read: mockCodes.filter(c => c.permission === 'read').length,
        write: mockCodes.filter(c => c.permission === 'write').length,
        admin: mockCodes.filter(c => c.permission === 'admin').length
      }

      setStats({
        totalCodes,
        activeCodes,
        totalUsage,
        avgUsagePerCode,
        expiredCodes,
        permissionStats
      })

      setLoading(false)
    }

    fetchCodesData()
  }, [])

  // فلترة وبحث رموز الوصول
  useEffect(() => {
    let filtered = codes

    // البحث
    if (searchTerm) {
      filtered = filtered.filter(code =>
        code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.instructorName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // فلترة حسب الصلاحية
    if (selectedPermission !== 'all') {
      filtered = filtered.filter(code => code.permission === selectedPermission)
    }

    // فلترة حسب الحالة
    if (selectedStatus !== 'all') {
      if (selectedStatus === 'active') {
        filtered = filtered.filter(code => code.isActive)
      } else if (selectedStatus === 'inactive') {
        filtered = filtered.filter(code => !code.isActive)
      } else if (selectedStatus === 'expired') {
        filtered = filtered.filter(code => 
          code.validUntil && new Date(code.validUntil) < new Date()
        )
      }
    }

    // ترتيب
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'usage':
          return b.usageCount - a.usageCount
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'expires':
          if (!a.validUntil && !b.validUntil) return 0
          if (!a.validUntil) return 1
          if (!b.validUntil) return -1
          return new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime()
        default:
          return 0
      }
    })

    setFilteredCodes(filtered)
  }, [codes, searchTerm, selectedPermission, selectedStatus, sortBy])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'غير محدد'
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isExpired = (code: AccessCode) => {
    return code.validUntil && new Date(code.validUntil) < new Date()
  }

  const formatNumber = (num: number) => num.toLocaleString('ar-SA')

  // بيانات الاستخدام للرسم البياني
  const usageChartData = codes.slice(0, 5).map(code => ({
    name: code.code.substring(0, 15) + '...',
    usage: code.usageCount,
    maxUsage: code.maxUsage || 0
  }))

  // بيانات توزيع الصلاحيات
  const permissionChartData = [
    { name: 'قراءة فقط', value: stats.permissionStats.read, color: COLORS[0] },
    { name: 'قراءة وكتابة', value: stats.permissionStats.write, color: COLORS[1] },
    { name: 'إدارة كاملة', value: stats.permissionStats.admin, color: COLORS[2] }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">جاري تحميل رموز الوصول...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6" dir="rtl">
      {/* العنوان الرئيسي */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة رموز الوصول</h1>
          <p className="text-muted-foreground mt-2">
            إدارة وتتبع جميع رموز الوصول والصلاحيات في النظام
          </p>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <Button>
            <Plus className="h-4 w-4 ml-2" />
            إنشاء رمز جديد
          </Button>
        </div>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الرموز</CardTitle>
            <Key className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalCodes)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الرموز النشطة</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.activeCodes)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الاستخدام</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalUsage)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط الاستخدام</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(Math.round(stats.avgUsagePerCode))}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">رموز منتهية</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.expiredCodes)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل النشاط</CardTitle>
            <Shield className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((stats.activeCodes / stats.totalCodes) * 100).toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>استخدام رموز الوصول</CardTitle>
            <CardDescription>عدد مرات الاستخدام لكل رمز</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usageChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px'
                    }}
                  />
                  <Bar dataKey="usage" fill="#4f46e5" name="الاستخدام الفعلي" />
                  <Bar dataKey="maxUsage" fill="#e5e7eb" name="الحد الأقصى" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>توزيع الصلاحيات</CardTitle>
            <CardDescription>نسبة أنواع الصلاحيات المختلفة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={permissionChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {permissionChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* البحث والفلترة */}
      <Card>
        <CardHeader>
          <CardTitle>البحث والفلترة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="البحث في رموز الوصول..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedPermission} onValueChange={setSelectedPermission}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 ml-2" />
                الصلاحية
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الصلاحيات</SelectItem>
                <SelectItem value="read">قراءة فقط</SelectItem>
                <SelectItem value="write">قراءة وكتابة</SelectItem>
                <SelectItem value="admin">إدارة كاملة</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-48">
                الحالة
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">متوقف</SelectItem>
                <SelectItem value="expired">منتهي الصلاحية</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full md:w-48">
                ترتيب حسب
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usage">الاستخدام</SelectItem>
                <SelectItem value="created">تاريخ الإنشاء</SelectItem>
                <SelectItem value="expires">تاريخ الانتهاء</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* جدول رموز الوصول */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة رموز الوصول ({filteredCodes.length})</CardTitle>
          <CardDescription>
            تفاصيل جميع رموز الوصول مع إمكانية التعديل والحذف
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رمز الوصول</TableHead>
                <TableHead>الوصف</TableHead>
                <TableHead>المدرب</TableHead>
                <TableHead>الصلاحية</TableHead>
                <TableHead>الاستخدام</TableHead>
                <TableHead>تاريخ الإنشاء</TableHead>
                <TableHead>آخر استخدام</TableHead>
                <TableHead>تاريخ الانتهاء</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCodes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Key className="h-4 w-4 ml-2 text-blue-500" />
                      <code className="font-mono text-sm">{code.code}</code>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{code.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {code.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{code.instructorName}</TableCell>
                  <TableCell>
                    <Badge variant={
                      code.permission === 'admin' ? 'destructive' :
                      code.permission === 'write' ? 'warning' : 'default'
                    }>
                      {code.permission === 'admin' ? 'إدارة كاملة' :
                       code.permission === 'write' ? 'قراءة وكتابة' : 'قراءة فقط'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{formatNumber(code.usageCount)}</div>
                    {code.maxUsage && (
                      <div className="text-sm text-muted-foreground">
                        من {formatNumber(code.maxUsage)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(code.createdAt)}</TableCell>
                  <TableCell>
                    {code.lastUsed ? formatDate(code.lastUsed) : 'لم يُستخدم'}
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center ${
                      isExpired(code) ? 'text-red-500' : 
                      code.validUntil ? 'text-orange-500' : 'text-gray-500'
                    }`}>
                      {isExpired(code) ? (
                        <AlertTriangle className="h-4 w-4 ml-1" />
                      ) : (
                        <Clock className="h-4 w-4 ml-1" />
                      )}
                      {formatDate(code.validUntil)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      !code.isActive ? 'destructive' :
                      isExpired(code) ? 'warning' : 'success'
                    }>
                      {!code.isActive ? 'متوقف' :
                       isExpired(code) ? 'منتهي الصلاحية' : 'نشط'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ملاحظات وإرشادات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 ml-2 text-blue-500" />
            إرشادات إدارة رموز الوصول
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">أنواع الصلاحيات:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-2" />
                  <strong>قراءة فقط:</strong> يمكن عرض الشهادات والتحقق منها
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full ml-2" />
                  <strong>قراءة وكتابة:</strong> إضافة وتعديل الشهادات
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full ml-2" />
                  <strong>إدارة كاملة:</strong> جميع الصلاحيات بما في ذلك إدارة المستخدمين
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">نصائح الأمان:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full ml-2" />
                  قم بمراجعة رموز الوصول بشكل دوري
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full ml-2" />
                  استخدم رموز وصول مؤقتة للمشاريع القصيرة
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full ml-2" />
                  راقب أنماط الاستخدام بحثاً عن الأنشطة المشبوهة
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}