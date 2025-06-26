"use client"

import { motion } from "framer-motion"
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

interface VisualFeedbackProps {
  message: string
  type: "success" | "error" | "info" | "warning"
  highContrast?: boolean
}

export function VisualFeedback({ message, type, highContrast = false }: VisualFeedbackProps) {
  // Get appropriate colors based on type and user preferences
  const getColors = () => {
    if (highContrast) {
      return {
        success: { bg: "#005500", text: "#FFFFFF", icon: "#FFB0D0" }, // Light pink for high contrast
        error: { bg: "#550000", text: "#FFFFFF", icon: "#FF0000" },
        warning: { bg: "#553300", text: "#FFFFFF", icon: "#FFAA00" },
        info: { bg: "#000055", text: "#FFFFFF", icon: "#7AD7DE" }, // Light teal for high contrast
      }[type]
    }

    return {
      success: { bg: "#FDF2F7", text: "#B02A5E", icon: "#E94D88" }, // Pink theme
      error: { bg: "#FEF2F2", text: "#991B1B", icon: "#EF4444" },
      warning: { bg: "#FFFBEB", text: "#92400E", icon: "#F59E0B" },
      info: { bg: "#F0FBFC", text: "#136A71", icon: "#1EADB8" }, // Teal theme
    }[type]
  }

  const colors = getColors()

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-6 w-6" style={{ color: colors.icon }} />
      case "error":
        return <AlertCircle className="h-6 w-6" style={{ color: colors.icon }} />
      case "warning":
        return <AlertTriangle className="h-6 w-6" style={{ color: colors.icon }} />
      case "info":
        return <Info className="h-6 w-6" style={{ color: colors.icon }} />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        minWidth: "300px",
        maxWidth: "90%",
      }}
    >
      {getIcon()}
      <span className="font-medium">{message}</span>
    </motion.div>
  )
}
