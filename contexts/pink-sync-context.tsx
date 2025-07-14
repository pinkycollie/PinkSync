"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { PinkSyncMode, PinkSyncPreferences } from "@/lib/types/pink-sync"

// Default preferences
const defaultPreferences: PinkSyncPreferences = {
  autoPlayVideos: true,
  showTextWithVideos: true,
  videoPriority: "essential",
  videoSize: "medium",
  videoPosition: "inline",
  videoQuality: "medium",
  signModel: "human",
}

// Context type definition
type PinkSyncContextType = {
  mode: PinkSyncMode
  setMode: (mode: PinkSyncMode) => void
  preferences: PinkSyncPreferences
  updatePreferences: (prefs: Partial<PinkSyncPreferences>) => void
  isEnabled: boolean
  isPrioritized: (priority: number) => boolean
  getVideoUrl: (text: string) => string
}

// Create context
const PinkSyncContext = createContext<PinkSyncContextType | undefined>(undefined)

/**
 * PinkSync Provider Component
 * Manages the state and configuration of the PinkSync system
 */
export function PinkSyncProvider({ children }: { children: React.ReactNode }) {
  // State for mode and preferences
  const [mode, setMode] = useState<PinkSyncMode>("off")
  const [preferences, setPreferences] = useState<PinkSyncPreferences>(defaultPreferences)

  // Local storage persistence
  useEffect(() => {
    // Load preferences from localStorage if available
    try {
      const savedMode = localStorage.getItem("pinkSync.mode") as PinkSyncMode | null
      const savedPrefs = localStorage.getItem("pinkSync.preferences")

      if (savedMode) setMode(savedMode)
      if (savedPrefs) setPreferences(JSON.parse(savedPrefs))
    } catch (e) {
      console.error("Error loading PinkSync preferences:", e)
    }
  }, [])

  // Save preferences to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem("pinkSync.mode", mode)
      localStorage.setItem("pinkSync.preferences", JSON.stringify(preferences))
    } catch (e) {
      console.error("Error saving PinkSync preferences:", e)
    }
  }, [mode, preferences])

  // Computed property to check if PinkSync is enabled in any mode
  const isEnabled = mode !== "off"

  // Update preferences
  const updatePreferences = (prefs: Partial<PinkSyncPreferences>) => {
    setPreferences((current) => ({ ...current, ...prefs }))
  }

  // Determine if content with a given priority should be shown based on current preferences
  const isPrioritized = (priority: number) => {
    if (preferences.videoPriority === "all") return true
    return priority >= 4 // Only show high priority content (4-5) when set to "essential"
  }

  // Generate video URL based on text content
  const getVideoUrl = (text: string) => {
    // Hash the text to get a consistent number
    const hash = text.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 10

    // Use different videos based on the sign model preference
    const modelPath = preferences.signModel === "human" ? "human" : "avatar"
    const qualityPath = preferences.videoQuality === "high" ? "hd" : preferences.videoQuality === "medium" ? "md" : "ld"

    return `/videos/${modelPath}/${qualityPath}/sign-language-${hash + 1}.mp4`
  }

  // Apply appropriate classes to the document based on the current mode
  useEffect(() => {
    // Remove all mode classes first
    document.documentElement.classList.remove("pink-sync-ambient", "pink-sync-interactive", "pink-sync-immersive")

    // Add the appropriate class based on the current mode
    if (mode !== "off") {
      document.documentElement.classList.add(`pink-sync-${mode}`)
    }

    // Add data attributes for preferences that affect styling
    document.documentElement.setAttribute("data-ps-size", preferences.videoSize)
    document.documentElement.setAttribute("data-ps-position", preferences.videoPosition)
    document.documentElement.setAttribute("data-ps-model", preferences.signModel)
    document.documentElement.setAttribute("data-ps-quality", preferences.videoQuality)
  }, [mode, preferences])

  return (
    <PinkSyncContext.Provider
      value={{
        mode,
        setMode,
        preferences,
        updatePreferences,
        isEnabled,
        isPrioritized,
        getVideoUrl,
      }}
    >
      {children}
    </PinkSyncContext.Provider>
  )
}

/**
 * PinkSync Hook
 * Custom hook for accessing the PinkSync context
 */
export function usePinkSync() {
  const context = useContext(PinkSyncContext)
  if (context === undefined) {
    throw new Error("usePinkSync must be used within a PinkSyncProvider")
  }
  return context
}
