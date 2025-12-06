import type { NextConfig } from "next";

const nextConfig = {
  /* config options here */
  eslint: {
    // Peringatan: Ini akan menonaktifkan pengecekan ESLint saat proses `next build`.
    ignoreDuringBuilds: true,
  },
  // Proxy API requests ke backend
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005';

    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiUrl}/api/v1/:path*`,
      },
      // Proxy untuk Swagger docs
      {
        source: '/docs/:path*',
        destination: `${apiUrl}/docs/:path*`,
      },
    ];
  },
};

export default nextConfig;
