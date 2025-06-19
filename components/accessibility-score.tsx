import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AccessibilityScoreProps {
  score: number
  visualScore: number
  aslScore: number
  workflowScore: number
}

export function AccessibilityScore({ score, visualScore, aslScore, workflowScore }: AccessibilityScoreProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deaf-First Accessibility</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center">
          <div
            className="relative flex h-32 w-32 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(hsl(var(--primary)) ${score}%, transparent 0)`,
            }}
          >
            <div className="absolute flex h-24 w-24 items-center justify-center rounded-full bg-card">
              <span className="text-3xl font-bold">{score}%</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-muted p-2">
            <div className="text-xl font-bold">{visualScore}%</div>
            <div className="text-xs">Visual-First</div>
          </div>
          <div className="rounded-lg bg-muted p-2">
            <div className="text-xl font-bold">{aslScore}%</div>
            <div className="text-xs">ASL Support</div>
          </div>
          <div className="rounded-lg bg-muted p-2">
            <div className="text-xl font-bold">{workflowScore}%</div>
            <div className="text-xs">Workflows</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
