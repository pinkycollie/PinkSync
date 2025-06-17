import { VCodeDashboard } from "@/components/vcode-dashboard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "VCode - Visual Contract Evidence | DEAF FIRST Platform",
  description: "Generate legally-binding visual contract evidence with ASL interpretation and accessibility features",
  keywords: "VCode, visual contracts, ASL, accessibility, legal evidence, deaf rights, contract protection",
}

export default function VCodeHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <VCodeDashboard />
    </div>
  )
}
