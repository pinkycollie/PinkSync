"use client"

import { motion } from "framer-motion"
import { Globe, Shield, Zap, BarChart, Code, Users } from "lucide-react"

const features = [
  {
    icon: <Globe className="h-8 w-8" />,
    title: "Universal Accessibility Layer",
    description: "One integration delivers accessibility across all your digital properties automatically.",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Instant Compliance",
    description: "Meet global accessibility standards and reduce legal risk with continuous compliance monitoring.",
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "AI-Powered Adaptation",
    description: "Our AI automatically adapts your content for deaf users in real-time, no manual work required.",
  },
  {
    icon: <BarChart className="h-8 w-8" />,
    title: "Accessibility Analytics",
    description: "Gain insights into how deaf users interact with your digital properties and measure improvement.",
  },
  {
    icon: <Code className="h-8 w-8" />,
    title: "Simple Integration",
    description: "Deploy in minutes with our JavaScript SDK, API, or managed service options.",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Global Deaf Community",
    description: "Tap into an underserved market of 466 million potential customers worldwide.",
  },
]

export function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise-Grade Accessibility</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            PinkSync delivers comprehensive deaf accessibility across your entire digital ecosystem with minimal
            integration effort.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-primary-100 p-3 rounded-lg inline-block mb-4 text-primary-600">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
