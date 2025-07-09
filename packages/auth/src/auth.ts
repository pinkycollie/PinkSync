import { kv } from "@vercel/kv"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { v4 as uuidv4 } from "uuid"

// Types
import type { User, Session, AuthError } from "./types"

// Constants
const JWT_SECRET = process.env.JWT_SECRET || ""
const COOKIE_NAME = "mbtq_session"
const SESSION_TTL = 60 * 60 * 24 * 7 // 1 week in seconds

if (!JWT_SECRET) {
  console.warn("JWT_SECRET is not set. Authentication will not work properly.")
}

const encoder = new TextEncoder()

/**
 * Sign in a user and create a session
 */
export async function signIn(
  credentials: { email: string; password: string },
  options?: { redirectTo?: string },
): Promise<{ success: boolean; error?: AuthError; user?: User }> {
  try {
    // Call DeafAuth service to validate credentials
    const response = await fetch(`${process.env.DEAFAUTH_URL}/api/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: {
          code: "invalid_credentials",
          message: error.message || "Invalid email or password",
        },
      }
    }

    const { user } = await response.json()

    // Create a session
    const session = await createSession(user)

    // If redirectTo is provided, redirect the user
    if (options?.redirectTo) {
      redirect(options.redirectTo)
    }

    return { success: true, user }
  } catch (error) {
    console.error("Sign in error:", error)
    return {
      success: false,
      error: {
        code: "unknown_error",
        message: "An unexpected error occurred",
      },
    }
  }
}

/**
 * Sign up a new user
 */
export async function signUp(
  userData: {
    email: string
    password: string
    name: string
    preferredSignLanguage?: "ASL" | "BSL" | "ISL" | "Other"
    requiresVisualFeedback?: boolean
  },
  options?: { redirectTo?: string },
): Promise<{ success: boolean; error?: AuthError; user?: User }> {
  try {
    // Call DeafAuth service to create a new user
    const response = await fetch(`${process.env.DEAFAUTH_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: {
          code: "signup_failed",
          message: error.message || "Failed to create account",
        },
      }
    }

    const { user } = await response.json()

    // Create a session
    const session = await createSession(user)

    // If redirectTo is provided, redirect the user
    if (options?.redirectTo) {
      redirect(options.redirectTo)
    }

    return { success: true, user }
  } catch (error) {
    console.error("Sign up error:", error)
    return {
      success: false,
      error: {
        code: "unknown_error",
        message: "An unexpected error occurred",
      },
    }
  }
}

/**
 * Sign out the current user
 */
export async function signOut(options?: { redirectTo?: string }): Promise<{ success: boolean }> {
  try {
    const sessionToken = cookies().get(COOKIE_NAME)?.value

    if (sessionToken) {
      try {
        // Verify the token
        const { payload } = await jwtVerify(sessionToken, encoder.encode(JWT_SECRET))
        const sessionId = payload.sid as string

        // Delete the session from KV
        await kv.del(`session:${sessionId}`)
      } catch (error) {
        // Token is invalid, just continue
      }
    }

    // Delete the cookie
    cookies().delete(COOKIE_NAME)

    // If redirectTo is provided, redirect the user
    if (options?.redirectTo) {
      redirect(options.redirectTo)
    }

    return { success: true }
  } catch (error) {
    console.error("Sign out error:", error)
    return { success: false }
  }
}

/**
 * Get the current session
 */
export async function getSession(): Promise<Session | null> {
  try {
    const sessionToken = cookies().get(COOKIE_NAME)?.value

    if (!sessionToken) {
      return null
    }

    // Verify the token
    const { payload } = await jwtVerify(sessionToken, encoder.encode(JWT_SECRET))
    const sessionId = payload.sid as string

    // Get the session from KV
    const session = await kv.get<Session>(`session:${sessionId}`)

    if (!session) {
      return null
    }

    // Check if the session has expired
    if (session.expiresAt < Date.now()) {
      await kv.del(`session:${sessionId}`)
      cookies().delete(COOKIE_NAME)
      return null
    }

    return session
  } catch (error) {
    console.error("Get session error:", error)
    return null
  }
}

/**
 * Get the current user
 */
export async function getUser(): Promise<User | null> {
  const session = await getSession()
  return session?.user || null
}

/**
 * Create a new session
 */
async function createSession(user: User): Promise<Session> {
  // Generate a unique session ID
  const sessionId = uuidv4()

  // Create a session object
  const session: Session = {
    id: sessionId,
    user,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL * 1000,
  }

  // Store the session in KV
  await kv.set(`session:${sessionId}`, session, { ex: SESSION_TTL })

  // Create a JWT token
  const token = await new SignJWT({ sid: sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL}s`)
    .sign(encoder.encode(JWT_SECRET))

  // Set the cookie
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    domain: process.env.NODE_ENV === "production" ? ".mbtq.dev" : undefined, // Works across all subdomains in production
    maxAge: SESSION_TTL,
  })

  return session
}

/**
 * Verify a token from a FibonRoseTRUST verification
 */
export async function verifyTrustToken(token: string): Promise<{
  success: boolean
  userId?: string
  verificationLevel?: "basic" | "verified" | "enhanced"
}> {
  try {
    // Call FibonRoseTRUST service to verify the token
    const response = await fetch(`${process.env.FIBONROSE_URL}/api/verify-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })

    if (!response.ok) {
      return { success: false }
    }

    const verification = await response.json()
    return {
      success: true,
      userId: verification.userId,
      verificationLevel: verification.level,
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return { success: false }
  }
}
