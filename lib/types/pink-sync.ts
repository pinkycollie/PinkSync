/**
 * PinkSync Type Definitions
 * Core type definitions for the PinkSync system
 */

// The different modes PinkSync can operate in
export type PinkSyncMode = "off" | "ambient" | "interactive" | "immersive"

// User preferences for PinkSync configuration
export interface PinkSyncPreferences {
  autoPlayVideos: boolean
  showTextWithVideos: boolean
  videoPriority: "essential" | "all" // Whether to show videos for all text or just essential content
  videoSize: "small" | "medium" | "large"
  videoPosition: "inline" | "floating" | "sidebar"
  videoQuality: "low" | "medium" | "high"
  signModel: "human" | "avatar" // Whether to use human signers or 3D avatars
}

// Content priority levels
export enum ContentPriority {
  Low = 1,
  Medium = 2,
  Standard = 3,
  High = 4,
  Critical = 5,
}

// Video mapping configuration
export interface VideoMapping {
  textHash: string
  videoUrl: string
  duration: number
  signedBy: string
  dateCreated: string
  version: number
}

// Video source configuration
export interface VideoSourceConfig {
  baseUrl: string
  humanSignerPath: string
  avatarPath: string
  fileExtension: string
  fallbackPath: string
}
