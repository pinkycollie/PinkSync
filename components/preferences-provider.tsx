"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSession } from "next-auth/react"
import { getUserPreferences } from "@/app/actions/user-actions"

// Default preferences
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

interface PreferencesContextType {
  preferences: typeof defaultPreferences
  isLoading: boolean
  applyPreferences: (element: HTMLElement) => void
}

const PreferencesContext = createContext<PreferencesContextType>({
  preferences: defaultPreferences,
  isLoading: true,
  applyPreferences: () => {},
})

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [preferences, setPreferences] = useState(defaultPreferences)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadPreferences() {
      if (status === "authenticated" && session?.user?.id) {
        try {
          const userPrefs = await getUserPreferences(session.user.id)
          setPreferences(userPrefs)
        } catch (error) {
          console.error("Error loading preferences:", error)
        } finally {
          setIsLoading(false)
        }
      } else if (status === "unauthenticated") {
        setIsLoading(false)
      }
    }

    loadPreferences()
  }, [session, status])

  // Function to apply preferences to an HTML element
  const applyPreferences = (element: HTMLElement) => {
    // Apply visual preferences
    if (preferences.visual_preferences.high_contrast) {
      element.classList.add("high-contrast")
    } else {
      element.classList.remove("high-contrast")
    }

    if (preferences.visual_preferences.large_text) {
      element.classList.add("large-text")
    } else {
      element.classList.remove("large-text")
    }

    // Apply color scheme
    element.dataset.colorScheme = preferences.visual_preferences.color_scheme

    // Apply other preferences as needed
    // This would be expanded in a real implementation
  }

  return (
    <PreferencesContext.Provider value={{ preferences, isLoading, applyPreferences }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  return useContext(PreferencesContext)
}
