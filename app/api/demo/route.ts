import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, company, phoneNumber, message } = body

    // In a real implementation, you would:
    // 1. Validate the input
    // 2. Store the lead in your CRM
    // 3. Send a notification to your sales team
    // 4. Send a confirmation email to the prospect

    // For demo purposes, we'll just return a success response
    return NextResponse.json({
      success: true,
      message: "Demo request received. Our team will contact you shortly.",
    })
  } catch (error) {
    console.error("Error processing demo request:", error)
    return NextResponse.json(
      { success: false, message: "Failed to process your request. Please try again." },
      { status: 500 },
    )
  }
}
