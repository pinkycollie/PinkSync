import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ImplementationTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Implementation Timeline</CardTitle>
        <CardDescription>Phased approach to deploying virtual assistants across the ecosystem</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="flex gap-4">
            <div className="relative flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <div className="absolute top-8 h-full w-px bg-border"></div>
            </div>
            <div className="space-y-1 pb-8">
              <h3 className="font-medium leading-none">Phase 1: Client-Facing Financial Assistant</h3>
              <p className="text-sm text-muted-foreground">
                Deploy the first ASL-capable virtual assistant for financial services
              </p>
              <p className="text-xs text-muted-foreground">Q3 2023</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <div className="absolute top-8 h-full w-px bg-border"></div>
            </div>
            <div className="space-y-1 pb-8">
              <h3 className="font-medium leading-none">Phase 2: Internal Knowledge Assistant</h3>
              <p className="text-sm text-muted-foreground">
                Launch internal virtual assistant for cross-domain knowledge sharing
              </p>
              <p className="text-xs text-muted-foreground">Q1 2024</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <div className="absolute top-8 h-full w-px bg-border"></div>
            </div>
            <div className="space-y-1 pb-8">
              <h3 className="font-medium leading-none">Phase 3: Full Domain Integration</h3>
              <p className="text-sm text-muted-foreground">
                Expand to all domains with seamless transitions between services
              </p>
              <p className="text-xs text-muted-foreground">Q3 2024</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                4
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium leading-none">Phase 4: Advanced AI Capabilities</h3>
              <p className="text-sm text-muted-foreground">
                Implement advanced ASL recognition and predictive assistance
              </p>
              <p className="text-xs text-muted-foreground">Q1 2025</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
