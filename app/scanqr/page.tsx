import Link from "next/link"
import { ArrowRight, Scan, Languages, Accessibility } from "lucide-react"

export default function ScanQRPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center">
            <h1 className="text-xl font-bold text-white">PinkSync.io</h1>
            <span className="ml-2 rounded-md bg-white/20 px-2 py-1 text-xs font-medium text-white">Scan QR</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="/scanqr/scan" className="text-sm font-medium text-white hover:text-pink-100">
              Scan QR
            </Link>
            <Link href="/scanqr/library" className="text-sm font-medium text-white hover:text-pink-100">
              Sign Library
            </Link>
            <Link href="/scanqr/about" className="text-sm font-medium text-white hover:text-pink-100">
              About
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-pink-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-md bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800">
                  PinkSync Extension
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  QR Codes to Sign Language Holograms
                </h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Transform static QR codes into dynamic AR holograms displaying sign language, making content
                  accessible to the Deaf community through the PinkSync ecosystem.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/scanqr/scan"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-pink-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-pink-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pink-700"
                  >
                    Start Scanning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    href="/scanqr/demo"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950"
                  >
                    View Demo
                  </Link>
                </div>
              </div>
              <div className="mx-auto w-full max-w-sm lg:max-w-none">
                <div className="aspect-video overflow-hidden rounded-xl bg-gray-100 object-cover shadow-lg">
                  <img
                    src="/ar-sign-language-hologram.png"
                    alt="AR hologram showing sign language from QR code"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-lg bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800">
                  <Accessibility className="h-4 w-4" />
                  <span>Accessibility First</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl">Breaking Communication Barriers</h3>
                <p className="text-gray-500 md:text-lg/relaxed">
                  Our technology bridges the gap between written content and sign language, creating a more inclusive
                  world for the Deaf community through PinkSync's data + AI engine.
                </p>
              </div>
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-lg bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800">
                  <Languages className="h-4 w-4" />
                  <span>Multilingual Ready</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl">Designed for Expansion</h3>
                <p className="text-gray-500 md:text-lg/relaxed">
                  Starting with sign language as our focus, PinkSync's ScanQR platform is built to eventually support
                  multiple languages and communication methods.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">How It Works</h2>
              <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Transform any QR code into an interactive sign language hologram in three simple steps
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-12 pt-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
                  <Scan className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold">Scan QR Code</h3>
                <p className="text-gray-500">
                  Use PinkSync: Scan QR to scan any QR code that has been registered with sign language content.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-pink-600"
                  >
                    <path d="M12 2a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1Z" />
                    <path d="M12 17a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0v-3a1 1 0 0 1 1-1Z" />
                    <path d="M2 12a1 1 0 0 1 1-1h4a1 1 0 0 1 0 2H3a1 1 0 0 1-1-1Z" />
                    <path d="M17 12a1 1 0 0 1 1-1h3a1 1 0 0 1 0 2h-3a1 1 0 0 1-1-1Z" />
                    <path d="m4.93 4.93-.07.07a1 1 0 0 0 1.41 1.41l.07-.07a1 1 0 0 0-1.41-1.41Z" />
                    <path d="m17.66 17.66-.07.07a1 1 0 0 0 1.41 1.41l.07-.07a1 1 0 1 0-1.41-1.41Z" />
                    <path d="m4.93 19.07.07-.07a1 1 0 0 1 1.41 1.41l-.07.07a1 1 0 0 1-1.41-1.41Z" />
                    <path d="m17.66 6.34.07-.07a1 1 0 0 1 1.41 1.41l-.07.07a1 1 0 0 1-1.41-1.41Z" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Process AR</h3>
                <p className="text-gray-500">
                  PinkSync's AI engine processes the QR code and prepares the corresponding sign language hologram.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-pink-600"
                  >
                    <path d="M14 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2v-2" />
                    <path d="M20 12H8" />
                    <path d="m15 7 5 5-5 5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">View Hologram</h3>
                <p className="text-gray-500">
                  Watch as the sign language hologram appears in augmented reality, providing accessible content.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-white">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center">
              <div className="text-xl font-bold text-pink-600">PinkSync.io</div>
              <span className="ml-2 rounded-md bg-pink-100 px-2 py-1 text-xs font-medium text-pink-800">Scan QR</span>
            </div>
            <p className="text-sm text-gray-500">
              One Layer, One Accessibility: Making digital content accessible through sign language AR holograms.
            </p>
          </div>
          <div className="flex-1 space-y-4">
            <div className="font-medium">Quick Links</div>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/scanqr/scan" className="hover:underline">
                Scan QR
              </Link>
              <Link href="/scanqr/library" className="hover:underline">
                Sign Library
              </Link>
              <Link href="/scanqr/about" className="hover:underline">
                About
              </Link>
              <Link href="/scanqr/contact" className="hover:underline">
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex-1 space-y-4">
            <div className="font-medium">PinkSync Ecosystem</div>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/" className="hover:underline">
                PinkSync Home
              </Link>
              <Link href="/api" className="hover:underline">
                API Documentation
              </Link>
              <Link href="/accessibility" className="hover:underline">
                Accessibility Statement
              </Link>
            </nav>
          </div>
        </div>
        <div className="border-t py-6 text-center text-sm text-gray-500">
          <div className="container">© 2024 PinkSync.io. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
