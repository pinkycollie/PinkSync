import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { EnterpriseValue } from "@/components/enterprise-value"
import { LiveDemo } from "@/components/live-demo"
import { Testimonials } from "@/components/testimonials"
import { PricingCTA } from "@/components/pricing-cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <EnterpriseValue />
      <LiveDemo />
      <Testimonials />
      <PricingCTA />
      <Footer />
    </main>
  )
}
