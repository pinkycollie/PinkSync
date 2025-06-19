import { SignLanguageService } from "@/lib/sign-language/sign-language-service"
import { mcpClient } from "@/lib/mcp/service-client"

/**
 * Background worker for processing sign language generation requests
 * This can be deployed as a separate service or Cloud Function
 */
export class SignLanguageWorker {
  private service: SignLanguageService
  private isRunning = false
  private processingInterval: NodeJS.Timeout | null = null

  constructor() {
    this.service = new SignLanguageService()
  }

  /**
   * Start the worker
   */
  start(intervalMs = 5000) {
    if (this.isRunning) {
      console.log("Worker is already running")
      return
    }

    this.isRunning = true
    console.log("Starting sign language worker...")

    this.processingInterval = setInterval(async () => {
      try {
        await this.processQueue()
      } catch (error) {
        console.error("Error in worker processing:", error)
      }
    }, intervalMs)
  }

  /**
   * Stop the worker
   */
  stop() {
    if (!this.isRunning) {
      return
    }

    this.isRunning = false

    if (this.processingInterval) {
      clearInterval(this.processingInterval)
      this.processingInterval = null
    }

    console.log("Sign language worker stopped")
  }

  /**
   * Process the queue
   */
  private async processQueue() {
    const maxConcurrent = 3 // Process up to 3 requests concurrently
    const promises: Promise<boolean>[] = []

    for (let i = 0; i < maxConcurrent; i++) {
      promises.push(this.service.processNextRequest())
    }

    const results = await Promise.allSettled(promises)
    const processed = results.filter((result) => result.status === "fulfilled" && result.value === true).length

    if (processed > 0) {
      console.log(`Processed ${processed} sign language requests`)

      // Track worker metrics
      try {
        await mcpClient.trackEvent("sign_language_worker_processed", {
          processedCount: processed,
          timestamp: Date.now(),
        })
      } catch (error) {
        console.warn("Could not track worker metrics:", error)
      }
    }
  }
}

// Export singleton instance
export const signLanguageWorker = new SignLanguageWorker()

// Auto-start in production
if (process.env.NODE_ENV === "production" && process.env.WORKER_ENABLED === "true") {
  signLanguageWorker.start()
}
