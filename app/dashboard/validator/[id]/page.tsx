import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VideoPlayer } from "@/components/video-player"
import { ValidatorInterface } from "@/components/validator-interface"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

interface ValidatorReviewPageProps {
  params: {
    id: string
  }
}

export default async function ValidatorReviewPage({ params }: ValidatorReviewPageProps) {
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
      title: "Sample Video for Validation",
      description: "This is a sample video that needs validation",
      status: "ready",
      created_at: new Date().toISOString(),
      creator_id: "user123",
    }
  }

  // In a real app, you would get the validator ID from authentication
  const validatorId = "validator123"

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/validator">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Validate Video</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <VideoPlayer videoId={id} title={video.title} />

          <div>
            <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
            <p className="text-muted-foreground">{video.description || "No description provided"}</p>
          </div>
        </div>

        <ValidatorInterface video={video} validatorId={validatorId} />
      </div>
    </div>
  )
}
