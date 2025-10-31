'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface FileUploadZoneProps {
  onFileUpload: (file: File) => void;
}

export default function FileUploadZone({ onFileUpload }: FileUploadZoneProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError('');

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError('حجم الملف يتجاوز 5MB');
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('نوع الملف غير مدعوم. يرجى رفع ملف PNG أو JPG أو PDF');
      } else {
        setError('خطأ في رفع الملف');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);

      // إنشاء preview للصور فقط
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 5242880, // 5MB
    multiple: false,
  });

  const handleRemove = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setError('');
  };

  const handleContinue = () => {
    if (uploadedFile) {
      onFileUpload(uploadedFile);
    }
  };

  return (
    <div className="space-y-6">
      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} type="file" />
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="text-indigo-600" size={32} />
            </div>
            {isDragActive ? (
              <p className="text-lg font-medium text-indigo-600">
                أفلت الملف هنا...
              </p>
            ) : (
              <>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  اسحب قالب الشهادة هنا أو انقر للتصفح
                </p>
                <p className="text-sm text-gray-600">
                  PNG, JPG, أو PDF (الحد الأقصى 5MB)
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="border-2 border-gray-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            {previewUrl ? (
              <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <File className="text-gray-400" size={48} />
              </div>
            )}

            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">{uploadedFile.name}</h4>
              <p className="text-sm text-gray-600 mb-2">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <p className="text-sm text-green-600 font-medium">
                تم رفع الملف بنجاح
              </p>
            </div>

            <button
              onClick={handleRemove}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="text-gray-600" size={20} />
            </button>
          </div>

          <button
            onClick={handleContinue}
            className="w-full mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            متابعة لتحديد الحقول
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
