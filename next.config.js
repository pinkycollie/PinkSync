/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@upstash/redis"],
  },

  // Rewrite rules for FastAPI integration
  async rewrites() {
    return [
      {
        source: "/api/py/:path*",
        destination: process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000/api/py/:path*" : "/api/py/:path*",
      },
    ]
  },

  // Image optimization for accessibility
  images: {
    domains: ["pinksync.io", "mbtquniverse.com", "upstash.com", "vercel.app"],
    formats: ["image/webp", "image/avif"],
    unoptimized: true, // Added update
  },

  // Headers for security and accessibility
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ]
  },

  // Webpack configuration for Python integration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Ignore Python files in client-side bundles
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      }
    }

    return config
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    PINKSYNC_VERSION: "2.0.0",
  },

  // Redirects for domain management
  async redirects() {
    return [
      {
        source: "/docs",
        destination: "/api/py/docs",
        permanent: true,
      },
      {
        source: "/api-docs",
        destination: "/api/py/docs",
        permanent: true,
      },
    ]
  },

  // ESLint and TypeScript configurations
  eslint: {
    ignoreDuringBuilds: true, // Added update
  },
  typescript: {
    ignoreBuildErrors: true, // Added update
  },
}

module.exports = nextConfig
