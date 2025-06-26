import { NextResponse } from "next/server"
import { requireAuth, type AuthenticatedRequest } from "@/lib/auth/middleware-v2"
import { executeQuery } from "@/lib/db/connection"
import type { VCodeSession } from "@/lib/db/schema"
import { VisualFeedbackManager } from "@/lib/api/visual-feedback"
import { z } from "zod"

const verifySchema = z.object({
  user_confirmation: z.boolean(),
  additional_context: z.any().optional(),
})

export const POST = requireAuth(
  async (request: AuthenticatedRequest, { params }: { params: { sessionId: string } }) => {
    try {
      const sessionId = params.sessionId
      const body = await request.json()
      const { user_confirmation, additional_context } = verifySchema.parse(body)

      // Verify session exists and is ready for verification
      const sessions = await executeQuery<VCodeSession>(
        "SELECT * FROM vcode_sessions WHERE id = $1 AND user_id = $2 AND status = 'verifying'",
        [sessionId, request.user.id],
      )

      const session = sessions[0]
      if (!session) {
        const feedback = VisualFeedbackManager.createFeedback("error", "Session not ready for verification")
        const response = VisualFeedbackManager.createApiResponse(
          false,
          null,
          "Invalid session state",
          "VERIFY_001",
          feedback,
        )
        return NextResponse.json(response, { status: 400 })
      }

      if (!user_confirmation) {
        // User rejected the transformation
        await executeQuery("UPDATE vcode_sessions SET status = $1, updated_at = NOW() WHERE id = $2", [
          "failed",
          sessionId,
        ])

        const feedback = VisualFeedbackManager.createFeedback("warning", "Verification cancelled by user")
        const response = VisualFeedbackManager.createApiResponse(
          false,
          null,
          "User rejected verification",
          "VERIFY_002",
          feedback,
        )
        return NextResponse.json(response, { status: 400 })
      }

      // Generate vCode
      const vCode = generateVCode()
      const vCodeRecordId = crypto.randomUUID()

      // Create video signature (hash of video + processed data)
      const videoSignature = await createVideoSignature(session.video_url!, session.processed_data)

      // Create vCode record
      await executeQuery(
        `INSERT INTO vcode_records (
          id, session_id, vcode, user_id, action, video_signature,
          extracted_data, trust_verification, status, created_at, expires_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), $10)`,
        [
          vCodeRecordId,
          sessionId,
          vCode,
          request.user.id,
          session.action,
          videoSignature,
          JSON.stringify(session.processed_data),
          JSON.stringify(session.fibonrose_verification),
          "verified",
          new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
        ],
      )

      // Update session to completed
      await executeQuery(
        "UPDATE vcode_sessions SET status = $1, completed_at = NOW(), updated_at = NOW() WHERE id = $2",
        ["completed", sessionId],
      )

      // Update user verification status
      await executeQuery("UPDATE users SET is_verified = true, updated_at = NOW() WHERE id = $1", [request.user.id])

      const feedback = VisualFeedbackManager.createFeedback(
        "success",
        "vCode verification completed successfully! Your digital signature is ready.",
      )

      const response = VisualFeedbackManager.createApiResponse(
        true,
        {
          session_id: sessionId,
          vcode: vCode,
          status: "completed",
          verification_timestamp: new Date().toISOString(),
          trust_score: session.trust_score,
          vcode_url: `/api/v2/vcodes/${vCode}`,
        },
        undefined,
        undefined,
        feedback,
      )

      return NextResponse.json(response)
    } catch (error) {
      console.error("Verification error:", error)

      if (error instanceof z.ZodError) {
        const feedback = VisualFeedbackManager.createFeedback("error", "Please confirm your verification choice")
        const response = VisualFeedbackManager.createApiResponse(
          false,
          null,
          "Invalid verification data",
          "VERIFY_003",
          feedback,
        )
        return NextResponse.json(response, { status: 400 })
      }

      const feedback = VisualFeedbackManager.createFeedback("error", "Failed to complete verification")
      const response = VisualFeedbackManager.createApiResponse(
        false,
        null,
        "Verification failed",
        "VERIFY_004",
        feedback,
      )
      return NextResponse.json(response, { status: 500 })
    }
  },
)

function generateVCode(): string {
  // Generate a unique vCode (combination of timestamp and random string)
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `VC-${timestamp}-${random}`.toUpperCase()
}

async function createVideoSignature(videoUrl: string, processedData: any): Promise<string> {
  // Create a hash signature of the video and processed data
  // In production, this would use the actual video content
  const signatureData = {
    video_url: videoUrl,
    processed_data: processedData,
    timestamp: Date.now(),
  }

  const encoder = new TextEncoder()
  const data = encoder.encode(JSON.stringify(signatureData))
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

  return hashHex
}
