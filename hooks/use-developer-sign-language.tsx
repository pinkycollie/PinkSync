"use client"

import { useState, useEffect, useCallback } from "react"
import type {
  DeveloperSignVideo,
  DeveloperSignCategory,
  DeveloperSignTag,
  DeveloperSignSearchParams,
  SignLanguageType,
  ProgrammingCategory,
} from "@/types/developer-sign-language"

export function useDeveloperSignLanguage() {
  const [videos, setVideos] = useState<DeveloperSignVideo[]>([])
  const [categories, setCategories] = useState<DeveloperSignCategory[]>([])
  const [tags, setTags] = useState<DeveloperSignTag[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [totalVideos, setTotalVideos] = useState<number>(0)

  const fetchVideos = useCallback(async (params: DeveloperSignSearchParams = {}) => {
    setLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams()

      if (params.query) queryParams.append("query", params.query)
      if (params.category) queryParams.append("category", params.category.toString())
      if (params.signLanguageType) queryParams.append("signLanguageType", params.signLanguageType)
      if (params.programmingCategory) queryParams.append("programmingCategory", params.programmingCategory)
      if (params.complexity) queryParams.append("complexity", params.complexity)
      if (params.page) queryParams.append("page", params.page.toString())
      if (params.limit) queryParams.append("limit", params.limit.toString())
      if (params.sortBy) queryParams.append("sortBy", params.sortBy)

      if (params.tags && params.tags.length > 0) {
        params.tags.forEach((tag) => queryParams.append("tags", tag.toString()))
      }

      const response = await fetch(`/api/developer-sign-language?${queryParams.toString()}`)

      if (!response.ok) {
        throw new Error(`Error fetching videos: ${response.statusText}`)
      }

      const data = await response.json()
      setVideos(data.videos)
      setTotalVideos(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error fetching videos:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchVideoById = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/developer-sign-language/${id}`)

      if (!response.ok) {
        throw new Error(`Error fetching video: ${response.statusText}`)
      }

      const data = await response.json()
      return data.video as DeveloperSignVideo
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error(`Error fetching video with id ${id}:`, err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/developer-sign-language/categories")

      if (!response.ok) {
        throw new Error(`Error fetching categories: ${response.statusText}`)
      }

      const data = await response.json()
      setCategories(data.categories)
    } catch (err) {
      console.error("Error fetching categories:", err)
    }
  }, [])

  const fetchTags = useCallback(async () => {
    try {
      const response = await fetch("/api/developer-sign-language/tags")

      if (!response.ok) {
        throw new Error(`Error fetching tags: ${response.statusText}`)
      }

      const data = await response.json()
      setTags(data.tags)
    } catch (err) {
      console.error("Error fetching tags:", err)
    }
  }, [])

  const uploadVideo = useCallback(
    async (
      videoFile: File,
      thumbnailFile: File | null,
      metadata: {
        title: string
        description: string
        categoryId: number
        signLanguageType: SignLanguageType
        tags: string[]
        programmingCategory?: ProgrammingCategory
        complexity?: "Beginner" | "Intermediate" | "Advanced"
        language?: string
        uploadedBy?: string
        isPublic?: boolean
      },
    ) => {
      setLoading(true)
      setError(null)

      try {
        // Create form data
        const formData = new FormData()
        formData.append("video", videoFile)

        if (thumbnailFile) {
          formData.append("thumbnail", thumbnailFile)
        }

        // Add metadata
        Object.entries(metadata).forEach(([key, value]) => {
          if (value !== undefined) {
            if (Array.isArray(value)) {
              value.forEach((item) => formData.append(`${key}[]`, item))
            } else {
              formData.append(key, value.toString())
            }
          }
        })

        const response = await fetch("/api/developer-sign-language", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Error uploading video: ${response.statusText}`)
        }

        const data = await response.json()
        return data.video as DeveloperSignVideo
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        console.error("Error uploading video:", err)
        return null
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const updateVideo = useCallback(
    async (
      id: number,
      updates: Partial<{
        title: string
        description: string
        categoryId: number
        signLanguageType: SignLanguageType
        tags: string[]
        programmingCategory?: ProgrammingCategory
        complexity?: "Beginner" | "Intermediate" | "Advanced"
        language?: string
        isPublic?: boolean
      }>,
    ) => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/developer-sign-language/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        })

        if (!response.ok) {
          throw new Error(`Error updating video: ${response.statusText}`)
        }

        const data = await response.json()
        return data.video as DeveloperSignVideo
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        console.error(`Error updating video with id ${id}:`, err)
        return null
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const deleteVideo = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/developer-sign-language/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Error deleting video: ${response.statusText}`)
      }

      const data = await response.json()
      return data.success
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error(`Error deleting video with id ${id}:`, err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const incrementViewCount = useCallback(async (id: number) => {
    try {
      await fetch(`/api/developer-sign-language/${id}/view`, {
        method: "POST",
      })
    } catch (err) {
      console.error(`Error incrementing view count for video with id ${id}:`, err)
    }
  }, [])

  const incrementDownloadCount = useCallback(async (id: number) => {
    try {
      await fetch(`/api/developer-sign-language/${id}/download`, {
        method: "POST",
      })
    } catch (err) {
      console.error(`Error incrementing download count for video with id ${id}:`, err)
    }
  }, [])

  const fetchPopularVideos = useCallback(async (limit = 10) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/developer-sign-language/popular?limit=${limit}`)

      if (!response.ok) {
        throw new Error(`Error fetching popular videos: ${response.statusText}`)
      }

      const data = await response.json()
      return data.videos as DeveloperSignVideo[]
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error fetching popular videos:", err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchRecentVideos = useCallback(async (limit = 10) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/developer-sign-language/recent?limit=${limit}`)

      if (!response.ok) {
        throw new Error(`Error fetching recent videos: ${response.statusText}`)
      }

      const data = await response.json()
      return data.videos as DeveloperSignVideo[]
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error fetching recent videos:", err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchVideosByCategory = useCallback(async (categoryId: number, limit = 20) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/developer-sign-language/category/${categoryId}?limit=${limit}`)

      if (!response.ok) {
        throw new Error(`Error fetching videos by category: ${response.statusText}`)
      }

      const data = await response.json()
      return data.videos as DeveloperSignVideo[]
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error(`Error fetching videos for category ${categoryId}:`, err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchVideosByTag = useCallback(async (tagName: string, limit = 20) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/developer-sign-language/tag/${encodeURIComponent(tagName)}?limit=${limit}`)

      if (!response.ok) {
        throw new Error(`Error fetching videos by tag: ${response.statusText}`)
      }

      const data = await response.json()
      return data.videos as DeveloperSignVideo[]
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error(`Error fetching videos for tag ${tagName}:`, err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
    fetchTags()
  }, [fetchCategories, fetchTags])

  return {
    videos,
    categories,
    tags,
    loading,
    error,
    totalVideos,
    fetchVideos,
    fetchVideoById,
    fetchCategories,
    fetchTags,
    uploadVideo,
    updateVideo,
    deleteVideo,
    incrementViewCount,
    incrementDownloadCount,
    fetchPopularVideos,
    fetchRecentVideos,
    fetchVideosByCategory,
    fetchVideosByTag,
  }
}
