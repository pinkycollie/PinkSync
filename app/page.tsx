"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function VideoProcessingForm() {
  const [videoTitle, setVideoTitle] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [jobId, setJobId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setJobId(null)
    setError(null)

    try {
      const response = await fetch("/api/video-processing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: videoTitle, url: videoUrl }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Something went wrong")
      }

      const data = await response.json()
      setJobId(data.jobId)
      setVideoTitle("")
      setVideoUrl("")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Queue ASL Video for Processing</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="videoTitle">Video Title</Label>
              <Input
                id="videoTitle"
                placeholder="Enter video title"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                type="url"
                placeholder="https://example.com/video.mp4"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Adding to Queue..." : "Add to Processing Queue"}
            </Button>
          </form>
          {jobId && (
            <div className="mt-4 rounded-md bg-green-100 p-3 text-sm text-green-700 dark:bg-green-900 dark:text-green-200">
              Video processing job added! Job ID: <span className="font-semibold">{jobId}</span>
            </div>
          )}
          {error && (
            <div className="mt-4 rounded-md bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900 dark:text-red-200">
              Error: <span className="font-semibold">{error}</span>
            </div>
          )}
          <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            This form sends data to a Next.js API route which queues the video for processing using BullMQ. Ensure your
            `REDIS_HOST` and `REDIS_PORT` environment variables are configured.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
