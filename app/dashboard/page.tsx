import { AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusCard } from "@/components/status-card"
import { SystemHealth } from "@/components/system-health"
import { AccessibilityScore } from "@/components/accessibility-score"
import { RecentActivities } from "@/components/recent-activities"

// Sample data - in a real app, this would come from an API
const recentActivities = [
  {
    id: "1",
    action: "Video Transformation",
    component: "Accessibility Transformation",
    timestamp: "2 mins ago",
    status: "success" as const,
  },
  {
    id: "2",
    action: "Creator Validation",
    component: "Creator Management",
    timestamp: "15 mins ago",
    status: "success" as const,
  },
  {
    id: "3",
    action: "Video Upload",
    component: "Video Processing",
    timestamp: "1 hour ago",
    status: "warning" as const,
  },
  {
    id: "4",
    action: "Interface Analysis",
    component: "Interface Analysis",
    timestamp: "3 hours ago",
    status: "success" as const,
  },
  {
    id: "5",
    action: "Pipeline Update",
    component: "Workflow Management",
    timestamp: "5 hours ago",
    status: "error" as const,
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Mission Control</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatusCard title="System Uptime" value="99.99%" status="success" description="Last 30 days" />
        <StatusCard
          title="Security Status"
          value="Zero Breaches"
          status="success"
          description="Last security scan: 2 hours ago"
        />
        <StatusCard title="Compliance" value="100%" status="success" description="All standards met" />
        <StatusCard title="Active Monitoring" value="24/7" status="success" description="All systems operational" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SystemHealth uptime={99.99} security={100} compliance={100} monitoring={100} />
        <AccessibilityScore score={92} visualScore={95} aslScore={90} workflowScore={91} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RecentActivities activities={recentActivities} />
        <Card className="col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle>Missing Components</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span>Video Processing Infrastructure</span>
              </li>
              <li className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span>Content Delivery Network</span>
              </li>
              <li className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span>Human Validator Interface</span>
              </li>
              <li className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span>Progress Tracking System</span>
              </li>
              <li className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span>Notification System</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
