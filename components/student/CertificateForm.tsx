'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CertificateFormProps {
  link: string;
}

export default function CertificateForm({ link }: CertificateFormProps) {
  const router = useRouter();
  const [studentName, setStudentName] = useState('');
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // التحقق من البيانات
    if (!studentName.trim()) {
      setError('الرجاء إدخال الاسم الكامل');
      return;
    }

    if (!code.trim()) {
      setError('الرجاء إدخال الكود السري');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/cert/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          link,
          code: code.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشل التحقق من الكود');
      }

      // حفظ البيانات في sessionStorage للاستخدام في الصفحة التالية
      sessionStorage.setItem('certificateData', JSON.stringify({
        ...data.data,
        student_name: studentName.trim(),
      }));

      // الانتقال إلى صفحة المعاينة
      router.push(`/cert/${link}/preview`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* حقل الاسم */}
      <div>
        <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-2">
          الاسم الكامل <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="studentName"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="محمد أحمد علي"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
          disabled={loading}
        />
        <p className="text-xs text-gray-500 mt-1">كما تريد أن يظهر في الشهادة</p>
      </div>

      {/* حقل الكود السري */}
      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
          الكود السري <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showCode ? 'text' : 'password'}
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="أدخل الكود الذي تلقيته"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg font-mono"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowCode(!showCode)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showCode ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* رسالة الخطأ */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* زر الإرسال */}
      <button
        type="submit"
        disabled={loading || !studentName.trim() || !code.trim()}
        className="w-full bg-teal-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            جاري التحقق...
          </span>
        ) : (
          'التحقق والمعاينة'
        )}
      </button>

      {/* ملاحظة */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">تأكد من صحة الاسم</p>
            <p>اكتب اسمك كما تريد أن يظهر في الشهادة بالضبط. لن تتمكن من تعديله بعد إصدار الشهادة.</p>
          </div>
        </div>
      </div>
    </form>
  );
}
