/**
 * صفحة الأرشيف الرئيسية
 * Main Archive Page
 */

'use client'

import React from 'react';
import ArchiveManager from '@/components/admin/ArchiveManager';

export default function ArchivePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ArchiveManager />
    </div>
  );
}