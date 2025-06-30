import { kv } from "@vercel/kv"
import { createClient } from "@/lib/supabase/server"

interface QueueItem {
  requestId: string
  text: string
  signLanguage: string
  targetLanguage: string
  avatarStyle: string
  quality: string
  userId?: string
  timestamp: number
}

export class SignLanguageWorker {
  private supabase = createClient()
  private isProcessing = false

  async processQueue() {
    if (this.isProcessing) {
      console.log("Worker already processing, skipping...")
      return
    }

    this.isProcessing = true

    try {
      while (true) {
        // Get next item from queue
        const queueItem = await kv.rpop("pinksync:sign_language_queue")

        if (!queueItem) {
          console.log("No items in queue, stopping worker")
          break
        }

        let item: QueueItem
        try {
          item = JSON.parse(queueItem as string)
        } catch (parseError) {
          console.error("Error parsing queue item:", parseError)
          continue
        }

        console.log(`Processing sign language request: ${item.requestId}`)

        try {
          await this.processSignLanguageRequest(item)
        } catch (error) {
          console.error(`Error processing request ${item.requestId}:`, error)
          await this.markRequestAsError(item.requestId, error.message)
        }
      }
    } finally {
      this.isProcessing = false
    }
  }

  private async processSignLanguageRequest(item: QueueItem) {
    const { requestId, text, signLanguage, avatarStyle, quality } = item

    // Update status to processing
    await kv.hset(`pinksync:sign_language:status:${requestId}`, {
      status: "processing",
      progress: 10,
    })

    // Update database status
    await this.supabase.from("videos").update({ status: "processing" }).eq("id", requestId)

    // Simulate AI processing steps
    await this.updateProgress(requestId, 25, "Analyzing text...")
    await this.sleep(2000)

    await this.updateProgress(requestId, 50, "Generating sign language sequence...")
    await this.sleep(3000)

    await this.updateProgress(requestId, 75, "Rendering avatar...")
    await this.sleep(4000)

    await this.updateProgress(requestId, 90, "Finalizing video...")
    await this.sleep(2000)

    // Generate mock video URLs (in production, these would be real URLs)
    const videoUrl = `https://storage.googleapis.com/pinksync-videos/${requestId}.mp4`
    const thumbnailUrl = `https://storage.googleapis.com/pinksync-videos/${requestId}_thumb.jpg`

    // Update final status
    await kv.hset(`pinksync:sign_language:status:${requestId}`, {
      status: "completed",
      progress: 100,
      videoUrl,
      thumbnailUrl,
    })

    // Update database with final URLs
    await this.supabase
      .from("videos")
      .update({
        status: "ready",
        url: videoUrl,
        thumbnail_url: thumbnailUrl,
        duration: Math.floor(text.length / 10), // Rough estimate
      })
      .eq("id", requestId)

    // Cache the result for future requests
    const cacheKey = this.getCacheKey(text, signLanguage)
    await kv.setex(
      cacheKey,
      60 * 60 * 24 * 7,
      JSON.stringify({
        // 7 days
        videoUrl,
        thumbnailUrl,
      }),
    )

    console.log(`Completed processing request: ${requestId}`)
  }

  private async updateProgress(requestId: string, progress: number, message?: string) {
    await kv.hset(`pinksync:sign_language:status:${requestId}`, {
      progress,
      message: message || "",
    })
  }

  private async markRequestAsError(requestId: string, errorMessage: string) {
    await kv.hset(`pinksync:sign_language:status:${requestId}`, {
      status: "error",
      error: errorMessage,
    })

    await this.supabase.from("videos").update({ status: "error" }).eq("id", requestId)
  }

  private getCacheKey(text: string, signLanguage: string): string {
    const textHash = Buffer.from(text).toString("base64").substring(0, 20)
    return `pinksync:sign_language:cache:${textHash}:${signLanguage}`
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export const signLanguageWorker = new SignLanguageWorker()
