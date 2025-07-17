import { type NextRequest, NextResponse } from "next/server"
import { aslVideoManager } from "@/lib/asl-video/video-management"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const videoFile = formData.get("video") as File
    const metadataJson = formData.get("metadata") as string

    if (!videoFile || !metadataJson) {
      return NextResponse.json({ error: "Video file and metadata are required" }, { status: 400 })
    }

    const metadata = JSON.parse(metadataJson)

    // Validate file type and size
    if (!videoFile.type.startsWith("video/")) {
      return NextResponse.json({ error: "File must be a video" }, { status: 400 })
    }

    // Max file size: 500MB
    if (videoFile.size > 500 * 1024 * 1024) {
      return NextResponse.json({ error: "Video file too large (max 500MB)" }, { status: 400 })
    }

    const videoId = await aslVideoManager.uploadVideo(videoFile, metadata)

    return NextResponse.json({
      success: true,
      videoId,
      message: "Video uploaded successfully",
    })
  } catch (error) {
    console.error("Video upload error:", error)
    return NextResponse.json({ error: "Failed to upload video" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const category = searchParams.get("category") || undefined
    const signer = searchParams.get("signer") || undefined
    const priority = searchParams.get("priority") || undefined
    const tags = searchParams.get("tags")?.split(",") || undefined

    const videos = await aslVideoManager.searchVideos(query, {
      category,
      signer,
      tags,
      priority,
    })

    return NextResponse.json({
      success: true,
      videos,
      count: videos.length,
    })
  } catch (error) {
    console.error("Video search error:", error)
    return NextResponse.json({ error: "Failed to search videos" }, { status: 500 })
  }
}
