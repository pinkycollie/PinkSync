import Link from "next/link"
import { Video, CheckCircle, XCircle, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getValidationQueue } from "@/app/actions/video-actions"
import { getVideoThumbnail } from "@/lib/utils"

export default async function ValidatorPage() {
  // Get videos in validation queue
  const { videos, error } = await getValidationQueue()

  // In a real app, you would get the validator ID from authentication
  const validatorId = "validator123"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Human Validator Interface</h2>
        <p className="text-muted-foreground">Review and validate videos for accessibility and content standards</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              Pending Validation
            </CardTitle>
            <CardDescription>Videos waiting for review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{videos?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Approved
            </CardTitle>
            <CardDescription>Videos approved today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Rejected
            </CardTitle>
            <CardDescription>Videos rejected today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Validation Queue</h3>

        {error ? (
          <Card>
            <CardContent className="flex items-center justify-center p-6">
              <p className="text-muted-foreground">Error loading validation queue: {error}</p>
            </CardContent>
          </Card>
        ) : videos && videos.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
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
                  <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                    {video.description || "No description provided"}
                  </p>
                  <div className="mt-4 flex justify-end">
                    <Button asChild>
                      <Link href={`/dashboard/validator/${video.id}`}>Review</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Video className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2 text-muted-foreground">No videos in validation queue</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
