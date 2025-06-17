import { Redis } from "@upstash/redis"
import type { User, Video, UserPreferences, TrustBadge } from "@/lib/api/types"

// Redis client configuration with your Upstash instance
export const redis = new Redis({
  url:
    process.env.REDIS_URL ||
    "redis://default:Ab1pAAIjcDExNjIxMTZhN2NiYjY0M2I0YjJmYmY1Y2I4ZDgxMzBmOHAxMA@bright-shiner-48489.upstash.io:6379",
  token: process.env.REDIS_TOKEN || process.env.KV_REST_API_TOKEN,
})

// Test Redis connection
export async function testRedisConnection(): Promise<boolean> {
  try {
    await redis.ping()
    console.log("✅ Redis connection successful")
    return true
  } catch (error) {
    console.error("❌ Redis connection failed:", error)
    return false
  }
}

// Cache key generators
export const CacheKeys = {
  user: (userId: string) => `user:${userId}`,
  userPreferences: (userId: string) => `user:${userId}:preferences`,
  userSession: (sessionId: string) => `session:${sessionId}`,
  video: (videoId: string) => `video:${videoId}`,
  videoMetadata: (videoId: string) => `video:${videoId}:metadata`,
  videoProcessing: (videoId: string) => `video:${videoId}:processing`,
  userVideos: (userId: string) => `user:${userId}:videos`,
  trustScore: (userId: string) => `trust:${userId}:score`,
  trustBadges: (userId: string) => `trust:${userId}:badges`,
  notifications: (userId: string) => `notifications:${userId}`,
  apiRateLimit: (userId: string, endpoint: string) => `rate:${userId}:${endpoint}`,
  onlineUsers: () => "users:online",
  videoViews: (videoId: string) => `video:${videoId}:views`,
  searchResults: (query: string) => `search:${Buffer.from(query).toString("base64")}`,
}

// Cache TTL constants (in seconds)
export const CacheTTL = {
  USER_DATA: 3600, // 1 hour
  USER_PREFERENCES: 7200, // 2 hours
  SESSION: 86400, // 24 hours
  VIDEO_METADATA: 1800, // 30 minutes
  VIDEO_PROCESSING: 300, // 5 minutes
  TRUST_SCORE: 3600, // 1 hour
  NOTIFICATIONS: 600, // 10 minutes
  SEARCH_RESULTS: 900, // 15 minutes
  RATE_LIMIT: 60, // 1 minute
}

// User caching functions
export class UserCache {
  static async get(userId: string): Promise<User | null> {
    try {
      const cached = await redis.get(CacheKeys.user(userId))
      return cached as User | null
    } catch (error) {
      console.error("Redis get user error:", error)
      return null
    }
  }

  static async set(userId: string, user: User, ttl = CacheTTL.USER_DATA): Promise<void> {
    try {
      await redis.setex(CacheKeys.user(userId), ttl, JSON.stringify(user))
    } catch (error) {
      console.error("Redis set user error:", error)
    }
  }

  static async delete(userId: string): Promise<void> {
    try {
      await redis.del(CacheKeys.user(userId))
    } catch (error) {
      console.error("Redis delete user error:", error)
    }
  }

  static async getPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      const cached = await redis.get(CacheKeys.userPreferences(userId))
      return cached as UserPreferences | null
    } catch (error) {
      console.error("Redis get preferences error:", error)
      return null
    }
  }

  static async setPreferences(userId: string, preferences: UserPreferences): Promise<void> {
    try {
      await redis.setex(CacheKeys.userPreferences(userId), CacheTTL.USER_PREFERENCES, JSON.stringify(preferences))
    } catch (error) {
      console.error("Redis set preferences error:", error)
    }
  }
}

// Video caching functions
export class VideoCache {
  static async get(videoId: string): Promise<Video | null> {
    try {
      const cached = await redis.get(CacheKeys.video(videoId))
      return cached as Video | null
    } catch (error) {
      console.error("Redis get video error:", error)
      return null
    }
  }

