"use client"

import { createContext, useContext } from "react"

interface DeafAuthUser {
  id: string
  name: string
  email: string
  profileUrl?: string
  preferences: {
    preferredLanguage: "ASL" | "English" | "Both"
    visualAlerts: boolean
    vibrationAlerts: boolean
    highContrast: boolean
  }
}

interface DeafAuthContextType {
  user: DeafAuthUser | null
  isAuthenticated: boolean
  login: (credentials: { email: string; password: string }) => Promise<void>
  logout: () => void
}

const DeafAuthContext = createContext<DeafAuthContextType | null>(null)

export function useDeafAuth() {
  const context = useContext(DeafAuthContext)
  if (!context) {
    throw new Error("useDeafAuth must be used within a DeafAuthProvider")
  }
  return context
}

export { DeafAuthContext }
export type { DeafAuthUser, DeafAuthContextType }
