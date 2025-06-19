import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { neon } from "@neondatabase/serverless"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PinkSyncInfoContent } from "@/components/pinksync-info-content"
import { PinkSyncDemoSection } from "@/components/pinksync-demo-section"
import { hasPermission } from "@/lib/auth/permissions"

const sql = neon(process.env.DATABASE_URL!)

export default async function PinkSyncInfoPage() {
  // Get the user session
  const session = await getServerSession(authOptions)

  // Check if user has permission to view this page
  if (!session?.user || !(await hasPermission(session.user.id, "pinksync:read"))) {
    redirect("/auth/access-denied")
  }

  // Fetch documentation content
  const documentationSections = await sql`
    SELECT * FROM pinksync_documentation
    ORDER BY section, order_index
  `

  // Fetch demo scenarios
  const demoScenarios = await sql`
    SELECT * FROM pinksync_demos
    ORDER BY title
  `

  // Check if user has demo permission
  const canAccessDemo = await hasPermission(session.user.id, "pinksync:demo")

  // Check if user can edit content
  const canEdit = await hasPermission(session.user.id, "pinksync:edit")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">PinkSync Platform Information</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive overview of the PinkSync platform, its functionality, and technical details
        </p>
      </div>

      <PinkSyncInfoContent sections={documentationSections} canEdit={canEdit} />

      {canAccessDemo && <PinkSyncDemoSection demos={demoScenarios} />}
    </div>
  )
}
