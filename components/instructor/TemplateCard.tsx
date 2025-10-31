'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FileText, Eye, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Template {
  id: string;
  course_name: string;
  template_file_url: string;
  total_issued: number;
  created_at: string;
  template_file_type: string;
}

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {/* صورة مصغرة */}
      <div className="relative h-48 bg-gray-100">
        {template.template_file_type === 'pdf' || imageError ? (
          <div className="h-full flex items-center justify-center bg-gray-200">
            <FileText className="text-gray-400" size={64} />
          </div>
        ) : (
          <Image
            src={template.template_file_url}
            alt={template.course_name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* المحتوى */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {template.course_name}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <span>{template.total_issued} شهادة مُصدرة</span>
          <span>{formatDate(template.created_at)}</span>
        </div>

        {/* الأزرار */}
        <div className="flex gap-2">
          <Link
            href={`/certificates/${template.id}/access`}
            className="flex-1 flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
          >
            إنشاء كود
          </Link>
          <Link
            href={`/certificates/${template.id}`}
            className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
          >
            <Eye size={16} />
          </Link>
          <Link
            href={`/certificates/${template.id}/edit`}
            className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
          >
            <Edit size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
