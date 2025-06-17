"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Video,
  Square,
  Download,
  Eye,
  Users,
  FileText,
  Shield,
  Accessibility,
  Volume2,
  VolumeX,
  Camera,
  Mic,
  MicOff,
} from "lucide-react"

interface VCodeSession {
  id: string
  status: "idle" | "recording" | "processing" | "complete"
  participants: string[]
  duration: number
  agreements: Agreement[]
  evidence: Evidence[]
}

interface Agreement {
  id: string
  text: string
  timestamp: number
  confidence: number
  participants: string[]
  aslInterpretation?: string
}

interface Evidence {
  id: string
  type: "video" | "audio" | "asl" | "transcript"
  url: string
  timestamp: number
  quality: number
}

export function VCodeInterface() {
  const [session, setSession] = useState<VCodeSession>({
    id: "",
    status: "idle",
    participants: [],
    duration: 0,
    agreements: [],
    evidence: [],
  })

  const [isRecording, setIsRecording] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [aslDetected, setAslDetected] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)

  const [deviceStatus, setDeviceStatus] = useState({
    hasVideo: false,
    hasAudio: false,
    permissionsChecked: false,
  })

  // Check for available devices
  useEffect(() => {
    async function checkDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const hasVideo = devices.some((device) => device.kind === "videoinput")
        const hasAudio = devices.some((device) => device.kind === "audioinput")

        setDeviceStatus({
          hasVideo,
          hasAudio,
          permissionsChecked: true,
        })

        // Update enabled states based on available devices
        if (!hasVideo) setVideoEnabled(false)
        if (!hasAudio) setAudioEnabled(false)
      } catch (error) {
        console.error("Error checking media devices:", error)
        setDeviceStatus({
          hasVideo: false,
          hasAudio: false,
          permissionsChecked: true,
        })
      }
    }

    checkDevices()
  }, [])

  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  // Simulate ASL detection
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setAslDetected(Math.random() > 0.7)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isRecording])

  const startRecording = async () => {
    try {
      // First check if devices are available
      const devices = await navigator.mediaDevices.enumerateDevices()
      const hasVideo = devices.some((device) => device.kind === "videoinput")
      const hasAudio = devices.some((device) => device.kind === "audioinput")

      // Set device availability state
      if (!hasVideo && videoEnabled) {
        setVideoEnabled(false)
        console.warn("No video input devices found. Disabling video.")
      }

      if (!hasAudio && audioEnabled) {
        setAudioEnabled(false)
        console.warn("No audio input devices found. Disabling audio.")
      }

      // If neither video nor audio is available, show error
      if ((!hasVideo && !hasAudio) || (!videoEnabled && !audioEnabled)) {
        throw new Error("No recording devices available. Please connect a camera or microphone.")
      }

      // Request permissions with fallback options
      const constraints = {
        video: videoEnabled ? { facingMode: "user" } : false,
        audio: audioEnabled,
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      setIsRecording(true)
      setSession((prev) => ({
        ...prev,
        status: "recording",
        id: `vcode_${Date.now()}`,
      }))

      mediaRecorder.start()

      // Simulate duration counter
      const timer = setInterval(() => {
        setSession((prev) => ({
          ...prev,
          duration: prev.duration + 1,
        }))
      }, 1000)

      mediaRecorder.onstop = () => {
        clearInterval(timer)
        processRecording()
      }
    } catch (error) {
      console.error("Error starting recording:", error)

      // Provide user-friendly error message
      const errorMessage =
        error instanceof Error ? error.message : "Failed to access recording devices. Please check permissions."

      // Show error to user
      setSession((prev) => ({
        ...prev,
        status: "idle",
      }))

      // Display error notification
      alert(`Recording Error: ${errorMessage}`)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
    }
    setIsRecording(false)
  }

  const processRecording = () => {
    setSession((prev) => ({ ...prev, status: "processing" }))

    // Simulate processing with progress
    let progress = 0
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15
      setProcessingProgress(Math.min(progress, 100))

      if (progress >= 100) {
        clearInterval(progressInterval)
        completeProcessing()
      }
    }, 500)
  }

  const completeProcessing = () => {
    // Simulate detected agreements and evidence
    const mockAgreements: Agreement[] = [
      {
        id: "1",
        text: "Both parties agree to the terms of service modification",
        timestamp: 45,
        confidence: 0.92,
        participants: ["Client A", "Representative B"],
        aslInterpretation: "BOTH PERSON AGREE CHANGE SERVICE RULES",
      },
      {
        id: "2",
        text: "Payment schedule confirmed for monthly billing",
        timestamp: 120,
        confidence: 0.88,
        participants: ["Client A", "Representative B"],
        aslInterpretation: "PAY EVERY MONTH CONFIRMED",
      },
    ]

    const mockEvidence: Evidence[] = [
      {
        id: "1",
        type: "video",
        url: "/evidence/video_1.mp4",
        timestamp: 0,
        quality: 0.95,
      },
      {
        id: "2",
        type: "asl",
        url: "/evidence/asl_interpretation.json",
        timestamp: 0,
        quality: 0.89,
      },
      {
        id: "3",
        type: "transcript",
        url: "/evidence/transcript.txt",
        timestamp: 0,
        quality: 0.93,
      },
    ]

    setSession((prev) => ({
      ...prev,
      status: "complete",
      agreements: mockAgreements,
      evidence: mockEvidence,
      participants: ["Client A", "Representative B"],
    }))
    setProcessingProgress(0)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">VCode Generator</h1>
        <p className="text-lg text-gray-600 mb-4">Visual Contract Evidence with Full Accessibility</p>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Accessibility className="w-4 h-4" />
            WCAG 2.1 AA
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            Legal Grade
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            ASL Ready
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recording Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Recording Interface
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Video Preview */}
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
              {aslDetected && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-500 text-white animate-pulse">ASL Detected</Badge>
                </div>
              )}
              {isRecording && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-red-500 text-white animate-pulse">
                    ● REC {formatDuration(session.duration)}
                  </Badge>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVideoEnabled(!videoEnabled)}
                className={!videoEnabled ? "bg-red-50" : ""}
              >
                <Camera className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={!audioEnabled ? "bg-red-50" : ""}
              >
                {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setAudioEnabled(!audioEnabled)}>
                {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
            </div>

            {/* Device Status Indicators */}
            <div className="mt-2 flex justify-center gap-2">
              {deviceStatus.permissionsChecked && (
                <>
                  <Badge variant={deviceStatus.hasVideo ? "outline" : "destructive"} className="text-xs">
                    <Camera className="w-3 h-3 mr-1" />
                    {deviceStatus.hasVideo ? "Camera Ready" : "No Camera"}
                  </Badge>
                  <Badge variant={deviceStatus.hasAudio ? "outline" : "destructive"} className="text-xs">
                    <Mic className="w-3 h-3 mr-1" />
                    {deviceStatus.hasAudio ? "Mic Ready" : "No Microphone"}
                  </Badge>
                </>
              )}
            </div>

            {/* Fallback Message */}
            {deviceStatus.permissionsChecked && !deviceStatus.hasVideo && !deviceStatus.hasAudio && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800">
                <p className="font-medium">No recording devices detected</p>
                <p className="text-xs mt-1">
                  VCode requires access to your camera or microphone. Please connect a device and refresh the page.
                </p>
              </div>
            )}

            {/* Main Action Button */}
            <div className="text-center">
              {session.status === "idle" && (
                <Button
                  onClick={startRecording}
                  size="lg"
                  className="w-full"
                  disabled={!deviceStatus.hasVideo && !deviceStatus.hasAudio}
                >
                  <Video className="w-5 h-5 mr-2" />
                  Start VCode Session
                </Button>
              )}
              {session.status === "recording" && (
                <Button onClick={stopRecording} variant="destructive" size="lg" className="w-full">
                  <Square className="w-5 h-5 mr-2" />
                  Stop Recording
                </Button>
              )}
              {session.status === "processing" && (
                <div className="space-y-2">
                  <Button disabled size="lg" className="w-full">
                    Processing VCode...
                  </Button>
                  <Progress value={processingProgress} className="w-full" />
                  <p className="text-sm text-gray-600">Analyzing agreements and generating evidence...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              VCode Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {session.status === "idle" && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Start a recording session to generate VCode evidence</p>
              </div>
            )}

            {session.status === "complete" && (
              <div className="space-y-6">
                {/* Session Info */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">VCode Generated Successfully</h3>
                  <div className="text-sm text-green-700 space-y-1">
                    <p>Session ID: {session.id}</p>
                    <p>Duration: {formatDuration(session.duration)}</p>
                    <p>Participants: {session.participants.join(", ")}</p>
                  </div>
                </div>

                {/* Detected Agreements */}
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
                        {agreement.aslInterpretation && (
                          <div className="bg-blue-50 p-2 rounded text-xs">
                            <strong>ASL:</strong> {agreement.aslInterpretation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidence Files */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Evidence Files ({session.evidence.length})
                  </h3>
                  <div className="space-y-2">
                    {session.evidence.map((evidence) => (
                      <div key={evidence.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {evidence.type}
                          </Badge>
                          <span className="text-sm">Quality: {Math.round(evidence.quality * 100)}%</span>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download VCode Package
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Evidence
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Accessibility Features */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Accessibility className="w-5 h-5" />
            Accessibility Features Active
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">Visual Feedback</p>
                <p className="text-xs text-blue-600">High contrast, clear indicators</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">ASL Recognition</p>
                <p className="text-xs text-green-600">Real-time sign interpretation</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Shield className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium text-purple-800">Legal Grade</p>
                <p className="text-xs text-purple-600">Court-admissible evidence</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
