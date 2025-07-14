import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { PinkSyncProvider } from "@/contexts/pink-sync-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PinkSync Demo",
  description: "Demonstration of PinkSync ASL video integration",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <PinkSyncProvider>{children}</PinkSyncProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
