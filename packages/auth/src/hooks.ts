"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { User, AuthError } from "./types"

interface UseAuthReturn {
  user: User | null
  loading: boolean
  error: AuthError | null
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (userData: {
    email: string
    password: string
    name: string
    preferredSignLanguage?: "ASL" | "BSL" | "ISL" | "Other"
    requiresVisualFeedback?: boolean
  }) => Promise<boolean>
  signOut: () => Promise<boolean>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<AuthError | null>(null)
  const router = useRouter()

  // Fetch the current user
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/auth/user")

      if (!response.ok) {
        setUser(null)
        return
      }

      const data = await response.json()
      setUser(data.user)
    } catch (err) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // Sign in
  const signIn = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/auth/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || { code: "unknown", message: "An error occurred" })
          return false
        }

        setUser(data.user)
        router.refresh()
        return true
      } catch (err) {
        setError({ code: "unknown", message: "An unexpected error occurred" })
        return false
      } finally {
        setLoading(false)
      }
    },
    [router],
  )

  // Sign up
  const signUp = useCallback(
    async (userData: {
      email: string
      password: string
      name: string
      preferredSignLanguage?: "ASL" | "BSL" | "ISL" | "Other"
      requiresVisualFeedback?: boolean
    }): Promise<boolean> => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || { code: "unknown", message: "An error occurred" })
          return false
        }

        setUser(data.user)
        router.refresh()
        return true
      } catch (err) {
        setError({ code: "unknown", message: "An unexpected error occurred" })
        return false
      } finally {
        setLoading(false)
      }
    },
    [router],
  )

  // Sign out
  const signOut = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true)

      const response = await fetch("/api/auth/signout", {
        method: "POST",
      })

      if (!response.ok) {
        return false
      }

      setUser(null)
      router.refresh()
      return true
    } catch (err) {
      return false
    } finally {
      setLoading(false)
    }
  }, [router])

  // Fetch the user on mount
  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
  }
}
