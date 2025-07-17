import type { GovernmentAPIConfig, IRSApiResponse } from "./types"
import { encrypt } from "@/lib/security/encryption"
import { db } from "@/lib/database"

export class IRSApiIntegration {
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
          scope: "taxpayer-info disability-credits medical-deductions",
        }),
      })

      if (!response.ok) {
        throw new Error(`IRS authentication failed: ${response.statusText}`)
      }

      const data = await response.json()
      this.accessToken = data.access_token
      this.tokenExpiry = new Date(Date.now() + data.expires_in * 1000)

      // Store encrypted token
      await this.storeEncryptedToken(data.access_token, this.tokenExpiry)
    } catch (error) {
      console.error("IRS authentication error:", error)
      throw error
    }
  }

  async getTaxpayerInfo(userId: string, ssn: string, taxYear: number): Promise<IRSApiResponse> {
    await this.ensureValidToken()

    try {
      const response = await fetch(`${this.config.baseUrl}/taxpayer/${ssn}/tax-year/${taxYear}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
          "X-User-ID": userId,
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Tax information not found for specified year")
        }
        throw new Error(`IRS API error: ${response.statusText}`)
      }

      const data = await response.json()

      // Cache the response
      await this.cacheTaxData(userId, data)

      return this.transformIRSResponse(data)
    } catch (error) {
      console.error("IRS taxpayer info error:", error)

      // Try to return cached data if API fails
      const cachedData = await this.getCachedTaxData(userId, taxYear)
      if (cachedData) {
        return cachedData
      }

      throw error
    }
  }

  async getDisabilityTaxCredits(userId: string, ssn: string, taxYear: number): Promise<Array<any>> {
    await this.ensureValidToken()

    try {
      const response = await fetch(`${this.config.baseUrl}/taxpayer/${ssn}/disability-credits/${taxYear}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`IRS disability credits API error: ${response.statusText}`)
      }

      const data = await response.json()

      // Store disability credit information
      await this.storeDisabilityCredits(userId, data.credits)

      return data.credits
    } catch (error) {
      console.error("IRS disability credits error:", error)
      throw error
    }
  }

  async getMedicalDeductions(userId: string, ssn: string, taxYear: number): Promise<Array<any>> {
    await this.ensureValidToken()

    try {
      const response = await fetch(`${this.config.baseUrl}/taxpayer/${ssn}/medical-deductions/${taxYear}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`IRS medical deductions API error: ${response.statusText}`)
      }

      const data = await response.json()

      // Analyze for hearing-related deductions
      const hearingRelatedDeductions = data.deductions.filter(
        (deduction: any) =>
          deduction.category.includes("hearing") ||
          deduction.description.toLowerCase().includes("cochlear") ||
          deduction.description.toLowerCase().includes("hearing aid"),
      )

      await this.storeMedicalDeductions(userId, hearingRelatedDeductions)

      return data.deductions
    } catch (error) {
      console.error("IRS medical deductions error:", error)
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
      VALUES ('irs', $1, $2)
      ON CONFLICT (service) DO UPDATE SET
        encrypted_token = EXCLUDED.encrypted_token,
        expires_at = EXCLUDED.expires_at
    `,
      [encryptedToken, expiry],
    )
  }

  private async cacheTaxData(userId: string, data: any): Promise<void> {
    await db.query(
      `
      INSERT INTO cached_government_data (
        user_id, service, data_type, data, cached_at, expires_at
      ) VALUES ($1, 'irs', 'tax_info', $2, NOW(), NOW() + INTERVAL '24 hours')
      ON CONFLICT (user_id, service, data_type) DO UPDATE SET
        data = EXCLUDED.data,
        cached_at = EXCLUDED.cached_at,
        expires_at = EXCLUDED.expires_at
    `,
      [userId, JSON.stringify(data)],
    )
  }

  private async getCachedTaxData(userId: string, taxYear: number): Promise<IRSApiResponse | null> {
    const result = await db.query(
      `
      SELECT data FROM cached_government_data
      WHERE user_id = $1 AND service = 'irs' AND data_type = 'tax_info'
      AND expires_at > NOW()
    `,
      [userId],
    )

    if (result.rows.length > 0) {
      return this.transformIRSResponse(result.rows[0].data)
    }

    return null
  }

  private async storeDisabilityCredits(userId: string, credits: Array<any>): Promise<void> {
    for (const credit of credits) {
      await db.query(
        `
        INSERT INTO user_tax_credits (
          user_id, credit_type, amount, tax_year, eligibility_reason, source
        ) VALUES ($1, $2, $3, $4, $5, 'irs')
        ON CONFLICT (user_id, credit_type, tax_year) DO UPDATE SET
          amount = EXCLUDED.amount,
          eligibility_reason = EXCLUDED.eligibility_reason
      `,
        [userId, credit.creditType, credit.amount, credit.taxYear, credit.eligibilityReason],
      )
    }
  }

  private async storeMedicalDeductions(userId: string, deductions: Array<any>): Promise<void> {
    for (const deduction of deductions) {
      await db.query(
        `
        INSERT INTO user_medical_deductions (
          user_id, category, amount, description, tax_year, source
        ) VALUES ($1, $2, $3, $4, $5, 'irs')
        ON CONFLICT (user_id, category, tax_year) DO UPDATE SET
          amount = EXCLUDED.amount,
          description = EXCLUDED.description
      `,
        [userId, deduction.category, deduction.amount, deduction.description, deduction.taxYear],
      )
    }
  }

  private transformIRSResponse(data: any): IRSApiResponse {
    return {
      taxpayerId: data.taxpayer_id,
      taxYear: data.tax_year,
      filingStatus: data.filing_status,
      adjustedGrossIncome: data.agi,
      taxLiability: data.tax_liability,
      refundAmount: data.refund_amount,
      disabilityCredits: data.disability_credits || [],
      medicalDeductions: data.medical_deductions || [],
      lastUpdated: data.last_updated,
    }
  }
}