  static async set(videoId: string, video: Video): Promise<void> {
    try {
      await redis.setex(CacheKeys.video(videoId), CacheTTL.VIDEO_METADATA, JSON.stringify(video))
    } catch (error) {
      console.error("Redis set video error:", error)
    }
  }

  static async getMetadata(videoId: string): Promise<Record<string, any> | null> {
    try {
      const cached = await redis.get(CacheKeys.videoMetadata(videoId))
      return cached as Record<string, any> | null
    } catch (error) {
      console.error("Redis get video metadata error:", error)
      return null
    }
  }

  static async setMetadata(videoId: string, metadata: Record<string, any>): Promise<void> {
    try {
      await redis.setex(CacheKeys.videoMetadata(videoId), CacheTTL.VIDEO_METADATA, JSON.stringify(metadata))
    } catch (error) {
      console.error("Redis set video metadata error:", error)
    }
  }

  static async getProcessingStatus(videoId: string): Promise<{
    status: string
    progress: number
    error?: string
  } | null> {
    try {
      const cached = await redis.get(CacheKeys.videoProcessing(videoId))
      return cached as any
    } catch (error) {
      console.error("Redis get processing status error:", error)
      return null
    }
  }

  static async setProcessingStatus(videoId: string, status: string, progress: number, error?: string): Promise<void> {
    try {
      const data = { status, progress, error, updated_at: new Date().toISOString() }
      await redis.setex(CacheKeys.videoProcessing(videoId), CacheTTL.VIDEO_PROCESSING, JSON.stringify(data))
    } catch (error) {
      console.error("Redis set processing status error:", error)
    }
  }

  static async getUserVideos(userId: string): Promise<string[] | null> {
    try {
      const cached = await redis.get(CacheKeys.userVideos(userId))
      return cached as string[] | null
    } catch (error) {
      console.error("Redis get user videos error:", error)
      return null
    }
  }

  static async addUserVideo(userId: string, videoId: string): Promise<void> {
    try {
      await redis.sadd(CacheKeys.userVideos(userId), videoId)
      await redis.expire(CacheKeys.userVideos(userId), CacheTTL.VIDEO_METADATA)
    } catch (error) {
      console.error("Redis add user video error:", error)
    }
  }

  static async incrementViews(videoId: string): Promise<number> {
    try {
      return await redis.incr(CacheKeys.videoViews(videoId))
    } catch (error) {
      console.error("Redis increment views error:", error)
      return 0
    }
  }

  static async getViews(videoId: string): Promise<number> {
    try {
      const views = await redis.get(CacheKeys.videoViews(videoId))
      return Number(views) || 0
    } catch (error) {
      console.error("Redis get views error:", error)
      return 0
    }
  }
}

// Trust/Verification caching
export class TrustCache {
  static async getScore(userId: string): Promise<{
    score: number
    badges: TrustBadge[]
    verified: boolean
  } | null> {
    try {
      const cached = await redis.get(CacheKeys.trustScore(userId))
      return cached as any
    } catch (error) {
      console.error("Redis get trust score error:", error)
      return null
    }
  }

  static async setScore(userId: string, score: number, badges: TrustBadge[], verified: boolean): Promise<void> {
    try {
      const data = { score, badges, verified, updated_at: new Date().toISOString() }
      await redis.setex(CacheKeys.trustScore(userId), CacheTTL.TRUST_SCORE, JSON.stringify(data))
    } catch (error) {
      console.error("Redis set trust score error:", error)
    }
  }

  static async invalidateScore(userId: string): Promise<void> {
    try {
      await redis.del(CacheKeys.trustScore(userId))
    } catch (error) {
      console.error("Redis invalidate trust score error:", error)
    }
  }
}

// Session management
export class SessionCache {
  static async get(sessionId: string): Promise<{
    userId: string
    expires: string
    data?: Record<string, any>
  } | null> {
    try {
      const cached = await redis.get(CacheKeys.userSession(sessionId))
      return cached as any
    } catch (error) {
      console.error("Redis get session error:", error)
      return null
    }
  }

