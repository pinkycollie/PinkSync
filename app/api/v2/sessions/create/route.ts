import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/middleware/auth-wrapper"
import { createApiResponse, visualFeedback } from "@/lib/visual-feedback"
import { createErrorResponse } from "@/lib/error-handling"
import { neon } from "@neondatabase/serverless"
import { generateVCode } from "@/lib/vcode-generator"
import { z } from "zod"

// Initialize database connection
const sql = neon(process.env.DATABASE_URL)

// Request validation schema
const createSessionSchema = z.object({
  clientId: z.string().min(1),
  domain: z.enum(["healthcare", "legal", "finance"]),
  context: z.string().optional(),
  requiresHumanReview: z.boolean().optional().default(false),
})

async function createSessionHandler(request: NextRequest, { user }: { user: any }): Promise<NextResponse> {
  try {
    const body = await request.json()

    // Validate request body
    const validationResult = createSessionSchema.safeParse(body)
    if (!validationResult.success) {
      return createErrorResponse("validation_error", {
        details: validationResult.error.format(),
      })
    }

    const { clientId, domain, context, requiresHumanReview } = validationResult.data

    // Generate unique identifiers
    const sessionId = `sess_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 9)}`
    const vCode = generateVCode()

    // Create session record in database
    await sql`
      INSERT INTO sessions (
        session_id, 
        v_code, 
        client_id, 
        domain, 
        context, 
        user_id, 
        requires_human_review,
        status,
        created_at
      ) VALUES (
        ${sessionId}, 
        ${vCode}, 
        ${clientId}, 
        ${domain}, 
        ${context || null}, 
        ${user.id}, 
        ${requiresHumanReview},
        'created',
        NOW()
      )
    `

    // Generate secure upload URL
    const uploadUrl = `${process.env.API_BASE_URL || "https://vcode.pinksync.io"}/v2/sessions/${sessionId}/upload`

    return NextResponse.json(
      createApiResponse(
        "success",
        {
          sessionId,
          vCode,
          uploadUrl,
          status: "created",
        },
        visualFeedback.success({
          icon: "file-plus",
          color: "green",
          animation: "pulse",
          vibration: false,
        }),
      ),
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating session:", error)
    return createErrorResponse("server_error")
  }
}

// Export the handler with authentication and permission requirements
export const POST = withAuth(createSessionHandler, {
  requiredPermissions: ["vcode:create"],
  allowServiceAuth: true,
})
