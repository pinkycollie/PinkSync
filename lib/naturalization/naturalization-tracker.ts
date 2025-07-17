import { db } from "@/lib/database"

export interface NaturalizationApplication {
  id: string
  familyId: string
  applicantId: string
  applicationNumber?: string
  currentStatus:
    | "eligibility_review"
    | "preparing_application"
    | "application_submitted"
    | "biometrics_scheduled"
    | "biometrics_completed"
    | "interview_scheduled"
    | "interview_completed"
    | "decision_pending"
    | "approved"
    | "oath_scheduled"
    | "oath_completed"
    | "naturalized"
    | "denied"
    | "appeal_filed"
  eligibilityDate: Date
  applicationSubmissionDate?: Date
  expectedCompletionDate?: Date
  priorityProcessing: boolean
  accommodationsRequested: string[]
  accommodationsApproved: string[]
  currentStep: number
  totalSteps: number
  createdAt: Date
  updatedAt: Date
}

export interface DeafAccommodation {
  id: string
  applicationId: string
  accommodationType:
    | "sign_language_interpreter"
    | "written_instructions"
    | "extended_time"
    | "visual_aids"
    | "assistive_technology"
    | "quiet_testing_environment"
    | "alternative_format"
    | "communication_assistance"
  specificRequests: string[]
  justification: string
  medicalDocumentation?: string
  requestStatus: "pending" | "approved" | "denied" | "needs_clarification"
  approvalDate?: Date
  implementationNotes?: string
  createdAt: Date
}

export interface NaturalizationMilestone {
  id: string
  applicationId: string
  milestoneType: string
  milestoneTitle: string
  description: string
  dueDate?: Date
  completedDate?: Date
  status: "upcoming" | "in_progress" | "completed" | "overdue" | "cancelled"
  accommodationsNeeded: boolean
  accommodationDetails?: string
  documents: string[]
  nextSteps: string[]
  priority: "low" | "medium" | "high" | "critical"
  createdAt: Date
}

export interface CivicsTestPreparation {
  id: string
  applicantId: string
  testFormat: "standard" | "deaf_accommodated" | "visual_enhanced"
  studyMaterials: string[]
  practiceTestScores: Array<{
    date: Date
    score: number
    totalQuestions: number
    timeSpent: number
    accommodationsUsed: string[]
  }>
  weakAreas: string[]
  strengthAreas: string[]
  recommendedStudyPlan: string[]
  interpreterNeeded: boolean
  visualAidsNeeded: boolean
  readinessScore: number
  estimatedTestDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface InterviewPreparation {
  id: string
  applicationId: string
  interviewDate?: Date
  interviewLocation?: string
  accommodationsConfirmed: string[]
  practiceSessionsCompleted: number
  mockInterviewScores: Array<{
    date: Date
    communicationScore: number
    contentScore: number
    confidenceScore: number
    feedback: string
  }>
  potentialChallenges: string[]
  preparationStrategies: string[]
  interpreterAssigned?: string
  culturalConsiderations: string[]
  readinessLevel: "not_ready" | "needs_practice" | "ready" | "very_ready"
  createdAt: Date
  updatedAt: Date
}

export interface FamilyNaturalizationCoordination {
  id: string
  familyId: string
  coordinatedApplications: string[]
  familyStrategy: "simultaneous" | "sequential" | "independent"
  primaryApplicant?: string
  dependentApplications: string[]
  sharedAccommodations: string[]
  familyInterviewDate?: Date
  ceremonyCelebrationPlanned: boolean
  totalFamilyCost: number
  costSharingPlan: Record<string, number>
  timelineCoordination: Record<string, Date>
  createdAt: Date
  updatedAt: Date
}

export class NaturalizationTracker {
  async createNaturalizationApplication(
    familyId: string,
    applicantId: string,
    applicationData: Partial<NaturalizationApplication>,
  ): Promise<string> {
    // Calculate eligibility date based on immigration status
    const eligibilityDate = await this.calculateEligibilityDate(applicantId)

    const application = await db.query(
      `
      INSERT INTO naturalization_applications (
        family_id, applicant_id, current_status, eligibility_date,
        priority_processing, accommodations_requested, current_step, total_steps, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING id
    `,
      [
        familyId,
        applicantId,
        applicationData.currentStatus || "eligibility_review",
        eligibilityDate,
        applicationData.priorityProcessing || false,
        JSON.stringify(applicationData.accommodationsRequested || []),
        1,
        12, // Total steps in naturalization process
      ],
    )

    const applicationId = application.rows[0].id

    // Create initial milestones
    await this.createNaturalizationMilestones(applicationId)

    // Set up deaf accommodations if needed
    await this.setupDeafAccommodations(applicationId, applicantId)

    // Initialize test preparation
    await this.initializeCivicsTestPreparation(applicationId, applicantId)

    return applicationId
  }

