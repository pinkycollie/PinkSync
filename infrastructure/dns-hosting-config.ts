export interface DNSConfiguration {
  domain: string
  subdomain: string
  recordType: "CNAME" | "A" | "AAAA"
  value: string
  ttl: number
  priority?: number
}

export interface HostingConfiguration {
  provider: "vercel" | "netlify" | "cloudflare" | "aws" | "custom"
  region: string
  ssl: boolean
  cdn: boolean
  customDomain: string
}

// DNS Configuration for deaflife.pinksync.io
export const deafLifeDNSConfig: DNSConfiguration[] = [
  {
    domain: "pinksync.io",
    subdomain: "deaflife",
    recordType: "CNAME",
    value: "cname.vercel-dns.com", // If using Vercel
    ttl: 300,
  },
  {
    domain: "pinksync.io",
    subdomain: "www.deaflife",
    recordType: "CNAME",
    value: "cname.vercel-dns.com",
    ttl: 300,
  },
]

// Hosting Configuration
export const deafLifeHostingConfig: HostingConfiguration = {
  provider: "vercel",
  region: "us-east-1",
  ssl: true,
  cdn: true,
  customDomain: "deaflife.pinksync.io",
}

// Video-specific configurations
export const videoHostingConfig = {
  videoProvider: "vercel-blob", // or 'cloudinary', 'vimeo', 'youtube'
  maxFileSize: "500MB",
  supportedFormats: ["mp4", "webm", "mov"],
  transcoding: true,
  captions: true,
  thumbnailGeneration: true,
  adaptiveStreaming: true,
}
