"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Zap, DollarSign, Building, Home, Users, CheckCircle, RefreshCw, Eye } from "lucide-react"

export default function DeafPassportDashboard() {
  const [passport, setPassport] = useState(null)
  const [isNotifying, setIsNotifying] = useState(false)
  const [notificationProgress, setNotificationProgress] = useState(0)

  const notifyAllServices = async () => {
    setIsNotifying(true)
    setNotificationProgress(0)

    try {
      const response = await fetch("/api/deaf-passport/notify-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "current-user-id",
          triggerType: "manual",
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Simulate progress
        for (let i = 0; i <= 100; i += 10) {
          setNotificationProgress(i)
          await new Promise((resolve) => setTimeout(resolve, 200))
        }
      }
    } catch (error) {
      console.error("Notification failed:", error)
    } finally {
      setIsNotifying(false)
    }
  }

  const mockPassport = {
    deafStatus: {
      verified: true,
      hearingLossType: "sensorineural",
      hearingLossDegree: "profound",
      primaryCommunication: "ASL",
      verificationLevel: "medical",
    },
    connectedServices: [
      { serviceName: "IRS Tax Services", status: "notified" },
      { serviceName: "Social Security", status: "notified" },
      { serviceName: "DMV Services", status: "notified" },
      { serviceName: "Healthcare.gov", status: "notified" },
      { serviceName: "Banking Services", status: "notified" },
      { serviceName: "Employment Portal", status: "notified" },
    ],
    taxOptimizations: {
      disabilityTaxCredits: ["Federal Disabled Access Credit", "EITC Disability Provisions"],
      propertyTaxAbatements: ["CA Disabled Veterans Exemption", "CA Disabled Persons Postponement"],
      employerTaxCredits: ["Work Opportunity Tax Credit", "Disabled Access Credit"],
      totalPotentialSavings: 15400,
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-500" />
            Deaf Identity Passport
          </h2>
          <p className="text-muted-foreground">
            Automatically notify all services of your deaf status and accessibility needs
          </p>
        </div>
        <Button onClick={notifyAllServices} disabled={isNotifying} className="min-w-[140px]">
          {isNotifying ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Notifying...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Notify All Services
            </>
          )}
        </Button>
      </div>

      {isNotifying && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Notifying all connected services...</span>
                <span>{Math.round(notificationProgress)}%</span>
              </div>
              <Progress value={notificationProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Deaf Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Deaf Status
            </CardTitle>
            <CardDescription>Verified deaf identity and communication preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Verification Status</span>
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Hearing Loss:</span>
                <span className="font-medium">Profound Sensorineural</span>
              </div>
              <div className="flex justify-between">
                <span>Communication:</span>
                <span className="font-medium">ASL</span>
              </div>
              <div className="flex justify-between">
                <span>Verification Level:</span>
                <span className="font-medium">Medical</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500" />
              Accessibility Settings
            </CardTitle>
            <CardDescription>Automatically applied to all services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Visual Alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Vibration</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>ASL Interpreter</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>CART Services</span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="text-sm">
                <span className="font-medium">Emergency Contact:</span> Text Message
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connected Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              Connected Services
            </CardTitle>
            <CardDescription>Services automatically notified of deaf status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockPassport.connectedServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{service.serviceName}</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Notified
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tax Optimizations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            Tax Optimizations & Credits
          </CardTitle>
          <CardDescription>Automatically discovered tax benefits and credits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-blue-600">Federal Tax Credits</h4>
              <ul className="text-sm space-y-1">
                {mockPassport.taxOptimizations.disabilityTaxCredits.map((credit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    {credit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm text-purple-600">Property Tax Abatements</h4>
              <ul className="text-sm space-y-1">
                {mockPassport.taxOptimizations.propertyTaxAbatements.map((abatement, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Home className="h-3 w-3 text-purple-500" />
                    {abatement}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm text-orange-600">Employer Tax Credits</h4>
              <ul className="text-sm space-y-1">
                {mockPassport.taxOptimizations.employerTaxCredits.map((credit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Building className="h-3 w-3 text-orange-500" />
                    {credit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm text-green-600">Total Potential Savings</h4>
              <div className="text-2xl font-bold text-green-600">
                ${mockPassport.taxOptimizations.totalPotentialSavings.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Annual estimated savings</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Your Deaf Identity Passport automatically notifies all connected services of your deaf status and
          accessibility preferences. This ensures you receive proper accommodations and access to all available benefits
          without having to repeatedly configure settings.
        </AlertDescription>
      </Alert>
    </div>
  )
}
