export const deploymentChecklist = {
  "DNS Setup": [
    "Add CNAME record: deaflife → cname.vercel-dns.com",
    "Add CNAME record: www.deaflife → deaflife.pinksync.io",
    "Verify DNS propagation (24-48 hours)",
    "Test domain resolution",
  ],
  "Vercel Configuration": [
    "Add custom domain in project settings",
    "Verify domain ownership",
    "Wait for SSL certificate provisioning",
    "Configure environment variables",
    "Set up deployment hooks",
  ],
  "Video Infrastructure": [
    "Enable Vercel Blob storage",
    "Configure video upload limits",
    "Set up video transcoding",
    "Enable automatic captions",
    "Configure CDN caching rules",
  ],
  "Security & Performance": [
    "Enable HTTPS redirect",
    "Configure security headers",
    "Set up rate limiting",
    "Enable compression",
    "Configure monitoring",
  ],
  "Content Setup": [
    "Upload intro video to /introtoDEAFLIFEOS",
    "Create video categories",
    "Set up search functionality",
    "Configure analytics",
    "Test all video playback",
  ],
}

export const estimatedTimeline = {
  "DNS Propagation": "24-48 hours",
  "SSL Certificate": "5-10 minutes after DNS",
  "Video Upload": "Immediate after setup",
  "Full Deployment": "2-3 days total",
}
