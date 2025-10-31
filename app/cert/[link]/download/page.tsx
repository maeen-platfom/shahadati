'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CertificateInfo {
  certificate_id: string;
  certificate_url: string;
  certificate_number: string;
  issued_at: string;
}

export default function DownloadPage({ params }: { params: { link: string } }) {
  const router = useRouter();
  const [certificate, setCertificate] = useState<CertificateInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // جلب معلومات الشهادة من sessionStorage
    const certStr = sessionStorage.getItem('generatedCertificate');
    if (!certStr) {
      router.push(`/cert/${params.link}`);
      return;
    }

    try {
      const cert = JSON.parse(certStr);
      setCertificate(cert);
      setLoading(false);
    } catch (err) {
      router.push(`/cert/${params.link}`);
    }
  }, [params.link, router]);

  const handleDownload = () => {
    if (!certificate) return;

    // فتح رابط الشهادة في نافذة جديدة
    window.open(certificate.certificate_url, '_blank');
  };

  const handlePrint = () => {
    if (!certificate) return;

    // فتح نافذة طباعة
    const printWindow = window.open(certificate.certificate_url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('تم نسخ رقم الشهادة');
  };

  if (loading || !certificate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Success */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">تهانينا!</h1>
          <p className="text-xl text-gray-600">تم إصدار شهادتك بنجاح</p>
        </div>

        {/* Certificate Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          {/* Preview */}
          <div className="bg-gray-100 p-8 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">شهادتك جاهزة للتحميل</h3>
              <p className="text-gray-600 mb-4">يمكنك تحميل الشهادة أو طباعتها أو مشاركتها</p>
            </div>
          </div>

          {/* Certificate Info */}
          <div className="p-6 bg-white border-t border-gray-200">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات الشهادة</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">رقم الشهادة:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-teal-600">{certificate.certificate_number}</span>
                    <button
                      onClick={() => copyToClipboard(certificate.certificate_number)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title="نسخ رقم الشهادة"
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">تاريخ الإصدار:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(certificate.issued_at).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 bg-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                تحميل PDF
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                طباعة
              </button>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'شهادتي',
                      text: `شهادة رقم ${certificate.certificate_number}`,
                      url: certificate.certificate_url,
                    });
                  } else {
                    copyToClipboard(certificate.certificate_url);
                  }
                }}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                مشاركة
              </button>
            </div>
          </div>
        </div>

        {/* Save to Account Prompt */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-2">هل تريد حفظ هذه الشهادة؟</h4>
          <p className="text-sm text-blue-800 mb-4">
            سجّل حساباً مجانياً لحفظ جميع شهاداتك في مكان واحد والوصول إليها في أي وقت
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/signup')}
              className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              إنشاء حساب
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-white text-gray-700 py-2 px-6 rounded-lg font-semibold hover:bg-gray-100 border border-gray-300 transition-colors"
            >
              لا، شكراً
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
