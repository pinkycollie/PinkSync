import { getUser } from "@mbtq/auth"
import { redirect } from "next/navigation"
import { FundingRequestForm } from "@mbtq/ui/vr-client/funding-request-form"
import { Button } from "@mbtq/ui/button"
import Link from "next/link"

export default async function FundingRequestPage() {
  // Check if the user is authenticated
  const user = await getUser()
  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Request Funding</h1>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>

        <FundingRequestForm />
      </div>
    </div>
  )
}
