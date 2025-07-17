import { type NextRequest, NextResponse } from "next/server"
import { UserGovernmentAuth } from "@/lib/government-apis/user-auth-flow"

export async function POST(request: NextRequest) {
  try {
    const { service, userId } = await request.json()

    if (!service || !userId) {
      return NextResponse.json({ error: "Service and user ID required" }, { status: 400 })
    }

    const authFlow = new UserGovernmentAuth()
    const authUrl = authFlow.generateAuthUrl(service, userId)

    return NextResponse.json({
      authUrl,
      service,
      instructions: getServiceInstructions(service),
    })
  } catch (error) {
    console.error("Government auth connection error:", error)
    return NextResponse.json({ error: "Failed to generate auth URL" }, { status: 500 })
  }
}

function getServiceInstructions(service: string): string {
  const instructions = {
    "login.gov":
      "You'll be redirected to Login.gov to securely authenticate with your government account. This gives you access to multiple federal services.",
    "id.me":
      "Connect your ID.me account to access veteran benefits, disability services, and other government programs.",
    myssa: "Link your my Social Security account to view your benefits, earnings record, and manage your account.",
    irs: "Connect your IRS Online Account to access tax transcripts, payment history, and account information.",
  }

  return instructions[service] || "You'll be redirected to authenticate with the government service."
}
