"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { FcGoogle } from "react-icons/fc"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

export default function SignIn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const error = searchParams.get("error")
  const [isLoading, setIsLoading] = useState(false)
  const [signInError, setSignInError] = useState<string | null>(error)

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setSignInError(null)

      const result = await signIn("google", {
        callbackUrl,
        redirect: false,
      })

      if (result?.error) {
        setSignInError(result.error)
      } else if (result?.url) {
        router.push(result.url)
      }
    } catch (error) {
      console.error("Sign in error:", error)
      setSignInError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-pink-500"></div>
          </div>
          <CardTitle className="text-2xl font-bold">Sign in to PinkSYNC</CardTitle>
          <CardDescription>
            Access the PinkSYNC Mission Control Panel to manage videos and accessibility features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {signInError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {signInError === "Callback"
                  ? "There was an error with the OAuth callback. Please try again."
                  : signInError === "OAuthSignin"
                    ? "Error starting the OAuth sign-in process. Please try again."
                    : signInError === "OAuthCallback"
                      ? "Error completing the OAuth process. Please try again."
                      : signInError === "Configuration"
                        ? "There is a server configuration issue. Please contact support."
                        : "There was an error signing in. Please try again."}
              </AlertDescription>
            </Alert>
          )}

          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <FcGoogle className="mr-2 h-5 w-5" />
                Sign in with Google
              </>
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center space-y-2">
          <div className="text-center text-sm text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
