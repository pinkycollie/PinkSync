export interface DeafUser {
  id: string
  email: string
  phone?: string
  status: "pending_verification" | "verified" | "suspended" | "active"
  verificationLevel: "basic" | "community" | "professional" | "institutional"
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
}

export interface DeafIdentityVerification {
  id: string
  userId: string
  hearingLossType: "conductive" | "sensorineural" | "mixed" | "auditory_processing"
  hearingLossDegree: "mild" | "moderate" | "severe" | "profound"
  hearingLossOnset: "congenital" | "acquired"
  primaryCommunication: "ASL" | "PSE" | "oral" | "written" | "mixed"
  audiogramFileUrl?: string
  medicalDocumentationUrl?: string
  cochlearImplant: boolean
  hearingAids: boolean
  verificationStatus: "pending" | "verified" | "rejected" | "needs_review"
  verifiedBy?: string
  verifiedAt?: Date
  createdAt: Date
}

export interface UserStateProfile {
  id: string
  userId: string
  stateCode: string
  residenceStatus: "resident" | "temporary" | "student" | "worker"
  driversLicenseNumber?: string
  stateIdNumber?: string
  voterRegistrationStatus: boolean
  disabilityServicesEnrolled: boolean
  vrServicesEnrolled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface InternationalProfile {
  id: string
  userId: string
  passportNumber?: string
  passportCountry?: string
  passportExpiry?: Date
  globalEntry: boolean
  tsaPrecheck: boolean
  disabilityTravelCard?: Record<string, any>
  emergencyContacts?: Array<{
    name: string
    relationship: string
    phone: string
    email: string
    country: string
  }>
  medicalTravelDocuments?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface DocumentAnalysis {
  id: string
  userId: string
  documentType: string
  fileUrl: string
  fileName: string
  fileSize: number
  mimeType: string
  aiAnalysisStatus: "pending" | "processing" | "completed" | "failed"
  aiAnalysisResult?: Record<string, any>
  confidenceScore?: number
  requiresHumanReview: boolean
  processedAt?: Date
  createdAt: Date
}

export interface BusinessOptimization {
  id: string
  userId: string
  optimizationType: "tax" | "benefits" | "compliance" | "workflow"
  currentState: Record<string, any>
  recommendations: Array<{
    title: string
    description: string
    impact: string
    effort: string
    savings?: number
  }>
  potentialSavings?: number
  implementationDifficulty: "easy" | "medium" | "hard"
  priorityScore: number
  status: "pending" | "in_progress" | "completed" | "dismissed"
  implementedAt?: Date
  createdAt: Date
}

export interface AccessibilityPreferences {
  id: string
  userId: string
  visualAlerts: boolean
  vibrationAlerts: boolean
  highContrast: boolean
  largeText: boolean
  aslVideoPreferred: boolean
  interpreterRequired: boolean
  cartServicesPreferred: boolean
  emergencyContactMethod: "text" | "email" | "video" | "relay"
  preferredCommunicationLanguage: string
  createdAt: Date
  updatedAt: Date
}
