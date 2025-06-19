import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { handler as authOptions } from "../[...nextauth]/route"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      {
        error: "Not authenticated",
        message: "You must be signed in to access this endpoint",
      },
      { status: 401 },
    )
  }

  return NextResponse.json({
    authenticated: true,
    user: session.user,
    message: "Authentication is working correctly",
  })
}
