// vercel.json configuration for deaflife.pinksync.io
export const vercelConfig = {
  version: 2,
  builds: [
    {
      src: "package.json",
      use: "@vercel/next",
    },
  ],
  routes: [
    {
      src: "/introtoDEAFLIFEOS",
      dest: "/videos/intro",
    },
    {
      src: "/api/(.*)",
      dest: "/api/$1",
    },
    {
      src: "/(.*)",
      dest: "/$1",
    },
  ],
  headers: [
    {
      source: "/videos/(.*)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
        {
          key: "Access-Control-Allow-Origin",
          value: "*",
        },
      ],
    },
  ],
  redirects: [
    {
      source: "/",
      destination: "/introtoDEAFLIFEOS",
      permanent: false,
    },
  ],
}
