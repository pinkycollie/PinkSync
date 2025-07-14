import { PinkSyncToggle } from "@/components/pink-sync-toggle"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold">PinkSync</span>
        <span className="rounded-md bg-pink-500 px-2 py-1 text-xs font-medium text-white">Demo</span>
      </div>
      <div className="flex items-center gap-4">
        <PinkSyncToggle />
      </div>
    </header>
  )
}
