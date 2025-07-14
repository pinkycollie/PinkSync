import { BrainCircuit, Fingerprint, Hand, Layers } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ModelExplanation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5" />
          How ASL Recognition Works
        </CardTitle>
        <CardDescription>Understanding the AI model behind ASL recognition</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-2">
              <Hand className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Hand Pose Estimation</h3>
              <p className="text-sm text-muted-foreground">
                The system detects and tracks 21 key points on each hand, including finger joints and the palm.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-2">
              <Fingerprint className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Motion Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Movements are analyzed over time to capture dynamic signs that involve specific hand motions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-2">
              <Layers className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Neural Network Classification</h3>
              <p className="text-sm text-muted-foreground">
                A deep learning model trained on thousands of ASL examples classifies hand configurations into signs.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-md border">
          <img src="/asl-recognition-diagram.png" alt="ASL Recognition Process Diagram" className="w-full" />
        </div>

        <div className="rounded-md bg-muted p-4">
          <h4 className="mb-2 font-medium">Model Specifications</h4>
          <ul className="space-y-1 text-sm">
            <li className="flex items-center justify-between">
              <span>Architecture:</span>
              <span className="font-mono">MediaPipe + Custom CNN</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Vocabulary Size:</span>
              <span className="font-mono">2,500+ signs</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Accuracy:</span>
              <span className="font-mono">92.7% (single signs)</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Latency:</span>
              <span className="font-mono">~100ms per frame</span>
            </li>
          </ul>
        </div>
      </CardContent>
      <div className="border-t px-6 py-4 text-sm text-muted-foreground">
        Technology provided by <span className="font-semibold">Sign Speak</span>
      </div>
    </Card>
  )
}
