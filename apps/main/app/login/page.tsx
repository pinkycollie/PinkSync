import { SignInForm } from "@mbtq/ui/auth"
import { getUser } from "@mbtq/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  // Check if the user is already logged in
  const user = await getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome Back</h1>
        <SignInForm />
      </div>
    </div>
  )
}
