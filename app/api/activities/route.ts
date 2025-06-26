import { NextResponse } from "next/server"
import { requireAuth, type AuthenticatedRequest } from "@/lib/auth/middleware"
import { executeQuery } from "@/lib/db/connection"
import type { Activity } from "@/lib/db/schema"
import { z } from "zod"

const listActivitiesSchema = z.object({
  type: z.string().optional(),
  read: z.boolean().optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
})

// GET /api/activities - List user's activities
export const GET = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const query = {
      type: searchParams.get("type"),
      read: searchParams.get("read") === "true" ? true : searchParams.get("read") === "false" ? false : undefined,
      limit: Number.parseInt(searchParams.get("limit") || "50"),
      offset: Number.parseInt(searchParams.get("offset") || "0"),
    }

    const validatedQuery = listActivitiesSchema.parse(query)

    let whereClause = "WHERE user_id = $1"
    const params: any[] = [request.user.id]
    let paramIndex = 2

    if (validatedQuery.type) {
      whereClause += ` AND type = $${paramIndex}`
      params.push(validatedQuery.type)
      paramIndex++
    }

    if (validatedQuery.read !== undefined) {
      whereClause += ` AND read = $${paramIndex}`
      params.push(validatedQuery.read)
      paramIndex++
    }

    const activities = await executeQuery<Activity>(
      `SELECT * FROM activities 
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, validatedQuery.limit, validatedQuery.offset],
    )

    // Get unread count
    const unreadCount = await executeQuery<{ count: number }>(
      "SELECT COUNT(*) as count FROM activities WHERE user_id = $1 AND read = false",
      [request.user.id],
    )

    return NextResponse.json({
      success: true,
      data: activities,
      unread_count: unreadCount[0]?.count || 0,
      pagination: {
        limit: validatedQuery.limit,
        offset: validatedQuery.offset,
        has_more: activities.length === validatedQuery.limit,
      },
    })
  } catch (error) {
    console.error("List activities error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid query parameters", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to retrieve activities" }, { status: 500 })
  }
})

// PUT /api/activities/mark-read - Mark activities as read
export const PUT = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    const body = await request.json()
    const { activity_ids, mark_all } = z
      .object({
        activity_ids: z.array(z.string().uuid()).optional(),
        mark_all: z.boolean().optional(),
      })
      .parse(body)

    if (mark_all) {
      await executeQuery("UPDATE activities SET read = true WHERE user_id = $1 AND read = false", [request.user.id])
    } else if (activity_ids && activity_ids.length > 0) {
      const placeholders = activity_ids.map((_, index) => `$${index + 2}`).join(",")
      await executeQuery(
        `UPDATE activities SET read = true 
         WHERE user_id = $1 AND id IN (${placeholders})`,
        [request.user.id, ...activity_ids],
      )
    } else {
      return NextResponse.json({ error: "Either activity_ids or mark_all must be provided" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Activities marked as read",
    })
  } catch (error) {
    console.error("Mark activities read error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to update activities" }, { status: 500 })
  }
})
