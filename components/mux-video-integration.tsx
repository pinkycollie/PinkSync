"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Video, Upload, Play, Pause, Eye, Hand, Captions, BarChart3, Zap } from "lucide-react"

interface MuxAsset {
  id: string
  status: "preparing" | "ready" | "errored"
  playback_id?: string
  duration?: number
  resolution?: string
  created_at: string
}

interface VideoAnalytics {
  viewCount: number
  avgWatchTime: number
  gestureDetectionAccuracy: number
  signLanguageClarity: number
}

export function MuxVideoIntegration() {
  const [assets, setAssets] = useState<MuxAsset[]>([])
  const [currentAsset, setCurrentAsset] = useState<MuxAsset | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [analytics, setAnalytics] = useState<VideoAnalytics>({
    viewCount: 0,
    avgWatchTime: 0,
    gestureDetectionAccuracy: 0,
    signLanguageClarity: 0,
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [gestureOverlayEnabled, setGestureOverlayEnabled] = useState(true)
  const [captionsEnabled, setCaptionsEnabled] = useState(true)

  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Simulate Mux asset creation and processing
  const simulateAssetCreation = (fileName: string) => {
    const newAsset: MuxAsset = {
      id: `asset_${Date.now()}`,
      status: "preparing",
      created_at: new Date().toISOString(),
    }

    setAssets((prev) => [newAsset, ...prev])

    // Simulate processing time
    setTimeout(() => {
      setAssets((prev) =>
        prev.map((asset) =>
          asset.id === newAsset.id
            ? {
                ...asset,
                status: "ready",
                playback_id: `playback_${Date.now()}`,
                duration: Math.floor(Math.random() * 300) + 60, // 1-5 minutes
                resolution: "1080p",
              }
            : asset,
        ),
      )
    }, 3000)
  }

  // Handle file upload simulation
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          simulateAssetCreation(file.name)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  // Simulate video analytics
  useEffect(() => {
    if (currentAsset && isPlaying) {
      const interval = setInterval(() => {
        setAnalytics((prev) => ({
          viewCount: prev.viewCount + Math.floor(Math.random() * 3),
          avgWatchTime: Math.min(prev.avgWatchTime + 0.5, 100),
          gestureDetectionAccuracy: Math.min(prev.gestureDetectionAccuracy + 0.2, 95),
          signLanguageClarity: Math.min(prev.signLanguageClarity + 0.3, 98),
        }))
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [currentAsset, isPlaying])

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            Mux Video API for Deaf-First Communication
          </CardTitle>
          <p className="text-gray-600">
            Professional video processing with sign language optimization and gesture recognition
          </p>
        </CardHeader>
      </Card>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Sign Language Video
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload Video for Processing"}
            </Button>

            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-gray-600 text-center">
                  Uploading and processing for sign language optimization... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Video Assets */}
      {assets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Processed Video Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map((asset) => (
                <Card
                  key={asset.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => asset.status === "ready" && setCurrentAsset(asset)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={asset.status === "ready" ? "default" : "secondary"}>{asset.status}</Badge>
                      {asset.resolution && <Badge variant="outline">{asset.resolution}</Badge>}
                    </div>
                    <p className="text-sm font-medium">Asset {asset.id.slice(-8)}</p>
                    {asset.duration && (
                      <p className="text-xs text-gray-500">
                        Duration: {Math.floor(asset.duration / 60)}:{(asset.duration % 60).toString().padStart(2, "0")}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">{new Date(asset.created_at).toLocaleString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video Player */}
      {currentAsset && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Sign Language Video Player
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <video
                    ref={videoRef}
                    className="w-full h-64 bg-gray-900 rounded-lg"
                    poster="/placeholder.svg?height=360&width=640"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  >
                    <source
                      src={`https://stream.mux.com/${currentAsset.playback_id}.m3u8`}
                      type="application/x-mpegURL"
                    />
                    Your browser does not support the video tag.
                  </video>

                  {/* Gesture Recognition Overlay */}
                  {gestureOverlayEnabled && (
                    <div className="absolute top-2 right-2 bg-blue-500 bg-opacity-75 text-white p-2 rounded text-sm">
                      <Hand className="h-4 w-4 inline mr-1" />
                      Gesture: "Hello" (92% confidence)
                    </div>
                  )}

                  {/* Live Captions */}
                  {captionsEnabled && (
                    <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-75 text-white p-2 rounded text-sm">
                      [ASL Translation] Welcome to PinkSync video communication...
                    </div>
                  )}
                </div>

                {/* Video Controls */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button onClick={handlePlayPause} variant="outline">
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant={gestureOverlayEnabled ? "default" : "outline"}
                    onClick={() => setGestureOverlayEnabled(!gestureOverlayEnabled)}
                  >
                    <Hand className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={captionsEnabled ? "default" : "outline"}
                    onClick={() => setCaptionsEnabled(!captionsEnabled)}
                  >
                    <Captions className="h-4 w-4" />
                  </Button>
                  <Button variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Real-time Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>View Count</span>
                    <span className="font-semibold">{analytics.viewCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Avg Watch Time</span>
                    <span className="font-semibold">{analytics.avgWatchTime.toFixed(1)}%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Gesture Detection</span>
                      <span>{analytics.gestureDetectionAccuracy.toFixed(1)}%</span>
                    </div>
                    <Progress value={analytics.gestureDetectionAccuracy} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Sign Language Clarity</span>
                      <span>{analytics.signLanguageClarity.toFixed(1)}%</span>
                    </div>
                    <Progress value={analytics.signLanguageClarity} className="h-2" />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-sm mb-2">Mux Features Active</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Adaptive Bitrate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Global CDN</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Sign Language Optimized</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Gesture Recognition</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Mux Features Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Why Mux for Deaf-First Video?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Video className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-semibold text-blue-800">Video Processing</h4>
              <p className="text-sm text-blue-600">Optimized encoding for sign language clarity</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Zap className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-semibold text-green-800">Low Latency</h4>
              <p className="text-sm text-green-600">Global CDN for real-time communication</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-semibold text-purple-800">Analytics</h4>
              <p className="text-sm text-purple-600">Detailed insights for accessibility</p>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <Hand className="h-8 w-8 mx-auto mb-2 text-pink-600" />
              <h4 className="font-semibold text-pink-800">AI Integration</h4>
              <p className="text-sm text-pink-600">Perfect for gesture recognition overlays</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
