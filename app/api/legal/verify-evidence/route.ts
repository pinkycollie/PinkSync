import { type NextRequest, NextResponse } from "next/server"
import { EvidenceAuthenticator } from "@/lib/legal/evidence-authentication"
import { LegalComplianceChecker } from "@/lib/legal/compliance-checker"

export async function POST(request: NextRequest) {
  try {
    const { evidenceId, jurisdiction = "federal" } = await request.json()

    if (!evidenceId) {
      return NextResponse.json({ error: "Evidence ID is required" }, { status: 400 })
    }

    const authenticator = EvidenceAuthenticator.getInstance()
    const complianceChecker = LegalComplianceChecker.getInstance()

    // Verify evidence integrity
    const verification = await authenticator.verifyEvidenceIntegrity(evidenceId)

    // Check legal compliance
    const compliance = await complianceChecker.verifyCompliance(evidenceId, jurisdiction)

    // Generate expert witness report if needed
    const expertReport = verification.isValid ? await authenticator.generateExpertWitnessReport(evidenceId) : null

    return NextResponse.json({
      evidenceId,
      verification: verification.verificationReport,
      compliance,
      expertReport,
      courtReady: verification.isValid && compliance.overallCompliant,
      documents: verification.courtReadyDocuments,
      recommendations: compliance.recommendations,
    })
  } catch (error) {
    console.error("Evidence verification error:", error)
    return NextResponse.json({ error: "Failed to verify evidence" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const evidenceId = searchParams.get("evidenceId")

  if (!evidenceId) {
    return NextResponse.json({ error: "Evidence ID is required" }, { status: 400 })
  }

  try {
    const authenticator = EvidenceAuthenticator.getInstance()
    const verification = await authenticator.verifyEvidenceIntegrity(evidenceId)

    return NextResponse.json({
      evidenceId,
      isValid: verification.isValid,
      lastVerified: verification.verificationReport.verificationDate,
      status: verification.isValid ? "court-ready" : "needs-review",
    })
  } catch (error) {
    console.error("Evidence status check error:", error)
    return NextResponse.json({ error: "Failed to check evidence status" }, { status: 500 })
  }
}
