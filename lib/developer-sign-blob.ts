import { put, del, list } from "@vercel/blob"
import { nanoid } from "nanoid"

export async function uploadDeveloperSignVideo(
  file: File,
  metadata: Record<string, string> = {},
): Promise<{ url: string; filename: string; contentType: string; size: number }> {
  try {
    // Generate a unique filename with original extension
    const originalFilename = file.name
    const extension = originalFilename.split(".").pop() || "mp4"
    const uniqueFilename = `${nanoid()}.${extension}`
    const pathname = `developer-sign-language/${uniqueFilename}`

    // Upload to Vercel Blob
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type,
      metadata,
    })

    return {
      url: blob.url,
      filename: originalFilename,
      contentType: file.type,
      size: file.size,
    }
  } catch (error) {
    console.error("Error uploading developer sign video:", error)
    throw error
  }
}

export async function uploadDeveloperSignThumbnail(
  file: File,
  metadata: Record<string, string> = {},
): Promise<{ url: string }> {
  try {
    // Generate a unique filename with original extension
    const originalFilename = file.name
    const extension = originalFilename.split(".").pop() || "jpg"
    const uniqueFilename = `${nanoid()}.${extension}`
    const pathname = `developer-sign-language/thumbnails/${uniqueFilename}`

    // Upload to Vercel Blob
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type,
      metadata,
    })

    return {
      url: blob.url,
    }
  } catch (error) {
    console.error("Error uploading developer sign thumbnail:", error)
    throw error
  }
}

export async function deleteDeveloperSignFile(url: string): Promise<void> {
  try {
    await del(url)
  } catch (error) {
    console.error(`Error deleting file at ${url}:`, error)
    throw error
  }
}

export async function listDeveloperSignVideos(
  prefix = "developer-sign-language/",
  limit = 100,
): Promise<{ url: string; pathname: string; contentType: string; size: number }[]> {
  try {
    const { blobs } = await list({ prefix, limit })
    return blobs
  } catch (error) {
    console.error("Error listing developer sign videos:", error)
    throw error
  }
}
