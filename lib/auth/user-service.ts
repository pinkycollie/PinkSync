import { neon } from "@neondatabase/serverless"
import type { User, JWTPayload } from "@/types/auth"

const sql = neon(process.env.DATABASE_URL)

export async function getUserFromPayload(payload: JWTPayload): Promise<User | null> {
  try {
    // First, try to get user from local database
    const users = await sql`
      SELECT 
        id,
        email,
        name,
        roles,
        preferences,
        verified,
        created_at,
        updated_at
      FROM users 
      WHERE id = ${payload.sub}
    `

    if (users.length > 0) {
      const user = users[0]
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles || ["user"],
        preferences: user.preferences || {
          high_contrast: false,
          large_text: false,
          animation_reduction: false,
          vibration_feedback: true,
          sign_language: "asl",
        },
        verified: user.verified || false,
        created_at: user.created_at,
        updated_at: user.updated_at,
      }
    }

    // If user not found locally, create from JWT payload
    const newUser: User = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      roles: payload.roles || ["user"],
      preferences: payload.preferences || {
        high_contrast: false,
        large_text: false,
        animation_reduction: false,
        vibration_feedback: true,
        sign_language: "asl",
      },
      verified: payload.verified || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Insert the user into local database for future reference
    await sql`
      INSERT INTO users (
        id, email, name, roles, preferences, verified, created_at, updated_at
      ) VALUES (
        ${newUser.id},
        ${newUser.email},
        ${newUser.name},
        ${JSON.stringify(newUser.roles)},
        ${JSON.stringify(newUser.preferences)},
        ${newUser.verified},
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        roles = EXCLUDED.roles,
        preferences = EXCLUDED.preferences,
        verified = EXCLUDED.verified,
        updated_at = NOW()
    `

    return newUser
  } catch (error) {
    console.error("Error getting user from payload:", error)
    return null
  }
}

export async function updateUserLastSeen(userId: string): Promise<void> {
  try {
    await sql`
      UPDATE users 
      SET last_seen = NOW(), updated_at = NOW()
      WHERE id = ${userId}
    `
  } catch (error) {
    console.error("Error updating user last seen:", error)
  }
}
