import { type NextRequest, NextResponse } from "next/server"
import { withRoles } from "@/middleware/auth-wrapper"
import { createApiResponse, visualFeedback } from "@/lib/visual-feedback"
import { createErrorResponse } from "@/lib/error-handling"
import { neon } from "@neondatabase/serverless"

// Initialize database connection
const sql = neon(process.env.DATABASE_URL)

async function listUsersHandler(request: NextRequest, { user }: { user: any }): Promise<NextResponse> {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    // Get users
    const users = await sql`
      SELECT 
        id, email, name, roles, verified, created_at, updated_at, last_seen
      FROM users
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    // Get total count
    const countResult = await sql`
      SELECT COUNT(*) as total FROM users
    `
    const total = countResult[0].total

    return NextResponse.json(
      createApiResponse(
        "success",
        {
          users,
          total,
          page,
          pages: Math.ceil(total / limit),
        },
        visualFeedback.success(),
      ),
    )
  } catch (error) {
    console.error("Error listing users:", error)
    return createErrorResponse("server_error")
  }
}

// Export the handler with admin role requirement
export const GET = withRoles(["admin"])(listUsersHandler)
