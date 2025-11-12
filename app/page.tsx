"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Activity, 
  Users, 
  FileText, 
  Zap, 
  Globe, 
  Database,
  Settings,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

interface PlatformStats {
  environment: string
  features: Record<string, boolean>
  services: {
    eventOrchestrator: {
      handlerCount: number
      queueLength: number
    }
    ragEngine: {
      documentCount: number
      verifiedDocuments: number
    }
    apiBroker: {
      totalProviders: number
      activeProviders: number
      averageAccessibilityScore: number
    }
    pinkFlow: {
      totalTransformations: number
      averageProcessingTime: number
    }
    workers: {
      totalJobs: number
      activeWorkers: number
    }
  }
}

export default function HomePage() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlatformStats()
  }, [])

  const fetchPlatformStats = async () => {
    try {
      const response = await fetch('/api/platform')
      const result = await response.json()
      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch platform stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">PS</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  PinkSync
                </h1>
                <p className="text-sm text-gray-600">Accessibility Orchestration Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {stats && (
                <Badge variant="outline" className="px-4 py-2">
                  <Activity className="w-4 h-4 mr-2" />
                  {stats.environment}
                </Badge>
              )}
              <Link href="/pinksync">
                <Button>Launch Demo</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            One Layer of Accessibility
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            A comprehensive accessibility orchestration platform designed for deaf users. 
            PinkSync listens, transforms, connects, and learns to provide seamless access to digital services.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/pinksync">
              <Button size="lg" className="bg-gradient-to-r from-pink-600 to-purple-600">
                Try Demo
              </Button>
            </Link>
            <Link href="/docs/architecture.md">
              <Button size="lg" variant="outline">
                Documentation
              </Button>
            </Link>
          </div>
        </div>

        {/* Platform Stats */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading platform status...</p>
          </div>
        ) : stats ? (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Service Providers</CardTitle>
                  <Globe className="h-4 w-4 text-pink-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.services.apiBroker.activeProviders}</div>
                  <p className="text-xs text-gray-600">
                    {stats.services.apiBroker.totalProviders} total providers
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Research Documents</CardTitle>
                  <FileText className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.services.ragEngine.documentCount}</div>
                  <p className="text-xs text-gray-600">
                    {stats.services.ragEngine.verifiedDocuments} verified
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Transformations</CardTitle>
                  <Zap className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.services.pinkFlow.totalTransformations}</div>
                  <p className="text-xs text-gray-600">
                    ~{Math.round(stats.services.pinkFlow.averageProcessingTime)}ms avg
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Background Jobs</CardTitle>
                  <Activity className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.services.workers.totalJobs}</div>
                  <p className="text-xs text-gray-600">
                    {stats.services.workers.activeWorkers} active workers
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Features Grid */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6">Platform Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-white">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-pink-600" />
                      DeafAuth
                    </CardTitle>
                    <CardDescription>Visual-first authentication</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      No audio CAPTCHAs. Pattern-based and image selection verification designed for deaf users.
                    </p>
                    <Badge className="mt-2" variant={stats.features.deafAuth ? "default" : "secondary"}>
                      {stats.features.deafAuth ? "Active" : "Inactive"}
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-purple-600" />
                      PinkFlow Engine
                    </CardTitle>
                    <CardDescription>Content transformation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Real-time content simplification, visualization, and accessibility enhancements.
                    </p>
                    <Badge className="mt-2" variant={stats.features.pinkFlow ? "default" : "secondary"}>
                      {stats.features.pinkFlow ? "Active" : "Inactive"}
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Database className="w-5 h-5 mr-2 text-blue-600" />
                      RAG Research Center
                    </CardTitle>
                    <CardDescription>Knowledge base & learning</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Vector database of research connected to deaf community voices and feedback.
                    </p>
                    <Badge className="mt-2" variant={stats.features.ragEngine ? "default" : "secondary"}>
                      {stats.features.ragEngine ? "Active" : "Inactive"}
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-green-600" />
                      API Broker
                    </CardTitle>
                    <CardDescription>Service provider gateway</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Unified gateway connecting users with vocational, educational, and community services.
                    </p>
                    <Badge className="mt-2" variant={stats.features.apiBroker ? "default" : "secondary"}>
                      {stats.features.apiBroker ? "Active" : "Inactive"}
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-orange-600" />
                      Event Orchestrator
                    </CardTitle>
                    <CardDescription>Real-time event system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Node-based event listener architecture for processing user interactions and signals.
                    </p>
                    <Badge className="mt-2" variant={stats.features.eventOrchestrator ? "default" : "secondary"}>
                      {stats.features.eventOrchestrator ? "Active" : "Inactive"}
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-indigo-600" />
                      Background Workers
                    </CardTitle>
                    <CardDescription>Async job processing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      AI-powered automation for content processing, matching, and notifications.
                    </p>
                    <Badge className="mt-2" variant={stats.features.backgroundWorkers ? "default" : "secondary"}>
                      {stats.features.backgroundWorkers ? "Active" : "Inactive"}
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Accessibility Score */}
            <Card className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 border-none">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <TrendingUp className="w-6 h-6 mr-2" />
                  Average Accessibility Score
                </CardTitle>
                <CardDescription>Across all service providers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  {stats.services.apiBroker.averageAccessibilityScore.toFixed(1)}%
                </div>
                <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-600 to-purple-600 transition-all"
                    style={{ width: `${stats.services.apiBroker.averageAccessibilityScore}%` }}
                  />
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  PinkSync continuously evaluates and scores service providers based on their accessibility features and deaf-user friendliness.
                </p>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Unable to load platform statistics</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-pink-600 to-purple-600 border-none text-white">
            <CardHeader>
              <CardTitle className="text-3xl">Ready to Experience PinkSync?</CardTitle>
              <CardDescription className="text-pink-100">
                Try our demo to see how PinkSync transforms accessibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center space-x-4">
                <Link href="/pinksync">
                  <Button size="lg" variant="secondary">
                    Launch Demo
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2025 PinkSync. Built for and with the deaf community.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/docs/architecture.md" className="text-sm text-gray-600 hover:text-pink-600">
                Architecture
              </Link>
              <Link href="/docs/api.md" className="text-sm text-gray-600 hover:text-pink-600">
                API Docs
              </Link>
              <Link href="/docs/deployment.md" className="text-sm text-gray-600 hover:text-pink-600">
                Deployment
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
