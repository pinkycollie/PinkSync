import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/sign-in")
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Welcome, {session.user.name}</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Sync Status</CardTitle>
            <CardDescription>Your data synchronization status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <p>All systems synchronized</p>
            </div>
            <Button className="mt-4 w-full bg-pink-500 hover:bg-pink-600">View Details</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connected Apps</CardTitle>
            <CardDescription>Apps using PinkSync</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">3 apps connected</p>
            <Button className="w-full bg-pink-500 hover:bg-pink-600">Manage Apps</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accessibility Settings</CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Default settings applied</p>
            <Button className="w-full bg-pink-500 hover:bg-pink-600">Configure</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
