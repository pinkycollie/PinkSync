import { signLanguageWorker } from "../lib/workers/sign-language-worker"

/**
 * Cloud Function to process sign language generation requests
 * Deploy this to Google Cloud Functions, AWS Lambda, or Vercel Functions
 */
export default async function handler(req: any, res: any) {
  try {
    console.log("Sign language worker function triggered")

    // Process queue for a limited time (to avoid timeout)
    const startTime = Date.now()
    const maxProcessingTime = 50000 // 50 seconds (leave buffer for Cloud Function timeout)
    let processedCount = 0

    while (Date.now() - startTime < maxProcessingTime) {
      const processed = await signLanguageWorker.service.processNextRequest()

      if (!processed) {
        break // No more requests to process
      }

      processedCount++
    }

    console.log(`Processed ${processedCount} sign language requests`)

    res.status(200).json({
      success: true,
      processedCount,
      processingTime: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in sign language worker function:", error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