  static async set(sessionId: string, userId: string, expires: string, data?: Record<string, any>): Promise<void> {
    try {
      const sessionData = { userId, expires, data, created_at: new Date().toISOString() }
      await redis.setex(CacheKeys.userSession(sessionId), CacheTTL.SESSION, JSON.stringify(sessionData))
    } catch (error) {
      console.error("Redis set session error:", error)
    }
  }

  static async delete(sessionId: string): Promise<void> {
    try {
      await redis.del(CacheKeys.userSession(sessionId))
    } catch (error) {
      console.error("Redis delete session error:", error)
    }
  }
}

// Rate limiting
export class RateLimitCache {
  static async checkLimit(
    userId: string,
    endpoint: string,
    limit: number,
    window = 60,
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    try {
      const key = CacheKeys.apiRateLimit(userId, endpoint)
      const current = await redis.incr(key)

      if (current === 1) {
        await redis.expire(key, window)
      }

      const ttl = await redis.ttl(key)
      const resetTime = Date.now() + ttl * 1000

      return {
        allowed: current <= limit,
        remaining: Math.max(0, limit - current),
        resetTime,
      }
    } catch (error) {
      console.error("Redis rate limit error:", error)
      return { allowed: true, remaining: limit, resetTime: Date.now() + window * 1000 }
    }
  }
}

// Real-time features
export class RealtimeCache {
  static async addOnlineUser(userId: string): Promise<void> {
    try {
      await redis.sadd(CacheKeys.onlineUsers(), userId)
      await redis.expire(CacheKeys.onlineUsers(), 300) // 5 minutes
    } catch (error) {
      console.error("Redis add online user error:", error)
    }
  }

  static async removeOnlineUser(userId: string): Promise<void> {
    try {
      await redis.srem(CacheKeys.onlineUsers(), userId)
    } catch (error) {
      console.error("Redis remove online user error:", error)
    }
  }

  static async getOnlineUsers(): Promise<string[]> {
    try {
      return await redis.smembers(CacheKeys.onlineUsers())
    } catch (error) {
      console.error("Redis get online users error:", error)
      return []
    }
  }

  static async getOnlineCount(): Promise<number> {
    try {
      return await redis.scard(CacheKeys.onlineUsers())
    } catch (error) {
      console.error("Redis get online count error:", error)
      return 0
    }
  }
}

// Search caching
export class SearchCache {
  static async get(query: string): Promise<any[] | null> {
    try {
      const cached = await redis.get(CacheKeys.searchResults(query))
      return cached as any[] | null
    } catch (error) {
      console.error("Redis get search results error:", error)
      return null
    }
  }

  static async set(query: string, results: any[]): Promise<void> {
    try {
      await redis.setex(CacheKeys.searchResults(query), CacheTTL.SEARCH_RESULTS, JSON.stringify(results))
    } catch (error) {
      console.error("Redis set search results error:", error)
    }
  }
}

// Notification caching
export class NotificationCache {
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const count = await redis.get(`${CacheKeys.notifications(userId)}:unread`)
      return Number(count) || 0
    } catch (error) {
      console.error("Redis get unread count error:", error)
      return 0
    }
  }

  static async setUnreadCount(userId: string, count: number): Promise<void> {
    try {
      await redis.setex(`${CacheKeys.notifications(userId)}:unread`, CacheTTL.NOTIFICATIONS, count)
    } catch (error) {
      console.error("Redis set unread count error:", error)
    }
  }

  static async incrementUnread(userId: string): Promise<number> {
    try {
      const key = `${CacheKeys.notifications(userId)}:unread`
      const count = await redis.incr(key)
      await redis.expire(key, CacheTTL.NOTIFICATIONS)
      return count
    } catch (error) {
      console.error("Redis increment unread error:", error)
      return 0
    }
  }
}
