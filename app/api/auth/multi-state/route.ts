import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/database"
import { validateStateCompliance } from "@/lib/compliance/state-validator"

const stateProfileSchema = z.object({
  stateCode: z.string().length(2),
  residenceStatus: z.enum(["resident", "temporary", "student", "worker"]),
  driversLicenseNumber: z.string().optional(),
  stateIdNumber: z.string().optional(),
  voterRegistrationStatus: z.boolean().default(false),
  disabilityServicesEnrolled: z.boolean().default(false),
  vrServicesEnrolled: z.boolean().default(false),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = stateProfileSchema.parse(body)

    const userId = await getUserFromSession(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create or update state profile
    const stateProfile = await db.query(
      `
      INSERT INTO user_state_profiles (
        user_id, state_code, residence_status, drivers_license_number,
        state_id_number, voter_registration_status, disability_services_enrolled,
        vr_services_enrolled
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (user_id, state_code) 
      DO UPDATE SET
        residence_status = EXCLUDED.residence_status,
        drivers_license_number = EXCLUDED.drivers_license_number,
        state_id_number = EXCLUDED.state_id_number,
        voter_registration_status = EXCLUDED.voter_registration_status,
        disability_services_enrolled = EXCLUDED.disability_services_enrolled,
        vr_services_enrolled = EXCLUDED.vr_services_enrolled,
        updated_at = NOW()
      RETURNING *
    `,
      [
        userId,
        validatedData.stateCode,
        validatedData.residenceStatus,
        validatedData.driversLicenseNumber,
        validatedData.stateIdNumber,
        validatedData.voterRegistrationStatus,
        validatedData.disabilityServicesEnrolled,
        validatedData.vrServicesEnrolled,
      ],
    )

    // Validate state-specific compliance requirements
    const complianceCheck = await validateStateCompliance(userId, validatedData.stateCode)

    // Check for intersectionality opportunities
    const intersectionalityAnalysis = await analyzeIntersectionality(userId)

    return NextResponse.json({
      success: true,
      stateProfile: stateProfile.rows[0],
      compliance: complianceCheck,
      intersectionality: intersectionalityAnalysis,
    })
  } catch (error) {
    console.error("Multi-state profile error:", error)
    return NextResponse.json({ error: "Failed to create state profile" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromSession(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all state profiles for user
    const stateProfiles = await db.query(
      `
      SELECT * FROM user_state_profiles 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `,
      [userId],
    )

    // Get compliance status for each state
    const complianceStatuses = await Promise.all(
      stateProfiles.rows.map(async (profile) => ({
        stateCode: profile.state_code,
        compliance: await validateStateCompliance(userId, profile.state_code),
      })),
    )

    return NextResponse.json({
      success: true,
      stateProfiles: stateProfiles.rows,
      complianceStatuses,
    })
  } catch (error) {
    console.error("Get state profiles error:", error)
    return NextResponse.json({ error: "Failed to retrieve state profiles" }, { status: 500 })
  }
}

async function analyzeIntersectionality(userId: string) {
  // Get user's deaf identity verification
  const deafIdentity = await db.query(
    `
    SELECT * FROM deaf_identity_verification WHERE user_id = $1
  `,
    [userId],
  )

  // Get all state profiles
  const stateProfiles = await db.query(
    `
    SELECT * FROM user_state_profiles WHERE user_id = $1
  `,
    [userId],
  )

  const analysis = {
    multiStateOpportunities: [],
    benefitOptimization: [],
    complianceGaps: [],
    recommendations: [],
  }

  // Analyze multi-state opportunities
  if (stateProfiles.rows.length > 1) {
    analysis.multiStateOpportunities.push({
      type: "tax_optimization",
      description: "Potential tax benefits from multi-state residence",
      states: stateProfiles.rows.map((p) => p.state_code),
      priority: "high",
    })
  }

  // Analyze VR services across states
  const vrStates = stateProfiles.rows.filter((p) => p.vr_services_enrolled)
  if (vrStates.length > 0) {
    analysis.benefitOptimization.push({
      type: "vocational_rehabilitation",
      description: "Coordinated VR services across states",
      states: vrStates.map((p) => p.state_code),
      priority: "medium",
    })
  }

  return analysis
}

async function getUserFromSession(request: NextRequest): Promise<string | null> {
  // Implementation depends on your auth system
  const authHeader = request.headers.get("authorization")
  if (!authHeader) return null

  // Verify JWT token and return user ID
  return "user-id-from-token"
}