  async calculateEligibilityDate(applicantId: string): Promise<Date> {
    const applicant = await db.query(
      `
      SELECT immigration_status, arrival_date, permanent_resident_date
      FROM family_members fm
      JOIN immigrant_family_profiles ifp ON fm.family_id = ifp.family_id
      WHERE fm.id = $1
    `,
      [applicantId],
    )

    const { immigration_status, arrival_date, permanent_resident_date } = applicant.rows[0]

    let eligibilityDate = new Date()

    switch (immigration_status) {
      case "permanent_resident":
        // 5 years as permanent resident (3 years if married to US citizen)
        eligibilityDate = new Date(permanent_resident_date)
        eligibilityDate.setFullYear(eligibilityDate.getFullYear() + 5)
        break
      case "refugee":
      case "asylum_seeker":
        // 5 years from arrival (1 year counts toward permanent residency)
        eligibilityDate = new Date(arrival_date)
        eligibilityDate.setFullYear(eligibilityDate.getFullYear() + 5)
        break
      default:
        // Default 5 years
        eligibilityDate = new Date(arrival_date)
        eligibilityDate.setFullYear(eligibilityDate.getFullYear() + 5)
    }

    return eligibilityDate
  }

  async createNaturalizationMilestones(applicationId: string): Promise<void> {
    const milestones = [
      {
        type: "eligibility_verification",
        title: "Verify Eligibility Requirements",
        description: "Confirm you meet all requirements for naturalization",
        accommodationsNeeded: false,
        priority: "critical",
      },
      {
        type: "document_gathering",
        title: "Gather Required Documents",
        description: "Collect all necessary documents including green card, tax returns, and travel records",
        accommodationsNeeded: true,
        accommodationDetails: "Document translation services available",
        priority: "high",
      },
      {
        type: "form_n400_preparation",
        title: "Complete Form N-400",
        description: "Fill out Application for Naturalization with accuracy",
        accommodationsNeeded: true,
        accommodationDetails: "ASL interpretation available for form completion assistance",
        priority: "high",
      },
      {
        type: "accommodation_requests",
        title: "Submit Accommodation Requests",
        description: "Request necessary accommodations for testing and interview",
        accommodationsNeeded: true,
        accommodationDetails: "Submit Form N-648 if applicable, request interpreters",
        priority: "critical",
      },
      {
        type: "application_submission",
        title: "Submit Application and Pay Fees",
        description: "Submit completed N-400 with supporting documents and fees",
        accommodationsNeeded: false,
        priority: "critical",
      },
      {
        type: "biometrics_appointment",
        title: "Attend Biometrics Appointment",
        description: "Provide fingerprints, photo, and signature",
        accommodationsNeeded: true,
        accommodationDetails: "Interpreter services available upon request",
        priority: "high",
      },
      {
        type: "civics_test_preparation",
        title: "Prepare for Civics Test",
        description: "Study civics and history using deaf-accessible materials",
        accommodationsNeeded: true,
        accommodationDetails: "Visual study materials, ASL videos, extended time accommodations",
        priority: "high",
      },
      {
        type: "english_test_preparation",
        title: "Prepare for English Test",
        description: "Practice reading, writing, and speaking English",
        accommodationsNeeded: true,
        accommodationDetails: "Alternative testing formats available for deaf applicants",
        priority: "high",
      },
      {
        type: "interview_preparation",
        title: "Prepare for Naturalization Interview",
        description: "Practice interview questions and review application",
        accommodationsNeeded: true,
        accommodationDetails: "Mock interviews with interpreter, cultural preparation",
        priority: "critical",
      },
      {
        type: "naturalization_interview",
        title: "Attend Naturalization Interview",
        description: "Complete interview, civics test, and English test",
        accommodationsNeeded: true,
        accommodationDetails: "ASL interpreter, extended time, written instructions",
        priority: "critical",
      },
      {
        type: "decision_waiting",
        title: "Await Decision",
        description: "Wait for USCIS decision on your application",
        accommodationsNeeded: false,
        priority: "medium",
      },
      {
        type: "oath_ceremony",
        title: "Attend Oath of Allegiance Ceremony",
        description: "Take the Oath of Allegiance and receive Certificate of Naturalization",
        accommodationsNeeded: true,
        accommodationDetails: "ASL interpretation of ceremony, accessible seating",
        priority: "critical",
      },
    ]

    for (let i = 0; i < milestones.length; i++) {
      const milestone = milestones[i]
      await db.query(
        `
        INSERT INTO naturalization_milestones (
          application_id, milestone_type, milestone_title, description,
          accommodations_needed, accommodation_details, priority, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      `,
        [
          applicationId,
          milestone.type,
          milestone.title,
          milestone.description,
          milestone.accommodationsNeeded,
          milestone.accommodationDetails || null,
          milestone.priority,
          i === 0 ? "in_progress" : "upcoming",
        ],
      )
    }
  }

