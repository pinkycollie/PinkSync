import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/middleware/auth-wrapper"
import { createApiResponse, visualFeedback } from "@/lib/visual-feedback"
import { createErrorResponse } from "@/lib/error-handling"
import { neon } from "@neondatabase/serverless"

// Initialize database connection
const sql = neon(process.env.DATABASE_URL)

async function getVCodeHandler(
  request: NextRequest,
  { user, params }: { user: any; params: { vCode: string } },
): Promise<NextResponse> {
  try {
    const vCode = params.vCode

    // Get session information
    const sessions = await sql`
      SELECT * FROM sessions WHERE v_code = ${vCode}
    `

    if (sessions.length === 0) {
      return createErrorResponse("vcode_not_found")
    }

    const session = sessions[0]

    // Check if user has permission to access this vCode
    // Users can access their own vCodes, validators can access any, services can access any
    if (
      session.user_id !== user.id &&
      !user.roles.includes("validator") &&
      !user.roles.includes("admin") &&
      !user.roles.includes("service")
    ) {
      return createErrorResponse("forbidden")
    }

    const sessionId = session.session_id

    // Get video information
    const videos = await sql`
      SELECT * FROM video_uploads 
      WHERE session_id = ${sessionId}
      ORDER BY uploaded_at DESC
      LIMIT 1
    `

    // Get transformation data
    const transformations = await sql`
      SELECT * FROM transformations
      WHERE session_id = ${sessionId}
      ORDER BY transformed_at DESC
      LIMIT 1
    `

    // Get audit trail
    const auditTrail = await sql`
      SELECT * FROM audit_trail
      WHERE session_id = ${sessionId}
      ORDER BY timestamp ASC
    `

    // Get associated documents
    const documents = await sql`
      SELECT * FROM documents
      WHERE session_id = ${sessionId}
      ORDER BY generated_at DESC
    `

    // Format the response
    const response = {
      vCode,
      sessionId,
      signedVideoUrl: videos.length > 0 ? videos[0].storage_url : null,
      transformedData: transformations.length > 0 ? transformations[0].transform_output : null,
      auditTrail: auditTrail.map((entry: any) => ({
        timestamp: entry.timestamp,
        action: entry.action,
        field: entry.field,
        oldValue: entry.old_value,
        newValue: entry.new_value,
        user: entry.user_id,
      })),
      associatedDocuments: documents.map((doc: any) => ({
        type: doc.type,
        url: doc.url,
        generatedAt: doc.generated_at,
      })),
      status: session.status,
      domain: session.domain,
      context: session.context,
      createdAt: session.created_at,
      updatedAt: session.updated_at,
    }

    return NextResponse.json(
      createApiResponse(
        "success",
        response,
        visualFeedback.success({
          icon: "file-text",
          color: "green",
          animation: "none",
          vibration: false,
        }),
      ),
    )
  } catch (error) {
    console.error("Error retrieving vCode record:", error)
    return createErrorResponse("server_error")
  }
}

// Export the handler with authentication and permission requirements
export const GET = withAuth(getVCodeHandler, {
  requiredPermissions: ["vcode:read"],
  allowServiceAuth: true,
})
