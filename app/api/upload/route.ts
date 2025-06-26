import { NextResponse } from "next/server"
import { requireAuth, type AuthenticatedRequest } from "@/lib/auth/middleware"
import { put } from "@vercel/blob"
import { executeQuery } from "@/lib/db"

export const POST = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const purpose = formData.get("purpose") as string // 'form_document', 'avatar_image', 'profile_picture'

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type and size
    const allowedTypes = {
      form_document: ["application/pdf", "image/jpeg", "image/png", "image/webp"],
      avatar_image: ["image/jpeg", "image/png", "image/webp"],
      profile_picture: ["image/jpeg", "image/png", "image/webp"],
    }

    const maxSizes = {
      form_document: 10 * 1024 * 1024, // 10MB
      avatar_image: 5 * 1024 * 1024, // 5MB
      profile_picture: 2 * 1024 * 1024, // 2MB
    }

    if (!allowedTypes[purpose as keyof typeof allowedTypes]?.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    if (file.size > maxSizes[purpose as keyof typeof maxSizes]) {
      return NextResponse.json({ error: "File too large" }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomId = crypto.randomUUID().slice(0, 8)
    const extension = file.name.split(".").pop()
    const filename = `${purpose}/${request.user.id}/${timestamp}-${randomId}.${extension}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    })

    // Store file metadata in database
    await executeQuery(
      `INSERT INTO file_uploads (
        id, user_id, filename, original_name, file_type, file_size, 
        purpose, blob_url, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
      [crypto.randomUUID(), request.user.id, filename, file.name, file.type, file.size, purpose, blob.url],
    )

    return NextResponse.json({
      success: true,
      file_url: blob.url,
      filename: filename,
      message: "File uploaded successfully",
    })
  } catch (error) {
    console.error("File upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
})
