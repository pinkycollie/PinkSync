import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, MessageSquare, CheckCircle, Clock, AlertCircle } from "lucide-react"

export default function RecentActivitiesCard() {
  const activities = [
    {
      id: 1,
      type: "form_completed",
      title: "Health Insurance Claim Completed",
      description: "Your form was successfully processed and submitted.",
      time: "2 hours ago",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    {
      id: 2,
      type: "message",
      title: "New Message from Maya",
      description: "Your 3D avatar interpreter has sent you a message.",
      time: "Yesterday",
      icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
    },
    {
      id: 3,
      type: "form_started",
      title: "Tax Return Form Started",
      description: "AI has begun processing your tax return form.",
      time: "2 days ago",
      icon: <FileText className="h-5 w-5 text-rose-500" />,
    },
    {
      id: 4,
      type: "needs_attention",
      title: "Mortgage Application Needs Information",
      description: "Additional information is required to complete your application.",
      time: "3 days ago",
      icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
    },
    {
      id: 5,
      type: "verification",
      title: "Identity Verified",
      description: "Your PinkSync VCode verification was successful.",
      time: "1 week ago",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Your latest interactions and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
              <div className="mt-0.5">{activity.icon}</div>
              <div>
                <h3 className="font-medium text-sm">{activity.title}</h3>
                <p className="text-sm text-gray-500">{activity.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <Button variant="outline">View All Activity</Button>
      </CardFooter>
    </Card>
  )
}
