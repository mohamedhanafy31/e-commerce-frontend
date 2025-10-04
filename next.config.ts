import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during build to avoid blocking the application
    ignoreDuringBuilds: true,
  },
  images: {
    // Avoid Next.js proxy optimization to prevent upstream timeouts during dev
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
