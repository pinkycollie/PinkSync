"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Info, Maximize2, Minimize2 } from "lucide-react"

// Mock data for sign language content
const signLanguageContent = {
  "sign-language-content-1": {
    title: "Welcome Message",
    description: "A welcome message in American Sign Language",
    videoUrl: "/placeholder.svg?height=400&width=400&query=ASL welcome message animation",
    model3dUrl: "/placeholder.svg?height=400&width=400&query=3D ASL avatar model",
  },
  "sign-language-content-2": {
    title: "Emergency Information",
    description: "Emergency evacuation instructions in ASL",
    videoUrl: "/placeholder.svg?height=400&width=400&query=ASL emergency instructions",
    model3dUrl: "/placeholder.svg?height=400&width=400&query=3D ASL emergency avatar",
  },
}

export default function ARPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const qrData = searchParams.get("qrData")
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const arContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate loading the AR content
    setLoading(true)

    setTimeout(() => {
      if (qrData && qrData in signLanguageContent) {
        setContent(signLanguageContent[qrData as keyof typeof signLanguageContent])
        setLoading(false)
      } else {
        setError("Invalid QR code or content not found")
        setLoading(false)
      }
    }, 2000)
  }, [qrData])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      arContainerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.push("/scan")} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Sign Language AR</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
          {fullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </Button>
      </div>

      <div className="mx-auto max-w-md">
        {loading && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600"></div>
              <p className="mt-4 text-center text-gray-500">Loading AR content...</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-red-100 p-2">
                  <Info className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-medium text-red-900">Error</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 border-red-200 text-red-700 hover:bg-red-100"
                    onClick={() => router.push("/scan")}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && !error && content && (
          <div ref={arContainerRef} className="relative">
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-black">
              {/* This would be replaced with actual AR content using libraries like AR.js, Three.js, or a WebXR implementation */}
              <div className="relative h-full w-full">
                {/* Simulated AR view with camera background */}
                <video autoPlay playsInline muted loop className="absolute h-full w-full object-cover">
                  <source src="/placeholder.svg?height=600&width=600&query=camera view background" type="video/mp4" />
                </video>

                {/* Simulated hologram overlay */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                  <img
                    src={content.model3dUrl || "/placeholder.svg"}
                    alt={content.title}
                    className="h-64 w-64 animate-pulse opacity-80"
                  />
                </div>
              </div>
            </div>

            <Card className="mt-4">
              <CardContent className="p-4">
                <h2 className="text-xl font-bold">{content.title}</h2>
                <p className="mt-1 text-gray-500">{content.description}</p>

                <div className="mt-4 flex justify-between">
                  <Button variant="outline" onClick={() => router.push("/scan")}>
                    Scan Another
                  </Button>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => router.push(`/library/${qrData}`)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
