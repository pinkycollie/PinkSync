import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { db } from "@/lib/database"

const documentAnalysisSchema = z.object({
  documentId: z.string(),
  documentType: z.string(),
  fileUrl: z.string(),
  analysisType: z.enum(["verification", "optimization", "compliance"]),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { documentId, documentType, fileUrl, analysisType } = documentAnalysisSchema.parse(body)

    // Update status to processing
    await db.query(
      `
      UPDATE document_analysis 
      SET ai_analysis_status = 'processing' 
      WHERE id = $1
    `,
      [documentId],
    )

    let analysisResult
    let confidenceScore = 0

    switch (analysisType) {
      case "verification":
        analysisResult = await analyzeVerificationDocument(fileUrl, documentType)
        break
      case "optimization":
        analysisResult = await analyzeOptimizationDocument(fileUrl, documentType)
        break
      case "compliance":
        analysisResult = await analyzeComplianceDocument(fileUrl, documentType)
        break
    }

    confidenceScore = analysisResult.confidence || 0
    const requiresReview = confidenceScore < 0.8 || analysisResult.flagged

    // Update document analysis with results
    await db.query(
      `
      UPDATE document_analysis 
      SET 
        ai_analysis_status = 'completed',
        ai_analysis_result = $1,
        confidence_score = $2,
        requires_human_review = $3,
        processed_at = NOW()
      WHERE id = $4
    `,
      [JSON.stringify(analysisResult), confidenceScore, requiresReview, documentId],
    )

    // If this is an optimization analysis, create optimization recommendations
    if (analysisType === "optimization" && analysisResult.recommendations) {
      await createOptimizationRecommendations(analysisResult.userId, analysisResult.recommendations)
    }

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      confidenceScore,
      requiresReview,
    })
  } catch (error) {
    console.error("Document analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}

async function analyzeVerificationDocument(fileUrl: string, documentType: string) {
  const prompt = `
    Analyze this ${documentType} document for deaf identity verification.
    
    For audiograms, extract:
    - Hearing thresholds for each frequency
    - Type of hearing loss (conductive, sensorineural, mixed)
    - Degree of hearing loss (mild, moderate, severe, profound)
    - Date of test
    - Audiologist information
    
    For medical documentation, extract:
    - Diagnosis information
    - Medical professional details
    - Date of documentation
    - Treatment recommendations
    - Assistive device prescriptions
    
    Provide confidence score (0-1) and flag any inconsistencies.
    
    Return JSON format with extracted data and verification assessment.
  `

  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt,
    system: `You are a medical document analysis AI specializing in hearing loss documentation. 
    You help verify deaf identity for accessibility services. Be thorough and accurate.`,
  })

  try {
    return JSON.parse(text)
  } catch {
    return {
      error: "Failed to parse analysis",
      confidence: 0,
      flagged: true,
    }
  }
}

async function analyzeOptimizationDocument(fileUrl: string, documentType: string) {
  const prompt = `
    Analyze this ${documentType} document for business and financial optimization opportunities.
    
    Look for:
    - Tax deduction opportunities related to disability
    - Benefit programs the user might be eligible for
    - Compliance requirements they need to meet
    - Workflow improvements for accessibility
    - Cost-saving opportunities
    - Risk mitigation strategies
    
    Provide specific, actionable recommendations with estimated impact.
    
    Return JSON format with recommendations array and priority scoring.
  `

  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt,
    system: `You are a business optimization AI specializing in accessibility and deaf community needs. 
    Focus on practical, implementable recommendations that provide real value.`,
  })

  try {
    return JSON.parse(text)
  } catch {
    return {
      error: "Failed to parse optimization analysis",
      confidence: 0,
      recommendations: [],
    }
  }
}

async function analyzeComplianceDocument(fileUrl: string, documentType: string) {
  const prompt = `
    Analyze this ${documentType} document for compliance with:
    - ADA requirements
    - State disability laws
    - Federal accessibility regulations
    - International travel requirements
    - Employment accommodation laws
    
    Identify:
    - Current compliance status
    - Required actions
    - Deadlines
    - Risk areas
    - Documentation gaps
    
    Return JSON format with compliance assessment and action items.
  `

  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt,
    system: `You are a compliance analysis AI specializing in disability rights and accessibility law. 
    Provide accurate, up-to-date compliance guidance.`,
  })

  try {
    return JSON.parse(text)
  } catch {
    return {
      error: "Failed to parse compliance analysis",
      confidence: 0,
      complianceStatus: "unknown",
    }
  }
}

async function createOptimizationRecommendations(userId: string, recommendations: any[]) {
  for (const rec of recommendations) {
    await db.query(
      `
      INSERT INTO business_optimization (
        user_id, optimization_type, current_state, recommendations,
        potential_savings, implementation_difficulty, priority_score
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
      [
        userId,
        rec.type || "general",
        JSON.stringify(rec.currentState || {}),
        JSON.stringify([rec]),
        rec.potentialSavings || 0,
        rec.difficulty || "medium",
        rec.priority || 50,
      ],
    )
  }
}
