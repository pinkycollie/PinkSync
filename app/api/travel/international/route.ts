import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/database"
import { validateTravelDocuments } from "@/lib/travel/document-validator"
import { generateTravelAdvisory } from "@/lib/travel/advisory-generator"

const internationalProfileSchema = z.object({
  passportNumber: z.string().optional(),
  passportCountry: z.string().length(3).optional(),
  passportExpiry: z.string().optional(),
  globalEntry: z.boolean().default(false),
  tsaPrecheck: z.boolean().default(false),
  disabilityTravelCard: z.record(z.any()).optional(),
  emergencyContacts: z
    .array(
      z.object({
        name: z.string(),
        relationship: z.string(),
        phone: z.string(),
        email: z.string(),
        country: z.string(),
      }),
    )
    .optional(),
  medicalTravelDocuments: z.record(z.any()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = internationalProfileSchema.parse(body)

    const userId = await getUserFromSession(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create or update international profile
    const profile = await db.query(
      `
      INSERT INTO international_profiles (
        user_id, passport_number, passport_country, passport_expiry,
        global_entry, tsa_precheck, disability_travel_card,
        emergency_contacts, medical_travel_documents
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (user_id) 
      DO UPDATE SET
        passport_number = EXCLUDED.passport_number,
        passport_country = EXCLUDED.passport_country,
        passport_expiry = EXCLUDED.passport_expiry,
        global_entry = EXCLUDED.global_entry,
        tsa_precheck = EXCLUDED.tsa_precheck,
        disability_travel_card = EXCLUDED.disability_travel_card,
        emergency_contacts = EXCLUDED.emergency_contacts,
        medical_travel_documents = EXCLUDED.medical_travel_documents,
        updated_at = NOW()
      RETURNING *
    `,
      [
        userId,
        validatedData.passportNumber,
        validatedData.passportCountry,
        validatedData.passportExpiry,
        validatedData.globalEntry,
        validatedData.tsaPrecheck,
        JSON.stringify(validatedData.disabilityTravelCard || {}),
        JSON.stringify(validatedData.emergencyContacts || []),
        JSON.stringify(validatedData.medicalTravelDocuments || {}),
      ],
    )

    // Validate travel documents
    const documentValidation = await validateTravelDocuments(userId)

    // Generate travel advisory for deaf travelers
    const travelAdvisory = await generateTravelAdvisory(userId)

    return NextResponse.json({
      success: true,
      profile: profile.rows[0],
      documentValidation,
      travelAdvisory,
    })
  } catch (error) {
    console.error("International profile error:", error)
    return NextResponse.json({ error: "Failed to create international profile" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const destination = searchParams.get("destination")

    const userId = await getUserFromSession(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get international profile
    const profile = await db.query(
      `
      SELECT * FROM international_profiles WHERE user_id = $1
    `,
      [userId],
    )

    if (profile.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No international profile found",
      })
    }

    // Get deaf identity for travel considerations
    const deafIdentity = await db.query(
      `
      SELECT * FROM deaf_identity_verification WHERE user_id = $1
    `,
      [userId],
    )

    // Generate destination-specific advisory if requested
    let destinationAdvisory = null
    if (destination) {
      destinationAdvisory = await generateDestinationAdvisory(userId, destination, deafIdentity.rows[0])
    }

    return NextResponse.json({
      success: true,
      profile: profile.rows[0],
      deafIdentity: deafIdentity.rows[0],
      destinationAdvisory,
    })
  } catch (error) {
    console.error("Get international profile error:", error)
    return NextResponse.json({ error: "Failed to retrieve international profile" }, { status: 500 })
  }
}

async function generateDestinationAdvisory(userId: string, destination: string, deafIdentity: any) {
  // This would integrate with travel APIs and deaf community resources
  // to provide destination-specific accessibility information

  return {
    destination,
    accessibilityRating: "good", // Would be calculated based on real data
    interpreterAvailability: true,
    emergencyServices: {
      textTo911: false,
      videoRelay: true,
      localDeafServices: ["Local Deaf Association", "Hospital Sign Language Services"],
    },
    medicalConsiderations: {
      cochlearImplantSupport: true,
      hearingAidBatteries: "Available at pharmacies",
      medicalInterpreters: "Available at major hospitals",
    },
    culturalConsiderations: {
      localSignLanguage: "Different from ASL",
      deafCommunity: "Active deaf community present",
      culturalNorms: "Respectful of disability accommodations",
    },
    recommendations: [
      "Carry medical device documentation",
      "Register with local deaf services upon arrival",
      "Download local emergency apps with visual alerts",
    ],
  }
}

async function getUserFromSession(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get("authorization")
  if (!authHeader) return null

  return "user-id-from-token"
}
