/**
 * صفحة الأرشيف الرئيسية
 * Main Archive Page
 */

import React from 'react';
import ArchiveManager from '@/components/admin/ArchiveManager';

export const metadata = {
  title: 'إدارة الأرشيف - منصة شهاداتي',
  description: 'إدارة وحفظ الشهادات والملفات القديمة',
};

export default function ArchivePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ArchiveManager />
    </div>
  );
}