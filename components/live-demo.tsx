"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { SignLanguageVideo } from "@/components/sign-language-video"
import { VisualFeedback } from "@/components/visual-feedback"

export function LiveDemo() {
  const [showSignLanguage, setShowSignLanguage] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [largeText, setLargeText] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  const handleShowFeedback = () => {
    setShowFeedback(true)
    setTimeout(() => setShowFeedback(false), 3000)
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See PinkSync in Action</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience how PinkSync transforms digital interfaces for deaf users in real-time.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold mb-4">Accessibility Controls</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Sign Language Videos</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={showSignLanguage}
                      onChange={() => setShowSignLanguage(!showSignLanguage)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span>High Contrast Mode</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={highContrast}
                      onChange={() => setHighContrast(!highContrast)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span>Large Text</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={largeText}
                      onChange={() => setLargeText(!largeText)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <Button className="w-full bg-primary-600 hover:bg-primary-700" onClick={handleShowFeedback}>
                  Show Visual Feedback
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold mb-4">Integration Options</h3>
              <Tabs defaultValue="js">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="js" className="flex-1">
                    JavaScript
                  </TabsTrigger>
                  <TabsTrigger value="react" className="flex-1">
                    React
                  </TabsTrigger>
                  <TabsTrigger value="api" className="flex-1">
                    API
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="js"
                  className="text-sm font-mono bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-40"
                >
                  {`// Add PinkSync to any website
<script src="https://cdn.pinksync.io/v1/pinksync.js"></script>
<script>
  PinkSync.init({
    apiKey: "YOUR_API_KEY",
    features: ["signLanguage", "visualFeedback"]
  });
</script>`}
                </TabsContent>

                <TabsContent
                  value="react"
                  className="text-sm font-mono bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-40"
                >
                  {`// React/Next.js integration
import { PinkSyncProvider } from '@pinksync/react';

function MyApp({ Component, pageProps }) {
  return (
    <PinkSyncProvider apiKey="YOUR_API_KEY">
      <Component {...pageProps} />
    </PinkSyncProvider>
  );
}`}
                </TabsContent>

                <TabsContent
                  value="api"
                  className="text-sm font-mono bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-40"
                >
                  {`// PinkSync REST API
fetch('https://api.pinksync.io/v1/transform', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    content: "Your content here",
    preferences: {
      signLanguage: "ASL",
      highContrast: true
    }
  })
})`}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <motion.div
            className="lg:w-2/3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div
              className={`border rounded-xl overflow-hidden shadow-lg ${
                highContrast ? "bg-black text-white" : "bg-white"
              }`}
              style={{ fontSize: largeText ? "120%" : "100%" }}
            >
              <div className="border-b p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-sm">{highContrast ? "High Contrast Mode" : "Standard Mode"}</div>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2">
                    <h3 className={`text-xl font-bold mb-4 ${highContrast ? "text-yellow-400" : "text-gray-900"}`}>
                      Enterprise Banking Portal
                    </h3>

                    <p className={`mb-4 ${highContrast ? "text-white" : "text-gray-700"}`}>
                      Welcome to your enterprise banking dashboard. Review your accounts, make transfers, and manage
                      your business finances.
                    </p>

                    <div
                      className={`p-4 rounded-lg mb-4 ${
                        highContrast ? "bg-blue-900 border border-yellow-400" : "bg-blue-50"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className={highContrast ? "text-white" : "text-blue-800"}>Business Checking</span>
                        <span className="font-bold">$24,350.00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={highContrast ? "text-white" : "text-blue-800"}>Business Savings</span>
                        <span className="font-bold">$128,720.50</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        className={`w-full ${
                          highContrast
                            ? "bg-yellow-400 text-black hover:bg-yellow-300"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                        onClick={handleShowFeedback}
                      >
                        Transfer Funds
                      </Button>

                      <Button
                        variant="outline"
                        className={`w-full ${
                          highContrast
                            ? "border-yellow-400 text-yellow-400 hover:bg-blue-900"
                            : "border-blue-600 text-blue-600"
                        }`}
                      >
                        View Statements
                      </Button>
                    </div>
                  </div>

                  <div className="md:w-1/2">
                    {showSignLanguage ? (
                      <div className="rounded-lg overflow-hidden">
                        <SignLanguageVideo
                          src="/videos/banking-demo.mp4"
                          poster="/images/banking-video-poster.jpg"
                          autoPlay
                          loop
                        />
                      </div>
                    ) : (
                      <div
                        className={`rounded-lg overflow-hidden ${
                          highContrast ? "border border-yellow-400" : "border border-gray-200"
                        }`}
                      >
                        <img src="/blue-banking-chart.png" alt="Banking activity chart" className="w-full" />
                      </div>
                    )}

                    <div className="mt-4">
                      <h4 className={`font-bold mb-2 ${highContrast ? "text-yellow-400" : "text-gray-900"}`}>
                        Recent Transactions
                      </h4>
                      <ul className={`space-y-2 ${highContrast ? "text-white" : "text-gray-700"}`}>
                        <li className="flex justify-between">
                          <span>Office Supplies Inc</span>
                          <span className={highContrast ? "text-red-400" : "text-red-600"}>-$245.80</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Client Payment - ABC Corp</span>
                          <span className={highContrast ? "text-green-400" : "text-green-600"}>+$1,200.00</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Monthly Service Fee</span>
                          <span className={highContrast ? "text-red-400" : "text-red-600"}>-$35.00</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {showFeedback && (
          <VisualFeedback message="Transaction initiated successfully!" type="success" highContrast={highContrast} />
        )}
      </div>
    </section>
  )
}
