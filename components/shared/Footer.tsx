import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 space-x-reverse mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">ش</span>
              </div>
              <span className="text-2xl font-bold text-white">شهاداتي</span>
            </div>
            <p className="text-sm leading-relaxed">
              منصة احترافية لأتمتة إصدار الشهادات الرقمية، نساعد المحاضرين والمدربين على إصدار شهادات احترافية في دقائق.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-indigo-400 transition-colors text-sm">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-indigo-400 transition-colors text-sm">
                  عن المنصة
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-indigo-400 transition-colors text-sm">
                  كيف يعمل
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-indigo-400 transition-colors text-sm">
                  المميزات
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">الدعم</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-indigo-400 transition-colors text-sm">
                  مركز المساعدة
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-400 transition-colors text-sm">
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-400 transition-colors text-sm">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-400 transition-colors text-sm">
                  شروط الاستخدام
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-indigo-400" />
                <span className="text-sm">info@shahadati.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-indigo-400" />
                <span className="text-sm">+966 50 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-indigo-400" />
                <span className="text-sm">الرياض، المملكة العربية السعودية</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm">
            © {currentYear} شهاداتي. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
