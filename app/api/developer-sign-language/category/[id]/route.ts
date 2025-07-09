import { type NextRequest, NextResponse } from "next/server"
import { getDeveloperSignVideosByCategory } from "@/lib/developer-sign-language-db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id, 10)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid category ID format" }, { status: 400 })
    }

    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.has("limit") ? Number.parseInt(searchParams.get("limit")!, 10) : 20

    const videos = await getDeveloperSignVideosByCategory(id, limit)

    return NextResponse.json({ videos })
  } catch (error) {
    console.error(`Error in GET /api/developer-sign-language/category/${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch videos by category" }, { status: 500 })
  }
}
