import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db/connection"
import type { User, UserPreferences } from "@/lib/db/schema"
import { VisualFeedbackManager } from "@/lib/api/visual-feedback"
import jwt from "jsonwebtoken"

export interface AuthenticatedRequest extends NextRequest {
  user: User & { preferences?: UserPreferences }
  serviceClient?: {
    service_name: string
    api_key: string
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function authenticateUser(
  request: NextRequest,
): Promise<(User & { preferences?: UserPreferences }) | null> {
  // Check for JWT token in Authorization header
  const authHeader = request.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7)

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; exp: number }

      // Check if token is expired
      if (decoded.exp < Date.now() / 1000) {
        return null
      }

      // Get user from database
      const users = await executeQuery<User>(
        "SELECT * FROM users WHERE id = $1 AND is_active = true AND is_verified = true",
        [decoded.userId],
      )

      if (users.length === 0) {
        return null
      }

      const user = users[0]

      // Get user preferences
      const preferences = await executeQuery<UserPreferences>("SELECT * FROM user_preferences WHERE user_id = $1", [
        user.id,
      ])

      return {
        ...user,
        preferences: preferences[0],
      }
    } catch (error) {
      console.error("JWT verification error:", error)
      return null
    }
  }

  // Check for service-to-service API key
  const apiKey = request.headers.get("x-api-key")
  if (apiKey) {
    try {
      // Verify service API key (implement your service registry)
      const serviceClient = await verifyServiceApiKey(apiKey)
      if (serviceClient) {
        // For service-to-service calls, we might not have a specific user
        // Return a system user or handle differently based on your needs
        return null // Handle service authentication separately
      }
    } catch (error) {
      console.error("Service API key verification error:", error)
      return null
    }
  }

  return null
}

export function requireAuth(handler: (req: AuthenticatedRequest) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await authenticateUser(request)

    if (!user) {
      const feedback = VisualFeedbackManager.createFeedback("error", "Authentication required")
      const response = VisualFeedbackManager.createApiResponse(
        false,
        null,
        "Authentication required",
        "AUTH_001",
        feedback,
      )

      return NextResponse.json(response, { status: 401 })
    }

    // Add user to request object
    const authenticatedRequest = request as AuthenticatedRequest
    authenticatedRequest.user = user

    return handler(authenticatedRequest)
  }
}

export function requireRole(allowedRoles: string[]) {
  return (handler: (req: AuthenticatedRequest) => Promise<Response>) => {
    return async (request: AuthenticatedRequest) => {
      if (!allowedRoles.includes(request.user.role)) {
        const feedback = VisualFeedbackManager.createFeedback("error", "Insufficient permissions")
        const response = VisualFeedbackManager.createApiResponse(
          false,
          null,
          "Insufficient permissions",
          "AUTH_002",
          feedback,
        )

        return NextResponse.json(response, { status: 403 })
      }

      return handler(request)
    }
  }
}

async function verifyServiceApiKey(apiKey: string): Promise<{ service_name: string; api_key: string } | null> {
  // Implement service registry lookup
  // This would typically check against a services table or external registry
  const serviceClients = [
    { service_name: "fibonrose", api_key: process.env.FIBONROSE_API_KEY },
    { service_name: "deafauth", api_key: process.env.DEAFAUTH_API_KEY },
    { service_name: "visualdesk", api_key: process.env.VISUALDESK_API_KEY },
  ]

  return serviceClients.find((client) => client.api_key === apiKey) || null
}

export async function generateJWT(userId: string, expiresIn = "24h"): Promise<string> {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn })
}
