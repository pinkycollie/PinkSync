"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Video, Eye, CheckCircle, AlertCircle, Users, FileText, Shield, Zap } from "lucide-react"
import { PinkSyncVCodeEngine } from "@/lib/vcode/pinksync-integration"

interface PinkSyncVCodeInterfaceProps {
  userId: string
  sessionId: string
  onVCodeGenerated?: (vcode: string) => void
}

export default function PinkSyncVCodeInterface({ userId, sessionId, onVCodeGenerated }: PinkSyncVCodeInterfaceProps) {
  const [engine] = useState(() => new PinkSyncVCodeEngine(sessionId, userId))
  const [isRecording, setIsRecording] = useState(false)
  const [aslAnalysis, setAslAnalysis] = useState<any>(null)
  const [agreements, setAgreements] = useState<any[]>([])
  const [visualFeedback, setVisualFeedback] = useState<any>(null)
  const [sessionStatus, setSessionStatus] = useState<"idle" | "active" | "processing" | "complete">("idle")
  const [qualityMetrics, setQualityMetrics] = useState({
    aslConfidence: 0,
    videoQuality: 0,
    agreementClarity: 0,
  })

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Start VCode session with full accessibility
  const startSession = async () => {
    try {
      setSessionStatus("active")

      const session = await engine.startVCodeSession({
        participants: ["client", "representative"],
        meetingType: "consultation",
        expectedDuration: 60,
      })

      // Initialize video capture for ASL processing
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }

      setIsRecording(true)
      startRealTimeProcessing()
    } catch (error) {
      console.error("Failed to start VCode session:", error)
      setVisualFeedback({
        icon: "x-circle",
        color: "red",
        animation: "shake",
        message: "Failed to start session",
      })
    }
  }

  // Real-time ASL processing
  const startRealTimeProcessing = () => {
    const processInterval = setInterval(async () => {
      if (!isRecording || !videoRef.current) return

      try {
        // Capture video frame for ASL analysis
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        ctx.drawImage(videoRef.current, 0, 0)

        // Convert to blob for processing
        canvas.toBlob(
          async (blob) => {
            if (!blob) return

            const analysis = await engine.processASLStream(blob)

            setAslAnalysis(analysis)
            setVisualFeedback(analysis.visualFeedback)

            // Update quality metrics
            setQualityMetrics((prev) => ({
              ...prev,
              aslConfidence: analysis.confidence,
              videoQuality: analysis.confidence > 0.8 ? 0.9 : 0.6,
            }))

            // Check for agreements
            if (analysis.transcript.toLowerCase().includes("agree")) {
              setAgreements((prev) => [
                ...prev,
                {
                  text: analysis.transcript,
                  timestamp: Date.now(),
                  confidence: analysis.confidence,
                },
              ])
            }
          },
          "image/jpeg",
          0.8,
        )
      } catch (error) {
        console.error("ASL processing error:", error)
      }
    }, 2000) // Process every 2 seconds

    // Cleanup interval when recording stops
    return () => clearInterval(processInterval)
  }

  // Generate VCode with accessibility documentation
  const generateVCode = async () => {
    try {
      setSessionStatus("processing")

      const result = await engine.generateVCode(sessionId)

      if (result.distributionReady) {
        setSessionStatus("complete")
        onVCodeGenerated?.(result.vcode)

        setVisualFeedback({
          icon: "check-circle",
          color: "green",
          animation: "pulse",
          message: "VCode generated successfully!",
        })
      } else {
        setVisualFeedback({
          icon: "alert-circle",
          color: "orange",
          animation: "pulse",
          message: "VCode needs quality review",
        })
      }
    } catch (error) {
      console.error("VCode generation failed:", error)
      setVisualFeedback({
        icon: "x-circle",
        color: "red",
        animation: "shake",
        message: "VCode generation failed",
      })
    }
  }

  // Stop recording and cleanup
  const stopSession = () => {
    setIsRecording(false)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
    setSessionStatus("idle")
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Shield className="h-8 w-8 text-blue-600" />
          PinkSync VCode System
        </h1>
        <p className="text-lg text-muted-foreground">Deaf-First Legal Protection Technology</p>
      </div>

      {/* Visual Feedback Alert */}
      {visualFeedback && (
        <Alert
          className={`border-l-4 ${
            visualFeedback.color === "green"
              ? "border-green-500 bg-green-50"
              : visualFeedback.color === "red"
                ? "border-red-500 bg-red-50"
                : "border-orange-500 bg-orange-50"
          }`}
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-medium">{visualFeedback.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              ASL Video Capture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <video ref={videoRef} autoPlay muted className="w-full h-64 bg-black rounded-lg" />
              {isRecording && (
                <div className="absolute top-2 right-2">
                  <Badge variant="destructive" className="animate-pulse">
                    ● RECORDING
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {!isRecording ? (
                <Button onClick={startSession} className="flex-1">
                  <Video className="h-4 w-4 mr-2" />
                  Start VCode Session
                </Button>
              ) : (
                <Button onClick={stopSession} variant="destructive" className="flex-1">
                  Stop Recording
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Real-time Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Real-time ASL Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {aslAnalysis ? (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Detected Signs:</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {aslAnalysis.detectedSigns.map((sign: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {sign}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Confidence:</label>
                  <Progress value={aslAnalysis.confidence * 100} className="mt-1" />
                  <span className="text-xs text-muted-foreground">{Math.round(aslAnalysis.confidence * 100)}%</span>
                </div>

                <div>
                  <label className="text-sm font-medium">Transcript:</label>
                  <p className="text-sm bg-muted p-2 rounded mt-1">{aslAnalysis.transcript || "Processing..."}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Start recording to see ASL analysis</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Agreements Detected */}
      {agreements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Agreements Detected ({agreements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agreements.map((agreement, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={agreement.confidence > 0.8 ? "default" : "secondary"}>
                      {Math.round(agreement.confidence * 100)}% confidence
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(agreement.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">{agreement.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quality Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Quality Assurance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">ASL Confidence</label>
              <Progress value={qualityMetrics.aslConfidence * 100} className="mt-1" />
              <span className="text-xs text-muted-foreground">{Math.round(qualityMetrics.aslConfidence * 100)}%</span>
            </div>
            <div>
              <label className="text-sm font-medium">Video Quality</label>
              <Progress value={qualityMetrics.videoQuality * 100} className="mt-1" />
              <span className="text-xs text-muted-foreground">{Math.round(qualityMetrics.videoQuality * 100)}%</span>
            </div>
            <div>
              <label className="text-sm font-medium">Agreement Clarity</label>
              <Progress value={qualityMetrics.agreementClarity * 100} className="mt-1" />
              <span className="text-xs text-muted-foreground">
                {Math.round(qualityMetrics.agreementClarity * 100)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate VCode */}
      {sessionStatus === "active" && agreements.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <Button onClick={generateVCode} className="w-full" size="lg" disabled={sessionStatus === "processing"}>
              {sessionStatus === "processing" ? (
                <>Processing VCode...</>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Generate VCode for 360 Magicians Distribution
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Success State */}
      {sessionStatus === "complete" && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">VCode Generated Successfully!</h3>
            <p className="text-green-700 mb-4">
              Your legal protection evidence is ready for 360 Magicians distribution.
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Contact 360 Magicians
              </Button>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                View VCode Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
