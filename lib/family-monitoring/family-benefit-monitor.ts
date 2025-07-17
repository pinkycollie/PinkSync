import { db } from "@/lib/database"

export interface FamilyMember {
  id: string
  primaryUserId: string
  relationship: "spouse" | "child" | "parent" | "sibling" | "grandparent" | "guardian" | "dependent"
  firstName: string
  lastName: string
  dateOfBirth: Date
  hearingStatus: "deaf" | "hard_of_hearing" | "hearing" | "unknown"
  primaryCommunication: string
  dependentStatus: boolean
  beneficiaryStatus: boolean
  emergencyContact: boolean
  consentToMonitor: boolean
  createdAt: Date
  updatedAt: Date
}

export interface FamilyBenefitOpportunity {
  id: string
  familyId: string
  benefitType: "education" | "healthcare" | "tax_credit" | "caregiver_support" | "accessibility" | "emergency_services"
  eligibleMembers: string[]
  benefitName: string
  description: string
  potentialValue: number
  applicationDeadline?: Date
  requirements: string[]
  status: "discovered" | "eligible" | "applied" | "approved" | "denied"
  priority: "low" | "medium" | "high" | "critical"
  createdAt: Date
}

export interface FamilyAccessibilityProfile {
  familyId: string
  householdCommunication: string[]
  emergencyProtocols: Record<string, any>
  accessibilityNeeds: Record<string, any>
  interpreterServices: boolean
  visualAlertSystems: boolean
  assistiveTechnology: string[]
  educationalSupport: Record<string, any>
  caregiverSupport: Record<string, any>
}

export class FamilyBenefitMonitor {
  async createFamilyUnit(primaryUserId: string, familyData: any): Promise<string> {
    const familyId = await db.query(
      `
      INSERT INTO family_units (
        primary_user_id, family_name, household_size, 
        primary_communication_method, accessibility_needs,
        emergency_contact_preferences, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING id
    `,
      [
        primaryUserId,
        familyData.familyName,
        familyData.householdSize,
        familyData.primaryCommunication,
        JSON.stringify(familyData.accessibilityNeeds),
        JSON.stringify(familyData.emergencyPreferences),
      ],
    )

    return familyId.rows[0].id
  }

  async addFamilyMember(familyId: string, memberData: FamilyMember): Promise<void> {
    await db.query(
      `
      INSERT INTO family_members (
        family_id, relationship, first_name, last_name, date_of_birth,
        hearing_status, primary_communication, dependent_status,
        beneficiary_status, emergency_contact, consent_to_monitor, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
    `,
      [
        familyId,
        memberData.relationship,
        memberData.firstName,
        memberData.lastName,
        memberData.dateOfBirth,
        memberData.hearingStatus,
        memberData.primaryCommunication,
        memberData.dependentStatus,
        memberData.beneficiaryStatus,
        memberData.emergencyContact,
        memberData.consentToMonitor,
      ],
    )

    // Start monitoring for this family member
    await this.initializeFamilyMemberMonitoring(familyId, memberData)
  }

  async discoverFamilyBenefits(familyId: string): Promise<FamilyBenefitOpportunity[]> {
    const familyProfile = await this.getFamilyProfile(familyId)
    const opportunities: FamilyBenefitOpportunity[] = []

    // Discover benefits for each category
    opportunities.push(...(await this.discoverEducationBenefits(familyProfile)))
    opportunities.push(...(await this.discoverHealthcareBenefits(familyProfile)))
    opportunities.push(...(await this.discoverTaxCreditBenefits(familyProfile)))
    opportunities.push(...(await this.discoverCaregiverBenefits(familyProfile)))
    opportunities.push(...(await this.discoverAccessibilityBenefits(familyProfile)))
    opportunities.push(...(await this.discoverEmergencyServiceBenefits(familyProfile)))

    // Store discovered opportunities
    for (const opportunity of opportunities) {
      await this.storeFamilyBenefitOpportunity(opportunity)
    }

    return opportunities
  }

