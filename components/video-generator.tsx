"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Video, Upload, Brain, Eye, Download, Share, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface VideoProject {
  id: string
  title: string
  status: "draft" | "processing" | "review" | "completed" | "error"
  progress: number
  targetAudience: string
  accessibilityFeatures: string[]
  createdAt: string
  estimatedCompletion?: string
}

export default function VideoGenerator() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [projects, setProjects] = useState<VideoProject[]>([
    {
      id: "proj_001",
      title: "Understanding Social Security Disability Benefits",
      status: "completed",
      progress: 100,
      targetAudience: "Deaf job seekers",
      accessibilityFeatures: ["ASL Overlay", "High Contrast", "Captions", "Slow Pacing"],
      createdAt: "2024-01-15",
    },
    {
      id: "proj_002",
      title: "Emergency Response Procedures",
      status: "processing",
      progress: 65,
      targetAudience: "Emergency contacts",
      accessibilityFeatures: ["Visual Alerts", "ASL Overlay", "Captions"],
      createdAt: "2024-01-16",
      estimatedCompletion: "15 minutes",
    },
    {
      id: "proj_003",
      title: "Tax Optimization for Disability Credits",
      status: "review",
      progress: 90,
      targetAudience: "Tax filers with disabilities",
      accessibilityFeatures: ["ASL Overlay", "High Contrast", "Captions", "Document Highlights"],
      createdAt: "2024-01-16",
    },
  ])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAudience: "",
    contentType: "",
    accessibilityFeatures: [] as string[],
    sourceDocument: null as File | null,
  })

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      accessibilityFeatures: prev.accessibilityFeatures.includes(feature)
        ? prev.accessibilityFeatures.filter((f) => f !== feature)
        : [...prev.accessibilityFeatures, feature],
    }))
  }

  const handleSubmit = async () => {
    setIsProcessing(true)
    // Simulate API call to create video
    setTimeout(() => {
      const newProject: VideoProject = {
        id: `proj_${Date.now()}`,
        title: formData.title,
        status: "processing",
        progress: 0,
        targetAudience: formData.targetAudience,
        accessibilityFeatures: formData.accessibilityFeatures,
        createdAt: new Date().toISOString().split("T")[0],
        estimatedCompletion: "20 minutes",
      }
      setProjects((prev) => [newProject, ...prev])
      setIsProcessing(false)
      setCurrentStep(1)
      setFormData({
        title: "",
        description: "",
        targetAudience: "",
        contentType: "",
        accessibilityFeatures: [],
        sourceDocument: null,
      })
    }, 2000)
  }

  const getStatusIcon = (status: VideoProject["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "processing":
        return <Clock className="h-5 w-5 text-blue-600" />
      case "review":
        return <Eye className="h-5 w-5 text-yellow-600" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Video className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: VideoProject["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "review":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">AI Video Generator</h1>
        <p className="text-lg text-gray-600">
          Create accessible explainer videos with Pinksync AI and Fal.ai integration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Creation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Create New Explainer Video
            </CardTitle>
            <CardDescription>Generate AI-powered accessible content from your documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Video Title</label>
                  <Input
                    placeholder="e.g., Understanding Your Benefits"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Describe what this video should explain..."
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Audience</label>
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, targetAudience: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deaf-job-seekers">Deaf Job Seekers</SelectItem>
                      <SelectItem value="benefits-recipients">Benefits Recipients</SelectItem>
                      <SelectItem value="emergency-contacts">Emergency Contacts</SelectItem>
                      <SelectItem value="tax-filers">Tax Filers with Disabilities</SelectItem>
                      <SelectItem value="healthcare-users">Healthcare System Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content Type</label>
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, contentType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="government-document">Government Document</SelectItem>
                      <SelectItem value="benefits-explanation">Benefits Explanation</SelectItem>
                      <SelectItem value="emergency-procedure">Emergency Procedure</SelectItem>
                      <SelectItem value="tax-guidance">Tax Guidance</SelectItem>
                      <SelectItem value="healthcare-info">Healthcare Information</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => setCurrentStep(2)}
                  className="w-full"
                  disabled={!formData.title || !formData.targetAudience}
                >
                  Continue to Accessibility Settings
                </Button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Accessibility Features</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "ASL Overlay",
                      "High Contrast",
                      "Captions",
                      "Slow Pacing",
                      "Visual Alerts",
                      "Large Text",
                      "Color Blind Support",
                      "Audio Description",
                    ].map((feature) => (
                      <label
                        key={feature}
                        className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={formData.accessibilityFeatures.includes(feature)}
                          onChange={() => handleFeatureToggle(feature)}
                          className="rounded"
                        />
                        <span className="text-sm">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Source Document (Optional)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Upload a document to analyze and simplify</p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, sourceDocument: e.target.files?.[0] || null }))
                      }
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Button variant="outline" size="sm" className="mt-2">
                        Choose File
                      </Button>
                    </label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isProcessing || formData.accessibilityFeatures.length === 0}
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>
                        <Brain className="h-4 w-4 mr-2 animate-spin" />
                        Creating Video...
                      </>
                    ) : (
                      <>
                        <Video className="h-4 w-4 mr-2" />
                        Generate Video
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>Track your video generation progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="text-sm text-gray-600">Target: {project.targetAudience}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(project.status)}
                      <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                    </div>
                  </div>

                  {project.status === "processing" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                      {project.estimatedCompletion && (
                        <p className="text-xs text-gray-500">Estimated completion: {project.estimatedCompletion}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-xs font-medium">Accessibility Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {project.accessibilityFeatures.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {project.status === "completed" && (
                      <>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </>
                    )}
                    {project.status === "review" && (
                      <Button size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Review & Approve
                      </Button>
                    )}
                    {project.status === "processing" && (
                      <Button size="sm" variant="outline" disabled>
                        <Clock className="h-4 w-4 mr-1" />
                        Processing...
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
