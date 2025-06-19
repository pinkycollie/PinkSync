import Link from "next/link"
import { Plus, Video, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getVideoThumbnail } from "@/lib/utils"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export default async function VideosPage() {
  // Fetch videos from database
  let videos
  try {
    videos = await sql`
      SELECT * FROM videos 
      ORDER BY created_at DESC 
      LIMIT 12
    `
  } catch (error) {
    console.error("Error fetching videos:", error)
    // For demo purposes, we'll use mock data if the database query fails
    videos = [
      {
        id: "video1",
        title: "Introduction to ASL",
        description: "Learn the basics of American Sign Language",
        status: "published",
        created_at: new Date().toISOString(),
      },
      {
        id: "video2",
        title: "Deaf Culture Awareness",
        description: "Understanding deaf culture and community",
        status: "processing",
        created_at: new Date().toISOString(),
      },
      {
        id: "video3",
        title: "Accessibility in Web Design",
        description: "Creating accessible websites for deaf users",
        status: "ready",
        created_at: new Date().toISOString(),
      },
    ]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Videos</h2>
          <p className="text-muted-foreground">Manage your videos and track their processing status</p>
        </div>

        <Button asChild>
          <Link href="/dashboard/videos/upload">
            <Plus className="mr-2 h-4 w-4" />
            Upload Video
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Videos</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <TabsContent value="all" className="mt-4">
          {videos.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Video className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-muted-foreground">No videos found</p>
                <Button asChild className="mt-4">
                  <Link href="/dashboard/videos/upload">Upload Your First Video</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <div className="relative aspect-video bg-muted">
                    <img
                      src={getVideoThumbnail(video.id) || "/placeholder.svg"}
                      alt={video.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                      {video.status}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold truncate">{video.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                      {video.description || "No description provided"}
                    </p>
                    <div className="mt-4 flex justify-end">
                      <Button asChild variant="outline">
                        <Link href={`/dashboard/videos/${video.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="published" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Published Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {videos
                  .filter((video) => video.status === "published")
                  .map((video) => (
                    <Card key={video.id} className="overflow-hidden">
                      <div className="aspect-video bg-muted">
                        <img
                          src={getVideoThumbnail(video.id) || "/placeholder.svg"}
                          alt={video.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold truncate">{video.title}</h4>
                        <div className="mt-4 flex justify-end">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/dashboard/videos/${video.id}`}>View</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Similar content for other tabs */}
      </Tabs>
    </div>
  )
}
