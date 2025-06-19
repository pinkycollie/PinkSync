import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

/**
 * Check if a user has a specific permission
 */
export async function hasPermission(userId: string, permissionName: string): Promise<boolean> {
  try {
    // Query to check if the user has the specified permission through their roles
    const result = await sql`
      SELECT COUNT(*) as has_permission FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      JOIN user_roles ur ON rp.role_id = ur.role_id
      WHERE ur.user_id = ${userId}
      AND p.name = ${permissionName}
    `

    return result[0]?.has_permission > 0
  } catch (error) {
    console.error("Error checking permission:", error)
    return false
  }
}

/**
 * Get all permissions for a user
 */
export async function getUserPermissions(userId: string): Promise<string[]> {
  try {
    const permissions = await sql`
      SELECT DISTINCT p.name FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      JOIN user_roles ur ON rp.role_id = ur.role_id
      WHERE ur.user_id = ${userId}
    `

    return permissions.map((p) => p.name)
  } catch (error) {
    console.error("Error getting user permissions:", error)
    return []
  }
}

/**
 * Get all roles for a user
 */
export async function getUserRoles(userId: string): Promise<string[]> {
  try {
    const roles = await sql`
      SELECT r.name FROM roles r
      JOIN user_roles ur ON r.id = ur.role_id
      WHERE ur.user_id = ${userId}
    `

    return roles.map((r) => r.name)
  } catch (error) {
    console.error("Error getting user roles:", error)
    return []
  }
}
