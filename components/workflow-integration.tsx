"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Brain,
  Video,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  Calendar,
  Mail,
  FolderOpen,
  Database,
} from "lucide-react"

interface WorkflowStep {
  id: string
  name: string
  description: string
  status: "pending" | "processing" | "completed" | "error"
  progress: number
  estimatedTime: string
  dependencies: string[]
  googleService: string
  aiComponent?: string
}

export default function WorkflowIntegration() {
  const [currentStep, setCurrentStep] = useState("google-forms")
  const [overallProgress, setOverallProgress] = useState(35)

  const workflowSteps: WorkflowStep[] = [
    {
      id: "google-forms",
      name: "Google Forms: Client Submission",
      description: "Collect initial client information and accessibility needs",
      status: "completed",
      progress: 100,
      estimatedTime: "Instant",
      dependencies: [],
      googleService: "Google Forms",
    },
    {
      id: "ai-validation",
      name: "AI Validation: Check Missing Data",
      description: "Use Vertex AI to identify incomplete or inconsistent information",
      status: "completed",
      progress: 100,
      estimatedTime: "30 seconds",
      dependencies: ["google-forms"],
      googleService: "Vertex AI",
      aiComponent: "Gemini Pro",
    },
    {
      id: "google-sheets",
      name: "Google Sheets: Filter Eligible Clients",
      description: "Automatically categorize and prioritize clients based on criteria",
      status: "completed",
      progress: 100,
      estimatedTime: "1 minute",
      dependencies: ["ai-validation"],
      googleService: "Google Sheets",
    },
    {
      id: "taskade",
      name: "Taskade: Generate Structured Task List",
      description: "Create personalized task lists for each client's journey",
      status: "processing",
      progress: 75,
      estimatedTime: "2 minutes",
      dependencies: ["google-sheets"],
      googleService: "Taskade API",
    },
    {
      id: "ai-review",
      name: "AI Review: Ensure Clear Priorities",
      description: "Validate task priorities and deadlines using AI analysis",
      status: "processing",
      progress: 45,
      estimatedTime: "1 minute",
      dependencies: ["taskade"],
      googleService: "Vertex AI",
      aiComponent: "Gemini Pro",
    },
    {
      id: "notion-storage",
      name: "Notion: Store Client Data",
      description: "Organize client information in structured database",
      status: "pending",
      progress: 0,
      estimatedTime: "30 seconds",
      dependencies: ["ai-review"],
      googleService: "Notion API",
    },
    {
      id: "ai-structuring",
      name: "AI Structuring: Categorize & Detect Missing Info",
      description: "Use AI to structure data and identify gaps for content creation",
      status: "pending",
      progress: 0,
      estimatedTime: "1 minute",
      dependencies: ["notion-storage"],
      googleService: "Vertex AI",
      aiComponent: "Gemini Pro",
    },
    {
      id: "google-drive",
      name: "Google Drive: Create Organized Folders",
      description: "Set up folder structure for each client's content assets",
      status: "pending",
      progress: 0,
      estimatedTime: "30 seconds",
      dependencies: ["ai-structuring"],
      googleService: "Google Drive",
    },
    {
      id: "ai-folder-check",
      name: "AI Check: Ensure Proper Folder Structure",
      description: "Validate folder organization and naming conventions",
      status: "pending",
      progress: 0,
      estimatedTime: "15 seconds",
      dependencies: ["google-drive"],
      googleService: "Vertex AI",
      aiComponent: "Gemini Pro",
    },
    {
      id: "google-calendar",
      name: "Google Calendar: Schedule Consultation",
      description: "Automatically schedule initial consultation meetings",
      status: "pending",
      progress: 0,
      estimatedTime: "1 minute",
      dependencies: ["ai-folder-check"],
      googleService: "Google Calendar",
    },
    {
      id: "ai-scheduling",
      name: "AI Scheduling: Optimize Meeting Time",
      description: "Use AI to find optimal meeting times considering accessibility needs",
      status: "pending",
      progress: 0,
      estimatedTime: "30 seconds",
      dependencies: ["google-calendar"],
      googleService: "Vertex AI",
      aiComponent: "Gemini Pro",
    },
    {
      id: "gmail-followup",
      name: "Gmail: Send Automated Follow-Up",
      description: "Send personalized welcome email with next steps",
      status: "pending",
      progress: 0,
      estimatedTime: "Instant",
      dependencies: ["ai-scheduling"],
      googleService: "Gmail API",
    },
    {
      id: "ai-email-review",
      name: "AI Review: Ensure Clear Actionable Email",
      description: "Validate email content for clarity and accessibility",
      status: "pending",
      progress: 0,
      estimatedTime: "15 seconds",
      dependencies: ["gmail-followup"],
      googleService: "Vertex AI",
      aiComponent: "Gemini Pro",
    },
    {
      id: "feedback-loop",
      name: "AI Feedback Loop: Monitor & Improve Workflow",
      description: "Continuously analyze and optimize the workflow process",
      status: "pending",
      progress: 0,
      estimatedTime: "Ongoing",
      dependencies: ["ai-email-review"],
      googleService: "Vertex AI",
      aiComponent: "Gemini Pro",
    },
  ]

  const getStepIcon = (step: WorkflowStep) => {
    if (step.googleService.includes("Forms")) return <FileText className="h-5 w-5" />
    if (step.googleService.includes("Vertex") || step.aiComponent) return <Brain className="h-5 w-5" />
    if (step.googleService.includes("Sheets")) return <Database className="h-5 w-5" />
    if (step.googleService.includes("Drive")) return <FolderOpen className="h-5 w-5" />
    if (step.googleService.includes("Calendar")) return <Calendar className="h-5 w-5" />
    if (step.googleService.includes("Gmail")) return <Mail className="h-5 w-5" />
    return <CheckCircle className="h-5 w-5" />
  }

  const getStatusColor = (status: WorkflowStep["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100"
      case "processing":
        return "text-blue-600 bg-blue-100"
      case "pending":
        return "text-gray-600 bg-gray-100"
      case "error":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Integrated Workflow Management</h1>
        <p className="text-lg text-gray-600">DeafAuth + Google Cloud + Fal.ai Automated Pipeline</p>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Progress</CardTitle>
          <CardDescription>Current status of the automated client processing pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Overall Completion</span>
              <span>{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            <div className="grid grid-cols-4 gap-4 text-center text-sm">
              <div>
                <div className="font-semibold text-green-600">3</div>
                <div className="text-gray-600">Completed</div>
              </div>
              <div>
                <div className="font-semibold text-blue-600">2</div>
                <div className="text-gray-600">Processing</div>
              </div>
              <div>
                <div className="font-semibold text-gray-600">9</div>
                <div className="text-gray-600">Pending</div>
              </div>
              <div>
                <div className="font-semibold text-red-600">0</div>
                <div className="text-gray-600">Errors</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="workflow" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflow">Workflow Steps</TabsTrigger>
          <TabsTrigger value="integrations">Service Integrations</TabsTrigger>
          <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="workflow" className="space-y-4">
          <div className="space-y-4">
            {workflowSteps.map((step, index) => (
              <Card key={step.id} className={`transition-all ${currentStep === step.id ? "ring-2 ring-blue-500" : ""}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${getStatusColor(step.status)}`}>{getStepIcon(step)}</div>
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{step.name}</h3>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">{step.googleService}</Badge>
                          {step.aiComponent && <Badge variant="secondary">{step.aiComponent}</Badge>}
                          <Badge
                            variant={
                              step.status === "completed"
                                ? "default"
                                : step.status === "processing"
                                  ? "secondary"
                                  : step.status === "error"
                                    ? "destructive"
                                    : "outline"
                            }
                          >
                            {step.status}
                          </Badge>
                        </div>
                      </div>

                      {step.status === "processing" && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{step.progress}%</span>
                          </div>
                          <Progress value={step.progress} className="h-2" />
                        </div>
                      )}

                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>Estimated time: {step.estimatedTime}</span>
                        {step.dependencies.length > 0 && <span>Dependencies: {step.dependencies.length}</span>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  Google Cloud Vertex AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Status</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Model</span>
                    <span className="text-sm font-medium">Gemini Pro</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">API Calls Today</span>
                    <span className="text-sm font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Success Rate</span>
                    <span className="text-sm font-medium text-green-600">99.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-purple-600" />
                  Fal.ai Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Status</span>
                    <Badge variant="default">Connected</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Videos Generated</span>
                    <span className="text-sm font-medium">89</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Queue Length</span>
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Avg. Generation Time</span>
                    <span className="text-sm font-medium">4.2 min</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Google Workspace
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Services Active</span>
                    <span className="text-sm font-medium">6/6</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Forms Submitted</span>
                    <span className="text-sm font-medium">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Emails Sent</span>
                    <span className="text-sm font-medium">423</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Meetings Scheduled</span>
                    <span className="text-sm font-medium">67</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">AI Validation in progress</p>
                      <p className="text-xs text-gray-600">Client ID: CLIENT_047</p>
                    </div>
                    <Badge variant="secondary">Processing</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Google Drive folder created</p>
                      <p className="text-xs text-gray-600">Client ID: CLIENT_045</p>
                    </div>
                    <Badge variant="default">Completed</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Taskade API rate limit approaching</p>
                      <p className="text-xs text-gray-600">89% of hourly limit used</p>
                    </div>
                    <Badge variant="outline">Warning</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Workflow Completion Rate</span>
                      <span>94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Average Processing Time</span>
                      <span>12.3 min</span>
                    </div>
                    <Progress value={77} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Client Satisfaction</span>
                      <span>4.8/5</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>System Uptime</span>
                      <span>99.9%</span>
                    </div>
                    <Progress value={99.9} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
