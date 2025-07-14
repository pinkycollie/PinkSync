"use client"

import { useState, useRef } from "react"
import { Camera, StopCircle, RotateCcw, Upload, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export function VideoSubmissionForm() {
  const [recording, setRecording] = useState(false)
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [processingType, setProcessingType] = useState("ai")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.muted = true // Mute to prevent feedback
      }

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" })
        setVideoBlob(blob)

        if (videoRef.current) {
          videoRef.current.srcObject = null
          videoRef.current.src = URL.createObjectURL(blob)
          videoRef.current.muted = false
        }
      }

      mediaRecorder.start()
      setRecording(true)
    } catch (error) {
      console.error("Error accessing media devices:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop()

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      setRecording(false)
    }
  }

  const resetRecording = () => {
    if (videoRef.current) {
      videoRef.current.srcObject = null
      videoRef.current.src = ""
    }

    setVideoBlob(null)
    setTitle("")
    setDescription("")
    setSubmitted(false)
  }

  const handleSubmit = async () => {
    if (!videoBlob) return

    setSubmitting(true)

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real application, you would upload the video blob to your server
    // const formData = new FormData()
    // formData.append("video", videoBlob)
    // formData.append("title", title)
    // formData.append("description", description)
    // formData.append("processingType", processingType)
    // await fetch("/api/video-submission", { method: "POST", body: formData })

    setSubmitting(false)
    setSubmitted(true)
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Record Video Submission
        </CardTitle>
        <CardDescription>Record a video chat for human review or AI processing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="aspect-video overflow-hidden rounded-lg bg-muted">
          {!videoBlob && !recording ? (
            <div className="flex h-full flex-col items-center justify-center">
              <Camera className="h-16 w-16 text-muted-foreground" />
              <p className="mt-4 text-center text-muted-foreground">Click the record button below to start recording</p>
            </div>
          ) : (
            <video ref={videoRef} className="h-full w-full object-cover" autoPlay playsInline controls={!recording} />
          )}
        </div>

        {videoBlob && !submitted ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter a title for your submission"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide additional context or notes"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Processing Type</Label>
              <RadioGroup value={processingType} onValueChange={setProcessingType} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ai" id="ai" />
                  <Label htmlFor="ai">AI Processing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="human" id="human" />
                  <Label htmlFor="human">Human Review</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both">Both AI and Human Review</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="priority" />
              <Label htmlFor="priority">Mark as priority</Label>
            </div>
          </div>
        ) : submitted ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
              <Check className="h-8 w-8 text-green-600 dark:text-green-300" />
            </div>
            <h3 className="text-xl font-medium">Submission Complete</h3>
            <p className="text-center text-muted-foreground">
              Your video has been submitted successfully and will be processed according to your preferences.
            </p>
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!recording && !videoBlob ? (
          <Button onClick={startRecording} className="w-full">
            Start Recording
          </Button>
        ) : recording ? (
          <Button variant="destructive" onClick={stopRecording} className="w-full">
            <StopCircle className="mr-2 h-4 w-4" />
            Stop Recording
          </Button>
        ) : submitted ? (
          <Button variant="outline" onClick={resetRecording} className="w-full">
            Record Another Video
          </Button>
        ) : (
          <div className="flex w-full gap-4">
            <Button variant="outline" onClick={resetRecording}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button onClick={handleSubmit} disabled={!title || submitting} className="flex-1">
              {submitting ? (
                <>Processing...</>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Submit Video
                </>
              )}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
