"use client"

import { useAuth } from "@mbtq/auth"
import { Button } from "../button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../card"
import { Avatar, AvatarFallback, AvatarImage } from "../avatar"
import { Badge } from "../badge"
import { Loader2 } from "lucide-react"

export function UserProfile() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <p>You are not signed in.</p>
        <Button asChild className="mt-4">
          <a href="/login">Sign In</a>
        </Button>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Role</h3>
          <p className="mt-1">{user.role}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Preferred Sign Language</h3>
          <p className="mt-1">{user.preferredSignLanguage || "Not specified"}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Verification Level</h3>
          <div className="mt-1">
            {user.verificationLevel === "none" && (
              <Badge variant="outline" className="bg-gray-100">
                None
              </Badge>
            )}
            {user.verificationLevel === "basic" && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                Basic
              </Badge>
            )}
            {user.verificationLevel === "verified" && (
              <Badge variant="outline" className="bg-green-100 text-green-800">
                Verified
              </Badge>
            )}
            {user.verificationLevel === "enhanced" && (
              <Badge variant="outline" className="bg-purple-100 text-purple-800">
                Enhanced
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={handleSignOut}>
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  )
}
