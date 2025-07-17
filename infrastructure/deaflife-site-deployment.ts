// DNS Configuration for deploying entire DeafLifeOS to deaflife.pinksync.io
export const deafLifeSiteConfig = {
  domain: "deaflife.pinksync.io",
  projectType: "full-application", // Not just video portal
  deployment: {
    provider: "vercel",
    framework: "nextjs",
    buildCommand: "npm run build",
    outputDirectory: ".next",
    installCommand: "npm install",
    devCommand: "npm run dev",
  },
  routes: [
    {
      src: "/",
      dest: "/", // Main DeafLifeOS dashboard
    },
    {
      src: "/introtoDEAFLIFEOS",
      dest: "/intro-video", // ASL intro video page
    },
    {
      src: "/dashboard/(.*)",
      dest: "/dashboard/$1", // All dashboard routes
    },
    {
      src: "/api/(.*)",
      dest: "/api/$1", // API routes
    },
  ],
}

// Environment variables for production deployment
export const productionEnvVars = {
  NEXT_PUBLIC_APP_URL: "https://deaflife.pinksync.io",
  NEXT_PUBLIC_SITE_NAME: "DeafLifeOS",
  NEXT_PUBLIC_DOMAIN: "deaflife.pinksync.io",
  NODE_ENV: "production",
}

// DNS Records needed
export const dnsRecords = [
  {
    type: "CNAME",
    name: "deaflife",
    value: "cname.vercel-dns.com",
    ttl: 300,
  },
  {
    type: "CNAME",
    name: "www.deaflife",
    value: "deaflife.pinksync.io",
    ttl: 300,
  },
]
