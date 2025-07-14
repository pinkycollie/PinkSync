/**
 * PinkSync Video Preloader Service
 * Optimizes video loading performance by preloading videos based on content priority
 */

import type { VideoSourceConfig } from "@/lib/types/pink-sync"

// Default video source configuration
const defaultVideoSourceConfig: VideoSourceConfig = {
  baseUrl: "/videos",
  humanSignerPath: "human",
  avatarPath: "avatar",
  fileExtension: "mp4",
  fallbackPath: "fallback",
}

interface PreloadOptions {
  priority?: number // 1-5, higher means preload sooner
  quality?: "low" | "medium" | "high"
  signModel?: "human" | "avatar"
}

class PinkSyncPreloader {
  private videoSourceConfig: VideoSourceConfig
  private preloadedVideos: Set<string> = new Set()
  private preloadQueue: Array<{ url: string; priority: number }> = []
  private isProcessingQueue = false
  private maxConcurrentLoads = 3
  private currentLoads = 0

  constructor(config: Partial<VideoSourceConfig> = {}) {
    this.videoSourceConfig = { ...defaultVideoSourceConfig, ...config }
  }

  /**
   * Generate a video URL based on text content and options
   */
  public getVideoUrl(text: string, options: PreloadOptions = {}): string {
    const { quality = "medium", signModel = "human" } = options

    // Hash the text to get a consistent number
    const hash = text.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 10

    // Use different videos based on the sign model preference
    const modelPath = signModel === "human" ? this.videoSourceConfig.humanSignerPath : this.videoSourceConfig.avatarPath
    const qualityPath = quality === "high" ? "hd" : quality === "medium" ? "md" : "ld"

    return `${this.videoSourceConfig.baseUrl}/${modelPath}/${qualityPath}/sign-language-${hash + 1}.${this.videoSourceConfig.fileExtension}`
  }

  /**
   * Preload a video for future use
   */
  public preloadVideo(text: string, options: PreloadOptions = {}): void {
    const { priority = 3 } = options
    const url = this.getVideoUrl(text, options)

    // Skip if already preloaded
    if (this.preloadedVideos.has(url)) return

    // Add to preload queue with priority
    this.preloadQueue.push({ url, priority })

    // Sort queue by priority (higher first)
    this.preloadQueue.sort((a, b) => b.priority - a.priority)

    // Start processing the queue if not already processing
    if (!this.isProcessingQueue) {
      this.processPreloadQueue()
    }
  }

  /**
   * Process the preload queue
   */
  private processPreloadQueue(): void {
    if (this.preloadQueue.length === 0) {
      this.isProcessingQueue = false
      return
    }

    this.isProcessingQueue = true

    // Process up to maxConcurrentLoads at once
    while (this.preloadQueue.length > 0 && this.currentLoads < this.maxConcurrentLoads) {
      const { url } = this.preloadQueue.shift()!
      this.currentLoads++

      const preloadLink = document.createElement("link")
      preloadLink.rel = "preload"
      preloadLink.as = "video"
      preloadLink.href = url
      document.head.appendChild(preloadLink)

      // Mark as preloaded
      this.preloadedVideos.add(url)

      // Simulate completion after a delay (in a real implementation, you'd use onload)
      setTimeout(() => {
        this.currentLoads--
        this.processPreloadQueue()
      }, 1000)
    }
  }

  /**
   * Preload videos for all elements with PinkSync data attributes
   */
  public preloadVisibleContent(): void {
    // Find all elements with PinkSync data attributes
    const elements = document.querySelectorAll("[data-ps-content-id]")

    elements.forEach((element) => {
      const priority = Number.parseInt(element.getAttribute("data-ps-priority") || "3", 10)
      const contentId = element.getAttribute("data-ps-content-id") || ""
      const text = element.textContent || ""

      // Only preload if in viewport or close to it
      if (this.isElementInViewport(element as HTMLElement, 300)) {
        this.preloadVideo(text, { priority })
      }
    })
  }

  /**
   * Check if an element is in or near the viewport
   */
  private isElementInViewport(element: HTMLElement, buffer = 0): boolean {
    const rect = element.getBoundingClientRect()
    return (
      rect.bottom >= -buffer &&
      rect.right >= -buffer &&
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) + buffer &&
      rect.left <= (window.innerWidth || document.documentElement.clientWidth) + buffer
    )
  }
}

// Export a singleton instance
export const pinkSyncPreloader = new PinkSyncPreloader()

// Export the class for custom instances
export default PinkSyncPreloader
