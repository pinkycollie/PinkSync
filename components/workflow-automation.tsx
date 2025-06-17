"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Wand2, Eye, Video, Download, Share } from "lucide-react"

export default function WorkflowAutomation() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleNextStep = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setCurrentStep(currentStep + 1)
      setIsProcessing(false)
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">AI-Powered Content Creation Workflow</h1>
        <p className="text-gray-600">Automated pipeline for accessible explainer videos</p>
      </div>

      {/* Step 1: Content Ingestion */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Step 1: Content Ingestion
            </CardTitle>
            <CardDescription>Upload your complex documents or paste content for simplification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Content Title</label>
              <Input placeholder="e.g., ADA Workplace Accommodations Guide" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Audience</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select target audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="job-seekers">Job Seekers</SelectItem>
                  <SelectItem value="career-changers">Career Changers</SelectItem>
                  <SelectItem value="employers">Employers & HR</SelectItem>
                  <SelectItem value="counselors">Vocational Counselors</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Source Content</label>
              <Textarea
                rows={8}
                placeholder="Paste your complex content here, or upload a document..."
                className="resize-none"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
              <Button onClick={handleNextStep} disabled={isProcessing} className="flex-1">
                {isProcessing ? "Processing..." : "Continue to AI Simplification"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: AI Simplification */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Step 2: AI Content Simplification
            </CardTitle>
            <CardDescription>Vertex AI Gemini has simplified your content for visual communication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Original Content (Sample)</h4>
                <div className="bg-gray-50 p-4 rounded-lg text-sm max-h-40 overflow-y-auto">
                  "The Americans with Disabilities Act (ADA) requires employers to provide reasonable accommodations to
                  qualified individuals with disabilities, unless doing so would cause undue hardship to the employer.
                  Reasonable accommodations may include making existing facilities accessible, job restructuring,
                  part-time or modified work schedules, acquiring or modifying equipment..."
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Simplified Content</h4>
                <div className="bg-blue-50 p-4 rounded-lg text-sm max-h-40 overflow-y-auto">
                  "Your workplace must help you do your job. This is called 'reasonable accommodation.' Examples: • Ramp
                  for wheelchair access • Sign language interpreter for meetings • Flexible work schedule • Special
                  computer software"
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Accessibility Considerations Added</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Visual cues identified</Badge>
                <Badge variant="secondary">Key concepts highlighted</Badge>
                <Badge variant="secondary">Simple language used</Badge>
                <Badge variant="secondary">Bullet points for clarity</Badge>
              </div>
            </div>
            <Button onClick={handleNextStep} disabled={isProcessing} className="w-full">
              {isProcessing ? "Processing..." : "Continue to Visual Storyboarding"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Visual Storyboarding */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Step 3: Visual Storyboarding & ASL Planning
            </CardTitle>
            <CardDescription>Plan visual elements and sign language interpreter placement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Scene 1: Introduction</h4>
                <div className="bg-gray-100 p-4 rounded-lg h-32 relative">
                  <div className="absolute top-2 left-2 text-xs bg-white px-2 py-1 rounded">
                    Title: "Workplace Rights"
                  </div>
                  <div className="absolute bottom-2 right-2 bg-blue-200 p-2 rounded text-xs">ASL Interpreter</div>
                </div>
                <p className="text-xs text-gray-600">High contrast title with ASL introduction</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Scene 2: Examples</h4>
                <div className="bg-gray-100 p-4 rounded-lg h-32 relative">
                  <div className="absolute top-2 left-2 text-xs bg-white px-2 py-1 rounded">Visual Icons</div>
                  <div className="absolute bottom-2 right-2 bg-blue-200 p-2 rounded text-xs">ASL Interpreter</div>
                </div>
                <p className="text-xs text-gray-600">Icon-based examples with clear visuals</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Scene 3: Action Steps</h4>
                <div className="bg-gray-100 p-4 rounded-lg h-32 relative">
                  <div className="absolute top-2 left-2 text-xs bg-white px-2 py-1 rounded">Step-by-step</div>
                  <div className="absolute bottom-2 right-2 bg-blue-200 p-2 rounded text-xs">ASL Interpreter</div>
                </div>
                <p className="text-xs text-gray-600">Clear action steps with visual progression</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">ASL Integration Settings</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Interpreter Position</label>
                  <Select defaultValue="bottom-right">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                      <SelectItem value="full-screen">Full Screen Sections</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm">Interpreter Size</label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (15%)</SelectItem>
                      <SelectItem value="medium">Medium (25%)</SelectItem>
                      <SelectItem value="large">Large (35%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <Button onClick={handleNextStep} disabled={isProcessing} className="w-full">
              {isProcessing ? "Processing..." : "Generate Video with Fal.ai"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Video Generation */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Step 4: AI Video Generation
            </CardTitle>
            <CardDescription>Fal.ai is generating your accessible explainer video</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Generation Parameters</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Video Length:</strong> 3-4 minutes
                  <br />
                  <strong>Resolution:</strong> 1920x1080 (HD)
                  <br />
                  <strong>Frame Rate:</strong> 30fps
                </div>
                <div>
                  <strong>ASL Integration:</strong> Picture-in-picture
                  <br />
                  <strong>Captions:</strong> Auto-generated + manual review
                  <br />
                  <strong>Pacing:</strong> Slow and deliberate
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Accessibility Features Being Applied</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">High contrast colors</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Clear visual transitions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Minimal on-screen text</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Icon-based communication</span>
                </div>
              </div>
            </div>
            {isProcessing ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Generating your accessible video...</p>
                <p className="text-sm text-gray-500">This may take 3-5 minutes</p>
              </div>
            ) : (
              <Button onClick={handleNextStep} className="w-full">
                Continue to Review & Distribution
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 5: Review & Distribution */}
      {currentStep === 5 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Step 5: Review & Distribution
            </CardTitle>
            <CardDescription>Your accessible explainer video is ready for review and distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="aspect-video bg-black rounded-lg mb-4 relative">
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <Video className="h-12 w-12" />
                </div>
                <div className="absolute bottom-4 right-4 bg-blue-600 text-white p-2 rounded text-xs">
                  ASL Interpreter
                </div>
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs">
                  [Captions: Your workplace must help you do your job...]
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button size="sm" variant="outline">
                  Edit Captions
                </Button>
                <Button size="sm" variant="outline">
                  Adjust ASL Position
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Distribution Options</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex flex-col">
                  <Share className="h-6 w-6 mb-2" />
                  <span>YouTube</span>
                  <span className="text-xs text-gray-500">With captions</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  <span>Download</span>
                  <span className="text-xs text-gray-500">MP4 + SRT</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <Share className="h-6 w-6 mb-2" />
                  <span>Embed Code</span>
                  <span className="text-xs text-gray-500">For website</span>
                </Button>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Accessibility Compliance ✓</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• WCAG 2.1 AA compliant color contrast</li>
                <li>• Synchronized captions and transcripts provided</li>
                <li>• ASL interpretation integrated</li>
                <li>• Clear visual hierarchy maintained</li>
                <li>• Appropriate pacing for visual processing</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Indicator */}
      <div className="flex justify-center">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className={`w-3 h-3 rounded-full ${step <= currentStep ? "bg-blue-600" : "bg-gray-300"}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
