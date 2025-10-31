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
  Line
} from 'recharts'
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  TrendingUp,
  Award,
  Users,
  Calendar,
  Star,
  FileText
} from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  category: string
  createdAt: string
  createdBy: string
  usageCount: number
  rating: number
  isActive: boolean
  lastUsed: string
  downloadCount: number
}

interface TemplateStats {
  totalTemplates: number
  activeTemplates: number
  mostUsed: Template
  avgUsagePerTemplate: number
}

export default function TemplateManagement() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([])
  const [stats, setStats] = useState<TemplateStats>({
    totalTemplates: 0,
    activeTemplates: 0,
    mostUsed: {} as Template,
    avgUsagePerTemplate: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState<'name' | 'usage' | 'rating' | 'created'>('usage')

  // محاكاة البيانات - يجب استبدالها ببيانات حقيقية من API
  useEffect(() => {
    const fetchTemplatesData = async () => {
      setLoading(true)
      
      // محاكاة استدعاء API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // بيانات وهمية للقوالب
      const mockTemplates: Template[] = [
        {
          id: '1',
          name: 'شهادة حضور دورة تدريبية',
          description: 'قالب للشهادات المقدمة عند حضور الدورات التدريبية',
          category: 'التدريب',
          createdAt: '2024-01-15',
          createdBy: 'أحمد محمد',
          usageCount: 3240,
          rating: 4.8,
          isActive: true,
          lastUsed: '2024-12-01',
          downloadCount: 5800
        },
        {
          id: '2',
          name: 'شهادة إتمام برنامج تدريبي',
          description: 'للبرامج التدريبية المتقدمة والشاملة',
          category: 'التدريب',
          createdAt: '2024-02-10',
          createdBy: 'فاطمة علي',
          usageCount: 2890,
          rating: 4.6,
          isActive: true,
          lastUsed: '2024-11-30',
          downloadCount: 4200
        },
        {
          id: '3',
          name: 'شهادة مشاركة في ورشة عمل',
          description: 'مخصصة لورش العمل والندوات القصيرة',
          category: 'ورش العمل',
          createdAt: '2024-03-05',
          createdBy: 'محمد السعد',
          usageCount: 2156,
          rating: 4.5,
          isActive: true,
          lastUsed: '2024-11-29',
          downloadCount: 3200
        },
        {
          id: '4',
          name: 'شهادة إنجاز مشروع',
          description: 'لمشاريع التخرج والمشاريع الأكاديمية',
          category: 'الأكاديمي',
          createdAt: '2024-01-20',
          createdBy: 'نورا أحمد',
          usageCount: 892,
          rating: 4.9,
          isActive: true,
          lastUsed: '2024-11-28',
          downloadCount: 1500
        },
        {
          id: '5',
          name: 'شهادة تقدير وامتنان',
          description: 'للتقدير والامتنان على الجهود المبذولة',
          category: 'تقدير',
          createdAt: '2024-04-12',
          createdBy: 'عبدالله خالد',
          usageCount: 567,
          rating: 4.3,
          isActive: false,
          lastUsed: '2024-11-20',
          downloadCount: 890
        },
        {
          id: '6',
          name: 'شهادة دبلوم مهني',
          description: 'للدبلومات المهنية والشهادات المعتمدة',
          category: 'مهني',
          createdAt: '2024-05-08',
          createdBy: 'سارة عبدالله',
          usageCount: 445,
          rating: 4.7,
          isActive: true,
          lastUsed: '2024-11-27',
          downloadCount: 720
        }
      ]

      setTemplates(mockTemplates)
      setFilteredTemplates(mockTemplates)
      
      // حساب الإحصائيات
      const totalTemplates = mockTemplates.length
      const activeTemplates = mockTemplates.filter(t => t.isActive).length
      const mostUsed = mockTemplates.reduce((prev, current) => 
        prev.usageCount > current.usageCount ? prev : current
      )
      const avgUsagePerTemplate = mockTemplates.reduce((sum, t) => sum + t.usageCount, 0) / totalTemplates

      setStats({
        totalTemplates,
        activeTemplates,
        mostUsed,
        avgUsagePerTemplate
      })

      setLoading(false)
    }

    fetchTemplatesData()
  }, [])

  // فلترة وبحث القوالب
  useEffect(() => {
    let filtered = templates

    // البحث
    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // فلترة حسب الفئة
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory)
    }

    // ترتيب
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'ar')
        case 'usage':
          return b.usageCount - a.usageCount
        case 'rating':
          return b.rating - a.rating
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

    setFilteredTemplates(filtered)
  }, [templates, searchTerm, selectedCategory, sortBy])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const categories = [...new Set(templates.map(t => t.category))]

  const formatNumber = (num: number) => num.toLocaleString('ar-SA')

  // بيانات الاستخدام للرسوم البيانية
  const usageChartData = templates.slice(0, 5).map(template => ({
    name: template.name.substring(0, 20) + '...',
    usage: template.usageCount,
    downloads: template.downloadCount
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">جاري تحميل القوالب...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6" dir="rtl">
      {/* العنوان الرئيسي */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة القوالب</h1>
          <p className="text-muted-foreground mt-2">
            إدارة وتتبع جميع قوالب الشهادات في النظام
          </p>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <Button>
            <Award className="h-4 w-4 ml-2" />
            إنشاء قالب جديد
          </Button>
        </div>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي القوالب</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalTemplates)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">القوالب النشطة</CardTitle>
            <Star className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.activeTemplates)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">القالب الأكثر استخداماً</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{stats.mostUsed?.name?.substring(0, 20)}...</div>
            <p className="text-xs text-muted-foreground">{formatNumber(stats.mostUsed?.usageCount || 0)} استخدام</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط الاستخدام</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(Math.round(stats.avgUsagePerTemplate))}</div>
            <p className="text-xs text-muted-foreground">استخدام لكل قالب</p>
          </CardContent>
        </Card>
      </div>

      {/* رسم بياني لأكثر القوالب استخداماً */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>أكثر القوالب استخداماً</CardTitle>
            <CardDescription>عدد مرات الاستخدام لكل قالب</CardDescription>
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
                  <Bar dataKey="usage" fill="#4f46e5" name="عدد الاستخدامات" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>معدلات التحميل والاستخدام</CardTitle>
            <CardDescription>مقارنة بين التحميل والاستخدام</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usageChartData}>
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
                  <Line type="monotone" dataKey="usage" stroke="#4f46e5" strokeWidth={2} name="الاستخدام" />
                  <Line type="monotone" dataKey="downloads" stroke="#10b981" strokeWidth={2} name="التحميل" />
                </LineChart>
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
                  placeholder="البحث في القوالب..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 ml-2" />
                جميع الفئات
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full md:w-48">
                ترتيب حسب
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usage">الاستخدام</SelectItem>
                <SelectItem value="rating">التقييم</SelectItem>
                <SelectItem value="name">الاسم</SelectItem>
                <SelectItem value="created">تاريخ الإنشاء</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* جدول القوالب */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة القوالب ({filteredTemplates.length})</CardTitle>
          <CardDescription>
            تفاصيل جميع القوالب مع إمكانية التعديل والحذف
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم القالب</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>عدد الاستخدامات</TableHead>
                <TableHead>التقييم</TableHead>
                <TableHead>تاريخ الإنشاء</TableHead>
                <TableHead>آخر استخدام</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {template.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{template.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{formatNumber(template.usageCount)}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatNumber(template.downloadCount)} تحميل
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 ml-1" />
                      {template.rating}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 ml-1 text-gray-400" />
                      {formatDate(template.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(template.lastUsed)}</TableCell>
                  <TableCell>
                    <Badge variant={template.isActive ? "success" : "destructive"}>
                      {template.isActive ? "نشط" : "متوقف"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
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
    </div>
  )
}