"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function TestAuthPage() {
  const { data: session, status } = useSession()
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testApi = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/test")
      const data = await res.json()
      setApiResponse(data)
    } catch (error) {
      console.error("API test error:", error)
      setApiResponse({ error: "Failed to fetch API" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
          <CardDescription>Verify that authentication is working correctly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-muted p-4">
            <h3 className="mb-2 font-medium">Session Status: {status}</h3>
            {status === "loading" ? (
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : session ? (
              <pre className="overflow-auto rounded-md bg-muted-foreground/10 p-2 text-xs">
                {JSON.stringify(session, null, 2)}
              </pre>
            ) : (
              <p>Not signed in</p>
            )}
          </div>

          <div className="space-y-2">
            <Button onClick={testApi} disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Test API Authentication
            </Button>

            {apiResponse && (
              <div className="rounded-md bg-muted p-4 mt-4">
                <h3 className="mb-2 font-medium">API Response:</h3>
                <pre className="overflow-auto rounded-md bg-muted-foreground/10 p-2 text-xs">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-4">
            <Button asChild variant="outline">
              <Link href="/">Home</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
