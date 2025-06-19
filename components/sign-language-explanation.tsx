"use client"

import { useState, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SignLanguageExplanationProps {
  text: string
  videoUrl?: string
}

export default function SignLanguageExplanation({ text, videoUrl }: SignLanguageExplanationProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  // Generate a placeholder video URL if none provided
  const videoSrc =
    videoUrl ||
    `/placeholder.svg?height=360&width=640&query=sign language explanation for: ${encodeURIComponent(text.substring(0, 50))}`

  useEffect(() => {
    // Simulate video loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <>
            <img
              src={videoSrc || "/placeholder.svg"}
              alt="Sign language explanation"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 flex gap-1">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          </>
        )}
      </div>
      <div className="text-sm">
        <p>{text}</p>
      </div>
    </div>
  )
}
