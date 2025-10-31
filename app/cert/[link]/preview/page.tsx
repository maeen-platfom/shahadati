'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// تحميل CertificateRenderer ديناميكياً (client-side only)
const CertificateRenderer = dynamic(() => import('@/components/student/CertificateRenderer'), {
  ssr: false,
});

interface CertificateData {
  access_code_id: string;
  template_id: string;
  course_name: string;
  instructor_name: string;
  organization_name: string;
  student_name: string;
  template_file_url: string;
  fields: any[];
}

export default function PreviewPage({ params }: { params: { link: string } }) {
  const router = useRouter();
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedCertificate, setGeneratedCertificate] = useState<any>(null);
  const [renderedBlob, setRenderedBlob] = useState<Blob | null>(null);
  const [certificateNumber, setCertificateNumber] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // جلب البيانات من sessionStorage
    const dataStr = sessionStorage.getItem('certificateData');
    if (!dataStr) {
      router.push(`/cert/${params.link}`);
      return;
    }

    try {
      const data = JSON.parse(dataStr);
      setCertificateData(data);
      
      // توليد رقم الشهادة والتاريخ
      const year = new Date().getFullYear();
      const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
      setCertificateNumber(`CERT-${year}-${random}`);
      
      const date = new Date().toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      setCurrentDate(date);
    } catch (err) {
      router.push(`/cert/${params.link}`);
    }
  }, [params.link, router]);

  const handleCertificateRendered = (blob: Blob) => {
    setRenderedBlob(blob);
  };

  const handleGenerateCertificate = async () => {
    if (!certificateData || !renderedBlob) {
      setError('لم يتم رسم الشهادة بعد، يرجى الانتظار قليلاً');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // تحويل Blob إلى base64
      const reader = new FileReader();
      const base64Data = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(renderedBlob);
      });

      const response = await fetch('/api/cert/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_code_id: certificateData.access_code_id,
          template_id: certificateData.template_id,
          student_name: certificateData.student_name,
          certificate_image: base64Data,
          certificate_number: certificateNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشل إصدار الشهادة');
      }

      setGeneratedCertificate(data.data);
      
      // حفظ معلومات الشهادة في sessionStorage
      sessionStorage.setItem('generatedCertificate', JSON.stringify(data.data));
      
      // الانتقال إلى صفحة التحميل بعد ثانيتين
      setTimeout(() => {
        router.push(`/cert/${params.link}/download`);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditName = () => {
    router.push(`/cert/${params.link}`);
  };

  if (!certificateData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (generatedCertificate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4 animate-bounce">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">تم إصدار شهادتك بنجاح!</h1>
          <p className="text-gray-600 mb-4">جاري تحويلك لصفحة التحميل...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">معاينة شهادتك</h1>
          <p className="text-gray-600">تأكد من صحة اسمك قبل إصدار الشهادة</p>
        </div>

        {/* Preview Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          {/* معاينة القالب */}
          <div className="bg-gray-100 p-8 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">معاينة الشهادة</h3>
              <p className="text-gray-600 mb-4">سيتم توليد شهادتك مع المعلومات التالية:</p>
              
              {/* معلومات الشهادة */}
              <div className="bg-white rounded-lg p-6 text-right max-w-md mx-auto space-y-3">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-gray-600 text-sm">الدورة:</span>
                  <span className="font-semibold text-gray-900">{certificateData.course_name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-gray-600 text-sm">اسم الطالب:</span>
                  <span className="font-bold text-teal-600 text-lg">{certificateData.student_name}</span>
                </div>
                {certificateData.instructor_name && (
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="text-gray-600 text-sm">المحاضر:</span>
                    <span className="font-medium text-gray-900">{certificateData.instructor_name}</span>
                  </div>
                )}
                {certificateData.organization_name && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">المؤسسة:</span>
                    <span className="font-medium text-gray-900">{certificateData.organization_name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 bg-white border-t border-gray-200">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleEditName}
                disabled={loading}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                تعديل الاسم
              </button>
              <button
                onClick={handleGenerateCertificate}
                disabled={loading}
                className="flex-1 bg-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري الإصدار...
                  </span>
                ) : (
                  'إصدار الشهادة'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ملاحظة تحذيرية */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="font-semibold text-yellow-900 mb-1">تنبيه مهم</h4>
              <p className="text-sm text-yellow-800">
                تأكد من صحة اسمك قبل إصدار الشهادة. لن تتمكن من تعديله بعد الإصدار. إذا كنت بحاجة لتغيير الاسم، انقر على "تعديل الاسم".
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
