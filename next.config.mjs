/** @type {import('next').NextConfig} */
const nextConfig = {
  // إعدادات الإنتاج
  compress: true,
  poweredByHeader: false,
  
  // تحسين الأداء
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-dialog',
      '@radix-ui/react-tabs'
    ]
  },
  
  // إعدادات الـ Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // سنة واحدة
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qnborzrmsqhqidnyntrs.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**'
      }
    ]
  },

  // إعدادات أمان
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? 'https://shahadati.app,https://www.shahadati.app' 
              : '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With, X-CSRF-Token'
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400'
          }
        ]
      },
      {
        source: '/certificates/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive'
          },
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, must-revalidate'
          }
        ]
      },
      {
        source: '/admin/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, must-revalidate'
          }
        ]
      }
    ];
  },

  // إعادة التوجيه
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true
      },
      {
        source: '/dashboard',
        destination: '/(instructor)/dashboard',
        permanent: false
      },
      {
        source: '/login',
        destination: '/(auth)/login',
        permanent: false
      },
      {
        source: '/register',
        destination: '/(auth)/signup',
        permanent: false
      },
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: false
      }
    ];
  },

  // إعادة كتابة الروابط
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap'
      },
      {
        source: '/robots.txt',
        destination: '/api/robots'
      },
      {
        source: '/favicon.ico',
        destination: '/favicon.ico'
      },
      {
        source: '/sitemap/:path*',
        destination: '/api/sitemap'
      }
    ];
  },

  // إعدادات Webpack
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // إعدادات الإنتاج
    if (!dev && !isServer) {
      // تحسين Bundle size
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
              reuseExistingChunk: true
            }
          }
        },
        // تحسين Minification
        minimize: true,
        minimizer: [
          new (webpack as any). TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true,
                drop_debugger: true
              },
              mangle: true,
              keep_fnames: false
            }
          }),
          new (webpack as any).OptimizeCSSAssetsPlugin({})
        ]
      };

      // إزالة console.log في الإنتاج
      config.module.rules.push({
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ],
        exclude: /node_modules/
      });
    }

    // إعدادات لـ Supabase
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false
    };

    return config;
  },

  // إعدادات TypeScript
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: 'tsconfig.json'
  },

  // إعدادات ESLint
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['app', 'components', 'lib', 'pages', 'utils']
  },

  // إعدادات漸 Generales
  swcMinify: true,
  forceSwcTransforms: true,
  
  // إعدادات البيئة
  env: {
    CUSTOM_KEY: 'my-value',
  },

  // إعدادات قاعدة البيانات
  env: {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NODE_ENV: process.env.NODE_ENV
  },

  // إعدادات المراقبة
  telemetry: {
    disabled: false
  },

  // إعدادات التصدير (إذا كنت تريد static export)
  // output: 'export',
  // trailingSlash: true,
  // skipTrailingSlashRedirect: true,

  // إعدادات الـ Asset optimization
  assetPrefix: process.env.NODE_ENV === 'production' ? process.env.ASSET_PREFIX : '',
  
  // إعدادات الـ PWA (إذا كنت تريد)
  // async generatePWAConfig() {
  //   return {
  //     name: 'منصة شهاداتي',
  //     short_name: 'شهاداتي',
  //     description: 'منصة أتمتة إصدار الشهادات الرقمية',
  //     start_url: '/',
  //     background_color: '#ffffff',
  //     theme_color: '#000000',
  //     display: 'standalone',
  //     icons: [
  //       {
  //         src: '/icon-192.png',
  //         sizes: '192x192',
  //         type: 'image/png'
  //       },
  //       {
  //         src: '/icon-512.png',
  //         sizes: '512x512',
  //         type: 'image/png'
  //       }
  //     ]
  //   }
  // },

};

export default nextConfig;