  async setupDeafAccommodations(applicationId: string, applicantId: string): Promise<void> {
    // Check if applicant is deaf/hard of hearing
    const applicant = await db.query(
      `
      SELECT hearing_status, communication_preferences, accessibility_needs
      FROM family_members WHERE id = $1
    `,
      [applicantId],
    )

    if (applicant.rows[0]?.hearing_status === "deaf" || applicant.rows[0]?.hearing_status === "hard_of_hearing") {
      const standardAccommodations = [
        {
          type: "sign_language_interpreter",
          requests: ["ASL interpreter for all appointments", "Certified interpreter for interview"],
          justification: "Applicant is deaf and uses American Sign Language as primary communication method",
        },
        {
          type: "written_instructions",
          requests: ["All verbal instructions provided in writing", "Written confirmation of appointments"],
          justification: "Ensures clear communication and reduces misunderstandings",
        },
        {
          type: "extended_time",
          requests: ["Additional time for tests", "Extended interview time"],
          justification: "Accommodation for processing information through interpreter",
        },
        {
          type: "visual_aids",
          requests: ["Visual study materials", "Charts and diagrams for civics concepts"],
          justification: "Visual learning methods are more effective for deaf learners",
        },
        {
          type: "assistive_technology",
          requests: ["CART services if needed", "FM system compatibility"],
          justification: "Technology assistance for optimal communication",
        },
      ]

      for (const accommodation of standardAccommodations) {
        await db.query(
          `
          INSERT INTO deaf_accommodations (
            application_id, accommodation_type, specific_requests, justification, request_status, created_at
          ) VALUES ($1, $2, $3, $4, $5, NOW())
        `,
          [
            applicationId,
            accommodation.type,
            JSON.stringify(accommodation.requests),
            accommodation.justification,
            "pending",
          ],
        )
      }
    }
  }

  async initializeCivicsTestPreparation(applicationId: string, applicantId: string): Promise<void> {
    const preparation = await db.query(
      `
      INSERT INTO civics_test_preparation (
        applicant_id, test_format, study_materials, interpreter_needed, visual_aids_needed, readiness_score, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING id
    `,
      [
        applicantId,
        "deaf_accommodated",
        JSON.stringify([
          "ASL Civics Study Videos",
          "Visual History Timeline",
          "Interactive Civics Games",
          "Practice Tests with Extended Time",
          "Deaf Community Study Groups",
        ]),
        true,
        true,
        0,
      ],
    )

    return preparation.rows[0].id
  }

  async requestAccommodation(
    applicationId: string,
    accommodationType: string,
    specificRequests: string[],
    justification: string,
    medicalDocumentation?: string,
  ): Promise<string> {
    const accommodation = await db.query(
      `
      INSERT INTO deaf_accommodations (
        application_id, accommodation_type, specific_requests, justification,
        medical_documentation, request_status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING id
    `,
      [
        applicationId,
        accommodationType,
        JSON.stringify(specificRequests),
        justification,
        medicalDocumentation,
        "pending",
      ],
    )

    // Auto-submit accommodation request to USCIS
    await this.submitAccommodationToUSCIS(accommodation.rows[0].id)

    return accommodation.rows[0].id
  }

