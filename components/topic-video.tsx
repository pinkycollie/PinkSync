"use client"

import React, { useEffect, useCallback } from "react"
import { useTopicVideo } from "@/contexts/topic-video-context"
import { usePinkSync } from "@/contexts/pink-sync-context"
import type { ReactNode } from "react"

interface TopicVideoProps {
  children: ReactNode
  topicId: string
  priority?: number
}

export function TopicVideo({ children, topicId, priority = 3 }: TopicVideoProps) {
  const { isPinkSyncEnabled } = usePinkSync()
  const { registerContent } = useTopicVideo()

  // Extract text content from children - use useCallback for stability
  const extractText = useCallback((children: ReactNode): string => {
    if (typeof children === "string") return children
    if (typeof children === "number") return children.toString()
    if (Array.isArray(children)) return children.map(extractText).join(" ")
    if (React.isValidElement(children)) {
      const childrenProps = children.props as { children?: ReactNode }
      return extractText(childrenProps.children || "")
    }
    return ""
  }, [])

  // Get text content once
  const textContent = extractText(children)

  // Register this content with the topic when mounted
  useEffect(() => {
    if (isPinkSyncEnabled && textContent) {
      registerContent(topicId, textContent, priority)
    }
  }, [isPinkSyncEnabled, topicId, textContent, priority, registerContent])

  // Just render the children normally
  return <>{children}</>
}
