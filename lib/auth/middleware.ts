import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db/connection"
import type { User, ApiKey } from "@/lib/db/schema"

export interface AuthenticatedRequest extends NextRequest {
  user: User
  apiKey?: ApiKey
}

export async function authenticateUser(request: NextRequest): Promise<User | null> {
  // Check for session token in cookies
  const sessionToken = request.cookies.get("session_token")?.value

  if (sessionToken) {
    try {
      const users = await executeQuery<User>(
        "SELECT * FROM users WHERE id = (SELECT user_id FROM user_sessions WHERE token = $1 AND expires_at > NOW())",
        [sessionToken],
      )
      return users[0] || null
    } catch (error) {
      console.error("Session authentication error:", error)
      return null
    }
  }

  // Check for API key in headers
  const apiKey = request.headers.get("x-api-key")

  if (apiKey) {
    try {
      const keys = await executeQuery<ApiKey & { user: User }>(
        `SELECT ak.*, u.* as user FROM api_keys ak 
         JOIN users u ON ak.user_id = u.id 
         WHERE ak.key_hash = $1 AND ak.is_active = true AND (ak.expires_at IS NULL OR ak.expires_at > NOW())`,
        [hashApiKey(apiKey)],
      )

      if (keys[0]) {
        // Update last_used timestamp
        await executeQuery("UPDATE api_keys SET last_used = NOW() WHERE id = $1", [keys[0].id])
        return keys[0].user
      }
    } catch (error) {
      console.error("API key authentication error:", error)
      return null
    }
  }

  return null
}

export function requireAuth(handler: (req: AuthenticatedRequest) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await authenticateUser(request)

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    if (user.status !== "active") {
      return NextResponse.json({ error: "Account suspended or inactive" }, { status: 403 })
    }

    // Add user to request object
    const authenticatedRequest = request as AuthenticatedRequest
    authenticatedRequest.user = user

    return handler(authenticatedRequest)
  }
}

function hashApiKey(key: string): string {
  // In production, use a proper hashing function like bcrypt
  return Buffer.from(key).toString("base64")
}

export function requireVCodeVerification(action: string) {
  return (handler: (req: AuthenticatedRequest) => Promise<Response>) => {
    return async (request: AuthenticatedRequest) => {
      const user = request.user

      // Check if user has recent VCode verification for this action
      const recentVerifications = await executeQuery<{ verified_at: Date }>(
        `SELECT verified_at FROM vcode_verifications 
         WHERE user_id = $1 AND action = $2 AND status = 'verified' 
         AND verified_at > NOW() - INTERVAL '1 hour'
         ORDER BY verified_at DESC LIMIT 1`,
        [user.id, action],
      )

      if (recentVerifications.length === 0) {
        return NextResponse.json({ error: "VCode verification required", action }, { status: 403 })
      }

      return handler(request)
    }
  }
}
