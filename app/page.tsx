import { EthicalPrinciplesHero } from "@/components/ethical-principles-hero"
import { DeafLifeOSDashboard } from "@/components/deaf-life-os/dashboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <EthicalPrinciplesHero />
      <DeafLifeOSDashboard />
    </main>
  )
}
