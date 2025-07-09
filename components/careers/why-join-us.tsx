"use client"

import { motion } from "framer-motion"
import { Heart, Lightbulb, Users, Zap } from "lucide-react"

const reasons = [
  {
    icon: <Heart className="h-8 w-8" />,
    title: "Mission-driven work",
    description: "Build technology that transforms opportunities for deaf developers and creates lasting impact.",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Inclusive culture",
    description: "Experience a workplace designed with deaf accessibility at its core, where everyone belongs.",
  },
  {
    icon: <Lightbulb className="h-8 w-8" />,
    title: "Innovation at the intersection",
    description: "Combine cutting-edge technology with deep accessibility expertise to solve unique challenges.",
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Growth opportunities",
    description:
      "Shape an emerging field and grow your career in a supportive environment that values your development.",
  },
]

export function WhyJoinUs() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Join MBTQ.dev?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're building more than just a platform — we're creating a movement to make development more accessible for
            deaf individuals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-primary-100 p-3 rounded-lg inline-block mb-4 text-primary-600">{reason.icon}</div>
              <h3 className="text-xl font-bold mb-3">{reason.title}</h3>
              <p className="text-gray-600">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
