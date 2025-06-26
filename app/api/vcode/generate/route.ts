import { NextResponse } from "next/server"
import { requireAuth, type AuthenticatedRequest } from "@/lib/auth/middleware"
import { executeQuery } from "@/lib/db/connection"
import { z } from "zod"

const generateVCodeSchema = z.object({
  action: z.string().min(1),
  context: z.any().optional(),
  expires_in_minutes: z.number().min(1).max(60).default(10),
})

export const POST = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    const body = await request.json()
    const { action, context, expires_in_minutes } = generateVCodeSchema.parse(body)

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Set expiration
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + expires_in_minutes)

    // Get client info
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Invalidate any existing pending codes for this action
    await executeQuery(
      `UPDATE vcode_verifications 
       SET status = 'expired' 
       WHERE user_id = $1 AND action = $2 AND status = 'pending'`,
      [request.user.id, action],
    )

    // Create new verification record
    const verificationId = crypto.randomUUID()

    await executeQuery(
      `INSERT INTO vcode_verifications (
        id, user_id, code, action, context, status, attempts, max_attempts,
        created_at, expires_at, ip_address, user_agent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9, $10, $11)`,
      [
        verificationId,
        request.user.id,
        await hashCode(code), // Hash the code for storage
        action,
        JSON.stringify(context || {}),
        "pending",
        0,
        3, // Max attempts
        expiresAt,
        ipAddress,
        userAgent,
      ],
    )

    // Send code via preferred method (SMS, email, push notification)
    await sendVCode(request.user, code, action)

    return NextResponse.json({
      success: true,
      verification_id: verificationId,
      expires_at: expiresAt,
      message: "VCode sent successfully",
    })
  } catch (error) {
    console.error("Generate VCode error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to generate VCode" }, { status: 500 })
  }
})

async function hashCode(code: string): Promise<string> {
  // In production, use a proper hashing function
  return Buffer.from(code).toString("base64")
}

async function sendVCode(user: any, code: string, action: string): Promise<void> {
  // Implement actual sending logic based on user preferences
  const preferences = user.preferences?.notification_preferences || {}

  if (preferences.sms && user.phone) {
    await sendSMS(user.phone, `Your VisualDesk verification code is: ${code}`)
  }

  if (preferences.email) {
    await sendEmail(user.email, "VisualDesk Verification Code", `Your verification code is: ${code}`)
  }

  if (preferences.push) {
    await sendPushNotification(user.id, "Verification Code", `Your code: ${code}`)
  }
}

async function sendSMS(phone: string, message: string): Promise<void> {
  // Implement SMS service integration (Twilio, etc.)
  console.log(`SMS to ${phone}: ${message}`)
}

async function sendEmail(email: string, subject: string, body: string): Promise<void> {
  // Implement email service integration
  console.log(`Email to ${email}: ${subject} - ${body}`)
}

async function sendPushNotification(userId: string, title: string, body: string): Promise<void> {
  // Implement push notification service
  console.log(`Push to ${userId}: ${title} - ${body}`)
}
