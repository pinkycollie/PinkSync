"use client"

import { useState, useEffect, useCallback } from "react"

interface UsePinkSyncDataOptions {
  autoRefresh?: boolean
  refreshInterval?: number
}

export function usePinkSyncData(options: UsePinkSyncDataOptions = {}) {
  const { autoRefresh = false, refreshInterval = 30000 } = options
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Process QR Code
  const processQRCode = useCallback(async (qrCodeData: string, sessionId?: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/scanqr/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ qrCodeData, sessionId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to process QR code")
      }

      return data.content
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Get library content
  const getLibraryContent = useCallback(async (category?: string, search?: string) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (category) params.append("category", category)
      if (search) params.append("search", search)

      const response = await fetch(`/api/scanqr/library?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch library content")
      }

      return data.content
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Get specific content item
  const getContentItem = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/scanqr/library/${id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch content item")
      }

      return { content: data.content, analytics: data.analytics }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Sync updates
  const syncUpdates = useCallback(async (lastSync?: string) => {
    try {
      const params = new URLSearchParams()
      if (lastSync) params.append("lastSync", lastSync)

      const response = await fetch(`/api/scanqr/sync?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to sync updates")
      }

      return data
    } catch (err) {
      console.error("Error syncing updates:", err)
      return null
    }
  }, [])

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(async () => {
      await syncUpdates()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, syncUpdates])

  return {
    loading,
    error,
    processQRCode,
    getLibraryContent,
    getContentItem,
    syncUpdates,
  }
}
