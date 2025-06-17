"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Video, Square, Camera, Mic, Eye, Users, Shield, CheckCircle, Download, FileText } from "lucide-react"

interface RecordingSession {
  id: string
  status: "idle" | "recording" | "processing" | "complete" | "error"
  duration: number
  participants: string[]
  agreements: Agreement[]
  evidence: Evidence[]
  aslDetection: ASLDetection
  legalCompliance: LegalCompliance
}

interface Agreement {
  id: string
  text: string
  timestamp: number
  confidence: number
  aslInterpretation: string
  participants: string[]
  legalStrength: number
}

interface Evidence {
  id: string
  type: "video" | "audio" | "asl" | "transcript" | "metadata"
  url: string
  timestamp: number
  quality: number
  hash: string
  blockchainVerified: boolean
}

interface ASLDetection {
  active: boolean
  confidence: number
  detectedSigns: string[]
  interpretation: string
  culturalAccuracy: number
}

interface LegalCompliance {
  score: number
  federalCompliant: boolean
  stateCompliant: boolean
  accessibilityCompliant: boolean
  courtReady: boolean
  issues: string[]
}

export function VCodeRecorder() {
  const [session, setSession] = useState<RecordingSession>({
    id: "",
    status: "idle",
    duration: 0,
    participants: [],
    agreements: [],
    evidence: [],
    aslDetection: {
      active: false,
      confidence: 0,
      detectedSigns: [],
      interpretation: "",
      culturalAccuracy: 0,
    },
    legalCompliance: {
      score: 0,
      federalCompliant: false,
      stateCompliant: false,
      accessibilityCompliant: false,
      courtReady: false,
      issues: [],
    },
  })

  const [deviceStatus, setDeviceStatus] = useState({
    hasVideo: false,
    hasAudio: false,
    permissionsGranted: false,
    checking: true,
  })

  const [processingProgress, setProcessingProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Check device availability
  useEffect(() => {
    checkDeviceAvailability()
  }, [])

  // Duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (session.status === "recording") {
      interval = setInterval(() => {
        setSession((prev) => ({ ...prev, duration: prev.duration + 1 }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [session.status])

  // ASL Detection simulation
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (session.status === "recording") {
      interval = setInterval(() => {
        simulateASLDetection()
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [session.status])

  const checkDeviceAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const hasVideo = devices.some((device) => device.kind === "videoinput")
      const hasAudio = devices.some((device) => device.kind === "audioinput")

      setDeviceStatus({
        hasVideo,
        hasAudio,
        permissionsGranted: false,
        checking: false,
      })
    } catch (error) {
      console.error("Device check failed:", error)
      setDeviceStatus({
        hasVideo: false,
        hasAudio: false,
        permissionsGranted: false,
        checking: false,
      })
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: deviceStatus.hasVideo,
        audio: deviceStatus.hasAudio,
      })

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const sessionId = `vcode_${Date.now()}`
      setSession((prev) => ({
        ...prev,
        id: sessionId,
        status: "recording",
        duration: 0,
        aslDetection: { ...prev.aslDetection, active: true },
      }))

      setDeviceStatus((prev) => ({ ...prev, permissionsGranted: true }))

      mediaRecorder.start()
      mediaRecorder.ondataavailable = (event) => {
        // Handle recorded data
        console.log("Recording data available:", event.data.size)
      }

      mediaRecorder.onstop = () => {
        processRecording()
      }
    } catch (error) {
      console.error("Recording failed:", error)
      setSession((prev) => ({ ...prev, status: "error" }))
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
    setSession((prev) => ({ ...prev, status: "processing" }))
  }

  const processRecording = () => {
    // Simulate processing with progress updates
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      setProcessingProgress(Math.min(progress, 100))

      if (progress >= 100) {
        clearInterval(interval)
        completeProcessing()
      }
    }, 500)
  }

  const completeProcessing = () => {
    // Simulate completed processing with mock data
    const mockAgreements: Agreement[] = [
      {
        id: "1",
        text: "Both parties agree to the modified payment terms of $500 monthly",
        timestamp: 45,
        confidence: 0.94,
        aslInterpretation: "BOTH PERSON AGREE CHANGE PAY $500 EVERY MONTH",
        participants: ["Client A", "Representative B"],
        legalStrength: 0.92,
      },
      {
        id: "2",
        text: "Service delivery confirmed for the first week of each month",
        timestamp: 120,
        confidence: 0.89,
        aslInterpretation: "SERVICE GIVE FIRST WEEK EVERY MONTH CONFIRMED",
        participants: ["Client A", "Representative B"],
        legalStrength: 0.87,
      },
    ]

    const mockEvidence: Evidence[] = [
      {
        id: "1",
        type: "video",
        url: "/evidence/video_session.mp4",
        timestamp: 0,
        quality: 0.96,
        hash: "sha256:abc123...",
        blockchainVerified: true,
      },
      {
        id: "2",
        type: "asl",
        url: "/evidence/asl_interpretation.json",
        timestamp: 0,
        quality: 0.91,
        hash: "sha256:def456...",
        blockchainVerified: true,
      },
      {
        id: "3",
        type: "transcript",
        url: "/evidence/full_transcript.txt",
        timestamp: 0,
        quality: 0.93,
        hash: "sha256:ghi789...",
        blockchainVerified: true,
      },
    ]

    const mockCompliance: LegalCompliance = {
      score: 96.5,
      federalCompliant: true,
      stateCompliant: true,
      accessibilityCompliant: true,
      courtReady: true,
      issues: [],
    }

    setSession((prev) => ({
      ...prev,
      status: "complete",
      agreements: mockAgreements,
      evidence: mockEvidence,
      legalCompliance: mockCompliance,
      participants: ["Client A", "Representative B"],
    }))

    setProcessingProgress(0)
  }

  const simulateASLDetection = () => {
    const mockSigns = ["AGREE", "UNDERSTAND", "CONFIRM", "YES", "PAYMENT", "SERVICE", "MONTH"]
    const detectedSigns = mockSigns.slice(0, Math.floor(Math.random() * 4) + 1)
    const confidence = 0.85 + Math.random() * 0.15

    setSession((prev) => ({
      ...prev,
      aslDetection: {
        ...prev.aslDetection,
        confidence,
        detectedSigns,
        interpretation: detectedSigns.join(" "),
        culturalAccuracy: 0.88 + Math.random() * 0.12,
      },
    }))
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recording Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            VCode Recording Studio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Video Preview */}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />

            {/* Recording Status Overlay */}
            {session.status === "recording" && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-red-500 text-white animate-pulse">● REC {formatDuration(session.duration)}</Badge>
              </div>
            )}

            {/* ASL Detection Overlay */}
            {session.aslDetection.active && session.aslDetection.detectedSigns.length > 0 && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-green-500 text-white">
                  ASL: {Math.round(session.aslDetection.confidence * 100)}%
                </Badge>
              </div>
            )}

            {/* Device Status */}
            {deviceStatus.checking && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="text-white text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p>Checking devices...</p>
                </div>
              </div>
            )}
          </div>

          {/* Device Status Indicators */}
          <div className="flex justify-center gap-4">
            <Badge variant={deviceStatus.hasVideo ? "default" : "destructive"}>
              <Camera className="w-3 h-3 mr-1" />
              {deviceStatus.hasVideo ? "Camera Ready" : "No Camera"}
            </Badge>
            <Badge variant={deviceStatus.hasAudio ? "default" : "destructive"}>
              <Mic className="w-3 h-3 mr-1" />
              {deviceStatus.hasAudio ? "Mic Ready" : "No Microphone"}
            </Badge>
          </div>

          {/* Recording Controls */}
          <div className="text-center space-y-4">
            {session.status === "idle" && (
              <Button
                onClick={startRecording}
                size="lg"
                className="w-full"
                disabled={!deviceStatus.hasVideo && !deviceStatus.hasAudio}
              >
                <Video className="w-5 h-5 mr-2" />
                Start VCode Recording
              </Button>
            )}

            {session.status === "recording" && (
              <Button onClick={stopRecording} variant="destructive" size="lg" className="w-full">
                <Square className="w-5 h-5 mr-2" />
                Stop Recording
              </Button>
            )}

            {session.status === "processing" && (
              <div className="space-y-3">
                <Button disabled size="lg" className="w-full">
                  Processing VCode Evidence...
                </Button>
                <Progress value={processingProgress} className="w-full" />
                <p className="text-sm text-gray-600">
                  Analyzing agreements, verifying ASL interpretation, and generating legal evidence...
                </p>
              </div>
            )}

            {session.status === "complete" && (
              <div className="space-y-3">
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    VCode generated successfully! Legal compliance: {session.legalCompliance.score}%
                  </AlertDescription>
                </Alert>
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download Evidence
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Real-time Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ASL Detection */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              ASL Detection
            </h3>
            {session.aslDetection.active ? (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Detected Signs:</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {session.aslDetection.detectedSigns.map((sign, index) => (
                      <Badge key={index} variant="secondary">
                        {sign}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Confidence:</label>
                  <Progress value={session.aslDetection.confidence * 100} className="mt-1" />
                  <span className="text-xs text-gray-500">{Math.round(session.aslDetection.confidence * 100)}%</span>
                </div>
                <div>
                  <label className="text-sm font-medium">Interpretation:</label>
                  <p className="text-sm bg-blue-50 p-2 rounded mt-1">
                    {session.aslDetection.interpretation || "Listening..."}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Start recording to see ASL analysis</p>
            )}
          </div>

          {/* Detected Agreements */}
          {session.agreements.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Detected Agreements ({session.agreements.length})
              </h3>
              <div className="space-y-3">
                {session.agreements.map((agreement) => (
                  <div key={agreement.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline">{Math.round(agreement.confidence * 100)}% confidence</Badge>
                      <span className="text-xs text-gray-500">{formatDuration(agreement.timestamp)}</span>
                    </div>
                    <p className="text-sm mb-2">{agreement.text}</p>
                    <div className="bg-blue-50 p-2 rounded text-xs">
                      <strong>ASL:</strong> {agreement.aslInterpretation}
                    </div>
                    <div className="mt-2">
                      <Progress value={agreement.legalStrength * 100} className="h-2" />
                      <span className="text-xs text-gray-500">
                        Legal Strength: {Math.round(agreement.legalStrength * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legal Compliance */}
          {session.status === "complete" && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Legal Compliance
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Overall Score</span>
                    <span className="text-sm font-bold">{session.legalCompliance.score}%</span>
                  </div>
                  <Progress value={session.legalCompliance.score} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Federal Compliant
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    State Compliant
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    ADA Compliant
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Court Ready
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
