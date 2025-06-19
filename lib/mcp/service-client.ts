/**
 * Centralized service client for MCP integration
 */
export class MCPServiceClient {
  private baseUrl: string
  private apiKey: string

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  /**
   * Make authenticated request to MCP services
   */
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`MCP API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Sign Language Service Methods
   */
  async submitSignLanguageRequest(request: any) {
    return this.makeRequest("/api/sign-language", {
      method: "POST",
      body: JSON.stringify(request),
    })
  }

  async getSignLanguageStatus(requestId: string) {
    return this.makeRequest(`/api/sign-language/${requestId}`)
  }

  /**
   * User Preferences Methods
   */
  async getUserPreferences(userId: string) {
    return this.makeRequest(`/api/users/${userId}/preferences`)
  }

  async updateUserPreferences(userId: string, preferences: any) {
    return this.makeRequest(`/api/users/${userId}/preferences`, {
      method: "PUT",
      body: JSON.stringify(preferences),
    })
  }

  /**
   * Analytics Methods
   */
  async trackEvent(event: string, data: any) {
    return this.makeRequest("/api/analytics/events", {
      method: "POST",
      body: JSON.stringify({ event, data, timestamp: Date.now() }),
    })
  }
}

// Singleton instance
export const mcpClient = new MCPServiceClient(
  process.env.MCP_API_URL || "https://mcp.mbtquniverse.com",
  process.env.MCP_API_KEY || "",
)
