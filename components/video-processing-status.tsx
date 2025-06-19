"use client"

import { useState, useEffect } from "react"
import { Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getVideoStatus, getVideoProcessingProgress } from "@/app/actions/video-actions"

interface VideoProcessingStatusProps {
  videoId: string
  initialStatus?: string
}

export function VideoProcessingStatus({ videoId, initialStatus }: VideoProcessingStatusProps) {
  const [status, setStatus] = useState(initialStatus || "uploading")
  const [progress, setProgress] = useState(0)
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const result = await getVideoStatus(videoId)

        if (result.error) {
          setError(result.error)
          return
        }

        if (result.status) {
          setStatus(result.status as string)
        }
      } catch (error) {
        console.error("Error fetching video status:", error)
        setError("Failed to fetch video status")
      }
    }

    const fetchProgress = async () => {
      try {
        const result = await getVideoProcessingProgress(videoId)

        if (result.error) {
          setError(result.error)
          return
        }

        if (result.status) {
          setStatus(result.status as string)
        }

        if (result.progress !== undefined) {
          setProgress(result.progress)
        }

        if (result.jobs) {
          setJobs(result.jobs)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching video progress:", error)
        setError("Failed to fetch video progress")
        setLoading(false)
      }
    }

    // Initial fetch
    fetchStatus()
    fetchProgress()

    // Set up polling for status updates
    const statusInterval = setInterval(fetchStatus, 5000)
    const progressInterval = setInterval(fetchProgress, 10000)

    return () => {
      clearInterval(statusInterval)
      clearInterval(progressInterval)
    }
  }, [videoId])

  const getStatusIcon = () => {
    switch (status) {
      case "ready":
      case "published":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "processing":
      case "uploading":
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "error":
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "uploading":
        return "Uploading video..."
      case "processing":
        return "Processing video..."
      case "ready":
        return "Video ready for validation"
      case "published":
        return "Video published"
      case "rejected":
        return "Video rejected"
      case "error":
        return "Error processing video"
      default:
        return "Unknown status"
    }
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Video Processing Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{getStatusText()}</span>
          <span className="text-sm text-muted-foreground">{progress}%</span>
        </div>

        <Progress value={progress} className="h-2" />

        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Loading processing details...</span>
          </div>
        ) : (
          <div className="space-y-2">
            {jobs.map((job, index) => (
              <div key={index} className="flex items-center justify-between rounded-md border p-2 text-sm">
                <div className="flex items-center gap-2">
                  {job.status === "completed" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : job.status === "processing" ? (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-amber-500" />
                  )}
                  <span>{job.type}</span>
                </div>
                <span className="text-xs text-muted-foreground capitalize">{job.status}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
