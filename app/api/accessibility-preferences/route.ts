import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  try {
    // In a real implementation, query your Supabase database
    // const { data, error } = await supabase
    //   .from('accessibility_preferences')
    //   .select('*')
    //   .eq('user_id', userId)
    //   .single()

    // Mock response based on your schema
    const mockPreferences = {
      id: "pref_123",
      user_id: userId,
      captions_enabled: true,
      high_contrast: true,
      sign_language_overlay: true,
      visual_notifications: true,
      vibration_notifications: false,
      flash_notifications: true,
      emergency_video_relay: true,
      emergency_text_alerts: true,
      text_to_speech: false,
      color_blind_support: true,
      font_size_multiplier: 1.2,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-16T00:00:00Z",
    }

    return NextResponse.json(mockPreferences)
  } catch (error) {
    console.error("Error fetching accessibility preferences:", error)
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, preferences } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    // In a real implementation, update your Supabase database
    // const { data, error } = await supabase
    //   .from('accessibility_preferences')
    //   .update({
    //     ...preferences,
    //     updated_at: new Date().toISOString()
    //   })
    //   .eq('user_id', userId)

    return NextResponse.json({
      success: true,
      message: "Accessibility preferences updated",
    })
  } catch (error) {
    console.error("Error updating accessibility preferences:", error)
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 })
  }
}
