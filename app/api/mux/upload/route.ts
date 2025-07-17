import { type NextRequest, NextResponse } from "next/server"
import { muxVideoManager } from "@/lib/video/mux-integration"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, category, signer, transcript } = body

    if (!title || !category || !signer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const uploadConfig = await muxVideoManager.createDirectUpload({
      title,
      category,
      signer,
      transcript: transcript || "",
    })

    return NextResponse.json({
      success: true,
      uploadUrl: uploadConfig.uploadUrl,
      uploadId: uploadConfig.uploadId,
      assetId: uploadConfig.assetId,
    })
  } catch (error) {
    console.error("Mux upload creation error:", error)
    return NextResponse.json({ error: "Failed to create upload" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const assetId = searchParams.get("assetId")

    if (!assetId) {
      return NextResponse.json({ error: "Asset ID required" }, { status: 400 })
    }

    const assetInfo = await muxVideoManager.getAssetInfo(assetId)

    if (!assetInfo) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      asset: assetInfo,
    })
  } catch (error) {
    console.error("Mux asset fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch asset" }, { status: 500 })
  }
}
