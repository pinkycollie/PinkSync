import { type NextRequest, NextResponse } from "next/server"
import {
  getDeveloperSignVideoById,
  updateDeveloperSignVideo,
  deleteDeveloperSignVideo,
} from "@/lib/developer-sign-language-db"
import { deleteDeveloperSignFile } from "@/lib/developer-sign-blob"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id, 10)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const video = await getDeveloperSignVideoById(id)

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    return NextResponse.json({ video })
  } catch (error) {
    console.error(`Error in GET /api/developer-sign-language/${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch developer sign language video" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id, 10)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const video = await getDeveloperSignVideoById(id)

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    const updates = await request.json()

    const updatedVideo = await updateDeveloperSignVideo(id, updates)

    return NextResponse.json({ video: updatedVideo })
  } catch (error) {
    console.error(`Error in PATCH /api/developer-sign-language/${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update developer sign language video" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id, 10)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const video = await getDeveloperSignVideoById(id)

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    // Delete from Blob storage
    await deleteDeveloperSignFile(video.blobUrl)

    if (video.thumbnailUrl) {
      await deleteDeveloperSignFile(video.thumbnailUrl)
    }

    // Delete from database
    const success = await deleteDeveloperSignVideo(id)

    return NextResponse.json({ success })
  } catch (error) {
    console.error(`Error in DELETE /api/developer-sign-language/${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete developer sign language video" }, { status: 500 })
  }
}
