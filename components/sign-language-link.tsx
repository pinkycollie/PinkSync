"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { Play, X } from "lucide-react"
import { usePinkSync } from "@/contexts/pink-sync-context"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface SignLanguageProps {
  children: ReactNode
  text?: string // Optional override for the text to be signed
  className?: string
  showOnHover?: boolean // Whether to show on hover or click
  position?: "top" | "bottom" | "left" | "right" // Position of the popup
}

export function SignLanguageLink({
  children,
  text,
  className,
  showOnHover = true,
  position = "top",
}: SignLanguageProps) {
  const { isPinkSyncEnabled } = usePinkSync()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

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

  // Generate a deterministic video source based on the text
  const getVideoSource = (text: string) => {
    // Hash the text to get a consistent number
    const hash = text.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 10
    return `/videos/sign-language-${hash + 1}.mp4`
  }

  // Handle click outside to close the popup
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Handle video playback
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

  // Auto-play when opened
  useEffect(() => {
    if (isOpen && videoRef.current && !isPlaying) {
      videoRef.current.play().catch(() => {
        // Handle autoplay restrictions
        setIsPlaying(false)
      })
    }
  }, [isOpen, isPlaying])

  // If PinkSync is not enabled, just render the children normally
  if (!isPinkSyncEnabled) {
    return <>{children}</>
  }

  // Get position classes for the popup
  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "bottom-full mb-2"
      case "bottom":
        return "top-full mt-2"
      case "left":
        return "right-full mr-2"
      case "right":
        return "left-full ml-2"
      default:
        return "bottom-full mb-2"
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block", className)}
      onMouseEnter={showOnHover ? () => setIsOpen(true) : undefined}
      onMouseLeave={showOnHover ? () => setIsOpen(false) : undefined}
      onClick={!showOnHover ? () => setIsOpen(!isOpen) : undefined}
    >
      <span
        className={cn(
          "inline-block border-b border-dotted border-pink-300 transition-colors",
          isOpen ? "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200" : "",
          !showOnHover ? "cursor-pointer" : "",
        )}
      >
        {children}
        <span className="ml-1 inline-flex h-2 w-2 items-center justify-center rounded-full bg-pink-400">
          <span className="sr-only">Sign language available</span>
        </span>
      </span>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 w-64 rounded-lg border border-pink-300 bg-white p-2 shadow-lg dark:bg-gray-900",
            getPositionClasses(),
          )}
        >
          <div className="relative aspect-video overflow-hidden rounded-md bg-black">
            <video
              ref={videoRef}
              src={getVideoSource(contentText)}
              className="h-full w-full object-cover"
              loop
              muted
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {!isPlaying && (
              <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Play className="h-12 w-12 text-white" />
              </button>
            )}

            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
            {contentText.length > 50 ? contentText.substring(0, 50) + "..." : contentText}
          </div>
        </div>
      )}
    </div>
  )
}
