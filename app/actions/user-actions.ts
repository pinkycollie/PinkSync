"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createClient } from "@/lib/supabase/server"

// Default preferences matching your schema
const defaultPreferences = {
  communication_method: "text",
  visual_preferences: {
    high_contrast: false,
    large_text: false,
    color_scheme: "default",
  },
  caption_preferences: {
    enabled: true,
    size: "medium",
    position: "bottom",
    language: "en",
  },
  sign_language_preferences: {
    enabled: false,
    dialect: "asl",
    avatar_style: "realistic",
  },
  voice_preferences: {
    text_to_speech: false,
    speech_to_text: false,
    voice_type: "neutral",
  },
  haptic_feedback: false,
  auto_adapt: true,
}

export async function getUserPreferences(userId: string) {
  const supabase = createClient()
  try {
    // Get preferences from user_accessibility_preferences table
    const { data: result, error: selectError } = await supabase
      .from("user_accessibility_preferences")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (selectError && selectError.code !== "PGRST116") {
      console.error("Error fetching user preferences:", selectError)
      return defaultPreferences
    }

    if (!result) {
      // Create default preferences if none exist
      const { error: insertError } = await supabase.from("user_accessibility_preferences").insert({
        user_id: userId,
        communication_method: defaultPreferences.communication_method,
        visual_preferences: defaultPreferences.visual_preferences,
        caption_preferences: defaultPreferences.caption_preferences,
        sign_language_preferences: defaultPreferences.sign_language_preferences,
        voice_preferences: defaultPreferences.voice_preferences,
        haptic_feedback: defaultPreferences.haptic_feedback,
        auto_adapt: defaultPreferences.auto_adapt,
      })

      if (insertError) {
        console.error("Error creating default preferences:", insertError)
        return defaultPreferences
      }

      return defaultPreferences
    }

    return {
      communication_method: result.communication_method,
      visual_preferences: result.visual_preferences,
      caption_preferences: result.caption_preferences,
      sign_language_preferences: result.sign_language_preferences,
      voice_preferences: result.voice_preferences,
      haptic_feedback: result.haptic_feedback,
      auto_adapt: result.auto_adapt,
    }
  } catch (error) {
    console.error("Unexpected error getting user preferences:", error)
    return defaultPreferences
  }
}

export async function updateUserPreferences(
  userId: string,
  preferences: {
    communication_method?: string
    visual_preferences?: any
    caption_preferences?: any
    sign_language_preferences?: any
    voice_preferences?: any
    haptic_feedback?: boolean
    auto_adapt?: boolean
  },
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || session.user.id !== userId) {
    throw new Error("Not authorized to update preferences")
  }

  const supabase = createClient()

  try {
    // Get current preferences
    const currentPrefs = await getUserPreferences(userId)

    // Merge with updates
    const updatedPrefs = {
      communication_method: preferences.communication_method || currentPrefs.communication_method,
      visual_preferences: { ...currentPrefs.visual_preferences, ...preferences.visual_preferences },
      caption_preferences: { ...currentPrefs.caption_preferences, ...preferences.caption_preferences },
      sign_language_preferences: {
        ...currentPrefs.sign_language_preferences,
        ...preferences.sign_language_preferences,
      },
      voice_preferences: { ...currentPrefs.voice_preferences, ...preferences.voice_preferences },
      haptic_feedback:
        preferences.haptic_feedback !== undefined ? preferences.haptic_feedback : currentPrefs.haptic_feedback,
      auto_adapt: preferences.auto_adapt !== undefined ? preferences.auto_adapt : currentPrefs.auto_adapt,
    }

    // Update in database using upsert
    const { error } = await supabase
      .from("user_accessibility_preferences")
      .upsert({
        user_id: userId,
        communication_method: updatedPrefs.communication_method,
        visual_preferences: updatedPrefs.visual_preferences,
        caption_preferences: updatedPrefs.caption_preferences,
        sign_language_preferences: updatedPrefs.sign_language_preferences,
        voice_preferences: updatedPrefs.voice_preferences,
        haptic_feedback: updatedPrefs.haptic_feedback,
        auto_adapt: updatedPrefs.auto_adapt,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)

    if (error) {
      console.error("Error updating user preferences:", error)
      throw new Error("Failed to update preferences")
    }

    revalidatePath("/dashboard/preferences")
    revalidatePath("/dashboard")

    return { success: true, preferences: updatedPrefs }
  } catch (error) {
    console.error("Unexpected error updating user preferences:", error)
    throw new Error("Failed to update preferences")
  }
}

export async function logUserInteraction(
  userId: string,
  interactionType: string,
  contentId: string,
  engagementMetrics: any,
  feedback?: any,
) {
  const supabase = createClient()
  try {
    // Get current preferences
    const preferences = await getUserPreferences(userId)

    // Log interaction in user_interaction_history table
    const { error: insertError } = await supabase.from("user_interaction_history").insert({
      user_id: userId,
      interaction_type: interactionType,
      content_id: contentId,
      preferences_used: preferences,
      engagement_metrics: engagementMetrics,
      feedback: feedback,
    })

    if (insertError) {
      console.error("Error logging user interaction:", insertError)
      return { success: false, error: "Failed to log interaction" }
    }

    // Auto-adaptation logic
    if (preferences.auto_adapt) {
      if (interactionType === "video_watch" && engagementMetrics.caption_views > 5) {
        await updateUserPreferences(userId, {
          caption_preferences: { enabled: true },
        })
      }

      if (interactionType === "sign_language_view" && engagementMetrics.duration > 60) {
        await updateUserPreferences(userId, {
          sign_language_preferences: { enabled: true },
        })
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected error logging user interaction:", error)
    return { success: false, error: "Failed to log interaction" }
  }
}
