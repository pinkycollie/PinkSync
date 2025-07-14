"use client"

import React, { useState, useRef, useEffect } from "react"
import { Play, Pause, X, Maximize2, Minimize2, Volume2, VolumeX } from "lucide-react"
import { usePinkSync } from "@/contexts/pink-sync-context"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface PinkSyncContentProps {
  children: ReactNode
  text?: string // Optional override for the text to be signed
  className?: string
  priority?: number // 1-5, higher means more important content
  id?: string // Unique identifier for this content
}

/**
 * PinkSyncContent Component
 * Transforms text content into ASL videos based on the current PinkSync mode and preferences
 */
export function PinkSyncContent({ children, text, className, priority = 3, id }: PinkSyncContentProps) {
  const { mode, preferences, isEnabled, isPrioritized, getVideoUrl } = usePinkSync()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Extract text content from children if not provided
  const extractText = (children: ReactNode): string => {
    if (typeof children === "string") return children
    if (typeof children === "number") return children.toString()
    if (Array.isArray(children)) return children.map(extractText).join(" ")
    if (React.isValidElement(children)) {
      const childrenProps = children.props as { children?: ReactNode }
      return extractText(childrenProps.children || "")
    }
    return ""
  }

  const contentText = text || extractText(children)
  const contentId = id || `ps-${contentText.substring(0, 20).replace(/\s+/g, "-").toLowerCase()}`
  const videoUrl = getVideoUrl(contentText)

  // Handle video playback
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
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

  // Auto-play when appropriate
  useEffect(() => {
    if (videoRef.current && ((mode === "ambient" && preferences.autoPlayVideos) || isHovered)) {
      videoRef.current.play().catch(() => {
        // Handle autoplay restrictions
        setIsPlaying(false)
      })
    }
  }, [mode, preferences.autoPlayVideos, isHovered])

  // Handle video events
  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

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
  }, [])

  // If PinkSync is not enabled or content is not prioritized, just render the children
  if (!isEnabled || !isPrioritized(priority)) {
    return <>{children}</>
  }

  // Render based on the current mode
  switch (mode) {
    case "ambient":
      return renderAmbientMode()
    case "interactive":
      return renderInteractiveMode()
    case "immersive":
      return renderImmersiveMode()
    default:
      return <>{children}</>
  }

  // Ambient mode: Videos play alongside text
  function renderAmbientMode() {
    return (
      <div
        className={cn(
          "pink-sync-ambient-container relative",
          preferences.videoPosition === "inline" ? "flex items-center gap-2" : "inline-block",
          className,
        )}
        data-ps-content-id={contentId}
        data-ps-priority={priority}
      >
        {preferences.showTextWithVideos && <div className="pink-sync-text">{children}</div>}

        <div
          className={cn(
            "pink-sync-video-container relative overflow-hidden rounded-lg border border-pink-300",
            preferences.videoPosition === "floating" && "absolute top-0 right-0 z-10",
            preferences.videoPosition === "sidebar" && "fixed right-4 top-20 z-50",
            preferences.videoSize === "small" && "w-24 h-18",
            preferences.videoSize === "medium" && "w-32 h-24",
            preferences.videoSize === "large" && "w-48 h-36",
            isExpanded && "fixed inset-4 z-50 flex items-center justify-center bg-black/80 w-auto h-auto",
          )}
        >
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-pink-50 dark:bg-pink-950/20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-500"></div>
            </div>
          )}

          <video
            ref={videoRef}
            src={videoUrl}
            className={cn("h-full w-full object-cover", isExpanded ? "max-h-[70vh] w-auto mx-auto" : "")}
            loop
            muted={isMuted}
            playsInline
            preload="metadata"
            aria-label={`ASL video for: ${contentText}`}
          />

          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/50 to-transparent p-2">
            <button
              onClick={togglePlay}
              className="rounded-full bg-white/20 p-1 text-white backdrop-blur-sm hover:bg-white/30"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={toggleMute}
                className="rounded-full bg-white/20 p-1 text-white backdrop-blur-sm hover:bg-white/30"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
              </button>

              <button
                onClick={toggleExpand}
                className="rounded-full bg-white/20 p-1 text-white backdrop-blur-sm hover:bg-white/30"
                aria-label={isExpanded ? "Minimize video" : "Expand video"}
              >
                {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Interactive mode: Videos appear on hover/click
  function renderInteractiveMode() {
    return (
      <div
        ref={contentRef}
        className={cn("pink-sync-interactive-container relative inline-block", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-ps-content-id={contentId}
        data-ps-priority={priority}
      >
        <span
          className={cn(
            "pink-sync-text inline-block border-b border-dotted border-pink-300 transition-colors",
            isHovered ? "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200" : "",
          )}
        >
          {children}
          <span className="ml-1 inline-flex h-2 w-2 items-center justify-center rounded-full bg-pink-400">
            <span className="sr-only">Sign language available</span>
          </span>
        </span>

        {isHovered && (
          <div
            className={cn(
              "pink-sync-video-popup absolute z-50 rounded-lg border border-pink-300 bg-white p-2 shadow-lg dark:bg-gray-900",
              "bottom-full mb-2", // Default position above the text
            )}
          >
            <div className="relative aspect-video w-64 overflow-hidden rounded-md bg-black">
              <video
                ref={videoRef}
                src={videoUrl}
                className="h-full w-full object-cover"
                loop
                muted={isMuted}
                playsInline
                preload="metadata"
                aria-label={`ASL video for: ${contentText}`}
              />

              {!isPlaying && (
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/30"
                  aria-label="Play video"
                >
                  <Play className="h-12 w-12 text-white" />
                </button>
              )}

              <button
                onClick={() => setIsHovered(false)}
                className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                aria-label="Close video"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {preferences.showTextWithVideos && (
              <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                {contentText.length > 50 ? contentText.substring(0, 50) + "..." : contentText}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // Immersive mode: Videos replace text completely
  function renderImmersiveMode() {
    return (
      <div
        className={cn(
          "pink-sync-immersive-container inline-block",
          preferences.videoSize === "small" && "w-24 h-18",
          preferences.videoSize === "medium" && "w-32 h-24",
          preferences.videoSize === "large" && "w-48 h-36",
          className,
        )}
        data-ps-content-id={contentId}
        data-ps-priority={priority}
      >
        <div className="relative overflow-hidden rounded-lg border border-pink-300 bg-black/5">
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-pink-50 dark:bg-pink-950/20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-500"></div>
            </div>
          )}

          <video
            ref={videoRef}
            src={videoUrl}
            className="h-full w-full object-cover"
            autoPlay={preferences.autoPlayVideos}
            loop
            muted={isMuted}
            playsInline
            preload="metadata"
            aria-label={`ASL video for: ${contentText}`}
          />

          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/50 to-transparent p-2">
            <button
              onClick={togglePlay}
              className="rounded-full bg-white/20 p-1 text-white backdrop-blur-sm hover:bg-white/30"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </button>

            <button
              onClick={toggleMute}
              className="rounded-full bg-white/20 p-1 text-white backdrop-blur-sm hover:bg-white/30"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
            </button>
          </div>

          {/* Small indicator showing this is a video replacement */}
          <div className="absolute right-1 top-1 rounded bg-pink-500/70 px-1 py-0.5 text-[8px] font-bold text-white">
            ASL
          </div>
        </div>
      </div>
    )
  }
}
