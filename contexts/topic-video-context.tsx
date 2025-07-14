"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { usePinkSync } from "@/contexts/pink-sync-context"

type TopicMap = {
  [topicId: string]: {
    content: string[]
    priority: number
  }
}

type TopicVideoContextType = {
  registerContent: (topicId: string, content: string, priority?: number) => void
  getTopicContent: (topicId: string) => string
  getTopicPriority: (topicId: string) => number
}

const TopicVideoContext = createContext<TopicVideoContextType | undefined>(undefined)

export function TopicVideoProvider({ children }: { children: React.ReactNode }) {
  const { isPinkSyncEnabled } = usePinkSync()
  const [topics, setTopics] = useState<TopicMap>({})

  // Reset topics when PinkSync is toggled off
  useEffect(() => {
    if (!isPinkSyncEnabled) {
      setTopics({})
    }
  }, [isPinkSyncEnabled])

  // Use useCallback to ensure function reference stability
  const registerContent = useCallback((topicId: string, content: string, priority = 3) => {
    if (!content.trim()) return

    setTopics((prevTopics) => {
      const existingTopic = prevTopics[topicId] || { content: [], priority: priority }

      // Only add content if it's not already included
      if (!existingTopic.content.includes(content)) {
        return {
          ...prevTopics,
          [topicId]: {
            content: [...existingTopic.content, content],
            priority: Math.max(existingTopic.priority, priority), // Use highest priority
          },
        }
      }

      return prevTopics
    })
  }, [])

  // Use useCallback for these functions too
  const getTopicContent = useCallback(
    (topicId: string): string => {
      const topic = topics[topicId]
      if (!topic) return ""

      // Join all content for this topic into a single string
      return topic.content.join(" • ")
    },
    [topics],
  )

  const getTopicPriority = useCallback(
    (topicId: string): number => {
      return topics[topicId]?.priority || 3
    },
    [topics],
  )

  return (
    <TopicVideoContext.Provider value={{ registerContent, getTopicContent, getTopicPriority }}>
      {children}
    </TopicVideoContext.Provider>
  )
}

export function useTopicVideo() {
  const context = useContext(TopicVideoContext)
  if (context === undefined) {
    throw new Error("useTopicVideo must be used within a TopicVideoProvider")
  }
  return context
}
