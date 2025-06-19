import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { kv } from "@vercel/kv"
import { generateId } from "@/lib/utils"

const sql = neon(process.env.DATABASE_URL!)

// Initialize database tables if they don't exist
async function initDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS videos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      filename TEXT NOT NULL,
      filesize BIGINT NOT NULL,
      duration INTEGER,
      status TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      creator_id TEXT NOT NULL,
      content_type TEXT NOT NULL,
      accessibility_score INTEGER DEFAULT 0,
      processing_error TEXT
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS video_processing_jobs (
      id TEXT PRIMARY KEY,
      video_id TEXT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
      job_type TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      result JSONB,
      error TEXT
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS video_validations (
      id TEXT PRIMARY KEY,
      video_id TEXT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
      validator_id TEXT NOT NULL,
      status TEXT NOT NULL,
      feedback TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `
}

// Initialize database on first request
let dbInitialized = false

export async function POST(request: NextRequest) {
  try {
    // Initialize database if not already done
    if (!dbInitialized) {
      await initDatabase()
      dbInitialized = true
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const creatorId = formData.get("creatorId") as string

    if (!file || !title || !creatorId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate a unique ID for the video
    const videoId = generateId()

    // Store video metadata in database
    await sql`
      INSERT INTO videos (
        id, title, description, filename, filesize, status, creator_id, content_type
      ) VALUES (
        ${videoId}, 
        ${title}, 
        ${description || ""}, 
        ${file.name}, 
        ${file.size}, 
        ${"uploading"}, 
        ${creatorId}, 
        ${file.type}
      )
    `

    // Store upload status in Redis for real-time tracking
    await kv.set(`video:${videoId}:status`, "uploading")

    // Create processing job
    const jobId = generateId()
    await sql`
      INSERT INTO video_processing_jobs (
        id, video_id, job_type, status
      ) VALUES (
        ${jobId},
        ${videoId},
        ${"transcoding"},
        ${"pending"}
      )
    `

    // In a real implementation, you would upload the file to blob storage
    // and trigger a background job for processing

    // For this demo, we'll simulate the processing with a timeout
    setTimeout(async () => {
      try {
        // Update video status to processing
        await sql`
          UPDATE videos 
          SET status = ${"processing"} 
          WHERE id = ${videoId}
        `
        await kv.set(`video:${videoId}:status`, "processing")

        // Update job status
        await sql`
          UPDATE video_processing_jobs 
          SET status = ${"processing"} 
          WHERE id = ${jobId}
        `

        // Simulate processing time
        setTimeout(async () => {
          try {
            // Update video status to ready
            await sql`
              UPDATE videos 
              SET 
                status = ${"ready"},
                duration = ${Math.floor(Math.random() * 300) + 60}
              WHERE id = ${videoId}
            `
            await kv.set(`video:${videoId}:status`, "ready")

            // Update job status
            await sql`
              UPDATE video_processing_jobs 
              SET 
                status = ${"completed"},
                result = ${JSON.stringify({
                  formats: ["mp4", "webm"],
                  resolutions: ["720p", "480p", "360p"],
                  thumbnails: ["00:00:01", "00:00:10", "00:00:30"],
                })}
              WHERE id = ${jobId}
            `

            // Add to validation queue
            await kv.lpush("validation:queue", videoId)

            // Send notification
            await kv.lpush(
              "notifications",
              JSON.stringify({
                type: "video_ready",
                videoId,
                title,
                timestamp: new Date().toISOString(),
              }),
            )
          } catch (error) {
            console.error("Error completing video processing:", error)
          }
        }, 5000) // Simulate 5 seconds of processing
      } catch (error) {
        console.error("Error starting video processing:", error)
      }
    }, 2000) // Simulate 2 seconds of upload

    return NextResponse.json({
      id: videoId,
      status: "uploading",
      message: "Video upload initiated",
    })
  } catch (error) {
    console.error("Error processing video upload:", error)
    return NextResponse.json({ error: "Failed to process video upload" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Initialize database if not already done
    if (!dbInitialized) {
      await initDatabase()
      dbInitialized = true
    }

    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get("id")

    if (videoId) {
      // Get specific video
      const video = await sql`
        SELECT * FROM videos WHERE id = ${videoId}
      `

      if (video.length === 0) {
        return NextResponse.json({ error: "Video not found" }, { status: 404 })
      }

      // Get processing jobs for this video
      const jobs = await sql`
        SELECT * FROM video_processing_jobs WHERE video_id = ${videoId}
      `

      // Get validations for this video
      const validations = await sql`
        SELECT * FROM video_validations WHERE video_id = ${videoId}
      `

      return NextResponse.json({
        video: video[0],
        jobs,
        validations,
      })
    } else {
      // List all videos with pagination
      const page = Number.parseInt(searchParams.get("page") || "1")
      const limit = Number.parseInt(searchParams.get("limit") || "10")
      const offset = (page - 1) * limit

      const videos = await sql`
        SELECT * FROM videos 
        ORDER BY created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `

      const count = await sql`
        SELECT COUNT(*) FROM videos
      `

      return NextResponse.json({
        videos,
        pagination: {
          total: count[0].count,
          page,
          limit,
        },
      })
    }
  } catch (error) {
    console.error("Error fetching videos:", error)
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
  }
}
