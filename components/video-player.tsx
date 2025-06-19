"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { formatDuration } from "@/lib/utils"

interface VideoPlayerProps {
  videoId: string
  title: string
  poster?: string
  sources?: Array<{
    src: string
    type: string
  }>
}

export function VideoPlayer({ videoId, title, poster, sources }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [loading, setLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Default sources if none provided
  const defaultSources = [
    {
      src: `https://example-cdn.com/videos/${videoId}/720p.mp4`,
      type: "video/mp4",
    },
    {
      src: `https://example-cdn.com/videos/${videoId}/720p.webm`,
      type: "video/webm",
    },
  ]

  const videoSources = sources || defaultSources
  const videoPoster = poster || `/placeholder.svg?height=720&width=1280&query=video thumbnail for ${title}`

  useEffect(() => {
    const video = videoRef.current

    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setLoading(false)
    }

    const handleEnded = () => {
      setPlaying(false)
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("ended", handleEnded)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current

    if (!video) return

    if (playing) {
      video.pause()
    } else {
      video.play()
    }

    setPlaying(!playing)
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current

    if (!video) return

    video.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current

    if (!video) return

    const newVolume = value[0]
    video.volume = newVolume
    setVolume(newVolume)

    if (newVolume === 0) {
      setMuted(true)
    } else if (muted) {
      setMuted(false)
    }
  }

  const toggleMute = () => {
    const video = videoRef.current

    if (!video) return

    video.muted = !muted
    setMuted(!muted)
  }

  const handleFullscreen = () => {
    const video = videoRef.current

    if (!video) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      video.requestFullscreen()
    }
  }

  const skipBackward = () => {
    const video = videoRef.current

    if (!video) return

    video.currentTime = Math.max(0, video.currentTime - 10)
  }

  const skipForward = () => {
    const video = videoRef.current

    if (!video) return

    video.currentTime = Math.min(video.duration, video.currentTime + 10)
  }

  return (
    <div className="relative overflow-hidden rounded-lg bg-black">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
        </div>
      )}

      <video ref={videoRef} className="aspect-video w-full" poster={videoPoster} preload="metadata" playsInline>
        {videoSources.map((source, index) => (
          <source key={index} src={source.src} type={source.type} />
        ))}
        Your browser does not support the video tag.
      </video>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={togglePlay}>
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span className="sr-only">{playing ? "Pause" : "Play"}</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={skipBackward}
              >
                <SkipBack className="h-4 w-4" />
                <span className="sr-only">Skip backward</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={skipForward}
              >
                <SkipForward className="h-4 w-4" />
                <span className="sr-only">Skip forward</span>
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={toggleMute}
                >
                  {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  <span className="sr-only">{muted ? "Unmute" : "Mute"}</span>
                </Button>

                <Slider
                  value={[muted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="w-20"
                />
              </div>

              <span className="text-xs text-white">
                {formatDuration(Math.floor(currentTime))} / {formatDuration(Math.floor(duration))}
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={handleFullscreen}
            >
              <Maximize className="h-4 w-4" />
              <span className="sr-only">Fullscreen</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
