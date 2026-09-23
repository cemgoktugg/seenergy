import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // All imagery is local and generated; nothing is hotlinked from the
  // reference site or any third party.
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
