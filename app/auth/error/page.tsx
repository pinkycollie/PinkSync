"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AuthError() {
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string>("An unknown error occurred")

  useEffect(() => {
    const error = searchParams.get("error")

    if (error) {
      switch (error) {
        case "Configuration":
          setErrorMessage("There is a problem with the server configuration. Please contact support.")
          break
        case "AccessDenied":
          setErrorMessage("You do not have permission to sign in.")
          break
        case "Verification":
          setErrorMessage("The verification link is invalid or has expired.")
          break
        case "OAuthSignin":
          setErrorMessage("Error in the OAuth sign-in process. Please try again.")
          break
        case "OAuthCallback":
          setErrorMessage("Error in the OAuth callback process. Please try again.")
          break
        case "OAuthCreateAccount":
          setErrorMessage("Error creating your account. Please try again.")
          break
        case "EmailCreateAccount":
          setErrorMessage("Error creating your account with email. Please try again.")
          break
        case "Callback":
          setErrorMessage("Error during the callback process. Please try again.")
          break
        case "OAuthAccountNotLinked":
          setErrorMessage("This email is already associated with another account.")
          break
        case "EmailSignin":
          setErrorMessage("The email sign-in link is invalid or has expired.")
          break
        case "CredentialsSignin":
          setErrorMessage("The credentials you provided are invalid.")
          break
        case "SessionRequired":
          setErrorMessage("You must be signed in to access this page.")
          break
        default:
          setErrorMessage(`Authentication error: ${error}`)
      }
    }
  }, [searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Authentication Error</CardTitle>
          <CardDescription>There was a problem signing you in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signin">Try Again</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
