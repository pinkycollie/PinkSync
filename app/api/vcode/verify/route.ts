import { NextResponse } from "next/server"
import { requireAuth, type AuthenticatedRequest } from "@/lib/auth/middleware"
import { executeQuery } from "@/lib/db/connection"
import type { VCodeVerification } from "@/lib/db/schema"
import { z } from "zod"

const verifyVCodeSchema = z.object({
  verification_id: z.string().uuid(),
  code: z.string().length(6),
  action: z.string().min(1),
})

export const POST = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    const body = await request.json()
    const { verification_id, code, action } = verifyVCodeSchema.parse(body)

    // Get verification record
    const verifications = await executeQuery<VCodeVerification>(
      `SELECT * FROM vcode_verifications 
       WHERE id = $1 AND user_id = $2 AND action = $3 AND status = 'pending'`,
      [verification_id, request.user.id, action],
    )

    const verification = verifications[0]
    if (!verification) {
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 })
    }

    // Check if expired
    if (new Date() > verification.expires_at) {
      await executeQuery("UPDATE vcode_verifications SET status = $1 WHERE id = $2", ["expired", verification_id])

      return NextResponse.json({ error: "Verification code has expired" }, { status: 400 })
    }

    // Check max attempts
    if (verification.attempts >= verification.max_attempts) {
      await executeQuery("UPDATE vcode_verifications SET status = $1 WHERE id = $2", ["failed", verification_id])

      return NextResponse.json({ error: "Maximum verification attempts exceeded" }, { status: 400 })
    }

    // Increment attempts
    await executeQuery("UPDATE vcode_verifications SET attempts = attempts + 1 WHERE id = $1", [verification_id])

    // Verify code
    const isValidCode = await verifyCode(code, verification.code)

    if (!isValidCode) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
    }

    // Mark as verified
    await executeQuery(
      `UPDATE vcode_verifications 
       SET status = $1, verified_at = NOW() 
       WHERE id = $2`,
      ["verified", verification_id],
    )

    // Update user's VCode verification status
    await executeQuery("UPDATE users SET vcode_verified = true, last_vcode_verification = NOW() WHERE id = $1", [
      request.user.id,
    ])

    // Create activity log
    await executeQuery(
      `INSERT INTO activities (id, user_id, type, title, description, metadata, created_at, read)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), false)`,
      [
        crypto.randomUUID(),
        request.user.id,
        "verification_completed",
        "Identity verified",
        `VCode verification completed for action: ${action}`,
        JSON.stringify({ verification_id, action, context: verification.context }),
      ],
    )

    return NextResponse.json({
      success: true,
      verified: true,
      timestamp: new Date().toISOString(),
      action: action,
      message: "Identity verified successfully",
    })
  } catch (error) {
    console.error("Verify VCode error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
})

async function verifyCode(inputCode: string, storedHashedCode: string): Promise<boolean> {
  // In production, use proper hashing comparison
  const hashedInput = Buffer.from(inputCode).toString("base64")
  return hashedInput === storedHashedCode
}
