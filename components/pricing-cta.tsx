"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export function PricingCTA() {
  return (
    <section className="py-20 bg-gradient-to-b from-primary-800 to-secondary-800 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise Solutions Tailored to Your Needs</h2>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Flexible pricing designed for organizations of all sizes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20"
          >
            <h3 className="text-2xl font-bold mb-2">Starter</h3>
            <p className="text-purple-200 mb-6">For small to medium businesses</p>

            <div className="mb-6">
              <span className="text-4xl font-bold">$2,500</span>
              <span className="text-purple-200">/month</span>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-300" />
                <span>Up to 5 digital properties</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-300" />
                <span>Basic sign language support</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-300" />
                <span>Standard visual adaptations</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-300" />
                <span>Email support</span>
              </li>
            </ul>

            <Button className="w-full bg-white text-purple-900 hover:bg-purple-100">Get Started</Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-8 border border-purple-200 text-gray-900 transform scale-105 shadow-xl"
          >
            <div className="bg-primary-600 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
              MOST POPULAR
            </div>

            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
            <p className="text-gray-500 mb-6">For mid to large enterprises</p>

            <div className="mb-6">
              <span className="text-4xl font-bold">$8,500</span>
              <span className="text-gray-500">/month</span>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary-600" />
                <span>Up to 25 digital properties</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary-600" />
                <span>Advanced sign language support</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary-600" />
                <span>AI-powered adaptations</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary-600" />
                <span>Compliance monitoring & reporting</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary-600" />
                <span>24/7 priority support</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary-600" />
                <span>Dedicated account manager</span>
              </li>
            </ul>

            <Button className="w-full bg-primary-600 text-white hover:bg-primary-700">Schedule Demo</Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20"
          >
            <h3 className="text-2xl font-bold mb-2">Global</h3>
            <p className="text-purple-200 mb-6">For multinational corporations</p>

            <div className="mb-6">
              <span className="text-4xl font-bold">Custom</span>
              <span className="text-purple-200"> pricing</span>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-300" />
                <span>Unlimited digital properties</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-300" />
                <span>Custom sign language support</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-300" />
                <span>Enterprise AI capabilities</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-300" />
                <span>Global compliance guarantee</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-300" />
                <span>White-glove implementation</span>
              </li>
            </ul>

            <Button variant="outline" className="w-full border-white text-white hover:bg-white/10">
              Contact Sales
            </Button>
          </motion.div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-primary-200 mb-6 max-w-2xl mx-auto">
            Not sure which plan is right for you? Schedule a consultation with our enterprise team to discuss your
            specific needs.
          </p>

          <Button size="lg" className="bg-white text-primary-800 hover:bg-primary-50">
            Book a Consultation
          </Button>
        </div>
      </div>
    </section>
  )
}
