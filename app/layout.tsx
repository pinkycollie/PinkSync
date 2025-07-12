import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "vCode API - PinkSync",
  description: "Video-Coded Accessibility Ledger API for sign language verification",
  keywords: ["accessibility", "sign language", "ASL", "video verification", "deaf", "API"],
  authors: [{ name: "PinkSync", url: "https://pinksync.io" }],
  openGraph: {
    title: "vCode API - PinkSync",
    description: "Video-Coded Accessibility Ledger API for sign language verification",
    url: "https://vcode.pinksync.io",
    siteName: "vCode API",
    type: "website",
  },
  robots: {
    index: false, // API service, don't index
    follow: false,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">{children}</div>
      </body>
    </html>
  )
}
