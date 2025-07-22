
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // This allows the Next.js development server to accept requests from the
  // Firebase Studio preview URL.
  allowedDevOrigins: ["*.cloudworkstations.dev"],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
