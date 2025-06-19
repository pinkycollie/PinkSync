import { neon } from "@neondatabase/serverless"
import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { logAuthEvent } from "./audit-logger"

const sql = neon(process.env.DATABASE_URL!)

// Function to check if user has completed MFA
async function hasCompletedMFA(userId: string): Promise<boolean> {
  const result = await sql`
    SELECT has_mfa FROM user_security WHERE user_id = ${userId}
  `
  return result.length > 0 && result[0].has_mfa
}

// Function to check if user's IP is allowed
async function isAllowedIP(userId: string, ip: string): Promise<boolean> {
  // For government applications, you might restrict to specific IP ranges
  // This is a simplified example
  const allowedIPs = await sql`
    SELECT allowed_ips FROM user_security WHERE user_id = ${userId}
  `

  if (allowedIPs.length === 0 || !allowedIPs[0].allowed_ips) {
    return true // No restrictions set
  }

  return allowedIPs[0].allowed_ips.includes(ip)
}

export const governmentAuthOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Restrict to government emails if needed
      // allowDangerousEmailAccountLinking: true,
    }),
    // Add other government-approved providers
  ],
  session: {
    strategy: "jwt",
    maxAge: 3600, // 1 hour session timeout (adjust based on requirements)
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Log sign-in attempt
      await logAuthEvent({
        event: "SIGN_IN_ATTEMPT",
        userId: user.id,
        details: {
          provider: account?.provider,
          email: user.email,
        },
      })

      // Check for government email domain if required
      if (process.env.RESTRICT_TO_GOV_DOMAINS === "true") {
        const email = user.email as string
        if (!email.endsWith(".gov") && !email.endsWith(".mil")) {
          return false
        }
      }

      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        // Add user ID to token
        token.userId = user.id

        // Add user roles and permissions
        const userRoles = await sql`
          SELECT r.name FROM roles r
          JOIN user_roles ur ON r.id = ur.role_id
          WHERE ur.user_id = ${user.id}
        `

        token.roles = userRoles.map((r) => r.name)

        // Add last authentication time for timeout calculations
        token.authTime = Date.now()
      }

      // Check if token has expired based on inactivity
      if (token.authTime && Date.now() - token.authTime > 1800000) {
        // 30 minutes
        // Force re-authentication
        return {}
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // Add user ID to session
        session.user.id = token.userId as string

        // Add roles to session
        session.user.roles = token.roles as string[]

        // Add permissions to session
        const permissions = await sql`
          SELECT DISTINCT p.name FROM permissions p
          JOIN role_permissions rp ON p.id = rp.permission_id
          JOIN user_roles ur ON rp.role_id = ur.role_id
          WHERE ur.user_id = ${token.userId}
        `

        session.user.permissions = permissions.map((p) => p.name)
      }

      return session
    },
  },
  events: {
    async signIn({ user }) {
      await logAuthEvent({
        event: "SIGN_IN_SUCCESS",
        userId: user.id,
        details: {
          timestamp: new Date().toISOString(),
        },
      })
    },
    async signOut({ token }) {
      await logAuthEvent({
        event: "SIGN_OUT",
        userId: token.userId as string,
        details: {
          timestamp: new Date().toISOString(),
        },
      })
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
}
