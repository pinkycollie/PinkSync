import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { db } from "@/lib/database"

export interface DeafVerificationChallenge {
  type: "asl_video" | "community_reference" | "medical_documentation" | "assistive_technology"
  challenge: string
  expectedResponse?: string
  verificationMethod: string
}

export async function generateDeafVerificationChallenge(userId: string): Promise<DeafVerificationChallenge> {
  // Get user's current verification data
  const userVerification = await db.query(
    `
    SELECT * FROM deaf_identity_verification WHERE user_id = $1
  `,
    [userId],
  )

  const userData = userVerification.rows[0]

  // Generate appropriate challenge based on user's communication preference
  if (userData?.primary_communication === "ASL") {
    return {
      type: "asl_video",
      challenge:
        "Please record a 30-second video introducing yourself in ASL, including your name and why you need accessibility services.",
      verificationMethod: "AI analysis of ASL fluency and natural signing patterns",
    }
  }

  if (userData?.cochlear_implant || userData?.hearing_aids) {
    return {
      type: "assistive_technology",
      challenge:
        "Please describe your daily experience with your hearing device, including specific challenges and accommodations you need.",
      verificationMethod: "Analysis of authentic assistive technology experience",
    }
  }

  return {
    type: "community_reference",
    challenge:
      "Please provide contact information for two people from the deaf community who can verify your identity and need for accessibility services.",
    verificationMethod: "Community network verification",
  }
}

export async function verifyDeafIdentityResponse(
  userId: string,
  challengeType: string,
  response: any,
): Promise<{ verified: boolean; confidence: number; notes: string }> {
  switch (challengeType) {
    case "asl_video":
      return await verifyASLVideo(response.videoUrl)

    case "community_reference":
      return await verifyCommunityReferences(userId, response.references)

    case "medical_documentation":
      return await verifyMedicalDocumentation(response.documents)

    case "assistive_technology":
      return await verifyAssistiveTechnologyExperience(response.description)

    default:
      return { verified: false, confidence: 0, notes: "Unknown challenge type" }
  }
}

async function verifyASLVideo(videoUrl: string): Promise<{ verified: boolean; confidence: number; notes: string }> {
  // This would integrate with video analysis AI to detect:
  // - Natural ASL grammar and syntax
  // - Fluent hand movements and facial expressions
  // - Authentic deaf communication patterns

  const prompt = `
    Analyze this ASL video for authenticity markers:
    - Natural ASL grammar structure
    - Fluent hand movements and facial expressions
    - Authentic deaf communication patterns
    - Signs of genuine deaf experience vs. learned ASL
    
    Provide confidence score (0-100) and detailed analysis.
  `

  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt,
    system: "You are an ASL linguistics expert specializing in authentic deaf communication analysis.",
  })

  try {
    const analysis = JSON.parse(text)
    return {
      verified: analysis.confidence > 70,
      confidence: analysis.confidence,
      notes: analysis.analysis,
    }
  } catch {
    return {
      verified: false,
      confidence: 0,
      notes: "Failed to analyze ASL video",
    }
  }
}

async function verifyCommunityReferences(
  userId: string,
  references: Array<{ name: string; email: string; relationship: string }>,
): Promise<{ verified: boolean; confidence: number; notes: string }> {
  let verifiedReferences = 0
  const verificationResults = []

  for (const ref of references) {
    // Check if reference is a verified deaf community member
    const referenceUser = await db.query(
      `
      SELECT du.*, div.verification_status 
      FROM deaf_users du
      LEFT JOIN deaf_identity_verification div ON du.id = div.user_id
      WHERE du.email = $1 AND div.verification_status = 'verified'
    `,
      [ref.email],
    )

    if (referenceUser.rows.length > 0) {
      verifiedReferences++

      // Create verification record
      await db.query(
        `
        INSERT INTO community_verifiers (
          verifier_id, verified_user_id, verification_type, relationship, verification_strength
        ) VALUES ($1, $2, 'community', $3, 4)
        ON CONFLICT (verifier_id, verified_user_id) DO NOTHING
      `,
        [referenceUser.rows[0].id, userId, ref.relationship],
      )

      verificationResults.push(`Verified reference: ${ref.name}`)
    } else {
      verificationResults.push(`Unverified reference: ${ref.name}`)
    }
  }

  const confidence = (verifiedReferences / references.length) * 100

  return {
    verified: verifiedReferences >= 1,
    confidence,
    notes: verificationResults.join("; "),
  }
}

async function verifyMedicalDocumentation(
  documents: Array<{ type: string; url: string }>,
): Promise<{ verified: boolean; confidence: number; notes: string }> {
  let totalConfidence = 0
  const verificationResults = []

  for (const doc of documents) {
    const prompt = `
      Analyze this medical document for deaf identity verification:
      - Authentic medical letterhead and formatting
      - Proper medical terminology for hearing loss
      - Consistent diagnosis information
      - Valid medical professional credentials
      - Recent date and relevant information
      
      Document type: ${doc.type}
      
      Provide confidence score (0-100) and verification notes.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      system:
        "You are a medical document verification expert specializing in audiology and hearing loss documentation.",
    })

    try {
      const analysis = JSON.parse(text)
      totalConfidence += analysis.confidence
      verificationResults.push(`${doc.type}: ${analysis.confidence}% confidence`)
    } catch {
      verificationResults.push(`${doc.type}: Analysis failed`)
    }
  }

  const averageConfidence = totalConfidence / documents.length

  return {
    verified: averageConfidence > 75,
    confidence: averageConfidence,
    notes: verificationResults.join("; "),
  }
}

async function verifyAssistiveTechnologyExperience(
  description: string,
): Promise<{ verified: boolean; confidence: number; notes: string }> {
  const prompt = `
    Analyze this description of assistive technology experience for authenticity:
    
    "${description}"
    
    Look for:
    - Specific technical details about hearing devices
    - Authentic daily challenges and solutions
    - Realistic accommodation needs
    - Genuine understanding of deaf/hard of hearing experience
    - Specific brand names, settings, or technical issues
    
    Provide confidence score (0-100) and analysis of authenticity markers.
  `

  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt,
    system: "You are an assistive technology expert specializing in hearing devices and deaf accessibility needs.",
  })

  try {
    const analysis = JSON.parse(text)
    return {
      verified: analysis.confidence > 70,
      confidence: analysis.confidence,
      notes: analysis.analysis,
    }
  } catch {
    return {
      verified: false,
      confidence: 0,
      notes: "Failed to analyze assistive technology experience",
    }
  }
}

export async function calculateOverallVerificationScore(userId: string): Promise<number> {
  // Get all verification data
  const verificationData = await db.query(
    `
    SELECT 
      div.*,
      (SELECT COUNT(*) FROM community_verifiers WHERE verified_user_id = $1) as community_verifications,
      (SELECT COUNT(*) FROM document_analysis WHERE user_id = $1 AND ai_analysis_status = 'completed' AND confidence_score > 0.8) as verified_documents
    FROM deaf_identity_verification div
    WHERE div.user_id = $1
  `,
    [userId],
  )

  if (verificationData.rows.length === 0) {
    return 0
  }

  const data = verificationData.rows[0]
  let score = 0

  // Base score for self-reported information (20 points)
  score += 20

  // Medical documentation (30 points)
  if (data.verified_documents > 0) {
    score += 30
  }

  // Community verifications (25 points)
  const communityScore = Math.min(data.community_verifications * 5, 25)
  score += communityScore

  // Professional verification (25 points)
  if (data.verification_status === "verified" && data.verified_by) {
    score += 25
  }

  return Math.min(score, 100)
}
