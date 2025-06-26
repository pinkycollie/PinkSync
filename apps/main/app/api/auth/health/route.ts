import { NextResponse } from "next/server"
import { checkKVConnection } from "@mbtq/auth/kv-config"

export async function GET() {
  try {
    const kvConnected = await checkKVConnection()

    return NextResponse.json({
      status: "ok",
      services: {
        kv: kvConnected ? "connected" : "disconnected",
        deafAuth: process.env.DEAFAUTH_URL ? "configured" : "not configured",
        fibonRose: process.env.FIBONROSE_URL ? "configured" : "not configured",
      },
    })
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Health check failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
