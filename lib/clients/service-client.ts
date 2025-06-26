// Service-to-service communication client
import type { ApiResponse } from "@/lib/db/schema"

export class ServiceClient {
  private baseUrl: string
  private apiKey: string
  private serviceName: string

  constructor(serviceName: string, baseUrl: string, apiKey: string) {
    this.serviceName = serviceName
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  async request<T>(
    endpoint: string,
    options: {
      method?: string
      body?: any
      headers?: Record<string, string>
    } = {},
  ): Promise<ApiResponse<T>> {
    const { method = "GET", body, headers = {} } = options

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "x-service-name": this.serviceName,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      throw new Error(`Service request failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Specific methods for common operations
  async createVCodeSession(action: string, context?: any): Promise<ApiResponse<any>> {
    return this.request("/api/v2/sessions/create", {
      method: "POST",
      body: { action, context },
    })
  }

  async getVCode(vcode: string): Promise<ApiResponse<any>> {
    return this.request(`/api/v2/vcodes/${vcode}`)
  }

  async verifyTrust(sessionId: string, data: any): Promise<ApiResponse<any>> {
    return this.request("/api/v1/verify", {
      method: "POST",
      body: { session_id: sessionId, data, verification_type: "sign_language_authenticity" },
    })
  }
}

// Pre-configured service clients
export const fibonroseClient = new ServiceClient(
  "fibonrose",
  process.env.FIBONROSE_API_URL || "https://api.fibonrose.com",
  process.env.FIBONROSE_API_KEY || "",
)

export const deafauthClient = new ServiceClient(
  "deafauth",
  process.env.DEAFAUTH_API_URL || "https://api.deafauth.com",
  process.env.DEAFAUTH_API_KEY || "",
)

export const visualdeskClient = new ServiceClient(
  "visualdesk",
  process.env.VISUALDESK_API_URL || "https://api.visualdesk.com",
  process.env.VISUALDESK_API_KEY || "",
)
