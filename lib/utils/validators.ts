import { z } from 'zod';

export const signupSchema = z.object({
  full_name: z.string().min(3, 'الاسم يجب أن يكون على الأقل 3 أحرف'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون على الأقل 8 أحرف'),
  confirm_password: z.string(),
  role: z.enum(['instructor', 'student'], {
    required_error: 'يجب اختيار نوع الحساب',
  }),
  organization_name: z.string().optional(),
}).refine((data) => data.password === data.confirm_password, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirm_password'],
});

export const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'كلمة المرور يجب أن تكون على الأقل 8 أحرف'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirm_password'],
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
