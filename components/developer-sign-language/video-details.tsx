"use client"

import { useState, useEffect } from "react"
import { useDeveloperSignLanguage } from "@/hooks/use-developer-sign-language"
import type { DeveloperSignVideo } from "@/types/developer-sign-language"
import { VideoPlayer } from "./video-player"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Download, User, Tag, Calendar } from "lucide-react"
import Link from "next/link"

interface VideoDetailsProps {
  videoId: number
}

export function VideoDetails({ videoId }: VideoDetailsProps) {
  const { fetchVideoById, incrementViewCount, incrementDownloadCount, loading, error } = useDeveloperSignLanguage()
  const [video, setVideo] = useState<DeveloperSignVideo | null>(null)
  const [relatedVideos, setRelatedVideos] = useState<DeveloperSignVideo[]>([])

  useEffect(() => {
    const loadVideo = async () => {
      const videoData = await fetchVideoById(videoId)
      if (videoData) {
        setVideo(videoData)
        incrementViewCount(videoId)
      }
    }

    loadVideo()
  }, [videoId, fetchVideoById, incrementViewCount])

  const handleDownload = () => {
    if (!video) return
    incrementDownloadCount(video.id)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  if (loading && !video) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-40">
            <p className="text-gray-500">Loading video...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !video) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-40">
            <p className="text-red-500">Error loading video. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <VideoPlayer video={video} onDownload={handleDownload} />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{video.title}</CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {video.viewCount || 0} views
            </span>

            <span className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              {video.downloadCount || 0} downloads
            </span>

            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(video.createdAt)}
            </span>

            {video.uploadedBy && (
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {video.uploadedBy}
              </span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="pt-4">
              <p className="text-gray-700 whitespace-pre-line">{video.description || "No description provided."}</p>
            </TabsContent>

            <TabsContent value="details" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Sign Language Type</h3>
                  <p className="mt-1">{video.signLanguageType}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                  <p className="mt-1">
                    {Math.floor(video.durationSeconds / 60)}:{(video.durationSeconds % 60).toString().padStart(2, "0")}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">File Type</h3>
                  <p className="mt-1">{video.contentType}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">File Size</h3>
                  <p className="mt-1">{Math.round((video.sizeBytes / 1024 / 1024) * 100) / 100} MB</p>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {video.tags.length > 0 ? (
                      video.tags.map((tag, index) => (
                        <Link href={`/developer-sign-language?tags=${encodeURIComponent(tag)}`} key={index}>
                          <Badge variant="secondary" className="cursor-pointer">
                            {tag}
                          </Badge>
                        </Link>
                      ))
                    ) : (
                      <p className="text-gray-500">No tags</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>

          <Link href="/developer-sign-language">
            <Button variant="ghost">Back to Library</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
