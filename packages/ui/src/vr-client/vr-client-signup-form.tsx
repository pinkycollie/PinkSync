"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../button"
import { Input } from "../input"
import { Label } from "../label"
import { Alert, AlertDescription } from "../alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select"
import { Checkbox } from "../checkbox"
import { VisualFeedback } from "../auth/visual-feedback"

// Import the VR client auth functions
// Note: In a real implementation, you would create a custom hook for this
const mockSignUpVRClient = async (userData: any) => {
  // This is a mock function - in a real implementation, you would call the actual API
  return { success: true, user: { id: "123", name: userData.name, email: userData.email } }
}

export function VRClientSignUpForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [state, setState] = useState("")
  const [employmentGoal, setEmploymentGoal] = useState<"job-placement" | "self-employment" | "education" | "other">(
    "job-placement",
  )
  const [preferredSignLanguage, setPreferredSignLanguage] = useState<"ASL" | "BSL" | "ISL" | "Other">("ASL")
  const [requiresVisualFeedback, setRequiresVisualFeedback] = useState(true)
  const [accommodations, setAccommodations] = useState<string[]>([])
  const [passwordError, setPasswordError] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<{ code: string; message: string } | null>(null)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords match
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    setPasswordError("")
    setLoading(true)
    setError(null)

    try {
      const result = await mockSignUpVRClient({
        name,
        email,
        password,
        state,
        employmentGoal,
        preferredSignLanguage,
        requiresVisualFeedback,
        accommodations,
      })

      if (result.success) {
        router.push("/dashboard")
      } else {
        setError({ code: "signup_failed", message: "Failed to create account" })
      }
    } catch (err) {
      setError({ code: "unknown_error", message: "An unexpected error occurred" })
    } finally {
      setLoading(false)
    }
  }

  const handleAccommodationToggle = (accommodation: string) => {
    if (accommodations.includes(accommodation)) {
      setAccommodations(accommodations.filter((a) => a !== accommodation))
    } else {
      setAccommodations([...accommodations, accommodation])
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create VR Client Account</CardTitle>
        <CardDescription>Sign up to access vocational rehabilitation services</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          {passwordError && (
            <Alert variant="destructive">
              <AlertDescription>{passwordError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger id="state">
                <SelectValue placeholder="Select your state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CA">California</SelectItem>
                <SelectItem value="TX">Texas</SelectItem>
                <SelectItem value="NY">New York</SelectItem>
                <SelectItem value="FL">Florida</SelectItem>
                <SelectItem value="IL">Illinois</SelectItem>
                {/* Add more states as needed */}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employmentGoal">Employment Goal</Label>
            <Select
              value={employmentGoal}
              onValueChange={(value) =>
                setEmploymentGoal(value as "job-placement" | "self-employment" | "education" | "other")
              }
            >
              <SelectTrigger id="employmentGoal">
                <SelectValue placeholder="Select your employment goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="job-placement">Job Placement</SelectItem>
                <SelectItem value="self-employment">Self-Employment</SelectItem>
                <SelectItem value="education">Education/Training</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredSignLanguage">Preferred Sign Language</Label>
            <Select
              value={preferredSignLanguage}
              onValueChange={(value) => setPreferredSignLanguage(value as "ASL" | "BSL" | "ISL" | "Other")}
            >
              <SelectTrigger id="preferredSignLanguage">
                <SelectValue placeholder="Select sign language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASL">American Sign Language (ASL)</SelectItem>
                <SelectItem value="BSL">British Sign Language (BSL)</SelectItem>
                <SelectItem value="ISL">International Sign Language (ISL)</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Accommodations Needed</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="signLanguageInterpreter"
                  checked={accommodations.includes("signLanguageInterpreter")}
                  onCheckedChange={() => handleAccommodationToggle("signLanguageInterpreter")}
                />
                <Label htmlFor="signLanguageInterpreter" className="text-sm">
                  Sign Language Interpreter
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="captioning"
                  checked={accommodations.includes("captioning")}
                  onCheckedChange={() => handleAccommodationToggle("captioning")}
                />
                <Label htmlFor="captioning" className="text-sm">
                  Captioning
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="visualAlerts"
                  checked={accommodations.includes("visualAlerts")}
                  onCheckedChange={() => handleAccommodationToggle("visualAlerts")}
                />
                <Label htmlFor="visualAlerts" className="text-sm">
                  Visual Alerts
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="assistiveTechnology"
                  checked={accommodations.includes("assistiveTechnology")}
                  onCheckedChange={() => handleAccommodationToggle("assistiveTechnology")}
                />
                <Label htmlFor="assistiveTechnology" className="text-sm">
                  Assistive Technology
                </Label>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="visualFeedback"
              checked={requiresVisualFeedback}
              onCheckedChange={(checked) => setRequiresVisualFeedback(checked as boolean)}
            />
            <Label htmlFor="visualFeedback" className="text-sm">
              Enable visual feedback for authentication
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up for VR Services"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-4">
        <div className="text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:underline">
            Sign in
          </a>
        </div>
        <VisualFeedback type="signup" />
      </CardFooter>
    </Card>
  )
}
