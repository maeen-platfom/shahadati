/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    domains: ['qnborzrmsqhqidnyntrs.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qnborzrmsqhqidnyntrs.supabase.co'
      }
    ]
  },
  webpack: (config, { isServer }) => {
    // استبعاد canvas من client-side bundle
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
      };
    }
    
    // إضافة externals لـ canvas في server-side
    config.externals = config.externals || [];
    config.externals.push('canvas');
    
    return config;
  }
};

export default nextConfig;
