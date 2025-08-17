
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // We lint in CI; avoid Next's build-time lint pass + detection warning
    ignoreDuringBuilds: true
  },
  experimental: {
    typedRoutes: true
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // HSTS is only meaningful over HTTPS; most hosts (e.g., Vercel) use TLS in prod
          // max-age ~180 days; includeSubDomains & preload are conservative defaults
          { key: 'Strict-Transport-Security', value: 'max-age=15552000; includeSubDomains' }
        ]
      }
    ];
  }
};
export default nextConfig;
