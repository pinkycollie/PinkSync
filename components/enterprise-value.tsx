"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { DollarSign, ShieldCheck, Users } from "lucide-react"

export function EnterpriseValue() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">The Business Case for PinkSync Enterprise</h2>
            <p className="text-xl text-gray-600 mb-8">
              PinkSync isn't just about accessibility—it's about unlocking business value and reducing risk.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="text-green-500 flex-shrink-0">
                  <DollarSign className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">ROI-Focused Design</h3>
                  <p className="text-gray-600">
                    Tap into the $873 billion spending power of the global deaf community while reducing development
                    costs by 60% compared to custom accessibility solutions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-blue-500 flex-shrink-0">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Risk Mitigation</h3>
                  <p className="text-gray-600">
                    Avoid costly accessibility lawsuits and compliance penalties with our continuous monitoring and
                    adaptation system.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-purple-500 flex-shrink-0">
                  <Users className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Brand Enhancement</h3>
                  <p className="text-gray-600">
                    Demonstrate your commitment to inclusion and diversity, strengthening your brand reputation and
                    customer loyalty.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Download Enterprise ROI Report
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold mb-6 text-center">Enterprise ROI Calculator</h3>

              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Development Cost Savings</span>
                    <span className="font-bold text-green-600">$120,000 / year</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div className="bg-green-500 h-2 rounded-full w-[80%]"></div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Legal Risk Reduction</span>
                    <span className="font-bold text-green-600">$350,000 / year</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div className="bg-green-500 h-2 rounded-full w-[65%]"></div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">New Market Revenue</span>
                    <span className="font-bold text-green-600">$280,000 / year</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div className="bg-green-500 h-2 rounded-full w-[75%]"></div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Brand Value Increase</span>
                    <span className="font-bold text-green-600">$180,000 / year</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div className="bg-green-500 h-2 rounded-full w-[60%]"></div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">Total Annual ROI</span>
                    <span className="text-2xl font-bold text-green-600">$930,000</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button className="bg-green-600 hover:bg-green-700">Calculate Your Custom ROI</Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
