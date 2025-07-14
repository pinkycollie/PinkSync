import type React from "react"
import { DashboardHeader } from "@/components/dashboard-header"

export default function ASLRecognitionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardHeader />
      <main className="flex-1">{children}</main>
    </div>
  )
}
