import { NextResponse } from "next/server"
import { requireAuth, type AuthenticatedRequest } from "@/lib/auth/middleware-v2"
import { executeQuery } from "@/lib/db/connection"
import type { VCodeSession } from "@/lib/db/schema"
import { VisualFeedbackManager } from "@/lib/api/visual-feedback"
import { z } from "zod"

const transformSchema = z.object({
  target_format: z.enum(["text", "structured_data", "form_fields"]).default("structured_data"),
  include_confidence: z.boolean().default(true),
  language: z.string().default("en"),
})

export const POST = requireAuth(
  async (request: AuthenticatedRequest, { params }: { params: { sessionId: string } }) => {
    try {
      const sessionId = params.sessionId
      const body = await request.json()
      const { target_format, include_confidence, language } = transformSchema.parse(body)

      // Verify session exists and is ready for transformation
      const sessions = await executeQuery<VCodeSession>(
        "SELECT * FROM vcode_sessions WHERE id = $1 AND user_id = $2 AND status = 'transforming'",
        [sessionId, request.user.id],
      )

      const session = sessions[0]
      if (!session) {
        const feedback = VisualFeedbackManager.createFeedback("error", "Session not ready for transformation")
        const response = VisualFeedbackManager.createApiResponse(
          false,
          null,
          "Invalid session state",
          "TRANSFORM_001",
          feedback,
        )
        return NextResponse.json(response, { status: 400 })
      }

      // Get processed data
      const processedData = session.processed_data

      if (!processedData) {
        const feedback = VisualFeedbackManager.createFeedback("error", "No processed data available")
        const response = VisualFeedbackManager.createApiResponse(
          false,
          null,
          "No processed data",
          "TRANSFORM_002",
          feedback,
        )
        return NextResponse.json(response, { status: 400 })
      }

      // Transform data based on target format
      let transformedData: any

      switch (target_format) {
        case "text":
          transformedData = {
            text: processedData.detected_signs?.join(" ") || "",
            confidence: include_confidence ? processedData.confidence_scores : undefined,
          }
          break

        case "structured_data":
          transformedData = {
            signs: processedData.detected_signs || [],
            confidence_scores: include_confidence ? processedData.confidence_scores : undefined,
            metadata: {
              duration: processedData.video_duration,
              frame_count: processedData.frame_count,
              processing_time: processedData.processing_time,
              language,
            },
          }
          break

        case "form_fields":
          // Map signs to common form fields
          transformedData = mapSignsToFormFields(processedData.detected_signs || [])
          break

        default:
          transformedData = processedData
      }

      // Integrate with FibonRose for trust verification
      const trustVerification = await verifyWithFibonRose(sessionId, transformedData)

      // Update session with transformation results
      await executeQuery(
        `UPDATE vcode_sessions SET 
         processed_data = $1, 
         trust_score = $2, 
         fibonrose_verification = $3,
         status = $4, 
         updated_at = NOW() 
         WHERE id = $5`,
        [
          JSON.stringify({ ...processedData, transformed: transformedData }),
          trustVerification.trust_score,
          JSON.stringify(trustVerification),
          "verifying",
          sessionId,
        ],
      )

      const feedback = VisualFeedbackManager.createFeedback(
        "success",
        "Sign language transformed successfully. Ready for verification.",
      )

      const response = VisualFeedbackManager.createApiResponse(
        true,
        {
          session_id: sessionId,
          status: "verifying",
          transformed_data: transformedData,
          trust_verification: trustVerification,
          verify_url: `/api/v2/sessions/${sessionId}/verify`,
        },
        undefined,
        undefined,
        feedback,
      )

      return NextResponse.json(response)
    } catch (error) {
      console.error("Transform error:", error)

      if (error instanceof z.ZodError) {
        const feedback = VisualFeedbackManager.createFeedback("error", "Please check transformation parameters")
        const response = VisualFeedbackManager.createApiResponse(
          false,
          null,
          "Invalid parameters",
          "TRANSFORM_003",
          feedback,
        )
        return NextResponse.json(response, { status: 400 })
      }

      const feedback = VisualFeedbackManager.createFeedback("error", "Failed to transform sign language data")
      const response = VisualFeedbackManager.createApiResponse(
        false,
        null,
        "Transformation failed",
        "TRANSFORM_004",
        feedback,
      )
      return NextResponse.json(response, { status: 500 })
    }
  },
)

function mapSignsToFormFields(signs: string[]): any {
  // Map detected signs to common form fields
  const fieldMappings: Record<string, string[]> = {
    name: ["name", "first", "last", "full"],
    email: ["email", "mail", "contact"],
    phone: ["phone", "number", "call"],
    address: ["address", "street", "home"],
    confirm: ["yes", "confirm", "agree", "accept"],
    deny: ["no", "deny", "disagree", "reject"],
  }

  const mappedFields: Record<string, any> = {}

  for (const [field, keywords] of Object.entries(fieldMappings)) {
    const matchedSigns = signs.filter((sign) => keywords.some((keyword) => sign.toLowerCase().includes(keyword)))

    if (matchedSigns.length > 0) {
      mappedFields[field] = {
        detected_signs: matchedSigns,
        confidence: "high", // Simplified confidence
      }
    }
  }

  return mappedFields
}

async function verifyWithFibonRose(sessionId: string, transformedData: any): Promise<any> {
  try {
    // Integration with FibonRose service for trust verification
    const fibonroseApiKey = process.env.FIBONROSE_API_KEY
    const fibonroseUrl = process.env.FIBONROSE_API_URL || "https://api.fibonrose.com"

    if (!fibonroseApiKey) {
      console.warn("FibonRose API key not configured")
      return {
        trust_score: 0.8, // Default trust score
        verification_status: "not_configured",
        timestamp: new Date().toISOString(),
      }
    }

    // Make request to FibonRose API
    const response = await fetch(`${fibonroseUrl}/v1/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${fibonroseApiKey}`,
      },
      body: JSON.stringify({
        session_id: sessionId,
        data: transformedData,
        verification_type: "sign_language_authenticity",
      }),
    })

    if (!response.ok) {
      throw new Error(`FibonRose API error: ${response.status}`)
    }

    const verification = await response.json()

    return {
      trust_score: verification.trust_score || 0.8,
      verification_status: verification.status || "verified",
      details: verification.details,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error("FibonRose verification error:", error)

    // Return default verification on error
    return {
      trust_score: 0.7,
      verification_status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    }
  }
}
