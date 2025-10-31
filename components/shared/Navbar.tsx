'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'الرئيسية', href: '/' },
    { label: 'عن المنصة', href: '#about' },
    { label: 'كيف يعمل', href: '#how-it-works' },
    { label: 'المميزات', href: '#features' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 space-x-reverse">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">ش</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">شهاداتي</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              تسجيل دخول
            </Link>
            <Link
              href="/signup"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              إنشاء حساب
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-indigo-600"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t">
                <Link
                  href="/login"
                  className="text-center text-indigo-600 hover:text-indigo-700 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  تسجيل دخول
                </Link>
                <Link
                  href="/signup"
                  className="text-center bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  إنشاء حساب
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
