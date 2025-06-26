// User types
export interface User {
  id: string
  name: string
  email: string
  preferences: UserPreferences
  vcodeVerified: boolean
  lastVerification?: string
}

export interface UserPreferences {
  language: string
  notificationPreferences: NotificationPreferences
  accessibilitySettings: AccessibilitySettings
  avatarPreferences: AvatarPreferences
}

export interface NotificationPreferences {
  email: boolean
  inApp: boolean
  sms: boolean
}

export interface AccessibilitySettings {
  highContrast: boolean
  largeText: boolean
  reduceMotion: boolean
}

export interface AvatarPreferences {
  preferredAvatarId?: string
  preferredCommunicationMethod: "avatar" | "human" | "text"
}

// Form processing types
export interface FormRequest {
  id: string
  userId: string
  formType: string
  provider: string
  status: "pending" | "processing" | "needs_info" | "completed" | "error"
  progress: number
  createdAt: string
  updatedAt: string
  formData: any
  processedData?: any
}

// Interpreter types
export interface Interpreter {
  id: string
  name: string
  type: "avatar" | "human"
  specialization: string[]
  status: "available" | "busy" | "offline"
  lastUsed?: string
}

export interface AvatarInterpreter extends Interpreter {
  type: "avatar"
  style: string
  voiceId?: string
  customizationOptions: AvatarCustomizationOptions
}

export interface AvatarCustomizationOptions {
  appearance: string
  voice: string
  gestures: string[]
  expressions: string[]
}

export interface HumanInterpreter extends Interpreter {
  type: "human"
  certifications: string[]
  languages: string[]
  availability: AvailabilitySchedule
}

export interface AvailabilitySchedule {
  weekdays: TimeRange[]
  weekend: TimeRange[]
}

export interface TimeRange {
  start: string // HH:MM format
  end: string // HH:MM format
}

// VCode verification types
export interface VCodeVerification {
  id: string
  userId: string
  action: string
  timestamp: string
  success: boolean
  expiresAt: string
}

// Activity types
export interface Activity {
  id: string
  userId: string
  type: "form_started" | "form_completed" | "message" | "verification" | "needs_attention"
  title: string
  description: string
  timestamp: string
  relatedId?: string // ID of related form, message, etc.
  read: boolean
}
