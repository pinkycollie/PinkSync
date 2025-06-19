"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, MessageSquare } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { validateVideo } from "@/app/actions/video-actions"
import { useToast } from "@/hooks/use-toast"
import { getVideoThumbnail } from "@/lib/utils"

interface ValidatorInterfaceProps {
  video: any
  validatorId: string
}

export function ValidatorInterface({ video, validatorId }: ValidatorInterfaceProps) {
  const [feedback, setFeedback] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleValidation = async (status: string) => {
    setSubmitting(true)

    try {
      const result = await validateVideo(video.id, validatorId, status, feedback)

      if (result.error) {
        throw new Error(result.error)
      }

      toast({
        title: `Video ${status === "approved" ? "approved" : "rejected"}`,
        description: `The video has been ${status === "approved" ? "approved" : "rejected"} successfully`,
        variant: status === "approved" ? "default" : "destructive",
      })

      // Redirect to validation queue
      router.push("/dashboard/validator")
      router.refresh()
    } catch (error) {
      console.error("Error validating video:", error)

      toast({
        title: "Validation failed",
        description: "There was an error validating the video",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Video Validation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video overflow-hidden rounded-lg bg-muted">
          <img
            src={getVideoThumbnail(video.id) || "/placeholder.svg"}
            alt={video.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{video.title}</h3>
          <p className="text-sm text-muted-foreground">{video.description || "No description provided"}</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="feedback" className="text-sm font-medium">
            Validation Feedback
          </label>
          <Textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Provide feedback about this video (required for rejection)"
            rows={4}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="destructive"
          onClick={() => handleValidation("rejected")}
          disabled={submitting || feedback.trim().length === 0}
        >
          <XCircle className="mr-2 h-4 w-4" />
          Reject
        </Button>
        <Button variant="outline" onClick={() => router.push("/dashboard/validator")} disabled={submitting}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Skip for Now
        </Button>
        <Button variant="default" onClick={() => handleValidation("approved")} disabled={submitting}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Approve
        </Button>
      </CardFooter>
    </Card>
  )
}
