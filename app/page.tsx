import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import Link from 'next/link';
import { 
  Upload, 
  MousePointer, 
  Link as LinkIcon, 
  Download, 
  Shield, 
  Zap, 
  Users, 
  FileCheck,
  CheckCircle,
  Sparkles,
  Eye,
  Monitor,
  BarChart3,
  Activity
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              أصدر شهاداتك في دقائق، لا ساعات
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-indigo-100 leading-relaxed">
              منصة احترافية لأتمتة إصدار الشهادات الرقمية للمحاضرين والأساتذة. 
              انس عناء النسخ واللصق، ودع التكنولوجيا تقوم بالعمل الشاق.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
              >
                ابدأ الآن مجاناً
              </Link>
              <Link
                href="#how-it-works"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-indigo-600 transition-all"
              >
                شاهد كيف يعمل
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              كيف يعمل؟
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              أربع خطوات بسيطة لإصدار شهادات احترافية لجميع طلابك
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="text-indigo-600" size={32} />
              </div>
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">ارفع قالب شهادتك</h3>
              <p className="text-gray-600">
                ارفع تصميم شهادتك الخاص (PNG, JPG, أو PDF)
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MousePointer className="text-purple-600" size={32} />
              </div>
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">حدد مكان الاسم</h3>
              <p className="text-gray-600">
                انقر على المكان الذي سيظهر فيه اسم الطالب
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LinkIcon className="text-pink-600" size={32} />
              </div>
              <div className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">أنشئ رابط مشاركة</h3>
              <p className="text-gray-600">
                احصل على رابط آمن مع كود سري لمشاركته مع الطلاب
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="text-green-600" size={32} />
              </div>
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">الطلاب يحصلون على شهاداتهم</h3>
              <p className="text-gray-600">
                يدخل الطالب اسمه والكود ويحمل شهادته فوراً
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              لماذا شهاداتي؟
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ميزات قوية تجعل إصدار الشهادات أسهل وأسرع من أي وقت مضى
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-xl">
              <Zap className="text-indigo-600 mb-4" size={40} />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">سريع جداً</h3>
              <p className="text-gray-600 leading-relaxed">
                أصدر مئات الشهادات في دقائق معدودة. لا حاجة للنسخ واللصق اليدوي.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl">
              <Shield className="text-purple-600 mb-4" size={40} />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">آمن تماماً</h3>
              <p className="text-gray-600 leading-relaxed">
                أكواد سرية، روابط مشفرة، وصلاحيات محددة. بياناتك في أمان.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-red-50 p-8 rounded-xl">
              <Users className="text-pink-600 mb-4" size={40} />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">سهل الاستخدام</h3>
              <p className="text-gray-600 leading-relaxed">
                واجهة بسيطة وسهلة. لا تحتاج لخبرة تقنية للبدء.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-xl">
              <FileCheck className="text-green-600 mb-4" size={40} />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">جودة احترافية</h3>
              <p className="text-gray-600 leading-relaxed">
                شهادات بصيغة PDF عالية الجودة، جاهزة للطباعة والمشاركة.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-xl">
              <CheckCircle className="text-blue-600 mb-4" size={40} />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">متابعة دقيقة</h3>
              <p className="text-gray-600 leading-relaxed">
                تتبع جميع الشهادات المُصدرة، واعرف من حصل على شهادته.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-8 rounded-xl">
              <Download className="text-orange-600 mb-4" size={40} />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">أرشفة ذكية</h3>
              <p className="text-gray-600 leading-relaxed">
                يمكن للطلاب إنشاء حساب وحفظ جميع شهاداتهم في مكان واحد.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section - New Addition */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              جرب معاينة المكونات الآن
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              استكشف جميع المكونات والميزات المطورة في Sprint 5
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden shadow-lg">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-3 space-x-reverse mb-4">
                    <Sparkles className="w-8 h-8" />
                    <h3 className="text-2xl font-bold">معاينة شاملة للمكونات</h3>
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <p className="text-lg text-blue-100 mb-6">
                    اكتشف جميع المكونات المطورة في منصة شهاداتي
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center mb-6">
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      <Monitor className="w-3 h-3 mr-1" />
                      مكونات أساسية
                    </Badge>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      <Zap className="w-3 h-3 mr-1" />
                      ميزات متقدمة
                    </Badge>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      <BarChart3 className="w-3 h-3 mr-1" />
                      لوحة تحكم
                    </Badge>
                  </div>
                  <Link href="/ui-demo">
                    <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                      <Eye className="w-5 h-5 mr-2" />
                      مشاهدة المعاينة
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              إنجازات Sprint 5
            </h2>
            <p className="text-lg text-gray-600">
              إحصائيات سريعة عن المشروع والمكونات المطورة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Monitor className="text-blue-600" size={32} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">40+</div>
              <p className="text-gray-600">مكون UI</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-purple-600" size={32} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">15+</div>
              <p className="text-gray-600">ميزة متقدمة</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="text-green-600" size={32} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">100%</div>
              <p className="text-gray-600">TypeScript</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="text-orange-600" size={32} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">85%</div>
              <p className="text-gray-600">معدل التقدم</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            جاهز لتحويل طريقة إصدار شهاداتك؟
          </h2>
          <p className="text-xl mb-8 text-indigo-100 max-w-2xl mx-auto">
            انضم لمئات المحاضرين الذين وفروا ساعات من العمل باستخدام شهاداتي
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-block bg-white text-indigo-600 px-10 py-4 rounded-lg font-bold text-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
            >
              ابدأ الآن مجاناً
            </Link>
            <Link
              href="/ui-demo"
              className="inline-block bg-transparent border-2 border-white text-white px-10 py-4 rounded-lg font-bold text-xl hover:bg-white hover:text-indigo-600 transition-all"
            >
              شاهد المكونات
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
