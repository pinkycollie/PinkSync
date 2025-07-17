"use client"

import { useState, type ReactNode } from "react"
import { DeafAuthContext, type DeafAuthUser, type DeafAuthContextType } from "../hooks/use-deaf-auth"

interface DeafAuthProviderProps {
  children: ReactNode
}

export function DeafAuthProvider({ children }: DeafAuthProviderProps) {
  const [user, setUser] = useState<DeafAuthUser | null>({
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    profileUrl: "/placeholder.svg?height=32&width=32",
    preferences: {
      preferredLanguage: "ASL",
      visualAlerts: true,
      vibrationAlerts: true,
      highContrast: false,
    },
  })

  const login = async (credentials: { email: string; password: string }) => {
    // Simulate login
    console.log("Logging in with:", credentials)
  }

  const logout = () => {
    setUser(null)
  }

  const value: DeafAuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  }

  return <DeafAuthContext.Provider value={value}>{children}</DeafAuthContext.Provider>
}
