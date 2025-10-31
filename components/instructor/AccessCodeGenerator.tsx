'use client';

import { useState } from 'react';
import { AccessCode } from '@/types/accessCode';

interface AccessCodeGeneratorProps {
  templateId: string;
  courseName: string;
  onCodeGenerated?: (code: AccessCode) => void;
}

export default function AccessCodeGenerator({
  templateId,
  courseName,
  onCodeGenerated,
}: AccessCodeGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<AccessCode | null>(null);
  const [expiryEnabled, setExpiryEnabled] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [usageLimitEnabled, setUsageLimitEnabled] = useState(false);
  const [maxUses, setMaxUses] = useState<number>(100);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/certificates/${templateId}/access/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expires_at: expiryEnabled && expiryDate ? new Date(expiryDate).toISOString() : null,
          max_uses: usageLimitEnabled ? maxUses : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشل توليد الكود');
      }

      setGeneratedCode(data.data);
      onCodeGenerated?.(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`تم نسخ ${label}`);
  };

  const getFullLink = (uniqueLink: string) => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/cert/${uniqueLink}`;
  };

  return (
    <div className="space-y-6">
      {/* معلومات الدورة */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">الدورة</h3>
        <p className="text-gray-700">{courseName}</p>
      </div>

      {!generatedCode ? (
        <>
          {/* إعدادات الكود */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">إعدادات الكود</h3>

            {/* صلاحية الكود */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={expiryEnabled}
                  onChange={(e) => setExpiryEnabled(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  تحديد تاريخ انتهاء الصلاحية
                </span>
              </label>

              {expiryEnabled && (
                <input
                  type="datetime-local"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              )}
            </div>

            {/* عدد الاستخدامات */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={usageLimitEnabled}
                  onChange={(e) => setUsageLimitEnabled(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  تحديد عدد الاستخدامات الأقصى
                </span>
              </label>

              {usageLimitEnabled && (
                <input
                  type="number"
                  value={maxUses}
                  onChange={(e) => setMaxUses(parseInt(e.target.value))}
                  min="1"
                  max="10000"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* زر التوليد */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'جاري التوليد...' : 'توليد كود الوصول'}
          </button>
        </>
      ) : (
        <>
          {/* عرض الكود المولد */}
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500 rounded-full mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">تم إنشاء الكود بنجاح!</h3>
            </div>

            {/* الرابط الفريد */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الرابط الفريد
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={getFullLink(generatedCode.unique_link)}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <button
                  onClick={() => copyToClipboard(getFullLink(generatedCode.unique_link), 'الرابط')}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  نسخ
                </button>
              </div>
            </div>

            {/* الكود السري */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الكود السري
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={generatedCode.code}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-2xl font-mono font-bold text-center"
                />
                <button
                  onClick={() => copyToClipboard(generatedCode.code, 'الكود')}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  نسخ
                </button>
              </div>
            </div>

            {/* الإعدادات */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-2">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">إعدادات الكود</h4>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">الصلاحية:</span>
                <span className="font-medium text-gray-900">
                  {generatedCode.expires_at
                    ? new Date(generatedCode.expires_at).toLocaleString('ar-SA')
                    : 'بدون انتهاء'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">عدد الاستخدامات:</span>
                <span className="font-medium text-gray-900">
                  {generatedCode.max_uses ? `${generatedCode.max_uses} استخدام` : 'غير محدود'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">الحالة:</span>
                <span className="font-medium text-green-600">نشط</span>
              </div>
            </div>
          </div>

          {/* تعليمات المشاركة */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">كيفية المشاركة:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>شارك الرابط الفريد مع طلابك (بريد إلكتروني، واتساب، إلخ)</li>
              <li>أعطهم الكود السري في المحاضرة أو الاجتماع</li>
              <li>سيتمكنون من إصدار شهاداتهم فوراً!</li>
            </ol>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex gap-3">
            <button
              onClick={() => setGeneratedCode(null)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              إنشاء كود آخر
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="flex-1 bg-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              العودة للوحة التحكم
            </button>
          </div>
        </>
      )}
    </div>
  );
}
