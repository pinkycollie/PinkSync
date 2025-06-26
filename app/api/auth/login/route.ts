import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db/connection"
import type { User } from "@/lib/db/schema"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  remember_me: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, remember_me } = loginSchema.parse(body)

    // Find user by email
    const users = await executeQuery<User>("SELECT * FROM users WHERE email = $1 AND status = $2", [email, "active"])

    const user = users[0]
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password (in production, use proper password hashing)
    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create session
    const sessionToken = generateSessionToken()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + (remember_me ? 24 * 30 : 24)) // 30 days or 24 hours

    await executeQuery(
      `INSERT INTO user_sessions (user_id, token, expires_at, created_at) 
       VALUES ($1, $2, $3, NOW())`,
      [user.id, sessionToken, expiresAt],
    )

    // Update last login
    await executeQuery("UPDATE users SET last_login = NOW() WHERE id = $1", [user.id])

    // Set session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        preferences: user.preferences,
      },
    })

    response.cookies.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
    })

    return response
  } catch (error) {
    console.error("Login error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // In production, use bcrypt or similar
  return Buffer.from(password).toString("base64") === hash
}

function generateSessionToken(): string {
  return crypto.randomUUID() + "-" + Date.now().toString(36)
}
