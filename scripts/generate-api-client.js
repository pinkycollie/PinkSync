import { writeFileSync, mkdirSync } from "fs"

// Generate TypeScript types from OpenAPI spec
const generateTypes = () => {
  const types = `// Generated TypeScript types for PinkSync API
export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
  preferences: UserPreferences;
  verified: boolean;
  roles: ('user' | 'creator' | 'validator' | 'admin')[];
}

export interface UserPreferences {
  high_contrast: boolean;
  large_text: boolean;
  animation_reduction: boolean;
  vibration_feedback: boolean;
  sign_language: 'asl' | 'bsl' | 'isl';
}

export interface VisualFeedback {
  icon: string;
  color: string;
  animation: string;
  vibration: boolean;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  visual_feedback?: VisualFeedback;
}

export interface Video {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  duration?: number;
  created_at: string;
  updated_at: string;
  url?: string;
  thumbnail_url?: string;
  sign_language: 'asl' | 'bsl' | 'isl' | 'other' | 'none';
  metadata?: Record<string, any>;
}

export interface TrustBadge {
  id: string;
  name: string;
  description: string;
  image_url: string;
  criteria: string;
  issuer: string;
  issued_at: string;
  expires_at?: string;
  verification_url: string;
}

export interface VerificationSubmission {
  id: string;
  user_id: string;
  type: 'deaf_creator' | 'interpreter' | 'organization' | 'business';
  status: 'pending' | 'under_review' | 'needs_info' | 'approved' | 'rejected';
  submitted_at: string;
  updated_at: string;
  documents: Array<{
    id: string;
    type: string;
    url: string;
  }>;
  notes?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  created_at: string;
  visual_feedback?: VisualFeedback;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'not_started' | 'in_progress' | 'review' | 'completed';
  percent_complete: number;
  assigned_to?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}
`

  return types
}

// Generate API client class
const generateApiClient = () => {
  const client = `// Generated API client for PinkSync
import type { 
  User, 
  UserPreferences, 
  ApiResponse, 
  Video, 
  TrustBadge, 
  VerificationSubmission,
  Notification,
  Task 
} from './types'

export class PinkSyncAPI {
  private baseUrl: string
  private token?: string

  constructor(baseUrl: string = 'https://api.pinksync.io/v2') {
    this.baseUrl = baseUrl
  }

  setToken(token: string) {
    this.token = token
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = \`\${this.baseUrl}\${endpoint}\`
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = \`Bearer \${this.token}\`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    const data = await response.json()
    return data
  }

  // Authentication endpoints
  async signup(email: string, password: string, name?: string, preferences?: UserPreferences) {
    return this.request<{ token: string; expires_at: string; user: User }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, preferences }),
    })
  }

  async login(email: string, password: string) {
    return this.request<{ token: string; expires_at: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' })
  }

  async verifyToken() {
    return this.request<{ valid: boolean; user: User }>('/auth/verify-token', {
      method: 'POST',
    })
  }

  // User endpoints
  async getCurrentUser() {
    return this.request<User>('/users/me')
  }

  async updateCurrentUser(updates: Partial<Pick<User, 'name' | 'email' | 'preferences'>>) {
    return this.request<User>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  // Accessibility endpoints
  async getAccessibilityPreferences() {
    return this.request<UserPreferences>('/accessibility/preferences')
  }

  async updateAccessibilityPreferences(preferences: UserPreferences) {
    return this.request<UserPreferences>('/accessibility/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    })
  }

  // Video endpoints
  async uploadVideo(formData: FormData) {
    return this.request<Video>('/videos', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    })
  }

  async listVideos(params?: { page?: number; limit?: number; status?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.status) searchParams.set('status', params.status)
    
    const query = searchParams.toString()
    return this.request<{
      videos: Video[];
      total: number;
      page: number;
      pages: number;
    }>(\`/videos\${query ? '?' + query : ''}\`)
  }

  async getVideo(videoId: string) {
    return this.request<Video>(\`/videos/\${videoId}\`)
  }

  async updateVideo(videoId: string, updates: Partial<Pick<Video, 'title' | 'description' | 'sign_language'>>) {
    return this.request<Video>(\`/videos/\${videoId}\`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  async deleteVideo(videoId: string) {
    return this.request(\`/videos/\${videoId}\`, { method: 'DELETE' })
  }

  // Trust/Verification endpoints
  async submitVerification(formData: FormData) {
    return this.request<VerificationSubmission>('/verify-profile', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    })
  }

  async getCredibilityScore(userId?: string) {
    const query = userId ? \`?userId=\${userId}\` : ''
    return this.request<{
      user_id: string;
      score: number;
      badges: TrustBadge[];
      verified: boolean;
    }>(\`/get-credibility-score\${query}\`)
  }

  // Notification endpoints
  async getNotifications(params?: { page?: number; limit?: number; unread_only?: boolean }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.unread_only) searchParams.set('unread_only', 'true')
    
    const query = searchParams.toString()
    return this.request<{
      notifications: Notification[];
      total: number;
      unread: number;
      page: number;
      pages: number;
    }>(\`/notifications\${query ? '?' + query : ''}\`)
  }

  async markNotificationRead(notificationId: string) {
    return this.request<Notification>(\`/notifications/\${notificationId}/read\`, {
      method: 'POST',
    })
  }

  // Task/Progress endpoints
  async createTask(task: Pick<Task, 'title' | 'description' | 'assigned_to' | 'due_date'>) {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    })
  }

  async listTasks(params?: { status?: string; assigned_to?: string; page?: number; limit?: number }) {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.set('status', params.status)
    if (params?.assigned_to) searchParams.set('assigned_to', params.assigned_to)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    
    const query = searchParams.toString()
    return this.request<{
      tasks: Task[];
      total: number;
      page: number;
      pages: number;
    }>(\`/tasks\${query ? '?' + query : ''}\`)
  }

  async updateTask(taskId: string, updates: Partial<Pick<Task, 'status' | 'percent_complete'>>) {
    return this.request<Task>(\`/tasks/\${taskId}\`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }
}

// Export singleton instance
export const pinkSyncAPI = new PinkSyncAPI()
`

  return client
}

try {
  // Create directories
  mkdirSync("lib/api", { recursive: true })

  // Generate and write files
  const types = generateTypes()
  const client = generateApiClient()

  writeFileSync("lib/api/types.ts", types)
  writeFileSync("lib/api/client.ts", client)

  console.log("✅ API client and types generated successfully!")
  console.log("\nGenerated files:")
  console.log("- lib/api/types.ts - TypeScript type definitions")
  console.log("- lib/api/client.ts - API client class")
  console.log("- api/openapi.yaml - Complete OpenAPI specification")
} catch (error) {
  console.error("❌ Error generating API client:", error.message)
}
