'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/lib/utils/validators';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Get user profile to determine role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single();

        // Redirect based on role
        if (profile?.role === 'instructor') {
          router.push('/instructor/dashboard');
        } else if (profile?.role === 'student') {
          router.push('/student/certificates');
        } else {
          router.push('/');
        }
      }
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الدخول. تحقق من بياناتك وحاول مرة أخرى.');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">تسجيل الدخول</h1>
          <p className="text-gray-600">أهلاً بك مرة أخرى في شهاداتي</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
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

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              كلمة المرور
            </label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="أدخل كلمة المرور"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-left">
            <Link
              href="/forgot-password"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="animate-spin" size={20} />}
            {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل دخول'}
          </button>
        </form>

        {/* Signup Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            ليس لديك حساب؟{' '}
            <Link href="/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
              إنشاء حساب جديد
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
