"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, CheckCircle, XCircle, Clock, DollarSign, FileText, Car, Mail, AlertTriangle } from "lucide-react"

interface SyncStatus {
  service: string
  status: "synced" | "syncing" | "error" | "pending"
  lastSync?: string
  nextSync?: string
  data?: any
  error?: string
}

export default function GovernmentSyncDashboard() {
  const [syncStatuses, setSyncStatuses] = useState<SyncStatus[]>([
    { service: "irs", status: "pending" },
    { service: "ssa", status: "pending" },
    { service: "dmv", status: "pending" },
    { service: "usps", status: "pending" },
  ])
  const [isGlobalSync, setIsGlobalSync] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)

  const serviceConfig = {
    irs: {
      name: "IRS Tax Services",
      icon: DollarSign,
      description: "Tax information, disability credits, medical deductions",
      color: "bg-green-500",
    },
    ssa: {
      name: "Social Security Administration",
      icon: FileText,
      description: "Disability benefits, work credits, benefit status",
      color: "bg-blue-500",
    },
    dmv: {
      name: "Department of Motor Vehicles",
      icon: Car,
      description: "License information, accommodations, renewals",
      color: "bg-purple-500",
    },
    usps: {
      name: "US Postal Service",
      icon: Mail,
      description: "Address validation, change of address, package tracking",
      color: "bg-orange-500",
    },
  }

  const syncService = async (service: string) => {
    setSyncStatuses((prev) => prev.map((s) => (s.service === service ? { ...s, status: "syncing" } : s)))

    try {
      const response = await fetch("/api/government/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          services: [service],
          userId: "current-user-id", // Would come from auth context
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSyncStatuses((prev) =>
          prev.map((s) =>
            s.service === service
              ? {
                  ...s,
                  status: "synced",
                  lastSync: new Date().toISOString(),
                  data: result.results[service],
                  error: undefined,
                }
              : s,
          ),
        )
      } else {
        throw new Error(result.error || "Sync failed")
      }
    } catch (error) {
      setSyncStatuses((prev) =>
        prev.map((s) =>
          s.service === service
            ? {
                ...s,
                status: "error",
                error: error.message,
              }
            : s,
        ),
      )
    }
  }

  const syncAllServices = async () => {
    setIsGlobalSync(true)
    setSyncProgress(0)

    const services = ["irs", "ssa", "dmv", "usps"]

    for (let i = 0; i < services.length; i++) {
      await syncService(services[i])
      setSyncProgress(((i + 1) / services.length) * 100)
    }

    setIsGlobalSync(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "synced":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "syncing":
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      synced: "default",
      syncing: "secondary",
      error: "destructive",
      pending: "outline",
    }

    return <Badge variant={variants[status] as any}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Government Data Sync</h2>
          <p className="text-muted-foreground">
            Synchronize your information with government agencies for real-time updates
          </p>
        </div>
        <Button onClick={syncAllServices} disabled={isGlobalSync} className="min-w-[120px]">
          {isGlobalSync ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync All
            </>
          )}
        </Button>
      </div>

      {isGlobalSync && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Syncing government services...</span>
                <span>{Math.round(syncProgress)}%</span>
              </div>
              <Progress value={syncProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {syncStatuses.map((sync) => {
          const config = serviceConfig[sync.service]
          const Icon = config.icon

          return (
            <Card key={sync.service} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${config.color} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{config.name}</CardTitle>
                      <CardDescription className="text-sm">{config.description}</CardDescription>
                    </div>
                  </div>
                  {getStatusIcon(sync.status)}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  {getStatusBadge(sync.status)}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => syncService(sync.service)}
                    disabled={sync.status === "syncing"}
                  >
                    {sync.status === "syncing" ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Sync Now"}
                  </Button>
                </div>

                {sync.lastSync && (
                  <div className="text-sm text-muted-foreground">
                    Last synced: {new Date(sync.lastSync).toLocaleString()}
                  </div>
                )}

                {sync.error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{sync.error}</AlertDescription>
                  </Alert>
                )}

                {sync.data && sync.service === "irs" && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Tax Year:</span>
                      <span>{sync.data.taxpayerInfo?.taxYear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Disability Credits:</span>
                      <span>{sync.data.disabilityCredits?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medical Deductions:</span>
                      <span>${sync.data.medicalDeductions?.reduce((sum, d) => sum + d.amount, 0) || 0}</span>
                    </div>
                  </div>
                )}

                {sync.data && sync.service === "ssa" && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Benefit Type:</span>
                      <span>{sync.data.benefits?.benefitType || "None"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Benefit:</span>
                      <span>${sync.data.benefits?.monthlyBenefit || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Work Credits:</span>
                      <span>{sync.data.workCredits?.total_credits || 0}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Government data synchronization requires proper authentication and may take several minutes to complete. All
          data is encrypted and stored securely in compliance with federal privacy regulations.
        </AlertDescription>
      </Alert>
    </div>
  )
}
