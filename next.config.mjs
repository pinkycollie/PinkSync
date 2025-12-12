/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production'
const isStaging = process.env.NODE_ENV === 'staging'

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // GitHub Pages uses static export
  output: isStaging ? 'export' : 'standalone',
  
  // Base path for GitHub Pages
  basePath: isStaging ? '/PinkSync' : '',
  
  // Asset prefix for GitHub Pages
  assetPrefix: isStaging ? '/PinkSync/' : '',
  
  // Disable image optimization for static export
  images: isStaging ? {
    unoptimized: true
  } : {
    unoptimized: true,
  },
  
  // Disable Vercel analytics
  experimental: {
    // Future features for accessibility
  },
  
  // Environment-specific settings
  env: {
    PLATFORM_ENV: process.env.NODE_ENV,
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.mbtq.dev',
    AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL || 'https://auth.mbtq.dev',
  }
}

export default nextConfig