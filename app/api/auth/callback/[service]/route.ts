import { type NextRequest, NextResponse } from "next/server"
import { UserGovernmentAuth } from "@/lib/government-apis/user-auth-flow"
import { db } from "@/lib/db" // Declare the db variable

export async function GET(request: NextRequest, { params }: { params: { service: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/government?error=${encodeURIComponent(error)}`,
      )
    }

    if (!code || !state) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/government?error=missing_parameters`)
    }

    const authFlow = new UserGovernmentAuth()
    const tokens = await authFlow.exchangeCodeForToken(params.service, code, state)

    // Fetch user profile from the government service
    const userProfile = await fetchGovernmentUserProfile(params.service, tokens.access_token)

    // Store user profile data
    await storeGovernmentUserProfile(state.split(":")[0], params.service, userProfile)

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/government?connected=${params.service}`)
  } catch (error) {
    console.error(`Government auth callback error for ${params.service}:`, error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/government?error=auth_failed`)
  }
}

async function fetchGovernmentUserProfile(service: string, accessToken: string) {
  const endpoints = {
    "login.gov": "https://secure.login.gov/api/openid_connect/userinfo",
    "id.me": "https://api.id.me/api/public/v3/userinfo.json",
    myssa: "https://api.ssa.gov/v1/user/profile",
    irs: "https://api.irs.gov/v1/taxpayer/profile",
  }

  const endpoint = endpoints[service]
  if (!endpoint) {
    throw new Error(`Profile endpoint not configured for ${service}`)
  }

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch profile from ${service}`)
  }

  return response.json()
}

async function storeGovernmentUserProfile(userId: string, service: string, profile: any) {
  await db.query(
    `
    INSERT INTO user_government_profiles (
      user_id, service, profile_data, verified_at, created_at
    ) VALUES ($1, $2, $3, NOW(), NOW())
    ON CONFLICT (user_id, service) DO UPDATE SET
      profile_data = EXCLUDED.profile_data,
      verified_at = EXCLUDED.verified_at,
      updated_at = NOW()
  `,
    [userId, service, JSON.stringify(profile)],
  )
}
