"use client"

import { useEffect } from "react"

export function useCustomCursor() {
  useEffect(() => {
    // This hook ensures the custom cursor is applied
    // We could add more functionality here if needed
    const body = document.body
    if (!body.classList.contains("i-love-you-cursor")) {
      body.classList.add("i-love-you-cursor")
    }

    return () => {
      // Cleanup if needed
    }
  }, [])
}
