import { type NextRequest, NextResponse } from "next/server"
import { IRSApiIntegration } from "@/lib/government-apis/irs-integration"
import { SSAApiIntegration } from "@/lib/government-apis/ssa-integration"
import { DMVApiIntegration } from "@/lib/government-apis/dmv-integration"
import { USPSApiIntegration } from "@/lib/government-apis/usps-integration"
import { db } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { services, userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    // Get user's government identifiers
    const userIdentifiers = await getUserIdentifiers(userId)
    if (!userIdentifiers) {
      return NextResponse.json({ error: "User identifiers not found" }, { status: 404 })
    }

    const results = {
      irs: null,
      ssa: null,
      dmv: {},
      usps: null,
      errors: [],
    }

    // Sync IRS data
    if (services.includes("irs")) {
      try {
        const irsApi = new IRSApiIntegration(getIRSConfig())
        const currentYear = new Date().getFullYear()

        results.irs = {
          taxpayerInfo: await irsApi.getTaxpayerInfo(userId, userIdentifiers.ssn, currentYear),
          disabilityCredits: await irsApi.getDisabilityTaxCredits(userId, userIdentifiers.ssn, currentYear),
          medicalDeductions: await irsApi.getMedicalDeductions(userId, userIdentifiers.ssn, currentYear),
        }
      } catch (error) {
        results.errors.push(`IRS sync failed: ${error.message}`)
      }
    }

    // Sync SSA data
    if (services.includes("ssa")) {
      try {
        const ssaApi = new SSAApiIntegration(getSSAConfig())

        results.ssa = {
          benefits: await ssaApi.getBenefitInformation(userId, userIdentifiers.ssn),
          disabilityStatus: await ssaApi.getDisabilityStatus(userId, userIdentifiers.ssn),
          workCredits: await ssaApi.getWorkCredits(userId, userIdentifiers.ssn),
        }
      } catch (error) {
        results.errors.push(`SSA sync failed: ${error.message}`)
      }
    }

    // Sync DMV data for all user's states
    if (services.includes("dmv")) {
      try {
        const dmvApi = new DMVApiIntegration(getDMVConfigs())
        const userStates = await getUserStates(userId)

        for (const state of userStates) {
          if (state.driversLicenseNumber) {
            try {
              results.dmv[state.stateCode] = await dmvApi.getLicenseInformation(
                userId,
                state.stateCode,
                state.driversLicenseNumber,
              )
            } catch (error) {
              results.errors.push(`DMV sync failed for ${state.stateCode}: ${error.message}`)
            }
          }
        }
      } catch (error) {
        results.errors.push(`DMV sync setup failed: ${error.message}`)
      }
    }

    // Sync USPS data
    if (services.includes("usps")) {
      try {
        const uspsApi = new USPSApiIntegration(getUSPSConfig())
        const userAddresses = await getUserAddresses(userId)

        results.usps = {
          addressValidations: [],
        }

        for (const address of userAddresses) {
          try {
            const validation = await uspsApi.validateAddress(userId, address)
            results.usps.addressValidations.push(validation)
          } catch (error) {
            results.errors.push(`USPS address validation failed: ${error.message}`)
          }
        }
      } catch (error) {
        results.errors.push(`USPS sync failed: ${error.message}`)
      }
    }

    // Update sync status
    await updateSyncStatus(userId, services, results.errors.length === 0)

    return NextResponse.json({
      success: true,
      results,
      syncedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Government sync error:", error)
    return NextResponse.json({ error: "Sync failed" }, { status: 500 })
  }
}

async function getUserIdentifiers(userId: string) {
  const result = await db.query(
    `
    SELECT ssn, encrypted_ssn FROM user_identifiers WHERE user_id = $1
  `,
    [userId],
  )

  return result.rows[0] || null
}

async function getUserStates(userId: string) {
  const result = await db.query(
    `
    SELECT state_code, drivers_license_number, state_id_number 
    FROM user_state_profiles WHERE user_id = $1
  `,
    [userId],
  )

  return result.rows
}

async function getUserAddresses(userId: string) {
  const result = await db.query(
    `
    SELECT DISTINCT address FROM user_addresses WHERE user_id = $1
  `,
    [userId],
  )

  return result.rows.map((row) => row.address)
}

async function updateSyncStatus(userId: string, services: string[], success: boolean) {
  await db.query(
    `
    INSERT INTO government_sync_status (
      user_id, services, last_sync_at, success, next_sync_at
    ) VALUES ($1, $2, NOW(), $3, NOW() + INTERVAL '24 hours')
    ON CONFLICT (user_id) DO UPDATE SET
      services = EXCLUDED.services,
      last_sync_at = EXCLUDED.last_sync_at,
      success = EXCLUDED.success,
      next_sync_at = EXCLUDED.next_sync_at
  `,
    [userId, JSON.stringify(services), success],
  )
}

function getIRSConfig() {
  return {
    baseUrl: process.env.IRS_API_BASE_URL!,
    apiKey: process.env.IRS_API_KEY!,
    clientId: process.env.IRS_CLIENT_ID!,
    clientSecret: process.env.IRS_CLIENT_SECRET!,
    environment: process.env.NODE_ENV === "production" ? "production" : "sandbox",
    rateLimit: {
      requestsPerMinute: 60,
      requestsPerDay: 1000,
    },
    timeout: 30000,
  }
}

function getSSAConfig() {
  return {
    baseUrl: process.env.SSA_API_BASE_URL!,
    apiKey: process.env.SSA_API_KEY!,
    clientId: process.env.SSA_CLIENT_ID!,
    clientSecret: process.env.SSA_CLIENT_SECRET!,
    environment: process.env.NODE_ENV === "production" ? "production" : "sandbox",
    rateLimit: {
      requestsPerMinute: 30,
      requestsPerDay: 500,
    },
    timeout: 45000,
  }
}

function getDMVConfigs() {
  // This would be loaded from environment variables for each state
  return [
    {
      state: "CA",
      config: {
        baseUrl: process.env.CA_DMV_API_BASE_URL!,
        apiKey: process.env.CA_DMV_API_KEY!,
        environment: process.env.NODE_ENV === "production" ? "production" : "sandbox",
        rateLimit: { requestsPerMinute: 20, requestsPerDay: 200 },
        timeout: 20000,
      },
    },
    // Add other states...
  ]
}

function getUSPSConfig() {
  return {
    baseUrl: process.env.USPS_API_BASE_URL!,
    apiKey: process.env.USPS_API_KEY!,
    environment: process.env.NODE_ENV === "production" ? "production" : "sandbox",
    rateLimit: {
      requestsPerMinute: 100,
      requestsPerDay: 5000,
    },
    timeout: 15000,
  }
}
