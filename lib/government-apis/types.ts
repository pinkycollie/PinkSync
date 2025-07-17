export interface GovernmentAPIConfig {
  baseUrl: string
  apiKey: string
  clientId?: string
  clientSecret?: string
  environment: "sandbox" | "production"
  rateLimit: {
    requestsPerMinute: number
    requestsPerDay: number
  }
  timeout: number
}

export interface IRSApiResponse {
  taxpayerId: string
  taxYear: number
  filingStatus: string
  adjustedGrossIncome: number
  taxLiability: number
  refundAmount?: number
  disabilityCredits: Array<{
    creditType: string
    amount: number
    eligibilityReason: string
  }>
  medicalDeductions: Array<{
    category: string
    amount: number
    description: string
  }>
  lastUpdated: string
}

export interface SSAApiResponse {
  beneficiaryId: string
  benefitType: "SSI" | "SSDI" | "both" | "none"
  monthlyBenefit: number
  disabilityOnsetDate: string
  reviewDate: string
  workCredits: number
  medicalReviewSchedule: string
  representativePayee?: {
    name: string
    relationship: string
  }
  lastUpdated: string
}

export interface DMVApiResponse {
  licenseNumber: string
  state: string
  licenseType: string
  expirationDate: string
  restrictions: string[]
  endorsements: string[]
  disabilityAccommodations: Array<{
    type: string
    description: string
    validUntil: string
  }>
  realIdCompliant: boolean
  lastUpdated: string
}

export interface USPSApiResponse {
  addressValidation: {
    isValid: boolean
    standardizedAddress: string
    deliveryPoint: string
    zipPlus4: string
  }
  changeOfAddress: {
    hasActiveChange: boolean
    effectiveDate?: string
    forwardingAddress?: string
  }
}

export interface DepartmentOfEducationApiResponse {
  studentId: string
  fafsa: {
    eligibleForAid: boolean
    expectedFamilyContribution: number
    pellGrantEligibility: boolean
    disabilityAccommodations: string[]
  }
  studentLoans: Array<{
    loanId: string
    servicer: string
    balance: number
    interestRate: number
    status: string
    disabilityDischarge: boolean
  }>
  lastUpdated: string
}
