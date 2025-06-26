import { NextResponse } from "next/server"
import { requireAuth, type AuthenticatedRequest } from "@/lib/auth/middleware"
import { executeQuery } from "@/lib/db/connection"
import type { Session } from "@/lib/db/schema"
import { z } from "zod"

const createSessionSchema = z.object({
  interpreter_id: z.string().uuid(),
  form_request_id: z.string().uuid().optional(),
  type: z.enum(["chat", "video", "voice"]),
  context: z.any().optional(),
})

const updateSessionSchema = z.object({
  status: z.enum(["active", "ended", "paused"]).optional(),
  satisfaction_rating: z.number().min(1).max(5).optional(),
  notes: z.string().optional(),
})

// GET /api/sessions - List user's sessions
export const GET = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const status = searchParams.get("status")

    let whereClause = "WHERE s.user_id = $1"
    const params: any[] = [request.user.id]

    if (status) {
      whereClause += " AND s.status = $2"
      params.push(status)
    }

    const sessions = await executeQuery<Session & { interpreter_name: string }>(
      `SELECT s.*, i.name as interpreter_name, i.type as interpreter_type
       FROM sessions s
       JOIN interpreters i ON s.interpreter_id = i.id
       ${whereClause}
       ORDER BY s.started_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset],
    )

    return NextResponse.json({
      success: true,
      data: sessions,
      pagination: {
        limit,
        offset,
        has_more: sessions.length === limit,
      },
    })
  } catch (error) {
    console.error("List sessions error:", error)
    return NextResponse.json({ error: "Failed to retrieve sessions" }, { status: 500 })
  }
})

// POST /api/sessions - Start new session
export const POST = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    const body = await request.json()
    const validatedData = createSessionSchema.parse(body)

    // Verify interpreter belongs to user
    const interpreters = await executeQuery(
      `SELECT i.* FROM interpreters i
       JOIN user_interpreters ui ON i.id = ui.interpreter_id
       WHERE i.id = $1 AND ui.user_id = $2 AND i.status = 'available'`,
      [validatedData.interpreter_id, request.user.id],
    )

    if (interpreters.length === 0) {
      return NextResponse.json({ error: "Interpreter not available" }, { status: 400 })
    }

    const sessionId = crypto.randomUUID()
    const now = new Date()

    // Create session
    await executeQuery(
      `INSERT INTO sessions (
        id, user_id, interpreter_id, form_request_id, type, status, started_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        sessionId,
        request.user.id,
        validatedData.interpreter_id,
        validatedData.form_request_id,
        validatedData.type,
        "active",
        now,
      ],
    )

    // Update interpreter status
    await executeQuery("UPDATE interpreters SET status = $1, last_active = NOW() WHERE id = $2", [
      "busy",
      validatedData.interpreter_id,
    ])

    // Create activity log
    await executeQuery(
      `INSERT INTO activities (id, user_id, type, title, description, metadata, created_at, read)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), false)`,
      [
        crypto.randomUUID(),
        request.user.id,
        "session_started",
        `${validatedData.type} session started`,
        `Started ${validatedData.type} session with ${interpreters[0].name}`,
        JSON.stringify({
          session_id: sessionId,
          interpreter_id: validatedData.interpreter_id,
          type: validatedData.type,
        }),
      ],
    )

    return NextResponse.json(
      {
        success: true,
        session_id: sessionId,
        message: "Session started successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create session error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to start session" }, { status: 500 })
  }
})
