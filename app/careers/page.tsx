import type { Metadata } from "next"
import { HeroSection } from "@/components/careers/hero-section"
import { OpenPositions } from "@/components/careers/open-positions"
import { WhyJoinUs } from "@/components/careers/why-join-us"
import { OurValues } from "@/components/careers/our-values"
import { TeamTestimonials } from "@/components/careers/team-testimonials"
import { ApplicationProcess } from "@/components/careers/application-process"
import { FAQ } from "@/components/careers/faq"
import { ContactCTA } from "@/components/careers/contact-cta"

export const metadata: Metadata = {
  title: "Careers at MBTQ.dev | Join Our Deaf-First Development Platform",
  description:
    "Join our mission to build a revolutionary deaf-first development platform. We're hiring across engineering, design, content, and operations.",
}

export default function CareersPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <WhyJoinUs />
      <OurValues />
      <OpenPositions />
      <TeamTestimonials />
      <ApplicationProcess />
      <FAQ />
      <ContactCTA />
    </main>
  )
}
