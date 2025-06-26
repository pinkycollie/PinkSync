"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@mbtq/auth"
import { Button } from "../button"
import { Input } from "../input"
import { Label } from "../label"
import { Alert, AlertDescription } from "../alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select"
import { Checkbox } from "../checkbox"
import { VisualFeedback } from "./visual-feedback"

export function SignUpForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [preferredSignLanguage, setPreferredSignLanguage] = useState<"ASL" | "BSL" | "ISL" | "Other">("ASL")
  const [requiresVisualFeedback, setRequiresVisualFeedback] = useState(true)
  const [passwordError, setPasswordError] = useState("")

  const { signUp, loading, error } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords match
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    setPasswordError("")

    const success = await signUp({
      name,
      email,
      password,
      preferredSignLanguage,
      requiresVisualFeedback,
    })

    if (success) {
      router.push("/dashboard")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create an Account</CardTitle>
        <CardDescription>Sign up to access all features of MBTQ.dev</CardDescription>
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
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-4">
        <div className="text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="text-primary-600 hover:underline">
            Sign in
          </a>
        </div>
        <VisualFeedback type="signup" />
      </CardFooter>
    </Card>
  )
}
