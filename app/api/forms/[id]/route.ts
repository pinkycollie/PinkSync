import { NextResponse } from "next/server"
import { requireAuth, type AuthenticatedRequest } from "@/lib/auth/middleware"
import { executeQuery } from "@/lib/db/connection"
import type { FormRequest } from "@/lib/db/schema"
import { z } from "zod"

const updateFormSchema = z.object({
  form_data: z.any().optional(),
  status: z.enum(["pending", "processing", "needs_info", "completed", "error", "cancelled"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
})

// GET /api/forms/[id] - Get specific form
export const GET = requireAuth(async (request: AuthenticatedRequest, { params }: { params: { id: string } }) => {
  try {
    const formId = params.id

    const forms = await executeQuery<FormRequest>("SELECT * FROM form_requests WHERE id = $1 AND user_id = $2", [
      formId,
      request.user.id,
    ])

    const form = forms[0]
    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: form,
    })
  } catch (error) {
    console.error("Get form error:", error)
    return NextResponse.json({ error: "Failed to retrieve form" }, { status: 500 })
  }
})

// PUT /api/forms/[id] - Update form
export const PUT = requireAuth(async (request: AuthenticatedRequest, { params }: { params: { id: string } }) => {
  try {
    const formId = params.id
    const body = await request.json()
    const validatedData = updateFormSchema.parse(body)

    // Check if form exists and belongs to user
    const forms = await executeQuery<FormRequest>("SELECT * FROM form_requests WHERE id = $1 AND user_id = $2", [
      formId,
      request.user.id,
    ])

    const form = forms[0]
    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    // Build update query dynamically
    const updates: string[] = []
    const queryParams: any[] = []
    let paramIndex = 1

    if (validatedData.form_data) {
      updates.push(`form_data = $${paramIndex}`)
      queryParams.push(JSON.stringify(validatedData.form_data))
      paramIndex++
    }

    if (validatedData.status) {
      updates.push(`status = $${paramIndex}`)
      queryParams.push(validatedData.status)
      paramIndex++
    }

    if (validatedData.priority) {
      updates.push(`priority = $${paramIndex}`)
      queryParams.push(validatedData.priority)
      paramIndex++
    }

    updates.push(`updated_at = NOW()`)

    if (updates.length === 1) {
      // Only updated_at
      return NextResponse.json({ error: "No valid updates provided" }, { status: 400 })
    }

    queryParams.push(formId)

    await executeQuery(`UPDATE form_requests SET ${updates.join(", ")} WHERE id = $${paramIndex}`, queryParams)

    // Create activity log
    await executeQuery(
      `INSERT INTO activities (id, user_id, type, title, description, metadata, created_at, read)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), false)`,
      [
        crypto.randomUUID(),
        request.user.id,
        "form_updated",
        `Form "${form.title}" updated`,
        "Form information has been updated",
        JSON.stringify({ form_id: formId, updates: Object.keys(validatedData) }),
      ],
    )

    return NextResponse.json({
      success: true,
      message: "Form updated successfully",
    })
  } catch (error) {
    console.error("Update form error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to update form" }, { status: 500 })
  }
})

// DELETE /api/forms/[id] - Cancel/delete form
export const DELETE = requireAuth(async (request: AuthenticatedRequest, { params }: { params: { id: string } }) => {
  try {
    const formId = params.id

    // Check if form exists and belongs to user
    const forms = await executeQuery<FormRequest>("SELECT * FROM form_requests WHERE id = $1 AND user_id = $2", [
      formId,
      request.user.id,
    ])

    const form = forms[0]
    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    // Check if form can be cancelled
    if (form.status === "completed") {
      return NextResponse.json({ error: "Cannot cancel completed form" }, { status: 400 })
    }

    // Update status to cancelled
    await executeQuery("UPDATE form_requests SET status = $1, updated_at = NOW() WHERE id = $2", ["cancelled", formId])

    // Create activity log
    await executeQuery(
      `INSERT INTO activities (id, user_id, type, title, description, metadata, created_at, read)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), false)`,
      [
        crypto.randomUUID(),
        request.user.id,
        "form_cancelled",
        `Form "${form.title}" cancelled`,
        "Form processing has been cancelled",
        JSON.stringify({ form_id: formId }),
      ],
    )

    return NextResponse.json({
      success: true,
      message: "Form cancelled successfully",
    })
  } catch (error) {
    console.error("Cancel form error:", error)
    return NextResponse.json({ error: "Failed to cancel form" }, { status: 500 })
  }
})
