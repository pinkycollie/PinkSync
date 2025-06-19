import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <SidebarInset className="flex flex-col">
        <header className="flex h-16 items-center border-b px-6">
          <SidebarTrigger className="mr-4" />
          <h1 className="text-xl font-semibold">Mission Control Panel</h1>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </div>
  )
}
