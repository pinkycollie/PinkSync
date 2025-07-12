export interface User {
  id: string
  email: string
  name?: string
  roles: string[]
  preferences?: {
    high_contrast: boolean
    large_text: boolean
    animation_reduction: boolean
    vibration_feedback: boolean
    sign_language: "asl" | "bsl" | "isl"
  }
  verified: boolean
  created_at: string
  updated_at: string
}

export interface AuthResult {
  authenticated: boolean
  user?: User
  response?: Response
  authType?: "jwt" | "api_key"
}

export interface JWTPayload {
  sub: string // user ID
  email: string
  name?: string
  roles?: string[]
  preferences?: User["preferences"]
  verified?: boolean
  iat: number
  exp: number
  iss: string
  aud: string
}

export interface ApiKeyPayload {
  service: string
  permissions: string[]
  client_id: string
  iat: number
  exp?: number
}
