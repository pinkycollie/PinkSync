"use client"
import { useCustomCursor } from "@/hooks/use-custom-cursor"
import { PinkSyncProvider } from "@/contexts/pink-sync-context"
import type React from "react"

function CustomCursorProvider({ children }: { children: React.ReactNode }) {
  useCustomCursor()
  return <>{children}</>
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <PinkSyncProvider>
      <CustomCursorProvider>{children}</CustomCursorProvider>
    </PinkSyncProvider>
  )
}
