import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { db } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromSession(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's complete profile for optimization analysis
    const userProfile = await getUserCompleteProfile(userId)

    // Generate comprehensive business optimization recommendations
    const optimizations = await generateBusinessOptimizations(userProfile)

    // Store optimization recommendations
    for (const optimization of optimizations) {
      await db.query(
        `
        INSERT INTO business_optimization (
          user_id, optimization_type, current_state, recommendations,
          potential_savings, implementation_difficulty, priority_score, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
      `,
        [
          userId,
          optimization.type,
          JSON.stringify(optimization.currentState),
          JSON.stringify(optimization.recommendations),
          optimization.potentialSavings,
          optimization.implementationDifficulty,
          optimization.priorityScore,
        ],
      )
    }

    return NextResponse.json({
      success: true,
      optimizations,
      totalPotentialSavings: optimizations.reduce((sum, opt) => sum + (opt.potentialSavings || 0), 0),
    })
  } catch (error) {
    console.error("Business optimization error:", error)
    return NextResponse.json({ error: "Optimization analysis failed" }, { status: 500 })
  }
}

async function getUserCompleteProfile(userId: string) {
  const profile = await db.query(
    `
    SELECT 
      du.*,
      div.*,
      ap.*,
      array_agg(DISTINCT usp.*) as state_profiles,
      ip.*,
      array_agg(DISTINCT da.*) as documents
    FROM deaf_users du
    LEFT JOIN deaf_identity_verification div ON du.id = div.user_id
    LEFT JOIN accessibility_preferences ap ON du.id = ap.user_id
    LEFT JOIN user_state_profiles usp ON du.id = usp.user_id
    LEFT JOIN international_profiles ip ON du.id = ip.user_id
    LEFT JOIN document_analysis da ON du.id = da.user_id
    WHERE du.id = $1
    GROUP BY du.id, div.id, ap.id, ip.id
  `,
    [userId],
  )

  return profile.rows[0]
}

async function generateBusinessOptimizations(userProfile: any) {
  const prompt = `
    Analyze this deaf user's profile for comprehensive business and life optimization opportunities:
    
    User Profile:
    - Hearing Loss: ${userProfile.hearing_loss_type} (${userProfile.hearing_loss_degree})
    - Communication: ${userProfile.primary_communication}
    - Assistive Technology: ${userProfile.cochlear_implant ? "Cochlear Implant" : ""} ${userProfile.hearing_aids ? "Hearing Aids" : ""}
    - States: ${userProfile.state_profiles?.map((sp) => sp.state_code).join(", ") || "None"}
    - International Travel: ${userProfile.passport_number ? "Yes" : "No"}
    
    Provide optimization recommendations for:
    
    1. TAX OPTIMIZATION:
    - Disability tax credits and deductions
    - Medical expense deductions for hearing devices
    - State-specific tax benefits
    - Multi-state tax optimization
    
    2. BENEFIT MAXIMIZATION:
    - Federal disability benefits (SSI, SSDI)
    - State vocational rehabilitation services
    - Telecommunications equipment programs
    - Healthcare benefits and coverage
    
    3. COMPLIANCE AUTOMATION:
    - ADA compliance requirements
    - State disability registration
    - International travel documentation
    - Emergency service registration
    
    4. WORKFLOW OPTIMIZATION:
    - Accessibility service coordination
    - Document management automation
    - Communication preference optimization
    - Emergency preparedness
    
    5. FINANCIAL OPTIMIZATION:
    - Assistive technology funding
    - Insurance optimization
    - Investment strategies for disabled individuals
    - Estate planning considerations
    
    For each recommendation, provide:
    - Specific action items
    - Estimated financial impact
    - Implementation difficulty (easy/medium/hard)
    - Priority score (1-100)
    - Required documentation
    - Deadlines or time sensitivity
    
    Return as JSON array of optimization objects.
  `

  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt,
    system: `You are a specialized business optimization AI for the deaf community. 
    Focus on practical, implementable recommendations that provide real financial and quality-of-life benefits.
    Consider intersectionality, multi-state compliance, and international accessibility needs.`,
  })

  try {
    return JSON.parse(text)
  } catch {
    return []
  }
}

async function getUserFromSession(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get("authorization")
  if (!authHeader) return null

  return "user-id-from-token"
}
