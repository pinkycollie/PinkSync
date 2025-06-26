import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db/connection"
import type { User } from "@/lib/db/schema"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  phone: z.string().optional(),
  preferences: z
    .object({
      language: z.string().default("en"),
      timezone: z.string().default("UTC"),
      notification_preferences: z
        .object({
          email: z.boolean().default(true),
          sms: z.boolean().default(false),
          push: z.boolean().default(true),
          in_app: z.boolean().default(true),
        })
        .default({}),
      accessibility_settings: z
        .object({
          high_contrast: z.boolean().default(false),
          large_text: z.boolean().default(false),
          reduce_motion: z.boolean().default(false),
          font_size: z.number().default(16),
        })
        .default({}),
      avatar_preferences: z
        .object({
          communication_method: z.enum(["avatar", "human", "text"]).default("avatar"),
          formality_level: z.number().min(0).max(100).default(50),
          detail_level: z.number().min(0).max(100).default(50),
          communication_speed: z.number().min(0).max(100).default(50),
        })
        .default({}),
    })
    .default({}),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Check if user already exists
    const existingUsers = await executeQuery<User>("SELECT id FROM users WHERE email = $1", [validatedData.email])

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash password (in production, use bcrypt)
    const passwordHash = await hashPassword(validatedData.password)

    // Create user
    const userId = crypto.randomUUID()
    const now = new Date()

    await executeQuery(
      `INSERT INTO users (
        id, email, name, phone, password_hash, preferences, 
        created_at, updated_at, status, email_verified, phone_verified, vcode_verified
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        userId,
        validatedData.email,
        validatedData.name,
        validatedData.phone,
        passwordHash,
        JSON.stringify(validatedData.preferences),
        now,
        now,
        "pending", // Requires email verification
        false,
        false,
        false,
      ],
    )

    // Send verification email (implement email service)
    await sendVerificationEmail(validatedData.email, userId)

    // Create default avatar interpreter for user
    await createDefaultAvatarInterpreter(userId)

    return NextResponse.json({
      success: true,
      message: "Registration successful. Please check your email for verification.",
      user_id: userId,
    })
  } catch (error) {
    console.error("Registration error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}

async function hashPassword(password: string): Promise<string> {
  // In production, use bcrypt
  return Buffer.from(password).toString("base64")
}

async function sendVerificationEmail(email: string, userId: string): Promise<void> {
  // Implement email service integration
  console.log(`Sending verification email to ${email} for user ${userId}`)
}

async function createDefaultAvatarInterpreter(userId: string): Promise<void> {
  const avatarId = crypto.randomUUID()

  await executeQuery(
    `INSERT INTO interpreters (
      id, name, type, specializations, status, created_at, updated_at, 
      avatar_config, ai_model_version, capabilities, rating, total_sessions
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
    [
      avatarId,
      "Maya",
      "avatar",
      JSON.stringify(["General", "Healthcare"]),
      "available",
      new Date(),
      new Date(),
      JSON.stringify({
        style: "professional",
        voice_id: "default_female",
        appearance_settings: { hair: "brown", skin: "medium", clothing: "professional" },
        gesture_library: ["natural", "expressive", "medical"],
        expression_library: ["neutral", "empathetic", "informative"],
      }),
      "v1.0",
      JSON.stringify(["form_assistance", "general_communication", "healthcare_support"]),
      5.0,
      0,
    ],
  )

  // Link avatar to user
  await executeQuery("INSERT INTO user_interpreters (user_id, interpreter_id, is_default) VALUES ($1, $2, $3)", [
    userId,
    avatarId,
    true,
  ])
}
