"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import type { DeveloperSignVideo } from "@/types/developer-sign-language"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, Download } from "lucide-react"

interface VideoPlayerProps {
  video: DeveloperSignVideo
  autoPlay?: boolean
  loop?: boolean
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onDownload?: () => void
}

export function VideoPlayer({
  video,
  autoPlay = false,
  loop = false,
  onPlay,
  onPause,
  onEnded,
  onDownload,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime)
    }

    const handleDurationChange = () => {
      setDuration(videoElement.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      if (onEnded) onEnded()
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    videoElement.addEventListener("timeupdate", handleTimeUpdate)
    videoElement.addEventListener("durationchange", handleDurationChange)
    videoElement.addEventListener("ended", handleEnded)
    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate)
      videoElement.removeEventListener("durationchange", handleDurationChange)
      videoElement.removeEventListener("ended", handleEnded)
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [onEnded])

  const togglePlay = () => {
    const videoElement = videoRef.current
    if (!videoElement) return

    if (isPlaying) {
      videoElement.pause()
      setIsPlaying(false)
      if (onPause) onPause()
    } else {
      videoElement.play()
      setIsPlaying(true)
      if (onPlay) onPlay()
    }
  }

  const toggleMute = () => {
    const videoElement = videoRef.current
    if (!videoElement) return

    videoElement.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const newTime = Number.parseFloat(e.target.value)
    videoElement.currentTime = newTime
    setCurrentTime(newTime)
  }

  const toggleFullscreen = () => {
    const videoElement = videoRef.current
    if (!videoElement) return

    if (!document.fullscreenElement) {
      videoElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  const skipBackward = () => {
    const videoElement = videoRef.current
    if (!videoElement) return

    videoElement.currentTime = Math.max(0, videoElement.currentTime - 5)
  }

  const skipForward = () => {
    const videoElement = videoRef.current
    if (!videoElement) return

    videoElement.currentTime = Math.min(videoElement.duration, videoElement.currentTime + 5)
  }

  const handleDownload = () => {
    if (onDownload) onDownload()

    // Create a temporary anchor element to trigger download
    const a = document.createElement("a")
    a.href = video.blobUrl
    a.download = video.filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <video
            ref={videoRef}
            src={video.blobUrl}
            poster={video.thumbnailUrl || undefined}
            autoPlay={autoPlay}
            loop={loop}
            muted={isMuted}
            playsInline
            className="w-full h-auto"
            aria-label={`Video: ${video.title}`}
          />

          <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="flex-grow h-2 rounded-full bg-gray-700 appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                aria-label="Video progress"
              />
              <span className="text-white text-xs">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={skipBackward}
                  aria-label="Skip backward 5 seconds"
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={skipForward}
                  aria-label="Skip forward 5 seconds"
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDownload}
                  aria-label="Download video"
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  <Download className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
