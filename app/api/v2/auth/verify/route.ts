import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/middleware/auth"
import { createApiResponse, visualFeedback } from "@/lib/visual-feedback"

export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request)

  if (!auth.authenticated) {
    return auth.response!
  }

  return NextResponse.json(
    createApiResponse(
      "success",
      {
        valid: true,
        user: {
          id: auth.user!.id,
          email: auth.user!.email,
          name: auth.user!.name,
          roles: auth.user!.roles,
          verified: auth.user!.verified,
        },
        service: "vcode.pinksync.io",
        authType: auth.authType,
      },
      visualFeedback.success({
        icon: "check-circle",
        color: "green",
        animation: "none",
        vibration: false,
      }),
    ),
  )
}
