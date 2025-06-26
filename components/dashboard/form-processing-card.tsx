import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FileText, ArrowRight, CheckCircle, Clock, AlertCircle } from "lucide-react"
import MobileFormCard from "@/components/mobile/mobile-form-card"

export default function FormProcessingCard() {
  const forms = [
    {
      id: 1,
      title: "Health Insurance Claim",
      provider: "BlueCross",
      progress: 85,
      status: "processing",
      lastUpdated: "10 minutes ago",
    },
    {
      id: 2,
      title: "Mortgage Application",
      provider: "First National Bank",
      progress: 100,
      status: "completed",
      lastUpdated: "Yesterday",
    },
    {
      id: 3,
      title: "Tax Return Form",
      provider: "IRS",
      progress: 30,
      status: "needs_info",
      lastUpdated: "2 days ago",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Processing</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case "needs_info":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Needs Info</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "needs_info":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Form Processing</CardTitle>
            <CardDescription>Track your form submissions and their status</CardDescription>
          </div>
          <Button className="bg-rose-600 hover:bg-rose-700">
            <FileText className="mr-2 h-4 w-4" />
            New Form
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Mobile view */}
          <div className="md:hidden space-y-3">
            {forms.map((form) => (
              <MobileFormCard key={form.id} form={form} />
            ))}
          </div>

          {/* Desktop view */}
          <div className="hidden md:block space-y-6">
            {forms.map((form) => (
              <div key={form.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getStatusIcon(form.status)}</div>
                    <div>
                      <h3 className="font-medium">{form.title}</h3>
                      <p className="text-sm text-gray-500">Provider: {form.provider}</p>
                    </div>
                  </div>
                  {getStatusBadge(form.status)}
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{form.progress}%</span>
                  </div>
                  <Progress value={form.progress} className="h-2" />
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-500">Last updated: {form.lastUpdated}</span>
                  <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-0">
                    View Details
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <Button variant="outline">View All Forms</Button>
      </CardFooter>
    </Card>
  )
}
