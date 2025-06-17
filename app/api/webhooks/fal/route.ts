import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { put } from "@vercel/blob"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature
    const signature = request.headers.get("x-fal-signature")
    const body = await request.text()

    if (!verifyWebhookSignature(body, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const payload = JSON.parse(body)
    const { request_id, status, output } = payload

    switch (status) {
      case "COMPLETED":
        await handleVideoCompleted(request_id, output)
        break
      case "FAILED":
        await handleVideoFailed(request_id, payload.error)
        break
      case "IN_PROGRESS":
        await handleVideoProgress(request_id, payload.progress)
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Fal webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handleVideoCompleted(requestId: string, output: any) {
  try {
    // 1. Download video from Fal.ai
    const videoResponse = await fetch(output.video.url)
    const videoBlob = await videoResponse.blob()

    // 2. Store video in Vercel Blob
    const { url: blobUrl } = await put(`videos/${requestId}.mp4`, videoBlob, {
      access: "public",
      contentType: "video/mp4",
    })

    // 3. Update database with completed video
    const { data: videoRecord } = await supabase
      .from("government_documents")
      .update({
        status: "completed",
        file_url: blobUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("document_id", requestId)
      .select()
      .single()

    if (videoRecord) {
      // 4. Trigger post-processing workflow
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/automation/workflow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "video_completion",
          userId: videoRecord.user_id,
          data: {
            videoId: videoRecord.id,
            videoUrl: blobUrl,
            accessibilityFeatures: [], // Would be stored in metadata
          },
        }),
      })

      // 5. Send real-time notification
      await sendRealtimeUpdate(videoRecord.user_id, "video_completed", {
        videoId: videoRecord.id,
        videoUrl: blobUrl,
      })
    }
  } catch (error) {
    console.error("Error handling completed video:", error)
  }
}

async function handleVideoFailed(requestId: string, error: any) {
  await supabase
    .from("government_documents")
    .update({
      status: "failed",
      updated_at: new Date().toISOString(),
    })
    .eq("document_id", requestId)

  // Notify user of failure and potentially retry
  console.log(`Video generation failed for request ${requestId}:`, error)
}

async function handleVideoProgress(requestId: string, progress: number) {
  // Update progress in database or send real-time update
  console.log(`Video generation progress for ${requestId}: ${progress}%`)
}

function verifyWebhookSignature(body: string, signature: string | null): boolean {
  if (!signature || !process.env.WEBHOOK_SECRET) return false

  // Implement signature verification logic
  // This would typically use HMAC with your webhook secret
  return true // Simplified for example
}

async function sendRealtimeUpdate(userId: string, event: string, data: any) {
  // Send real-time update via WebSocket or Server-Sent Events
  console.log(`Sending real-time update to user ${userId}:`, event, data)
}
