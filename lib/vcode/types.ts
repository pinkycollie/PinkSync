export interface VCodeSession {
  id: string
  userId: string
  startTime: string
  status: "active" | "completed" | "error"
  accessibility: {
    aslEnabled: boolean
    visualFeedback: any
    highContrast: boolean
    vibrationAlerts: boolean
  }
  processing: {
    aslAnalysis: boolean
    speechTranscription: boolean
    agreementDetection: boolean
    qualityAssurance: boolean
  }
  participants: string[]
  meetingType: "consultation" | "agreement" | "negotiation"
}

export interface ASLAnalysis {
  detectedSigns: string[]
  confidence: number
  transcript: string
  timestamp: number
  quality: "low" | "medium" | "high"
}

export interface AgreementExtraction {
  agreements: Array<{
    summary: string
    confidence: number
    timestamp: number
    evidence: string
  }>
  visualSummary: {
    agreementCount: number
    highConfidenceCount: number
    needsReview: any[]
    visualIndicators: any[]
  }
  qualityScore: number
  evidenceStrength: number
}
