import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db/connection"
import type { User } from "@/lib/db/schema"
import { VisualFeedbackManager } from "@/lib/api/visual-feedback"
import { generateJWT } from "@/lib/auth/middleware-v2"
import { z } from "zod"
import bcrypt from "bcryptjs"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  remember_me: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, remember_me } = loginSchema.parse(body)

    // Find user by email
    const users = await executeQuery<User>("SELECT * FROM users WHERE email = $1 AND is_active = true", [email])

    const user = users[0]
    if (!user) {
      const feedback = VisualFeedbackManager.createFeedback("error", "Invalid email or password")
      const response = VisualFeedbackManager.createApiResponse(false, null, "Invalid credentials", "AUTH_003", feedback)
      return NextResponse.json(response, { status: 401 })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      const feedback = VisualFeedbackManager.createFeedback("error", "Invalid email or password")
      const response = VisualFeedbackManager.createApiResponse(false, null, "Invalid credentials", "AUTH_003", feedback)
      return NextResponse.json(response, { status: 401 })
    }

    // Generate JWT token
    const expiresIn = remember_me ? "30d" : "24h"
    const token = await generateJWT(user.id, expiresIn)

    // Update last login
    await executeQuery("UPDATE users SET last_login = NOW(), updated_at = NOW() WHERE id = $1", [user.id])

    // Get user preferences
    const preferences = await executeQuery("SELECT * FROM user_preferences WHERE user_id = $1", [user.id])

    const feedback = VisualFeedbackManager.createFeedback("success", "Welcome back! You're now signed in.")
    const response = VisualFeedbackManager.createApiResponse(
      true,
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          subscription_tier: user.subscription_tier,
          preferences: preferences[0],
        },
        token,
        expires_in: expiresIn,
      },
      undefined,
      undefined,
      feedback,
    )

    return NextResponse.json(response)
  } catch (error) {
    console.error("Login error:", error)

    if (error instanceof z.ZodError) {
      const feedback = VisualFeedbackManager.createFeedback("error", "Please check your email and password format")
      const response = VisualFeedbackManager.createApiResponse(
        false,
        null,
        "Invalid input format",
        "VALIDATION_001",
        feedback,
      )
      return NextResponse.json(response, { status: 400 })
    }

    const feedback = VisualFeedbackManager.createFeedback("error", "Unable to sign in. Please try again.")
    const response = VisualFeedbackManager.createApiResponse(false, null, "Login failed", "AUTH_004", feedback)
    return NextResponse.json(response, { status: 500 })
  }
}
