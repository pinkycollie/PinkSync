/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Standalone output for non-Vercel deployment
  output: 'standalone',
  // Disable Vercel analytics
  experimental: {
    // Future features for accessibility
  },
}

export default nextConfig