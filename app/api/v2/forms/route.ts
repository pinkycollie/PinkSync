import { NextResponse } from "next/server"
import { requireAuth, type AuthenticatedRequest } from "@/lib/auth/middleware-v2"
import { executeQuery } from "@/lib/db/connection"
import { VisualFeedbackManager } from "@/lib/api/visual-feedback"
import { z } from "zod"

const createFormSchema = z.object({
  form_type: z.string(),
  provider: z.string(),
  title: z.string(),
  form_data: z.any(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  verification_required: z.boolean().default(true),
  vcode_session_id: z.string().uuid().optional(),
})

// POST /api/v2/forms - Create new form request with vCode integration
export const POST = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    const body = await request.json()
    const validatedData = createFormSchema.parse(body)

    // If vCode session is provided, verify it's completed
    if (validatedData.vcode_session_id) {
      const sessions = await executeQuery(
        "SELECT * FROM vcode_sessions WHERE id = $1 AND user_id = $2 AND status = 'completed'",
        [validatedData.vcode_session_id, request.user.id],
      )

      if (sessions.length === 0) {
        const feedback = VisualFeedbackManager.createFeedback("error", "Invalid or incomplete vCode session")
        const response = VisualFeedbackManager.createApiResponse(
          false,
          null,
          "Invalid vCode session",
          "FORM_001",
          feedback,
        )
        return NextResponse.json(response, { status: 400 })
      }
    }

    const formId = crypto.randomUUID()
    const now = new Date()

    // Estimate completion time based on form type and complexity
    const estimatedCompletion = new Date()
    estimatedCompletion.setHours(estimatedCompletion.getHours() + getEstimatedProcessingHours(validatedData.form_type))

    await executeQuery(
      `INSERT INTO form_requests (
        id, user_id, form_type, provider, title, status, progress, priority,
        created_at, updated_at, estimated_completion, form_data, 
        verification_required, verification_completed, vcode_session_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
      [
        formId,
        request.user.id,
        validatedData.form_type,
        validatedData.provider,
        validatedData.title,
        "pending",
        0,
        validatedData.priority,
        now,
        now,
        estimatedCompletion,
        JSON.stringify(validatedData.form_data),
        validatedData.verification_required,
        validatedData.vcode_session_id ? true : false,
        validatedData.vcode_session_id,
      ],
    )

    // Start AI processing (async)
    processFormWithAI(formId).catch((error) => {
      console.error("AI processing error:", error)
    })

    const feedback = VisualFeedbackManager.createFeedback(
      "success",
      "Form submitted successfully! AI processing has started.",
    )

    const response = VisualFeedbackManager.createApiResponse(
      true,
      {
        form_id: formId,
        status: "pending",
        estimated_completion: estimatedCompletion,
        vcode_verified: !!validatedData.vcode_session_id,
      },
      undefined,
      undefined,
      feedback,
    )

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Create form error:", error)

    if (error instanceof z.ZodError) {
      const feedback = VisualFeedbackManager.createFeedback("error", "Please check your form data")
      const response = VisualFeedbackManager.createApiResponse(false, null, "Invalid form data", "FORM_002", feedback)
      return NextResponse.json(response, { status: 400 })
    }

    const feedback = VisualFeedbackManager.createFeedback("error", "Failed to submit form. Please try again.")
    const response = VisualFeedbackManager.createApiResponse(false, null, "Form creation failed", "FORM_003", feedback)
    return NextResponse.json(response, { status: 500 })
  }
})

function getEstimatedProcessingHours(formType: string): number {
  const estimates: Record<string, number> = {
    healthcare_claim: 24,
    insurance_application: 48,
    mortgage_application: 72,
    tax_return: 48,
    government_form: 24,
    employment_form: 12,
  }
  return estimates[formType] || 24
}

async function processFormWithAI(formId: string): Promise<void> {
  try {
    // Update status to processing
    await executeQuery("UPDATE form_requests SET status = $1, updated_at = NOW() WHERE id = $2", ["processing", formId])

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Update progress
    await executeQuery("UPDATE form_requests SET progress = $1, updated_at = NOW() WHERE id = $2", [75, formId])

    await new Promise((resolve) => setTimeout(resolve, 2000))

    await executeQuery(
      `UPDATE form_requests SET 
        status = $1, progress = $2, completed_at = NOW(), updated_at = NOW(),
        processed_data = $3, ai_analysis = $4
       WHERE id = $5`,
      [
        "completed",
        100,
        JSON.stringify({ processed: true, extracted_fields: {} }),
        JSON.stringify({ confidence: 0.95, recommendations: [] }),
        formId,
      ],
    )
  } catch (error) {
    console.error("AI processing failed:", error)
    await executeQuery("UPDATE form_requests SET status = $1, updated_at = NOW() WHERE id = $2", ["error", formId])
  }
}
