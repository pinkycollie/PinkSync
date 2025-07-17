import { type NextRequest, NextResponse } from "next/server"
import { MultiLanguageNavigator } from "@/lib/immigrant-support/multi-language-navigator"

export async function POST(request: NextRequest) {
  try {
    const { familyId, immigrationStatus, countryOfOrigin, primaryLanguage, signLanguage } = await request.json()

    if (!familyId) {
      return NextResponse.json({ error: "Family ID required" }, { status: 400 })
    }

    const navigator = new MultiLanguageNavigator()

    // Create or update immigrant family profile
    const profileData = {
      familyId,
      immigrationStatus,
      countryOfOrigin,
      primarySpokenLanguage: primaryLanguage,
      primarySignLanguage: signLanguage,
      arrivalDate: new Date(),
      familyReunificationStatus: "complete",
      documentationStatus: "partial",
      languageBarriers: primaryLanguage !== "en" ? ["english_proficiency", "government_terminology"] : [],
      culturalBarriers: ["deaf_culture_differences", "service_navigation"],
    }

    const profileId = await navigator.createImmigrantFamilyProfile(familyId, profileData)

    // Discover all available benefits
    const opportunities = await navigator.discoverImmigrantBenefits(familyId)

    // Generate cultural navigation plan
    const navigationPlan = await navigator.generateCulturalNavigationPlan(familyId)

    // Get language support information
    const languageSupport = await navigator.getLanguageSupport(primaryLanguage)

    // Get cultural deaf profile for country of origin
    const culturalProfile = await navigator.getCulturalDeafProfile(countryOfOrigin)

    return NextResponse.json({
      success: true,
      profileId,
      opportunitiesFound: opportunities.length,
      totalPotentialValue: opportunities.reduce((sum, opp) => sum + opp.potentialValue, 0),
      opportunities: opportunities.map((opp) => ({
        ...opp,
        eligibleForStatus: opp.eligibilityByStatus[immigrationStatus] || false,
        waitingPeriod: opp.waitingPeriods[immigrationStatus] || 0,
        languageSupported: opp.languageSupport.includes(primaryLanguage),
        interpreterNeeded: opp.interpreterRequired,
      })),
      navigationPlan,
      languageSupport,
      culturalProfile,
      recommendations: {
        immediateActions: opportunities
          .filter((opp) => opp.priority === "critical" && opp.eligibilityByStatus[immigrationStatus])
          .map((opp) => opp.benefitName),
        languageServices: languageSupport?.interpreterAvailable
          ? ["Request interpreter services", "Enroll in ESL classes", "Access document translation"]
          : ["Find community interpreters", "Seek volunteer translation help"],
        culturalIntegration: [
          "Join deaf immigrant support group",
          "Attend cultural orientation program",
          "Connect with mentor from same cultural background",
        ],
      },
    })
  } catch (error) {
    console.error("Immigrant benefit discovery error:", error)
    return NextResponse.json({ error: "Failed to discover immigrant benefits" }, { status: 500 })
  }
}
