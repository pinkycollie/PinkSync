"use client"

import { useRef, useState, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2 } from "lucide-react"
import { useTopicVideo } from "@/contexts/topic-video-context"
import { usePinkSync } from "@/contexts/pink-sync-context"
import { cn } from "@/lib/utils"

interface TopicVideoDisplayProps {
  topicId: string
  className?: string
  showControls?: boolean
  expandable?: boolean
}

export function TopicVideoDisplay({
  topicId,
  className,
  showControls = true,
  expandable = true,
}: TopicVideoDisplayProps) {
  const { isPinkSyncEnabled } = usePinkSync()
  const { getTopicContent, getTopicPriority } = useTopicVideo()
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Get topic content and priority - must be called unconditionally
  const topicContent = getTopicContent(topicId)
  const priority = getTopicPriority(topicId)

  // Generate a deterministic video source based on the topic ID
  const getVideoSource = (topicId: string) => {
    // Hash the topicId to get a consistent number
    const hash = topicId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 10
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

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  // Determine size based on priority and content length
  const getSize = () => {
    if (isExpanded) return { width: "100%", height: "auto", maxHeight: "70vh" }

    const baseSize = priority * 60 // Base size in pixels
    const contentLength = topicContent.length
    const contentFactor = Math.min(contentLength / 50, 2) // Scale based on content length, max 2x
    const width = Math.max(180, Math.min(400, baseSize * contentFactor)) // Between 180px and 400px

    return {
      width: `${width}px`,
      height: `${width * 0.75}px`,
    }
  }

  // Handle video events
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

  // Don't render anything if PinkSync is disabled or no content
  if (!isPinkSyncEnabled || !topicContent) {
    return null
  }

  const size = getSize()

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-pink-300 bg-black/5",
        isExpanded ? "fixed inset-4 z-50 flex items-center justify-center bg-black/80" : "",
        className,
      )}
      style={isExpanded ? undefined : size}
      title={topicContent} // Show content on hover
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-pink-50 dark:bg-pink-950/20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-500"></div>
        </div>
      )}

      <video
        ref={videoRef}
        src={getVideoSource(topicId)}
        className={cn("h-full w-full object-cover", isExpanded ? "max-h-[70vh] w-auto mx-auto" : "")}
        autoPlay
        loop
        muted={isMuted}
        playsInline
      />

      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/50 to-transparent p-2">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="rounded-full bg-white/20 p-1.5 text-white backdrop-blur-sm hover:bg-white/30"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>

            <button
              onClick={toggleMute}
              className="rounded-full bg-white/20 p-1.5 text-white backdrop-blur-sm hover:bg-white/30"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>

          {expandable && (
            <button
              onClick={toggleExpand}
              className="rounded-full bg-white/20 p-1.5 text-white backdrop-blur-sm hover:bg-white/30"
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          )}
        </div>
      )}

      {/* Topic indicator */}
      <div className="absolute right-2 top-2 rounded bg-pink-500/70 px-2 py-0.5 text-xs font-bold text-white">
        {topicId.split("-")[0].toUpperCase()}
      </div>
    </div>
  )
}
