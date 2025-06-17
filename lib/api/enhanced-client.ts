// Enhanced API client with Redis caching integration
import { pinkSyncAPI } from "./client"
import { UserCache, VideoCache, TrustCache, RateLimitCache, SearchCache, NotificationCache } from "@/lib/redis/client"
import type { User, Video } from "./types"

export class EnhancedPinkSyncAPI {
  private baseAPI = pinkSyncAPI

  constructor() {
    // Inherit token from base API
    this.baseAPI = pinkSyncAPI
  }

  setToken(token: string) {
    this.baseAPI.setToken(token)
  }

  // Enhanced user methods with caching
  async getCurrentUser(useCache = true): Promise<User | null> {
    if (useCache) {
      // Try to get from cache first
      const cached = await UserCache.get("current") // We'll need to store current user ID
      if (cached) return cached
    }

    const response = await this.baseAPI.getCurrentUser()
    if (response.status === "success") {
      // Cache the user data
      await UserCache.set(response.data.id, response.data)
      return response.data
    }
    return null
  }

  async updateCurrentUser(updates: Partial<Pick<User, "name" | "email" | "preferences">>) {
    const response = await this.baseAPI.updateCurrentUser(updates)

    if (response.status === "success") {
      // Update cache
      await UserCache.set(response.data.id, response.data)

      // Update preferences cache if preferences were updated
      if (updates.preferences) {
        await UserCache.setPreferences(response.data.id, updates.preferences)
      }
    }

    return response
  }

  // Enhanced video methods with metadata caching
  async uploadVideo(formData: FormData) {
    const response = await this.baseAPI.uploadVideo(formData)

    if (response.status === "success") {
      const video = response.data

      // Cache video data
      await VideoCache.set(video.id, video)

      // Add to user's video list
      await VideoCache.addUserVideo(video.user_id, video.id)

      // Initialize processing status
      await VideoCache.setProcessingStatus(video.id, "uploading", 0)
    }

    return response
  }

  async getVideo(videoId: string, useCache = true): Promise<Video | null> {
    if (useCache) {
      const cached = await VideoCache.get(videoId)
      if (cached) {
        // Increment view count
        await VideoCache.incrementViews(videoId)
        return cached
      }
    }

    const response = await this.baseAPI.getVideo(videoId)
    if (response.status === "success") {
      await VideoCache.set(videoId, response.data)
      await VideoCache.incrementViews(videoId)
      return response.data
    }
    return null
  }

  async getVideoWithMetadata(videoId: string): Promise<{
    video: Video
    metadata: Record<string, any>
    views: number
    processingStatus?: any
  } | null> {
    const video = await this.getVideo(videoId)
    if (!video) return null

    const [metadata, views, processingStatus] = await Promise.all([
      VideoCache.getMetadata(videoId),
      VideoCache.getViews(videoId),
      VideoCache.getProcessingStatus(videoId),
    ])

    return {
      video,
      metadata: metadata || {},
      views,
      processingStatus,
    }
  }

  async updateVideoMetadata(videoId: string, metadata: Record<string, any>) {
    // Update metadata in cache
    await VideoCache.setMetadata(videoId, metadata)

    // Also update the video cache to include new metadata
    const video = await VideoCache.get(videoId)
    if (video) {
      video.metadata = { ...video.metadata, ...metadata }
      await VideoCache.set(videoId, video)
    }
  }

  // Enhanced trust methods with caching
  async getCredibilityScore(userId?: string, useCache = true) {
    const targetUserId = userId || "current" // We'll need to handle current user ID

    if (useCache) {
      const cached = await TrustCache.getScore(targetUserId)
      if (cached) return { status: "success", data: cached }
    }

    const response = await this.baseAPI.getCredibilityScore(userId)
    if (response.status === "success") {
      const { score, badges, verified } = response.data
      await TrustCache.setScore(targetUserId, score, badges, verified)
    }

    return response
  }

  // Rate limiting integration
  async checkRateLimit(endpoint: string, limit: number): Promise<boolean> {
    const userId = "current" // We'll need to get current user ID
    const result = await RateLimitCache.checkLimit(userId, endpoint, limit)
    return result.allowed
  }

  // Search with caching
  async searchVideos(query: string, useCache = true): Promise<Video[]> {
    if (useCache) {
      const cached = await SearchCache.get(query)
      if (cached) return cached
    }

    // This would be a new endpoint in your API
    const response = await fetch(`/api/search/videos?q=${encodeURIComponent(query)}`)
    const results = await response.json()

    if (results.status === "success") {
      await SearchCache.set(query, results.data)
      return results.data
    }

    return []
  }

  // Notification methods with caching
  async getUnreadNotificationCount(): Promise<number> {
    const userId = "current" // We'll need to get current user ID
    return await NotificationCache.getUnreadCount(userId)
  }

  async markNotificationRead(notificationId: string) {
    const response = await this.baseAPI.markNotificationRead(notificationId)

    if (response.status === "success") {
      // Decrement unread count
      const userId = "current" // We'll need to get current user ID
      const currentCount = await NotificationCache.getUnreadCount(userId)
      await NotificationCache.setUnreadCount(userId, Math.max(0, currentCount - 1))
    }

    return response
  }

  // Batch operations for efficiency
  async batchGetVideos(videoIds: string[]): Promise<Record<string, Video>> {
    const results: Record<string, Video> = {}
    const uncachedIds: string[] = []

    // Check cache for each video
    for (const id of videoIds) {
      const cached = await VideoCache.get(id)
      if (cached) {
        results[id] = cached
      } else {
        uncachedIds.push(id)
      }
    }

    // Fetch uncached videos from API
    if (uncachedIds.length > 0) {
      // This would be a new batch endpoint
      const response = await fetch("/api/videos/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: uncachedIds }),
      })

      const batchResults = await response.json()
      if (batchResults.status === "success") {
        for (const video of batchResults.data) {
          results[video.id] = video
          await VideoCache.set(video.id, video)
        }
      }
    }

    return results
  }

  // Cache invalidation methods
  async invalidateUserCache(userId: string) {
    await UserCache.delete(userId)
  }

  async invalidateVideoCache(videoId: string) {
    await VideoCache.set(videoId, null as any) // This will effectively delete
  }

  async invalidateTrustCache(userId: string) {
    await TrustCache.invalidateScore(userId)
  }

  // Analytics and insights from cached data
  async getVideoAnalytics(videoId: string) {
    const views = await VideoCache.getViews(videoId)
    const metadata = await VideoCache.getMetadata(videoId)

    return {
      views,
      metadata,
      // Add more analytics data as needed
    }
  }
}

// Export enhanced singleton
export const enhancedPinkSyncAPI = new EnhancedPinkSyncAPI()
