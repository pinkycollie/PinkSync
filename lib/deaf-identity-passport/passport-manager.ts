import { db } from "@/lib/database"
import { encrypt, decrypt } from "@/lib/security/encryption"

export interface DeafIdentityPassport {
  userId: string
  deafStatus: {
    verified: boolean
    hearingLossType: string
    hearingLossDegree: string
    primaryCommunication: string
    assistiveTechnology: string[]
    verificationLevel: "community" | "medical" | "institutional"
  }
  accessibilityPreferences: {
    visualAlerts: boolean
    vibrationAlerts: boolean
    aslInterpreter: boolean
    cartServices: boolean
    highContrast: boolean
    largeText: boolean
    emergencyContactMethod: "text" | "email" | "video" | "relay"
    preferredLanguage: string
    communicationNotes: string
  }
  taxOptimization: {
    disabilityTaxCredits: string[]
    propertyTaxAbatements: string[]
    employerTaxCredits: string[]
    medicalDeductions: string[]
    assistiveTechnologyDeductions: string[]
  }
  connectedServices: Array<{
    serviceId: string
    serviceName: string
    apiEndpoint: string
    accessToken: string
    lastNotified: Date
    notificationStatus: "success" | "pending" | "failed"
  }>
}

export class DeafIdentityPassportManager {
  async createPassport(userId: string, deafVerificationData: any): Promise<DeafIdentityPassport> {
    // Create comprehensive deaf identity passport
    const passport: DeafIdentityPassport = {
      userId,
      deafStatus: {
        verified: true,
        hearingLossType: deafVerificationData.hearingLossType,
        hearingLossDegree: deafVerificationData.hearingLossDegree,
        primaryCommunication: deafVerificationData.primaryCommunication,
        assistiveTechnology: this.extractAssistiveTechnology(deafVerificationData),
        verificationLevel: deafVerificationData.verificationLevel,
      },
      accessibilityPreferences: await this.generateAccessibilityPreferences(deafVerificationData),
      taxOptimization: await this.discoverTaxOptimizations(userId, deafVerificationData),
      connectedServices: [],
    }

    // Store encrypted passport
    await this.storePassport(passport)

    // Automatically notify all connected services
    await this.notifyAllConnectedServices(passport)

    return passport
  }

  async notifyAllConnectedServices(passport: DeafIdentityPassport): Promise<void> {
    // Get all connected services for this user
    const connectedServices = await this.getConnectedServices(passport.userId)

    for (const service of connectedServices) {
      try {
        await this.notifyService(service, passport)

        // Update notification status
        await this.updateServiceNotificationStatus(service.serviceId, passport.userId, "success")
      } catch (error) {
        console.error(`Failed to notify ${service.serviceName}:`, error)
        await this.updateServiceNotificationStatus(service.serviceId, passport.userId, "failed")
      }
    }
  }

