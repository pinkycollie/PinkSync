import { type NextRequest, NextResponse } from "next/server"
import { incrementViewCount, getDeveloperSignVideoById } from "@/lib/developer-sign-language-db"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id, 10)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const video = await getDeveloperSignVideoById(id)

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    await incrementViewCount(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error in POST /api/developer-sign-language/${params.id}/view:`, error)
    return NextResponse.json({ error: "Failed to increment view count" }, { status: 500 })
  }
}
