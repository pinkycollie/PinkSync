import { jwtVerify, importJWK } from "jose"
import type { JWTPayload } from "@/types/auth"

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET
const JWT_ISSUER = process.env.JWT_ISSUER || "https://deafauth.pinksync.io"
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "pinksync-ecosystem"

// For production, you might want to fetch public keys from a JWKS endpoint
const getJWTSecret = async () => {
  if (process.env.NODE_ENV === "production" && process.env.JWKS_URI) {
    // In production, fetch the public key from JWKS endpoint
    // This is a simplified example - implement proper JWKS key rotation
    const response = await fetch(process.env.JWKS_URI)
    const jwks = await response.json()
    return await importJWK(jwks.keys[0])
  }

  // For development, use the shared secret
  return new TextEncoder().encode(JWT_SECRET)
}

export async function validateJWT(token: string): Promise<{ valid: boolean; payload?: JWTPayload; error?: string }> {
  try {
    if (!JWT_SECRET && !process.env.JWKS_URI) {
      throw new Error("JWT_SECRET or JWKS_URI must be configured")
    }

    const secret = await getJWTSecret()

    const { payload } = await jwtVerify(token, secret, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    })

    // Validate required claims
    if (!payload.sub || !payload.email) {
      return { valid: false, error: "Missing required claims in token" }
    }

    // Check token expiration
    const currentTime = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < currentTime) {
      return { valid: false, error: "Token has expired" }
    }

    return {
      valid: true,
      payload: payload as JWTPayload,
    }
  } catch (error) {
    console.error("JWT validation error:", error)
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Invalid token",
    }
  }
}
