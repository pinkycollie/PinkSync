import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, FileText, AlertCircle, MessageSquare } from "lucide-react"

interface FormStatusTimelineProps {
  formId: string
}

export default function FormStatusTimeline({ formId }: FormStatusTimelineProps) {
  // In a real app, we would fetch the timeline data based on the form ID
  // For demo purposes, we're using mock data
  const timelineEvents = [
    {
      id: 1,
      status: "created",
      title: "Form Submitted",
      description: "Your health insurance claim form was submitted for processing.",
      timestamp: "2023-05-14T10:30:00Z",
      icon: <FileText className="h-5 w-5 text-gray-500" />,
    },
    {
      id: 2,
      status: "processing",
      title: "AI Processing Started",
      description: "Our AI system has begun analyzing and processing your form.",
      timestamp: "2023-05-14T10:32:00Z",
      icon: <Clock className="h-5 w-5 text-blue-500" />,
    },
    {
      id: 3,
      status: "needs_info",
      title: "Additional Information Requested",
      description: "We need your insurance member ID to complete the form.",
      timestamp: "2023-05-14T14:45:00Z",
      icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
    },
    {
      id: 4,
      status: "info_provided",
      title: "Information Provided",
      description: "You provided the requested insurance member ID.",
      timestamp: "2023-05-15T09:20:00Z",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    {
      id: 5,
      status: "processing",
      title: "Processing Resumed",
      description: "Form processing has resumed with the provided information.",
      timestamp: "2023-05-15T09:25:00Z",
      icon: <Clock className="h-5 w-5 text-blue-500" />,
    },
    {
      id: 6,
      status: "human_review",
      title: "Human Review",
      description: "A specialist is reviewing your form for accuracy.",
      timestamp: "2023-05-15T11:30:00Z",
      icon: <MessageSquare className="h-5 w-5 text-purple-500" />,
    },
  ]

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-8">
          {timelineEvents.map((event, index) => (
            <div key={event.id} className="relative pl-8">
              {/* Timeline connector */}
              {index < timelineEvents.length - 1 && (
                <div className="absolute left-[10px] top-[24px] bottom-[-32px] w-[2px] bg-gray-200"></div>
              )}

              {/* Event icon */}
              <div className="absolute left-0 top-0 bg-white p-1 rounded-full">{event.icon}</div>

              {/* Event content */}
              <div>
                <h3 className="font-medium text-gray-900">{event.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                <p className="text-gray-400 text-xs mt-2">{new Date(event.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
