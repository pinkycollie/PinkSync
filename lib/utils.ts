import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

export function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return [
    hours > 0 ? hours.toString().padStart(2, "0") : null,
    minutes.toString().padStart(2, "0"),
    secs.toString().padStart(2, "0"),
  ]
    .filter(Boolean)
    .join(":")
}

export function getVideoThumbnail(videoId: string, timestamp = "00:00:01") {
  // In a real implementation, this would generate a URL to a real thumbnail
  // For this demo, we'll use a placeholder
  return `/placeholder.svg?height=720&width=1280&query=video thumbnail at ${timestamp}`
}

export function getVideoUrl(videoId: string, format = "mp4", resolution = "720p") {
  // In a real implementation, this would generate a URL to the CDN
  // For this demo, we'll return a placeholder
  return `https://example-cdn.com/videos/${videoId}/${resolution}.${format}`
}
