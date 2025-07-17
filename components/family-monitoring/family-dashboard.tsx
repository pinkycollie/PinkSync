"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  Heart,
  GraduationCap,
  DollarSign,
  Shield,
  Home,
  Phone,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  UserPlus,
  FileText,
} from "lucide-react"

interface FamilyMember {
  id: string
  name: string
  relationship: string
  hearingStatus: string
  age: number
  dependentStatus: boolean
  beneficiaryStatus: boolean
}

interface BenefitOpportunity {
  id: string
  benefitName: string
  benefitType: string
  potentialValue: number
  priority: string
  status: string
  eligibleMembers: string[]
  applicationDeadline?: Date
}

export default function FamilyDashboard() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [benefitOpportunities, setBenefitOpportunities] = useState<BenefitOpportunity[]>([])
  const [totalPotentialValue, setTotalPotentialValue] = useState(0)
  const [monitoringStatus, setMonitoringStatus] = useState("active")

  // Mock data for demonstration
  useEffect(() => {
    setFamilyMembers([
      {
        id: "1",
        name: "Sarah Johnson",
        relationship: "self",
        hearingStatus: "deaf",
        age: 34,
        dependentStatus: false,
        beneficiaryStatus: true,
      },
      {
        id: "2",
        name: "Mike Johnson",
        relationship: "spouse",
        hearingStatus: "hearing",
        age: 36,
        dependentStatus: false,
        beneficiaryStatus: false,
      },
      {
        id: "3",
        name: "Emma Johnson",
        relationship: "child",
        hearingStatus: "deaf",
        age: 8,
        dependentStatus: true,
        beneficiaryStatus: true,
      },
      {
        id: "4",
        name: "Alex Johnson",
        relationship: "child",
        hearingStatus: "hearing",
        age: 12,
        dependentStatus: true,
        beneficiaryStatus: false,
      },
    ])

    setBenefitOpportunities([
      {
        id: "1",
        benefitName: "Free ASL Classes for Hearing Family Members",
        benefitType: "education",
        potentialValue: 2400,
        priority: "high",
        status: "discovered",
        eligibleMembers: ["2", "4"],
      },
      {
        id: "2",
        benefitName: "Enhanced Special Education Services",
        benefitType: "education",
        potentialValue: 15000,
        priority: "critical",
        status: "discovered",
        eligibleMembers: ["3"],
      },
      {
        id: "3",
        benefitName: "Family Caregiver Tax Credit",
        benefitType: "tax_credit",
        potentialValue: 2500,
        priority: "medium",
        status: "discovered",
        eligibleMembers: ["2"],
      },
      {
        id: "4",
        benefitName: "Home Visual Alert System",
        benefitType: "accessibility",
        potentialValue: 2500,
        priority: "high",
        status: "discovered",
        eligibleMembers: ["1", "3"],
      },
      {
        id: "5",
        benefitName: "Deaf Family Respite Care Services",
        benefitType: "caregiver_support",
        potentialValue: 3000,
        priority: "medium",
        status: "discovered",
        eligibleMembers: ["2"],
      },
    ])

    setTotalPotentialValue(25400)
  }, [])

  const getHearingStatusIcon = (status: string) => {
    switch (status) {
      case "deaf":
        return "🤟"
      case "hard_of_hearing":
        return "👂"
      case "hearing":
        return "👂"
      default:
        return "❓"
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
      case "education":
        return <GraduationCap className="h-4 w-4" />
      case "healthcare":
        return <Heart className="h-4 w-4" />
      case "tax_credit":
        return <DollarSign className="h-4 w-4" />
      case "caregiver_support":
        return <Users className="h-4 w-4" />
      case "accessibility":
        return <Home className="h-4 w-4" />
      case "emergency_services":
        return <Phone className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const criticalOpportunities = benefitOpportunities.filter((opp) => opp.priority === "critical")
  const highPriorityOpportunities = benefitOpportunities.filter((opp) => opp.priority === "high")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-500" />
            Family Benefit Monitoring
          </h2>
          <p className="text-muted-foreground">
            Comprehensive benefit tracking for your entire family with deaf-specific opportunities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={monitoringStatus === "active" ? "default" : "secondary"} className="bg-green-500">
            <Shield className="mr-1 h-3 w-3" />
            Active Monitoring
          </Badge>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalOpportunities.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{criticalOpportunities.length} critical benefit opportunities</strong> require immediate attention.
            Potential value: ${criticalOpportunities.reduce((sum, opp) => sum + opp.potentialValue, 0).toLocaleString()}
          </AlertDescription>
        </Alert>
      )}

      {/* Family Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-blue-500" />
              Family Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{familyMembers.length}</div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>
                {
                  familyMembers.filter((m) => m.hearingStatus === "deaf" || m.hearingStatus === "hard_of_hearing")
                    .length
                }{" "}
                Deaf/HoH
              </div>
              <div>{familyMembers.filter((m) => m.hearingStatus === "hearing").length} Hearing</div>
              <div>{familyMembers.filter((m) => m.dependentStatus).length} Dependents</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Total Potential Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalPotentialValue.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Annual benefit value</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-orange-500" />
              Opportunities Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{benefitOpportunities.length}</div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>{criticalOpportunities.length} Critical</div>
              <div>{highPriorityOpportunities.length} High Priority</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-purple-500" />
              Monitoring Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <div className="text-sm text-muted-foreground">All family members</div>
          </CardContent>
        </Card>
      </div>

      {/* Family Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Family Members
          </CardTitle>
          <CardDescription>Overview of all family members and their monitoring status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {familyMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getHearingStatusIcon(member.hearingStatus)}</div>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {member.relationship} • Age {member.age} • {member.hearingStatus}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {member.dependentStatus && (
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      Dependent
                    </Badge>
                  )}
                  {member.beneficiaryStatus && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Beneficiary
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <Shield className="mr-1 h-3 w-3" />
                    Monitored
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Family Member
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Benefit Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Benefit Opportunities
          </CardTitle>
          <CardDescription>Discovered benefits and opportunities for your family</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {benefitOpportunities.map((opportunity) => (
              <div key={opportunity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="mt-1">{getBenefitTypeIcon(opportunity.benefitType)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{opportunity.benefitName}</h4>
                    <Badge variant="outline" className={`text-xs ${getPriorityColor(opportunity.priority)} text-white`}>
                      {opportunity.priority}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Potential Value: ${opportunity.potentialValue.toLocaleString()} annually
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Eligible: {opportunity.eligibleMembers.length} family member(s)
                  </div>
                  {opportunity.applicationDeadline && (
                    <div className="flex items-center gap-1 text-xs text-orange-600">
                      <Clock className="h-3 w-3" />
                      Deadline: {opportunity.applicationDeadline.toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" variant="outline">
                    Review
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

      {/* Benefit Categories */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <GraduationCap className="h-4 w-4 text-blue-500" />
              Education Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>ASL Classes</span>
                <Badge variant="outline" className="text-orange-600">
                  Available
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Special Education</span>
                <Badge variant="outline" className="text-red-600">
                  Critical
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>College Support</span>
                <Badge variant="outline" className="text-gray-600">
                  Monitoring
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Heart className="h-4 w-4 text-red-500" />
              Healthcare Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Premium Assistance</span>
                <Badge variant="outline" className="text-orange-600">
                  Available
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Family Counseling</span>
                <Badge variant="outline" className="text-blue-600">
                  Eligible
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Genetic Counseling</span>
                <Badge variant="outline" className="text-blue-600">
                  Eligible
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-green-500" />
              Tax Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Dependent Care Credit</span>
                <Badge variant="outline" className="text-orange-600">
                  Available
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Caregiver Credit</span>
                <Badge variant="outline" className="text-blue-600">
                  Eligible
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Home Modification</span>
                <Badge variant="outline" className="text-blue-600">
                  Eligible
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Your entire family is being monitored for benefit opportunities, changes, and new programs. Family members
          will be notified of relevant opportunities based on their individual profiles and consent preferences.
        </AlertDescription>
      </Alert>
    </div>
  )
}
