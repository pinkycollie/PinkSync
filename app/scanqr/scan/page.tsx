"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Scan, X, Info, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePinkSyncData } from "@/hooks/use-pinksync-data"

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scanning, setScanning] = useState(false)
  const [permission, setPermission] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [processingQR, setProcessingQR] = useState(false)
  const router = useRouter()
  const { processQRCode, loading } = usePinkSyncData()

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined" && "mediaDevices" in navigator) {
      // Request camera permission
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          setPermission(true)
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch((err) => {
          console.error("Error accessing camera:", err)
          setPermission(false)
          setError("Camera access denied. Please enable camera permissions to scan QR codes.")
        })
    }

    return () => {
      // Clean up video stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  const startScanning = () => {
    setScanning(true)
    scanQRCode()
  }

  const stopScanning = () => {
    setScanning(false)
  }

  const handleQRCodeDetected = async (qrData: string) => {
    setScanning(false)
    setProcessingQR(true)

    try {
      // Generate session ID for tracking
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Process QR code through PinkSync API
      const content = await processQRCode(qrData, sessionId)

      // Navigate to AR view with the processed content
      router.push(`/scanqr/ar?qrData=${encodeURIComponent(qrData)}`)
    } catch (error) {
      console.error("Error processing QR code:", error)
      setError(error instanceof Error ? error.message : "Failed to process QR code")
      setProcessingQR(false)
    }
  }

  const scanQRCode = () => {
    if (!scanning) return

    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    // Only process if video is playing
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight
      canvas.width = video.videoWidth

      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // In a real implementation, you would use a QR code detection library like jsQR
      // For this demo, we'll simulate finding a QR code after 3 seconds
      setTimeout(() => {
        if (scanning) {
          // Simulate QR code detection with real data
          const qrData = "sign-language-content-1"
          handleQRCodeDetected(qrData)
        }
      }, 3000)
    }

    // Continue scanning
    if (scanning) {
      requestAnimationFrame(scanQRCode)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/scanqr" className="mr-4 flex items-center">
            <h1 className="text-xl font-bold text-pink-600">PinkSync</h1>
            <span className="ml-2 rounded-md bg-pink-100 px-2 py-1 text-xs font-medium text-pink-800">Scan QR</span>
          </Link>
          <h2 className="text-lg font-medium">Scan QR Code</h2>
        </div>
        <Link href="/scanqr" className="text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </Link>
      </div>

      <div className="mx-auto max-w-md">
        {permission === false && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-red-100 p-2">
                  <Info className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-medium text-red-900">Camera Access Required</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {processingQR && (
          <Card className="mb-6 border-pink-200 bg-pink-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Loader2 className="h-5 w-5 animate-spin text-pink-600" />
                <div>
                  <h3 className="font-medium text-pink-900">Processing QR Code</h3>
                  <p className="mt-1 text-sm text-pink-700">
                    PinkSync AI is processing your QR code and preparing the sign language content...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="relative overflow-hidden rounded-lg bg-black">
          <video ref={videoRef} className="h-[400px] w-full object-cover" autoPlay playsInline muted />
          <canvas ref={canvasRef} className="absolute left-0 top-0 hidden" />

          {!scanning && !processingQR && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white">
              <Scan className="mb-4 h-12 w-12" />
              <p className="mb-6 text-center text-lg">Position a QR code in the camera view</p>
              <Button onClick={startScanning} disabled={permission === false} className="bg-pink-600 hover:bg-pink-700">
                Start Scanning
              </Button>
            </div>
          )}

          {scanning && !processingQR && (
            <>
              <div className="absolute inset-0 border-2 border-pink-500 opacity-50"></div>
              <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 transform border-2 border-white"></div>
              <Button
                onClick={stopScanning}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-pink-600 hover:bg-pink-700"
              >
                Cancel
              </Button>
            </>
          )}

          {processingQR && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white">
              <Loader2 className="mb-4 h-12 w-12 animate-spin" />
              <p className="text-center text-lg">Processing with PinkSync AI...</p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Scan any PinkSync: Scan QR-enabled QR code to view sign language content as an AR hologram.</p>
          <p className="mt-2 text-xs">Powered by PinkSync's real-time data + AI engine</p>
        </div>
      </div>
    </div>
  )
}
