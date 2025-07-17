import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/database"
import { performanceOptimizer } from "@/lib/performance/performance-optimizer"

const registrationSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),

  // Address Information
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  county: z.string().optional(),

  // Deaf Identity Verification
  hearingLossType: z.enum(["conductive", "sensorineural", "mixed", "auditory_processing"]),
  hearingLossDegree: z.enum(["mild", "moderate", "severe", "profound"]),
  primaryCommunication: z.enum(["ASL", "PSE", "oral", "written", "mixed"]),
  assistiveTechnology: z.array(z.string()).optional(),

  // Registration Type
  registrationType: z.enum(["resident", "city_official", "state_official", "federal_official", "community_leader"]),
  organization: z.string().optional(),
  position: z.string().optional(),
  jurisdiction: z.string().optional(),

  // Preferences
  communicationPreferences: z.array(z.string()).optional(),
  accessibilityNeeds: z.array(z.string()).optional(),

  // Consent
  consentDataSharing: z.boolean().optional(),
  consentCommunityParticipation: z.boolean().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, "Must agree to terms"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registrationSchema.parse(body)

    // Check if user already exists
    const existingUser = await db.query("SELECT id FROM deaf_users WHERE email = $1", [validatedData.email])

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Create user account
    const userResult = await db.query(
      `
      INSERT INTO deaf_users (
        first_name, last_name, email, phone, date_of_birth,
        registration_type, organization, position, jurisdiction,
        communication_preferences, accessibility_needs,
        consent_data_sharing, consent_community_participation,
        status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'pending_verification', NOW())
      RETURNING id
    `,
      [
        validatedData.firstName,
        validatedData.lastName,
        validatedData.email,
        validatedData.phone,
        validatedData.dateOfBirth,
        validatedData.registrationType,
        validatedData.organization,
        validatedData.position,
        validatedData.jurisdiction,
        JSON.stringify(validatedData.communicationPreferences || []),
        JSON.stringify(validatedData.accessibilityNeeds || []),
        validatedData.consentDataSharing || false,
        validatedData.consentCommunityParticipation || false,
      ],
    )

    const userId = userResult.rows[0].id

    // Create address record
    await db.query(
      `
      INSERT INTO user_addresses (
        user_id, street, city, state, zip_code, county, is_primary
      ) VALUES ($1, $2, $3, $4, $5, $6, true)
    `,
      [
        userId,
        validatedData.street,
        validatedData.city,
        validatedData.state,
        validatedData.zipCode,
        validatedData.county,
      ],
    )

    // Create deaf identity verification record
    await db.query(
      `
      INSERT INTO deaf_identity_verification (
        user_id, hearing_loss_type, hearing_loss_degree, primary_communication,
        assistive_technology, verification_status
      ) VALUES ($1, $2, $3, $4, $5, 'pending')
    `,
      [
        userId,
        validatedData.hearingLossType,
        validatedData.hearingLossDegree,
        validatedData.primaryCommunication,
        JSON.stringify(validatedData.assistiveTechnology || []),
      ],
    )

    // Assign governance role based on registration type
    await assignGovernanceRole(userId, validatedData.registrationType)

    // Send verification email (implement email service)
    await sendVerificationEmail(validatedData.email, validatedData.firstName)

    // Clear relevant caches
    performanceOptimizer.clearCache("user_")
    performanceOptimizer.clearCache("governance_")

    return NextResponse.json({
      success: true,
      userId,
      message: "Registration successful. Please check your email for verification instructions.",
    })
  } catch (error) {
    console.error("Registration error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 })
  }
}

async function assignGovernanceRole(userId: string, registrationType: string) {
  let governanceLevel: string
  let votingWeight: number

  switch (registrationType) {
    case "resident":
    case "community_leader":
      governanceLevel = "community"
      votingWeight = 1.0
      break
    case "city_official":
      governanceLevel = "city"
      votingWeight = 0.15
      break
    case "state_official":
      governanceLevel = "state"
      votingWeight = 0.1
      break
    case "federal_official":
      governanceLevel = "federal"
      votingWeight = 0.05
      break
    default:
      governanceLevel = "community"
      votingWeight = 1.0
  }

  await db.query(
    `
    INSERT INTO governance_members (
      user_id, governance_level, voting_weight, status, joined_at
    ) VALUES ($1, $2, $3, 'pending_approval', NOW())
  `,
    [userId, governanceLevel, votingWeight],
  )
}

async function sendVerificationEmail(email: string, firstName: string) {
  // Implement email service integration
  console.log(`Sending verification email to ${email} for ${firstName}`)

  // This would integrate with your email service (SendGrid, AWS SES, etc.)
  // For now, we'll just log it
}
