import { getUser } from "@mbtq/auth"
import { redirect } from "next/navigation"
import { FundingSummary } from "@mbtq/ui/vr-client/funding-summary"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mbtq/ui/card"
import { Button } from "@mbtq/ui/button"
import { Badge } from "@mbtq/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@mbtq/ui/tabs"
import Link from "next/link"

// Mock data - in a real implementation, you would fetch this from your API
const mockFundingItems = [
  { name: "MacBook Pro M3 Pro", amount: 2999, status: "approved" as const },
  { name: "Envision Smart Glasses", amount: 1899, status: "approved" as const },
  { name: "Dual Monitor Setup", amount: 1499, status: "approved" as const },
  { name: "SignSpeak Integration", amount: 999, status: "approved" as const },
  { name: "Ergonomic Workstation", amount: 1799, status: "approved" as const },
  { name: "Developer Experience Platform", amount: 2400, status: "approved" as const },
]

const mockTotalAmount = mockFundingItems.reduce((total, item) => total + item.amount, 0)

const mockProjects = [
  {
    id: "pinksync",
    name: "PINKSYNC",
    description: "The data + AI engine powering real-time sync across apps, APIs, and platforms.",
    tags: ["AI", "Accessibility", "Integration"],
  },
  {
    id: "devsl",
    name: "DevSL Platform",
    description: "A visual-first development platform enabling gesture-native programming for Deaf developers.",
    tags: ["Development", "Sign Language", "Coding"],
  },
  {
    id: "pinky-ai",
    name: "PINKY AI MODELS",
    description: "Specialized AI models trained for deaf communication patterns and sign language understanding.",
    tags: ["AI", "Machine Learning", "NLP"],
  },
]

export default async function DashboardPage() {
  // Check if the user is authenticated
  const user = await getUser()
  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="funding">
            <TabsList className="mb-4">
              <TabsTrigger value="funding">Funding</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="funding">
              <FundingSummary
                items={mockFundingItems}
                totalAmount={mockTotalAmount}
                onDownloadPdf={() => {
                  // In a real implementation, this would download a PDF
                  console.log("Download PDF")
                }}
                onGenerateRequest={() => {
                  // In a real implementation, this would generate a request
                  console.log("Generate request")
                }}
              />
            </TabsContent>

            <TabsContent value="projects">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockProjects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button asChild>
                        <Link href={`/projects/${project.id}`}>View Project</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>Your vocational rehabilitation documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">IPE (Individual Plan for Employment)</p>
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          Approved
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Business Plan</p>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          Pending
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Accommodation Request</p>
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          Approved
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>

                    <Button className="w-full">Upload New Document</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>VR Client Profile</CardTitle>
              <CardDescription>Your vocational rehabilitation information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Client ID</h3>
                <p className="mt-1 font-mono">VR-{user.id.substring(0, 8).toUpperCase()}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Employment Goal</h3>
                <p className="mt-1">Self-Employment</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Funding Status</h3>
                <Badge className="mt-1 bg-green-100 text-green-800 border-green-200">Approved</Badge>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Counselor</h3>
                <p className="mt-1">Sarah Johnson</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Next Meeting</h3>
                <p className="mt-1">June 15, 2025 at 10:00 AM</p>
              </div>

              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" asChild>
                <Link href="/funding/request">Request New Funding</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/documents/upload">Upload Document</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/meetings/schedule">Schedule Meeting</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/messages">Message Counselor</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
