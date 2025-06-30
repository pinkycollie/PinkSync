import { type NextRequest, NextResponse } from "next/server"
import { pinkSyncAPI } from "@/lib/pinksync-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lastSync = searchParams.get("lastSync")

    // Get recent updates
    const updates = await pinkSyncAPI.syncContentUpdates()

    return NextResponse.json({
      success: true,
      updates,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error syncing updates:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
