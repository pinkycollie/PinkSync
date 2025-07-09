import { type NextRequest, NextResponse } from "next/server"
import { getAllCategories } from "@/lib/developer-sign-language-db"

export async function GET(request: NextRequest) {
  try {
    const categories = await getAllCategories()

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Error in GET /api/developer-sign-language/categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
