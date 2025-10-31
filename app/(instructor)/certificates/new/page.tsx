'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import dynamic from 'next/dynamic';
import FileUploadZone from '@/components/instructor/FileUploadZone';
import { createClient } from '@/lib/supabase/client';

// تحميل ديناميكي لـ FieldPositioner لتجنب مشاكل SSR
const FieldPositioner = dynamic(
  () => import('@/components/instructor/FieldPositioner'),
  { ssr: false }
);

const courseInfoSchema = z.object({
  course_name: z.string().min(3, 'اسم الدورة يجب أن يكون على الأقل 3 أحرف'),
  course_description: z.string().optional(),
  course_date: z.string().optional(),
});

type CourseInfoData = z.infer<typeof courseInfoSchema>;

const STEPS = [
  { id: 1, name: 'معلومات الدورة' },
  { id: 2, name: 'رفع القالب' },
  { id: 3, name: 'تحديد الحقول' },
];

export default function NewCertificatePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [courseInfo, setCourseInfo] = useState<CourseInfoData | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseInfoData>({
    resolver: zodResolver(courseInfoSchema),
  });

  // Step 1: حفظ معلومات الدورة
  const onSubmitCourseInfo = (data: CourseInfoData) => {
    setCourseInfo(data);
    setCurrentStep(2);
  };

  // Step 2: حفظ الملف المرفوع
  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setCurrentStep(3);
  };

  // Step 3: حفظ الحقول والبيانات
  const handleFieldsSave = async (fields: any[], dimensions: { width: number; height: number }) => {
    if (!courseInfo || !uploadedFile) return;

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) throw new Error('غير مسجل الدخول');

      const userId = session.user.id;
      const templateId = crypto.randomUUID();
      const fileExtension = uploadedFile.name.split('.').pop();
      const filePath = `${userId}/${templateId}.${fileExtension}`;

      // رفع الملف إلى Storage
      const { error: uploadError } = await supabase.storage
        .from('certificate-templates')
        .upload(filePath, uploadedFile);

      if (uploadError) throw uploadError;

      // الحصول على الرابط العام
      const { data: urlData } = supabase.storage
        .from('certificate-templates')
        .getPublicUrl(filePath);

      // حفظ في جدول certificate_templates
      const { error: templateError } = await supabase
        .from('certificate_templates')
        .insert({
          id: templateId,
          instructor_id: userId,
          course_name: courseInfo.course_name,
          course_description: courseInfo.course_description || null,
          course_date: courseInfo.course_date || null,
          template_file_url: urlData.publicUrl,
          template_file_type: fileExtension as 'png' | 'jpg' | 'jpeg' | 'pdf',
          template_file_size: uploadedFile.size,
          template_width: dimensions.width,
          template_height: dimensions.height,
          status: 'active',
        });

      if (templateError) throw templateError;

      // حفظ الحقول
      const fieldsData = fields.map((field, index) => ({
        template_id: templateId,
        field_type: field.type,
        field_label: field.label || field.type,
        position_x_percent: field.xPercent,
        position_y_percent: field.yPercent,
        font_family: field.fontFamily || 'Cairo',
        font_size: field.fontSize || 24,
        font_color: field.fontColor || '#000000',
        font_weight: field.fontWeight || 'normal',
        text_align: field.textAlign || 'center',
        max_width_percent: field.maxWidthPercent || 50,
        display_order: index + 1,
        is_required: field.type === 'student_name',
      }));

      const { error: fieldsError } = await supabase
        .from('template_fields')
        .insert(fieldsData);

      if (fieldsError) throw fieldsError;

      alert('تم حفظ القالب بنجاح!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error saving template:', error);
      alert('حدث خطأ أثناء الحفظ: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep >= step.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep > step.id ? <Check size={20} /> : step.id}
                </div>
                <span
                  className={`font-medium ${
                    currentStep >= step.id ? 'text-indigo-600' : 'text-gray-600'
                  }`}
                >
                  {step.name}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`flex-1 h-1 mx-4 ${
                  currentStep > step.id ? 'bg-indigo-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Step 1: معلومات الدورة */}
        {currentStep === 1 && (
          <form onSubmit={handleSubmit(onSubmitCourseInfo)} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">معلومات الدورة</h2>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                اسم الدورة <span className="text-red-500">*</span>
              </label>
              <input
                {...register('course_name')}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="مثال: دورة البرمجة المتقدمة"
              />
              {errors.course_name && (
                <p className="text-red-500 text-sm mt-1">{errors.course_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                تاريخ الدورة (اختياري)
              </label>
              <input
                {...register('course_date')}
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                وصف الدورة (اختياري)
              </label>
              <textarea
                {...register('course_description')}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="وصف مختصر عن الدورة..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                التالي
                <ArrowLeft size={20} />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: رفع القالب */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">رفع قالب الشهادة</h2>
            <FileUploadZone onFileUpload={handleFileUpload} />
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2 bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                <ArrowRight size={20} />
                السابق
              </button>
            </div>
          </div>
        )}

        {/* Step 3: تحديد الحقول */}
        {currentStep === 3 && uploadedFile && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">تحديد مواقع الحقول</h2>
            <FieldPositioner
              file={uploadedFile}
              onSave={handleFieldsSave}
              onBack={() => setCurrentStep(2)}
              isSubmitting={isSubmitting}
            />
          </div>
        )}
      </div>
    </div>
  );
}