  async discoverEducationBenefits(familyProfile: any): Promise<FamilyBenefitOpportunity[]> {
    const benefits: FamilyBenefitOpportunity[] = []

    // ASL Classes for Hearing Family Members
    const hearingMembers = familyProfile.members.filter((m: any) => m.hearingStatus === "hearing")
    if (hearingMembers.length > 0) {
      benefits.push({
        id: `edu_asl_${Date.now()}`,
        familyId: familyProfile.familyId,
        benefitType: "education",
        eligibleMembers: hearingMembers.map((m: any) => m.id),
        benefitName: "Free ASL Classes for Hearing Family Members",
        description: "State-funded ASL education programs for families with deaf members",
        potentialValue: 2400, // $200/month for 12 months
        requirements: [
          "Family member must be deaf or hard of hearing",
          "Hearing family member must be immediate family",
          "Commit to 6-month program minimum",
        ],
        status: "discovered",
        priority: "high",
        createdAt: new Date(),
      })
    }

    // Special Education Services for Deaf Children
    const deafChildren = familyProfile.members.filter(
      (m: any) => m.hearingStatus !== "hearing" && this.calculateAge(m.dateOfBirth) < 18,
    )
    for (const child of deafChildren) {
      benefits.push({
        id: `edu_special_${child.id}_${Date.now()}`,
        familyId: familyProfile.familyId,
        benefitType: "education",
        eligibleMembers: [child.id],
        benefitName: "Enhanced Special Education Services",
        description: "Comprehensive deaf education services including interpreters, CART, and assistive technology",
        potentialValue: 15000, // Annual value of services
        requirements: ["Child must be under 18", "Documented hearing loss", "IEP evaluation"],
        status: "discovered",
        priority: "critical",
        createdAt: new Date(),
      })
    }

    // College Support for Deaf Students
    const collegeAgeDeaf = familyProfile.members.filter(
      (m: any) =>
        m.hearingStatus !== "hearing" &&
        this.calculateAge(m.dateOfBirth) >= 18 &&
        this.calculateAge(m.dateOfBirth) <= 26,
    )
    for (const student of collegeAgeDeaf) {
      benefits.push({
        id: `edu_college_${student.id}_${Date.now()}`,
        familyId: familyProfile.familyId,
        benefitType: "education",
        eligibleMembers: [student.id],
        benefitName: "Deaf Student College Support Services",
        description: "Interpreting services, note-taking, assistive technology, and academic accommodations",
        potentialValue: 8000, // Annual support value
        requirements: ["Enrolled in accredited institution", "Documented hearing loss", "Academic good standing"],
        status: "discovered",
        priority: "high",
        createdAt: new Date(),
      })
    }

    return benefits
  }

