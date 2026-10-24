import type { NextConfig } from 'next';

/**
 * Images uploaded in the Medusa admin are served by the backend's file module
 * (`/static/…`). They arrive at full camera size — one hero upload measured
 * 3.7 MB — so the storefront runs them through next/image, which resizes them
 * to the slot and serves WebP. Only the shop's own backend is allowed; nothing
 * is hotlinked from the reference site or any third party.
 */
const backend = new URL(process.env.MEDUSA_BACKEND_URL ?? 'http://localhost:9000');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /* Old and alternative addresses of pages that now exist under one name. */
  async redirects() {
    return [
      { source: '/mesafeli-satis', destination: '/mesafeli-satis-sozlesmesi', permanent: true },
      { source: '/kampanyalar', destination: '/kampanyalar/haftanin-urunleri', permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: backend.protocol.replace(':', '') as 'http' | 'https',
        hostname: backend.hostname,
        port: backend.port,
        pathname: '/static/**',
      },
    ],
  },
};

export default nextConfig;
