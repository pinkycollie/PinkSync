"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-muted-foreground">You need to be signed in to view your profile</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { name, email, image } = session.user
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : email?.charAt(0).toUpperCase() || "U"

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Profile</h2>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={image || ""} alt={name || "User"} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <h3 className="mt-4 text-xl font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground">{email}</p>
          </CardContent>
        </Card>

        <div className="md:col-span-3 space-y-6">
          <Tabs defaultValue="account">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>View and manage your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Name</p>
                      <p className="text-sm text-muted-foreground">{name || "Not provided"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Role</p>
                      <p className="text-sm text-muted-foreground capitalize">{session.user.role || "User"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Authentication Provider</p>
                      <p className="text-sm text-muted-foreground">Google</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="videos">
              <Card>
                <CardHeader>
                  <CardTitle>Your Videos</CardTitle>
                  <CardDescription>Videos you have uploaded</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No videos found</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent actions and events</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No recent activity</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
