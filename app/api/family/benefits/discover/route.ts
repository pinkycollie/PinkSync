import { type NextRequest, NextResponse } from "next/server"
import { FamilyBenefitMonitor } from "@/lib/family-monitoring/family-benefit-monitor"

export async function POST(request: NextRequest) {
  try {
    const { familyId } = await request.json()

    if (!familyId) {
      return NextResponse.json({ error: "Family ID required" }, { status: 400 })
    }

    const monitor = new FamilyBenefitMonitor()

    // Discover all available benefits for the family
    const opportunities = await monitor.discoverFamilyBenefits(familyId)

    // Generate comprehensive family benefit report
    const report = await monitor.generateFamilyBenefitReport(familyId)

    // Start continuous monitoring for the family
    await monitor.monitorFamilyBenefitChanges(familyId)

    return NextResponse.json({
      success: true,
      opportunitiesFound: opportunities.length,
      totalPotentialValue: opportunities.reduce((sum, opp) => sum + opp.potentialValue, 0),
      opportunities,
      report,
      monitoring: {
        status: "active",
        nextCheck: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    })
  } catch (error) {
    console.error("Family benefit discovery error:", error)
    return NextResponse.json({ error: "Failed to discover family benefits" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const familyId = searchParams.get("familyId")
    const benefitType = searchParams.get("type")
    const priority = searchParams.get("priority")

    if (!familyId) {
      return NextResponse.json({ error: "Family ID required" }, { status: 400 })
    }

    const monitor = new FamilyBenefitMonitor()

    // Get existing opportunities with filters
    const opportunities = await monitor.getFamilyBenefitOpportunities(familyId, {
      benefitType,
      priority,
    })

    return NextResponse.json({
      success: true,
      familyId,
      opportunities,
      summary: {
        total: opportunities.length,
        byType: monitor.groupOpportunitiesByType(opportunities),
        byPriority: monitor.groupOpportunitiesByPriority(opportunities),
        totalValue: opportunities.reduce((sum, opp) => sum + opp.potentialValue, 0),
      },
    })
  } catch (error) {
    console.error("Family benefit retrieval error:", error)
    return NextResponse.json({ error: "Failed to retrieve family benefits" }, { status: 500 })
  }
}
