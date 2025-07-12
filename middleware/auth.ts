import { type NextRequest, NextResponse } from "next/server"
import { validateJWT } from "@/lib/auth/jwt-validator"
import { validateApiKey } from "@/lib/auth/api-key-validator"
import { getUserFromPayload, updateUserLastSeen } from "@/lib/auth/user-service"
import { createApiResponse, visualFeedback } from "@/lib/visual-feedback"
import type { AuthResult } from "@/types/auth"

export async function authenticateRequest(request: NextRequest): Promise<AuthResult> {
  try {
    // Check for API key authentication first (for service-to-service communication)
    const apiKey = request.headers.get("X-PinkSync-Key")
    const serviceName = request.headers.get("X-Service-Name")

    if (apiKey) {
      const apiKeyResult = validateApiKey(apiKey, serviceName || undefined)

      if (!apiKeyResult.valid) {
        return {
          authenticated: false,
          response: NextResponse.json(
            createApiResponse(
              "error",
              undefined,
              visualFeedback.error({
                icon: "key",
                color: "red",
                animation: "shake",
                vibration: true,
              }),
              "invalid_api_key",
              apiKeyResult.error || "Invalid API key",
            ),
            { status: 401 },
          ),
        }
      }

      // For API key authentication, return a service user
      return {
        authenticated: true,
        authType: "api_key",
        user: {
          id: `service:${apiKeyResult.payload!.service}`,
          email: `${apiKeyResult.payload!.service}@pinksync.io`,
          name: `${apiKeyResult.payload!.service} Service`,
          roles: ["service", ...apiKeyResult.payload!.permissions.map((p) => p.split(":")[0])],
          verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      }
    }

    // Check for JWT authentication
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        authenticated: false,
        response: NextResponse.json(
          createApiResponse(
            "error",
            undefined,
            visualFeedback.error({
              icon: "lock",
              color: "red",
              animation: "shake",
              vibration: true,
            }),
            "unauthorized",
            "Access token is missing or invalid",
          ),
          { status: 401 },
        ),
      }
    }

    const token = authHeader.split(" ")[1]
    const jwtResult = await validateJWT(token)

    if (!jwtResult.valid) {
      const errorCode = jwtResult.error?.includes("expired") ? "token_expired" : "invalid_token"
      const errorIcon = jwtResult.error?.includes("expired") ? "clock" : "alert-triangle"
      const errorColor = jwtResult.error?.includes("expired") ? "orange" : "red"

      return {
        authenticated: false,
        response: NextResponse.json(
          createApiResponse(
            "error",
            undefined,
            visualFeedback.error({
              icon: errorIcon,
              color: errorColor,
              animation: "shake",
              vibration: true,
            }),
            errorCode,
            jwtResult.error || "Invalid access token",
          ),
          { status: 401 },
        ),
      }
    }

    // Get user information from the JWT payload
    const user = await getUserFromPayload(jwtResult.payload!)
    if (!user) {
      return {
        authenticated: false,
        response: NextResponse.json(
          createApiResponse(
            "error",
            undefined,
            visualFeedback.error({
              icon: "user-x",
              color: "red",
              animation: "shake",
              vibration: true,
            }),
            "user_not_found",
            "User not found",
          ),
          { status: 401 },
        ),
      }
    }

    // Update user's last seen timestamp (fire and forget)
    updateUserLastSeen(user.id).catch(console.error)

    return {
      authenticated: true,
      authType: "jwt",
      user,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return {
      authenticated: false,
      response: NextResponse.json(
        createApiResponse(
          "error",
          undefined,
          visualFeedback.error({
            icon: "server-crash",
            color: "red",
            animation: "shake",
            vibration: true,
          }),
          "auth_error",
          "Authentication service error",
        ),
        { status: 500 },
      ),
    }
  }
}

// Role-based access control helper
export function requireRoles(user: any, requiredRoles: string[]): boolean {
  if (!user || !user.roles) {
    return false
  }

  // Admin role has access to everything
  if (user.roles.includes("admin")) {
    return true
  }

  // Check if user has any of the required roles
  return requiredRoles.some((role) => user.roles.includes(role))
}

// Permission-based access control helper
export function requirePermissions(user: any, requiredPermissions: string[]): boolean {
  if (!user || !user.roles) {
    return false
  }

  // Admin role has all permissions
  if (user.roles.includes("admin")) {
    return true
  }

  // For service users, check permissions directly
  if (user.id.startsWith("service:")) {
    return requiredPermissions.every((permission) => user.roles.some((role: string) => permission.startsWith(role)))
  }

  // For regular users, map roles to permissions
  const userPermissions = getUserPermissions(user.roles)
  return requiredPermissions.every((permission) => userPermissions.includes(permission))
}

function getUserPermissions(roles: string[]): string[] {
  const rolePermissions: Record<string, string[]> = {
    user: ["vcode:read", "vcode:create"],
    creator: ["vcode:read", "vcode:create", "video:upload", "video:process"],
    validator: ["vcode:read", "vcode:verify", "vcode:correct"],
    interpreter: ["vcode:read", "vcode:verify", "vcode:translate"],
    admin: ["*"], // Admin has all permissions
  }

  const permissions = new Set<string>()

  for (const role of roles) {
    const rolePerms = rolePermissions[role] || []
    rolePerms.forEach((perm) => permissions.add(perm))
  }

  return Array.from(permissions)
}
