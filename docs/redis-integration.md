# Redis Integration for PINKSYNC Platform

## Overview

Redis is integrated into the PINKSYNC platform to provide high-performance caching, session management, and real-time features. This integration significantly improves response times and reduces database load.

## Architecture

### Cache Layers

1. **User Data Cache**
   - User profiles and preferences
   - Session management
   - Authentication tokens

2. **Video Metadata Cache**
   - Video information and processing status
   - View counts and analytics
   - User video collections

3. **Trust & Verification Cache**
   - Credibility scores and badges
   - Verification status
   - Trust metrics

4. **Real-time Features**
   - Online user tracking
   - Live notifications
   - Processing status updates

## Setup

### Using Upstash (Recommended)

\`\`\`bash
# Install Upstash Redis client
npm install @upstash/redis

# Set environment variables
UPSTASH_REDIS_REST_URL="https://your-redis-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"
\`\`\`

### Using Local Redis

\`\`\`bash
# Install Redis locally
brew install redis  # macOS
sudo apt install redis-server  # Ubuntu

# Start Redis server
redis-server

# Install Redis client
npm install redis
\`\`\`

## Usage Examples

### User Data Caching

\`\`\`typescript
import { UserCache } from '@/lib/redis/client'

// Cache user data
await UserCache.set(userId, userData)

// Retrieve cached user
const user = await UserCache.get(userId)

// Cache user preferences
await UserCache.setPreferences(userId, preferences)
\`\`\`

### Video Metadata Caching

\`\`\`typescript
import { VideoCache } from '@/lib/redis/client'

// Cache video with metadata
await VideoCache.set(videoId, videoData)
await VideoCache.setMetadata(videoId, {
  duration: 120,
  resolution: '1080p',
  sign_language: 'asl',
  captions_available: true
})

// Get video with all cached data
const videoData = await enhancedPinkSyncAPI.getVideoWithMetadata(videoId)
\`\`\`

### Real-time Features

\`\`\`typescript
import { RealtimeCache } from '@/lib/redis/client'

// Track online users
await RealtimeCache.addOnlineUser(userId)
const onlineCount = await RealtimeCache.getOnlineCount()

// Video processing updates
await VideoCache.setProcessingStatus(videoId, 'processing', 45)
\`\`\`

## Cache Strategies

### Cache-Aside Pattern

\`\`\`typescript
async function getUser(userId: string) {
  // Try cache first
  let user = await UserCache.get(userId)
  
  if (!user) {
    // Cache miss - fetch from database
    user = await database.users.findById(userId)
    
    if (user) {
      // Store in cache for next time
      await UserCache.set(userId, user)
    }
  }
  
  return user
}
\`\`\`

### Write-Through Pattern

\`\`\`typescript
async function updateUser(userId: string, updates: Partial<User>) {
  // Update database
  const user = await database.users.update(userId, updates)
  
  // Update cache immediately
  await UserCache.set(userId, user)
  
  return user
}
\`\`\`

### Cache Invalidation

\`\`\`typescript
async function deleteUser(userId: string) {
  // Delete from database
  await database.users.delete(userId)
  
  // Invalidate cache
  await UserCache.delete(userId)
  await TrustCache.invalidateScore(userId)
}
\`\`\`

## Performance Optimizations

### Batch Operations

\`\`\`typescript
// Batch get multiple videos
const videos = await enhancedPinkSyncAPI.batchGetVideos([
  'video1', 'video2', 'video3'
])
\`\`\`

### Pipeline Operations

\`\`\`typescript
import { redis } from '@/lib/redis/client'

// Use Redis pipeline for multiple operations
const pipeline = redis.pipeline()
pipeline.get('key1')
pipeline.get('key2')
pipeline.incr('counter')
const results = await pipeline.exec()
\`\`\`

## Monitoring and Analytics

### Cache Hit Rates

\`\`\`typescript
class CacheMetrics {
  static async trackHit(cacheType: string) {
    await redis.incr(`cache:hits:${cacheType}`)
  }
  
  static async trackMiss(cacheType: string) {
    await redis.incr(`cache:misses:${cacheType}`)
  }
  
  static async getHitRate(cacheType: string) {
    const hits = await redis.get(`cache:hits:${cacheType}`) || 0
    const misses = await redis.get(`cache:misses:${cacheType}`) || 0
    const total = Number(hits) + Number(misses)
    
    return total > 0 ? Number(hits) / total : 0
  }
}
\`\`\`

### Memory Usage

\`\`\`typescript
// Monitor Redis memory usage
const info = await redis.info('memory')
console.log('Redis memory usage:', info)
\`\`\`

## Best Practices

### 1. TTL Management

\`\`\`typescript
// Set appropriate TTLs for different data types
const CacheTTL = {
  USER_DATA: 3600,        // 1 hour - frequently accessed
  VIDEO_METADATA: 1800,   // 30 minutes - can change
  TRUST_SCORE: 3600,      // 1 hour - relatively stable
  SEARCH_RESULTS: 900,    // 15 minutes - can become stale
}
\`\`\`

### 2. Key Naming Convention

\`\`\`typescript
// Use consistent, hierarchical key naming
const keys = {
  user: (id: string) => `user:${id}`,
  userVideos: (id: string) => `user:${id}:videos`,
  videoMetadata: (id: string) => `video:${id}:metadata`,
}
\`\`\`

### 3. Error Handling

\`\`\`typescript
async function safeGet<T>(key: string): Promise<T | null> {
  try {
    return await redis.get(key)
  } catch (error) {
    console.error('Redis error:', error)
    // Fallback to database or return null
    return null
  }
}
\`\`\`

### 4. Cache Warming

\`\`\`typescript
// Pre-populate cache with frequently accessed data
async function warmCache() {
  const popularVideos = await database.videos.findPopular(100)
  
  for (const video of popularVideos) {
    await VideoCache.set(video.id, video)
  }
}
\`\`\`

## Deployment Considerations

### Production Setup

\`\`\`yaml
# docker-compose.yml for local development
version: '3.8'
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

volumes:
  redis_data:
\`\`\`

### Scaling

- Use Redis Cluster for horizontal scaling
- Implement read replicas for read-heavy workloads
- Consider Redis Sentinel for high availability

### Security

\`\`\`bash
# Enable authentication
redis-server --requirepass your-secure-password

# Use TLS for production
redis-server --tls-port 6380 --port 0
\`\`\`
