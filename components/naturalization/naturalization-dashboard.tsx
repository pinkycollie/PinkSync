"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Flag,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  BookOpen,
  MessageSquare,
  Award,
  Eye,
  Timer,
  MapPin,
  Phone,
  GraduationCap,
  Heart,
} from "lucide-react"

interface NaturalizationApplication {
  id: string
  applicantName: string
  currentStatus: string
  currentStep: number
  totalSteps: number
  eligibilityDate: Date
  applicationSubmissionDate?: Date
  expectedCompletionDate?: Date
  accommodationsRequested: string[]
  accommodationsApproved: string[]
}

interface Milestone {
  id: string
  title: string
  description: string
  status: string
  dueDate?: Date
  completedDate?: Date
  accommodationsNeeded: boolean
  accommodationDetails?: string
}

interface TestPreparation {
  readinessScore: number
  practiceTestsCompleted: number
  weakAreas: string[]
  strengthAreas: string[]
  studyHoursLogged: number
}

export default function NaturalizationDashboard() {
  const [application, setApplication] = useState<NaturalizationApplication | null>(null)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [testPreparation, setTestPreparation] = useState<TestPreparation | null>(null)
  const [accommodations, setAccommodations] = useState<any[]>([])

  // Mock data for demonstration
  useEffect(() => {
    setApplication({
      id: "1",
      applicantName: "Sarah Ahmed",
      currentStatus: "civics_test_preparation",
      currentStep: 7,
      totalSteps: 12,
      eligibilityDate: new Date("2024-01-15"),
      applicationSubmissionDate: new Date("2024-02-01"),
      expectedCompletionDate: new Date("2025-01-15"),
      accommodationsRequested: ["ASL interpreter", "Extended time", "Written instructions", "Visual aids"],
      accommodationsApproved: ["ASL interpreter", "Extended time", "Written instructions"],
    })

    setMilestones([
      {
        id: "1",
        title: "Verify Eligibility Requirements",
        description: "Confirm you meet all requirements for naturalization",
        status: "completed",
        completedDate: new Date("2024-01-20"),
        accommodationsNeeded: false,
      },
      {
        id: "2",
        title: "Gather Required Documents",
        description: "Collect all necessary documents including green card, tax returns, and travel records",
        status: "completed",
        completedDate: new Date("2024-01-25"),
        accommodationsNeeded: true,
        accommodationDetails: "Document translation services provided",
      },
      {
        id: "3",
        title: "Complete Form N-400",
        description: "Fill out Application for Naturalization with accuracy",
        status: "completed",
        completedDate: new Date("2024-01-30"),
        accommodationsNeeded: true,
        accommodationDetails: "ASL interpretation for form completion",
      },
      {
        id: "4",
        title: "Submit Accommodation Requests",
        description: "Request necessary accommodations for testing and interview",
        status: "completed",
        completedDate: new Date("2024-02-01"),
        accommodationsNeeded: true,
        accommodationDetails: "Submitted requests for ASL interpreter and extended time",
      },
      {
        id: "5",
        title: "Submit Application and Pay Fees",
        description: "Submit completed N-400 with supporting documents and fees",
        status: "completed",
        completedDate: new Date("2024-02-01"),
        accommodationsNeeded: false,
      },
      {
        id: "6",
        title: "Attend Biometrics Appointment",
        description: "Provide fingerprints, photo, and signature",
        status: "completed",
        completedDate: new Date("2024-03-15"),
        accommodationsNeeded: true,
        accommodationDetails: "Interpreter provided for appointment",
      },
      {
        id: "7",
        title: "Prepare for Civics Test",
        description: "Study civics and history using deaf-accessible materials",
        status: "in_progress",
        accommodationsNeeded: true,
        accommodationDetails: "Visual study materials, ASL videos, extended time accommodations",
      },
      {
        id: "8",
        title: "Prepare for English Test",
        description: "Practice reading, writing, and speaking English",
        status: "upcoming",
        accommodationsNeeded: true,
        accommodationDetails: "Alternative testing formats available",
      },
      {
        id: "9",
        title: "Prepare for Naturalization Interview",
        description: "Practice interview questions and review application",
        status: "upcoming",
        accommodationsNeeded: true,
        accommodationDetails: "Mock interviews with interpreter",
      },
      {
        id: "10",
        title: "Attend Naturalization Interview",
        description: "Complete interview, civics test, and English test",
        status: "upcoming",
        dueDate: new Date("2024-12-15"),
        accommodationsNeeded: true,
        accommodationDetails: "ASL interpreter, extended time, written instructions",
      },
      {
        id: "11",
        title: "Await Decision",
        description: "Wait for USCIS decision on your application",
        status: "upcoming",
        accommodationsNeeded: false,
      },
      {
        id: "12",
        title: "Attend Oath of Allegiance Ceremony",
        description: "Take the Oath of Allegiance and receive Certificate of Naturalization",
        status: "upcoming",
        accommodationsNeeded: true,
        accommodationDetails: "ASL interpretation of ceremony, accessible seating",
      },
    ])

    setTestPreparation({
      readinessScore: 75,
      practiceTestsCompleted: 8,
      weakAreas: ["Geography", "Recent History"],
      strengthAreas: ["Constitution", "Government Structure"],
      studyHoursLogged: 32,
    })

    setAccommodations([
      {
        id: "1",
        type: "ASL Interpreter",
        status: "approved",
        details: "Certified ASL interpreter for all appointments and tests",
        approvalDate: new Date("2024-02-05"),
      },
      {
        id: "2",
        type: "Extended Time",
        status: "approved",
        details: "50% additional time for all tests and interviews",
        approvalDate: new Date("2024-02-05"),
      },
      {
        id: "3",
        type: "Written Instructions",
        status: "approved",
        details: "All verbal instructions provided in writing",
        approvalDate: new Date("2024-02-05"),
      },
      {
        id: "4",
        type: "Visual Aids",
        status: "pending",
        details: "Charts and diagrams for civics concepts",
        requestDate: new Date("2024-02-01"),
      },
    ])
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in_progress":
        return "bg-blue-500"
      case "upcoming":
        return "bg-gray-400"
      case "overdue":
        return "bg-red-500"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      case "upcoming":
        return <Calendar className="h-4 w-4" />
      case "overdue":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getAccommodationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "asl interpreter":
        return <MessageSquare className="h-4 w-4" />
      case "extended time":
        return <Timer className="h-4 w-4" />
      case "written instructions":
        return <FileText className="h-4 w-4" />
      case "visual aids":
        return <Eye className="h-4 w-4" />
      default:
        return <Heart className="h-4 w-4" />
    }
  }

  if (!application) return <div>Loading...</div>

  const progressPercentage = (application.currentStep / application.totalSteps) * 100
  const completedMilestones = milestones.filter((m) => m.status === "completed").length
  const approvedAccommodations = accommodations.filter((a) => a.status === "approved").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Flag className="h-6 w-6 text-blue-500" />
            Naturalization Tracking Dashboard
          </h2>
          <p className="text-muted-foreground">
            Comprehensive tracking with deaf-specific accommodations for {application.applicantName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-500 text-white">
            Step {application.currentStep} of {application.totalSteps}
          </Badge>
          <Badge variant="outline" className="bg-green-500 text-white">
            <MessageSquare className="mr-1 h-3 w-3" />
            Accommodations Approved
          </Badge>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Flag className="h-4 w-4 text-blue-500" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="text-xs text-muted-foreground">
                Step {application.currentStep} of {application.totalSteps}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Milestones Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">{completedMilestones}</div>
              <div className="text-sm text-muted-foreground">of {milestones.length} total milestones</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <MessageSquare className="h-4 w-4 text-purple-500" />
              Accommodations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-600">{approvedAccommodations}</div>
              <div className="text-sm text-muted-foreground">of {accommodations.length} requested</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-orange-500" />
              Test Readiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-orange-600">{testPreparation?.readinessScore}%</div>
              <div className="text-sm text-muted-foreground">
                {testPreparation?.practiceTestsCompleted} practice tests
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Status Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <BookOpen className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Currently preparing for civics test</strong> - You're making great progress! Your test readiness score
          is {testPreparation?.readinessScore}%. Continue studying your weak areas:{" "}
          {testPreparation?.weakAreas.join(", ")}.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="milestones" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
          <TabsTrigger value="test-prep">Test Preparation</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Naturalization Milestones
              </CardTitle>
              <CardDescription>Track your progress through each step of the naturalization process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={milestone.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${getStatusColor(milestone.status)}`}
                      >
                        {index + 1}
                      </div>
                      {getStatusIcon(milestone.status)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{milestone.title}</h4>
                        <Badge variant="outline" className={`text-xs ${getStatusColor(milestone.status)} text-white`}>
                          {milestone.status.replace("_", " ")}
                        </Badge>
                        {milestone.accommodationsNeeded && (
                          <Badge variant="outline" className="text-xs text-purple-600 border-purple-600">
                            <MessageSquare className="mr-1 h-3 w-3" />
                            Accommodations
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{milestone.description}</div>
                      {milestone.accommodationDetails && (
                        <div className="text-xs text-purple-600 bg-purple-50 p-2 rounded">
                          <strong>Accommodations:</strong> {milestone.accommodationDetails}
                        </div>
                      )}
                      {milestone.dueDate && (
                        <div className="flex items-center gap-1 text-xs text-orange-600">
                          <Calendar className="h-3 w-3" />
                          Due: {milestone.dueDate.toLocaleDateString()}
                        </div>
                      )}
                      {milestone.completedDate && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          Completed: {milestone.completedDate.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    {milestone.status === "in_progress" && (
                      <Button size="sm" variant="outline">
                        Continue
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accommodations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-500" />
                Deaf-Specific Accommodations
              </CardTitle>
              <CardDescription>Manage your accommodation requests for the naturalization process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accommodations.map((accommodation) => (
                  <div key={accommodation.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="mt-1">{getAccommodationIcon(accommodation.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{accommodation.type}</h4>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            accommodation.status === "approved"
                              ? "text-green-600 border-green-600"
                              : "text-orange-600 border-orange-600"
                          }`}
                        >
                          {accommodation.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{accommodation.details}</div>
                      {accommodation.approvalDate && (
                        <div className="text-xs text-green-600">
                          Approved: {accommodation.approvalDate.toLocaleDateString()}
                        </div>
                      )}
                      {accommodation.requestDate && accommodation.status === "pending" && (
                        <div className="text-xs text-orange-600">
                          Requested: {accommodation.requestDate.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    {accommodation.status === "pending" && (
                      <Button size="sm" variant="outline">
                        Follow Up
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Request Additional Accommodations
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test-prep" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  Civics Test Preparation
                </CardTitle>
                <CardDescription>Your progress preparing for the civics and history test</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Test Readiness</span>
                    <span>{testPreparation?.readinessScore}%</span>
                  </div>
                  <Progress value={testPreparation?.readinessScore} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Practice Tests</div>
                    <div className="text-muted-foreground">{testPreparation?.practiceTestsCompleted}</div>
                  </div>
                  <div>
                    <div className="font-medium">Study Hours</div>
                    <div className="text-muted-foreground">{testPreparation?.studyHoursLogged}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Strength Areas</div>
                  <div className="flex flex-wrap gap-1">
                    {testPreparation?.strengthAreas.map((area, index) => (
                      <Badge key={index} variant="outline" className="text-xs text-green-600 border-green-600">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Areas to Improve</div>
                  <div className="flex flex-wrap gap-1">
                    {testPreparation?.weakAreas.map((area, index) => (
                      <Badge key={index} variant="outline" className="text-xs text-orange-600 border-orange-600">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-green-500" />
                  Study Resources
                </CardTitle>
                <CardDescription>Deaf-accessible study materials and tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">ASL Civics Study Videos</span>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Available
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Visual History Timeline</span>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Downloaded
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Extended Time Practice Tests</span>
                    </div>
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      In Use
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Deaf Study Group</span>
                    </div>
                    <Badge variant="outline" className="text-purple-600 border-purple-600">
                      Joined
                    </Badge>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Take Practice Test
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Naturalization Timeline
              </CardTitle>
              <CardDescription>Key dates and projected timeline for your naturalization process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm mb-2">Eligibility Date</div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {application.eligibilityDate.toLocaleDateString()}
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Met
                    </Badge>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm mb-2">Application Submitted</div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {application.applicationSubmissionDate?.toLocaleDateString()}
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Completed
                    </Badge>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm mb-2">Expected Interview Date</div>
                    <div className="text-sm text-muted-foreground mb-2">December 15, 2024</div>
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      Scheduled
                    </Badge>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm mb-2">Expected Completion</div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {application.expectedCompletionDate?.toLocaleDateString()}
                    </div>
                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                      Projected
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-medium">Upcoming Important Dates</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Mock Interview Session</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Nov 15, 2024</div>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Final Practice Test</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Dec 1, 2024</div>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Naturalization Interview</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Dec 15, 2024</div>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <Flag className="h-4 w-4 text-red-500" />
                        <span className="text-sm">Oath Ceremony (Projected)</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Jan 15, 2025</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Study Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button size="sm" variant="outline" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                Access ASL Study Videos
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Timer className="mr-2 h-4 w-4" />
                Take Practice Test
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Join Study Group
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Interview Preparation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button size="sm" variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Schedule Mock Interview
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Review Application
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <MapPin className="mr-2 h-4 w-4" />
                Plan Transportation
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Support Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Phone className="mr-2 h-4 w-4" />
                Contact Case Worker
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Heart className="mr-2 h-4 w-4" />
                Request Accommodations
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Award className="mr-2 h-4 w-4" />
                Legal Assistance
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Important Reminders */}
      <Alert>
        <Flag className="h-4 w-4" />
        <AlertDescription>
          <strong>Reminder:</strong> Your naturalization interview is scheduled for December 15, 2024. All requested
          accommodations (ASL interpreter, extended time, written instructions) have been approved. Continue practicing
          with your study materials and attend your mock interview session on November 15th.
        </AlertDescription>
      </Alert>
    </div>
  )
}
