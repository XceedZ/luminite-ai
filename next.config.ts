import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Peringatan: Ini akan menonaktifkan pengecekan ESLint saat proses `next build`.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
