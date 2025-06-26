import { NextResponse } from "next/server"
import { requireAuth, type AuthenticatedRequest } from "@/lib/auth/middleware"
import { executeQuery } from "@/lib/db/connection"
import type { UserPreferences } from "@/lib/db/schema"
import { z } from "zod"

const updatePreferencesSchema = z.object({
  language: z.string().optional(),
  timezone: z.string().optional(),
  notification_preferences: z
    .object({
      email: z.boolean().optional(),
      sms: z.boolean().optional(),
      push: z.boolean().optional(),
      in_app: z.boolean().optional(),
    })
    .optional(),
  accessibility_settings: z
    .object({
      high_contrast: z.boolean().optional(),
      large_text: z.boolean().optional(),
      reduce_motion: z.boolean().optional(),
      font_size: z.number().min(12).max(24).optional(),
    })
    .optional(),
  avatar_preferences: z
    .object({
      preferred_avatar_id: z.string().uuid().optional(),
      communication_method: z.enum(["avatar", "human", "text"]).optional(),
      formality_level: z.number().min(0).max(100).optional(),
      detail_level: z.number().min(0).max(100).optional(),
      communication_speed: z.number().min(0).max(100).optional(),
    })
    .optional(),
})

// GET /api/users/preferences - Get user preferences
export const GET = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    const users = await executeQuery<{ preferences: UserPreferences }>("SELECT preferences FROM users WHERE id = $1", [
      request.user.id,
    ])

    return NextResponse.json({
      success: true,
      data: users[0]?.preferences || {},
    })
  } catch (error) {
    console.error("Get preferences error:", error)
    return NextResponse.json({ error: "Failed to retrieve preferences" }, { status: 500 })
  }
})

// PUT /api/users/preferences - Update user preferences
export const PUT = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    const body = await request.json()
    const validatedData = updatePreferencesSchema.parse(body)

    // Get current preferences
    const users = await executeQuery<{ preferences: UserPreferences }>("SELECT preferences FROM users WHERE id = $1", [
      request.user.id,
    ])

    const currentPreferences = users[0]?.preferences || {}

    // Merge with new preferences
    const updatedPreferences = {
      ...currentPreferences,
      ...validatedData,
      notification_preferences: {
        ...currentPreferences.notification_preferences,
        ...validatedData.notification_preferences,
      },
      accessibility_settings: {
        ...currentPreferences.accessibility_settings,
        ...validatedData.accessibility_settings,
      },
      avatar_preferences: {
        ...currentPreferences.avatar_preferences,
        ...validatedData.avatar_preferences,
      },
    }

    // Update preferences
    await executeQuery("UPDATE users SET preferences = $1, updated_at = NOW() WHERE id = $2", [
      JSON.stringify(updatedPreferences),
      request.user.id,
    ])

    return NextResponse.json({
      success: true,
      data: updatedPreferences,
      message: "Preferences updated successfully",
    })
  } catch (error) {
    console.error("Update preferences error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 })
  }
})
