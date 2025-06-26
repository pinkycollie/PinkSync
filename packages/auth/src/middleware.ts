import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "./auth"

export interface AuthMiddlewareOptions {
  publicPaths?: string[]
  loginPath?: string
}

const defaultOptions: AuthMiddlewareOptions = {
  publicPaths: ["/api/auth", "/login", "/signup", "/reset-password"],
  loginPath: "/login",
}

/**
 * Middleware to protect routes
 */
export async function authMiddleware(
  request: NextRequest,
  options: AuthMiddlewareOptions = {},
): Promise<NextResponse | undefined> {
  const mergedOptions = { ...defaultOptions, ...options }
  const { publicPaths, loginPath } = mergedOptions

  // Check if the path is public
  const path = request.nextUrl.pathname
  if (publicPaths?.some((publicPath) => path.startsWith(publicPath))) {
    return
  }

  // Get the session
  const session = await getSession()

  // If there's no session, redirect to login
  if (!session) {
    const url = request.nextUrl.clone()
    url.pathname = loginPath || "/login"
    url.searchParams.set("from", path)
    return NextResponse.redirect(url)
  }

  // Continue with the request
  return
}

/**
 * Role-based middleware
 */
export async function roleMiddleware(request: NextRequest, allowedRoles: string[]): Promise<NextResponse | undefined> {
  // Get the session
  const session = await getSession()

  // If there's no session or the user doesn't have the required role, redirect to unauthorized
  if (!session || !allowedRoles.includes(session.user.role)) {
    const url = request.nextUrl.clone()
    url.pathname = "/unauthorized"
    return NextResponse.redirect(url)
  }

  // Continue with the request
  return
}
