// If using Cloudflare for DNS management
export const cloudflareDNSSetup = {
  zoneId: "YOUR_ZONE_ID", // Get from Cloudflare dashboard
  records: [
    {
      type: "CNAME",
      name: "deaflife",
      content: "cname.vercel-dns.com",
      ttl: 1, // Auto
      proxied: true, // Enable Cloudflare proxy for additional security
    },
    {
      type: "CNAME",
      name: "www.deaflife",
      content: "deaflife.pinksync.io",
      ttl: 1,
      proxied: true,
    },
  ],
}

// Cloudflare Page Rules for video optimization
export const cloudflarePageRules = [
  {
    url: "deaflife.pinksync.io/videos/*",
    settings: {
      cache_level: "cache_everything",
      edge_cache_ttl: 2592000, // 30 days
      browser_cache_ttl: 86400, // 1 day
    },
  },
  {
    url: "deaflife.pinksync.io/*",
    settings: {
      ssl: "full",
      always_use_https: true,
      automatic_https_rewrites: true,
    },
  },
]
