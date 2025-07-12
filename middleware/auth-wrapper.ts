import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest, requireRoles, requirePermissions } from "./auth"
import { createApiResponse, visualFeedback } from "@/lib/visual-feedback"

// Higher-order function to wrap API routes with authentication
export function withAuth(
  handler: (request: NextRequest, context: { user: any; params?: any }) => Promise<NextResponse>,
  options: {
    requiredRoles?: string[]
    requiredPermissions?: string[]
    allowServiceAuth?: boolean
  } = {},
) {
  return async (request: NextRequest, context?: { params?: any }) => {
    // Authenticate the request
    const auth = await authenticateRequest(request)

    if (!auth.authenticated) {
      return auth.response!
    }

    // Check if service authentication is allowed
    if (auth.authType === "api_key" && !options.allowServiceAuth) {
      return NextResponse.json(
        createApiResponse(
          "error",
          undefined,
          visualFeedback.error({
            icon: "shield-off",
            color: "red",
            animation: "shake",
            vibration: true,
          }),
          "service_auth_not_allowed",
          "Service authentication is not allowed for this endpoint",
        ),
        { status: 403 },
      )
    }

    // Check required roles
    if (options.requiredRoles && !requireRoles(auth.user, options.requiredRoles)) {
      return NextResponse.json(
        createApiResponse(
          "error",
          undefined,
          visualFeedback.error({
            icon: "shield",
            color: "red",
            animation: "pulse",
            vibration: true,
          }),
          "insufficient_roles",
          `This endpoint requires one of the following roles: ${options.requiredRoles.join(", ")}`,
        ),
        { status: 403 },
      )
    }

    // Check required permissions
    if (options.requiredPermissions && !requirePermissions(auth.user, options.requiredPermissions)) {
      return NextResponse.json(
        createApiResponse(
          "error",
          undefined,
          visualFeedback.error({
            icon: "lock",
            color: "red",
            animation: "pulse",
            vibration: true,
          }),
          "insufficient_permissions",
          `This endpoint requires the following permissions: ${options.requiredPermissions.join(", ")}`,
        ),
        { status: 403 },
      )
    }

    // Call the original handler with authenticated user context
    return handler(request, { user: auth.user, params: context?.params })
  }
}

// Convenience wrapper for endpoints that require specific roles
export function withRoles(roles: string[]) {
  return (handler: (request: NextRequest, context: { user: any; params?: any }) => Promise<NextResponse>) =>
    withAuth(handler, { requiredRoles: roles })
}

// Convenience wrapper for endpoints that require specific permissions
export function withPermissions(permissions: string[]) {
  return (handler: (request: NextRequest, context: { user: any; params?: any }) => Promise<NextResponse>) =>
    withAuth(handler, { requiredPermissions: permissions })
}

// Convenience wrapper for service-only endpoints
export function withServiceAuth() {
  return (handler: (request: NextRequest, context: { user: any; params?: any }) => Promise<NextResponse>) =>
    withAuth(handler, { allowServiceAuth: true, requiredRoles: ["service"] })
}