  async discoverHealthcareBenefits(familyProfile: any): Promise<FamilyBenefitOpportunity[]> {
    const benefits: FamilyBenefitOpportunity[] = []

    // Family Health Insurance Premium Assistance
    if (familyProfile.members.some((m: any) => m.hearingStatus !== "hearing")) {
      benefits.push({
        id: `health_premium_${Date.now()}`,
        familyId: familyProfile.familyId,
        benefitType: "healthcare",
        eligibleMembers: familyProfile.members.map((m: any) => m.id),
        benefitName: "Disability Health Insurance Premium Assistance",
        description: "Reduced health insurance premiums for families with disabled members",
        potentialValue: 3600, // $300/month savings
        requirements: ["Family member with documented disability", "Income below 400% FPL", "Enrolled in ACA plan"],
        status: "discovered",
        priority: "high",
        createdAt: new Date(),
      })
    }

    // Mental Health Support for Hearing Family Members
    const hearingMembers = familyProfile.members.filter((m: any) => m.hearingStatus === "hearing")
    if (hearingMembers.length > 0) {
      benefits.push({
        id: `health_mental_${Date.now()}`,
        familyId: familyProfile.familyId,
        benefitType: "healthcare",
        eligibleMembers: hearingMembers.map((m: any) => m.id),
        benefitName: "Family Counseling for Deaf Family Dynamics",
        description: "Specialized counseling services for hearing family members of deaf individuals",
        potentialValue: 2400, // $200/month for therapy
        requirements: ["Family member must be deaf", "Referral from primary care", "Insurance coverage verification"],
        status: "discovered",
        priority: "medium",
        createdAt: new Date(),
      })
    }

    // Genetic Counseling for Hereditary Hearing Loss
    if (familyProfile.members.filter((m: any) => m.hearingStatus !== "hearing").length > 1) {
      benefits.push({
        id: `health_genetic_${Date.now()}`,
        familyId: familyProfile.familyId,
        benefitType: "healthcare",
        eligibleMembers: familyProfile.members.map((m: any) => m.id),
        benefitName: "Genetic Counseling for Hereditary Hearing Loss",
        description: "Comprehensive genetic testing and counseling for families with multiple deaf members",
        potentialValue: 1500, // One-time testing and counseling
        requirements: ["Multiple family members with hearing loss", "Medical referral", "Insurance pre-authorization"],
        status: "discovered",
        priority: "medium",
        createdAt: new Date(),
      })
    }

    return benefits
  }

  async discoverTaxCreditBenefits(familyProfile: any): Promise<FamilyBenefitOpportunity[]> {
    const benefits: FamilyBenefitOpportunity[] = []

    // Dependent Care Credit for Deaf Children
    const deafDependents = familyProfile.members.filter((m: any) => m.dependentStatus && m.hearingStatus !== "hearing")
    if (deafDependents.length > 0) {
      benefits.push({
        id: `tax_dependent_care_${Date.now()}`,
        familyId: familyProfile.familyId,
        benefitType: "tax_credit",
        eligibleMembers: deafDependents.map((m: any) => m.id),
        benefitName: "Enhanced Dependent Care Credit for Deaf Children",
        description: "Increased dependent care credit for specialized deaf childcare services",
        potentialValue: 4000, // Enhanced credit amount
        requirements: ["Deaf dependent under 13", "Specialized care expenses", "Working parent(s)"],
        status: "discovered",
        priority: "high",
        createdAt: new Date(),
      })
    }

    // Caregiver Tax Credit
    const caregivers = familyProfile.members.filter(
      (m: any) => m.relationship === "spouse" || m.relationship === "parent",
    )
    if (caregivers.length > 0 && deafDependents.length > 0) {
      benefits.push({
        id: `tax_caregiver_${Date.now()}`,
        familyId: familyProfile.familyId,
        benefitType: "tax_credit",
        eligibleMembers: caregivers.map((m: any) => m.id),
        benefitName: "Family Caregiver Tax Credit",
        description: "Tax credit for family members providing care to deaf relatives",
        potentialValue: 2500, // Annual credit
        requirements: [
          "Providing care to deaf family member",
          "Care recipient qualifies as dependent",
          "Income limits apply",
        ],
        status: "discovered",
        priority: "medium",
        createdAt: new Date(),
      })
    }

    // Home Modification Tax Credit
    benefits.push({
      id: `tax_home_mod_${Date.now()}`,
      familyId: familyProfile.familyId,
      benefitType: "tax_credit",
      eligibleMembers: familyProfile.members.map((m: any) => m.id),
      benefitName: "Home Accessibility Modification Tax Credit",
      description: "Tax credit for home modifications to accommodate deaf family members",
      potentialValue: 5000, // Up to $5,000 credit
      requirements: ["Home modifications for accessibility", "Receipts and documentation", "Medical necessity letter"],
      status: "discovered",
      priority: "medium",
      createdAt: new Date(),
    })

    return benefits
  }

