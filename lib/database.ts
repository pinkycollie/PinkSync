export interface AccessibilityPreferences {
  id: string
  user_id: string
  captions_enabled: boolean
  high_contrast: boolean
  sign_language_overlay: boolean
  visual_notifications: boolean
  vibration_notifications: boolean
  flash_notifications: boolean
  emergency_video_relay: boolean
  emergency_text_alerts: boolean
  text_to_speech: boolean
  color_blind_support: boolean
  font_size_multiplier: number
  created_at: string
  updated_at: string
}

export interface DeafIdentityProfile {
  id: string
  user_id: string
  deaf_status: "deaf" | "hard_of_hearing" | "deafblind" | "late_deafened"
  hearing_loss_type: "conductive" | "sensorineural" | "mixed" | "auditory_processing"
  hearing_loss_degree: "mild" | "moderate" | "severe" | "profound"
  primary_language: string
  secondary_languages: string[]
  communication_methods: string[]
  deaf_culture_involvement: "high" | "moderate" | "low" | "none"
  community_connections: Record<string, any>
  identity_verified: boolean
  verification_method: string
  verification_date: string
  verification_documents: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Analysis {
  id: string
  user_id: string
  input_text: string
  analysis_result: Record<string, any>
  created_at: string
}

export interface AIAnalysisSummary {
  user_id: string
  total_analyses: number
  pending_analyses: number
  last_analysis: string
  recent_analyses: Record<string, any>
}

export interface EmergencyProfile {
  id: string
  user_id: string
  emergency_name: string
  communication_method: string
  preferred_language: string
  interpreter_needed: boolean
  home_address: Record<string, any>
  work_address: Record<string, any>
  medical_conditions: string[]
  medications: string[]
  allergies: string[]
  accessibility_notes: string
  hospital_preference: string
  doctor_contact: Record<string, any>
  active: boolean
  created_at: string
  updated_at: string
  last_updated: string
}

export interface GovernmentAccount {
  id: string
  user_id: string
  agency: string
  account_id: string
  account_status: "active" | "inactive" | "pending" | "suspended"
  connected: boolean
  oauth_token_encrypted: string
  refresh_token_encrypted: string
  token_expires_at: string
  permissions: Record<string, any>
  data_access_level: string
  sync_status: string
  last_sync: string
  created_at: string
  updated_at: string
}

export interface BenefitCoordination {
  id: string
  user_id: string
  benefit_type: string
  benefit_id: string
  application_status: string
  effective_date: string
  approval_date: string
  review_date: string
  next_review_date: string
  monthly_amount: number
  last_payment_date: string
  case_worker_contact: Record<string, any>
  conflicts_with: string[]
  optimization_notes: string
  created_at: string
  updated_at: string
}

// Database query functions would go here
export async function getUserAccessibilityPreferences(userId: string): Promise<AccessibilityPreferences | null> {
  // Implementation would query the database
  return null
}

export async function getUserDeafIdentityProfile(userId: string): Promise<DeafIdentityProfile | null> {
  // Implementation would query the database
  return null
}

export async function createAnalysis(
  userId: string,
  inputText: string,
  result: Record<string, any>,
): Promise<Analysis> {
  // Implementation would insert into database
  throw new Error("Not implemented")
}

export async function getUserAnalysisSummary(userId: string): Promise<AIAnalysisSummary | null> {
  // Implementation would query the database
  return null
}
