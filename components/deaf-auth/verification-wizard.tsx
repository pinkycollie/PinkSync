"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Shield,
  Users,
  Video,
  Upload,
  Globe,
  Phone,
  Camera,
  Eye,
  Heart,
  Info,
} from "lucide-react"

interface VerificationStep {
  id: string
  title: string
  description: string
  required: boolean
  completed: boolean
}

export function DeafVerificationWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [verificationData, setVerificationData] = useState({
    hearingLossType: "",
    hearingLossDegree: "",
    hearingLossOnset: "",
    primaryCommunication: "",
    cochlearImplant: false,
    hearingAids: false,
    assistiveTechnologyExperience: "",
    communityReferences: [],
    medicalDocuments: [],
    aslVideoUrl: "",
    accessibilityNeeds: [],
  })

  const steps: VerificationStep[] = [
    {
      id: "identity",
      title: "Deaf Identity",
      description: "Tell us about your hearing loss and communication preferences",
      required: true,
      completed: false,
    },
    {
      id: "experience",
      title: "Lived Experience",
      description: "Share your authentic deaf experience and accessibility needs",
      required: true,
      completed: false,
    },
    {
      id: "community",
      title: "Community Verification",
      description: "Connect with deaf community members who can verify your identity",
      required: false,
      completed: false,
    },
    {
      id: "documentation",
      title: "Medical Documentation",
      description: "Upload medical records or audiograms (optional but recommended)",
      required: false,
      completed: false,
    },
    {
      id: "accessibility",
      title: "Accessibility Preferences",
      description: "Set your communication and accessibility preferences",
      required: true,
      completed: false,
    },
  ]

  const handleSubmitVerification = async () => {
    try {
      const response = await fetch("/api/auth/deaf-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(verificationData),
      })

      const result = await response.json()

      if (result.success) {
        // Handle successful verification
        console.log("Verification submitted:", result)
      }
    } catch (error) {
      console.error("Verification error:", error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-pink-500" />
            DeafAUTH Verification
          </CardTitle>
          <CardDescription>
            Secure identity verification designed specifically for the deaf community. This process ensures you receive
            appropriate accessibility services while protecting your privacy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={(currentStep / (steps.length - 1)) * 100} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Step {currentStep + 1} of {steps.length}
              </span>
              <span>{steps[currentStep]?.title}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={steps[currentStep]?.id} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          {steps.map((step, index) => (
            <TabsTrigger
              key={step.id}
              value={step.id}
              disabled={index > currentStep}
              className="flex items-center gap-2"
            >
              {step.completed && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              {step.required && !step.completed && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
              <span className="hidden md:inline">{step.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="identity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Deaf Identity</CardTitle>
              <CardDescription>
                Help us understand your hearing loss and communication preferences. This information is used to provide
                appropriate accessibility services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hearing-loss-type">Type of Hearing Loss</Label>
                  <Select
                    value={verificationData.hearingLossType}
                    onValueChange={(value) => setVerificationData((prev) => ({ ...prev, hearingLossType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sensorineural">Sensorineural</SelectItem>
                      <SelectItem value="conductive">Conductive</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                      <SelectItem value="auditory_processing">Auditory Processing Disorder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hearing-loss-degree">Degree of Hearing Loss</Label>
                  <Select
                    value={verificationData.hearingLossDegree}
                    onValueChange={(value) => setVerificationData((prev) => ({ ...prev, hearingLossDegree: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select degree" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mild">Mild (26-40 dB)</SelectItem>
                      <SelectItem value="moderate">Moderate (41-55 dB)</SelectItem>
                      <SelectItem value="severe">Severe (71-90 dB)</SelectItem>
                      <SelectItem value="profound">Profound (91+ dB)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hearing-loss-onset">When did your hearing loss occur?</Label>
                  <Select
                    value={verificationData.hearingLossOnset}
                    onValueChange={(value) => setVerificationData((prev) => ({ ...prev, hearingLossOnset: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select onset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="congenital">Congenital (born with)</SelectItem>
                      <SelectItem value="acquired">Acquired (developed later)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primary-communication">Primary Communication Method</Label>
                  <Select
                    value={verificationData.primaryCommunication}
                    onValueChange={(value) => setVerificationData((prev) => ({ ...prev, primaryCommunication: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASL">American Sign Language (ASL)</SelectItem>
                      <SelectItem value="PSE">Pidgin Signed English (PSE)</SelectItem>
                      <SelectItem value="oral">Oral/Lipreading</SelectItem>
                      <SelectItem value="written">Written Communication</SelectItem>
                      <SelectItem value="mixed">Mixed Methods</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Assistive Technology (check all that apply)</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cochlear-implant"
                    checked={verificationData.cochlearImplant}
                    onCheckedChange={(checked) =>
                      setVerificationData((prev) => ({ ...prev, cochlearImplant: checked as boolean }))
                    }
                  />
                  <Label htmlFor="cochlear-implant">Cochlear Implant(s)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hearing-aids"
                    checked={verificationData.hearingAids}
                    onCheckedChange={(checked) =>
                      setVerificationData((prev) => ({ ...prev, hearingAids: checked as boolean }))
                    }
                  />
                  <Label htmlFor="hearing-aids">Hearing Aid(s)</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Lived Experience</CardTitle>
              <CardDescription>
                Share your authentic experience as a deaf person. This helps us verify your identity and understand your
                specific accessibility needs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="assistive-tech-experience">
                  Describe your daily experience with assistive technology
                </Label>
                <Textarea
                  id="assistive-tech-experience"
                  placeholder="Tell us about your hearing devices, challenges you face, accommodations you need, specific brands or settings you use, etc."
                  value={verificationData.assistiveTechnologyExperience}
                  onChange={(e) =>
                    setVerificationData((prev) => ({
                      ...prev,
                      assistiveTechnologyExperience: e.target.value,
                    }))
                  }
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Be specific about technical details, daily challenges, and accommodation needs. This helps us verify
                  authentic deaf experience.
                </p>
              </div>

              {verificationData.primaryCommunication === "ASL" && (
                <div className="space-y-2">
                  <Label>ASL Video Introduction (Optional but Recommended)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Video className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Button variant="outline">
                        <Camera className="mr-2 h-4 w-4" />
                        Record ASL Introduction
                      </Button>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Record a 30-second video introducing yourself in ASL. This helps verify your ASL fluency and deaf
                      identity.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Accessibility Challenges You Face</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Phone calls without relay",
                    "Meetings without interpreters",
                    "Emergency announcements",
                    "Drive-through services",
                    "Medical appointments",
                    "Public transportation",
                    "Educational settings",
                    "Workplace communication",
                  ].map((challenge) => (
                    <div key={challenge} className="flex items-center space-x-2">
                      <Checkbox
                        id={challenge}
                        checked={verificationData.accessibilityNeeds.includes(challenge)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setVerificationData((prev) => ({
                              ...prev,
                              accessibilityNeeds: [...prev.accessibilityNeeds, challenge],
                            }))
                          } else {
                            setVerificationData((prev) => ({
                              ...prev,
                              accessibilityNeeds: prev.accessibilityNeeds.filter((need) => need !== challenge),
                            }))
                          }
                        }}
                      />
                      <Label htmlFor={challenge} className="text-sm">
                        {challenge}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Verification</CardTitle>
              <CardDescription>
                Connect with other verified deaf community members who can vouch for your identity. This strengthens
                your verification and builds community connections.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-pink-500" />
                  <span className="font-medium">Community References</span>
                </div>

                <p className="text-sm text-muted-foreground">
                  Provide contact information for people in the deaf community who know you. They should be verified
                  DeafAUTH users or recognized community members.
                </p>

                <div className="space-y-4">
                  {[1, 2].map((index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <h4 className="font-medium">Reference {index}</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor={`ref-name-${index}`}>Name</Label>
                          <Input id={`ref-name-${index}`} placeholder="Full name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`ref-email-${index}`}>Email</Label>
                          <Input id={`ref-email-${index}`} type="email" placeholder="email@example.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`ref-relationship-${index}`}>Relationship</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="friend">Friend</SelectItem>
                              <SelectItem value="colleague">Colleague</SelectItem>
                              <SelectItem value="family">Family Member</SelectItem>
                              <SelectItem value="interpreter">Interpreter</SelectItem>
                              <SelectItem value="teacher">Teacher/Educator</SelectItem>
                              <SelectItem value="service_provider">Service Provider</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`ref-phone-${index}`}>Phone (Optional)</Label>
                          <Input id={`ref-phone-${index}`} placeholder="Phone number" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Community Verification Benefits</span>
                  </div>
                  <ul className="mt-2 text-sm text-blue-700 space-y-1">
                    <li>• Faster verification process</li>
                    <li>• Higher trust score in the community</li>
                    <li>• Access to community-only features</li>
                    <li>• Mutual verification network</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical Documentation</CardTitle>
              <CardDescription>
                Upload medical records, audiograms, or other documentation that supports your deaf identity. This is
                optional but can significantly speed up your verification process.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-pink-500" />
                  <span className="font-medium">Accepted Documents</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Audiograms</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Recent hearing tests</li>
                      <li>• Audiologist reports</li>
                      <li>• Hearing aid evaluations</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Medical Records</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• ENT specialist reports</li>
                      <li>• Cochlear implant documentation</li>
                      <li>• Disability determinations</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Documents
                      </Button>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Drag and drop files here, or click to browse. Supports PDF, JPG, PNG (max 10MB each)
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Privacy & Security</span>
                  </div>
                  <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                    <li>• All documents are encrypted and stored securely</li>
                    <li>• Only used for verification purposes</li>
                    <li>• Automatically deleted after verification</li>
                    <li>• HIPAA compliant processing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accessibility Preferences</CardTitle>
              <CardDescription>
                Configure your communication and accessibility preferences for the best experience with DeafLifeOS and
                connected services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-pink-500" />
                  <span className="font-medium">Visual Preferences</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="visual-alerts" defaultChecked />
                    <Label htmlFor="visual-alerts">Visual alerts and notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="high-contrast" />
                    <Label htmlFor="high-contrast">High contrast mode</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="large-text" />
                    <Label htmlFor="large-text">Large text size</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="reduce-motion" />
                    <Label htmlFor="reduce-motion">Reduce motion and animations</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-pink-500" />
                  <span className="font-medium">Communication Preferences</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="asl-video" defaultChecked />
                    <Label htmlFor="asl-video">ASL video interface preferred</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="interpreter-required" defaultChecked />
                    <Label htmlFor="interpreter-required">ASL interpreter required for meetings</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="cart-services" />
                    <Label htmlFor="cart-services">CART services preferred</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="written-summaries" defaultChecked />
                    <Label htmlFor="written-summaries">Written summaries for important info</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-pink-500" />
                  <span className="font-medium">Emergency Contact Preferences</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency-method">Preferred emergency contact method</Label>
                  <Select defaultValue="text">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text message</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="video">Video relay service</SelectItem>
                      <SelectItem value="app">Mobile app notification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-pink-500" />
                  <span className="font-medium">Language & Cultural Preferences</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-language">Primary communication language</Label>
                    <Select defaultValue="ASL">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ASL">American Sign Language (ASL)</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cultural-identity">Cultural identity</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select identity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deaf">Deaf</SelectItem>
                        <SelectItem value="hard-of-hearing">Hard of Hearing</SelectItem>
                        <SelectItem value="deafblind">DeafBlind</SelectItem>
                        <SelectItem value="late-deafened">Late-Deafened</SelectItem>
                        <SelectItem value="coda">CODA (Child of Deaf Adults)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Previous
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}>Next</Button>
        ) : (
          <Button onClick={handleSubmitVerification} className="bg-pink-600 hover:bg-pink-700">
            <Shield className="mr-2 h-4 w-4" />
            Submit Verification
          </Button>
        )}
      </div>

      <Card className="bg-pink-50 border-pink-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-5 w-5 text-pink-600" />
            <span className="font-medium text-pink-800">Why DeafAUTH?</span>
          </div>
          <p className="text-sm text-pink-700">
            DeafAUTH was created by and for the deaf community to ensure authentic access to accessibility services
            while protecting against fraud. Your verification helps maintain the integrity of services designed
            specifically for deaf and hard of hearing individuals.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
