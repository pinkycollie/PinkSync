export interface User {
  id: string
  email: string
  name: string
  role: string
  preferredSignLanguage?: "ASL" | "BSL" | "ISL" | "Other"
  requiresVisualFeedback?: boolean
  verificationLevel?: "none" | "basic" | "verified" | "enhanced"
  createdAt: number
  updatedAt: number
}

export interface Session {
  id: string
  user: User
  createdAt: number
  expiresAt: number
}

export interface AuthError {
  code: string
  message: string
}
