'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/utils/validators';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (updateError) throw updateError;

      alert('تم تحديث كلمة المرور بنجاح!');
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تحديث كلمة المرور');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إعادة تعيين كلمة المرور</h1>
          <p className="text-gray-600">أدخل كلمة المرور الجديدة</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              كلمة المرور الجديدة
            </label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="على الأقل 8 أحرف"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              تأكيد كلمة المرور
            </label>
            <input
              {...register('confirm_password')}
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="أعد إدخال كلمة المرور"
            />
            {errors.confirm_password && (
              <p className="text-red-500 text-sm mt-1">{errors.confirm_password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="animate-spin" size={20} />}
            {isLoading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
          </button>
        </form>

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
