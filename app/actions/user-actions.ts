"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createClient } from "@/lib/supabase/server"

export interface UserPreferences {
  communication_method: string
  visual_preferences: {
    high_contrast: boolean
    large_text: boolean
    color_scheme: string
  }
  caption_preferences: {
    enabled: boolean
    size: string
    position: string
    language: string
  }
  sign_language_preferences: {
    enabled: boolean
    dialect: string
    avatar_style: string
  }
  voice_preferences: {
    text_to_speech: boolean
    speech_to_text: boolean
    voice_type: string
  }
  haptic_feedback: boolean
  auto_adapt: boolean
}

export async function getUserPreferences(): Promise<UserPreferences | null> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return null
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from("user_accessibility_preferences")
      .select("*")
      .eq("user_id", session.user.id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // No preferences found, return defaults
        return {
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
      }
      console.error("Error fetching user preferences:", error)
      return null
    }

    return {
      communication_method: data.communication_method,
      visual_preferences: data.visual_preferences,
      caption_preferences: data.caption_preferences,
      sign_language_preferences: data.sign_language_preferences,
      voice_preferences: data.voice_preferences,
      haptic_feedback: data.haptic_feedback,
      auto_adapt: data.auto_adapt,
    }
  } catch (error) {
    console.error("Unexpected error fetching user preferences:", error)
    return null
  }
}

export async function updateUserPreferences(preferences: Partial<UserPreferences>) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    const supabase = createClient()

    // First, try to update existing preferences
    const { data: existingData, error: selectError } = await supabase
      .from("user_accessibility_preferences")
      .select("id")
      .eq("user_id", session.user.id)
      .single()

    if (selectError && selectError.code !== "PGRST116") {
      console.error("Error checking existing preferences:", selectError)
      throw new Error("Failed to check existing preferences")
    }

    const updateData = {
      user_id: session.user.id,
      ...preferences,
      updated_at: new Date().toISOString(),
    }

    if (existingData) {
      // Update existing preferences
      const { error: updateError } = await supabase
        .from("user_accessibility_preferences")
        .update(updateData)
        .eq("user_id", session.user.id)

      if (updateError) {
        console.error("Error updating user preferences:", updateError)
        throw new Error("Failed to update preferences")
      }
    } else {
      // Insert new preferences
      const { error: insertError } = await supabase.from("user_accessibility_preferences").insert(updateData)

      if (insertError) {
        console.error("Error inserting user preferences:", insertError)
        throw new Error("Failed to create preferences")
      }
    }

    revalidatePath("/dashboard/preferences")
    return { success: true }
  } catch (error) {
    console.error("Unexpected error updating user preferences:", error)
    throw error
  }
}

export async function logUserInteraction(
  interactionType: string,
  contentId: string,
  preferencesUsed: Record<string, any>,
  engagementMetrics: Record<string, any>,
  feedback?: Record<string, any>,
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return
    }

    const supabase = createClient()

    // Ensure all data is JSON serializable
    const safePreferencesUsed = JSON.parse(JSON.stringify(preferencesUsed || {}))
    const safeEngagementMetrics = JSON.parse(JSON.stringify(engagementMetrics || {}))
    const safeFeedback = feedback ? JSON.parse(JSON.stringify(feedback)) : null

    const { error } = await supabase.from("user_interaction_history").insert({
      user_id: session.user.id,
      interaction_type: interactionType,
      content_id: contentId,
      preferences_used: safePreferencesUsed,
      engagement_metrics: safeEngagementMetrics,
      feedback: safeFeedback,
    })

    if (error) {
      console.error("Error logging user interaction:", error)
    }
  } catch (error) {
    console.error("Unexpected error logging user interaction:", error)
  }
}

export async function getAdaptationSuggestions() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return []
    }

    const supabase = createClient()

    // Get recent interactions to analyze patterns
    const { data: interactions, error } = await supabase
      .from("user_interaction_history")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("Error fetching interactions for adaptation:", error)
      return []
    }

    // Simple adaptation logic based on interaction patterns
    const suggestions = []

    if (interactions && interactions.length > 0) {
      // Analyze patterns and suggest improvements
      const recentInteractions = interactions.slice(0, 10)
      const hasLowEngagement = recentInteractions.some((interaction) => interaction.engagement_metrics?.duration < 30)

      if (hasLowEngagement) {
        suggestions.push({
          type: "visual_enhancement",
          message: "Consider enabling high contrast mode for better visibility",
          action: "enable_high_contrast",
        })
      }

      // Check for sign language usage patterns
      const signLanguageUsage = recentInteractions.filter(
        (interaction) => interaction.preferences_used?.sign_language_preferences?.enabled,
      )

      if (signLanguageUsage.length > 5) {
        suggestions.push({
          type: "sign_language_optimization",
          message: "You frequently use sign language. Consider setting it as your primary communication method",
          action: "set_primary_sign_language",
        })
      }
    }

    return suggestions
  } catch (error) {
    console.error("Unexpected error getting adaptation suggestions:", error)
    return []
  }
}
