import { type NextRequest, NextResponse } from "next/server"
import { signIn } from "@mbtq/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: { code: "missing_fields", message: "Email and password are required" } },
        { status: 400 },
      )
    }

    const result = await signIn({ email, password })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    return NextResponse.json({ user: result.user })
  } catch (error) {
    console.error("Sign in API error:", error)
    return NextResponse.json(
      { error: { code: "unknown_error", message: "An unexpected error occurred" } },
      { status: 500 },
    )
  }
}
