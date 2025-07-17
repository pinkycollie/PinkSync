import { type NextRequest, NextResponse } from "next/server"
import { DeafImpactTransparencyTracker } from "@/lib/transparency/deaf-impact-tracker"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dataType = searchParams.get("type")
    const jurisdiction = searchParams.get("jurisdiction")
    const timeframe = searchParams.get("timeframe") || "yearly"

    const tracker = new DeafImpactTransparencyTracker()

    let data: any = {}

    switch (dataType) {
      case "fcc":
        data = await tracker.fetchFCCTelecommunicationsData()
        break

      case "tax-credits":
        data = await tracker.fetchTaxCreditData(jurisdiction || undefined)
        break

      case "community-impact":
        data = await tracker.calculateCommunityImpact(timeframe as any)
        break

      case "transparency-report":
        data = await tracker.generateTransparencyReport(jurisdiction || "national", timeframe)
        break

      case "all":
      default:
        data = {
          fccData: await tracker.fetchFCCTelecommunicationsData(),
          taxCredits: await tracker.fetchTaxCreditData(jurisdiction || undefined),
          communityImpact: await tracker.calculateCommunityImpact(timeframe as any),
          lastUpdated: new Date().toISOString(),
        }
        break
    }

    return NextResponse.json({
      success: true,
      data,
      metadata: {
        dataType,
        jurisdiction,
        timeframe,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Transparency data fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch transparency data" }, { status: 500 })
  }
}
