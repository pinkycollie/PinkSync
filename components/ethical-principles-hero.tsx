"use client"
import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"

export function EthicalPrinciplesHero() {
  return (
    <section className="bg-gray-100 py-20">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-6">Discover the Ethical Principles of DeafLifeOS</h1>
          <p className="text-lg text-gray-700 mb-8">
            Learn about the core values that guide our community and platform.
          </p>
        </div>

        {/* Embedded Video */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-xl">
            <iframe
              src="https://stream.mux.com/deaflife-intro.m3u8"
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="DeafLifeOS Introduction in ASL"
            />

            {/* Video Overlay Info */}
            <div className="absolute top-4 right-4 bg-black/80 text-white p-3 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-2xl">🤟</span>
                <div>
                  <div className="font-semibold">ASL Introduction</div>
                  <div className="text-xs text-gray-300">Dr. Sarah Martinez, Certified Interpreter</div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Description */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Watch our comprehensive introduction to DeafLifeOS in American Sign Language
            </p>
          </div>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={() => window.open("/introtoDEAFLIFEOS", "_blank")}
            className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 text-lg flex items-center gap-3 mx-auto"
          >
            🤟 Watch Full Video
            <Languages className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
