import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // TTL 30 dias: cada imagem é transformada 1x/mês pela Vercel e cacheada no CDN
    // → reduz transformações Vercel E egress Supabase simultaneamente
    minimumCacheTTL: 2_592_000,
    deviceSizes: [640, 1080, 1920],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