  async notifyService(service: any, passport: DeafIdentityPassport): Promise<void> {
    const notificationPayload = {
      userId: passport.userId,
      deafStatus: {
        isDeaf: true,
        verified: passport.deafStatus.verified,
        hearingLossType: passport.deafStatus.hearingLossType,
        hearingLossDegree: passport.deafStatus.hearingLossDegree,
        primaryCommunication: passport.deafStatus.primaryCommunication,
        verificationLevel: passport.deafStatus.verificationLevel,
      },
      accessibilityRequirements: {
        visualAlerts: passport.accessibilityPreferences.visualAlerts,
        vibrationAlerts: passport.accessibilityPreferences.vibrationAlerts,
        interpreterRequired: passport.accessibilityPreferences.aslInterpreter,
        cartServicesRequired: passport.accessibilityPreferences.cartServices,
        highContrast: passport.accessibilityPreferences.highContrast,
        largeText: passport.accessibilityPreferences.largeText,
        emergencyContactMethod: passport.accessibilityPreferences.emergencyContactMethod,
        preferredLanguage: passport.accessibilityPreferences.preferredLanguage,
        communicationNotes: passport.accessibilityPreferences.communicationNotes,
      },
      timestamp: new Date().toISOString(),
      source: "DeafLifeOS-PinkSync",
    }

    // Send notification to service
    const response = await fetch(`${service.apiEndpoint}/accessibility/deaf-user-notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${service.accessToken}`,
        "X-DeafLifeOS-Passport": "true",
        "X-User-ID": passport.userId,
      },
      body: JSON.stringify(notificationPayload),
    })

    if (!response.ok) {
      throw new Error(`Service notification failed: ${response.statusText}`)
    }

    // Log successful notification
    await this.logServiceNotification(service.serviceId, passport.userId, notificationPayload)
  }

  async discoverTaxOptimizations(userId: string, deafData: any): Promise<any> {
    const optimizations = {
      disabilityTaxCredits: [],
      propertyTaxAbatements: [],
      employerTaxCredits: [],
      medicalDeductions: [],
      assistiveTechnologyDeductions: [],
    }

    // Federal disability tax credits
    optimizations.disabilityTaxCredits.push(
      "Federal Disabled Access Credit",
      "Work Opportunity Tax Credit (if applicable)",
      "Earned Income Tax Credit (disability provisions)",
      "Child and Dependent Care Credit (if applicable)",
    )

    // Property tax abatements by state
    const userStates = await this.getUserStates(userId)
    for (const state of userStates) {
      const stateAbatements = await this.getStatePropertyTaxAbatements(state.stateCode)
      optimizations.propertyTaxAbatements.push(...stateAbatements)
    }

    // Employer tax credits (for user's employers)
    optimizations.employerTaxCredits.push(
      "Work Opportunity Tax Credit (WOTC)",
      "Disabled Access Credit",
      "Architectural Barrier Removal Credit",
      "Small Business Tax Credit for Accessibility",
    )

    // Medical deductions
    optimizations.medicalDeductions.push(
      "Hearing aids and cochlear implants",
      "Audiologist and ENT specialist visits",
      "ASL interpreter services",
      "Assistive listening devices",
      "Captioning services",
      "Transportation to medical appointments",
      "Service animal expenses",
    )

    // Assistive technology deductions
    optimizations.assistiveTechnologyDeductions.push(
      "TTY/TDD devices",
      "Video relay service equipment",
      "Alerting devices (visual/vibrating)",
      "Computer accessibility software",
      "Smartphone accessibility apps",
      "Home modification for accessibility",
    )

    return optimizations
  }

  async trackEmployerTaxCredits(userId: string, employerInfo: any): Promise<void> {
    // Track employer's potential tax credits for hiring deaf employees
    const employerCredits = {
      userId,
      employerId: employerInfo.employerId,
      employerName: employerInfo.employerName,
      hireDate: employerInfo.hireDate,
      potentialCredits: [
        {
          creditType: "Work Opportunity Tax Credit (WOTC)",
          maxAmount: 2400, // Up to $2,400 for first year
          eligibilityPeriod: "12 months",
          requirements: "Must be certified as member of targeted group",
          status: "eligible",
        },
        {
          creditType: "Disabled Access Credit",
          maxAmount: 5000, // Up to $5,000 per year
          eligibilityPeriod: "Annual",
          requirements: "Small business with gross receipts ≤ $1M or ≤ 30 employees",
          status: "needs_verification",
        },
      ],
      accommodationCosts: [],
      totalPotentialSavings: 7400,
    }

    await db.query(
      `
      INSERT INTO employer_tax_credits (
        user_id, employer_id, employer_name, hire_date, 
        potential_credits, total_potential_savings, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (user_id, employer_id) DO UPDATE SET
        potential_credits = EXCLUDED.potential_credits,
        total_potential_savings = EXCLUDED.total_potential_savings,
        updated_at = NOW()
    `,
      [
        userId,
        employerInfo.employerId,
        employerInfo.employerName,
        employerInfo.hireDate,
        JSON.stringify(employerCredits.potentialCredits),
        employerCredits.totalPotentialSavings,
      ],
    )
  }

  async trackPropertyTaxAbatements(userId: string): Promise<void> {
    const userStates = await this.getUserStates(userId)

    for (const state of userStates) {
      const abatements = await this.getStatePropertyTaxAbatements(state.stateCode)

      for (const abatement of abatements) {
        await db.query(
          `
          INSERT INTO property_tax_abatements (
            user_id, state_code, abatement_type, description,
            potential_savings, eligibility_requirements, application_deadline,
            status, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'eligible', NOW())
          ON CONFLICT (user_id, state_code, abatement_type) DO UPDATE SET
            potential_savings = EXCLUDED.potential_savings,
            updated_at = NOW()
        `,
          [
            userId,
            state.stateCode,
            abatement.type,
            abatement.description,
            abatement.potentialSavings,
            JSON.stringify(abatement.requirements),
            abatement.deadline,
          ],
        )
      }
    }
  }

  async getStatePropertyTaxAbatements(stateCode: string): Promise<Array<any>> {
    // State-specific property tax abatements for disabled individuals
    const stateAbatements = {
      CA: [
        {
          type: "Disabled Veterans Property Tax Exemption",
          description: "100% exemption for disabled veterans",
          potentialSavings: 5000,
          requirements: ["Disabled veteran status", "Primary residence"],
          deadline: "February 15",
        },
        {
          type: "Disabled Persons Property Tax Postponement",
          description: "Postpone property taxes for disabled individuals",
          potentialSavings: 3000,
          requirements: ["Household income under $45,000", "Disability verification"],
          deadline: "December 10",
        },
      ],
      NY: [
        {
          type: "Disabled Homeowners Exemption",
          description: "50% exemption on assessed value",
          potentialSavings: 4000,
          requirements: ["Disability certification", "Income limits"],
          deadline: "March 1",
        },
      ],
      TX: [
        {
          type: "Disability Exemption",
          description: "$12,000 exemption from home value",
          potentialSavings: 2400,
          requirements: ["Disability determination", "Primary residence"],
          deadline: "April 30",
        },
      ],
      // Add all 50 states...
    }

    return stateAbatements[stateCode] || []
  }

  private async storePassport(passport: DeafIdentityPassport): Promise<void> {
    const encryptedPassport = encrypt(JSON.stringify(passport))

    await db.query(
      `
      INSERT INTO deaf_identity_passports (
        user_id, encrypted_passport_data, created_at, updated_at
      ) VALUES ($1, $2, NOW(), NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        encrypted_passport_data = EXCLUDED.encrypted_passport_data,
        updated_at = NOW()
    `,
      [passport.userId, encryptedPassport],
    )
  }

  private async getConnectedServices(userId: string): Promise<Array<any>> {
    const result = await db.query(
      `
      SELECT service_id, service_name, api_endpoint, encrypted_access_token
      FROM connected_services 
      WHERE user_id = $1 AND status = 'active'
    `,
      [userId],
    )

    return result.rows.map((row) => ({
      serviceId: row.service_id,
      serviceName: row.service_name,
      apiEndpoint: row.api_endpoint,
      accessToken: decrypt(row.encrypted_access_token),
    }))
  }

  private async getUserStates(userId: string): Promise<Array<any>> {
    const result = await db.query(
      `
      SELECT state_code FROM user_state_profiles WHERE user_id = $1
    `,
      [userId],
    )

    return result.rows
  }

  private extractAssistiveTechnology(deafData: any): string[] {
    const technology = []

    if (deafData.cochlearImplant) technology.push("Cochlear Implant")
    if (deafData.hearingAids) technology.push("Hearing Aids")
    if (deafData.primaryCommunication === "ASL") technology.push("ASL Interpretation")

    return technology
  }

  private async generateAccessibilityPreferences(deafData: any): Promise<any> {
    return {
      visualAlerts: true,
      vibrationAlerts: true,
      aslInterpreter: deafData.primaryCommunication === "ASL",
      cartServices: deafData.hearingLossDegree === "profound",
      highContrast: false,
      largeText: false,
      emergencyContactMethod: "text",
      preferredLanguage: deafData.primaryCommunication === "ASL" ? "ASL" : "English",
      communicationNotes: `Primary communication: ${deafData.primaryCommunication}. Hearing loss: ${deafData.hearingLossDegree} ${deafData.hearingLossType}.`,
    }
  }

  private async updateServiceNotificationStatus(
    serviceId: string,
    userId: string,
    status: "success" | "failed",
  ): Promise<void> {
    await db.query(
      `
      UPDATE connected_services 
      SET last_deaf_notification = NOW(), notification_status = $1
      WHERE service_id = $2 AND user_id = $3
    `,
      [status, serviceId, userId],
    )
  }

  private async logServiceNotification(serviceId: string, userId: string, payload: any): Promise<void> {
    await db.query(
      `
      INSERT INTO service_notifications (
        user_id, service_id, notification_type, payload, sent_at
      ) VALUES ($1, $2, 'deaf_identity_passport', $3, NOW())
    `,
      [userId, serviceId, JSON.stringify(payload)],
    )
  }
}
