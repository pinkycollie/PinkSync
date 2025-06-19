import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import { PreferencesProvider } from "@/components/preferences-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "PinkSYNC Mission Control",
  description: "Comprehensive management platform for Pinky AI operations",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <PreferencesProvider>
              <SidebarProvider>
                {children}
                <Toaster />
              </SidebarProvider>
            </PreferencesProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
