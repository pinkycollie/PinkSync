import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <Link href="/scanqr" className="mr-4 flex items-center">
          <h1 className="text-xl font-bold text-pink-600">PinkSync</h1>
          <span className="ml-2 rounded-md bg-pink-100 px-2 py-1 text-xs font-medium text-pink-800">ScanQR</span>
        </Link>
        <h2 className="text-lg font-medium">About</h2>
      </div>

      <div className="grid gap-12 md:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">PinkSync: Scan QR</h2>
          <p className="mb-4 text-gray-700">
            PinkSync: Scan QR is an extension of the PinkSync.io ecosystem, dedicated to breaking down communication
            barriers for the Deaf community by transforming static QR codes into dynamic AR holograms that display sign
            language content.
          </p>
          <p className="mb-4 text-gray-700">
            As part of PinkSync's "One Layer, One Accessibility" mission, ScanQR leverages the data + AI engine powering
            real-time sync across apps, APIs, and platforms to ensure universal Deaf accessibility.
          </p>
          <p className="text-gray-700">
            Starting with sign language as our focus allows us to perfect our technology for a specific use case before
            expanding to support multiple languages and communication methods, creating a more inclusive world for
            everyone.
          </p>
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="/placeholder.svg?height=400&width=600&query=Diverse team working on AR sign language technology with pink and purple branding"
            alt="The PinkSync ScanQR team working on AR technology"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      <div className="my-12 border-t border-gray-200 pt-12">
        <h2 className="mb-8 text-2xl font-semibold text-center">How PinkSync: Scan QR Works</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
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
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M7 7h.01" />
                <path d="M17 7h.01" />
                <path d="M7 17h.01" />
                <path d="M17 17h.01" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium">QR Code Creation</h3>
            <p className="text-gray-600">
              We create specialized QR codes that link to sign language content in the PinkSync database. These codes
              can be placed anywhere traditional QR codes are used.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
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
            <h3 className="mb-2 text-lg font-medium">AR Processing</h3>
            <p className="text-gray-600">
              Our app uses PinkSync's AI engine to process the QR code and retrieve the corresponding sign language
              content from our secure cloud database.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
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
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium">Hologram Display</h3>
            <p className="text-gray-600">
              The app displays a 3D hologram of a person signing the content in the user's environment, creating an
              immersive and accessible experience.
            </p>
          </div>
        </div>
      </div>

      <div className="my-12 border-t border-gray-200 pt-12">
        <h2 className="mb-8 text-2xl font-semibold text-center">PinkSync Ecosystem Integration</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-lg bg-pink-50 p-6">
            <h3 className="mb-3 text-xl font-medium">Real-Time Sync</h3>
            <p className="text-gray-700">
              ScanQR is fully integrated with PinkSync's data + AI engine, ensuring real-time synchronization of sign
              language content across all platforms and devices.
            </p>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li className="flex items-center">
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
                  className="mr-2 h-5 w-5 text-pink-600"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Instant content updates across all devices
              </li>
              <li className="flex items-center">
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
                  className="mr-2 h-5 w-5 text-pink-600"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Seamless integration with other PinkSync services
              </li>
              <li className="flex items-center">
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
                  className="mr-2 h-5 w-5 text-pink-600"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                API access for developers and businesses
              </li>
            </ul>
          </div>
          <div className="rounded-lg bg-pink-50 p-6">
            <h3 className="mb-3 text-xl font-medium">Universal Accessibility</h3>
            <p className="text-gray-700">
              As part of PinkSync's "One Layer, One Accessibility" mission, ScanQR ensures that sign language content is
              universally accessible across all digital platforms.
            </p>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li className="flex items-center">
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
                  className="mr-2 h-5 w-5 text-pink-600"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Works with existing QR code infrastructure
              </li>
              <li className="flex items-center">
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
                  className="mr-2 h-5 w-5 text-pink-600"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Compatible with all major devices and platforms
              </li>
              <li className="flex items-center">
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
                  className="mr-2 h-5 w-5 text-pink-600"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Designed for future expansion to multiple languages
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="my-12 border-t border-gray-200 pt-12 text-center">
        <h2 className="mb-4 text-2xl font-semibold">Ready to Experience PinkSync: Scan QR?</h2>
        <p className="mb-6 mx-auto max-w-2xl text-gray-700">
          Join us in creating a more accessible world through innovative AR technology. Try PinkSync ScanQR today and
          see how QR codes can transform into dynamic sign language holograms.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button className="bg-pink-600 hover:bg-pink-700">
            <Link href="/scanqr/scan">Start Scanning</Link>
          </Button>
          <Button variant="outline">
            <Link href="/">Explore PinkSync Ecosystem</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
