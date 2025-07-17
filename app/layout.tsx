import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { performanceOptimizer } from "@/lib/performance/performance-optimizer"
import "./globals.css"

export const metadata = {
  title: "360 Business Magician",
  description: "AI-powered business automation and optimization platform",
    generator: 'v0.dev'
}

// Preload critical resources
if (typeof window !== "undefined") {
  // Preload critical data on client side
  performanceOptimizer.preloadCriticalData().catch(console.error)
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.pinksync.com" />
        <link rel="dns-prefetch" href="https://api.pinksync.com" />

        {/* Performance monitoring */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Performance monitoring
              window.addEventListener('load', function() {
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.register('/sw.js');
                }
              });
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
