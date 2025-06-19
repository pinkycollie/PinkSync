import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"
import { logAuthEvent } from "./lib/auth/audit-logger"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static assets and API routes that don't need auth
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico") || pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  // Check if the path is protected
  const isProtected =
    pathname.startsWith("/dashboard") || (pathname.startsWith("/api") && !pathname.startsWith("/api/auth"))

  // Public paths that don't require authentication
  const isPublicPath = pathname === "/" || pathname.startsWith("/auth") || pathname.startsWith("/api/auth")

  try {
    // Get the session token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // Get client IP for logging and security checks
    const ip = request.headers.get("x-forwarded-for") || request.ip || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Log access attempt for audit purposes
    await logAuthEvent({
      event: "ACCESS_ATTEMPT",
      userId: token?.sub as string,
      ipAddress: ip,
      userAgent,
      details: {
        path: pathname,
        method: request.method,
      },
    })

    // Redirect unauthenticated users to the sign-in page
    if (isProtected && !token) {
      const signInUrl = new URL("/auth/signin", request.url)
      signInUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Check for required permissions based on path
    if (token && isProtected) {
      const userRoles = (token.roles as string[]) || []
      const userPermissions = (token.permissions as string[]) || []

      // Example permission checks based on path
      if (pathname.startsWith("/dashboard/admin") && !userRoles.includes("admin")) {
        // Log unauthorized access attempt
        await logAuthEvent({
          event: "UNAUTHORIZED_ACCESS",
          userId: token.sub as string,
          ipAddress: ip,
          userAgent,
          details: {
            path: pathname,
            roles: userRoles,
          },
        })

        // Redirect to access denied page
        return NextResponse.redirect(new URL("/auth/access-denied", request.url))
      }

      // Check for specific resource permissions
      if (pathname.startsWith("/dashboard/videos") && !userPermissions.includes("video:read")) {
        return NextResponse.redirect(new URL("/auth/access-denied", request.url))
      }
    }

    // Redirect authenticated users away from auth pages
    if (isPublicPath && pathname !== "/" && token) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    // If there's an error in the middleware, allow the request to continue
    return NextResponse.next()
  }
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
