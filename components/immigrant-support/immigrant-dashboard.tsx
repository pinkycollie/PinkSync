"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Globe,
  Languages,
  Users,
  Heart,
  GraduationCap,
  FileText,
  Phone,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Shield,
  BookOpen,
  MessageSquare,
  Home,
} from "lucide-react"

interface ImmigrantFamily {
  id: string
  immigrationStatus: string
  countryOfOrigin: string
  primaryLanguage: string
  signLanguage: string
  arrivalDate: Date
  familySize: number
  deafMembers: number
}

interface BenefitOpportunity {
  id: string
  benefitName: string
  benefitType: string
  potentialValue: number
  priority: string
  eligibleForStatus: boolean
  waitingPeriod: number
  languageSupported: boolean
  interpreterNeeded: boolean
  culturalConsiderations: string[]
}

export default function ImmigrantDashboard() {
  const [familyProfile, setFamilyProfile] = useState<ImmigrantFamily | null>(null)
  const [benefitOpportunities, setBenefitOpportunities] = useState<BenefitOpportunity[]>([])
  const [culturalIntegrationScore, setCulturalIntegrationScore] = useState(45)
  const [languageProficiencyScore, setLanguageProficiencyScore] = useState(30)

  // Mock data for demonstration
  useEffect(() => {
    setFamilyProfile({
      id: "1",
      immigrationStatus: "refugee",
      countryOfOrigin: "SY", // Syria
      primaryLanguage: "ar", // Arabic
      signLanguage: "ArSL", // Arabic Sign Language
      arrivalDate: new Date("2023-06-15"),
      familySize: 4,
      deafMembers: 2,
    })

    setBenefitOpportunities([
      {
        id: "1",
        benefitName: "Refugee Medical Assistance",
        benefitType: "healthcare",
        potentialValue: 12000,
        priority: "critical",
        eligibleForStatus: true,
        waitingPeriod: 0,
        languageSupported: true,
        interpreterNeeded: true,
        culturalConsiderations: ["trauma_informed_care", "cultural_health_practices"],
      },
      {
        id: "2",
        benefitName: "Free ESL Classes for Deaf Immigrants",
        benefitType: "education",
        potentialValue: 3000,
        priority: "high",
        eligibleForStatus: true,
        waitingPeriod: 0,
        languageSupported: true,
        interpreterNeeded: true,
        culturalConsiderations: ["deaf_pedagogy", "visual_learning_methods"],
      },
      {
        id: "3",
        benefitName: "American Deaf Cultural Orientation",
        benefitType: "cultural_integration",
        potentialValue: 800,
        priority: "high",
        eligibleForStatus: true,
        waitingPeriod: 0,
        languageSupported: true,
        interpreterNeeded: true,
        culturalConsiderations: ["deaf_culture_differences", "advocacy_self_determination"],
      },
      {
        id: "4",
        benefitName: "Trauma Counseling for Deaf Refugees",
        benefitType: "mental_health",
        potentialValue: 6000,
        priority: "high",
        eligibleForStatus: true,
        waitingPeriod: 0,
        languageSupported: true,
        interpreterNeeded: true,
        culturalConsiderations: ["cultural_trauma_understanding", "deaf_trauma_specialization"],
      },
      {
        id: "5",
        benefitName: "Free Document Translation Services",
        benefitType: "legal_support",
        potentialValue: 1500,
        priority: "medium",
        eligibleForStatus: true,
        waitingPeriod: 0,
        languageSupported: true,
        interpreterNeeded: false,
        culturalConsiderations: ["document_authenticity", "cultural_context_preservation"],
      },
    ])
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "refugee":
        return "bg-blue-500"
      case "asylum_seeker":
        return "bg-purple-500"
      case "permanent_resident":
        return "bg-green-500"
      case "undocumented":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getBenefitTypeIcon = (type: string) => {
    switch (type) {
      case "healthcare":
        return <Heart className="h-4 w-4" />
      case "education":
        return <GraduationCap className="h-4 w-4" />
      case "cultural_integration":
        return <Globe className="h-4 w-4" />
      case "mental_health":
        return <Shield className="h-4 w-4" />
      case "legal_support":
        return <FileText className="h-4 w-4" />
      default:
        return <Home className="h-4 w-4" />
    }
  }

  const getCountryFlag = (countryCode: string) => {
    const flags: Record<string, string> = {
      SY: "🇸🇾",
      MX: "🇲🇽",
      CN: "🇨🇳",
      VN: "🇻🇳",
      KR: "🇰🇷",
      PH: "🇵🇭",
    }
    return flags[countryCode] || "🌍"
  }

  const criticalOpportunities = benefitOpportunities.filter(
    (opp) => opp.priority === "critical" && opp.eligibleForStatus,
  )
  const totalPotentialValue = benefitOpportunities
    .filter((opp) => opp.eligibleForStatus)
    .reduce((sum, opp) => sum + opp.potentialValue, 0)

  if (!familyProfile) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6 text-blue-500" />
            Immigrant Family Support Dashboard
          </h2>
          <p className="text-muted-foreground">
            Multi-language benefit navigation and cultural integration support for deaf immigrant families
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`${getStatusColor(familyProfile.immigrationStatus)} text-white`}>
            {familyProfile.immigrationStatus.replace("_", " ").toUpperCase()}
          </Badge>
          <Badge variant="outline" className="bg-green-500 text-white">
            <Languages className="mr-1 h-3 w-3" />
            Multi-Language Support
          </Badge>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalOpportunities.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{criticalOpportunities.length} critical benefits</strong> available immediately for your immigration
            status. Potential value: $
            {criticalOpportunities.reduce((sum, opp) => sum + opp.potentialValue, 0).toLocaleString()}
          </AlertDescription>
        </Alert>
      )}

      {/* Family Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-blue-500" />
              Origin & Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getCountryFlag(familyProfile.countryOfOrigin)}</span>
                <div className="text-sm">
                  <div className="font-medium">Country of Origin</div>
                  <div className="text-muted-foreground">{familyProfile.countryOfOrigin}</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Arrived: {familyProfile.arrivalDate.toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Languages className="h-4 w-4 text-green-500" />
              Language Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">
                <div className="font-medium">Primary Language</div>
                <div className="text-muted-foreground">{familyProfile.primaryLanguage.toUpperCase()}</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Sign Language</div>
                <div className="text-muted-foreground">{familyProfile.signLanguage}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-purple-500" />
              Family Composition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{familyProfile.familySize}</div>
              <div className="text-sm text-muted-foreground">
                <div>{familyProfile.deafMembers} Deaf/HoH</div>
                <div>{familyProfile.familySize - familyProfile.deafMembers} Hearing</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Available Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">${totalPotentialValue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">
                <div>{benefitOpportunities.filter((opp) => opp.eligibleForStatus).length} Eligible</div>
                <div>{criticalOpportunities.length} Critical</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Progress */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Cultural Integration Progress
            </CardTitle>
            <CardDescription>Your progress adapting to American deaf culture and systems</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Integration</span>
                <span>{culturalIntegrationScore}%</span>
              </div>
              <Progress value={culturalIntegrationScore} className="h-2" />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Deaf Community Connection</span>
                <Badge variant="outline" className="text-orange-600">
                  In Progress
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Service Navigation</span>
                <Badge variant="outline" className="text-blue-600">
                  Learning
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Cultural Orientation</span>
                <Badge variant="outline" className="text-green-600">
                  Completed
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-green-500" />
              Language Proficiency Progress
            </CardTitle>
            <CardDescription>Your progress learning English and American Sign Language</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>English Proficiency</span>
                <span>{languageProficiencyScore}%</span>
              </div>
              <Progress value={languageProficiencyScore} className="h-2" />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>ESL Classes</span>
                <Badge variant="outline" className="text-blue-600">
                  Enrolled
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>ASL Learning</span>
                <Badge variant="outline" className="text-orange-600">
                  Starting Soon
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Government Terminology</span>
                <Badge variant="outline" className="text-gray-600">
                  Not Started
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Available Benefits for Your Immigration Status
          </CardTitle>
          <CardDescription>
            Benefits you're eligible for as a {familyProfile.immigrationStatus.replace("_", " ")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {benefitOpportunities
              .filter((opp) => opp.eligibleForStatus)
              .map((opportunity) => (
                <div key={opportunity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="mt-1">{getBenefitTypeIcon(opportunity.benefitType)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{opportunity.benefitName}</h4>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getPriorityColor(opportunity.priority)} text-white`}
                      >
                        {opportunity.priority}
                      </Badge>
                      {opportunity.languageSupported && (
                        <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                          <Languages className="mr-1 h-3 w-3" />
                          Language Support
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Value: ${opportunity.potentialValue.toLocaleString()} annually
                    </div>
                    {opportunity.waitingPeriod > 0 && (
                      <div className="flex items-center gap-1 text-xs text-orange-600">
                        <Clock className="h-3 w-3" />
                        {opportunity.waitingPeriod} year waiting period
                      </div>
                    )}
                    {opportunity.interpreterNeeded && (
                      <div className="flex items-center gap-1 text-xs text-blue-600">
                        <MessageSquare className="h-3 w-3" />
                        Interpreter services available
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      Cultural considerations: {opportunity.culturalConsiderations.join(", ")}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline">
                      Learn More
                    </Button>
                    {opportunity.priority === "critical" && (
                      <Button size="sm" className="bg-red-500 hover:bg-red-600">
                        Apply Now
                      </Button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Language & Cultural Support Services */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-blue-500" />
              Language Support Services
            </CardTitle>
            <CardDescription>Available language assistance and learning programs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Arabic Interpreter Services</span>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Available
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Document Translation</span>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Free
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">ESL Classes (Visual Method)</span>
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  Enrolling
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <span className="text-sm">ASL Classes for Family</span>
                </div>
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  Waitlist
                </Badge>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              <Phone className="mr-2 h-4 w-4" />
              Request Interpreter Services
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-500" />
              Cultural Integration Support
            </CardTitle>
            <CardDescription>Programs to help you navigate American deaf culture and systems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Deaf Cultural Orientation</span>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Completed
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Peer Mentorship Program</span>
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  Matched
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Trauma-Informed Counseling</span>
                </div>
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  Scheduled
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Community Resource Navigation</span>
                </div>
                <Badge variant="outline" className="text-gray-600 border-gray-600">
                  Pending
                </Badge>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Connect with Mentor
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Contacts & Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-red-500" />
            Emergency Contacts & Resources
          </CardTitle>
          <CardDescription>Important contacts for emergencies and urgent assistance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-3 border rounded-lg">
              <div className="font-medium text-sm mb-2">24/7 Crisis Line (Arabic/ASL)</div>
              <div className="text-sm text-muted-foreground mb-2">Crisis intervention with cultural competency</div>
              <Button size="sm" variant="outline" className="w-full">
                <Phone className="mr-2 h-3 w-3" />
                Call Now
              </Button>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="font-medium text-sm mb-2">Legal Aid for Immigrants</div>
              <div className="text-sm text-muted-foreground mb-2">Free legal assistance for immigration matters</div>
              <Button size="sm" variant="outline" className="w-full">
                <FileText className="mr-2 h-3 w-3" />
                Contact
              </Button>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="font-medium text-sm mb-2">Medical Emergency (Deaf)</div>
              <div className="text-sm text-muted-foreground mb-2">Emergency medical services with interpreter</div>
              <Button size="sm" variant="outline" className="w-full">
                <Heart className="mr-2 h-3 w-3" />
                Emergency
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Globe className="h-4 w-4" />
        <AlertDescription>
          Your family profile includes multi-language support in Arabic and Arabic Sign Language. All services are
          culturally competent and trauma-informed. Interpreter services are available for all appointments and
          applications at no cost to you.
        </AlertDescription>
      </Alert>
    </div>
  )
}
