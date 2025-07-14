/**
 * Video Content Manager
 * Utility for managing and organizing ASL video content
 */

import type { VideoMapping } from "@/lib/types/pink-sync"

interface VideoContentOptions {
  baseUrl: string
  humanSignerPath: string
  avatarPath: string
  qualityLevels: string[]
  fileExtension: string
}

class VideoContentManager {
  private options: VideoContentOptions
  private videoMappings: Map<string, VideoMapping> = new Map()

  constructor(options: Partial<VideoContentOptions> = {}) {
    this.options = {
      baseUrl: "/videos",
      humanSignerPath: "human",
      avatarPath: "avatar",
      qualityLevels: ["ld", "md", "hd"],
      fileExtension: "mp4",
      ...options,
    }
  }

  /**
   * Register a video mapping for a specific text
   */
  public registerVideoMapping(text: string, mapping: Omit<VideoMapping, "textHash">): void {
    const textHash = this.hashText(text)
    this.videoMappings.set(textHash, {
      ...mapping,
      textHash,
    })
  }

  /**
   * Get a video mapping for a specific text
   */
  public getVideoMapping(text: string): VideoMapping | undefined {
    const textHash = this.hashText(text)
    return this.videoMappings.get(textHash)
  }

  /**
   * Generate a video URL for a specific text
   */
  public getVideoUrl(
    text: string,
    options: {
      signModel?: "human" | "avatar"
      quality?: "low" | "medium" | "high"
    } = {},
  ): string {
    const { signModel = "human", quality = "medium" } = options

    // Check if we have a custom mapping for this text
    const mapping = this.getVideoMapping(text)
    if (mapping) {
      return mapping.videoUrl
    }

    // Otherwise, generate a deterministic URL
    const textHash = this.hashText(text)
    const modelPath = signModel === "human" ? this.options.humanSignerPath : this.options.avatarPath
    const qualityIndex = quality === "high" ? 2 : quality === "medium" ? 1 : 0
    const qualityPath = this.options.qualityLevels[qualityIndex]

    // Use the hash to generate a video number (1-10)
    const videoNumber = (Number.parseInt(textHash.substring(0, 8), 16) % 10) + 1

    return `${this.options.baseUrl}/${modelPath}/${qualityPath}/sign-language-${videoNumber}.${this.options.fileExtension}`
  }

  /**
   * Generate a consistent hash for a text string
   */
  private hashText(text: string): string {
    // Simple hash function for demo purposes
    // In production, use a more robust hashing algorithm
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash.toString(16).padStart(8, "0")
  }

  /**
   * Bulk register video mappings
   */
  public registerBulkMappings(mappings: Array<{ text: string; mapping: Omit<VideoMapping, "textHash"> }>): void {
    mappings.forEach(({ text, mapping }) => {
      this.registerVideoMapping(text, mapping)
    })
  }

  /**
   * Export all video mappings
   */
  public exportMappings(): Record<string, VideoMapping> {
    const result: Record<string, VideoMapping> = {}
    this.videoMappings.forEach((mapping, key) => {
      result[key] = mapping
    })
    return result
  }

  /**
   * Import video mappings
   */
  public importMappings(mappings: Record<string, VideoMapping>): void {
    Object.entries(mappings).forEach(([key, mapping]) => {
      this.videoMappings.set(key, mapping)
    })
  }
}

// Export a singleton instance
export const videoContentManager = new VideoContentManager()

// Export the class for custom instances
export default VideoContentManager
