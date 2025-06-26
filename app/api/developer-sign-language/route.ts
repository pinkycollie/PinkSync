import { type NextRequest, NextResponse } from "next/server"
import {
  getAllDeveloperSignVideos,
  countDeveloperSignVideos,
  createDeveloperSignVideo,
} from "@/lib/developer-sign-language-db"
import { uploadDeveloperSignVideo, uploadDeveloperSignThumbnail } from "@/lib/developer-sign-blob"
import type { DeveloperSignSearchParams, SignLanguageType } from "@/types/developer-sign-language"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const params: DeveloperSignSearchParams = {
      query: searchParams.get("query") || undefined,
      category: searchParams.has("category") ? Number.parseInt(searchParams.get("category")!, 10) : undefined,
      tags: searchParams.getAll("tags").map((tag) => Number.parseInt(tag, 10)),
      signLanguageType: (searchParams.get("signLanguageType") as SignLanguageType) || undefined,
      programmingCategory: searchParams.get("programmingCategory") || undefined,
      complexity: (searchParams.get("complexity") as "Beginner" | "Intermediate" | "Advanced") || undefined,
      page: searchParams.has("page") ? Number.parseInt(searchParams.get("page")!, 10) : 1,
      limit: searchParams.has("limit") ? Number.parseInt(searchParams.get("limit")!, 10) : 20,
      sortBy: (searchParams.get("sortBy") as "newest" | "oldest" | "popular" | "alphabetical") || "newest",
    }

    const [videos, total] = await Promise.all([getAllDeveloperSignVideos(params), countDeveloperSignVideos(params)])

    return NextResponse.json({ videos, total })
  } catch (error) {
    console.error("Error in GET /api/developer-sign-language:", error)
    return NextResponse.json({ error: "Failed to fetch developer sign language videos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Get files
    const videoFile = formData.get("video") as File
    const thumbnailFile = formData.get("thumbnail") as File | null

    if (!videoFile) {
      return NextResponse.json({ error: "Video file is required" }, { status: 400 })
    }

    // Get metadata
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const categoryId = Number.parseInt(formData.get("categoryId") as string, 10)
    const signLanguageType = formData.get("signLanguageType") as SignLanguageType
    const tagsArray = formData.getAll("tags[]") as string[]
    const language = (formData.get("language") as string) || "en"
    const uploadedBy = (formData.get("uploadedBy") as string) || "system"
    const isPublic = formData.get("isPublic") !== "false" // Default to true

    if (!title || !categoryId || !signLanguageType) {
      return NextResponse.json({ error: "Title, category, and sign language type are required" }, { status: 400 })
    }

    // Upload video to Blob storage
    const videoUploadResult = await uploadDeveloperSignVideo(videoFile, {
      title,
      signLanguageType,
      category: categoryId.toString(),
    })

    // Upload thumbnail if provided
    let thumbnailUrl = ""
    if (thumbnailFile) {
      const thumbnailUploadResult = await uploadDeveloperSignThumbnail(thumbnailFile, {
        title,
        signLanguageType,
      })
      thumbnailUrl = thumbnailUploadResult.url
    }

    // Calculate duration (in a real app, you'd extract this from the video)
    const durationSeconds = 30 // Placeholder

    // Create database record
    const video = await createDeveloperSignVideo({
      blobUrl: videoUploadResult.url,
      filename: videoUploadResult.filename,
      contentType: videoUploadResult.contentType,
      sizeBytes: videoUploadResult.size,
      categoryId,
      title,
      description,
      language,
      signLanguageType,
      durationSeconds,
      thumbnailUrl,
      uploadedBy,
      isPublic,
      tags: tagsArray,
    })

    return NextResponse.json({ video }, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/developer-sign-language:", error)
    return NextResponse.json({ error: "Failed to create developer sign language video" }, { status: 500 })
  }
}
