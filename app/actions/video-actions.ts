"use server"

import { revalidatePath } from "next/cache"
import { neon } from "@neondatabase/serverless"
import { kv } from "@vercel/kv"
import { generateId } from "@/lib/utils"

const sql = neon(process.env.DATABASE_URL!)

export async function getVideoStatus(videoId: string) {
  try {
    const status = await kv.get(`video:${videoId}:status`)
    return { status }
  } catch (error) {
    console.error("Error getting video status:", error)
    return { error: "Failed to get video status" }
  }
}

export async function getVideoProcessingProgress(videoId: string) {
  try {
    const video = await sql`
      SELECT * FROM videos WHERE id = ${videoId}
    `

    if (video.length === 0) {
      return { error: "Video not found" }
    }

    const jobs = await sql`
      SELECT * FROM video_processing_jobs WHERE video_id = ${videoId}
    `

    // Calculate overall progress based on job statuses
    const totalJobs = jobs.length
    const completedJobs = jobs.filter((job) => job.status === "completed").length
    const progress = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0

    return {
      status: video[0].status,
      progress,
      jobs: jobs.map((job) => ({
        type: job.job_type,
        status: job.status,
        result: job.result,
      })),
    }
  } catch (error) {
    console.error("Error getting video processing progress:", error)
    return { error: "Failed to get video processing progress" }
  }
}

export async function validateVideo(videoId: string, validatorId: string, status: string, feedback: string) {
  try {
    const validationId = generateId()

    await sql`
      INSERT INTO video_validations (
        id, video_id, validator_id, status, feedback
      ) VALUES (
        ${validationId},
        ${videoId},
        ${validatorId},
        ${status},
        ${feedback}
      )
    `

    // Update video status based on validation
    await sql`
      UPDATE videos 
      SET status = ${status === "approved" ? "published" : "rejected"}
      WHERE id = ${videoId}
    `

    // Send notification
    await kv.lpush(
      "notifications",
      JSON.stringify({
        type: "video_validated",
        videoId,
        status,
        timestamp: new Date().toISOString(),
      }),
    )

    revalidatePath("/dashboard/validator")
    revalidatePath(`/dashboard/videos/${videoId}`)

    return { success: true, validationId }
  } catch (error) {
    console.error("Error validating video:", error)
    return { error: "Failed to validate video" }
  }
}

export async function getValidationQueue(limit = 10) {
  try {
    // Get videos in validation queue
    const videoIds = await kv.lrange("validation:queue", 0, limit - 1)

    if (!videoIds || videoIds.length === 0) {
      return { videos: [] }
    }

    // Get video details for each ID
    const videos = []
    for (const videoId of videoIds) {
      const video = await sql`
        SELECT * FROM videos WHERE id = ${videoId}
      `

      if (video.length > 0) {
        videos.push(video[0])
      }
    }

    return { videos }
  } catch (error) {
    console.error("Error getting validation queue:", error)
    return { error: "Failed to get validation queue" }
  }
}
