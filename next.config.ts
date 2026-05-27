import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cache cada transformação por 30 dias — reduz drasticamente o contador mensal
    minimumCacheTTL: 2_592_000,
    // 3 breakpoints ao invés dos 8 padrão — 62% menos transformações por imagem
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
