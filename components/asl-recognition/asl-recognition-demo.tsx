"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Camera, Pause, Play, RefreshCw, Sparkles, Type } from "lucide-react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import type { HandLandmarker } from "@/lib/hand-landmarker"

export function ASLRecognitionDemo() {
  const [activeTab, setActiveTab] = useState("live")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [showLandmarks, setShowLandmarks] = useState(true)
  const [recognizedText, setRecognizedText] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [recentSigns, setRecentSigns] = useState<string[]>([])
  const [isModelLoaded, setIsModelLoaded] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | null>(null)
  const handLandmarkerRef = useRef<HandLandmarker | null>(null)

  // Mock ASL alphabet recognition data
  const mockASLAlphabet = [
    "Hello",
    "How",
    "Are",
    "You",
    "Thank",
    "You",
    "Nice",
    "Meet",
    "Name",
    "What",
    "Your",
    "Please",
    "Sorry",
    "Help",
    "Need",
  ]

  // Initialize the camera and model
  useEffect(() => {
    const initCamera = async () => {
      if (activeTab !== "live") return

      try {
        // Simulate model loading
        setIsModelLoaded(false)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setIsModelLoaded(true)

        // Access the camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 480 },
        })

        streamRef.current = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

        // Start processing
        setIsProcessing(true)
        startLandmarkDetection()
      } catch (error) {
        console.error("Error accessing camera:", error)
      }
    }

    initCamera()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [activeTab])

  const startLandmarkDetection = () => {
    if (!canvasRef.current || !videoRef.current || isPaused) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    const detectFrame = () => {
      if (!videoRef.current || !canvasRef.current || !ctx) return

      // Clear the canvas
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

      // Draw the video frame
      ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)

      if (showLandmarks) {
        // Simulate hand landmark detection
        simulateHandLandmarks(ctx)
      }

      // Simulate ASL recognition
      if (isModelLoaded && !isPaused) {
        simulateASLRecognition()
      }

      // Continue the detection loop
      animationRef.current = requestAnimationFrame(detectFrame)
    }

    detectFrame()
  }

  const simulateHandLandmarks = (ctx: CanvasRenderingContext2D) => {
    // This is a simplified simulation of hand landmarks
    // In a real implementation, this would use a hand pose estimation model

    const centerX = canvasRef.current!.width / 2 + (Math.random() * 20 - 10)
    const centerY = canvasRef.current!.height / 2 + (Math.random() * 20 - 10)

    // Draw palm center
    ctx.fillStyle = "rgba(0, 255, 0, 0.6)"
    ctx.beginPath()
    ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI)
    ctx.fill()

    // Draw finger joints (simplified)
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI) / 2.5 - 0.5
      const length = 60 + Math.random() * 10

      const fingerTipX = centerX + Math.cos(angle) * length
      const fingerTipY = centerY - Math.sin(angle) * length

      // Middle joint
      const midJointX = centerX + Math.cos(angle) * (length / 2)
      const midJointY = centerY - Math.sin(angle) * (length / 2)

      // Draw lines
      ctx.strokeStyle = "rgba(0, 255, 0, 0.6)"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(midJointX, midJointY)
      ctx.lineTo(fingerTipX, fingerTipY)
      ctx.stroke()

      // Draw joints
      ctx.fillStyle = "rgba(0, 255, 0, 0.6)"
      ctx.beginPath()
      ctx.arc(midJointX, midJointY, 5, 0, 2 * Math.PI)
      ctx.fill()

      ctx.beginPath()
      ctx.arc(fingerTipX, fingerTipY, 5, 0, 2 * Math.PI)
      ctx.fill()
    }
  }

  const simulateASLRecognition = () => {
    // In a real implementation, this would analyze the hand landmarks
    // and predict the corresponding ASL sign

    // Simulate recognition delay and randomness
    if (Math.random() > 0.95) {
      const newSign = mockASLAlphabet[Math.floor(Math.random() * mockASLAlphabet.length)]
      const newConfidence = 70 + Math.floor(Math.random() * 30)

      setRecentSigns((prev) => {
        const updated = [newSign, ...prev]
        return updated.slice(0, 10) // Keep last 10 signs
      })

      setConfidence(newConfidence)

      // Update the recognized text by combining recent signs
      if (recentSigns.length > 2) {
        setRecognizedText((prev) => {
          // Occasionally add a space or punctuation
          const shouldAddSpace = Math.random() > 0.7
          return prev + (shouldAddSpace ? " " : "") + newSign
        })
      }
    }
  }

  const togglePause = () => {
    setIsPaused(!isPaused)

    if (isPaused) {
      startLandmarkDetection()
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }

  const resetRecognition = () => {
    setRecognizedText("")
    setRecentSigns([])
    setConfidence(0)
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          ASL Recognition
        </CardTitle>
        <CardDescription>Real-time American Sign Language recognition and transcription</CardDescription>
      </CardHeader>
      <Tabs defaultValue="live" onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="live">Live Camera</TabsTrigger>
            <TabsTrigger value="upload">Upload Video</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="live" className="p-6">
          <div className="space-y-6">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
              {!isModelLoaded ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Sparkles className="h-10 w-10 animate-pulse text-primary" />
                  <p className="mt-4 text-center text-muted-foreground">Loading ASL recognition model...</p>
                  <div className="mt-4 w-48">
                    <Progress value={Math.random() * 100} />
                  </div>
                </div>
              ) : null}
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" width={640} height={480} />

              {isProcessing && (
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                    {isPaused ? "Paused" : "Processing"}
                  </Badge>
                  {confidence > 0 && (
                    <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                      Confidence: {confidence}%
                    </Badge>
                  )}
                </div>
              )}

              {/* Add the Sign Speak attribution */}
              <div className="absolute bottom-4 right-4 bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur-sm rounded-md">
                Powered by <span className="font-bold">Sign Speak</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch id="landmarks" checked={showLandmarks} onCheckedChange={setShowLandmarks} />
                <Label htmlFor="landmarks">Show hand landmarks</Label>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={togglePause}>
                  {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={resetRecognition}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Transcribed Text</h3>
              </div>
              <div className="min-h-24 rounded-md border p-3">
                {recognizedText ? (
                  <p>{recognizedText}</p>
                ) : (
                  <p className="text-muted-foreground">Sign in ASL to see the transcription appear here...</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Recently Recognized Signs</h3>
              <div className="flex flex-wrap gap-2">
                {recentSigns.length > 0 ? (
                  recentSigns.map((sign, index) => (
                    <Badge key={index} variant="secondary">
                      {sign}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No signs recognized yet</p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="upload" className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <div className="rounded-full bg-primary/10 p-4">
              <Upload className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-medium">Upload ASL Video</h3>
            <p className="text-center text-muted-foreground">
              Upload a video containing American Sign Language to transcribe it
            </p>
            <Button>Select Video</Button>
          </div>
        </TabsContent>
      </Tabs>
      <CardFooter className="flex justify-between border-t px-6 py-4">
        <p className="text-sm text-muted-foreground">Powered by MBTQ ASL Recognition AI</p>
        <Button variant="outline" size="sm">
          View Documentation
        </Button>
      </CardFooter>
    </Card>
  )
}

function Upload(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}
