// Updated database schema to match existing database structure
export interface User {
  id: string
  email: string
  name: string
  first_name: string
  last_name: string
  password: string
  phone?: string
  role: string
  organization?: string
  job_title?: string
  industry?: string
  employment_status?: string
  subscription_tier: string
  service_type?: string
  preferred_contact?: string
  created_at: Date
  updated_at: Date
  last_login?: Date
  is_active: boolean
  is_verified: boolean
}

export interface UserPreferences {
  user_id: string
  receive_updates: boolean
  font_size: number
  accessibility_needs: string[]
  theme: string
  high_contrast: boolean
  reduced_motion: boolean
  large_text: boolean
}

// PinkSync vCode Integration Types
export interface VCodeSession {
  id: string
  user_id: string
  session_token: string
  status: "created" | "uploading" | "processing" | "transforming" | "verifying" | "completed" | "failed"
  action: string
  context: any
  video_url?: string
  processed_data?: any
  trust_score?: number
  fibonrose_verification?: any
  created_at: Date
  updated_at: Date
  expires_at: Date
  completed_at?: Date
}

export interface VCodeRecord {
  id: string
  session_id: string
  vcode: string
  user_id: string
  action: string
  video_signature: string
  extracted_data: any
  trust_verification: any
  status: "pending" | "verified" | "expired" | "revoked"
  created_at: Date
  verified_at?: Date
  expires_at: Date
}

export interface VisualFeedback {
  type: "success" | "error" | "warning" | "info" | "processing"
  icon: string
  color: string
  animation?: string
  vibration?: boolean
  message: string
  duration?: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  error_code?: string
  visual_feedback: VisualFeedback
  timestamp: string
  request_id: string
}

export interface ServiceClient {
  service_name: string
  api_key: string
  base_url: string
  version: string
}

// Form processing types (updated to work with existing schema)
export interface FormRequest {
  id: string
  user_id: string
  form_type: string
  provider: string
  title: string
  status: "pending" | "processing" | "needs_info" | "completed" | "error" | "cancelled"
  progress: number
  priority: "low" | "medium" | "high" | "urgent"
  created_at: Date
  updated_at: Date
  estimated_completion?: Date
  completed_at?: Date
  form_data: any
  processed_data?: any
  ai_analysis?: any
  vcode_session_id?: string
  verification_required: boolean
  verification_completed: boolean
}
