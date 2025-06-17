"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Video,
  Users,
  Shield,
  Brain,
  FileText,
  Database,
  Cloud,
  Accessibility,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

export default function PinksyncExplainerDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeAnalyses: 0,
    videosGenerated: 0,
    emergencyProfiles: 0,
    governmentConnections: 0,
    accessibilityProfiles: 0,
  })

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: "video_generated",
      title: "ADA Workplace Rights Explainer",
      user: "Sarah M.",
      timestamp: "2 minutes ago",
      status: "completed",
    },
    {
      id: 2,
      type: "analysis_completed",
      title: "Benefits Coordination Analysis",
      user: "Marcus J.",
      timestamp: "5 minutes ago",
      status: "completed",
    },
    {
      id: 3,
      type: "emergency_profile_updated",
      title: "Emergency Contact Verification",
      user: "Elena R.",
      timestamp: "12 minutes ago",
      status: "pending",
    },
  ])

  useEffect(() => {
    // Simulate loading stats from database
    setStats({
      totalUsers: 1247,
      activeAnalyses: 23,
      videosGenerated: 89,
      emergencyProfiles: 456,
      governmentConnections: 234,
      accessibilityProfiles: 1247,
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pinksync AI Explainer System</h1>
            <p className="text-lg text-gray-600">
              AI-powered content creation for the deaf and hard-of-hearing community
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-pink-600">
              <Shield className="h-4 w-4 mr-1" />
              Pinksync Active
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Analyses</p>
                  <p className="text-2xl font-bold">{stats.activeAnalyses}</p>
                </div>
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Videos Generated</p>
                  <p className="text-2xl font-bold">{stats.videosGenerated}</p>
                </div>
                <Video className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Emergency Profiles</p>
                  <p className="text-2xl font-bold">{stats.emergencyProfiles}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Gov Connections</p>
                  <p className="text-2xl font-bold">{stats.governmentConnections}</p>
                </div>
                <Database className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Accessibility Profiles</p>
                  <p className="text-2xl font-bold">{stats.accessibilityProfiles}</p>
                </div>
                <Accessibility className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="explainer-videos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="explainer-videos">Explainer Videos</TabsTrigger>
            <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            <TabsTrigger value="government">Government Integration</TabsTrigger>
            <TabsTrigger value="emergency">Emergency Services</TabsTrigger>
          </TabsList>

          <TabsContent value="explainer-videos" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Video Generation Pipeline
                  </CardTitle>
                  <CardDescription>AI-powered explainer videos with accessibility features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Content Analysis</h4>
                        <p className="text-sm text-gray-600">AI simplification in progress</p>
                      </div>
                      <Badge variant="secondary">Processing</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">ASL Integration</h4>
                        <p className="text-sm text-gray-600">Sign language overlay ready</p>
                      </div>
                      <Badge variant="default">Ready</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Fal.ai Generation</h4>
                        <p className="text-sm text-gray-600">Video rendering queue</p>
                      </div>
                      <Badge variant="outline">Queue: 3</Badge>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Video className="h-4 w-4 mr-2" />
                    Create New Explainer Video
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Video Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0">
                          {activity.type === "video_generated" && <Video className="h-5 w-5 text-green-600" />}
                          {activity.type === "analysis_completed" && <Brain className="h-5 w-5 text-purple-600" />}
                          {activity.type === "emergency_profile_updated" && (
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{activity.title}</h4>
                          <p className="text-xs text-gray-600">
                            {activity.user} • {activity.timestamp}
                          </p>
                        </div>
                        <Badge variant={activity.status === "completed" ? "default" : "secondary"}>
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Blob Store Integration</CardTitle>
                <CardDescription>
                  Vercel Blob storage for video assets, ASL overlays, and accessibility resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Cloud className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold">Video Storage</h3>
                    <p className="text-sm text-gray-600">Generated explainer videos</p>
                    <p className="text-lg font-bold mt-2">2.3 GB</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h3 className="font-semibold">ASL Overlays</h3>
                    <p className="text-sm text-gray-600">Sign language video assets</p>
                    <p className="text-lg font-bold mt-2">1.8 GB</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Database className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <h3 className="font-semibold">Documents</h3>
                    <p className="text-sm text-gray-600">Government docs & resources</p>
                    <p className="text-lg font-bold mt-2">892 MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Analysis Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">156</p>
                      <p className="text-sm text-gray-600">Total Analyses</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">23</p>
                      <p className="text-sm text-gray-600">Pending</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Recent Analysis Types</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Benefits Coordination</span>
                        <Badge variant="secondary">34</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Tax Optimization</span>
                        <Badge variant="secondary">28</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Emergency Planning</span>
                        <Badge variant="secondary">19</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Simplification Engine</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Government Document Processing</span>
                        <span>94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Legal Text Simplification</span>
                        <span>87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Medical Information</span>
                        <span>91%</span>
                      </div>
                      <Progress value={91} className="h-2" />
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Brain className="h-4 w-4 mr-2" />
                    Start New Analysis
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Accessibility className="h-5 w-5" />
                    Accessibility Preferences Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Captions Enabled</span>
                      <div className="flex items-center gap-2">
                        <Progress value={95} className="w-20 h-2" />
                        <span className="text-sm font-medium">95%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">High Contrast</span>
                      <div className="flex items-center gap-2">
                        <Progress value={78} className="w-20 h-2" />
                        <span className="text-sm font-medium">78%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sign Language Overlay</span>
                      <div className="flex items-center gap-2">
                        <Progress value={67} className="w-20 h-2" />
                        <span className="text-sm font-medium">67%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Visual Notifications</span>
                      <div className="flex items-center gap-2">
                        <Progress value={89} className="w-20 h-2" />
                        <span className="text-sm font-medium">89%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Emergency Video Relay</span>
                      <div className="flex items-center gap-2">
                        <Progress value={45} className="w-20 h-2" />
                        <span className="text-sm font-medium">45%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Deaf Identity Verification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">892</p>
                      <p className="text-sm text-gray-600">Verified Profiles</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">45</p>
                      <p className="text-sm text-gray-600">Pending Verification</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Communication Methods</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>ASL (American Sign Language)</span>
                        <span className="font-medium">67%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Written Communication</span>
                        <span className="font-medium">89%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lip Reading</span>
                        <span className="font-medium">34%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Voice + Hearing Aids</span>
                        <span className="font-medium">23%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="government" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Government Account Connections
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Social Security Administration</h4>
                        <p className="text-sm text-gray-600">156 connected accounts</p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Department of Labor</h4>
                        <p className="text-sm text-gray-600">89 connected accounts</p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">IRS</h4>
                        <p className="text-sm text-gray-600">67 connected accounts</p>
                      </div>
                      <Badge variant="secondary">Limited</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Document Processing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">1,234</p>
                      <p className="text-sm text-gray-600">Documents Processed</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">98.7%</p>
                      <p className="text-sm text-gray-600">Success Rate</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Document Types</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Benefits Applications</span>
                        <span className="font-medium">456</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax Documents</span>
                        <span className="font-medium">234</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Medical Records</span>
                        <span className="font-medium">189</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Employment Records</span>
                        <span className="font-medium">355</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="emergency" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Emergency Response System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">12</p>
                      <p className="text-sm text-gray-600">Active Incidents</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">4.2 min</p>
                      <p className="text-sm text-gray-600">Avg Response Time</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Emergency Features</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Video Relay Service Integration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>ASL Interpreter Auto-Request</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Visual Emergency Alerts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Medical Information Sharing</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contacts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Verified Emergency Contacts</span>
                      <span className="font-medium">1,156</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">24/7 Available Contacts</span>
                      <span className="font-medium">789</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">ASL-Capable Contacts</span>
                      <span className="font-medium">567</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Contact Verification Status</h4>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Verification Rate</span>
                        <span>94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
