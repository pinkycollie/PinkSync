import { VCodeInterface } from "@/components/vcode/vcode-interface"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "VCode - Visual Contract Evidence | PinkSync",
  description: "Generate legally-binding visual contract evidence with ASL interpretation and accessibility features",
  keywords: "VCode, visual contracts, ASL, accessibility, legal evidence, deaf rights",
}

export default function VCodePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <VCodeInterface />
    </div>
  )
}
