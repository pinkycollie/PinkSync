"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "./dashboard-header"
import { GovernmentModule } from "./modules/government-module"
import { FinancialModule } from "./modules/financial-module"
import { EducationModule } from "./modules/education-module"
import { HealthModule } from "./modules/health-module"
import { CommunityModule } from "./modules/community-module"
import { DashboardOverview } from "./dashboard-overview"
import { DeafAuthProvider } from "./providers/deaf-auth-provider"
import { FibonRoseTrustProvider } from "./providers/fibon-rose-trust-provider"
import { AccessibilityPanel } from "./accessibility-panel"
import { NotificationsPanel } from "./notifications-panel"
import { motion, AnimatePresence } from "framer-motion"

export function DeafLifeOSDashboard() {
  const [showAccessibility, setShowAccessibility] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <DeafAuthProvider>
      <FibonRoseTrustProvider>
        <div className="flex min-h-screen flex-col">
          <DashboardHeader
            onAccessibilityToggle={() => setShowAccessibility(!showAccessibility)}
            onNotificationsToggle={() => setShowNotifications(!showNotifications)}
          />

          {showAccessibility && <AccessibilityPanel onClose={() => setShowAccessibility(false)} />}

          {showNotifications && <NotificationsPanel onClose={() => setShowNotifications(false)} />}

          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <DashboardOverview />

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-12 bg-gray-50 rounded-lg p-1 transition-all duration-200">
                  <TabsTrigger
                    value="overview"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 hover:bg-gray-100 data-[state=active]:hover:bg-white"
                  >
                    <span className="hidden md:inline">Overview</span>
                    <span className="inline md:hidden">📊</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="government"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 hover:bg-gray-100 data-[state=active]:hover:bg-white"
                  >
                    <span className="hidden md:inline">Government</span>
                    <span className="inline md:hidden">🏛️</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="financial"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 hover:bg-gray-100 data-[state=active]:hover:bg-white"
                  >
                    <span className="hidden md:inline">Financial</span>
                    <span className="inline md:hidden">💰</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="education"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 hover:bg-gray-100 data-[state=active]:hover:bg-white"
                  >
                    <span className="hidden md:inline">Education</span>
                    <span className="inline md:hidden">🎓</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="health"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 hover:bg-gray-100 data-[state=active]:hover:bg-white"
                  >
                    <span className="hidden md:inline">Health</span>
                    <span className="inline md:hidden">🏥</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="community"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 hover:bg-gray-100 data-[state=active]:hover:bg-white"
                  >
                    <span className="hidden md:inline">Community</span>
                    <span className="inline md:hidden">👥</span>
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  <AnimatePresence mode="wait">
                    <TabsContent value="overview" className="mt-0">
                      <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <DashboardOverview detailed />
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="government" className="mt-0">
                      <motion.div
                        key="government"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <GovernmentModule />
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="financial" className="mt-0">
                      <motion.div
                        key="financial"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <FinancialModule />
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="education" className="mt-0">
                      <motion.div
                        key="education"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <EducationModule />
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="health" className="mt-0">
                      <motion.div
                        key="health"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <HealthModule />
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="community" className="mt-0">
                      <motion.div
                        key="community"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <CommunityModule />
                      </motion.div>
                    </TabsContent>
                  </AnimatePresence>
                </div>
              </Tabs>
            </div>
          </main>
        </div>
      </FibonRoseTrustProvider>
    </DeafAuthProvider>
  )
}
