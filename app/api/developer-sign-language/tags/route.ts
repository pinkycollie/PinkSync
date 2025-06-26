import { type NextRequest, NextResponse } from "next/server"
import { getAllTags } from "@/lib/developer-sign-language-db"

export async function GET(request: NextRequest) {
  try {
    const tags = await getAllTags()

    return NextResponse.json({ tags })
  } catch (error) {
    console.error("Error in GET /api/developer-sign-language/tags:", error)
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 })
  }
}
