// vercel.json for deploying entire DeafLifeOS to deaflife.pinksync.io
export const vercelProjectConfig = {
  version: 2,
  name: "deaflife-os",
  builds: [
    {
      src: "package.json",
      use: "@vercel/next",
    },
  ],
  routes: [
    // Intro video route
    {
      src: "/introtoDEAFLIFEOS",
      dest: "/intro-video",
    },
    // Dashboard routes
    {
      src: "/dashboard/(.*)",
      dest: "/dashboard/$1",
    },
    // API routes
    {
      src: "/api/(.*)",
      dest: "/api/$1",
    },
    // Static assets
    {
      src: "/(.*)",
      dest: "/$1",
    },
  ],
  headers: [
    {
      source: "/api/(.*)",
      headers: [
        {
          key: "Access-Control-Allow-Origin",
          value: "https://deaflife.pinksync.io",
        },
      ],
    },
  ],
  env: {
    NEXT_PUBLIC_APP_URL: "https://deaflife.pinksync.io",
    NEXT_PUBLIC_SITE_NAME: "DeafLifeOS",
  },
}
