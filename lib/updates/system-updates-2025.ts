export interface SystemUpdate {
  id: string
  category: "technical" | "ux" | "analytics" | "community" | "government"
  title: string
  description: string
  status: "completed" | "in-progress" | "planned"
  impact: "high" | "medium" | "low"
  releaseDate: string
  features: string[]
  metrics?: {
    performanceImprovement?: string
    userSatisfaction?: string
    adoptionRate?: string
  }
}

export const systemUpdates2025: SystemUpdate[] = [
  // Technical Improvements
  {
    id: "tech-001",
    category: "technical",
    title: "Advanced Performance Optimization Suite",
    description: "Comprehensive performance enhancements reducing load times by 75%",
    status: "completed",
    impact: "high",
    releaseDate: "2025-01-15",
    features: [
      "Intelligent caching with 95% hit rate",
      "Data compression reducing payload by 68%",
      "Lazy loading for 80% faster initial load",
      "Bundle splitting reducing main bundle to 800KB",
      "Real-time performance monitoring dashboard",
    ],
    metrics: {
      performanceImprovement: "75% faster load times",
      userSatisfaction: "94% positive feedback",
      adoptionRate: "89% of users report improved experience",
    },
  },
  {
    id: "tech-002",
    category: "technical",
    title: "Federal API Integration Expansion",
    description: "New integrations with 15 additional federal agencies",
    status: "in-progress",
    impact: "high",
    releaseDate: "2025-02-01",
    features: [
      "Department of Veterans Affairs (VA) integration",
      "Department of Education (ED) student aid API",
      "Department of Housing (HUD) housing assistance",
      "Centers for Medicare & Medicaid Services (CMS)",
      "National Institute on Deafness (NIDCD) research data",
      "Rehabilitation Services Administration (RSA)",
      "Office of Special Education Programs (OSEP)",
    ],
  },
  {
    id: "tech-003",
    category: "technical",
    title: "Zero-Trust Security Architecture",
    description: "Military-grade security with end-to-end encryption",
    status: "completed",
    impact: "high",
    releaseDate: "2025-01-10",
    features: [
      "AES-256 encryption for all data",
      "Multi-factor authentication with biometrics",
      "Blockchain-based identity verification",
      "Real-time threat detection and response",
      "HIPAA and SOC 2 Type II compliance",
      "Quantum-resistant encryption preparation",
    ],
  },
  {
    id: "tech-004",
    category: "technical",
    title: "Native Mobile Applications",
    description: "iOS and Android apps with offline capabilities",
    status: "in-progress",
    impact: "high",
    releaseDate: "2025-03-15",
    features: [
      "Native iOS app with ASL video calling",
      "Android app with haptic feedback integration",
      "Offline emergency calling capabilities",
      "Push notifications with visual alerts",
      "Biometric authentication",
      "Apple Watch and Android Wear support",
    ],
  },

  // User Experience Enhancements
  {
    id: "ux-001",
    category: "ux",
    title: "Revolutionary ASL-First Interface",
    description: "Complete interface redesign prioritizing ASL and visual communication",
    status: "completed",
    impact: "high",
    releaseDate: "2025-01-20",
    features: [
      "ASL video instructions for every feature",
      "Visual workflow indicators with progress tracking",
      "Customizable visual alert systems",
      "High contrast mode with 4.5:1 ratio compliance",
      "Gesture-based navigation for mobile",
      "Voice-to-text with ASL translation",
    ],
    metrics: {
      userSatisfaction: "97% approval from deaf community",
      adoptionRate: "85% prefer new interface",
    },
  },
  {
    id: "ux-002",
    category: "ux",
    title: "Advanced Accessibility Suite",
    description: "Comprehensive accessibility features beyond WCAG 2.1 AAA",
    status: "completed",
    impact: "high",
    releaseDate: "2025-01-25",
    features: [
      "Screen reader optimization for JAWS and NVDA",
      "Keyboard navigation with skip links",
      "Customizable font sizes up to 200%",
      "Color blind friendly palettes",
      "Reduced motion options",
      "Focus indicators with 3px borders",
    ],
  },
  {
    id: "ux-003",
    category: "ux",
    title: "Intelligent Workflow Automation",
    description: "AI-powered workflow suggestions and automation",
    status: "in-progress",
    impact: "medium",
    releaseDate: "2025-02-15",
    features: [
      "Smart form pre-filling from previous submissions",
      "Deadline reminders with visual alerts",
      "Document auto-categorization",
      "Workflow templates for common tasks",
      "Progress tracking with milestone celebrations",
    ],
  },

  // Data & Analytics
  {
    id: "analytics-001",
    category: "analytics",
    title: "Real-Time Impact Dashboard 2.0",
    description: "Advanced analytics with predictive insights",
    status: "completed",
    impact: "high",
    releaseDate: "2025-01-30",
    features: [
      "Live government service usage metrics",
      "Community benefit tracking in real-time",
      "Predictive analytics for service needs",
      "Geographic heat maps of service usage",
      "Trend analysis with 12-month forecasting",
      "Custom report generation",
    ],
    metrics: {
      adoptionRate: "78% of users access dashboard weekly",
      userSatisfaction: "91% find insights valuable",
    },
  },
  {
    id: "analytics-002",
    category: "analytics",
    title: "Advanced Metrics Engine",
    description: "Comprehensive metrics tracking across all services",
    status: "completed",
    impact: "medium",
    releaseDate: "2025-01-28",
    features: [
      "Service completion rates by demographic",
      "Time-to-resolution tracking",
      "User satisfaction scoring",
      "Accessibility compliance monitoring",
      "Performance benchmarking",
      "ROI calculations for city partnerships",
    ],
  },

  // Community Features
  {
    id: "community-001",
    category: "community",
    title: "Deaf Community Governance Platform",
    description: "Democratic decision-making tools for community leadership",
    status: "completed",
    impact: "high",
    releaseDate: "2025-01-18",
    features: [
      "Secure voting system with ASL ballot explanations",
      "Community proposal submission and review",
      "Transparent decision tracking",
      "Regional representative elections",
      "Policy impact assessments",
      "Community feedback integration",
    ],
    metrics: {
      adoptionRate: "67% of eligible community members registered",
      userSatisfaction: "93% trust in voting system",
    },
  },
  {
    id: "community-002",
    category: "community",
    title: "Peer Support Network",
    description: "Mentorship and support system connecting deaf community members",
    status: "in-progress",
    impact: "medium",
    releaseDate: "2025-02-20",
    features: [
      "Mentor matching based on experience and location",
      "ASL video chat for peer consultations",
      "Resource sharing library",
      "Success story documentation",
      "Crisis support network",
      "Skills exchange marketplace",
    ],
  },
  {
    id: "community-003",
    category: "community",
    title: "Cultural Preservation Archive",
    description: "Digital preservation of deaf culture and history",
    status: "planned",
    impact: "medium",
    releaseDate: "2025-04-01",
    features: [
      "ASL storytelling video archive",
      "Historical deaf community documentation",
      "Cultural event calendar and streaming",
      "Educational resources for hearing families",
      "Deaf art and literature showcase",
      "Intergenerational knowledge transfer tools",
    ],
  },

  // Government Integration
  {
    id: "gov-001",
    category: "government",
    title: "Multi-Level Government Integration",
    description: "Seamless integration across federal, state, and local levels",
    status: "in-progress",
    impact: "high",
    releaseDate: "2025-03-01",
    features: [
      "Federal agency API standardization",
      "State-level DMV and health department integration",
      "City services portal with 311 integration",
      "Cross-jurisdictional data sharing protocols",
      "Unified identity verification system",
      "Emergency services coordination",
    ],
  },
  {
    id: "gov-002",
    category: "government",
    title: "Policy Advocacy Tools",
    description: "Tools for community-driven policy advocacy",
    status: "planned",
    impact: "high",
    releaseDate: "2025-03-15",
    features: [
      "Legislative tracking for deaf-related bills",
      "Automated advocacy letter generation",
      "Representative contact management",
      "Policy impact simulation tools",
      "Community campaign coordination",
      "Voting record transparency",
    ],
  },
]
