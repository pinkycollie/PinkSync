import { type NextRequest, NextResponse } from "next/server"
import { getDeveloperSignVideosByTag } from "@/lib/developer-sign-language-db"

export async function GET(request: NextRequest, { params }: { params: { name: string } }) {
  try {
    const tagName = decodeURIComponent(params.name)

    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.has("limit") ? Number.parseInt(searchParams.get("limit")!, 10) : 20

    const videos = await getDeveloperSignVideosByTag(tagName, limit)

    return NextResponse.json({ videos })
  } catch (error) {
    console.error(`Error in GET /api/developer-sign-language/tag/${params.name}:`, error)
    return NextResponse.json({ error: "Failed to fetch videos by tag" }, { status: 500 })
  }
}
