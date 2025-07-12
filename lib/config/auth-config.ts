// Authentication configuration for vcode.pinksync.io
export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET,
    issuer: process.env.JWT_ISSUER || "https://deafauth.pinksync.io",
    audience: process.env.JWT_AUDIENCE || "vcode.pinksync.io",
    jwksUri: process.env.JWKS_URI || "https://deafauth.pinksync.io/.well-known/jwks.json",
    algorithm: "RS256" as const,
  },
  api: {
    baseUrl: process.env.API_BASE_URL || "https://vcode.pinksync.io",
    version: "v2",
  },
  services: {
    deafauth: {
      baseUrl: process.env.DEAFAUTH_BASE_URL || "https://deafauth.pinksync.io/v1",
      apiKey: process.env.DEAFAUTH_API_KEY,
    },
    fibonrose: {
      baseUrl: process.env.FIBONROSE_BASE_URL || "https://fibonrose.mbtquniverse.com/v1",
      apiKey: process.env.FIBONROSE_API_KEY,
    },
    pinksync: {
      baseUrl: process.env.PINKSYNC_BASE_URL || "https://api.pinksync.io/v2",
      apiKey: process.env.PINKSYNC_API_KEY,
    },
  },
}

// Validate required environment variables
export function validateConfig() {
  const required = ["DATABASE_URL", "JWT_SECRET"]

  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }

  console.log("✅ vCode service configuration validated")
}
