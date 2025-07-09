"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { SignLanguageVideo } from "@/components/sign-language-video"
import { useState } from "react"

export function HeroSection() {
  const [showVideo, setShowVideo] = useState(false)

  return (
    <section className="relative bg-gradient-to-b from-primary-800 to-secondary-800 text-white py-24 overflow-hidden">
      {/* Accessibility toggle button */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          onClick={() => setShowVideo(!showVideo)}
        >
          {showVideo ? "Hide Sign Language" : "Show Sign Language"}
        </Button>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Join Our Mission</h1>
            <p className="text-xl mb-8 text-primary-100">
              We're building a revolutionary deaf-first development platform and looking for passionate individuals to
              join our team. Help us transform opportunities for deaf developers worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary-500 hover:bg-primary-600">
                View Open Positions
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10">
                Learn About Our Culture
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {showVideo ? (
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <SignLanguageVideo src="/videos/careers-message.mp4" poster="/images/careers-video-poster.jpg" />
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <img
                  src="/placeholder-fkhrl.png"
                  alt="Diverse team of deaf and hearing developers collaborating"
                  className="w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-6">
                    <p className="text-white font-medium">Our team collaborating on the MBTQ.dev platform</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
