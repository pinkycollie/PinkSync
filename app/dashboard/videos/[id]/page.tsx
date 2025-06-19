import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoPlayer } from "@/components/video-player"
import { VideoProcessingStatus } from "@/components/video-processing-status"
import { ProgressTracker } from "@/components/progress-tracker"
import { formatDuration } from "@/lib/utils"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

interface VideoDetailPageProps {
  params: {
    id: string
  }
}

export default async function VideoDetailPage({ params }: VideoDetailPageProps) {
  const { id } = params

  // Fetch video data from database
  let video
  try {
    const result = await sql`
      SELECT * FROM videos WHERE id = ${id}
    `

    if (result.length === 0) {
      notFound()
    }

    video = result[0]
  } catch (error) {
    console.error("Error fetching video:", error)
    // For demo purposes, we'll use mock data if the database query fails
    video = {
      id,
      title: "Sample Video",
      description: "This is a sample video description",
      status: "processing",
      duration: 120,
      created_at: new Date().toISOString(),
      creator_id: "user123",
    }
  }

  const formattedDate = new Date(video.created_at).toLocaleDateString()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/videos">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">{video.title}</h2>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/videos/${id}/edit`}>Edit</Link>
          </Button>
          <Button variant="default">Share</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <VideoPlayer videoId={id} title={video.title} />

          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Video Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {video.duration ? formatDuration(video.duration) : "Processing..."}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Creator ID: {video.creator_id}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">{video.description || "No description provided"}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="processing">
              <VideoProcessingStatus videoId={id} initialStatus={video.status} />
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <ProgressTracker videoId={id} />
        </div>
      </div>
    </div>
  )
}
