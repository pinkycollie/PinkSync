"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface SwipeCardProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  leftAction?: {
    icon: React.ReactNode
    label: string
    color: string
  }
  rightAction?: {
    icon: React.ReactNode
    label: string
    color: string
  }
}

export default function SwipeCard({ children, onSwipeLeft, onSwipeRight, leftAction, rightAction }: SwipeCardProps) {
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    setCurrentX(e.touches[0].clientX - startX)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return

    const threshold = 100
    if (currentX > threshold && onSwipeRight) {
      onSwipeRight()
    } else if (currentX < -threshold && onSwipeLeft) {
      onSwipeLeft()
    }

    setCurrentX(0)
    setIsDragging(false)
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background actions */}
      {leftAction && (
        <div className="absolute inset-y-0 left-0 flex items-center justify-start pl-4 bg-red-500 text-white w-full">
          <div className="flex items-center gap-2">
            {leftAction.icon}
            <span className="font-medium">{leftAction.label}</span>
          </div>
        </div>
      )}

      {rightAction && (
        <div className="absolute inset-y-0 right-0 flex items-center justify-end pr-4 bg-green-500 text-white w-full">
          <div className="flex items-center gap-2">
            <span className="font-medium">{rightAction.label}</span>
            {rightAction.icon}
          </div>
        </div>
      )}

      {/* Main card */}
      <div
        className="relative z-10 transition-transform duration-200 ease-out"
        style={{ transform: `translateX(${currentX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Card className="bg-white">
          <CardContent className="p-4">{children}</CardContent>
        </Card>
      </div>
    </div>
  )
}
