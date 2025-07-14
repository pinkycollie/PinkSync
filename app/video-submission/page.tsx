import { VideoSubmissionForm } from "@/components/video-submission-form"
import { SubmissionHistory } from "@/components/submission-history"

export default function VideoSubmissionPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">Video Chat Submission</h1>
        <p className="text-muted-foreground">Record and submit video chats for human review or AI processing</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <VideoSubmissionForm />
        <SubmissionHistory />
      </div>
    </div>
  )
}
