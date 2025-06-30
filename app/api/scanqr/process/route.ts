import { type NextRequest, NextResponse } from "next/server"
import { pinkSyncAPI } from "@/lib/pinksync-api"
import { aiProcessingService } from "@/lib/ai-processing"

export async function POST(request: NextRequest) {
  try {
    const { qrCodeData, sessionId } = await request.json()

    if (!qrCodeData) {
      return NextResponse.json({ error: "QR code data is required" }, { status: 400 })
    }

    // Get content from database
    const content = await pinkSyncAPI.getSignLanguageContent(qrCodeData)

    if (!content) {
      return NextResponse.json({ error: "Content not found for this QR code" }, { status: 404 })
    }

    // Track the scan
    const userAgent = request.headers.get("user-agent") || undefined
    const forwardedFor = request.headers.get("x-forwarded-for")
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0] : request.ip

    await pinkSyncAPI.trackQRScan({
      content_id: content.id,
      qr_code_data: qrCodeData,
      user_agent: userAgent,
      ip_address: ipAddress,
      session_id: sessionId,
    })

    // If content doesn't have generated media, trigger AI processing
    if (!content.video_url || !content.model_3d_url) {
      const processingJob = await pinkSyncAPI.createProcessingJob({
        content_id: content.id,
        job_type: "generate_video",
        input_data: {
          text: content.description,
          language: content.languages[0] || "ASL",
          style: content.category === "Safety" ? "emergency" : "formal",
        },
      })

      if (processingJob) {
        // Trigger background processing
        processContentInBackground(processingJob.id, content)
      }
    }

    return NextResponse.json({
      success: true,
      content: {
        id: content.id,
        title: content.title,
        description: content.description,
        category: content.category,
        video_url: content.video_url,
        model_3d_url: content.model_3d_url,
        ar_preview_url: content.ar_preview_url,
        languages: content.languages,
      },
    })
  } catch (error) {
    console.error("Error processing QR code:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Background processing function
async function processContentInBackground(jobId: string, content: any) {
  try {
    // Update job status to processing
    await pinkSyncAPI.updateProcessingJob(jobId, { status: "processing" })

    // Generate sign language content using AI
    const result = await aiProcessingService.processSignLanguageContent({
      text: content.description,
      language: content.languages[0] || "ASL",
      style: content.category === "Safety" ? "emergency" : "formal",
    })

    // Update the content with generated URLs
    // In a real implementation, you'd update the database here

    // Update job status to completed
    await pinkSyncAPI.updateProcessingJob(jobId, {
      status: "completed",
      output_data: result,
      completed_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in background processing:", error)
    await pinkSyncAPI.updateProcessingJob(jobId, {
      status: "failed",
      error_message: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
