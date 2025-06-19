"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, Play, AlertCircle, Settings } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { SignLanguageResponse } from "@/lib/sign-language/sign-language-service"

interface SignLanguageVideoProps {
  text: string
  targetDialect?: "asl" | "bsl" | "auslan" | "lsf" | "lsm" | "jsl"
  avatarStyle?: "realistic" | "cartoon" | "minimal" | "human"
  quality?: "standard" | "high" | "premium"
  autoPlay?: boolean
  showPreferences?: boolean
  onReady?: (videoUrl: string) => void
  onError?: (error: string) => void
}

export function SignLanguageVideo({
  text,
  targetDialect,
  avatarStyle,
  quality,
  autoPlay = false,
  showPreferences = true,
  onReady,
  onError,
}: SignLanguageVideoProps) {
  const { data: session } = useSession()
  const [requestId, setRequestId] = useState<string | null>(null)
  const [status, setStatus] = useState<SignLanguageResponse["status"] | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [userPreferences, setUserPreferences] = useState<any>({})
  const [showPreferencesDialog, setShowPreferencesDialog] = useState(false)

  // Load user preferences on mount
  useEffect(() => {
    if (session?.user?.id) {
      loadUserPreferences()
    }
  }, [session?.user?.id])

  const loadUserPreferences = async () => {
    try {
      const response = await fetch(`/api/users/${session?.user?.id}/preferences`)
      if (response.ok) {
        const preferences = await response.json()
        setUserPreferences(preferences)
      }
    } catch (error) {
      console.warn("Could not load user preferences:", error)
    }
  }

  const saveUserPreferences = async (newPreferences: any) => {
    try {
      const response = await fetch(`/api/users/${session?.user?.id}/preferences`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPreferences),
      })

      if (response.ok) {
        setUserPreferences(newPreferences)
        setShowPreferencesDialog(false)
      }
    } catch (error) {
      console.error("Could not save user preferences:", error)
    }
  }

  // Get effective settings (props override user preferences)
  const effectiveSettings = {
    targetDialect: targetDialect || userPreferences.signLanguageDialect || "asl",
    avatarStyle: avatarStyle || userPreferences.avatarStyle || "realistic",
    quality: quality || userPreferences.quality || "standard",
  }

  // Submit a new sign language generation request
  const submitRequest = async () => {
    try {
      setStatus("pending")
      setProgress(10)
      setError(null)

      const response = await fetch("/api/sign-language", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          ...effectiveSettings,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit request")
      }

      const data = await response.json()
      setRequestId(data.requestId)
      setStatus(data.status)
      setProgress(20)

      // Start polling for status
      pollStatus(data.requestId)
    } catch (error) {
      console.error("Error submitting sign language request:", error)
      setError(error instanceof Error ? error.message : "Failed to submit request")
      setStatus("failed")

      if (onError) {
        onError(error instanceof Error ? error.message : "Failed to submit request")
      }
    }
  }

  // Poll for request status with exponential backoff
  const pollStatus = async (reqId: string, attempt = 1) => {
    try {
      const response = await fetch(`/api/sign-language/${reqId}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get status")
      }

      const data: SignLanguageResponse = await response.json()
      setStatus(data.status)

      // Update progress based on status
      if (data.status === "pending") {
        setProgress(30)
      } else if (data.status === "processing") {
        setProgress(60)
      } else if (data.status === "completed") {
        setProgress(100)
        setVideoUrl(data.videoUrl || null)
        setThumbnailUrl(data.thumbnailUrl || null)

        if (onReady && data.videoUrl) {
          onReady(data.videoUrl)
        }

        if (autoPlay && data.videoUrl) {
          setIsPlaying(true)
        }

        return // Stop polling
      } else if (data.status === "failed") {
        setError(data.error || "Failed to generate sign language video")

        if (onError) {
          onError(data.error || "Failed to generate sign language video")
        }

        return // Stop polling
      }

      // Continue polling with exponential backoff
      const delay = Math.min(2000 * Math.pow(1.5, attempt - 1), 10000) // Max 10 seconds
      setTimeout(() => pollStatus(reqId, attempt + 1), delay)
    } catch (error) {
      console.error("Error polling sign language status:", error)
      setError(error instanceof Error ? error.message : "Failed to get status")
      setStatus("failed")

      if (onError) {
        onError(error instanceof Error ? error.message : "Failed to get status")
      }
    }
  }

  // Start generation on mount if text is provided
  useEffect(() => {
    if (text && !requestId && !status) {
      submitRequest()
    }
  }, [text, requestId, status])

  // Handle play button click
  const handlePlay = () => {
    setIsPlaying(true)
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {status === "completed" && videoUrl ? (
          <div className="relative aspect-video bg-black">
            {!isPlaying && thumbnailUrl ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={thumbnailUrl || "/placeholder.svg"}
                  alt="Sign language video thumbnail"
                  className="w-full h-full object-contain"
                />
                <Button
                  onClick={handlePlay}
                  variant="secondary"
                  size="icon"
                  className="absolute rounded-full bg-black/50 hover:bg-black/70"
                >
                  <Play className="h-8 w-8" />
                </Button>
              </div>
            ) : (
              <video src={videoUrl} controls={true} autoPlay={isPlaying} className="w-full h-full" />
            )}

            {showPreferences && session?.user && (
              <Dialog open={showPreferencesDialog} onOpenChange={setShowPreferencesDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Sign Language Preferences</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Preferred Sign Language</Label>
                      <Select
                        value={userPreferences.signLanguageDialect || "asl"}
                        onValueChange={(value) =>
                          setUserPreferences({ ...userPreferences, signLanguageDialect: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asl">American Sign Language (ASL)</SelectItem>
                          <SelectItem value="bsl">British Sign Language (BSL)</SelectItem>
                          <SelectItem value="auslan">Australian Sign Language (Auslan)</SelectItem>
                          <SelectItem value="lsf">French Sign Language (LSF)</SelectItem>
                          <SelectItem value="lsm">Mexican Sign Language (LSM)</SelectItem>
                          <SelectItem value="jsl">Japanese Sign Language (JSL)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Avatar Style</Label>
                      <Select
                        value={userPreferences.avatarStyle || "realistic"}
                        onValueChange={(value) => setUserPreferences({ ...userPreferences, avatarStyle: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realistic">Realistic</SelectItem>
                          <SelectItem value="cartoon">Cartoon</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="human">Human Interpreter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Video Quality</Label>
                      <Select
                        value={userPreferences.quality || "standard"}
                        onValueChange={(value) => setUserPreferences({ ...userPreferences, quality: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard (480p)</SelectItem>
                          <SelectItem value="high">High (720p)</SelectItem>
                          <SelectItem value="premium">Premium (1080p)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button onClick={() => saveUserPreferences(userPreferences)} className="w-full">
                      Save Preferences
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        ) : (
          <div className="aspect-video bg-muted flex flex-col items-center justify-center p-6">
            {error ? (
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Error Generating Video</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button onClick={submitRequest} variant="outline" className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-2" />
                <h3 className="font-semibold mb-1">
                  {status === "pending" ? "Preparing" : "Generating"} Sign Language Video
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {status === "pending" ? "Setting up translation..." : "Creating sign language animation..."}
                  <br />
                  <span className="text-xs">
                    {effectiveSettings.targetDialect.toUpperCase()} • {effectiveSettings.avatarStyle} •{" "}
                    {effectiveSettings.quality}
                  </span>
                </p>
                <Progress value={progress} className="w-full max-w-xs mx-auto" />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
