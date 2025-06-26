// Database connection and query utilities
import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required")
}

export const sql = neon(process.env.DATABASE_URL)

// Database utility functions
export class DatabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message)
    this.name = "DatabaseError"
  }
}

export async function executeQuery<T>(query: string, params: any[] = []): Promise<T[]> {
  try {
    const result = await sql(query, params)
    return result as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw new DatabaseError("Database operation failed")
  }
}

export async function executeTransaction<T>(queries: Array<{ query: string; params: any[] }>): Promise<T[]> {
  // Note: Neon doesn't support transactions in the same way as traditional PostgreSQL
  // This is a simplified implementation - in production, you'd want proper transaction handling
  const results: T[] = []

  for (const { query, params } of queries) {
    const result = await executeQuery<T>(query, params)
    results.push(...result)
  }

  return results
}
