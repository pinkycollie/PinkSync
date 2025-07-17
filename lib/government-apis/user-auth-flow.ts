// User Direct Authentication Flow - Better UX and Privacy
import { encrypt } from "../utils/encryption" // Import encrypt function
import { db } from "../db" // Import db variable

export interface GovernmentOAuthConfig {
  service: string
  authUrl: string
  tokenUrl: string
  clientId: string // Your app's client ID registered with the government service
  redirectUri: string
  scopes: string[]
  userFacing: boolean // true = user authenticates directly, false = platform API
}

export class UserGovernmentAuth {
  private configs: Map<string, GovernmentOAuthConfig> = new Map()

  constructor() {
    this.initializeConfigs()
  }

  private initializeConfigs() {
    // Login.gov - Federal authentication service
    this.configs.set("login.gov", {
      service: "login.gov",
      authUrl: "https://secure.login.gov/openid_connect/authorize",
      tokenUrl: "https://secure.login.gov/api/openid_connect/token",
      clientId: process.env.LOGIN_GOV_CLIENT_ID!,
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback/login-gov`,
      scopes: ["openid", "email", "profile", "social_security_number"],
      userFacing: true,
    })

    // ID.me - Veteran and government services
    this.configs.set("id.me", {
      service: "id.me",
      authUrl: "https://api.id.me/oauth/authorize",
      tokenUrl: "https://api.id.me/oauth/token",
      clientId: process.env.ID_ME_CLIENT_ID!,
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback/id-me`,
      scopes: ["openid", "military", "disability", "benefits"],
      userFacing: true,
    })

    // MySSA - Social Security direct login
    this.configs.set("myssa", {
      service: "myssa",
      authUrl: "https://secure.ssa.gov/RIL/SiView.action",
      tokenUrl: "https://api.ssa.gov/oauth/token",
      clientId: process.env.SSA_OAUTH_CLIENT_ID!,
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback/ssa`,
      scopes: ["benefits", "earnings", "disability"],
      userFacing: true,
    })

    // IRS Online Account
    this.configs.set("irs", {
      service: "irs",
      authUrl: "https://www.irs.gov/account/oauth/authorize",
      tokenUrl: "https://api.irs.gov/oauth/token",
      clientId: process.env.IRS_OAUTH_CLIENT_ID!,
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback/irs`,
      scopes: ["tax_records", "transcripts", "payments"],
      userFacing: true,
    })
  }

  // Generate OAuth URL for user to authenticate directly with government service
  generateAuthUrl(service: string, userId: string, state?: string): string {
    const config = this.configs.get(service)
    if (!config) {
      throw new Error(`OAuth not configured for service: ${service}`)
    }

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scopes.join(" "),
      response_type: "code",
      state: state || `${userId}:${service}:${Date.now()}`,
      // Deaf-specific parameters
      acr_values: "http://idmanagement.gov/ns/assurance/ial/2", // Identity Assurance Level 2
      prompt: "login", // Force fresh authentication
    })

    return `${config.authUrl}?${params.toString()}`
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(service: string, code: string, state: string) {
    const config = this.configs.get(service)
    if (!config) {
      throw new Error(`OAuth not configured for service: ${service}`)
    }

    try {
      const response = await fetch(config.tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: config.clientId,
          client_secret: process.env[`${service.toUpperCase().replace(".", "_")}_CLIENT_SECRET`]!,
          code,
          redirect_uri: config.redirectUri,
        }),
      })

      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.statusText}`)
      }

      const tokens = await response.json()

      // Store encrypted tokens for user
      await this.storeUserTokens(state, service, tokens)

      return tokens
    } catch (error) {
      console.error(`Token exchange error for ${service}:`, error)
      throw error
    }
  }

  private async storeUserTokens(state: string, service: string, tokens: any) {
    const [userId] = state.split(":")
    const encryptedAccessToken = encrypt(tokens.access_token)
    const encryptedRefreshToken = tokens.refresh_token ? encrypt(tokens.refresh_token) : null

    await db.query(
      `
      INSERT INTO user_government_tokens (
        user_id, service, encrypted_access_token, encrypted_refresh_token, 
        expires_at, scope, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (user_id, service) DO UPDATE SET
        encrypted_access_token = EXCLUDED.encrypted_access_token,
        encrypted_refresh_token = EXCLUDED.encrypted_refresh_token,
        expires_at = EXCLUDED.expires_at,
        scope = EXCLUDED.scope,
        updated_at = NOW()
    `,
      [
        userId,
        service,
        encryptedAccessToken,
        encryptedRefreshToken,
        new Date(Date.now() + tokens.expires_in * 1000),
        tokens.scope,
      ],
    )
  }
}
