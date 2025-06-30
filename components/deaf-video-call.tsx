"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Captions, Hand, Eye, Users } from "lucide-react"

interface DeafVideoCallProps {
  roomId?: string
  userId?: string
}

export function DeafVideoCall({ roomId = "demo-room", userId = "user-123" }: DeafVideoCallProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isMicEnabled, setIsMicEnabled] = useState(false) // Typically off for deaf users
  const [isCaptionsEnabled, setIsCaptionsEnabled] = useState(true)
  const [isGestureDetectionEnabled, setIsGestureDetectionEnabled] = useState(true)
  const [isSignLanguageMode, setIsSignLanguageMode] = useState(true)
  const [participants, setParticipants] = useState<any[]>([])
  const [detectedGestures, setDetectedGestures] = useState<string[]>([])

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Simulate video stream initialization
  useEffect(() => {
    if (isConnected && localVideoRef.current) {
      // In a real implementation, this would be your actual video stream
      // For demo, we'll create a placeholder
      const canvas = document.createElement("canvas")
      canvas.width = 640
      canvas.height = 480
      const ctx = canvas.getContext("2d")

      if (ctx) {
        // Create a simple animated placeholder
        const animate = () => {
          ctx.fillStyle = "#1f2937"
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          ctx.fillStyle = "#3b82f6"
          ctx.font = "24px Arial"
          ctx.textAlign = "center"
          ctx.fillText("PinkSync Video Call", canvas.width / 2, canvas.height / 2 - 20)
          ctx.fillText(`Room: ${roomId}`, canvas.width / 2, canvas.height / 2 + 20)

          if (isSignLanguageMode) {
            ctx.fillStyle = "#10b981"
            ctx.fillText("🤟 Sign Language Mode Active", canvas.width / 2, canvas.height / 2 + 60)
          }

          requestAnimationFrame(animate)
        }
        animate()

        // Convert canvas to video stream (this is a demo technique)
        const stream = (canvas as any).captureStream(30)
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
        streamRef.current = stream
      }
    }
  }, [isConnected, roomId, isSignLanguageMode])

  // Simulate gesture detection
  useEffect(() => {
    if (isGestureDetectionEnabled && isConnected) {
      const interval = setInterval(() => {
        const gestures = ["👋 Hello", "👍 Yes", "👎 No", "✋ Stop", "👌 OK", "🤟 I Love You"]
        const randomGesture = gestures[Math.floor(Math.random() * gestures.length)]
        setDetectedGestures((prev) => [...prev.slice(-4), randomGesture])
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [isGestureDetectionEnabled, isConnected])

  const handleConnect = async () => {
    try {
      setIsConnected(true)
      // Simulate participants joining
      setParticipants([
        { id: userId, name: "You", isLocal: true },
        { id: "interpreter-001", name: "ASL Interpreter", role: "interpreter" },
        { id: "participant-002", name: "Meeting Host", role: "host" },
      ])
    } catch (error) {
      console.error("Failed to connect:", error)
    }
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setParticipants([])
    setDetectedGestures([])
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              PinkSync Deaf-First Video Call
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={isConnected ? "default" : "secondary"}>
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
              {isSignLanguageMode && (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  🤟 Sign Language Mode
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Video Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Local Video */}
            <div className="relative">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-64 bg-gray-900 rounded-lg object-cover"
              />
              <div className="absolute top-2 left-2">
                <Badge variant="secondary">You</Badge>
              </div>
              {isGestureDetectionEnabled && (
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    <Hand className="h-3 w-3 mr-1" />
                    Gesture Detection
                  </Badge>
                </div>
              )}
            </div>

            {/* Remote Video */}
            <div className="relative">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-64 bg-gray-800 rounded-lg object-cover"
              />
              <div className="absolute top-2 left-2">
                <Badge variant="secondary">ASL Interpreter</Badge>
              </div>
              {isCaptionsEnabled && (
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="bg-black bg-opacity-75 text-white p-2 rounded text-sm">
                    [Live Captions] Welcome to the PinkSync video call...
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Detected Gestures Panel */}
          {isGestureDetectionEnabled && detectedGestures.length > 0 && (
            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Hand className="h-4 w-4" />
                  Detected Gestures
                </h4>
                <div className="flex flex-wrap gap-2">
                  {detectedGestures.map((gesture, index) => (
                    <Badge key={index} variant="outline" className="bg-white">
                      {gesture}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Participants */}
          {participants.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Participants ({participants.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{participant.name}</span>
                      {participant.role && (
                        <Badge variant="outline" className="text-xs">
                          {participant.role}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {!isConnected ? (
              <Button onClick={handleConnect} size="lg" className="bg-green-600 hover:bg-green-700">
                <Phone className="mr-2 h-4 w-4" />
                Join Call
              </Button>
            ) : (
              <Button onClick={handleDisconnect} size="lg" variant="destructive">
                <PhoneOff className="mr-2 h-4 w-4" />
                Leave Call
              </Button>
            )}

            <Button
              variant={isVideoEnabled ? "default" : "outline"}
              onClick={() => setIsVideoEnabled(!isVideoEnabled)}
              disabled={!isConnected}
            >
              {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>

            <Button
              variant={isMicEnabled ? "default" : "outline"}
              onClick={() => setIsMicEnabled(!isMicEnabled)}
              disabled={!isConnected}
            >
              {isMicEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>

            <Button
              variant={isCaptionsEnabled ? "default" : "outline"}
              onClick={() => setIsCaptionsEnabled(!isCaptionsEnabled)}
              disabled={!isConnected}
            >
              <Captions className="h-4 w-4" />
            </Button>

            <Button
              variant={isGestureDetectionEnabled ? "default" : "outline"}
              onClick={() => setIsGestureDetectionEnabled(!isGestureDetectionEnabled)}
              disabled={!isConnected}
            >
              <Hand className="h-4 w-4" />
            </Button>

            <Button
              variant={isSignLanguageMode ? "default" : "outline"}
              onClick={() => setIsSignLanguageMode(!isSignLanguageMode)}
              disabled={!isConnected}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          {/* Deaf-Specific Features Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="bg-green-50">
              <CardContent className="p-4 text-center">
                <Hand className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h4 className="font-semibold text-green-800">Gesture Recognition</h4>
                <p className="text-sm text-green-600">Real-time ASL detection and translation</p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50">
              <CardContent className="p-4 text-center">
                <Captions className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Live Captions</h4>
                <p className="text-sm text-blue-600">Real-time speech-to-text transcription</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50">
              <CardContent className="p-4 text-center">
                <Eye className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h4 className="font-semibold text-purple-800">Visual Priority</h4>
                <p className="text-sm text-purple-600">Optimized for visual communication</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
