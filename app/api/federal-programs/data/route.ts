import { type NextRequest, NextResponse } from "next/server"
import { FederalProgramsTracker } from "@/lib/federal-programs/deaf-blind-equipment-program"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const state = searchParams.get("state") || "national"

    const tracker = new FederalProgramsTracker()

    const data = {
      ndbedp: await tracker.fetchNDBEDPData(),
      vocationalRehab: await tracker.fetchVocationalRehabilitationData(),
      federalAgencies: await tracker.fetchFederalAgenciesData(),
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data,
      metadata: {
        state,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Federal programs data fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch federal programs data" }, { status: 500 })
  }
}
