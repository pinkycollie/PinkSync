import { TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

// Mock data for recognition accuracy by category
const accuracyData = [
  { category: "Alphabet", accuracy: 96 },
  { category: "Numbers", accuracy: 94 },
  { category: "Common", accuracy: 91 },
  { category: "Technical", accuracy: 85 },
  { category: "Medical", accuracy: 83 },
  { category: "Financial", accuracy: 88 },
]

export function RecognitionStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Recognition Performance
        </CardTitle>
        <CardDescription>Current accuracy metrics for ASL recognition</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-64">
          <ChartContainer
            config={{
              accuracy: {
                label: "Accuracy (%)",
                color: "hsl(var(--chart-1))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accuracyData} margin={{ top: 5, right: 5, left: 5, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="accuracy" fill="var(--color-accuracy)" name="Accuracy" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-md bg-muted p-4">
            <div className="text-2xl font-bold">92.7%</div>
            <p className="text-xs text-muted-foreground">Overall Accuracy</p>
          </div>
          <div className="rounded-md bg-muted p-4">
            <div className="text-2xl font-bold">2,500+</div>
            <p className="text-xs text-muted-foreground">Recognized Signs</p>
          </div>
          <div className="rounded-md bg-muted p-4">
            <div className="text-2xl font-bold">~100ms</div>
            <p className="text-xs text-muted-foreground">Processing Latency</p>
          </div>
          <div className="rounded-md bg-muted p-4">
            <div className="text-2xl font-bold">98.2%</div>
            <p className="text-xs text-muted-foreground">Hand Detection Rate</p>
          </div>
        </div>
      </CardContent>
      <div className="border-t px-6 py-4 text-sm text-muted-foreground">
        Analytics powered by <span className="font-semibold">Sign Speak</span>
      </div>
    </Card>
  )
}
