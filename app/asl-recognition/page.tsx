import { ASLRecognitionDemo } from "@/components/asl-recognition/asl-recognition-demo"
import { ModelExplanation } from "@/components/asl-recognition/model-explanation"
import { RecognitionStats } from "@/components/asl-recognition/recognition-stats"

export default function ASLRecognitionPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">ASL Recognition & Transcription</h1>
        <p className="text-muted-foreground">AI-powered recognition and transcription of American Sign Language</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ASLRecognitionDemo />
        </div>
        <div className="space-y-8">
          <ModelExplanation />
          <RecognitionStats />
        </div>
      </div>
    </div>
  )
}
