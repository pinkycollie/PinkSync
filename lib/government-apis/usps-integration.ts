import type { GovernmentAPIConfig, USPSApiResponse } from "./types"
import { db } from "@/lib/database"

export class USPSApiIntegration {
  private config: GovernmentAPIConfig

  constructor(config: GovernmentAPIConfig) {
    this.config = config
  }

  async validateAddress(userId: string, address: string): Promise<USPSApiResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/addresses/validate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          includeOptionalElements: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`USPS address validation error: ${response.statusText}`)
      }

      const data = await response.json()

      // Store validated address
      await this.storeValidatedAddress(userId, address, data)

      return {
        addressValidation: {
          isValid: data.valid,
          standardizedAddress: data.standardized_address,
          deliveryPoint: data.delivery_point,
          zipPlus4: data.zip_plus_4,
        },
        changeOfAddress: data.change_of_address || {
          hasActiveChange: false,
        },
      }
    } catch (error) {
      console.error("USPS address validation error:", error)
      throw error
    }
  }

  async submitChangeOfAddress(
    userId: string,
    oldAddress: string,
    newAddress: string,
    effectiveDate: string,
  ): Promise<any> {
    try {
      const response = await fetch(`${this.config.baseUrl}/change-of-address`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldAddress,
          newAddress,
          effectiveDate,
          accommodations: {
            visualConfirmation: true,
            emailNotifications: true,
            textNotifications: false,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`USPS change of address error: ${response.statusText}`)
      }

      const data = await response.json()

      // Store change of address request
      await this.storeChangeOfAddress(userId, oldAddress, newAddress, effectiveDate, data)

      return data
    } catch (error) {
      console.error("USPS change of address error:", error)
      throw error
    }
  }

  async trackPackage(userId: string, trackingNumber: string): Promise<any> {
    try {
      const response = await fetch(`${this.config.baseUrl}/tracking/${trackingNumber}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`USPS tracking error: ${response.statusText}`)
      }

      const data = await response.json()

      // Store tracking information
      await this.storeTrackingInfo(userId, trackingNumber, data)

      return data
    } catch (error) {
      console.error("USPS tracking error:", error)
      throw error
    }
  }

  private async storeValidatedAddress(userId: string, originalAddress: string, validationData: any): Promise<void> {
    await db.query(
      `
      INSERT INTO validated_addresses (
        user_id, original_address, standardized_address, is_valid, delivery_point, zip_plus_4
      ) VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id, original_address) DO UPDATE SET
        standardized_address = EXCLUDED.standardized_address,
        is_valid = EXCLUDED.is_valid,
        delivery_point = EXCLUDED.delivery_point,
        zip_plus_4 = EXCLUDED.zip_plus_4,
        updated_at = NOW()
    `,
      [
        userId,
        originalAddress,
        validationData.standardized_address,
        validationData.valid,
        validationData.delivery_point,
        validationData.zip_plus_4,
      ],
    )
  }

  private async storeChangeOfAddress(
    userId: string,
    oldAddress: string,
    newAddress: string,
    effectiveDate: string,
    response: any,
  ): Promise<void> {
    await db.query(
      `
      INSERT INTO address_changes (
        user_id, old_address, new_address, effective_date, confirmation_number, status
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `,
      [userId, oldAddress, newAddress, effectiveDate, response.confirmation_number, response.status],
    )
  }

  private async storeTrackingInfo(userId: string, trackingNumber: string, data: any): Promise<void> {
    await db.query(
      `
      INSERT INTO package_tracking (
        user_id, tracking_number, status, location, estimated_delivery, last_updated
      ) VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id, tracking_number) DO UPDATE SET
        status = EXCLUDED.status,
        location = EXCLUDED.location,
        estimated_delivery = EXCLUDED.estimated_delivery,
        last_updated = EXCLUDED.last_updated
    `,
      [userId, trackingNumber, data.status, data.location, data.estimated_delivery, data.last_updated],
    )
  }
}
