import { NextResponse } from "next/server"
import { getHealthMonitor } from "@/lib/monitoring/health-checks"

export async function GET() {
  try {
    const healthMonitor = getHealthMonitor()

    // Try to get cached health status first
    let health = await healthMonitor.getCachedHealthStatus()

    // If no cached status, perform fresh health check
    if (!health) {
      health = await healthMonitor.checkHealth()
      await healthMonitor.cacheHealthStatus(health)
    }

    const statusCode = health.overall === "healthy" ? 200 : health.overall === "degraded" ? 206 : 503

    return NextResponse.json(health, { status: statusCode })
  } catch (error) {
    console.error("Health check failed:", error)

    return NextResponse.json(
      {
        overall: "unhealthy",
        services: [],
        uptime: 0,
        version: "2.0.0",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    )
  }
}

export async function POST() {
  try {
    const healthMonitor = getHealthMonitor()
    const health = await healthMonitor.checkHealth()
    await healthMonitor.cacheHealthStatus(health)

    return NextResponse.json({
      message: "Health check completed and cached",
      status: health.overall,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to perform health check",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
