"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"

interface VisualFeedbackProps {
  type: "signin" | "signup" | "signout" | "error" | "success"
  message?: string
}

export function VisualFeedback({ type, message }: VisualFeedbackProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isVibrating, setIsVibrating] = useState(false)

  useEffect(() => {
    setIsVisible(true)

    // Trigger vibration if supported
    if ("vibrate" in navigator) {
      if (type === "error") {
        navigator.vibrate([100, 50, 100])
      } else if (type === "success") {
        navigator.vibrate(200)
      }
    }

    // Hide after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [type])

  const getIcon = () => {
    switch (type) {
      case "signin":
        return <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      case "signup":
        return <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
      case "signout":
        return <CheckCircle className="h-8 w-8 text-gray-500" />
      case "error":
        return <XCircle className="h-8 w-8 text-red-500" />
      case "success":
        return <CheckCircle className="h-8 w-8 text-green-500" />
      default:
        return <AlertCircle className="h-8 w-8 text-yellow-500" />
    }
  }

  const getColor = () => {
    switch (type) {
      case "signin":
        return "bg-blue-100 border-blue-300"
      case "signup":
        return "bg-green-100 border-green-300"
      case "signout":
        return "bg-gray-100 border-gray-300"
      case "error":
        return "bg-red-100 border-red-300"
      case "success":
        return "bg-green-100 border-green-300"
      default:
        return "bg-yellow-100 border-yellow-300"
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`p-4 rounded-lg border ${getColor()} flex items-center justify-center gap-3 w-full`}
        >
          {getIcon()}
          <span className="text-sm font-medium">{message || getDefaultMessage(type)}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function getDefaultMessage(type: string): string {
  switch (type) {
    case "signin":
      return "Signing in to your account..."
    case "signup":
      return "Creating your account..."
    case "signout":
      return "You have been signed out"
    case "error":
      return "An error occurred"
    case "success":
      return "Operation completed successfully"
    default:
      return "Processing your request"
  }
}
