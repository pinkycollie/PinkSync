"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, User, CheckCircle, AlertCircle } from "lucide-react"

interface DeafAuthUser {
  id: string
  email: string
  name: string
  provider: "DeafFirst" | "FibonRose" | "Pinksync"
  accessibilityPreferences: {
    aslRequired: boolean
    captionsEnabled: boolean
    highContrast: boolean
    slowPacing: boolean
  }
  vocationalProfile: {
    currentStatus: "job-seeking" | "employed" | "career-change" | "entrepreneur"
    targetIndustry: string[]
    accommodationNeeds: string[]
  }
}

interface DeafAuthContextType {
  user: DeafAuthUser | null
  isAuthenticated: boolean
  login: (provider: string) => Promise<void>
  logout: () => void
  updatePreferences: (preferences: Partial<DeafAuthUser["accessibilityPreferences"]>) => void
}

const DeafAuthContext = createContext<DeafAuthContextType | undefined>(undefined)

export function DeafAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DeafAuthUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        // Simulate checking OAuth token
        const token = localStorage.getItem("deafauth_token")
        if (token) {
          // Mock user data - in real implementation, validate token with Google OAuth
          setUser({
            id: "user_123",
            email: "sarah.m@example.com",
            name: "Sarah M.",
            provider: "DeafFirst",
            accessibilityPreferences: {
              aslRequired: true,
              captionsEnabled: true,
              highContrast: true,
              slowPacing: true,
            },
            vocationalProfile: {
              currentStatus: "job-seeking",
              targetIndustry: ["Healthcare", "Technology"],
              accommodationNeeds: ["ASL Interpreter", "Written Communication", "Visual Alerts"],
            },
          })
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      }
    }

    checkAuth()
  }, [])

  const login = async (provider: string) => {
    try {
      // In real implementation, redirect to Google OAuth
      // window.location.href = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&...`

      // Mock successful login
      localStorage.setItem("deafauth_token", "mock_token_123")
      setUser({
        id: "user_123",
        email: "sarah.m@example.com",
        name: "Sarah M.",
        provider: provider as any,
        accessibilityPreferences: {
          aslRequired: true,
          captionsEnabled: true,
          highContrast: true,
          slowPacing: true,
        },
        vocationalProfile: {
          currentStatus: "job-seeking",
          targetIndustry: ["Healthcare", "Technology"],
          accommodationNeeds: ["ASL Interpreter", "Written Communication", "Visual Alerts"],
        },
      })
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  const logout = () => {
    localStorage.removeItem("deafauth_token")
    setUser(null)
    setIsAuthenticated(false)
  }

  const updatePreferences = (preferences: Partial<DeafAuthUser["accessibilityPreferences"]>) => {
    if (user) {
      setUser({
        ...user,
        accessibilityPreferences: {
          ...user.accessibilityPreferences,
          ...preferences,
        },
      })
    }
  }

  return (
    <DeafAuthContext.Provider value={{ user, isAuthenticated, login, logout, updatePreferences }}>
      {children}
    </DeafAuthContext.Provider>
  )
}

export function useDeafAuth() {
  const context = useContext(DeafAuthContext)
  if (context === undefined) {
    throw new Error("useDeafAuth must be used within a DeafAuthProvider")
  }
  return context
}

export function DeafAuthLogin() {
  const { login, isAuthenticated, user } = useDeafAuth()

  if (isAuthenticated && user) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Authenticated
          </CardTitle>
          <CardDescription>Welcome back, {user.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="text-sm">{user.email}</span>
          </div>
          <Badge variant="outline">{user.provider} Provider</Badge>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Accessibility Preferences</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                {user.accessibilityPreferences.aslRequired ? (
                  <CheckCircle className="h-3 w-3 text-green-600" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-gray-400" />
                )}
                <span>ASL Required</span>
              </div>
              <div className="flex items-center gap-1">
                {user.accessibilityPreferences.captionsEnabled ? (
                  <CheckCircle className="h-3 w-3 text-green-600" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-gray-400" />
                )}
                <span>Captions</span>
              </div>
              <div className="flex items-center gap-1">
                {user.accessibilityPreferences.highContrast ? (
                  <CheckCircle className="h-3 w-3 text-green-600" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-gray-400" />
                )}
                <span>High Contrast</span>
              </div>
              <div className="flex items-center gap-1">
                {user.accessibilityPreferences.slowPacing ? (
                  <CheckCircle className="h-3 w-3 text-green-600" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-gray-400" />
                )}
                <span>Slow Pacing</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          DeafAuth Login
        </CardTitle>
        <CardDescription>Secure authentication for deaf and hard-of-hearing users</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Button onClick={() => login("DeafFirst")} className="w-full" variant="default">
            <Shield className="h-4 w-4 mr-2" />
            Login with DeafFirst
          </Button>
          <Button onClick={() => login("FibonRose")} className="w-full" variant="outline">
            <Shield className="h-4 w-4 mr-2" />
            Login with FibonRose Trust
          </Button>
          <Button onClick={() => login("Pinksync")} className="w-full" variant="outline">
            <Shield className="h-4 w-4 mr-2" />
            Login with Pinksync
          </Button>
        </div>
        <div className="text-xs text-gray-600 text-center">
          Powered by Google OAuth 2.0 with accessibility-first design
        </div>
      </CardContent>
    </Card>
  )
}
