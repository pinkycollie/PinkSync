"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink, CheckCircle, XCircle, Shield, Lock, Eye, EyeOff } from "lucide-react"

interface GovernmentConnection {
  service: string
  name: string
  description: string
  icon: string
  connected: boolean
  lastSync?: string
  dataTypes: string[]
  privacyLevel: "high" | "medium" | "low"
  benefits: string[]
}

export default function GovernmentConnectionManager() {
  const [connections, setConnections] = useState<GovernmentConnection[]>([
    {
      service: "login.gov",
      name: "Login.gov",
      description: "Federal government authentication service",
      icon: "🏛️",
      connected: false,
      dataTypes: ["Identity Verification", "Federal Benefits", "Tax Information"],
      privacyLevel: "high",
      benefits: ["Single sign-on for federal services", "Verified identity", "Secure authentication"],
    },
    {
      service: "myssa",
      name: "my Social Security",
      description: "Social Security Administration account",
      icon: "🏥",
      connected: false,
      dataTypes: ["Benefits Information", "Earnings Record", "Disability Status"],
      privacyLevel: "high",
      benefits: ["Real-time benefit updates", "Earnings history", "Disability determination status"],
    },
    {
      service: "irs",
      name: "IRS Online Account",
      description: "Internal Revenue Service account",
      icon: "💰",
      connected: false,
      dataTypes: ["Tax Transcripts", "Payment History", "Refund Status"],
      privacyLevel: "high",
      benefits: ["Tax transcript access", "Payment tracking", "Refund status"],
    },
    {
      service: "id.me",
      name: "ID.me",
      description: "Veteran and government services verification",
      icon: "🎖️",
      connected: false,
      dataTypes: ["Military Service", "Veteran Benefits", "Disability Rating"],
      privacyLevel: "medium",
      benefits: ["Veteran benefit access", "Military service verification", "Disability rating"],
    },
  ])

  const [showDataTypes, setShowDataTypes] = useState<Record<string, boolean>>({})

  const connectService = async (service: string) => {
    try {
      const response = await fetch("/api/auth/government/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service,
          userId: "current-user-id", // From auth context
        }),
      })

      const result = await response.json()

      if (result.authUrl) {
        // Redirect user to government service for authentication
        window.location.href = result.authUrl
      }
    } catch (error) {
      console.error("Connection error:", error)
    }
  }

  const disconnectService = async (service: string) => {
    try {
      const response = await fetch(`/api/auth/government/disconnect/${service}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setConnections((prev) => prev.map((conn) => (conn.service === service ? { ...conn, connected: false } : conn)))
      }
    } catch (error) {
      console.error("Disconnection error:", error)
    }
  }

  const toggleDataVisibility = (service: string) => {
    setShowDataTypes((prev) => ({ ...prev, [service]: !prev[service] }))
  }

  const getPrivacyBadge = (level: string) => {
    const variants = {
      high: { variant: "default" as const, text: "High Security", color: "text-green-600" },
      medium: { variant: "secondary" as const, text: "Medium Security", color: "text-yellow-600" },
      low: { variant: "outline" as const, text: "Standard Security", color: "text-gray-600" },
    }

    const config = variants[level]
    return (
      <Badge variant={config.variant} className={config.color}>
        <Shield className="mr-1 h-3 w-3" />
        {config.text}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Government Account Connections</h2>
        <p className="text-muted-foreground">
          Connect your government accounts directly for secure, real-time access to your information
        </p>
      </div>

      <Alert>
        <Lock className="h-4 w-4" />
        <AlertDescription>
          <strong>Your Privacy is Protected:</strong> You authenticate directly with government services. We never see
          your government passwords, and you can disconnect at any time.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {connections.map((connection) => (
          <Card key={connection.service} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{connection.icon}</div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {connection.name}
                      {connection.connected ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-400" />
                      )}
                    </CardTitle>
                    <CardDescription>{connection.description}</CardDescription>
                  </div>
                </div>
                {getPrivacyBadge(connection.privacyLevel)}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Data Access</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleDataVisibility(connection.service)}
                    className="h-6 w-6 p-0"
                  >
                    {showDataTypes[connection.service] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                {showDataTypes[connection.service] && (
                  <div className="space-y-1">
                    {connection.dataTypes.map((dataType) => (
                      <div key={dataType} className="text-xs text-muted-foreground flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                        {dataType}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Benefits</span>
                <div className="space-y-1">
                  {connection.benefits.slice(0, 2).map((benefit) => (
                    <div key={benefit} className="text-xs text-muted-foreground flex items-center">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                      {benefit}
                    </div>
                  ))}
                  {connection.benefits.length > 2 && (
                    <div className="text-xs text-muted-foreground">+{connection.benefits.length - 2} more benefits</div>
                  )}
                </div>
              </div>

              {connection.connected && connection.lastSync && (
                <div className="text-xs text-muted-foreground">
                  Last synced: {new Date(connection.lastSync).toLocaleString()}
                </div>
              )}

              <div className="flex gap-2">
                {connection.connected ? (
                  <>
                    <Button variant="outline" size="sm" className="flex-1">
                      Sync Now
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => disconnectService(connection.service)}
                      className="flex-1"
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => connectService(connection.service)} className="w-full" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Connect Account
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Note:</strong> All connections use OAuth 2.0 with PKCE for maximum security. Your
          authentication tokens are encrypted and can be revoked at any time from your government account settings.
        </AlertDescription>
      </Alert>
    </div>
  )
}
