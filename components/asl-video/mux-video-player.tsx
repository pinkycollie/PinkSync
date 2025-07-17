"use client"

import { useState, useRef, useEffect } from "react"
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
  Settings,
  SkipBack,
  SkipForward,
} from "lucide-react"

interface MuxVideoPlayerProps {
  playbackId: string
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
  chapters?: Array<{
    title: string
    startTime: number
    endTime: number
  }>
}

export function MuxVideoPlayer({
  playbackId,
  title,
  signer,
  transcript,
  captions,
  duration,
  category,
  priority = "medium",
  chapters = [],
}: MuxVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showCaptions, setShowCaptions] = useState(true)
  const [showTranscript, setShowTranscript] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [quality, setQuality] = useState("auto")
  const [playbackRate, setPlaybackRate] = useState(1)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Mux stream URL
  const streamUrl = `https://stream.mux.com/${playbackId}.m3u8`
  const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg?width=1280&height=720&fit_mode=smartcrop`

  useEffect(() => {
    // Load Mux player or HLS.js for better browser support
    if (videoRef.current) {
      const video = videoRef.current

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Native HLS support (Safari)
        video.src = streamUrl
      } else {
        // Use HLS.js for other browsers
        import("hls.js").then(({ default: Hls }) => {
          if (Hls.isSupported()) {
            const hls = new Hls({
              enableWorker: true,
              lowLatencyMode: false,
            })
            hls.loadSource(streamUrl)
            hls.attachMedia(video)

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              setIsLoading(false)
            })

            return () => {
              hls.destroy()
            }
          }
        })
      }
    }
  }, [streamUrl])

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

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds
    }
  }

  const jumpToChapter = (startTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const getCurrentChapter = () => {
    return chapters.find((chapter) => currentTime >= chapter.startTime && currentTime <= chapter.endTime)
  }

  return (
    <Card className="w-full max-w-6xl mx-auto border-2 border-pink-200 bg-white shadow-lg">
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

          {/* Current Chapter Indicator */}
          {getCurrentChapter() && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-pink-600/90 text-white px-3 py-1 rounded-full text-sm">
              {getCurrentChapter()?.title}
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <div className="text-white text-lg">Loading video...</div>
            </div>
          )}

          {/* Video Element */}
          <video
            ref={videoRef}
            className="w-full aspect-video"
            poster={thumbnailUrl}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={() => setIsLoading(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            crossOrigin="anonymous"
          >
            {captions && (
              <track
                kind="captions"
                src={`/captions/${playbackId}.vtt`}
                srcLang="en"
                label="English Captions"
                default={showCaptions}
              />
            )}
            Your browser does not support the video tag.
          </video>

          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between text-white mb-2">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={togglePlay} className="text-white hover:bg-white/20">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => skipTime(-10)}
                  className="text-white hover:bg-white/20"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>

                <Button variant="ghost" size="sm" onClick={() => skipTime(10)} className="text-white hover:bg-white/20">
                  <SkipForward className="w-4 h-4" />
                </Button>

                <Button variant="ghost" size="sm" onClick={toggleMute} className="text-white hover:bg-white/20">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>

                <span className="text-sm">
                  {formatTime(currentTime)} / {duration}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={playbackRate}
                  onChange={(e) => {
                    setPlaybackRate(Number(e.target.value))
                    if (videoRef.current) {
                      videoRef.current.playbackRate = Number(e.target.value)
                    }
                  }}
                  className="bg-black/50 text-white text-xs rounded px-2 py-1"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                </select>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCaptions(!showCaptions)}
                  className={`text-white hover:bg-white/20 ${showCaptions ? "bg-white/20" : ""}`}
                >
                  <ClosedCaptioning className="w-5 h-5" />
                </Button>

                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Settings className="w-5 h-5" />
                </Button>

                <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                  <Maximize className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-1">
              <div
                className="bg-pink-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${(currentTime / (videoRef.current?.duration || 1)) * 100}%` }}
              />
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

          {/* Chapters Navigation */}
          {chapters.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Video Chapters</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {chapters.map((chapter, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => jumpToChapter(chapter.startTime)}
                    className={`text-left justify-start ${
                      getCurrentChapter()?.title === chapter.title ? "bg-pink-50 border-pink-300" : ""
                    }`}
                  >
                    <div>
                      <div className="font-medium">{chapter.title}</div>
                      <div className="text-xs text-muted-foreground">{formatTime(chapter.startTime)}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

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
