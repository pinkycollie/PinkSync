import { type NextRequest, NextResponse } from "next/server"
import { signOut } from "@mbtq/auth"

export async function POST(request: NextRequest) {
  try {
    const result = await signOut()

    if (!result.success) {
      return NextResponse.json({ error: { code: "signout_failed", message: "Failed to sign out" } }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Sign out API error:", error)
    return NextResponse.json(
      { error: { code: "unknown_error", message: "An unexpected error occurred" } },
      { status: 500 },
    )
  }
}
