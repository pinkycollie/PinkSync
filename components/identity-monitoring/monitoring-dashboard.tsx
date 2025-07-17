"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  AlertTriangle,
  Eye,
  DollarSign,
  TrendingUp,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
} from "lucide-react"

export default function IdentityMonitoringDashboard() {
  const [alerts, setAlerts] = useState([])
  const [monitoringStatus, setMonitoringStatus] = useState("active")
  const [securityScore, setSecurityScore] = useState(85)

  const mockAlerts = [
    {
      id: "1",
      alertType: "fraud_detection",
      severity: "high",
      title: "Unusual Login Activity",
      description: "Login detected from new location: San Francisco, CA",
      actionRequired: true,
      detectedAt: new Date(),
      status: "active",
    },
    {
      id: "2",
      alertType: "new_opportunity",
      severity: "medium",
      title: "New Tax Credit Available",
      description: "California Disability Property Tax Exemption now available",
      actionRequired: false,
      detectedAt: new Date(),
      status: "active",
    },
    {
      id: "3",
      alertType: "benefit_change",
      severity: "low",
      title: "SSA Benefit Update",
      description: "Your monthly SSDI payment has been adjusted",
      actionRequired: false,
      detectedAt: new Date(),
      status: "resolved",
    },
  ]

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "low":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-500" />
            Identity Monitoring
          </h2>
          <p className="text-muted-foreground">
            Comprehensive monitoring of your deaf identity, benefits, and security
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={monitoringStatus === "active" ? "default" : "secondary"} className="bg-green-500">
            <Zap className="mr-1 h-3 w-3" />
            {monitoringStatus === "active" ? "Active Monitoring" : "Inactive"}
          </Badge>
        </div>
      </div>

      {/* Security Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Security Score
          </CardTitle>
          <CardDescription>Overall security and identity protection status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">{securityScore}/100</span>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Excellent
              </Badge>
            </div>
            <Progress value={securityScore} className="h-3" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium text-green-600">✓ Fraud Detection</div>
                <div className="text-muted-foreground">Active</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-green-600">✓ Benefit Monitoring</div>
                <div className="text-muted-foreground">Active</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-green-600">✓ Dark Web Scan</div>
                <div className="text-muted-foreground">Clean</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-green-600">✓ Verification Status</div>
                <div className="text-muted-foreground">Verified</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monitoring Categories */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-red-500" />
              Fraud Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Login Monitoring</span>
                <Badge variant="outline" className="text-green-600">
                  Active
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Identity Verification</span>
                <Badge variant="outline" className="text-green-600">
                  Secure
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Dark Web Scan</span>
                <Badge variant="outline" className="text-green-600">
                  Clean
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-green-500" />
              Benefit Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>SSA Benefits</span>
                <Badge variant="outline" className="text-blue-600">
                  Tracking
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax Credits</span>
                <Badge variant="outline" className="text-blue-600">
                  Tracking
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Property Tax</span>
                <Badge variant="outline" className="text-blue-600">
                  Tracking
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Eye className="h-4 w-4 text-purple-500" />
              Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Deaf Identity</span>
                <Badge variant="outline" className="text-green-600">
                  Verified
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Medical Docs</span>
                <Badge variant="outline" className="text-green-600">
                  Valid
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Community</span>
                <Badge variant="outline" className="text-green-600">
                  Verified
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>New Programs</span>
                <Badge variant="outline" className="text-orange-600">
                  2 Found
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax Benefits</span>
                <Badge variant="outline" className="text-orange-600">
                  1 New
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Grants</span>
                <Badge variant="outline" className="text-gray-600">
                  Monitoring
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-500" />
            Recent Alerts
          </CardTitle>
          <CardDescription>Latest identity monitoring alerts and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="mt-1">{getSeverityIcon(alert.severity)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{alert.title}</h4>
                    <Badge variant="outline" className={`text-xs ${getSeverityColor(alert.severity)} text-white`}>
                      {alert.severity}
                    </Badge>
                    {alert.status === "resolved" && (
                      <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                        Resolved
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{alert.detectedAt.toLocaleDateString()}</span>
                    {alert.actionRequired && (
                      <Badge variant="outline" className="text-xs text-orange-600 border-orange-600">
                        Action Required
                      </Badge>
                    )}
                  </div>
                </div>
                {alert.actionRequired && alert.status === "active" && (
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Your identity is being continuously monitored for fraud, benefit changes, and new opportunities. You'll be
          notified immediately of any suspicious activity or important updates.
        </AlertDescription>
      </Alert>
    </div>
  )
}
