import type { GovernmentAPIConfig, SSAApiResponse } from "./types"
import { encrypt } from "@/lib/security/encryption"
import { db } from "@/lib/database"

export class SSAApiIntegration {
  private config: GovernmentAPIConfig
  private accessToken: string | null = null
  private tokenExpiry: Date | null = null

  constructor(config: GovernmentAPIConfig) {
    this.config = config
  }

  async authenticate(): Promise<void> {
    try {
      const response = await fetch(`${this.config.baseUrl}/oauth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString("base64")}`,
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          scope: "benefits-info disability-status work-credits",
        }),
      })

      if (!response.ok) {
        throw new Error(`SSA authentication failed: ${response.statusText}`)
      }

      const data = await response.json()
      this.accessToken = data.access_token
      this.tokenExpiry = new Date(Date.now() + data.expires_in * 1000)

      await this.storeEncryptedToken(data.access_token, this.tokenExpiry)
    } catch (error) {
      console.error("SSA authentication error:", error)
      throw error
    }
  }

  async getBenefitInformation(userId: string, ssn: string): Promise<SSAApiResponse> {
    await this.ensureValidToken()

    try {
      const response = await fetch(`${this.config.baseUrl}/beneficiary/${ssn}/benefits`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
          "X-User-ID": userId,
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("No SSA benefits found for this individual")
        }
        throw new Error(`SSA API error: ${response.statusText}`)
      }

      const data = await response.json()

      // Cache the response
      await this.cacheBenefitData(userId, data)

      // Store benefit history
      await this.storeBenefitHistory(userId, data)

      return this.transformSSAResponse(data)
    } catch (error) {
      console.error("SSA benefit info error:", error)

      // Try to return cached data if API fails
      const cachedData = await this.getCachedBenefitData(userId)
      if (cachedData) {
        return cachedData
      }

      throw error
    }
  }

  async getDisabilityStatus(userId: string, ssn: string): Promise<any> {
    await this.ensureValidToken()

    try {
      const response = await fetch(`${this.config.baseUrl}/beneficiary/${ssn}/disability-status`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`SSA disability status API error: ${response.statusText}`)
      }

      const data = await response.json()

      // Store disability determination information
      await this.storeDisabilityStatus(userId, data)

      return data
    } catch (error) {
      console.error("SSA disability status error:", error)
      throw error
    }
  }

  async getWorkCredits(userId: string, ssn: string): Promise<any> {
    await this.ensureValidToken()

    try {
      const response = await fetch(`${this.config.baseUrl}/beneficiary/${ssn}/work-credits`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`SSA work credits API error: ${response.statusText}`)
      }

      const data = await response.json()

      // Store work credit history
      await this.storeWorkCredits(userId, data)

      return data
    } catch (error) {
      console.error("SSA work credits error:", error)
      throw error
    }
  }

  async scheduleAppointment(userId: string, ssn: string, appointmentType: string, preferredDate: string): Promise<any> {
    await this.ensureValidToken()

    try {
      const response = await fetch(`${this.config.baseUrl}/appointments/schedule`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ssn,
          appointmentType,
          preferredDate,
          accommodations: {
            interpreterRequired: true,
            communicationMethod: "ASL",
            accessibilityNeeds: ["visual_alerts", "written_communication"],
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`SSA appointment scheduling error: ${response.statusText}`)
      }

      const data = await response.json()

      // Store appointment information
      await this.storeAppointment(userId, data)

      return data
    } catch (error) {
      console.error("SSA appointment scheduling error:", error)
      throw error
    }
  }

  private async ensureValidToken(): Promise<void> {
    if (!this.accessToken || !this.tokenExpiry || this.tokenExpiry <= new Date()) {
      await this.authenticate()
    }
  }

  private async storeEncryptedToken(token: string, expiry: Date): Promise<void> {
    const encryptedToken = encrypt(token)
    await db.query(
      `
      INSERT INTO government_api_tokens (service, encrypted_token, expires_at)
      VALUES ('ssa', $1, $2)
      ON CONFLICT (service) DO UPDATE SET
        encrypted_token = EXCLUDED.encrypted_token,
        expires_at = EXCLUDED.expires_at
    `,
      [encryptedToken, expiry],
    )
  }

  private async cacheBenefitData(userId: string, data: any): Promise<void> {
    await db.query(
      `
      INSERT INTO cached_government_data (
        user_id, service, data_type, data, cached_at, expires_at
      ) VALUES ($1, 'ssa', 'benefits', $2, NOW(), NOW() + INTERVAL '12 hours')
      ON CONFLICT (user_id, service, data_type) DO UPDATE SET
        data = EXCLUDED.data,
        cached_at = EXCLUDED.cached_at,
        expires_at = EXCLUDED.expires_at
    `,
      [userId, JSON.stringify(data)],
    )
  }

  private async getCachedBenefitData(userId: string): Promise<SSAApiResponse | null> {
    const result = await db.query(
      `
      SELECT data FROM cached_government_data
      WHERE user_id = $1 AND service = 'ssa' AND data_type = 'benefits'
      AND expires_at > NOW()
    `,
      [userId],
    )

    if (result.rows.length > 0) {
      return this.transformSSAResponse(result.rows[0].data)
    }

    return null
  }

  private async storeBenefitHistory(userId: string, data: any): Promise<void> {
    await db.query(
      `
      INSERT INTO user_benefit_history (
        user_id, benefit_type, monthly_amount, effective_date, source
      ) VALUES ($1, $2, $3, $4, 'ssa')
      ON CONFLICT (user_id, benefit_type, effective_date) DO UPDATE SET
        monthly_amount = EXCLUDED.monthly_amount
    `,
      [userId, data.benefit_type, data.monthly_benefit, data.effective_date],
    )
  }

  private async storeDisabilityStatus(userId: string, data: any): Promise<void> {
    await db.query(
      `
      INSERT INTO user_disability_status (
        user_id, determination_date, disability_type, review_date, source
      ) VALUES ($1, $2, $3, $4, 'ssa')
      ON CONFLICT (user_id, source) DO UPDATE SET
        determination_date = EXCLUDED.determination_date,
        disability_type = EXCLUDED.disability_type,
        review_date = EXCLUDED.review_date
    `,
      [userId, data.determination_date, data.disability_type, data.review_date],
    )
  }

  private async storeWorkCredits(userId: string, data: any): Promise<void> {
    await db.query(
      `
      INSERT INTO user_work_credits (
        user_id, total_credits, credits_needed, last_work_year, source
      ) VALUES ($1, $2, $3, $4, 'ssa')
      ON CONFLICT (user_id, source) DO UPDATE SET
        total_credits = EXCLUDED.total_credits,
        credits_needed = EXCLUDED.credits_needed,
        last_work_year = EXCLUDED.last_work_year
    `,
      [userId, data.total_credits, data.credits_needed, data.last_work_year],
    )
  }

  private async storeAppointment(userId: string, data: any): Promise<void> {
    await db.query(
      `
      INSERT INTO user_appointments (
        user_id, service, appointment_type, scheduled_date, confirmation_number, accommodations
      ) VALUES ($1, 'ssa', $2, $3, $4, $5)
    `,
      [
        userId,
        data.appointment_type,
        data.scheduled_date,
        data.confirmation_number,
        JSON.stringify(data.accommodations),
      ],
    )
  }

  private transformSSAResponse(data: any): SSAApiResponse {
    return {
      beneficiaryId: data.beneficiary_id,
      benefitType: data.benefit_type,
      monthlyBenefit: data.monthly_benefit,
      disabilityOnsetDate: data.disability_onset_date,
      reviewDate: data.review_date,
      workCredits: data.work_credits,
      medicalReviewSchedule: data.medical_review_schedule,
      representativePayee: data.representative_payee,
      lastUpdated: data.last_updated,
    }
  }
}
