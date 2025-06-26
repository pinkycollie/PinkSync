import type { NextRequest } from "next/server"
import { authMiddleware } from "@mbtq/auth"

export async function middleware(request: NextRequest) {
  // Define public paths
  const publicPaths = ["/api/auth", "/login", "/signup", "/reset-password", "/", "/about", "/contact", "/docs"]

  // Call the auth middleware
  return authMiddleware(request, {
    publicPaths,
    loginPath: "/login",
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
