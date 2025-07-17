import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/database"
import { generateAIAnalysis } from "@/lib/ai/document-analyzer"

const deafVerificationSchema = z.object({
  hearingLossType: z.enum(["conductive", "sensorineural", "mixed", "auditory_processing"]),
  hearingLossDegree: z.enum(["mild", "moderate", "severe", "profound"]),
  hearingLossOnset: z.enum(["congenital", "acquired"]),
  primaryCommunication: z.enum(["ASL", "PSE", "oral", "written", "mixed"]),
  cochlearImplant: z.boolean(),
  hearingAids: z.boolean(),
  audiogramFile: z.string().optional(),
  medicalDocumentation: z.string().optional(),
  communityVerifiers: z.array(z.string()).optional(),
  professionalVerifier: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = deafVerificationSchema.parse(body)

    // Get user from session/token
    const userId = await getUserFromSession(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create deaf identity verification record
    const verification = await db.query(
      `
      INSERT INTO deaf_identity_verification (
        user_id, hearing_loss_type, hearing_loss_degree, hearing_loss_onset,
        primary_communication, cochlear_implant, hearing_aids,
        audiogram_file_url, medical_documentation_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `,
      [
        userId,
        validatedData.hearingLossType,
        validatedData.hearingLossDegree,
        validatedData.hearingLossOnset,
        validatedData.primaryCommunication,
        validatedData.cochlearImplant,
        validatedData.hearingAids,
        validatedData.audiogramFile,
        validatedData.medicalDocumentation,
      ],
    )

    // Process documents with AI if provided
    if (validatedData.audiogramFile || validatedData.medicalDocumentation) {
      await processVerificationDocuments(userId, {
        audiogram: validatedData.audiogramFile,
        medical: validatedData.medicalDocumentation,
      })
    }

    // Process community verifications
    if (validatedData.communityVerifiers?.length) {
      await processCommunityVerifications(userId, validatedData.communityVerifiers)
    }

    // Calculate initial verification score
    const verificationScore = await calculateVerificationScore(userId)

    // Update user status based on verification score
    if (verificationScore >= 80) {
      await db.query(
        `
        UPDATE deaf_users 
        SET status = 'verified', verification_level = 'community'
        WHERE id = $1
      `,
        [userId],
      )
    }

    return NextResponse.json({
      success: true,
      verification: verification.rows[0],
      verificationScore,
      message: "Deaf identity verification submitted successfully",
    })
  } catch (error) {
    console.error("Deaf verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}

async function processVerificationDocuments(
  userId: string,
  documents: {
    audiogram?: string
    medical?: string
  },
) {
  const documentTypes = []

  if (documents.audiogram) {
    documentTypes.push({
      type: "audiogram",
      url: documents.audiogram,
    })
  }

  if (documents.medical) {
    documentTypes.push({
      type: "medical_documentation",
      url: documents.medical,
    })
  }

  for (const doc of documentTypes) {
    // Create document analysis record
    const analysis = await db.query(
      `
      INSERT INTO document_analysis (
        user_id, document_type, file_url, file_name, ai_analysis_status
      ) VALUES ($1, $2, $3, $4, 'pending')
      RETURNING id
    `,
      [userId, doc.type, doc.url, `${doc.type}_verification`],
    )

    // Queue AI analysis
    await generateAIAnalysis(analysis.rows[0].id, doc.url, doc.type)
  }
}

async function processCommunityVerifications(userId: string, verifierIds: string[]) {
  for (const verifierId of verifierIds) {
    await db.query(
      `
      INSERT INTO community_verifiers (
        verifier_id, verified_user_id, verification_type, verification_strength
      ) VALUES ($1, $2, 'community', 3)
      ON CONFLICT (verifier_id, verified_user_id) DO NOTHING
    `,
      [verifierId, userId],
    )
  }
}

async function calculateVerificationScore(userId: string): Promise<number> {
  // Base score from self-reported information
  let score = 30

  // Check for medical documentation
  const medicalDocs = await db.query(
    `
    SELECT COUNT(*) as count FROM document_analysis 
    WHERE user_id = $1 AND document_type IN ('audiogram', 'medical_documentation')
    AND ai_analysis_status = 'completed' AND confidence_score > 0.8
  `,
    [userId],
  )

  if (medicalDocs.rows[0].count > 0) {
    score += 40
  }

  // Check for community verifications
  const communityVerifications = await db.query(
    `
    SELECT COUNT(*) as count FROM community_verifiers 
    WHERE verified_user_id = $1
  `,
    [userId],
  )

  score += Math.min(communityVerifications.rows[0].count * 10, 30)

  return Math.min(score, 100)
}

async function getUserFromSession(request: NextRequest): Promise<string | null> {
  // Implementation depends on your auth system
  // This is a placeholder
  const authHeader = request.headers.get("authorization")
  if (!authHeader) return null

  // Verify JWT token and return user ID
  // Implementation would go here
  return "user-id-from-token"
}
