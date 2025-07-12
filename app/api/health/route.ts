import { NextResponse } from "next/server"
import { validateConfig } from "@/lib/config/auth-config"

export async function GET() {
  try {
    // Validate configuration
    validateConfig()

    return NextResponse.json({
      status: "healthy",
      service: "vcode.pinksync.io",
      version: "v2.0.0",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        service: "vcode.pinksync.io",
        error: error instanceof Error ? error.message : "Configuration error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
