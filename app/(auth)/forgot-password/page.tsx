'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/utils/validators';
import { createClient } from '@/lib/supabase/client';
import { Loader2, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">ش</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">نسيت كلمة المرور؟</h1>
          <p className="text-gray-600">أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle size={24} />
              <div>
                <p className="font-medium">تم إرسال الرابط بنجاح!</p>
                <p className="text-sm mt-1">تفقد بريدك الإلكتروني واتبع التعليمات لإعادة تعيين كلمة المرور.</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        {!success && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                البريد الإلكتروني
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="example@domain.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="animate-spin" size={20} />}
              {isLoading ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
            </button>
          </form>
        )}

        {/* Back to Login */}
        <div className="text-center mt-6">
          <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
            العودة لتسجيل الدخول
          </Link>
        </div>
      </div>

      {/* Back to Home */}
      <div className="text-center mt-6">
        <Link href="/" className="text-gray-600 hover:text-gray-800">
          العودة للصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}
