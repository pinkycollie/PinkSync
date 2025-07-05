import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import Link from "next/link"

export default function ForgotPasswordPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Forgot password</CardTitle>
          <CardDescription>Enter your email address and we'll send you a link to reset your password</CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
          <div className="mt-4 text-center text-sm">
            Remember your password?{" "}
            <Link href="/auth/sign-in" className="text-pink-500 hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
