import type { Metadata } from 'next';
import { Cairo, Amiri } from 'next/font/google';
import './globals.css';
import NotificationSystem from '@/components/ui/NotificationSystem';

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cairo',
  display: 'swap',
});

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'شهاداتي - منصة إصدار الشهادات الرقمية',
    template: '%s | شهاداتي'
  },
  description: 'أصدر شهاداتك في دقائق، لا ساعات. منصة احترافية لأتمتة إصدار الشهادات الرقمية للمحاضرين والأساتذة.',
  keywords: 'شهادات, شهادات رقمية, إصدار شهادات, محاضرين, تدريب, دورات, أدلة, مسارات',
  authors: [{ name: 'فريق شهاداتي' }],
  creator: 'فريق شهاداتي',
  publisher: 'شهاداتي',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://shahadati.sa'),
  alternates: {
    canonical: '/',
    languages: {
      'ar-SA': '/ar-SA',
      'en': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://shahadati.sa',
    title: 'شهاداتي - منصة إصدار الشهادات الرقمية',
    description: 'أصدر شهاداتك في دقائق، لا ساعات',
    siteName: 'شهاداتي',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'شهاداتي - منصة إصدار الشهادات الرقمية',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'شهاداتي - منصة إصدار الشهادات الرقمية',
    description: 'أصدر شهاداتك في دقائق، لا ساعات',
    images: ['/og-image.jpg'],
    creator: '@shahadati',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${amiri.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="color-scheme" content="light dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`
        ${cairo.className} 
        antialiased 
        bg-gray-50 dark:bg-gray-900 
        text-gray-900 dark:text-gray-100
        transition-colors duration-300
      `}>
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
        
        {/* Notification System - Global */}
        <NotificationSystem position="top-right" />
      </body>
    </html>
  );
}
