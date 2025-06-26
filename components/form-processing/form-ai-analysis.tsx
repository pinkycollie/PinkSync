import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, Info } from "lucide-react"

interface FormAIAnalysisProps {
  formId: string
}

export default function FormAIAnalysis({ formId }: FormAIAnalysisProps) {
  // In a real app, we would fetch the AI analysis based on the form ID
  // For demo purposes, we're using mock data
  const aiAnalysis = {
    summary:
      "This is a standard health insurance claim for a routine checkup with Dr. Smith. The claim amount of $250.00 is within the expected range for this type of service.",
    recommendations: [
      {
        type: "info",
        title: "Expected Processing Time",
        description: "Based on historical data, this type of claim typically takes 3-5 business days to process.",
      },
      {
        type: "success",
        title: "All Required Fields Present",
        description: "All necessary information has been provided for this claim.",
      },
      {
        type: "warning",
        title: "Potential Coverage Limitation",
        description: "Your policy may have a $50 copay for routine checkups. Please verify your coverage details.",
      },
    ],
    completeness: 95,
    accuracy: 98,
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5" />
      case "warning":
        return <AlertTriangle className="h-5 w-5" />
      case "info":
        return <Info className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Analysis</CardTitle>
        <CardDescription>Our AI has analyzed your form and provided the following insights</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-medium mb-2">Summary</h3>
          <p className="text-gray-700">{aiAnalysis.summary}</p>
        </div>

        <div>
          <h3 className="font-medium mb-3">Recommendations</h3>
          <div className="space-y-3">
            {aiAnalysis.recommendations.map((rec, index) => (
              <Alert key={index} variant={rec.type === "warning" ? "destructive" : "default"}>
                {getAlertIcon(rec.type)}
                <AlertTitle>{rec.title}</AlertTitle>
                <AlertDescription>{rec.description}</AlertDescription>
              </Alert>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium mb-2">Form Completeness</h3>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-green-600">{aiAnalysis.completeness}%</span>
              <div className="ml-3 h-2 bg-gray-200 rounded-full flex-1">
                <div className="h-2 bg-green-500 rounded-full" style={{ width: `${aiAnalysis.completeness}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium mb-2">Data Accuracy</h3>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-green-600">{aiAnalysis.accuracy}%</span>
              <div className="ml-3 h-2 bg-gray-200 rounded-full flex-1">
                <div className="h-2 bg-green-500 rounded-full" style={{ width: `${aiAnalysis.accuracy}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
