export type SignLanguageType = "DSL" | "ASL" | "BSL" | "ISL" | "Other"

export type ProgrammingConcept = {
  id: string
  name: string
  category: ProgrammingCategory
  description: string
  complexity: "Beginner" | "Intermediate" | "Advanced"
}

export type ProgrammingCategory =
  | "JavaScript"
  | "TypeScript"
  | "React"
  | "NextJS"
  | "HTML"
  | "CSS"
  | "Git"
  | "Database"
  | "API"
  | "DevOps"
  | "Testing"
  | "Accessibility"
  | "Performance"
  | "Security"
  | "Other"

export interface DeveloperSignVideo {
  id: number
  blobUrl: string
  filename: string
  contentType: string
  sizeBytes: number
  categoryId: number
  title: string
  description: string
  language: string
  signLanguageType: SignLanguageType
  durationSeconds: number
  thumbnailUrl: string
  uploadedBy: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
  tags: string[]
  programmingConcept?: ProgrammingConcept
  viewCount?: number
  downloadCount?: number
}

export interface DeveloperSignCategory {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface DeveloperSignTag {
  id: number
  name: string
  createdAt: string
}

export interface DeveloperSignUsageStats {
  id: number
  assetId: number
  viewCount: number
  downloadCount: number
  lastAccessed: string
  createdAt: string
  updatedAt: string
}

export interface DeveloperSignSearchParams {
  query?: string
  category?: number
  tags?: number[]
  signLanguageType?: SignLanguageType
  programmingCategory?: ProgrammingCategory
  complexity?: "Beginner" | "Intermediate" | "Advanced"
  page?: number
  limit?: number
  sortBy?: "newest" | "oldest" | "popular" | "alphabetical"
}
