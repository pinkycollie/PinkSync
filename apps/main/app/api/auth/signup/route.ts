import { type NextRequest, NextResponse } from "next/server"
import { signUp } from "@mbtq/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, preferredSignLanguage, requiresVisualFeedback } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: { code: "missing_fields", message: "Email, password, and name are required" } },
        { status: 400 },
      )
    }

    const result = await signUp({
      email,
      password,
      name,
      preferredSignLanguage,
      requiresVisualFeedback,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ user: result.user })
  } catch (error) {
    console.error("Sign up API error:", error)
    return NextResponse.json(
      { error: { code: "unknown_error", message: "An unexpected error occurred" } },
      { status: 500 },
    )
  }
}
