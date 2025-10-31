'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Certificate {
  id: string;
  recipient_name: string;
  certificate_file_url: string;
  certificate_number: string;
  issued_at: string;
  certificate_templates: {
    course_name: string;
    course_description: string;
    profiles: {
      full_name: string;
      organization_name: string;
    };
  };
  certificate_archive: Array<{
    id: string;
    notes: string;
    is_favorite: boolean;
    archived_at: string;
  }> | null;
}

export default function StudentArchivePage() {
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFavorites, setFilterFavorites] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/student/certificates');
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error(data.error || 'فشل جلب الشهادات');
      }

      setCertificates(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (certId: string, currentFavorite: boolean) => {
    try {
      const response = await fetch(`/api/student/certificates/${certId}/favorite`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_favorite: !currentFavorite,
        }),
      });

      if (!response.ok) {
        throw new Error('فشل تحديث المفضلة');
      }

      // تحديث القائمة
      fetchCertificates();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch = 
      cert.certificate_templates.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.recipient_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFavorite = !filterFavorites || 
      (cert.certificate_archive && cert.certificate_archive.length > 0 && cert.certificate_archive[0].is_favorite);

    return matchesSearch && matchesFavorite;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">أرشيف شهاداتي</h1>
          <p className="text-gray-600">
            جميع شهاداتك المحفوظة ({certificates.length} شهادة)
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="البحث بالدورة أو الاسم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Favorite Filter */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterFavorites}
                onChange={(e) => setFilterFavorites(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                المفضلة فقط
              </span>
            </label>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Certificates Grid */}
        {filteredCertificates.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد شهادات</h3>
            <p className="text-gray-600">
              {searchTerm || filterFavorites
                ? 'لا توجد شهادات تطابق البحث'
                : 'لم تحصل على أي شهادات بعد'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map((cert) => {
              const isFavorite = cert.certificate_archive && cert.certificate_archive.length > 0 
                ? cert.certificate_archive[0].is_favorite 
                : false;

              return (
                <div key={cert.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Preview */}
                  <div className="bg-gray-100 p-6 flex items-center justify-center h-48">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-xs text-gray-500">{cert.certificate_templates.course_name}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                        {cert.certificate_templates.course_name}
                      </h3>
                      <button
                        onClick={() => toggleFavorite(cert.id, isFavorite)}
                        className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <svg
                          className={`w-5 h-5 ${isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-400'}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 mb-3">
                      {new Date(cert.issued_at).toLocaleDateString('ar-SA')}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <a
                        href={cert.certificate_file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-teal-600 text-white py-2 px-3 rounded text-sm font-semibold text-center hover:bg-teal-700 transition-colors"
                      >
                        تحميل
                      </a>
                      <button
                        onClick={() => router.push(`/student/certificates/${cert.id}`)}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 px-3 rounded text-sm font-semibold hover:bg-gray-300 transition-colors"
                      >
                        التفاصيل
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
