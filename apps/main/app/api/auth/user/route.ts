import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@mbtq/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: { code: "not_authenticated", message: "Not authenticated" } }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Get user API error:", error)
    return NextResponse.json(
      { error: { code: "unknown_error", message: "An unexpected error occurred" } },
      { status: 500 },
    )
  }
}
