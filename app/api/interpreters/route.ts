import { NextResponse } from "next/server"
import { requireAuth, type AuthenticatedRequest } from "@/lib/auth/middleware"
import { executeQuery } from "@/lib/db/connection"
import type { Interpreter } from "@/lib/db/schema"
import { z } from "zod"

const listInterpretersSchema = z.object({
  type: z.enum(["avatar", "human"]).optional(),
  specialization: z.string().optional(),
  status: z.enum(["available", "busy", "offline", "maintenance"]).optional(),
  limit: z.number().min(1).max(50).default(20),
  offset: z.number().min(0).default(0),
})

const createAvatarSchema = z.object({
  name: z.string().min(1),
  specializations: z.array(z.string()).min(1),
  avatar_config: z.object({
    style: z.string(),
    voice_id: z.string(),
    appearance_settings: z.any(),
    gesture_library: z.array(z.string()),
    expression_library: z.array(z.string()),
  }),
})

// GET /api/interpreters - List user's interpreters
export const GET = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const query = {
      type: searchParams.get("type"),
      specialization: searchParams.get("specialization"),
      status: searchParams.get("status"),
      limit: Number.parseInt(searchParams.get("limit") || "20"),
      offset: Number.parseInt(searchParams.get("offset") || "0"),
    }

    const validatedQuery = listInterpretersSchema.parse(query)

    let whereClause = `WHERE i.id IN (
      SELECT interpreter_id FROM user_interpreters WHERE user_id = $1
    )`
    const params: any[] = [request.user.id]
    let paramIndex = 2

    if (validatedQuery.type) {
      whereClause += ` AND i.type = $${paramIndex}`
      params.push(validatedQuery.type)
      paramIndex++
    }

    if (validatedQuery.status) {
      whereClause += ` AND i.status = $${paramIndex}`
      params.push(validatedQuery.status)
      paramIndex++
    }

    if (validatedQuery.specialization) {
      whereClause += ` AND i.specializations::jsonb ? $${paramIndex}`
      params.push(validatedQuery.specialization)
      paramIndex++
    }

    const interpreters = await executeQuery<Interpreter>(
      `SELECT i.*, ui.is_default, ui.created_at as assigned_at
       FROM interpreters i
       JOIN user_interpreters ui ON i.id = ui.interpreter_id
       ${whereClause}
       ORDER BY ui.is_default DESC, i.last_active DESC NULLS LAST
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, validatedQuery.limit, validatedQuery.offset],
    )

    return NextResponse.json({
      success: true,
      data: interpreters,
      pagination: {
        limit: validatedQuery.limit,
        offset: validatedQuery.offset,
        has_more: interpreters.length === validatedQuery.limit,
      },
    })
  } catch (error) {
    console.error("List interpreters error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid query parameters", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to retrieve interpreters" }, { status: 500 })
  }
})

// POST /api/interpreters - Create new avatar interpreter
export const POST = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    const body = await request.json()
    const validatedData = createAvatarSchema.parse(body)

    const interpreterId = crypto.randomUUID()
    const now = new Date()

    // Create avatar interpreter
    await executeQuery(
      `INSERT INTO interpreters (
        id, name, type, specializations, status, created_at, updated_at,
        avatar_config, ai_model_version, capabilities, rating, total_sessions
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        interpreterId,
        validatedData.name,
        "avatar",
        JSON.stringify(validatedData.specializations),
        "available",
        now,
        now,
        JSON.stringify(validatedData.avatar_config),
        "v1.0",
        JSON.stringify(["form_assistance", "general_communication"]),
        5.0,
        0,
      ],
    )

    // Link to user
    await executeQuery("INSERT INTO user_interpreters (user_id, interpreter_id, is_default) VALUES ($1, $2, $3)", [
      request.user.id,
      interpreterId,
      false,
    ])

    // Create activity log
    await executeQuery(
      `INSERT INTO activities (id, user_id, type, title, description, metadata, created_at, read)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), false)`,
      [
        crypto.randomUUID(),
        request.user.id,
        "interpreter_created",
        `Avatar "${validatedData.name}" created`,
        "New avatar interpreter has been created and configured",
        JSON.stringify({ interpreter_id: interpreterId, specializations: validatedData.specializations }),
      ],
    )

    return NextResponse.json(
      {
        success: true,
        interpreter_id: interpreterId,
        message: "Avatar interpreter created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create interpreter error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create interpreter" }, { status: 500 })
  }
})
