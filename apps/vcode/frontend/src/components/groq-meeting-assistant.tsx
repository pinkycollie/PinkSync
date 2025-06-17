"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Brain,
  Mic,
  MicOff,
  MessageSquare,
  FileText,
  Eye,
  Heart,
  Scale,
  Settings,
  Zap,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

interface MeetingContext {
  type: "medical" | "legal" | "technical" | "general"
  participants: string[]
  duration: number
  accessibility_mode: boolean
  asl_required: boolean
}

interface GroqResponse {
  status: string
  assistance?: string
  analysis?: any
  transcription?: any
  error?: string
  accessibility_optimized?: boolean
}

export function GroqMeetingAssistant() {
  const [meetingContext, setMeetingContext] = useState<MeetingContext>({
    type: "general",
    participants: [],
    duration: 0,
    accessibility_mode: true,
    asl_required: true,
  })

  const [isRecording, setIsRecording] = useState(false)
  const [currentTranscript, setCurrentTranscript] = useState("")
  const [groqResponse, setGroqResponse] = useState<GroqResponse | null>(null)
  const [userQuery, setUserQuery] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Meeting type icons and colors
  const meetingTypeConfig = {
    medical: { icon: Heart, color: "text-red-500", bg: "bg-red-50" },
    legal: { icon: Scale, color: "text-blue-500", bg: "bg-blue-50" },
    technical: { icon: Settings, color: "text-green-500", bg: "bg-green-50" },
    general: { icon: MessageSquare, color: "text-gray-500", bg: "bg-gray-50" },
  }

  // Start audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        await processAudioWithGroq(audioBlob)
      }

      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
    } catch (error) {
      console.error("Recording failed:", error)
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  // Process audio with Groq
  const processAudioWithGroq = async (audioBlob: Blob) => {
    setIsProcessing(true)

    try {
      const formData = new FormData()
      formData.append("audio", audioBlob)
      formData.append("meeting_type", meetingContext.type)
      formData.append("accessibility_mode", meetingContext.accessibility_mode.toString())

      const response = await fetch("/api/vcode/groq/process-audio", {
        method: "POST",
        body: formData,
      })

      const result: GroqResponse = await response.json()

      if (result.status === "success" && result.transcription) {
        setCurrentTranscript((prev) => prev + " " + result.transcription.text)
        setGroqResponse(result)
      }
    } catch (error) {
      console.error("Groq processing failed:", error)
      setGroqResponse({
        status: "error",
        error: "Failed to process audio with Groq AI",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Get real-time assistance
  const getAssistance = async () => {
    if (!currentTranscript && !userQuery) return

    setIsProcessing(true)

    try {
      const response = await fetch("/api/vcode/groq/assistance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_transcript: currentTranscript,
          meeting_context: meetingContext,
          user_query: userQuery,
        }),
      })

      const result: GroqResponse = await response.json()
      setGroqResponse(result)
      setUserQuery("")
    } catch (error) {
      console.error("Assistance request failed:", error)
      setGroqResponse({
        status: "error",
        error: "Failed to get AI assistance",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Generate VCode evidence
  const generateEvidence = async () => {
    if (!currentTranscript) return

    setIsProcessing(true)

    try {
      const response = await fetch("/api/vcode/groq/generate-evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meeting_data: {
            transcript: currentTranscript,
            type: meetingContext.type,
            participants: meetingContext.participants,
            duration: meetingContext.duration,
          },
          legal_requirements: {
            accessibility_compliant: true,
            asl_interpreted: meetingContext.asl_required,
            court_admissible: true,
          },
        }),
      })

      const result: GroqResponse = await response.json()
      setGroqResponse(result)
    } catch (error) {
      console.error("Evidence generation failed:", error)
      setGroqResponse({
        status: "error",
        error: "Failed to generate VCode evidence",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const TypeIcon = meetingTypeConfig[meetingContext.type].icon

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Meeting Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            Groq AI Meeting Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Meeting Type Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Meeting Type</label>
            <Select
              value={meetingContext.type}
              onValueChange={(value: any) => setMeetingContext((prev) => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="medical">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    Medical Consultation
                  </div>
                </SelectItem>
                <SelectItem value="legal">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-blue-500" />
                    Legal Meeting
                  </div>
                </SelectItem>
                <SelectItem value="technical">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-green-500" />
                    Technical Discussion
                  </div>
                </SelectItem>
                <SelectItem value="general">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    General Meeting
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Accessibility Settings */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Accessibility Mode</span>
              <Badge variant={meetingContext.accessibility_mode ? "default" : "secondary"}>
                {meetingContext.accessibility_mode ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">ASL Required</span>
              <Badge variant={meetingContext.asl_required ? "default" : "secondary"}>
                {meetingContext.asl_required ? "Yes" : "No"}
              </Badge>
            </div>
          </div>

          {/* Recording Controls */}
          <div className="space-y-3">
            <div className="flex gap-2">
              {!isRecording ? (
                <Button onClick={startRecording} className="flex-1">
                  <Mic className="w-4 h-4 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <Button onClick={stopRecording} variant="destructive" className="flex-1">
                  <MicOff className="w-4 h-4 mr-2" />
                  Stop Recording
                </Button>
              )}
            </div>

            {isRecording && (
              <div className="text-center">
                <Badge className="bg-red-500 text-white animate-pulse">● Recording with Groq AI Processing</Badge>
              </div>
            )}
          </div>

          {/* AI Assistance Query */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Ask AI Assistant</label>
            <Textarea
              placeholder="Ask about the meeting, request clarification, or get accessibility help..."
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              rows={3}
            />
            <Button
              onClick={getAssistance}
              disabled={isProcessing || (!currentTranscript && !userQuery)}
              className="w-full"
            >
              <Zap className="w-4 h-4 mr-2" />
              {isProcessing ? "Processing..." : "Get AI Assistance"}
            </Button>
          </div>

          {/* Generate Evidence */}
          {currentTranscript && (
            <Button onClick={generateEvidence} disabled={isProcessing} variant="outline" className="w-full">
              <FileText className="w-4 h-4 mr-2" />
              Generate VCode Evidence
            </Button>
          )}
        </CardContent>
      </Card>

      {/* AI Response Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TypeIcon className={`w-5 h-5 ${meetingTypeConfig[meetingContext.type].color}`} />
            AI Analysis & Assistance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Transcript */}
          {currentTranscript && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Live Transcript
              </h3>
              <div className="bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                <p className="text-sm">{currentTranscript}</p>
              </div>
            </div>
          )}

          {/* Groq AI Response */}
          {groqResponse && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-500" />
                Groq AI Response
              </h3>

              {groqResponse.status === "success" ? (
                <div className="space-y-3">
                  {groqResponse.accessibility_optimized && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Accessibility Optimized
                    </Badge>
                  )}

                  {groqResponse.assistance && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="whitespace-pre-wrap text-sm">{groqResponse.assistance}</div>
                    </div>
                  )}

                  {groqResponse.analysis && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="font-medium mb-2">Meeting Analysis</h4>
                      <pre className="text-xs overflow-x-auto">{JSON.stringify(groqResponse.analysis, null, 2)}</pre>
                    </div>
                  )}
                </div>
              ) : (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {groqResponse.error || "An error occurred processing your request"}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="text-center py-4">
              <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Groq AI is processing...</p>
            </div>
          )}

          {/* No Content State */}
          {!currentTranscript && !groqResponse && !isProcessing && (
            <div className="text-center py-8 text-gray-500">
              <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Start recording to see AI analysis</p>
              <p className="text-xs mt-1">Powered by Groq AI with accessibility focus</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
