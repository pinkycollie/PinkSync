"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Clock, AlertCircle, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface Step {
  id: string
  title: string
  description: string
  status: "completed" | "in-progress" | "pending" | "error"
  progress?: number
}

interface ProgressTrackerProps {
  videoId: string
  initialSteps?: Step[]
}

export function ProgressTracker({ videoId, initialSteps }: ProgressTrackerProps) {
  const [steps, setSteps] = useState<Step[]>(initialSteps || [])
  const router = useRouter()

  useEffect(() => {
    if (!initialSteps) {
      // If no initial steps provided, create default steps
      setSteps([
        {
          id: "upload",
          title: "Upload",
          description: "Video file uploaded to the system",
          status: "completed",
          progress: 100,
        },
        {
          id: "processing",
          title: "Processing",
          description: "Video transcoding and optimization",
          status: "in-progress",
          progress: 65,
        },
        {
          id: "analysis",
          title: "Accessibility Analysis",
          description: "Analyzing video for accessibility features",
          status: "pending",
        },
        {
          id: "validation",
          title: "Human Validation",
          description: "Review by human validator",
          status: "pending",
        },
        {
          id: "publishing",
          title: "Publishing",
          description: "Preparing for distribution via CDN",
          status: "pending",
        },
      ])
    }

    // In a real implementation, you would fetch the current status from an API
    const fetchProgress = async () => {
      // Simulate API call
      // const response = await fetch(`/api/videos/${videoId}/progress`)
      // const data = await response.json()
      // setSteps(data.steps)
    }

    fetchProgress()

    // Set up polling for progress updates
    const interval = setInterval(fetchProgress, 10000)

    return () => clearInterval(interval)
  }, [videoId, initialSteps])

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getOverallProgress = () => {
    const totalSteps = steps.length
    const completedSteps = steps.filter((step) => step.status === "completed").length
    const inProgressStep = steps.find((step) => step.status === "in-progress")

    if (totalSteps === 0) return 0

    let progress = (completedSteps / totalSteps) * 100

    if (inProgressStep && inProgressStep.progress) {
      progress += (inProgressStep.progress / 100) * (1 / totalSteps) * 100
    }

    return Math.round(progress)
  }

  const getCurrentStepIndex = () => {
    const inProgressIndex = steps.findIndex((step) => step.status === "in-progress")

    if (inProgressIndex !== -1) {
      return inProgressIndex
    }

    const pendingIndex = steps.findIndex((step) => step.status === "pending")

    if (pendingIndex !== -1) {
      return pendingIndex - 1
    }

    return steps.length - 1
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Processing Progress</span>
          <span className="text-sm font-normal">{getOverallProgress()}%</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={getOverallProgress()} className="h-2" />

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStepIcon(step.status)}
                  <span className="font-medium">{step.title}</span>
                </div>
                <span className="text-xs text-muted-foreground capitalize">{step.status.replace("-", " ")}</span>
              </div>

              <p className="text-xs text-muted-foreground">{step.description}</p>

              {step.status === "in-progress" && step.progress !== undefined && (
                <Progress value={step.progress} className="h-1" />
              )}

              {index < steps.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>

        {getCurrentStepIndex() >= 3 && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push(`/dashboard/validator?video=${videoId}`)}
          >
            Go to Validation
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
