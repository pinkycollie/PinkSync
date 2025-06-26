import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import MobileAccessibilityToolbar from "@/components/mobile/mobile-accessibility-toolbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VisualDesk - AI-Powered Virtual Assistant for Deaf Users",
  description: "We do it for you — from form to finish, with zero confusion.",
  keywords: "deaf, accessibility, AI, virtual assistant, forms, interpretation",
  authors: [{ name: "MBTQ Universe" }],
  creator: "MBTQ Universe",
  publisher: "PinkSync",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e11d48" },
    { media: "(prefers-color-scheme: dark)", color: "#be123c" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VisualDesk" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        {children}
        <MobileAccessibilityToolbar />
      </body>
    </html>
  )
}
