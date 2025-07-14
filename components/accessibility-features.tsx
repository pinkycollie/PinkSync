import { Eye, HandMetal, LayoutGrid, Sliders } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AccessibilityFeatures() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HandMetal className="h-5 w-5" />
          Deaf-First Accessibility Features
        </CardTitle>
        <CardDescription>Specialized features designed specifically for deaf and hard-of-hearing users</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-2">
            <Eye className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Visual Communication Priority</h3>
            <p className="text-sm text-muted-foreground">
              Designed for visual rather than audio communication, with ASL as the primary interface
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-2">
            <LayoutGrid className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">High Contrast Visual Modes</h3>
            <p className="text-sm text-muted-foreground">
              Multiple visual themes with enhanced contrast for users with varying visual preferences
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-2">
            <Sliders className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Customizable Interaction Pace</h3>
            <p className="text-sm text-muted-foreground">
              Users can control the speed of interactions and animations to match their preferences
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