  async discoverCaregiverBenefits(familyProfile: any): Promise<FamilyBenefitOpportunity[]> {
    const benefits: FamilyBenefitOpportunity[] = []

    // Respite Care Services
    const caregivers = familyProfile.members.filter(
      (m: any) => m.relationship === "spouse" || m.relationship === "parent" || m.relationship === "guardian",
    )
    if (caregivers.length > 0) {
      benefits.push({
        id: `caregiver_respite_${Date.now()}`,
        familyId: familyProfile.familyId,
        benefitType: "caregiver_support",
        eligibleMembers: caregivers.map((m: any) => m.id),
        benefitName: "Deaf Family Respite Care Services",
        description: "Temporary care services to give family caregivers a break",
        potentialValue: 3000, // 20 hours/month at $150/hour
        requirements: [
          "Primary caregiver for deaf family member",
          "Caregiver stress assessment",
          "Service availability in area",
        ],
        status: "discovered",
        priority: "medium",
        createdAt: new Date(),
      })
    }

    // Caregiver Training Programs
    benefits.push({
      id: `caregiver_training_${Date.now()}`,
      familyId: familyProfile.familyId,
      benefitType: "caregiver_support",
      eligibleMembers: caregivers.map((m: any) => m.id),
      benefitName: "Deaf Awareness and Communication Training",
      description: "Free training programs for family members caring for deaf relatives",
      potentialValue: 800, // Value of training program
      requirements: ["Family member with hearing loss", "Commitment to complete program", "Available training slots"],
      status: "discovered",
      priority: "high",
      createdAt: new Date(),
    })

    // Family Support Groups
    benefits.push({
      id: `caregiver_support_${Date.now()}`,
      familyId: familyProfile.familyId,
      benefitType: "caregiver_support",
      eligibleMembers: familyProfile.members.map((m: any) => m.id),
      benefitName: "Deaf Family Support Groups",
      description: "Peer support groups for families navigating deaf culture and communication",
      potentialValue: 600, // Annual program value
      requirements: ["Family with deaf member", "Regular attendance commitment", "Group availability"],
      status: "discovered",
      priority: "medium",
      createdAt: new Date(),
    })

    return benefits
  }

  async discoverAccessibilityBenefits(familyProfile: any): Promise<FamilyBenefitOpportunity[]> {
    const benefits: FamilyBenefitOpportunity[] = []

    // Home Alert System Installation
    benefits.push({
      id: `access_alert_system_${Date.now()}`,
      familyId: familyProfile.familyId,
      benefitType: "accessibility",
      eligibleMembers: familyProfile.members.filter((m: any) => m.hearingStatus !== "hearing").map((m: any) => m.id),
      benefitName: "Free Home Visual Alert System",
      description: "Installation of doorbell, phone, and emergency visual alert systems",
      potentialValue: 2500, // Equipment and installation value
      requirements: ["Deaf or hard of hearing family member", "Own or rent home", "Income eligibility"],
      status: "discovered",
      priority: "high",
      createdAt: new Date(),
    })

    // Vehicle Accessibility Modifications
    const drivingAgeMembers = familyProfile.members.filter(
      (m: any) => m.hearingStatus !== "hearing" && this.calculateAge(m.dateOfBirth) >= 16,
    )
    if (drivingAgeMembers.length > 0) {
      benefits.push({
        id: `access_vehicle_${Date.now()}`,
        familyId: familyProfile.familyId,
        benefitType: "accessibility",
        eligibleMembers: drivingAgeMembers.map((m: any) => m.id),
        benefitName: "Vehicle Accessibility Modification Grant",
        description: "Grants for vehicle modifications including visual alert systems and communication devices",
        potentialValue: 3000, // Modification grant amount
        requirements: ["Valid driver's license", "Documented hearing loss", "Vehicle ownership or lease"],
        status: "discovered",
        priority: "medium",
        createdAt: new Date(),
      })
    }

    // Assistive Technology Grant
    benefits.push({
      id: `access_tech_grant_${Date.now()}`,
      familyId: familyProfile.familyId,
      benefitType: "accessibility",
      eligibleMembers: familyProfile.members.filter((m: any) => m.hearingStatus !== "hearing").map((m: any) => m.id),
      benefitName: "Family Assistive Technology Grant",
      description: "Grants for hearing aids, cochlear implants, FM systems, and communication devices",
      potentialValue: 8000, // Technology grant amount
      requirements: ["Audiological evaluation", "Technology assessment", "Income verification"],
      status: "discovered",
      priority: "critical",
      createdAt: new Date(),
    })

    return benefits
  }

