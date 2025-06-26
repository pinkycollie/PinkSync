import { NextResponse } from "next/server"
import { requireAuth, type AuthenticatedRequest } from "@/lib/auth/middleware-v2"
import { executeQuery } from "@/lib/db/connection"
import type { VCodeRecord, VCodeSession } from "@/lib/db/schema"
import { VisualFeedbackManager } from "@/lib/api/visual-feedback"

export const GET = requireAuth(async (request: AuthenticatedRequest, { params }: { params: { vCode: string } }) => {
  try {
    const vCode = params.vCode

    // Get vCode record with session data
    const records = await executeQuery<VCodeRecord & { session: VCodeSession }>(
      `SELECT vr.*, 
              json_build_object(
                'id', vs.id,
                'action', vs.action,
                'context', vs.context,
                'created_at', vs.created_at,
                'completed_at', vs.completed_at
              ) as session
       FROM vcode_records vr
       JOIN vcode_sessions vs ON vr.session_id = vs.id
       WHERE vr.vcode = $1 AND vr.user_id = $2`,
      [vCode, request.user.id],
    )

    const record = records[0]
    if (!record) {
      const feedback = VisualFeedbackManager.createFeedback("error", "vCode not found")
      const response = VisualFeedbackManager.createApiResponse(false, null, "vCode not found", "VCODE_001", feedback)
      return NextResponse.json(response, { status: 404 })
    }

    // Check if vCode is expired
    if (new Date() > record.expires_at) {
      const feedback = VisualFeedbackManager.createFeedback("warning", "This vCode has expired")
      const response = VisualFeedbackManager.createApiResponse(false, null, "vCode expired", "VCODE_002", feedback)
      return NextResponse.json(response, { status: 410 })
    }

    // Check if vCode is revoked
    if (record.status === "revoked") {
      const feedback = VisualFeedbackManager.createFeedback("error", "This vCode has been revoked")
      const response = VisualFeedbackManager.createApiResponse(false, null, "vCode revoked", "VCODE_003", feedback)
      return NextResponse.json(response, { status: 403 })
    }

    const feedback = VisualFeedbackManager.createFeedback("success", "vCode retrieved successfully")
    const response = VisualFeedbackManager.createApiResponse(
      true,
      {
        vcode: record.vcode,
        action: record.action,
        status: record.status,
        created_at: record.created_at,
        verified_at: record.verified_at,
        expires_at: record.expires_at,
        trust_verification: record.trust_verification,
        extracted_data: record.extracted_data,
        session: record.session,
        video_signature: record.video_signature,
      },
      undefined,
      undefined,
      feedback,
    )

    return NextResponse.json(response)
  } catch (error) {
    console.error("Get vCode error:", error)

    const feedback = VisualFeedbackManager.createFeedback("error", "Failed to retrieve vCode")
    const response = VisualFeedbackManager.createApiResponse(false, null, "Retrieval failed", "VCODE_004", feedback)
    return NextResponse.json(response, { status: 500 })
  }
})

// Revoke a vCode
export const DELETE = requireAuth(async (request: AuthenticatedRequest, { params }: { params: { vCode: string } }) => {
  try {
    const vCode = params.vCode

    // Update vCode status to revoked
    const result = await executeQuery(
      "UPDATE vcode_records SET status = $1, updated_at = NOW() WHERE vcode = $2 AND user_id = $3",
      ["revoked", vCode, request.user.id],
    )

    if (result.length === 0) {
      const feedback = VisualFeedbackManager.createFeedback("error", "vCode not found")
      const response = VisualFeedbackManager.createApiResponse(false, null, "vCode not found", "VCODE_001", feedback)
      return NextResponse.json(response, { status: 404 })
    }

    const feedback = VisualFeedbackManager.createFeedback("success", "vCode has been revoked successfully")
    const response = VisualFeedbackManager.createApiResponse(
      true,
      {
        vcode: vCode,
        status: "revoked",
        revoked_at: new Date().toISOString(),
      },
      undefined,
      undefined,
      feedback,
    )

    return NextResponse.json(response)
  } catch (error) {
    console.error("Revoke vCode error:", error)

    const feedback = VisualFeedbackManager.createFeedback("error", "Failed to revoke vCode")
    const response = VisualFeedbackManager.createApiResponse(false, null, "Revocation failed", "VCODE_005", feedback)
    return NextResponse.json(response, { status: 500 })
  }
})
