'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormData } from '@/lib/utils/validators';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: 'instructor',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            role: data.role,
            organization_name: data.organization_name || null,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        alert('تم إنشاء حسابك بنجاح! يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب.');
        router.push('/login');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إنشاء الحساب');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إنشاء حساب جديد</h1>
          <p className="text-gray-600">ابدأ رحلتك في إصدار الشهادات الرقمية</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              الاسم الكامل
            </label>
            <input
              {...register('full_name')}
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="أدخل اسمك الكامل"
            />
            {errors.full_name && (
              <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
            )}
          </div>

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

          {/* Role Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-3">
              نوع الحساب
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedRole === 'instructor'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-300 hover:border-indigo-300'
              }`}>
                <input
                  {...register('role')}
                  type="radio"
                  value="instructor"
                  className="hidden"
                />
                <span className="font-medium">محاضر / مدرب</span>
              </label>
              <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedRole === 'student'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-300 hover:border-indigo-300'
              }`}>
                <input
                  {...register('role')}
                  type="radio"
                  value="student"
                  className="hidden"
                />
                <span className="font-medium">طالب</span>
              </label>
            </div>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Organization Name (for instructors only) */}
          {selectedRole === 'instructor' && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                اسم المؤسسة / المركز (اختياري)
              </label>
              <input
                {...register('organization_name')}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="مثال: أكاديمية التعليم المتقدم"
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              كلمة المرور
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
            {isLoading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            لديك حساب بالفعل؟{' '}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              تسجيل دخول
            </Link>
          </p>
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
