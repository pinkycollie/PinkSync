import { type NextRequest, NextResponse } from "next/server"
import { pinkSyncAPI } from "@/lib/pinksync-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || undefined
    const search = searchParams.get("search") || undefined

    let content = await pinkSyncAPI.getAllSignLanguageContent(category)

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase()
      content = content.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower),
      )
    }

    return NextResponse.json({
      success: true,
      content: content.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        qr_code_data: item.qr_code_data,
        video_url: item.video_url,
        model_3d_url: item.model_3d_url,
        ar_preview_url: item.ar_preview_url,
        languages: item.languages,
        created_at: item.created_at,
      })),
    })
  } catch (error) {
    console.error("Error fetching library content:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentData = await request.json()

    const newContent = await pinkSyncAPI.createSignLanguageContent({
      title: contentData.title,
      description: contentData.description,
      category: contentData.category,
      qr_code_data: contentData.qr_code_data || `content-${Date.now()}`,
      languages: contentData.languages || ["ASL"],
      is_active: true,
      metadata: contentData.metadata || {},
    })

    if (!newContent) {
      return NextResponse.json({ error: "Failed to create content" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      content: newContent,
    })
  } catch (error) {
    console.error("Error creating library content:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
