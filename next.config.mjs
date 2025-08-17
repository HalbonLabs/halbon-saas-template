
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // We lint in CI; avoid Next's build-time lint pass + detection warning
    ignoreDuringBuilds: true
  },
  experimental: {
    typedRoutes: true
  }
};
export default nextConfig;
