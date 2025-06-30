"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Info, Maximize2, Minimize2, Loader2 } from "lucide-react"
import Link from "next/link"
import { usePinkSyncData } from "@/hooks/use-pinksync-data"

export default function ARPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const qrData = searchParams.get("qrData")
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const arContainerRef = useRef<HTMLDivElement>(null)
  const { processQRCode } = usePinkSyncData()

  useEffect(() => {
    if (!qrData) {
      setError("No QR code data provided")
      setLoading(false)
      return
    }

    const loadContent = async () => {
      try {
        setLoading(true)
        const contentData = await processQRCode(qrData)
        setContent(contentData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load content")
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [qrData, processQRCode])

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
          <Button variant="ghost" size="icon" onClick={() => router.push("/scanqr/scan")} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Link href="/scanqr" className="mr-4 flex items-center">
            <h1 className="text-xl font-bold text-pink-600">PinkSync</h1>
            <span className="ml-2 rounded-md bg-pink-100 px-2 py-1 text-xs font-medium text-pink-800">Scan QR</span>
          </Link>
          <h2 className="text-lg font-medium">Sign Language AR</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
          {fullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </Button>
      </div>

      <div className="mx-auto max-w-md">
        {loading && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-16 w-16 animate-spin text-pink-600" />
              <p className="mt-4 text-center text-gray-500">Loading AR content from PinkSync...</p>
              <p className="mt-2 text-center text-xs text-gray-400">AI processing in progress</p>
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
                    className="mt-2 border-red-200 text-red-700 hover:bg-red-100 bg-transparent"
                    onClick={() => router.push("/scanqr/scan")}
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
              <div className="relative h-full w-full">
                {/* Real AR content would be rendered here using WebXR */}
                {content.ar_preview_url ? (
                  <video autoPlay playsInline muted loop className="absolute h-full w-full object-cover">
                    <source src={content.ar_preview_url} type="video/mp4" />
                  </video>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-900 to-purple-900">
                    <div className="text-center text-white">
                      <Loader2 className="mx-auto h-12 w-12 animate-spin mb-4" />
                      <p>Generating AR content...</p>
                      <p className="text-sm opacity-75 mt-2">This may take a few moments</p>
                    </div>
                  </div>
                )}

                {/* Simulated hologram overlay */}
                {content.model_3d_url && (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                    <img
                      src={content.model_3d_url || "/placeholder.svg"}
                      alt={content.title}
                      className="h-64 w-64 animate-pulse opacity-80"
                    />
                  </div>
                )}
              </div>
            </div>

            <Card className="mt-4">
              <CardContent className="p-4">
                <h2 className="text-xl font-bold">{content.title}</h2>
                <p className="mt-1 text-gray-500">{content.description}</p>

                {content.languages && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {content.languages.map((lang: string, index: number) => (
                      <span key={index} className="rounded-full bg-pink-100 px-2 py-1 text-xs text-pink-800">
                        {lang}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex justify-between">
                  <Button variant="outline" onClick={() => router.push("/scanqr/scan")}>
                    Scan Another
                  </Button>
                  <Button
                    className="bg-pink-600 hover:bg-pink-700"
                    onClick={() => router.push(`/scanqr/library/${content.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Real-time processing status */}
            <Card className="mt-4 border-pink-200 bg-pink-50">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 text-sm text-pink-800">
                  <div className="h-2 w-2 rounded-full bg-pink-600 animate-pulse"></div>
                  <span>Powered by PinkSync AI • Real-time processing</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
