import { Queue } from "bullmq"

// Initialize the BullMQ queue.
// Ensure REDIS_HOST and REDIS_PORT are set in your environment variables.
const videoQueue = new Queue("video-processing", {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number.parseInt(process.env.REDIS_PORT || "6379"),
  },
})

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Add job to queue with options for retries and exponential backoff
    const job = await videoQueue.add("process-asl-video", data, {
      attempts: 3, // Retry up to 3 times
      backoff: {
        type: "exponential", // Exponential backoff strategy
        delay: 1000, // Initial delay of 1 second
      },
    })

    // Return the job ID upon successful queuing
    return new Response(JSON.stringify({ jobId: job.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Failed to add job to queue:", error)
    return new Response(JSON.stringify({ error: "Failed to process request" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
