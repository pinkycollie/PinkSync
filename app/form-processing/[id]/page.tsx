import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CheckCircle, Clock, FileText, MessageSquare } from "lucide-react"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import FormStatusTimeline from "@/components/form-processing/form-status-timeline"
import FormDataView from "@/components/form-processing/form-data-view"
import FormAIAnalysis from "@/components/form-processing/form-ai-analysis"

export default function FormDetailPage({ params }: { params: { id: string } }) {
  // In a real app, we would fetch the form data based on the ID
  // For demo purposes, we're using mock data
  const formData = {
    id: params.id,
    title: "Health Insurance Claim",
    provider: "BlueCross",
    status: "processing",
    progress: 85,
    createdAt: "2023-05-14T10:30:00Z",
    updatedAt: "2023-05-15T14:45:00Z",
    estimatedCompletion: "2023-05-16T16:00:00Z",
    formType: "healthcare",
    data: {
      patientName: "Jane Doe",
      policyNumber: "BC12345678",
      serviceDate: "2023-04-15",
      providerName: "Dr. Smith",
      diagnosis: "Routine checkup",
      claimAmount: "$250.00",
    },
  }

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
        return <FileText className="h-5 w-5 text-amber-500" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-rose-600 transition mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{formData.title}</h1>
              <p className="text-gray-500">Provider: {formData.provider}</p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="border-rose-200">
                <MessageSquare className="mr-2 h-4 w-4" />
                Get Help
              </Button>
              <Button className="bg-rose-600 hover:bg-rose-700">View Original Form</Button>
            </div>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {getStatusIcon(formData.status)}
                <CardTitle>Form Status</CardTitle>
              </div>
              {getStatusBadge(formData.status)}
            </div>
            <CardDescription>Last updated: {new Date(formData.updatedAt).toLocaleString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{formData.progress}%</span>
              </div>
              <Progress value={formData.progress} className="h-2" />
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-gray-500 mb-1">Created</p>
                <p className="font-medium">{new Date(formData.createdAt).toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-gray-500 mb-1">Last Updated</p>
                <p className="font-medium">{new Date(formData.updatedAt).toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-gray-500 mb-1">Estimated Completion</p>
                <p className="font-medium">{new Date(formData.estimatedCompletion).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="timeline" className="mb-8">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="data">Form Data</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <FormStatusTimeline formId={params.id} />
          </TabsContent>

          <TabsContent value="data">
            <FormDataView formData={formData.data} formType={formData.formType} />
          </TabsContent>

          <TabsContent value="analysis">
            <FormAIAnalysis formId={params.id} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-center mt-8">
          <Button variant="outline" className="mr-4">
            Cancel Request
          </Button>
          <Button className="bg-rose-600 hover:bg-rose-700">Download Summary</Button>
        </div>
      </main>
    </div>
  )
}
