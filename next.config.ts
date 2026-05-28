import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Desabilita otimização Vercel — quota free (5k/mês) esgotada
    // Reverter para false após renovação do ciclo + monitorar consumo com TTL 30d
    unoptimized: true,
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
