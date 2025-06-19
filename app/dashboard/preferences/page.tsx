import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { neon } from "@neondatabase/serverless"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { UserPreferencesForm } from "@/components/user-preferences-form"
import { getUserPreferences } from "@/app/actions/user-actions"

const sql = neon(process.env.DATABASE_URL!)

export default async function UserPreferencesPage() {
  // Get the user session
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard/preferences")
  }

  // Get user preferences
  const preferences = await getUserPreferences(session.user.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Accessibility Preferences</h1>
        <p className="text-muted-foreground mt-2">
          Customize how PinkSync works for you by setting your accessibility preferences
        </p>
      </div>

      <UserPreferencesForm userId={session.user.id} initialPreferences={preferences} />
    </div>
  )
}
