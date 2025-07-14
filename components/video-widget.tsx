"use client"

import { useRef, useEffect, useState } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoWidgetProps {
  text: string
  className?: string
  autoPlay?: boolean
  loop?: boolean
  priority?: number // 1-5, higher means more prominent video
}

export function VideoWidget({ text, className, autoPlay = true, loop = true, priority = 3 }: VideoWidgetProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  // Generate a deterministic video source based on the text content
  const getVideoSource = (text: string) => {
    // Hash the text to get a consistent number
    const hash = text.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 10

    // Use the hash to select a video
    return `/videos/sign-language-${hash + 1}.mp4`
  }

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

  useEffect(() => {
    const videoElement = videoRef.current

    if (videoElement) {
      const handlePlay = () => setIsPlaying(true)
      const handlePause = () => setIsPlaying(false)
      const handleLoadedData = () => setIsLoaded(true)

      videoElement.addEventListener("play", handlePlay)
      videoElement.addEventListener("pause", handlePause)
      videoElement.addEventListener("loadeddata", handleLoadedData)

      return () => {
        videoElement.removeEventListener("play", handlePlay)
        videoElement.removeEventListener("pause", handlePause)
        videoElement.removeEventListener("loadeddata", handleLoadedData)
      }
    }
  }, [])

  // Determine size based on priority and content length
  const getSize = () => {
    const baseSize = priority * 50 // Base size in pixels
    const textFactor = Math.min(text.length / 20, 2) // Scale based on text length, max 2x
    return Math.max(100, Math.min(300, baseSize * textFactor)) // Between 100px and 300px
  }

  const size = getSize()

  return (
    <div
      className={cn("relative inline-block overflow-hidden rounded-lg border border-pink-300 bg-black/5", className)}
      style={{ width: size, height: size * 0.75 }}
      title={text} // Show original text on hover
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-pink-50 dark:bg-pink-950/20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-500"></div>
        </div>
      )}

      <video
        ref={videoRef}
        src={getVideoSource(text)}
        className="h-full w-full object-cover"
        autoPlay={autoPlay}
        loop={loop}
        muted={isMuted}
        playsInline
      />

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/50 to-transparent p-2">
        <button
          onClick={togglePlay}
          className="rounded-full bg-white/20 p-1 text-white backdrop-blur-sm hover:bg-white/30"
        >
          {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        </button>

        <button
          onClick={toggleMute}
          className="rounded-full bg-white/20 p-1 text-white backdrop-blur-sm hover:bg-white/30"
        >
          {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
        </button>
      </div>

      {/* Small indicator showing this is a video replacement */}
      <div className="absolute right-1 top-1 rounded bg-pink-500/70 px-1 py-0.5 text-[8px] font-bold text-white">
        ASL
      </div>
    </div>
  )
}
