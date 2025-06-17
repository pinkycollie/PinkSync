import { type NextRequest, NextResponse } from "next/server"

interface SystemHealth {
  status: "healthy" | "degraded" | "down"
  services: {
    database: boolean
    blob_storage: boolean
    vertex_ai: boolean
    fal_ai: boolean
    webhooks: boolean
  }
  environment: string
  timestamp: string
}

export async function GET(request: NextRequest) {
  try {
    const health: SystemHealth = {
      status: "healthy",
      services: {
        database: await checkDatabaseHealth(),
        blob_storage: await checkBlobStorageHealth(),
        vertex_ai: await checkVertexAIHealth(),
        fal_ai: await checkFalAIHealth(),
        webhooks: await checkWebhookHealth(),
      },
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
    }

    // Determine overall status
    const allServicesHealthy = Object.values(health.services).every(Boolean)
    health.status = allServicesHealthy ? "healthy" : "degraded"

    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      {
        status: "down",
        error: "System health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

async function checkDatabaseHealth(): Promise<boolean> {
  try {
    // Check database connection
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/profiles?select=count`, {
      headers: {
        apikey: process.env.SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
      },
    })
    return response.ok
  } catch {
    return false
  }
}

async function checkBlobStorageHealth(): Promise<boolean> {
  try {
    // Check blob storage
    return !!process.env.BLOB_READ_WRITE_TOKEN
  } catch {
    return false
  }
}

async function checkVertexAIHealth(): Promise<boolean> {
  try {
    return !!process.env.GOOGLE_CLOUD_ACCESS_TOKEN
  } catch {
    return false
  }
}

async function checkFalAIHealth(): Promise<boolean> {
  try {
    const response = await fetch("https://fal.run/fal-ai/fast-sdxl", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: "health check" }),
    })
    return response.status !== 401 // Not unauthorized
  } catch {
    return false
  }
}

async function checkWebhookHealth(): Promise<boolean> {
  try {
    return !!process.env.WEBHOOK_SECRET
  } catch {
    return false
  }
}
