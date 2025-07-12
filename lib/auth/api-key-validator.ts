import { createHash, timingSafeEqual } from "crypto"
import type { ApiKeyPayload } from "@/types/auth"

// API Key configuration
const API_KEYS = new Map([
  [
    "fibonrose-service",
    {
      key: process.env.FIBONROSE_API_KEY,
      permissions: ["vcode:read", "vcode:verify", "trust:validate"],
      service: "fibonrose",
    },
  ],
  [
    "deafauth-service",
    {
      key: process.env.DEAFAUTH_API_KEY,
      permissions: ["user:read", "user:write", "auth:validate"],
      service: "deafauth",
    },
  ],
  [
    "pinksync-service",
    {
      key: process.env.PINKSYNC_API_KEY,
      permissions: ["accessibility:read", "accessibility:write", "interface:generate"],
      service: "pinksync",
    },
  ],
])

export function validateApiKey(
  apiKey: string,
  serviceName?: string,
): { valid: boolean; payload?: ApiKeyPayload; error?: string } {
  try {
    if (!apiKey) {
      return { valid: false, error: "API key is required" }
    }

    // Find the matching service configuration
    let matchedService: string | null = null
    let serviceConfig: any = null

    for (const [service, config] of API_KEYS.entries()) {
      if (
        config.key &&
        timingSafeEqual(
          Buffer.from(createHash("sha256").update(apiKey).digest("hex")),
          Buffer.from(createHash("sha256").update(config.key).digest("hex")),
        )
      ) {
        matchedService = service
        serviceConfig = config
        break
      }
    }

    if (!matchedService || !serviceConfig) {
      return { valid: false, error: "Invalid API key" }
    }

    // If service name is provided, verify it matches
    if (serviceName && serviceConfig.service !== serviceName) {
      return { valid: false, error: "API key does not match the specified service" }
    }

    return {
      valid: true,
      payload: {
        service: serviceConfig.service,
        permissions: serviceConfig.permissions,
        client_id: matchedService,
        iat: Math.floor(Date.now() / 1000),
      },
    }
  } catch (error) {
    console.error("API key validation error:", error)
    return {
      valid: false,
      error: "API key validation failed",
    }
  }
}
