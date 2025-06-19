"use server"

import { revalidatePath } from "next/cache"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { hasPermission } from "@/lib/auth/permissions"

const sql = neon(process.env.DATABASE_URL!)

export async function updateDocumentationSection(sectionId: number, title: string, content: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Not authenticated")
  }

  const canEdit = await hasPermission(session.user.id, "pinksync:edit")

  if (!canEdit) {
    throw new Error("Not authorized to edit documentation")
  }

  try {
    await sql`
      UPDATE pinksync_documentation
      SET 
        title = ${title},
        content = ${content},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${sectionId}
    `

    revalidatePath("/dashboard/pinksync-info")

    return { success: true }
  } catch (error) {
    console.error("Error updating documentation section:", error)
    throw new Error("Failed to update documentation section")
  }
}

export async function getDocumentationSections() {
  try {
    const sections = await sql`
      SELECT * FROM pinksync_documentation
      ORDER BY section, order_index
    `

    return sections
  } catch (error) {
    console.error("Error fetching documentation sections:", error)
    return []
  }
}

export async function getDemoScenarios() {
  try {
    const demos = await sql`
      SELECT * FROM pinksync_demos
      ORDER BY title
    `

    return demos
  } catch (error) {
    console.error("Error fetching demo scenarios:", error)
    return []
  }
}
