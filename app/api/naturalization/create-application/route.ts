import { type NextRequest, NextResponse } from "next/server"
import { NaturalizationTracker } from "@/lib/naturalization/naturalization-tracker"

export async function POST(request: NextRequest) {
  try {
    const { familyId, applicantId, priorityProcessing, accommodationsRequested } = await request.json()

    if (!familyId || !applicantId) {
      return NextResponse.json({ error: "Family ID and Applicant ID required" }, { status: 400 })
    }

    const tracker = new NaturalizationTracker()

    const applicationId = await tracker.createNaturalizationApplication(familyId, applicantId, {
      priorityProcessing: priorityProcessing || false,
      accommodationsRequested: accommodationsRequested || [],
      currentStatus: "eligibility_review",
    })

    // Generate initial report
    const report = await tracker.generateNaturalizationReport(applicationId)

    return NextResponse.json({
      success: true,
      applicationId,
      message: "Naturalization application tracking created successfully",
      report,
      nextSteps: [
        "Review eligibility requirements",
        "Gather required documents",
        "Submit accommodation requests",
        "Begin civics test preparation",
      ],
    })
  } catch (error) {
    console.error("Naturalization application creation error:", error)
    return NextResponse.json({ error: "Failed to create naturalization application" }, { status: 500 })
  }
}
