import { NextResponse } from "next/server"
import { requireAuth, type AuthenticatedRequest } from "@/lib/auth/middleware-v2"
import { executeQuery } from "@/lib/db/connection"
import { VisualFeedbackManager } from "@/lib/api/visual-feedback"
import { z } from "zod"

const createSessionSchema = z.object({
  action: z.string().min(1),
  context: z.any().optional(),
  expires_in_minutes: z.number().min(5).max(60).default(30),
})

export const POST = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    const body = await request.json()
    const { action, context, expires_in_minutes } = createSessionSchema.parse(body)

    const sessionId = crypto.randomUUID()
    const sessionToken = crypto.randomUUID()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + expires_in_minutes * 60 * 1000)

    // Create vCode session
    await executeQuery(
      `INSERT INTO vcode_sessions (
        id, user_id, session_token, status, action, context, 
        created_at, updated_at, expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [sessionId, request.user.id, sessionToken, "created", action, JSON.stringify(context || {}), now, now, expiresAt],
    )

    const feedback = VisualFeedbackManager.createFeedback(
      "success",
      "vCode session created successfully. You can now upload your sign language video.",
    )

    const response = VisualFeedbackManager.createApiResponse(
      true,
      {
        session_id: sessionId,
        session_token: sessionToken,
        action,
        status: "created",
        expires_at: expiresAt,
        upload_url: `/api/v2/sessions/${sessionId}/upload`,
      },
      undefined,
      undefined,
      feedback,
    )

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Create vCode session error:", error)

    if (error instanceof z.ZodError) {
      const feedback = VisualFeedbackManager.createFeedback("error", "Please check your session parameters")
      const response = VisualFeedbackManager.createApiResponse(
        false,
        null,
        "Invalid session parameters",
        "SESSION_001",
        feedback,
      )
      return NextResponse.json(response, { status: 400 })
    }

    const feedback = VisualFeedbackManager.createFeedback("error", "Unable to create vCode session. Please try again.")
    const response = VisualFeedbackManager.createApiResponse(
      false,
      null,
      "Session creation failed",
      "SESSION_002",
      feedback,
    )
    return NextResponse.json(response, { status: 500 })
  }
})
