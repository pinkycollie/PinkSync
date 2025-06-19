import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { SignLanguageService, type SignLanguageRequest } from "@/lib/sign-language/sign-language-service"
import { mcpClient } from "@/lib/mcp/service-client"

// POST endpoint to submit a new sign language generation request
export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions)

    // Parse request body
    const body = await request.json()

    // Validate request
    if (!body.text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Get user preferences from centralized store
    let userPreferences = {}
    if (session?.user?.id) {
      try {
        userPreferences = await mcpClient.getUserPreferences(session.user.id)
      } catch (error) {
        console.warn("Could not fetch user preferences:", error)
      }
    }

    // Create request object with user preferences as defaults
    const signLanguageRequest: SignLanguageRequest = {
      text: body.text,
      targetDialect: body.targetDialect || userPreferences.signLanguageDialect || "asl",
      avatarStyle: body.avatarStyle || userPreferences.avatarStyle || "realistic",
      quality: body.quality || userPreferences.quality || "standard",
      userId: session?.user?.id,
    }

    // Submit request through centralized service
    const service = new SignLanguageService()
    const response = await service.submitRequest(signLanguageRequest)

    // Track analytics event
    if (session?.user?.id) {
      try {
        await mcpClient.trackEvent("sign_language_request_submitted", {
          userId: session.user.id,
          requestId: response.requestId,
          dialect: signLanguageRequest.targetDialect,
          avatarStyle: signLanguageRequest.avatarStyle,
          quality: signLanguageRequest.quality,
          textLength: signLanguageRequest.text.length,
        })
      } catch (error) {
        console.warn("Could not track analytics event:", error)
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error submitting sign language request:", error)
    return NextResponse.json({ error: "Failed to submit sign language request" }, { status: 500 })
  }
}

// GET endpoint to list user's sign language requests
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Get user's requests from database
    const service = new SignLanguageService()
    const requests = await service.getUserRequests(session.user.id, limit, offset)

    return NextResponse.json(requests)
  } catch (error) {
    console.error("Error getting sign language requests:", error)
    return NextResponse.json({ error: "Failed to get sign language requests" }, { status: 500 })
  }
}
