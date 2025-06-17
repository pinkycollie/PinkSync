"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Video, FileText, Eye, Accessibility, Camera, CheckCircle, Clock, Gavel, Star } from "lucide-react"
import { VCodeRecorder } from "./vcode-recorder"
import { VCodeLibrary } from "./vcode-library"
import { VCodeAnalytics } from "./vcode-analytics"
import { LegalCompliance } from "./legal-compliance"

interface VCodeStats {
  totalSessions: number
  activeRecordings: number
  completedVCodes: number
  legalCompliance: number
  aslAccuracy: number
  courtReadyEvidence: number
}

export function VCodeDashboard() {
  const [stats, setStats] = useState<VCodeStats>({
    totalSessions: 0,
    activeRecordings: 0,
    completedVCodes: 0,
    legalCompliance: 0,
    aslAccuracy: 0,
    courtReadyEvidence: 0,
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        totalSessions: 47,
        activeRecordings: 3,
        completedVCodes: 44,
        legalCompliance: 98.5,
        aslAccuracy: 94.2,
        courtReadyEvidence: 42,
      })
      setIsLoading(false)
    }, 1500)
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="w-12 h-12 text-purple-600" />
          <h1 className="text-4xl font-bold text-gray-900">VCode Platform</h1>
        </div>
        <p className="text-xl text-gray-600 mb-6">
          Visual Contract Evidence with Full Accessibility & Legal Compliance
        </p>

        {/* Accessibility Badges */}
        <div className="flex justify-center gap-3 mb-6">
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
            <Accessibility className="w-4 h-4" />
            WCAG AAA Compliant
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
            <Eye className="w-4 h-4" />
            ASL Native
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
            <Gavel className="w-4 h-4" />
            Court Admissible
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
            <Shield className="w-4 h-4" />
            Blockchain Secured
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Video className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Total Sessions</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{isLoading ? "..." : stats.totalSessions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-600">Active</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{isLoading ? "..." : stats.activeRecordings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Completed</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{isLoading ? "..." : stats.completedVCodes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Gavel className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Legal Score</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{isLoading ? "..." : `${stats.legalCompliance}%`}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium text-gray-600">ASL Accuracy</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{isLoading ? "..." : `${stats.aslAccuracy}%`}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-gray-600">Court Ready</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{isLoading ? "..." : stats.courtReadyEvidence}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="recorder" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recorder" className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Record VCode
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            VCode Library
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="legal" className="flex items-center gap-2">
            <Gavel className="w-4 h-4" />
            Legal Compliance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recorder">
          <VCodeRecorder />
        </TabsContent>

        <TabsContent value="library">
          <VCodeLibrary />
        </TabsContent>

        <TabsContent value="analytics">
          <VCodeAnalytics />
        </TabsContent>

        <TabsContent value="legal">
          <LegalCompliance />
        </TabsContent>
      </Tabs>
    </div>
  )
}