  async discoverEmergencyServiceBenefits(familyProfile: any): Promise<FamilyBenefitOpportunity[]> {
    const benefits: FamilyBenefitOpportunity[] = []

    // Emergency Communication Registration
    benefits.push({
      id: `emergency_comm_${Date.now()}`,
      familyId: familyProfile.familyId,
      benefitType: "emergency_services",
      eligibleMembers: familyProfile.members.filter((m: any) => m.hearingStatus !== "hearing").map((m: any) => m.id),
      benefitName: "Emergency Services Communication Registration",
      description: "Register with local emergency services for specialized deaf communication protocols",
      potentialValue: 0, // Free service but invaluable
      requirements: ["Documented hearing loss", "Local address verification", "Emergency contact information"],
      status: "discovered",
      priority: "critical",
      createdAt: new Date(),
    })

    // Family Emergency Plan Development
    benefits.push({
      id: `emergency_plan_${Date.now()}`,
      familyId: familyProfile.familyId,
      benefitType: "emergency_services",
      eligibleMembers: familyProfile.members.map((m: any) => m.id),
      benefitName: "Deaf Family Emergency Plan Development",
      description: "Professional assistance developing family emergency plans with deaf-specific considerations",
      potentialValue: 500, // Consultation value
      requirements: ["Family with deaf member", "Home assessment", "Plan implementation commitment"],
      status: "discovered",
      priority: "high",
      createdAt: new Date(),
    })

    return benefits
  }

  async monitorFamilyBenefitChanges(familyId: string): Promise<void> {
    // Set up continuous monitoring for family benefit changes
    const familyProfile = await this.getFamilyProfile(familyId)

    // Monitor each family member's benefits
    for (const member of familyProfile.members) {
      await this.setupIndividualMemberMonitoring(member)
    }

    // Monitor family-wide benefits
    await this.setupFamilyWideMonitoring(familyId)
  }

  async generateFamilyBenefitReport(familyId: string): Promise<any> {
    const familyProfile = await this.getFamilyProfile(familyId)
    const opportunities = await this.discoverFamilyBenefits(familyId)

    const report = {
      familyId,
      generatedAt: new Date(),
      familySize: familyProfile.members.length,
      deafMembers: familyProfile.members.filter((m: any) => m.hearingStatus !== "hearing").length,
      hearingMembers: familyProfile.members.filter((m: any) => m.hearingStatus === "hearing").length,
      totalOpportunities: opportunities.length,
      potentialAnnualValue: opportunities.reduce((sum, opp) => sum + opp.potentialValue, 0),
      opportunitiesByType: this.groupOpportunitiesByType(opportunities),
      priorityOpportunities: opportunities.filter((opp) => opp.priority === "critical" || opp.priority === "high"),
      actionItems: this.generateActionItems(opportunities),
      nextSteps: this.generateNextSteps(familyProfile, opportunities),
    }

    return report
  }

  private async initializeFamilyMemberMonitoring(familyId: string, member: FamilyMember): Promise<void> {
    if (!member.consentToMonitor) return

    // Set up monitoring based on member characteristics
    const monitoringConfig = {
      memberId: member.id,
      familyId,
      monitoringTypes: this.determineMonitoringTypes(member),
      alertPreferences: this.getDefaultAlertPreferences(member),
      isActive: true,
    }

    await db.query(
      `
      INSERT INTO family_member_monitoring (
        member_id, family_id, monitoring_config, created_at
      ) VALUES ($1, $2, $3, NOW())
    `,
      [member.id, familyId, JSON.stringify(monitoringConfig)],
    )
  }

