"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  CaptionsIcon as ClosedCaptioning,
  Clock,
  Languages,
} from "lucide-react"

interface ASLVideoPlayerProps {
  videoId: string
  title: string
  signer: {
    name: string
    credentials: string
    photo: string
    bio: string
  }
  transcript: string
  captions?: string
  duration: string
  category: "ethical-principles" | "tutorial" | "announcement"
  priority?: "high" | "medium" | "low"
}

export function ASLVideoPlayer({
  videoId,
  title,
  signer,
  transcript,
  captions,
  duration,
  category,
  priority = "medium",
}: ASLVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showCaptions, setShowCaptions] = useState(true)
  const [showTranscript, setShowTranscript] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        containerRef.current.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
      setIsFullscreen(!isFullscreen)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <Card className="w-full max-w-4xl mx-auto border-2 border-pink-200 bg-white shadow-lg">
      <CardContent className="p-0">
        {/* Video Container */}
        <div ref={containerRef} className="relative bg-black rounded-t-lg overflow-hidden">
          {/* Priority Badge */}
          {priority === "high" && (
            <Badge className="absolute top-4 left-4 z-20 bg-red-600 text-white">🚨 High Priority</Badge>
          )}

          {/* Signer Info Overlay */}
          <div className="absolute top-4 right-4 z-20 bg-black/80 text-white p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <img src={signer.photo || "/placeholder.svg"} alt={signer.name} className="w-8 h-8 rounded-full" />
              <div>
                <div className="text-sm font-semibold">{signer.name}</div>
                <div className="text-xs text-gray-300">{signer.credentials}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Clock className="w-3 h-3" />
              <span>{duration}</span>
            </div>
          </div>

          {/* Video Element */}
          <video
            ref={videoRef}
            className="w-full aspect-video"
            poster={`/placeholder.svg?height=400&width=600&text=ASL+Video:+${encodeURIComponent(title)}`}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setCurrentTime(0)}
          >
            <source src={`/videos/asl/${videoId}.mp4`} type="video/mp4" />
            {captions && (
              <track
                kind="captions"
                src={`/captions/${videoId}.vtt`}
                srcLang="en"
                label="English Captions"
                default={showCaptions}
              />
            )}
            Your browser does not support the video tag.
          </video>

          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={togglePlay} className="text-white hover:bg-white/20">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>

                <Button variant="ghost" size="sm" onClick={toggleMute} className="text-white hover:bg-white/20">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>

                <span className="text-sm">
                  {formatTime(currentTime)} / {duration}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCaptions(!showCaptions)}
                  className={`text-white hover:bg-white/20 ${showCaptions ? "bg-white/20" : ""}`}
                >
                  <ClosedCaptioning className="w-5 h-5" />
                </Button>

                <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                  <Maximize className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Information */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
              <Badge variant="outline" className="mb-2">
                {category.replace("-", " ").toUpperCase()}
              </Badge>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowTranscript(!showTranscript)}
              className="flex items-center gap-2"
            >
              <Languages className="w-4 h-4" />
              {showTranscript ? "Hide" : "Show"} Transcript
            </Button>
          </div>

          {/* Signer Bio */}
          <div className="bg-pink-50 p-4 rounded-lg mb-4">
            <div className="flex items-start gap-3">
              <img src={signer.photo || "/placeholder.svg"} alt={signer.name} className="w-12 h-12 rounded-full" />
              <div>
                <h4 className="font-semibold text-gray-900">{signer.name}</h4>
                <p className="text-sm text-pink-600 mb-2">{signer.credentials}</p>
                <p className="text-sm text-gray-700">{signer.bio}</p>
              </div>
            </div>
          </div>

          {/* Transcript */}
          {showTranscript && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Languages className="w-4 h-4" />
                Full Transcript
              </h4>
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{transcript}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
