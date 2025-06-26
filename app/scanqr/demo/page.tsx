"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function DemoPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const totalSteps = 4

  const nextStep = () => {
    if (step < totalSteps) {
      setLoading(true)
      setTimeout(() => {
        setStep(step + 1)
        setLoading(false)
      }, 1000)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.push("/scanqr")} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Link href="/scanqr" className="mr-4 flex items-center">
            <h1 className="text-xl font-bold text-pink-600">PinkSync</h1>
            <span className="ml-2 rounded-md bg-pink-100 px-2 py-1 text-xs font-medium text-pink-800">Scan QR</span>
          </Link>
          <h2 className="text-lg font-medium">Interactive Demo</h2>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <Card className="mb-6 border-pink-200 bg-pink-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-pink-100 p-2">
                <Info className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <h3 className="font-medium text-pink-900">Demo Mode</h3>
                <p className="mt-1 text-sm text-pink-700">
                  This is a simulated demonstration of how PinkSync: Scan QR transforms QR codes into sign language
                  holograms.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8 flex justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`relative flex h-2 flex-1 ${index === 0 ? "rounded-l-full" : ""} ${
                index === totalSteps - 1 ? "rounded-r-full" : ""
              } ${index < step ? "bg-pink-600" : "bg-gray-200"}`}
            >
              {index < totalSteps - 1 && <div className="absolute right-0 top-0 h-2 w-2 bg-white"></div>}
            </div>
          ))}
        </div>

        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          {step === 1 && (
            <div className="text-center">
              <h2 className="mb-4 text-xl font-semibold">Step 1: Find a QR Code</h2>
              <div className="mb-6 aspect-video overflow-hidden rounded-lg bg-gray-100">
                <img
                  src="/placeholder.svg?height=400&width=600&query=Person finding QR code on a restaurant menu with pink branding"
                  alt="Finding a QR code"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-gray-700">
                Look for PinkSync: Scan QR-enabled QR codes in public spaces, businesses, educational materials, or
                anywhere information needs to be accessible in sign language.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
              <h2 className="mb-4 text-xl font-semibold">Step 2: Scan with PinkSync: Scan QR</h2>
              <div className="mb-6 aspect-video overflow-hidden rounded-lg bg-gray-100">
                <img
                  src="/placeholder.svg?height=400&width=600&query=Person scanning QR code with smartphone showing PinkSync app"
                  alt="Scanning a QR code"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-gray-700">
                Open the PinkSync: Scan QR app on your smartphone or tablet and point the camera at the QR code. The app
                will automatically detect and process the code.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <h2 className="mb-4 text-xl font-semibold">Step 3: AR Processing</h2>
              <div className="mb-6 aspect-video overflow-hidden rounded-lg bg-gray-100">
                <img
                  src="/placeholder.svg?height=400&width=600&query=Smartphone processing AR data with pink loading animation"
                  alt="AR processing"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-gray-700">
                PinkSync's AI engine processes the QR code and prepares to display the sign language content as an AR
                hologram. This happens in seconds, even on standard smartphones.
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="text-center">
              <h2 className="mb-4 text-xl font-semibold">Step 4: View Sign Language Hologram</h2>
              <div className="mb-6 aspect-video overflow-hidden rounded-lg bg-gray-100">
                <img
                  src="/placeholder.svg?height=400&width=600&query=AR hologram showing person signing in real environment with pink glow"
                  alt="Sign language hologram"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-gray-700">
                A lifelike hologram appears in your environment, displaying the sign language content. You can move
                around the hologram and view it from different angles for the best visibility.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={step === 1 || loading}>
            Previous
          </Button>

          {step < totalSteps ? (
            <Button className="bg-pink-600 hover:bg-pink-700" onClick={nextStep} disabled={loading}>
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Loading...
                </>
              ) : (
                "Next"
              )}
            </Button>
          ) : (
            <Button className="bg-pink-600 hover:bg-pink-700" onClick={() => router.push("/scanqr/scan")}>
              Try It Yourself
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
