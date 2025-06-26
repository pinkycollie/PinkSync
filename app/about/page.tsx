import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">About SignAR</h1>

      <div className="grid gap-12 md:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Our Mission</h2>
          <p className="mb-4 text-gray-700">
            SignAR is dedicated to breaking down communication barriers for the Deaf community by transforming static QR
            codes into dynamic AR holograms that display sign language content.
          </p>
          <p className="mb-4 text-gray-700">
            We believe that accessibility should be seamless and integrated into everyday experiences. Our technology
            enables businesses, educational institutions, and public spaces to provide sign language accessibility
            without requiring specialized hardware or extensive training.
          </p>
          <p className="text-gray-700">
            Starting with sign language as our focus allows us to perfect our technology for a specific use case before
            expanding to support multiple languages and communication methods, creating a more inclusive world for
            everyone.
          </p>
        </div>
        <div className="rounded-lg overflow-hidden">
          <img
            src="/placeholder.svg?height=400&width=600&query=Diverse team working on AR sign language technology"
            alt="The SignAR team working on AR technology"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      <div className="my-12 border-t border-gray-200 pt-12">
        <h2 className="mb-8 text-2xl font-semibold text-center">How SignAR Works</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
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
                className="h-8 w-8 text-purple-600"
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
              We create specialized QR codes that link to sign language content in our database. These codes can be
              placed anywhere traditional QR codes are used.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
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
                className="h-8 w-8 text-purple-600"
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
              Our app uses augmented reality technology to process the QR code and retrieve the corresponding sign
              language content from our secure cloud database.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
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
                className="h-8 w-8 text-purple-600"
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
        <h2 className="mb-8 text-2xl font-semibold text-center">Our Technology</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-lg bg-purple-50 p-6">
            <h3 className="mb-3 text-xl font-medium">AR Framework</h3>
            <p className="text-gray-700">
              SignAR uses cutting-edge augmented reality frameworks to create realistic and responsive sign language
              holograms that appear in the user's physical environment.
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
                  className="mr-2 h-5 w-5 text-purple-600"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                WebXR for cross-platform compatibility
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
                  className="mr-2 h-5 w-5 text-purple-600"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                3D rendering optimized for mobile devices
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
                  className="mr-2 h-5 w-5 text-purple-600"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Real-time lighting and environment mapping
              </li>
            </ul>
          </div>
          <div className="rounded-lg bg-purple-50 p-6">
            <h3 className="mb-3 text-xl font-medium">Sign Language Database</h3>
            <p className="text-gray-700">
              Our extensive database of sign language content is created by native signers and linguistic experts to
              ensure accuracy and cultural relevance.
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
                  className="mr-2 h-5 w-5 text-purple-600"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Multiple sign languages supported
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
                  className="mr-2 h-5 w-5 text-purple-600"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Context-specific vocabulary and expressions
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
                  className="mr-2 h-5 w-5 text-purple-600"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Regular updates with new content
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="my-12 border-t border-gray-200 pt-12 text-center">
        <h2 className="mb-4 text-2xl font-semibold">Ready to Experience SignAR?</h2>
        <p className="mb-6 mx-auto max-w-2xl text-gray-700">
          Join us in creating a more accessible world through innovative AR technology. Try SignAR today and see how QR
          codes can transform into dynamic sign language holograms.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Link href="/scan">Start Scanning</Link>
          </Button>
          <Button variant="outline">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
