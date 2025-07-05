import { SignInForm } from "@/components/auth/sign-in-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignInPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-pink-500 hover:underline">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
