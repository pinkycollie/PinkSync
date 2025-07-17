import type { GovernmentAPIConfig, DMVApiResponse } from "./types"
import { db } from "@/lib/database"

export class DMVApiIntegration {
  private stateConfigs: Map<string, GovernmentAPIConfig> = new Map()

  constructor(stateConfigs: Array<{ state: string; config: GovernmentAPIConfig }>) {
    stateConfigs.forEach(({ state, config }) => {
      this.stateConfigs.set(state, config)
    })
  }

  async getLicenseInformation(userId: string, state: string, licenseNumber: string): Promise<DMVApiResponse> {
    const config = this.stateConfigs.get(state)
    if (!config) {
      throw new Error(`DMV API not configured for state: ${state}`)
    }

    try {
      const response = await fetch(`${config.baseUrl}/license/${licenseNumber}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
          "X-State": state,
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("License not found")
        }
        throw new Error(`DMV API error: ${response.statusText}`)
      }

      const data = await response.json()

      // Cache the response
      await this.cacheLicenseData(userId, state, data)

      // Store license information
      await this.storeLicenseInfo(userId, data)

      return this.transformDMVResponse(data)
    } catch (error) {
      console.error("DMV license info error:", error)

      // Try to return cached data if API fails
      const cachedData = await this.getCachedLicenseData(userId, state)
      if (cachedData) {
        return cachedData
      }

      throw error
    }
  }

  async updateDisabilityAccommodations(
    userId: string,
    state: string,
    licenseNumber: string,
    accommodations: Array<{ type: string; description: string }>,
  ): Promise<any> {
    const config = this.stateConfigs.get(state)
    if (!config) {
      throw new Error(`DMV API not configured for state: ${state}`)
    }

    try {
      const response = await fetch(`${config.baseUrl}/license/${licenseNumber}/accommodations`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
          "X-State": state,
        },
        body: JSON.stringify({
          accommodations,
          requestedBy: userId,
          medicalDocumentation: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`DMV accommodation update error: ${response.statusText}`)
      }

      const data = await response.json()

      // Store accommodation request
      await this.storeAccommodationRequest(userId, state, accommodations, data)

      return data
    } catch (error) {
      console.error("DMV accommodation update error:", error)
      throw error
    }
  }

  async renewLicense(userId: string, state: string, licenseNumber: string): Promise<any> {
    const config = this.stateConfigs.get(state)
    if (!config) {
      throw new Error(`DMV API not configured for state: ${state}`)
    }

    try {
      // Get current accommodations
      const currentLicense = await this.getLicenseInformation(userId, state, licenseNumber)

      const response = await fetch(`${config.baseUrl}/license/${licenseNumber}/renew`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
          "X-State": state,
        },
        body: JSON.stringify({
          maintainAccommodations: true,
          currentAccommodations: currentLicense.disabilityAccommodations,
          communicationPreference: "written",
          interpreterRequired: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`DMV license renewal error: ${response.statusText}`)
      }

      const data = await response.json()

      // Store renewal information
      await this.storeRenewalInfo(userId, state, data)

      return data
    } catch (error) {
      console.error("DMV license renewal error:", error)
      throw error
    }
  }

  async scheduleAppointment(
    userId: string,
    state: string,
    appointmentType: string,
    preferredDate: string,
  ): Promise<any> {
    const config = this.stateConfigs.get(state)
    if (!config) {
      throw new Error(`DMV API not configured for state: ${state}`)
    }

    try {
      const response = await fetch(`${config.baseUrl}/appointments/schedule`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
          "X-State": state,
        },
        body: JSON.stringify({
          appointmentType,
          preferredDate,
          accommodations: {
            interpreterRequired: true,
            communicationMethod: "ASL",
            writtenInstructions: true,
            visualAlerts: true,
            extendedTime: true,
          },
          contactMethod: "email",
        }),
      })

      if (!response.ok) {
        throw new Error(`DMV appointment scheduling error: ${response.statusText}`)
      }

      const data = await response.json()

      // Store appointment information
      await this.storeAppointment(userId, state, data)

      return data
    } catch (error) {
      console.error("DMV appointment scheduling error:", error)
      throw error
    }
  }

  private async cacheLicenseData(userId: string, state: string, data: any): Promise<void> {
    await db.query(
      `
      INSERT INTO cached_government_data (
        user_id, service, data_type, data, cached_at, expires_at
      ) VALUES ($1, $2, 'license', $3, NOW(), NOW() + INTERVAL '7 days')
      ON CONFLICT (user_id, service, data_type) DO UPDATE SET
        data = EXCLUDED.data,
        cached_at = EXCLUDED.cached_at,
        expires_at = EXCLUDED.expires_at
    `,
      [userId, `dmv_${state}`, JSON.stringify(data)],
    )
  }

  private async getCachedLicenseData(userId: string, state: string): Promise<DMVApiResponse | null> {
    const result = await db.query(
      `
      SELECT data FROM cached_government_data
      WHERE user_id = $1 AND service = $2 AND data_type = 'license'
      AND expires_at > NOW()
    `,
      [userId, `dmv_${state}`],
    )

    if (result.rows.length > 0) {
      return this.transformDMVResponse(result.rows[0].data)
    }

    return null
  }

  private async storeLicenseInfo(userId: string, data: any): Promise<void> {
    await db.query(
      `
      INSERT INTO user_licenses (
        user_id, state, license_number, license_type, expiration_date,
        restrictions, endorsements, disability_accommodations, real_id_compliant
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (user_id, state, license_number) DO UPDATE SET
        license_type = EXCLUDED.license_type,
        expiration_date = EXCLUDED.expiration_date,
        restrictions = EXCLUDED.restrictions,
        endorsements = EXCLUDED.endorsements,
        disability_accommodations = EXCLUDED.disability_accommodations,
        real_id_compliant = EXCLUDED.real_id_compliant
    `,
      [
        userId,
        data.state,
        data.license_number,
        data.license_type,
        data.expiration_date,
        JSON.stringify(data.restrictions),
        JSON.stringify(data.endorsements),
        JSON.stringify(data.disability_accommodations),
        data.real_id_compliant,
      ],
    )
  }

  private async storeAccommodationRequest(
    userId: string,
    state: string,
    accommodations: Array<any>,
    response: any,
  ): Promise<void> {
    await db.query(
      `
      INSERT INTO accommodation_requests (
        user_id, service, state, request_type, accommodations, status, confirmation_number
      ) VALUES ($1, 'dmv', $2, 'license_accommodation', $3, $4, $5)
    `,
      [userId, state, JSON.stringify(accommodations), response.status, response.confirmation_number],
    )
  }

  private async storeRenewalInfo(userId: string, state: string, data: any): Promise<void> {
    await db.query(
      `
      INSERT INTO license_renewals (
        user_id, state, renewal_date, new_expiration_date, confirmation_number, status
      ) VALUES ($1, $2, NOW(), $3, $4, $5)
    `,
      [userId, state, data.new_expiration_date, data.confirmation_number, data.status],
    )
  }

  private async storeAppointment(userId: string, state: string, data: any): Promise<void> {
    await db.query(
      `
      INSERT INTO user_appointments (
        user_id, service, state, appointment_type, scheduled_date, confirmation_number, accommodations
      ) VALUES ($1, 'dmv', $2, $3, $4, $5, $6)
    `,
      [
        userId,
        state,
        data.appointment_type,
        data.scheduled_date,
        data.confirmation_number,
        JSON.stringify(data.accommodations),
      ],
    )
  }

  private transformDMVResponse(data: any): DMVApiResponse {
    return {
      licenseNumber: data.license_number,
      state: data.state,
      licenseType: data.license_type,
      expirationDate: data.expiration_date,
      restrictions: data.restrictions || [],
      endorsements: data.endorsements || [],
      disabilityAccommodations: data.disability_accommodations || [],
      realIdCompliant: data.real_id_compliant,
      lastUpdated: data.last_updated,
    }
  }
}
