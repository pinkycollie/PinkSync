"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  Database,
  Webhook,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Globe,
  Server,
  Cpu,
  HardDrive,
} from "lucide-react"

interface SystemStatus {
  overall: "healthy" | "degraded" | "down"
  services: Record<string, boolean>
  environment: string
  automation: {
    workflows_active: number
    webhooks_processed: number
    real_time_connections: number
  }
}

export default function AutomationDashboard() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    overall: "healthy",
    services: {},
    environment: "production",
    automation: {
      workflows_active: 0,
      webhooks_processed: 0,
      real_time_connections: 0,
    },
  })

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: "workflow",
      title: "User Registration Workflow",
      status: "completed",
      timestamp: "2 minutes ago",
      details: "New user onboarding completed successfully",
    },
    {
      id: 2,
      type: "webhook",
      title: "Fal.ai Video Completion",
      status: "processing",
      timestamp: "5 minutes ago",
      details: "Video generation webhook received",
    },
    {
      id: 3,
      type: "database",
      title: "Accessibility Preferences Update",
      status: "completed",
      timestamp: "8 minutes ago",
      details: "User preferences synchronized",
    },
  ])

  useEffect(() => {
    // Fetch system status
    fetchSystemStatus()
    const interval = setInterval(fetchSystemStatus, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchSystemStatus = async () => {
    try {
      const [healthResponse, configResponse] = await Promise.all([
        fetch("/api/system/health"),
        fetch("/api/environment/config"),
      ])

      const health = await healthResponse.json()
      const config = await configResponse.json()

      setSystemStatus({
        overall: health.status,
        services: health.services,
        environment: config.environment,
        automation: {
          workflows_active: 12,
          webhooks_processed: 156,
          real_time_connections: 23,
        },
      })
    } catch (error) {
      console.error("Failed to fetch system status:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "processing":
        return <Clock className="h-5 w-5 text-blue-600" />
      case "degraded":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "down":
      case "failed":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <Activity className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "degraded":
        return "bg-yellow-100 text-yellow-800"
      case "down":
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Automation Dashboard</h1>
          <p className="text-lg text-gray-600">Monitor and manage automated systems</p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon(systemStatus.overall)}
          <Badge className={getStatusColor(systemStatus.overall)}>System {systemStatus.overall}</Badge>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Workflows</p>
                <p className="text-2xl font-bold">{systemStatus.automation.workflows_active}</p>
              </div>
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Webhooks Processed</p>
                <p className="text-2xl font-bold">{systemStatus.automation.webhooks_processed}</p>
              </div>
              <Webhook className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Real-time Connections</p>
                <p className="text-2xl font-bold">{systemStatus.automation.real_time_connections}</p>
              </div>
              <Globe className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Environment</p>
                <p className="text-2xl font-bold capitalize">{systemStatus.environment}</p>
              </div>
              <Server className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="environment">Environment</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Core Services Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(systemStatus.services).map(([service, status]) => (
                  <div key={service} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {service === "database" && <Database className="h-5 w-5" />}
                      {service === "blob_storage" && <HardDrive className="h-5 w-5" />}
                      {service === "vertex_ai" && <Cpu className="h-5 w-5" />}
                      {service === "fal_ai" && <Zap className="h-5 w-5" />}
                      {service === "webhooks" && <Webhook className="h-5 w-5" />}
                      <span className="font-medium capitalize">{service.replace("_", " ")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status ? "healthy" : "down")}
                      <Badge className={getStatusColor(status ? "healthy" : "down")}>
                        {status ? "Online" : "Offline"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Activity className="h-4 w-4 mr-2" />
                    Run Health Check
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Update Configuration
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Zap className="h-4 w-4 mr-2" />
                    Restart Services
                  </Button>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Resource Usage</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>CPU Usage</span>
                        <span>34%</span>
                      </div>
                      <Progress value={34} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Memory Usage</span>
                        <span>67%</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Storage Usage</span>
                        <span>23%</span>
                      </div>
                      <Progress value={23} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Workflows</CardTitle>
              <CardDescription>Automated processes currently running</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "User Registration Pipeline",
                    status: "active",
                    processed: 23,
                    success_rate: 98,
                  },
                  {
                    name: "Document Analysis Workflow",
                    status: "active",
                    processed: 45,
                    success_rate: 94,
                  },
                  {
                    name: "Video Generation Pipeline",
                    status: "active",
                    processed: 12,
                    success_rate: 89,
                  },
                  {
                    name: "Emergency Alert System",
                    status: "standby",
                    processed: 0,
                    success_rate: 100,
                  },
                ].map((workflow, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{workflow.name}</h3>
                      <Badge className={getStatusColor(workflow.status)}>{workflow.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Processed Today:</span>
                        <span className="font-medium ml-2">{workflow.processed}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Success Rate:</span>
                        <span className="font-medium ml-2">{workflow.success_rate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Activity</CardTitle>
              <CardDescription>Recent webhook events and processing status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        {activity.type === "workflow" && <Zap className="h-5 w-5 text-blue-600" />}
                        {activity.type === "webhook" && <Webhook className="h-5 w-5 text-green-600" />}
                        {activity.type === "database" && <Database className="h-5 w-5 text-purple-600" />}
                        <div>
                          <h3 className="font-semibold">{activity.title}</h3>
                          <p className="text-sm text-gray-600">{activity.details}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(activity.status)}
                        <span className="text-sm text-gray-500">{activity.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environment" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Environment Variables</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { name: "SUPABASE_URL", status: "configured" },
                    { name: "SUPABASE_ANON_KEY", status: "configured" },
                    { name: "BLOB_READ_WRITE_TOKEN", status: "configured" },
                    { name: "FAL_KEY", status: "configured" },
                    { name: "GOOGLE_CLOUD_ACCESS_TOKEN", status: "configured" },
                    { name: "WEBHOOK_SECRET", status: "configured" },
                  ].map((env) => (
                    <div key={env.name} className="flex justify-between items-center p-2 border rounded">
                      <span className="font-mono text-sm">{env.name}</span>
                      <Badge variant="secondary">{env.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integration Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { name: "Google Workspace", status: "connected" },
                    { name: "Supabase Database", status: "connected" },
                    { name: "Vercel Blob Storage", status: "connected" },
                    { name: "Fal.ai API", status: "connected" },
                    { name: "Vertex AI", status: "connected" },
                    { name: "Webhook Endpoints", status: "configured" },
                  ].map((integration) => (
                    <div key={integration.name} className="flex justify-between items-center p-2 border rounded">
                      <span className="text-sm">{integration.name}</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(integration.status)}
                        <Badge className={getStatusColor(integration.status)}>{integration.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
