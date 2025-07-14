"use client"

import React from "react"

import { usePinkSync } from "@/contexts/pink-sync-context"
import { VideoWidget } from "@/components/video-widget"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface TextToVideoProps {
  children: ReactNode
  className?: string
  priority?: number
  preserveLayout?: boolean
}

export function TextToVideo({ children, className, priority = 3, preserveLayout = true }: TextToVideoProps) {
  const { isPinkSyncEnabled } = usePinkSync()

  // If PinkSync is not enabled, just render the children
  if (!isPinkSyncEnabled) {
    return <>{children}</>
  }

  // Extract text content from children
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

  const textContent = extractText(children)

  // If no text content, just render the children
  if (!textContent.trim()) {
    return <>{children}</>
  }

  // If preserveLayout is true, create a container with the same dimensions
  if (preserveLayout) {
    return (
      <div className={cn("relative", className)}>
        <div className="invisible">{children}</div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <VideoWidget text={textContent} priority={priority} />
        </div>
      </div>
    )
  }

  // Otherwise, just replace with the video widget
  return <VideoWidget text={textContent} className={className} priority={priority} />
}
