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
  }
};

export default nextConfig;
