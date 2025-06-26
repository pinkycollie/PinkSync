"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../button"
import { Input } from "../input"
import { Label } from "../label"
import { Textarea } from "../textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card"
import { Alert, AlertDescription } from "../alert"

// Mock function - in a real implementation, you would use the actual API
const mockAddFundingRequest = async (request: any) => {
  return { success: true, request: { ...request, id: "req-123", status: "pending" } }
}

export function FundingRequestForm() {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [justification, setJustification] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await mockAddFundingRequest({
        name,
        amount: Number.parseFloat(amount),
        category,
        description,
        justification,
      })

      if (result.success) {
        setSuccess(true)
        // Reset form
        setName("")
        setAmount("")
        setCategory("")
        setDescription("")
        setJustification("")
      } else {
        setError("Failed to submit funding request")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Funding</CardTitle>
        <CardDescription>Submit a request for vocational rehabilitation funding</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <AlertDescription>Your funding request has been submitted successfully!</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., MacBook Pro M3"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="computer">Computer Equipment</SelectItem>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="assistive-tech">Assistive Technology</SelectItem>
                <SelectItem value="education">Education/Training</SelectItem>
                <SelectItem value="office">Office Equipment</SelectItem>
                <SelectItem value="transportation">Transportation</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about the item"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="justification">Justification</Label>
            <Textarea
              id="justification"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Explain how this item will help you achieve your employment goal"
              rows={4}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Funding Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
