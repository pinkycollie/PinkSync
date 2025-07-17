"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Zap,
  Shield,
  Palette,
  BarChart3,
  Users,
  Building,
  CheckCircle2,
  Clock,
  Calendar,
  TrendingUp,
  Star,
  ArrowRight,
  Sparkles,
  MapPin,
} from "lucide-react"
import { systemUpdates2025 } from "@/lib/updates/system-updates-2025"

export function ComprehensiveUpdatesDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedUpdate, setSelectedUpdate] = useState<string | null>(null)

  const filteredUpdates =
    selectedCategory === "all"
      ? systemUpdates2025
      : systemUpdates2025.filter((update) => update.category === selectedCategory)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "planned":
        return <Calendar className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200"
      case "in-progress":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "planned":
        return "bg-blue-50 text-blue-700 border-blue-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "technical":
        return <Zap className="h-4 w-4" />
      case "ux":
        return <Palette className="h-4 w-4" />
      case "analytics":
        return <BarChart3 className="h-4 w-4" />
      case "community":
        return <Users className="h-4 w-4" />
      case "government":
        return <Building className="h-4 w-4" />
      default:
        return <Sparkles className="h-4 w-4" />
    }
  }

  const categoryStats = {
    technical: systemUpdates2025.filter((u) => u.category === "technical"),
    ux: systemUpdates2025.filter((u) => u.category === "ux"),
    analytics: systemUpdates2025.filter((u) => u.category === "analytics"),
    community: systemUpdates2025.filter((u) => u.category === "community"),
    government: systemUpdates2025.filter((u) => u.category === "government"),
  }

  const completedUpdates = systemUpdates2025.filter((u) => u.status === "completed").length
  const totalUpdates = systemUpdates2025.length
  const completionRate = (completedUpdates / totalUpdates) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold">🚀 System Updates 2025</h2>
        <p className="text-muted-foreground mt-2">Comprehensive improvements across all platform areas</p>
      </div>

      {/* Overall Progress */}
      <Card className="border-2 border-pink-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-pink-500" />
            Overall Progress
          </CardTitle>
          <CardDescription>
            {completedUpdates} of {totalUpdates} major updates completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-pink-600">{completionRate.toFixed(1)}%</span>
              <Badge className="bg-pink-100 text-pink-700">{completedUpdates} Completed</Badge>
            </div>
            <Progress value={completionRate} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="ux">User Experience</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="government">Government</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Category Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {Object.entries(categoryStats).map(([category, updates]) => {
              const completed = updates.filter((u) => u.status === "completed").length
              const completionRate = (completed / updates.length) * 100

              return (
                <Card key={category} className="cursor-pointer hover:border-pink-300 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      {getCategoryIcon(category)}
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">
                        {completed}/{updates.length}
                      </div>
                      <Progress value={completionRate} className="h-2" />
                      <div className="text-xs text-muted-foreground">{completionRate.toFixed(0)}% Complete</div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Recent Updates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-pink-500" />
                Recent Major Updates
              </CardTitle>
              <CardDescription>Latest completed improvements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemUpdates2025
                  .filter((update) => update.status === "completed")
                  .slice(0, 5)
                  .map((update) => (
                    <div key={update.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        {getCategoryIcon(update.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{update.title}</h4>
                          <Badge variant="outline" className={getStatusColor(update.status)}>
                            {getStatusIcon(update.status)}
                            {update.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{update.description}</p>
                        {update.metrics && (
                          <div className="flex gap-4 text-xs">
                            {update.metrics.performanceImprovement && (
                              <span className="text-green-600">⚡ {update.metrics.performanceImprovement}</span>
                            )}
                            {update.metrics.userSatisfaction && (
                              <span className="text-blue-600">👥 {update.metrics.userSatisfaction}</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{update.releaseDate}</div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <Alert className="border-blue-200 bg-blue-50">
            <Zap className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>🔧 Technical Improvements:</strong> Major performance optimizations, new API integrations,
              enhanced security, and mobile app development completed or in progress.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {categoryStats.technical.map((update) => (
              <Card key={update.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-500" />
                      {update.title}
                    </CardTitle>
                    <Badge variant="outline" className={getStatusColor(update.status)}>
                      {getStatusIcon(update.status)}
                      {update.status}
                    </Badge>
                  </div>
                  <CardDescription>{update.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Key Features:</h4>
                      <ul className="space-y-1">
                        {update.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {update.metrics && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-medium mb-2">Impact Metrics:</h4>
                        <div className="grid gap-2 md:grid-cols-3">
                          {update.metrics.performanceImprovement && (
                            <div className="text-sm">
                              <span className="font-medium text-green-600">Performance:</span>
                              <br />
                              {update.metrics.performanceImprovement}
                            </div>
                          )}
                          {update.metrics.userSatisfaction && (
                            <div className="text-sm">
                              <span className="font-medium text-blue-600">Satisfaction:</span>
                              <br />
                              {update.metrics.userSatisfaction}
                            </div>
                          )}
                          {update.metrics.adoptionRate && (
                            <div className="text-sm">
                              <span className="font-medium text-purple-600">Adoption:</span>
                              <br />
                              {update.metrics.adoptionRate}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Released: {update.releaseDate}</span>
                      <Badge variant={update.impact === "high" ? "default" : "outline"}>{update.impact} impact</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ux" className="space-y-4">
          <Alert className="border-purple-200 bg-purple-50">
            <Palette className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-purple-800">
              <strong>🎨 User Experience Enhancements:</strong> Revolutionary ASL-first interface, advanced
              accessibility features, intelligent workflows, and visual design improvements.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {categoryStats.ux.map((update) => (
              <Card key={update.id} className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-purple-500" />
                      {update.title}
                    </CardTitle>
                    <Badge variant="outline" className={getStatusColor(update.status)}>
                      {getStatusIcon(update.status)}
                      {update.status}
                    </Badge>
                  </div>
                  <CardDescription>{update.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Accessibility Features:</h4>
                      <ul className="space-y-1">
                        {update.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {update.metrics && (
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <h4 className="font-medium mb-2">User Feedback:</h4>
                        <div className="grid gap-2 md:grid-cols-2">
                          {update.metrics.userSatisfaction && (
                            <div className="text-sm">
                              <span className="font-medium text-purple-600">Satisfaction:</span>
                              <br />
                              {update.metrics.userSatisfaction}
                            </div>
                          )}
                          {update.metrics.adoptionRate && (
                            <div className="text-sm">
                              <span className="font-medium text-purple-600">Adoption:</span>
                              <br />
                              {update.metrics.adoptionRate}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Alert className="border-green-200 bg-green-50">
            <BarChart3 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>📊 Data & Analytics:</strong> Real-time dashboard improvements, new metrics and insights, enhanced
              reporting features, and predictive analytics capabilities.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {categoryStats.analytics.map((update) => (
              <Card key={update.id} className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-green-500" />
                      {update.title}
                    </CardTitle>
                    <Badge variant="outline" className={getStatusColor(update.status)}>
                      {getStatusIcon(update.status)}
                      {update.status}
                    </Badge>
                  </div>
                  <CardDescription>{update.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Analytics Features:</h4>
                      <ul className="space-y-1">
                        {update.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {update.metrics && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <h4 className="font-medium mb-2">Usage Statistics:</h4>
                        <div className="grid gap-2 md:grid-cols-2">
                          {update.metrics.adoptionRate && (
                            <div className="text-sm">
                              <span className="font-medium text-green-600">Weekly Usage:</span>
                              <br />
                              {update.metrics.adoptionRate}
                            </div>
                          )}
                          {update.metrics.userSatisfaction && (
                            <div className="text-sm">
                              <span className="font-medium text-green-600">Value Rating:</span>
                              <br />
                              {update.metrics.userSatisfaction}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          <Alert className="border-orange-200 bg-orange-50">
            <Users className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>🤝 Community Features:</strong> Enhanced collaboration tools, democratic voting systems, peer
              support networks, and cultural preservation initiatives.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {categoryStats.community.map((update) => (
              <Card key={update.id} className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-orange-500" />
                      {update.title}
                    </CardTitle>
                    <Badge variant="outline" className={getStatusColor(update.status)}>
                      {getStatusIcon(update.status)}
                      {update.status}
                    </Badge>
                  </div>
                  <CardDescription>{update.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Community Tools:</h4>
                      <ul className="space-y-1">
                        {update.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {update.metrics && (
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <h4 className="font-medium mb-2">Community Engagement:</h4>
                        <div className="grid gap-2 md:grid-cols-2">
                          {update.metrics.adoptionRate && (
                            <div className="text-sm">
                              <span className="font-medium text-orange-600">Participation:</span>
                              <br />
                              {update.metrics.adoptionRate}
                            </div>
                          )}
                          {update.metrics.userSatisfaction && (
                            <div className="text-sm">
                              <span className="font-medium text-orange-600">Trust Level:</span>
                              <br />
                              {update.metrics.userSatisfaction}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="government" className="space-y-4">
          <Alert className="border-red-200 bg-red-50">
            <Building className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>🏛️ Government Integration:</strong> Multi-level government connections, streamlined processes, new
              benefit programs, and policy advocacy tools for systemic change.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {categoryStats.government.map((update) => (
              <Card key={update.id} className="border-l-4 border-l-red-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-red-500" />
                      {update.title}
                    </CardTitle>
                    <Badge variant="outline" className={getStatusColor(update.status)}>
                      {getStatusIcon(update.status)}
                      {update.status}
                    </Badge>
                  </div>
                  <CardDescription>{update.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Government Integrations:</h4>
                      <ul className="space-y-1">
                        {update.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Governance Structure Explanation */}
      <Card className="border-2 border-pink-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-pink-500" />
            Democratic Governance Structure
          </CardTitle>
          <CardDescription>How we work with residents, cities, states, and federal agencies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 mx-auto mb-2">
                  <Users className="h-6 w-6 text-pink-600" />
                </div>
                <h4 className="font-medium">Deaf Community</h4>
                <p className="text-sm text-muted-foreground">70% Voting Power</p>
                <Badge className="mt-1">Primary Control</Badge>
              </div>

              <div className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mx-auto mb-2">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-medium">City Officials</h4>
                <p className="text-sm text-muted-foreground">15% Voting Power</p>
                <Badge variant="outline" className="mt-1">
                  Local Services
                </Badge>
              </div>

              <div className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mx-auto mb-2">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-medium">State Officials</h4>
                <p className="text-sm text-muted-foreground">10% Voting Power</p>
                <Badge variant="outline" className="mt-1">
                  Regional Coordination
                </Badge>
              </div>

              <div className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 mx-auto mb-2">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-medium">Federal Officials</h4>
                <p className="text-sm text-muted-foreground">5% Voting Power</p>
                <Badge variant="outline" className="mt-1">
                  National Standards
                </Badge>
              </div>
            </div>

            <Alert>
              <ArrowRight className="h-4 w-4" />
              <AlertDescription>
                <strong>No Traditional Admin:</strong> Instead of centralized control, we use democratic governance
                where the deaf community maintains majority control while collaborating with government at all levels.
                Technical operations are managed by deaf-owned businesses under community oversight.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
