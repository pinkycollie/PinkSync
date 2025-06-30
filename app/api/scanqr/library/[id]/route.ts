import { type NextRequest, NextResponse } from "next/server"
import { pinkSyncAPI } from "@/lib/pinksync-api"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const content = await pinkSyncAPI.getSignLanguageContent(params.id)

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }

    // Get analytics data
    const analytics = await pinkSyncAPI.getQRScanAnalytics(content.id)

    return NextResponse.json({
      success: true,
      content: {
        id: content.id,
        title: content.title,
        description: content.description,
        category: content.category,
        qr_code_data: content.qr_code_data,
        video_url: content.video_url,
        model_3d_url: content.model_3d_url,
        ar_preview_url: content.ar_preview_url,
        languages: content.languages,
        created_at: content.created_at,
        updated_at: content.updated_at,
        metadata: content.metadata,
      },
      analytics,
    })
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
