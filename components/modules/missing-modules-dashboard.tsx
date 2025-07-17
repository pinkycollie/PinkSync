"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  Clock,
  Database,
  Shield,
  Users,
  Building,
  Heart,
  GraduationCap,
  Phone,
  Globe,
  Briefcase,
  BarChart3,
} from "lucide-react"

interface ModuleStatus {
  category: string
  existing: number
  missing: number
  priority: "critical" | "high" | "medium" | "low"
  implementation: string
  icon: any
}

export function MissingModulesDashboard() {
  const [moduleStatus, setModuleStatus] = useState<ModuleStatus[]>([])
  const [overallProgress, setOverallProgress] = useState(0)

  useEffect(() => {
    // Simulate loading module status
    const status: ModuleStatus[] = [
      {
        category: "Core Identity & Auth",
        existing: 2,
        missing: 6,
        priority: "critical",
        implementation: "immediate",
        icon: Shield,
      },
      {
        category: "Government Integration",
        existing: 0,
        missing: 7,
        priority: "critical",
        implementation: "immediate",
        icon: Building,
      },
      {
        category: "Healthcare Management",
        existing: 0,
        missing: 7,
        priority: "critical",
        implementation: "phase_1",
        icon: Heart,
      },
      {
        category: "Financial Services",
        existing: 0,
        missing: 7,
        priority: "high",
        implementation: "phase_1",
        icon: Database,
      },
      {
        category: "Family Management",
        existing: 0,
        missing: 7,
        priority: "high",
        implementation: "phase_1",
        icon: Users,
      },
      {
        category: "Education Services",
        existing: 0,
        missing: 6,
        priority: "high",
        implementation: "phase_1",
        icon: GraduationCap,
      },
      {
        category: "Emergency Services",
        existing: 0,
        missing: 6,
        priority: "critical",
        implementation: "immediate",
        icon: Phone,
      },
      {
        category: "Community Features",
        existing: 0,
        missing: 7,
        priority: "medium",
        implementation: "phase_2",
        icon: Users,
      },
      {
        category: "Immigration Support",
        existing: 0,
        missing: 6,
        priority: "medium",
        implementation: "phase_2",
        icon: Globe,
      },
      {
        category: "Employment & Career",
        existing: 0,
        missing: 6,
        priority: "medium",
        implementation: "phase_2",
        icon: Briefcase,
      },
      {
        category: "Data & Analytics",
        existing: 1,
        missing: 6,
        priority: "high",
        implementation: "phase_1",
        icon: BarChart3,
      },
      {
        category: "Security & Privacy",
        existing: 0,
        missing: 6,
        priority: "critical",
        implementation: "immediate",
        icon: Shield,
      },
    ]

    setModuleStatus(status)

    // Calculate overall progress
    const totalModules = status.reduce((sum, s) => sum + s.existing + s.missing, 0)
    const existingModules = status.reduce((sum, s) => sum + s.existing, 0)
    setOverallProgress((existingModules / totalModules) * 100)
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "destructive"
      case "high":
        return "default"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const getImplementationColor = (implementation: string) => {
    switch (implementation) {
      case "immediate":
        return "bg-red-100 text-red-800"
      case "phase_1":
        return "bg-yellow-100 text-yellow-800"
      case "phase_2":
        return "bg-blue-100 text-blue-800"
      case "future":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const criticalModules = moduleStatus.filter((m) => m.priority === "critical")
  const immediateModules = moduleStatus.filter((m) => m.implementation === "immediate")
  const totalMissing = moduleStatus.reduce((sum, m) => sum + m.missing, 0)

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress.toFixed(1)}%</div>
            <Progress value={overallProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {moduleStatus.reduce((sum, m) => sum + m.existing, 0)} of{" "}
              {moduleStatus.reduce((sum, m) => sum + m.existing + m.missing, 0)} modules
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Missing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
              <div className="text-2xl font-bold text-red-600">{criticalModules.length}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Categories need immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Immediate Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-orange-500" />
              <div className="text-2xl font-bold text-orange-600">{immediateModules.length}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Modules to implement now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Missing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Database className="mr-2 h-5 w-5 text-blue-500" />
              <div className="text-2xl font-bold text-blue-600">{totalMissing}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Modules to be built</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Module Status */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Modules</TabsTrigger>
          <TabsTrigger value="critical">Critical</TabsTrigger>
          <TabsTrigger value="immediate">Immediate</TabsTrigger>
          <TabsTrigger value="phase1">Phase 1</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {moduleStatus.map((module, index) => {
              const Icon = module.icon
              const completionRate = (module.existing / (module.existing + module.missing)) * 100

              return (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-5 w-5 text-pink-600" />
                        <CardTitle className="text-sm">{module.category}</CardTitle>
                      </div>
                      <Badge variant={getPriorityColor(module.priority)}>{module.priority}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{completionRate.toFixed(0)}%</span>
                      </div>
                      <Progress value={completionRate} />

                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{module.existing} existing</span>
                        <span>{module.missing} missing</span>
                      </div>

                      <div
                        className={`inline-block px-2 py-1 rounded text-xs ${getImplementationColor(module.implementation)}`}
                      >
                        {module.implementation.replace("_", " ")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {criticalModules.map((module, index) => {
              const Icon = module.icon
              return (
                <Card key={index} className="border-red-200">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-red-600" />
                      <CardTitle className="text-red-800">{module.category}</CardTitle>
                      <Badge variant="destructive">CRITICAL</Badge>
                    </div>
                    <CardDescription>
                      {module.missing} missing modules - {module.implementation} implementation required
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="destructive">
                      Start Implementation
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="immediate" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {immediateModules.map((module, index) => {
              const Icon = module.icon
              return (
                <Card key={index} className="border-orange-200">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-orange-600" />
                      <CardTitle className="text-orange-800">{module.category}</CardTitle>
                      <Badge variant="default">IMMEDIATE</Badge>
                    </div>
                    <CardDescription>{module.missing} modules need immediate implementation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Begin Development</Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="phase1" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {moduleStatus
              .filter((m) => m.implementation === "phase_1")
              .map((module, index) => {
                const Icon = module.icon
                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Icon className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-sm">{module.category}</CardTitle>
                      </div>
                      <CardDescription>{module.missing} modules for Phase 1</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" variant="outline">
                        Plan Development
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
