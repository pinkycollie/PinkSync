import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()
    const { formId, responses, submissionId, timestamp } = formData

    // Process different types of form submissions
    switch (formId) {
      case "client-intake":
        await processClientIntake(responses, submissionId)
        break
      case "accessibility-assessment":
        await processAccessibilityAssessment(responses, submissionId)
        break
      case "emergency-contact-update":
        await processEmergencyContactUpdate(responses, submissionId)
        break
      case "feedback-survey":
        await processFeedbackSurvey(responses, submissionId)
        break
    }

    return NextResponse.json({ processed: true, submissionId })
  } catch (error) {
    console.error("Google Forms webhook error:", error)
    return NextResponse.json({ error: "Form processing failed" }, { status: 500 })
  }
}

async function processClientIntake(responses: any, submissionId: string) {
  const {
    email,
    name,
    deaf_status,
    hearing_loss_type,
    communication_methods,
    emergency_contact_name,
    emergency_contact_phone,
    services_needed,
  } = responses

  // 1. Create or update user profile
  const { data: profile } = await supabase
    .from("profiles")
    .upsert({
      email,
      tier: "free",
      credits: 10, // Welcome credits
    })
    .select()
    .single()

  // 2. Create deaf identity profile
  await supabase.from("deaf_identity_profiles").insert({
    user_id: profile.id,
    deaf_status,
    hearing_loss_type,
    communication_methods: communication_methods.split(","),
    primary_language: "English", // Default
    identity_verified: false,
    verification_method: "form_submission",
  })

  // 3. Create emergency contact
  if (emergency_contact_name && emergency_contact_phone) {
    await supabase.from("emergency_contacts").insert({
      user_id: profile.id,
      name: emergency_contact_name,
      phone_number: emergency_contact_phone,
      relationship: "primary",
      priority_order: 1,
      verified: false,
    })
  }

  // 4. Trigger automated workflow
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/automation/workflow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "user_registration",
      userId: profile.id,
      data: { services_needed, source: "google_forms" },
    }),
  })

  // 5. Schedule follow-up consultation
  await scheduleConsultation(profile.id, services_needed)
}

async function processAccessibilityAssessment(responses: any, submissionId: string) {
  const { user_email, accessibility_needs } = responses

  // Find user by email
  const { data: profile } = await supabase.from("profiles").select("id").eq("email", user_email).single()

  if (profile) {
    // Update accessibility preferences based on assessment
    await supabase
      .from("accessibility_preferences")
      .upsert({
        user_id: profile.id,
        captions_enabled: accessibility_needs.includes("captions"),
        high_contrast: accessibility_needs.includes("high_contrast"),
        sign_language_overlay: accessibility_needs.includes("asl"),
        visual_notifications: accessibility_needs.includes("visual_alerts"),
        font_size_multiplier: accessibility_needs.includes("large_text") ? 1.5 : 1.0,
      })
      .eq("user_id", profile.id)

    // Generate personalized accessibility guide video
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/generate-video`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: profile.id,
        title: "Your Personalized Accessibility Guide",
        description: "Learn how to optimize Pinksync for your specific needs",
        targetAudience: "individual-user",
        contentType: "accessibility-guide",
        accessibilityFeatures: accessibility_needs,
      }),
    })
  }
}

async function processEmergencyContactUpdate(responses: any, submissionId: string) {
  const { user_email, contacts } = responses

  const { data: profile } = await supabase.from("profiles").select("id").eq("email", user_email).single()

  if (profile) {
    // Update emergency contacts
    for (const contact of contacts) {
      await supabase.from("emergency_contacts").upsert({
        user_id: profile.id,
        name: contact.name,
        phone_number: contact.phone,
        email: contact.email,
        relationship: contact.relationship,
        can_sign: contact.can_sign || false,
        priority_order: contact.priority,
        verified: false,
      })
    }

    // Send verification requests to contacts
    await sendContactVerificationRequests(profile.id, contacts)
  }
}

async function processFeedbackSurvey(responses: any, submissionId: string) {
  const { user_email, video_id, rating, feedback, accessibility_rating } = responses

  // Store feedback for analysis
  await supabase.from("analyses").insert({
    user_id: responses.user_id,
    input_text: `Feedback survey: ${video_id}`,
    analysis_result: {
      rating,
      feedback,
      accessibility_rating,
      submission_id: submissionId,
      timestamp: new Date().toISOString(),
    },
  })

  // If rating is low, trigger improvement workflow
  if (rating < 3 || accessibility_rating < 3) {
    await triggerImprovementWorkflow(responses.user_id, video_id, feedback)
  }
}

async function scheduleConsultation(userId: string, servicesNeeded: string[]) {
  // Integration with Google Calendar API
  console.log(`Scheduling consultation for user ${userId} for services:`, servicesNeeded)
}

async function sendContactVerificationRequests(userId: string, contacts: any[]) {
  // Send verification emails/SMS to emergency contacts
  console.log(`Sending verification requests for user ${userId}`)
}

async function triggerImprovementWorkflow(userId: string, videoId: string, feedback: string) {
  // Trigger workflow to improve content based on feedback
  console.log(`Triggering improvement workflow for video ${videoId}`)
}