  private determineMonitoringTypes(member: FamilyMember): string[] {
    const types = ["benefit_changes", "new_opportunities"]

    if (member.hearingStatus !== "hearing") {
      types.push("accessibility_updates", "assistive_technology", "deaf_services")
    }

    if (member.dependentStatus) {
      types.push("dependent_benefits", "education_services", "healthcare_coverage")
    }

    if (this.calculateAge(member.dateOfBirth) < 18) {
      types.push("child_services", "education_benefits", "family_support")
    }

    if (this.calculateAge(member.dateOfBirth) >= 65) {
      types.push("senior_benefits", "medicare_supplements", "aging_services")
    }

    return types
  }

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  private async getFamilyProfile(familyId: string): Promise<any> {
    const familyResult = await db.query(
      `
      SELECT * FROM family_units WHERE id = $1
    `,
      [familyId],
    )

    const membersResult = await db.query(
      `
      SELECT * FROM family_members WHERE family_id = $1
    `,
      [familyId],
    )

    return {
      familyId,
      ...familyResult.rows[0],
      members: membersResult.rows,
    }
  }

  private async storeFamilyBenefitOpportunity(opportunity: FamilyBenefitOpportunity): Promise<void> {
    await db.query(
      `
      INSERT INTO family_benefit_opportunities (
        family_id, benefit_type, eligible_members, benefit_name,
        description, potential_value, application_deadline,
        requirements, status, priority, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      ON CONFLICT (family_id, benefit_name) DO UPDATE SET
        potential_value = EXCLUDED.potential_value,
        status = EXCLUDED.status,
        updated_at = NOW()
    `,
      [
        opportunity.familyId,
        opportunity.benefitType,
        JSON.stringify(opportunity.eligibleMembers),
        opportunity.benefitName,
        opportunity.description,
        opportunity.potentialValue,
        opportunity.applicationDeadline,
        JSON.stringify(opportunity.requirements),
        opportunity.status,
        opportunity.priority,
      ],
    )
  }

  private groupOpportunitiesByType(opportunities: FamilyBenefitOpportunity[]): Record<string, number> {
    return opportunities.reduce(
      (acc, opp) => {
        acc[opp.benefitType] = (acc[opp.benefitType] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
  }

  private generateActionItems(opportunities: FamilyBenefitOpportunity[]): string[] {
    const actionItems: string[] = []

    const criticalOpps = opportunities.filter((opp) => opp.priority === "critical")
    if (criticalOpps.length > 0) {
      actionItems.push(`Review ${criticalOpps.length} critical benefit opportunities immediately`)
    }

    const deadlineOpps = opportunities.filter(
      (opp) => opp.applicationDeadline && opp.applicationDeadline < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    )
    if (deadlineOpps.length > 0) {
      actionItems.push(`Apply for ${deadlineOpps.length} benefits with upcoming deadlines`)
    }

    return actionItems
  }

  private generateNextSteps(familyProfile: any, opportunities: FamilyBenefitOpportunity[]): string[] {
    const nextSteps: string[] = []

    nextSteps.push("Review all discovered benefit opportunities with family")
    nextSteps.push("Gather required documentation for high-priority benefits")
    nextSteps.push("Schedule consultations with benefit specialists if needed")
    nextSteps.push("Set up automatic monitoring for benefit changes")

    return nextSteps
  }

  private getDefaultAlertPreferences(member: FamilyMember): any {
    return {
      email: true,
      sms: member.relationship === "spouse" || member.relationship === "parent",
      push: true,
      severity: "medium",
    }
  }

  private async setupIndividualMemberMonitoring(member: any): Promise<void> {
    // Implementation for individual member monitoring
  }

  private async setupFamilyWideMonitoring(familyId: string): Promise<void> {
    // Implementation for family-wide monitoring
  }
}
