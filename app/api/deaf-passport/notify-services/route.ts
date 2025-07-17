import { type NextRequest, NextResponse } from "next/server"
import { DeafIdentityPassportManager } from "@/lib/deaf-identity-passport/passport-manager"

export async function POST(request: NextRequest) {
  try {
    const { userId, triggerType } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const passportManager = new DeafIdentityPassportManager()

    // Get user's current passport
    const passport = await passportManager.getPassport(userId)
    if (!passport) {
      return NextResponse.json({ error: "Deaf identity passport not found" }, { status: 404 })
    }

    // Notify all connected services
    await passportManager.notifyAllConnectedServices(passport)

    // Track tax optimizations
    await passportManager.trackPropertyTaxAbatements(userId)

    // Get user's employment info and track employer credits
    const employmentInfo = await getUserEmploymentInfo(userId)
    for (const employer of employmentInfo) {
      await passportManager.trackEmployerTaxCredits(userId, employer)
    }

    return NextResponse.json({
      success: true,
      message: "All services notified of deaf identity and accessibility preferences",
      notifiedServices: passport.connectedServices.length,
      taxOptimizations: passport.taxOptimization,
    })
  } catch (error) {
    console.error("Deaf passport notification error:", error)
    return NextResponse.json({ error: "Notification failed" }, { status: 500 })
  }
}

async function getUserEmploymentInfo(userId: string): Promise<Array<any>> {
  // This would get employment information from connected services
  // or user-provided data
  return [
    {
      employerId: "employer-123",
      employerName: "Tech Company Inc",
      hireDate: "2024-01-15",
      position: "Software Developer",
      accommodationsProvided: ["ASL interpreter", "Visual alerts"],
    },
  ]
}
