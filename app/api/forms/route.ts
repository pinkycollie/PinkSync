import { NextResponse } from "next/server"
import { requireAuth, type AuthenticatedRequest } from "@/lib/auth/middleware"
import { executeQuery } from "@/lib/db/connection"
import type { FormRequest } from "@/lib/db/schema"
import { z } from "zod"

const createFormSchema = z.object({
  form_type: z.string(),
  provider: z.string(),
  title: z.string(),
  form_data: z.any(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  verification_required: z.boolean().default(true),
})

const listFormsSchema = z.object({
  status: z.enum(["pending", "processing", "needs_info", "completed", "error", "cancelled"]).optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
  sort_by: z.enum(["created_at", "updated_at", "priority"]).default("updated_at"),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
})

// GET /api/forms - List user's forms
export const GET = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const query = {
      status: searchParams.get("status"),
      limit: Number.parseInt(searchParams.get("limit") || "20"),
      offset: Number.parseInt(searchParams.get("offset") || "0"),
      sort_by: searchParams.get("sort_by") || "updated_at",
      sort_order: searchParams.get("sort_order") || "desc",
    }

    const validatedQuery = listFormsSchema.parse(query)

    let whereClause = "WHERE user_id = $1"
    const params: any[] = [request.user.id]

    if (validatedQuery.status) {
      whereClause += " AND status = $2"
      params.push(validatedQuery.status)
    }

    const forms = await executeQuery<FormRequest>(
      `SELECT * FROM form_requests 
       ${whereClause}
       ORDER BY ${validatedQuery.sort_by} ${validatedQuery.sort_order}
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, validatedQuery.limit, validatedQuery.offset],
    )

    // Get total count
    const countResult = await executeQuery<{ count: number }>(
      `SELECT COUNT(*) as count FROM form_requests ${whereClause}`,
      params.slice(0, -2), // Remove limit and offset
    )

    return NextResponse.json({
      success: true,
      data: forms,
      pagination: {
        total: countResult[0]?.count || 0,
        limit: validatedQuery.limit,
        offset: validatedQuery.offset,
        has_more: (countResult[0]?.count || 0) > validatedQuery.offset + validatedQuery.limit,
      },
    })
  } catch (error) {
    console.error("List forms error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid query parameters", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to retrieve forms" }, { status: 500 })
  }
})

// POST /api/forms - Create new form request
export const POST = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    const body = await request.json()
    const validatedData = createFormSchema.parse(body)

    const formId = crypto.randomUUID()
    const now = new Date()

    // Estimate completion time based on form type and complexity
    const estimatedCompletion = new Date()
    estimatedCompletion.setHours(estimatedCompletion.getHours() + getEstimatedProcessingHours(validatedData.form_type))

    await executeQuery(
      `INSERT INTO form_requests (
        id, user_id, form_type, provider, title, status, progress, priority,
        created_at, updated_at, estimated_completion, form_data, 
        verification_required, verification_completed
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
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
        false,
      ],
    )

    // Create activity log
    await createActivity(
      request.user.id,
      "form_created",
      `Form "${validatedData.title}" created`,
      `New ${validatedData.form_type} form submitted to ${validatedData.provider}`,
      { form_id: formId, form_type: validatedData.form_type },
    )

    // Start AI processing (async)
    processFormWithAI(formId).catch((error) => {
      console.error("AI processing error:", error)
    })

    return NextResponse.json(
      {
        success: true,
        form_id: formId,
        message: "Form submitted successfully",
        estimated_completion: estimatedCompletion,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create form error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create form" }, { status: 500 })
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

    // Get form data
    const forms = await executeQuery<FormRequest>("SELECT * FROM form_requests WHERE id = $1", [formId])

    const form = forms[0]
    if (!form) return

    // Simulate AI processing (replace with actual AI service call)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update progress
    await executeQuery("UPDATE form_requests SET progress = $1, updated_at = NOW() WHERE id = $2", [75, formId])

    // Simulate completion
    await new Promise((resolve) => setTimeout(resolve, 3000))

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

    // Create completion activity
    await createActivity(
      form.user_id,
      "form_completed",
      `Form "${form.title}" completed`,
      "Your form has been successfully processed",
      { form_id: formId },
    )
  } catch (error) {
    console.error("AI processing failed:", error)

    await executeQuery("UPDATE form_requests SET status = $1, updated_at = NOW() WHERE id = $2", ["error", formId])
  }
}

async function createActivity(
  userId: string,
  type: string,
  title: string,
  description: string,
  metadata: any,
): Promise<void> {
  await executeQuery(
    `INSERT INTO activities (id, user_id, type, title, description, metadata, created_at, read)
     VALUES ($1, $2, $3, $4, $5, $6, NOW(), false)`,
    [crypto.randomUUID(), userId, type, title, description, JSON.stringify(metadata)],
  )
}
