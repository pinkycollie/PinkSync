"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, ExternalLink } from "lucide-react"

interface SetupStatus {
  dns: { resolved: boolean; records: any[] }
  ssl: { active: boolean; status: string }
  cdn: { active: boolean; provider: string }
}

export default function VideoPortalSetupDashboard() {
  const [status, setStatus] = useState<SetupStatus | null>(null)
  const [loading, setLoading] = useState(false)

  const checkStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/video-portal/setup")
      const data = await response.json()
      setStatus(data.checks)
    } catch (error) {
      console.error("Failed to check status:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  const getStatusBadge = (isActive: boolean) => {
    return <Badge variant={isActive ? "default" : "destructive"}>{isActive ? "Active" : "Inactive"}</Badge>
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">DeafLife Video Portal Setup</h1>
        <Button onClick={checkStatus} disabled={loading}>
          {loading ? <Clock className="h-4 w-4 mr-2 animate-spin" /> : null}
          {loading ? "Checking..." : "Refresh Status"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* DNS Configuration */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DNS Configuration</CardTitle>
            {status && getStatusIcon(status.dns.resolved)}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Domain Resolution</span>
                {status && getStatusBadge(status.dns.resolved)}
              </div>
              <p className="text-xs text-muted-foreground">deaflife.pinksync.io → Hosting Provider</p>
              {status?.dns.records.length > 0 && (
                <div className="text-xs">
                  <p className="font-medium">DNS Records:</p>
                  {status.dns.records.map((record: any, index: number) => (
                    <p key={index} className="text-muted-foreground">
                      {record.type}: {record.data}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* SSL Certificate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SSL Certificate</CardTitle>
            {status && getStatusIcon(status.ssl.active)}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">HTTPS Status</span>
                {status && getStatusBadge(status.ssl.active)}
              </div>
              <p className="text-xs text-muted-foreground">Secure connection enabled</p>
              {status && <p className="text-xs">Status: {status.ssl.status}</p>}
            </div>
          </CardContent>
        </Card>

        {/* CDN Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CDN & Caching</CardTitle>
            {status && getStatusIcon(status.cdn.active)}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">CDN Active</span>
                {status && getStatusBadge(status.cdn.active)}
              </div>
              <p className="text-xs text-muted-foreground">Global content delivery</p>
              {status?.cdn.provider && <p className="text-xs">Provider: {status.cdn.provider}</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">1. DNS Configuration</h3>
            <p className="text-sm text-muted-foreground">Add these DNS records to your pinksync.io domain:</p>
            <div className="bg-muted p-3 rounded-md text-sm font-mono">
              <p>Type: CNAME</p>
              <p>Name: deaflife</p>
              <p>Value: cname.vercel-dns.com</p>
              <p>TTL: 300</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">2. Vercel Domain Setup</h3>
            <p className="text-sm text-muted-foreground">Add the custom domain in your Vercel project settings:</p>
            <div className="bg-muted p-3 rounded-md text-sm">
              <p>1. Go to Project Settings → Domains</p>
              <p>2. Add "deaflife.pinksync.io"</p>
              <p>3. Verify DNS configuration</p>
              <p>4. Wait for SSL certificate provisioning</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">3. Video Storage Setup</h3>
            <p className="text-sm text-muted-foreground">Configure video hosting and delivery:</p>
            <div className="bg-muted p-3 rounded-md text-sm">
              <p>• Enable Vercel Blob for video storage</p>
              <p>• Configure video transcoding</p>
              <p>• Set up automatic captions</p>
              <p>• Enable adaptive streaming</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button asChild>
              <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Vercel Dashboard
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://deaflife.pinksync.io" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Test Domain
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
