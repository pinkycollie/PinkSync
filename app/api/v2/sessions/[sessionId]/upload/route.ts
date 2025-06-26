import { NextResponse } from "next/server"
import { requireAuth, type AuthenticatedRequest } from "@/lib/auth/middleware-v2"
import { executeQuery } from "@/lib/db/connection"
import type { VCodeSession } from "@/lib/db/schema"
import { VisualFeedbackManager } from "@/lib/api/visual-feedback"
import { put } from "@vercel/blob"

export const PUT = requireAuth(async (request: AuthenticatedRequest, { params }: { params: { sessionId: string } }) => {
  try {
    const sessionId = params.sessionId

    // Verify session exists and belongs to user
    const sessions = await executeQuery<VCodeSession>(
      "SELECT * FROM vcode_sessions WHERE id = $1 AND user_id = $2 AND status IN ('created', 'uploading')",
      [sessionId, request.user.id],
    )

    const session = sessions[0]
    if (!session) {
      const feedback = VisualFeedbackManager.createFeedback("error", "Session not found or expired")
      const response = VisualFeedbackManager.createApiResponse(false, null, "Invalid session", "SESSION_003", feedback)
      return NextResponse.json(response, { status: 404 })
    }

    // Check if session is expired
    if (new Date() > session.expires_at) {
      await executeQuery("UPDATE vcode_sessions SET status = $1 WHERE id = $2", ["failed", sessionId])

      const feedback = VisualFeedbackManager.createFeedback(
        "error",
        "Session has expired. Please create a new session.",
      )
      const response = VisualFeedbackManager.createApiResponse(false, null, "Session expired", "SESSION_004", feedback)
      return NextResponse.json(response, { status: 410 })
    }

    const formData = await request.formData()
    const videoFile = formData.get("video") as File

    if (!videoFile) {
      const feedback = VisualFeedbackManager.createFeedback("error", "Please select a video file to upload")
      const response = VisualFeedbackManager.createApiResponse(
        false,
        null,
        "No video file provided",
        "UPLOAD_001",
        feedback,
      )
      return NextResponse.json(response, { status: 400 })
    }

    // Validate video file
    const allowedTypes = ["video/mp4", "video/webm", "video/quicktime"]
    const maxSize = 50 * 1024 * 1024 // 50MB

    if (!allowedTypes.includes(videoFile.type)) {
      const feedback = VisualFeedbackManager.createFeedback(
        "error",
        "Please upload a valid video file (MP4, WebM, or MOV)",
      )
      const response = VisualFeedbackManager.createApiResponse(
        false,
        null,
        "Invalid video format",
        "UPLOAD_002",
        feedback,
      )
      return NextResponse.json(response, { status: 400 })
    }

    if (videoFile.size > maxSize) {
      const feedback = VisualFeedbackManager.createFeedback("error", "Video file is too large. Maximum size is 50MB.")
      const response = VisualFeedbackManager.createApiResponse(false, null, "File too large", "UPLOAD_003", feedback)
      return NextResponse.json(response, { status: 400 })
    }

    // Update session status to uploading
    await executeQuery("UPDATE vcode_sessions SET status = $1, updated_at = NOW() WHERE id = $2", [
      "uploading",
      sessionId,
    ])

    // Upload video to Vercel Blob
    const filename = `vcode-sessions/${sessionId}/${Date.now()}-${videoFile.name}`
    const blob = await put(filename, videoFile, {
      access: "private", // Private access for security
      addRandomSuffix: false,
    })

    // Update session with video URL and set to processing
    await executeQuery("UPDATE vcode_sessions SET video_url = $1, status = $2, updated_at = NOW() WHERE id = $3", [
      blob.url,
      "processing",
      sessionId,
    ])

    // Start video processing (async)
    processVideoAsync(sessionId, blob.url).catch((error) => {
      console.error("Video processing error:", error)
    })

    const feedback = VisualFeedbackManager.createFeedback(
      "processing",
      "Video uploaded successfully. Processing your sign language...",
    )

    const response = VisualFeedbackManager.createApiResponse(
      true,
      {
        session_id: sessionId,
        status: "processing",
        video_url: blob.url,
        transform_url: `/api/v2/sessions/${sessionId}/transform`,
      },
      undefined,
      undefined,
      feedback,
    )

    return NextResponse.json(response)
  } catch (error) {
    console.error("Video upload error:", error)

    const feedback = VisualFeedbackManager.createFeedback("error", "Failed to upload video. Please try again.")
    const response = VisualFeedbackManager.createApiResponse(false, null, "Upload failed", "UPLOAD_004", feedback)
    return NextResponse.json(response, { status: 500 })
  }
})

async function processVideoAsync(sessionId: string, videoUrl: string): Promise<void> {
  try {
    // Simulate video processing (replace with actual ML/AI processing)
    await new Promise((resolve) => setTimeout(resolve, 5000))

    // Mock processed data
    const processedData = {
      detected_signs: ["hello", "world", "confirm"],
      confidence_scores: [0.95, 0.87, 0.92],
      video_duration: 3.2,
      frame_count: 96,
      processing_time: 4.8,
    }

    // Update session with processed data
    await executeQuery("UPDATE vcode_sessions SET processed_data = $1, status = $2, updated_at = NOW() WHERE id = $3", [
      JSON.stringify(processedData),
      "transforming",
      sessionId,
    ])
  } catch (error) {
    console.error("Video processing failed:", error)
    await executeQuery("UPDATE vcode_sessions SET status = $1, updated_at = NOW() WHERE id = $2", ["failed", sessionId])
  }
}
