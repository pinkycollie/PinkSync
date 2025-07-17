"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, MapPin, Shield, FileText, Users, Building, CheckCircle2, AlertCircle, Video } from "lucide-react"

interface RegistrationData {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string

  // Address Information
  street: string
  city: string
  state: string
  zipCode: string
  county: string

  // Deaf Identity Verification
  hearingLossType: string
  hearingLossDegree: string
  primaryCommunication: string
  assistiveTechnology: string[]

  // Government Identifiers
  ssn: string
  driversLicense: string
  stateId: string

  // Registration Type
  registrationType: "resident" | "city_official" | "state_official" | "federal_official" | "community_leader"
  organization?: string
  position?: string
  jurisdiction?: string

  // Verification Documents
  documents: File[]

  // Preferences
  communicationPreferences: string[]
  accessibilityNeeds: string[]

  // Consent and Agreements
  consentDataSharing: boolean
  consentCommunityParticipation: boolean
  agreeToTerms: boolean
}

export function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<RegistrationData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const totalSteps = 6
  const progress = (currentStep / totalSteps) * 100

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1: // Personal Information
        if (!formData.firstName) newErrors.firstName = "First name is required"
        if (!formData.lastName) newErrors.lastName = "Last name is required"
        if (!formData.email) newErrors.email = "Email is required"
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
        break

      case 2: // Address Information
        if (!formData.street) newErrors.street = "Street address is required"
        if (!formData.city) newErrors.city = "City is required"
        if (!formData.state) newErrors.state = "State is required"
        if (!formData.zipCode) newErrors.zipCode = "ZIP code is required"
        break

      case 3: // Deaf Identity Verification
        if (!formData.hearingLossType) newErrors.hearingLossType = "Hearing loss type is required"
        if (!formData.hearingLossDegree) newErrors.hearingLossDegree = "Hearing loss degree is required"
        if (!formData.primaryCommunication) newErrors.primaryCommunication = "Primary communication method is required"
        break

      case 4: // Registration Type
        if (!formData.registrationType) newErrors.registrationType = "Registration type is required"
        if (formData.registrationType !== "resident" && !formData.organization) {
          newErrors.organization = "Organization is required for officials"
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/registration/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        // Registration successful
        setCurrentStep(totalSteps + 1) // Success step
      } else {
        throw new Error("Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setErrors({ submit: "Registration failed. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName || ""}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName || ""}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => updateFormData("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth || ""}
                  onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                  className={errors.dateOfBirth ? "border-red-500" : ""}
                />
                {errors.dateOfBirth && <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth}</p>}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                value={formData.street || ""}
                onChange={(e) => updateFormData("street", e.target.value)}
                className={errors.street ? "border-red-500" : ""}
              />
              {errors.street && <p className="text-sm text-red-500 mt-1">{errors.street}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city || ""}
                  onChange={(e) => updateFormData("city", e.target.value)}
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Select value={formData.state || ""} onValueChange={(value) => updateFormData("state", value)}>
                  <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    {/* Add all states */}
                  </SelectContent>
                </Select>
                {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode || ""}
                  onChange={(e) => updateFormData("zipCode", e.target.value)}
                  className={errors.zipCode ? "border-red-500" : ""}
                />
                {errors.zipCode && <p className="text-sm text-red-500 mt-1">{errors.zipCode}</p>}
              </div>
              <div>
                <Label htmlFor="county">County</Label>
                <Input
                  id="county"
                  value={formData.county || ""}
                  onChange={(e) => updateFormData("county", e.target.value)}
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <Alert>
              <Video className="h-4 w-4" />
              <AlertDescription>
                This information helps us provide appropriate accessibility services and verify your deaf identity. All
                information is encrypted and protected.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hearingLossType">Type of Hearing Loss *</Label>
                <Select
                  value={formData.hearingLossType || ""}
                  onValueChange={(value) => updateFormData("hearingLossType", value)}
                >
                  <SelectTrigger className={errors.hearingLossType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conductive">Conductive</SelectItem>
                    <SelectItem value="sensorineural">Sensorineural</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                    <SelectItem value="auditory_processing">Auditory Processing</SelectItem>
                  </SelectContent>
                </Select>
                {errors.hearingLossType && <p className="text-sm text-red-500 mt-1">{errors.hearingLossType}</p>}
              </div>
              <div>
                <Label htmlFor="hearingLossDegree">Degree of Hearing Loss *</Label>
                <Select
                  value={formData.hearingLossDegree || ""}
                  onValueChange={(value) => updateFormData("hearingLossDegree", value)}
                >
                  <SelectTrigger className={errors.hearingLossDegree ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                    <SelectItem value="profound">Profound</SelectItem>
                  </SelectContent>
                </Select>
                {errors.hearingLossDegree && <p className="text-sm text-red-500 mt-1">{errors.hearingLossDegree}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="primaryCommunication">Primary Communication Method *</Label>
              <Select
                value={formData.primaryCommunication || ""}
                onValueChange={(value) => updateFormData("primaryCommunication", value)}
              >
                <SelectTrigger className={errors.primaryCommunication ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select communication method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ASL">American Sign Language (ASL)</SelectItem>
                  <SelectItem value="PSE">Pidgin Signed English (PSE)</SelectItem>
                  <SelectItem value="oral">Oral Communication</SelectItem>
                  <SelectItem value="written">Written Communication</SelectItem>
                  <SelectItem value="mixed">Mixed Methods</SelectItem>
                </SelectContent>
              </Select>
              {errors.primaryCommunication && (
                <p className="text-sm text-red-500 mt-1">{errors.primaryCommunication}</p>
              )}
            </div>

            <div>
              <Label>Assistive Technology (Select all that apply)</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  "Hearing Aids",
                  "Cochlear Implant",
                  "FM System",
                  "Captioning Device",
                  "Vibrating Alarm",
                  "TTY/TDD",
                ].map((tech) => (
                  <div key={tech} className="flex items-center space-x-2">
                    <Checkbox
                      id={tech}
                      checked={formData.assistiveTechnology?.includes(tech) || false}
                      onCheckedChange={(checked) => {
                        const current = formData.assistiveTechnology || []
                        if (checked) {
                          updateFormData("assistiveTechnology", [...current, tech])
                        } else {
                          updateFormData(
                            "assistiveTechnology",
                            current.filter((t) => t !== tech),
                          )
                        }
                      }}
                    />
                    <Label htmlFor={tech} className="text-sm">
                      {tech}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="registrationType">Registration Type *</Label>
              <Select
                value={formData.registrationType || ""}
                onValueChange={(value) => updateFormData("registrationType", value)}
              >
                <SelectTrigger className={errors.registrationType ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select registration type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resident">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Deaf Community Resident</div>
                        <div className="text-xs text-muted-foreground">Individual seeking government services</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="city_official">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <div>
                        <div className="font-medium">City Official</div>
                        <div className="text-xs text-muted-foreground">Municipal government representative</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="state_official">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <div>
                        <div className="font-medium">State Official</div>
                        <div className="text-xs text-muted-foreground">State government representative</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="federal_official">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Federal Official</div>
                        <div className="text-xs text-muted-foreground">Federal government representative</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="community_leader">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Community Leader</div>
                        <div className="text-xs text-muted-foreground">Deaf community organization leader</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.registrationType && <p className="text-sm text-red-500 mt-1">{errors.registrationType}</p>}
            </div>

            {formData.registrationType && formData.registrationType !== "resident" && (
              <>
                <div>
                  <Label htmlFor="organization">Organization *</Label>
                  <Input
                    id="organization"
                    value={formData.organization || ""}
                    onChange={(e) => updateFormData("organization", e.target.value)}
                    placeholder="e.g., City of San Francisco, California Department of Health"
                    className={errors.organization ? "border-red-500" : ""}
                  />
                  {errors.organization && <p className="text-sm text-red-500 mt-1">{errors.organization}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="position">Position/Title</Label>
                    <Input
                      id="position"
                      value={formData.position || ""}
                      onChange={(e) => updateFormData("position", e.target.value)}
                      placeholder="e.g., Director of Accessibility Services"
                    />
                  </div>
                  <div>
                    <Label htmlFor="jurisdiction">Jurisdiction</Label>
                    <Input
                      id="jurisdiction"
                      value={formData.jurisdiction || ""}
                      onChange={(e) => updateFormData("jurisdiction", e.target.value)}
                      placeholder="e.g., San Francisco County, California"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <Label>Communication Preferences</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["ASL Video", "Email", "Text Messages", "Written Letters", "In-Person Meetings", "Phone Calls"].map(
                  (pref) => (
                    <div key={pref} className="flex items-center space-x-2">
                      <Checkbox
                        id={pref}
                        checked={formData.communicationPreferences?.includes(pref) || false}
                        onCheckedChange={(checked) => {
                          const current = formData.communicationPreferences || []
                          if (checked) {
                            updateFormData("communicationPreferences", [...current, pref])
                          } else {
                            updateFormData(
                              "communicationPreferences",
                              current.filter((p) => p !== pref),
                            )
                          }
                        }}
                      />
                      <Label htmlFor={pref} className="text-sm">
                        {pref}
                      </Label>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div>
              <Label>Accessibility Needs</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  "ASL Interpreter",
                  "CART Services",
                  "Visual Alerts",
                  "Extended Time",
                  "Written Instructions",
                  "Large Print",
                ].map((need) => (
                  <div key={need} className="flex items-center space-x-2">
                    <Checkbox
                      id={need}
                      checked={formData.accessibilityNeeds?.includes(need) || false}
                      onCheckedChange={(checked) => {
                        const current = formData.accessibilityNeeds || []
                        if (checked) {
                          updateFormData("accessibilityNeeds", [...current, need])
                        } else {
                          updateFormData(
                            "accessibilityNeeds",
                            current.filter((n) => n !== need),
                          )
                        }
                      }}
                    />
                    <Label htmlFor={need} className="text-sm">
                      {need}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="consentDataSharing"
                  checked={formData.consentDataSharing || false}
                  onCheckedChange={(checked) => updateFormData("consentDataSharing", checked)}
                />
                <div>
                  <Label htmlFor="consentDataSharing" className="text-sm font-medium">
                    Data Sharing Consent
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    I consent to sharing my data with government agencies to access services and benefits. Data is
                    encrypted and controlled by the deaf community.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="consentCommunityParticipation"
                  checked={formData.consentCommunityParticipation || false}
                  onCheckedChange={(checked) => updateFormData("consentCommunityParticipation", checked)}
                />
                <div>
                  <Label htmlFor="consentCommunityParticipation" className="text-sm font-medium">
                    Community Participation
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    I agree to participate in community governance and decision-making processes.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms || false}
                  onCheckedChange={(checked) => updateFormData("agreeToTerms", checked)}
                />
                <div>
                  <Label htmlFor="agreeToTerms" className="text-sm font-medium">
                    Terms and Conditions *
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    I agree to the terms of service and privacy policy. I understand my rights and the community
                    governance structure.
                  </p>
                </div>
              </div>
            </div>

            {errors.submit && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}
          </div>
        )

      default:
        return (
          <div className="text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-bold">Registration Successful!</h3>
            <p className="text-muted-foreground">
              Welcome to DeafLifeOS! Your account is being verified and you'll receive confirmation within 24 hours.
            </p>
            <Button onClick={() => (window.location.href = "/dashboard")}>Go to Dashboard</Button>
          </div>
        )
    }
  }

  if (currentStep > totalSteps) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8">{renderStepContent()}</CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">🤟 Join DeafLifeOS</h1>
        <p className="text-muted-foreground mt-2">
          Register to access government services, community resources, and advocacy tools
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentStep === 1 && <User className="h-5 w-5" />}
            {currentStep === 2 && <MapPin className="h-5 w-5" />}
            {currentStep === 3 && <Video className="h-5 w-5" />}
            {currentStep === 4 && <Building className="h-5 w-5" />}
            {currentStep === 5 && <Users className="h-5 w-5" />}
            {currentStep === 6 && <FileText className="h-5 w-5" />}
            {currentStep === 1 && "Personal Information"}
            {currentStep === 2 && "Address Information"}
            {currentStep === 3 && "Deaf Identity Verification"}
            {currentStep === 4 && "Registration Type"}
            {currentStep === 5 && "Preferences"}
            {currentStep === 6 && "Consent & Terms"}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && "Basic personal information for account creation"}
            {currentStep === 2 && "Your address helps us connect you with local services"}
            {currentStep === 3 && "Verify your deaf identity for appropriate services"}
            {currentStep === 4 && "Choose your role in the DeafLifeOS community"}
            {currentStep === 5 && "Set your communication and accessibility preferences"}
            {currentStep === 6 && "Review and agree to terms and conditions"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStepContent()}

          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={nextStep}>Next</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting || !formData.agreeToTerms}>
                {isSubmitting ? "Submitting..." : "Complete Registration"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
