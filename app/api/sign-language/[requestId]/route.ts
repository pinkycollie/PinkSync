import { type NextRequest, NextResponse } from "next/server"
import { SignLanguageService } from "@/lib/sign-language/sign-language-service"

// GET endpoint to check the status of a sign language generation request
export async function GET(request: NextRequest, { params }: { params: { requestId: string } }) {
  try {
    const { requestId } = params

    if (!requestId) {
      return NextResponse.json({ error: "Request ID is required" }, { status: 400 })
    }

    const service = new SignLanguageService()
    const response = await service.getRequestStatus(requestId)

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error getting sign language request status:", error)

    if (error instanceof Error && error.message === "Request not found") {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    return NextResponse.json({ error: "Failed to get sign language request status" }, { status: 500 })
  }
}