  async updateApplicationStatus(applicationId: string, newStatus: string, notes?: string): Promise<void> {
    await db.query(
      `
      UPDATE naturalization_applications 
      SET current_status = $1, updated_at = NOW()
      WHERE id = $2
    `,
      [newStatus, applicationId],
    )

    // Update current step based on status
    const stepMapping: Record<string, number> = {
      eligibility_review: 1,
      preparing_application: 2,
      application_submitted: 3,
      biometrics_scheduled: 4,
      biometrics_completed: 5,
      interview_scheduled: 6,
      interview_completed: 7,
      decision_pending: 8,
      approved: 9,
      oath_scheduled: 10,
      oath_completed: 11,
      naturalized: 12,
    }

    const currentStep = stepMapping[newStatus] || 1

    await db.query(
      `
      UPDATE naturalization_applications 
      SET current_step = $1
      WHERE id = $2
    `,
      [currentStep, applicationId],
    )

    // Update relevant milestones
    await this.updateMilestoneStatus(applicationId, newStatus)

    // Log status change
    await this.logStatusChange(applicationId, newStatus, notes)
  }

  async schedulePracticeInterview(applicationId: string, interviewDate: Date): Promise<string> {
    const practiceSession = await db.query(
      `
      INSERT INTO interview_preparation (
        application_id, practice_sessions_completed, readiness_level, created_at
      ) VALUES ($1, $2, $3, NOW())
      RETURNING id
    `,
      [applicationId, 0, "not_ready"],
    )

    // Schedule with deaf-competent interviewer
    await this.scheduleDeafCompetentPracticeSession(practiceSession.rows[0].id, interviewDate)

    return practiceSession.rows[0].id
  }

  async recordPracticeTestScore(
    applicantId: string,
    score: number,
    totalQuestions: number,
    timeSpent: number,
    accommodationsUsed: string[],
  ): Promise<void> {
    const testRecord = {
      date: new Date(),
      score,
      totalQuestions,
      timeSpent,
      accommodationsUsed,
    }

    await db.query(
      `
      UPDATE civics_test_preparation 
      SET practice_test_scores = practice_test_scores || $1::jsonb,
          readiness_score = $2,
          updated_at = NOW()
      WHERE applicant_id = $3
    `,
      [JSON.stringify(testRecord), this.calculateReadinessScore(score, totalQuestions), applicantId],
    )

    // Analyze weak areas and update study plan
    await this.updateStudyPlan(applicantId, score, totalQuestions)
  }

  async coordinateFamilyApplications(familyId: string, strategy: string): Promise<string> {
    const familyApplications = await db.query(
      `
      SELECT id, applicant_id, current_status FROM naturalization_applications 
      WHERE family_id = $1
    `,
      [familyId],
    )

    const coordination = await db.query(
      `
      INSERT INTO family_naturalization_coordination (
        family_id, coordinated_applications, family_strategy, created_at
      ) VALUES ($1, $2, $3, NOW())
      RETURNING id
    `,
      [familyId, JSON.stringify(familyApplications.rows.map((app) => app.id)), strategy],
    )

    // Set up coordination timeline based on strategy
    await this.createFamilyCoordinationTimeline(coordination.rows[0].id, strategy)

    return coordination.rows[0].id
  }

  async generateNaturalizationReport(applicationId: string): Promise<any> {
    const application = await this.getNaturalizationApplication(applicationId)
    const milestones = await this.getApplicationMilestones(applicationId)
    const accommodations = await this.getApplicationAccommodations(applicationId)
    const testPreparation = await this.getTestPreparation(application.applicantId)

    const report = {
      application,
      progress: {
        currentStep: application.currentStep,
        totalSteps: application.totalSteps,
        percentComplete: (application.currentStep / application.totalSteps) * 100,
        estimatedCompletion: this.calculateEstimatedCompletion(application),
      },
      milestones: {
        completed: milestones.filter((m) => m.status === "completed").length,
        inProgress: milestones.filter((m) => m.status === "in_progress").length,
        upcoming: milestones.filter((m) => m.status === "upcoming").length,
        overdue: milestones.filter((m) => m.status === "overdue").length,
      },
      accommodations: {
        requested: accommodations.length,
        approved: accommodations.filter((a) => a.requestStatus === "approved").length,
        pending: accommodations.filter((a) => a.requestStatus === "pending").length,
      },
      testReadiness: {
        civicsScore: testPreparation?.readinessScore || 0,
        practiceTestsCompleted: testPreparation?.practiceTestScores?.length || 0,
        weakAreas: testPreparation?.weakAreas || [],
        recommendedStudyTime: this.calculateRecommendedStudyTime(testPreparation),
      },
      nextActions: this.getNextActions(application, milestones),
      timeline: this.generateTimeline(application, milestones),
    }

    return report
  }

