"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { VideoUpload } from "@/components/video-upload"

export default function VideoUploadPage() {
  const { data: session } = useSession()
  const creatorId = session?.user?.id

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Upload Video</h2>
        <p className="text-muted-foreground">Upload a new video for processing and accessibility transformation</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <VideoUpload creatorId={creatorId} />

        <Card>
          <CardHeader>
            <CardTitle>Upload Guidelines</CardTitle>
            <CardDescription>Follow these guidelines for optimal results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Supported Formats</h3>
              <ul className="list-inside list-disc text-sm text-muted-foreground">
                <li>MP4 (H.264 codec)</li>
                <li>WebM (VP9 codec)</li>
                <li>MOV (H.264 codec)</li>
                <li>AVI (uncompressed)</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Recommended Settings</h3>
              <ul className="list-inside list-disc text-sm text-muted-foreground">
                <li>Resolution: 1080p (1920x1080) or 720p (1280x720)</li>
                <li>Frame rate: 30fps or 60fps</li>
                <li>Bitrate: 8-12 Mbps for 1080p, 5-8 Mbps for 720p</li>
                <li>Audio: AAC codec, 128-256 Kbps, 48 kHz</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Accessibility Tips</h3>
              <ul className="list-inside list-disc text-sm text-muted-foreground">
                <li>Ensure good lighting for clear visibility</li>
                <li>Use a plain, contrasting background</li>
                <li>Position yourself properly in the frame</li>
                <li>Speak clearly if including audio</li>
                <li>Consider adding captions or transcripts</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
