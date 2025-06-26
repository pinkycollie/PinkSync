"use client"

import { useRef, useEffect } from "react"

interface SignLanguageVideoProps {
  src: string
  poster?: string
  autoPlay?: boolean
  loop?: boolean
  controls?: boolean
  width?: string | number
  height?: string | number
}

export function SignLanguageVideo({
  src,
  poster,
  autoPlay = false,
  loop = true,
  controls = true,
  width = "100%",
  height = "auto",
}: SignLanguageVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    if (autoPlay) {
      // Try to autoplay
      const playPromise = videoElement.play()

      // Handle autoplay restrictions
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Auto-play was prevented
          console.log("Autoplay prevented:", error)
          // Show a play button or other UI to let the user start playback manually
        })
      }
    }
  }, [autoPlay])

  return (
    <div className="pinksync-sign-language-video">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        controls={controls}
        width={width}
        height={height}
        className="w-full h-auto rounded-lg"
        playsInline
      >
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