  private async submitAccommodationToUSCIS(accommodationId: string): Promise<void> {
    // Implementation for submitting accommodation requests to USCIS
    // This would integrate with USCIS systems or generate proper forms
  }

  private async updateMilestoneStatus(applicationId: string, status: string): Promise<void> {
    // Update milestone statuses based on application status changes
  }

  private async logStatusChange(applicationId: string, newStatus: string, notes?: string): Promise<void> {
    await db.query(
      `
      INSERT INTO naturalization_status_log (
        application_id, status, notes, created_at
      ) VALUES ($1, $2, $3, NOW())
    `,
      [applicationId, newStatus, notes],
    )
  }

  private async scheduleDeafCompetentPracticeSession(preparationId: string, date: Date): Promise<void> {
    // Schedule practice session with deaf-competent interviewer
  }

  private calculateReadinessScore(score: number, totalQuestions: number): number {
    const percentage = (score / totalQuestions) * 100
    return Math.min(percentage, 100)
  }

  private async updateStudyPlan(applicantId: string, score: number, totalQuestions: number): Promise<void> {
    // Analyze performance and update personalized study plan
  }

  private async createFamilyCoordinationTimeline(coordinationId: string, strategy: string): Promise<void> {
    // Create coordinated timeline based on family strategy
  }

  private async getNaturalizationApplication(applicationId: string): Promise<NaturalizationApplication> {
    const result = await db.query(
      `
      SELECT * FROM naturalization_applications WHERE id = $1
    `,
      [applicationId],
    )
    return result.rows[0]
  }

  private async getApplicationMilestones(applicationId: string): Promise<NaturalizationMilestone[]> {
    const result = await db.query(
      `
      SELECT * FROM naturalization_milestones WHERE application_id = $1 ORDER BY created_at
    `,
      [applicationId],
    )
    return result.rows
  }

  private async getApplicationAccommodations(applicationId: string): Promise<DeafAccommodation[]> {
    const result = await db.query(
      `
      SELECT * FROM deaf_accommodations WHERE application_id = $1
    `,
      [applicationId],
    )
    return result.rows
  }

  private async getTestPreparation(applicantId: string): Promise<CivicsTestPreparation> {
    const result = await db.query(
      `
      SELECT * FROM civics_test_preparation WHERE applicant_id = $1
    `,
      [applicantId],
    )
    return result.rows[0]
  }

  private calculateEstimatedCompletion(application: NaturalizationApplication): Date {
    // Calculate estimated completion based on current progress and typical timelines
    const estimatedDate = new Date()
    estimatedDate.setMonth(estimatedDate.getMonth() + (12 - application.currentStep))
    return estimatedDate
  }

  private calculateRecommendedStudyTime(testPreparation: CivicsTestPreparation | null): number {
    if (!testPreparation) return 40 // Default 40 hours
    const readinessScore = testPreparation.readinessScore
    if (readinessScore >= 80) return 10
    if (readinessScore >= 60) return 20
    if (readinessScore >= 40) return 30
    return 40
  }

  private getNextActions(application: NaturalizationApplication, milestones: NaturalizationMilestone[]): string[] {
    const currentMilestone = milestones.find((m) => m.status === "in_progress")
    if (!currentMilestone) return ["Review application status"]

    return currentMilestone.nextSteps || ["Continue with current milestone"]
  }

  private generateTimeline(application: NaturalizationApplication, milestones: NaturalizationMilestone[]): any[] {
    return milestones.map((milestone) => ({
      title: milestone.milestoneTitle,
      status: milestone.status,
      dueDate: milestone.dueDate,
      completedDate: milestone.completedDate,
      accommodationsNeeded: milestone.accommodationsNeeded,
    }))
  }
}
