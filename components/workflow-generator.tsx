"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowRight, Check } from "lucide-react"

export function WorkflowGenerator() {
  const [loading, setLoading] = useState(false)
  const [generatedWorkflow, setGeneratedWorkflow] = useState<null | {
    name: string
    description: string
    steps: { title: string; description: string }[]
  }>(null)

  const handleGenerateWorkflow = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setGeneratedWorkflow({
        name: "Invoice Processing Automation",
        description:
          "Automatically extract data from invoices, categorize them, and prepare for accounting software import",
        steps: [
          {
            title: "Document Scanning",
            description: "Scan incoming invoices using OCR technology",
          },
          {
            title: "Data Extraction",
            description: "Extract vendor, amount, date, and invoice number",
          },
          {
            title: "Categorization",
            description: "Categorize invoices by expense type and department",
          },
          {
            title: "Accounting Integration",
            description: "Prepare data for import into QuickBooks or other accounting software",
          },
        ],
      })
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Workflow Generator</CardTitle>
          <CardDescription>Describe your business process and let AI create an automated workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="workflow-name">Workflow Name</Label>
              <Input id="workflow-name" placeholder="e.g., Invoice Processing" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="workflow-description">Describe the process</Label>
              <Textarea
                id="workflow-description"
                placeholder="Describe what you want to automate..."
                className="min-h-[150px]"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleGenerateWorkflow} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                Generate Workflow
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>{generatedWorkflow ? generatedWorkflow.name : "Generated Workflow"}</CardTitle>
          <CardDescription>
            {generatedWorkflow ? generatedWorkflow.description : "Your AI-generated workflow will appear here"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {generatedWorkflow ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">AI Generated</Badge>
                <Badge variant="outline">4 Steps</Badge>
              </div>

              <div className="space-y-4">
                {generatedWorkflow.steps.map((step, index) => (
                  <div key={index} className="flex">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full border bg-background">
                      {index + 1}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-sm text-muted-foreground">
                  Describe your business process and click "Generate Workflow"
                </p>
              </div>
            </div>
          )}
        </CardContent>
        {generatedWorkflow && (
          <CardFooter className="justify-between">
            <Button variant="outline">Edit Workflow</Button>
            <Button>
              <Check className="mr-2 h-4 w-4" />
              Implement Workflow
            </Button>
          </CardFooter>
        )}
      </Card>

      <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
          <CardTitle>Popular Workflow Templates</CardTitle>
          <CardDescription>Start with a pre-built workflow template</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Invoice Processing",
                description: "Automate invoice data extraction and categorization",
                tags: ["Accounting", "Finance"],
              },
              {
                title: "Client Onboarding",
                description: "Streamline the process of onboarding new clients",
                tags: ["CRM", "Sales"],
              },
              {
                title: "Tax Document Organization",
                description: "Automatically organize and categorize tax documents",
                tags: ["Tax", "Compliance"],
              },
              {
                title: "Expense Approval",
                description: "Create an automated expense approval workflow",
                tags: ["Finance", "HR"],
              },
              {
                title: "Social Media Publishing",
                description: "Schedule and publish content across platforms",
                tags: ["Marketing", "Social Media"],
              },
              {
                title: "Email Marketing",
                description: "Automate email campaigns based on customer actions",
                tags: ["Marketing", "Sales"],
              },
            ].map((template, i) => (
              <Card key={i}>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {template.tags.map((tag, j) => (
                      <Badge key={j} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-4">
                  <Button variant="ghost" size="sm" className="w-full">
                    Use Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
