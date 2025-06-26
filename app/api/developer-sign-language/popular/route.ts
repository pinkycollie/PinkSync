import { type NextRequest, NextResponse } from "next/server"
import { getPopularDeveloperSignVideos } from "@/lib/developer-sign-language-db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.has("limit") ? Number.parseInt(searchParams.get("limit")!, 10) : 10

    const videos = await getPopularDeveloperSignVideos(limit)

    return NextResponse.json({ videos })
  } catch (error) {
    console.error("Error in GET /api/developer-sign-language/popular:", error)
    return NextResponse.json({ error: "Failed to fetch popular videos" }, { status: 500 })
  }
}
