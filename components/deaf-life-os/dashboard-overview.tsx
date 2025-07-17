import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Calendar, CheckCircle2, FileText, Info } from "lucide-react"

interface DashboardOverviewProps {
  detailed?: boolean
}

export function DashboardOverview({ detailed = false }: DashboardOverviewProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Government Tasks</CardTitle>
            <FileText className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">1 urgent action required</p>
            <Progress value={75} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Financial Health</CardTitle>
            <FileText className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Good</div>
            <p className="text-xs text-muted-foreground">Tax filing due in 14 days</p>
            <Progress value={85} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Education</CardTitle>
            <FileText className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Upcoming school meetings</p>
            <Progress value={100} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health</CardTitle>
            <FileText className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Appointment next week</p>
            <Progress value={90} className="mt-2 h-1" />
          </CardContent>
        </Card>
      </div>

      {detailed && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Your scheduled appointments and deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                      <Calendar className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">IRS Tax Filing Deadline</p>
                      <p className="text-sm text-muted-foreground">April 15, 2025</p>
                    </div>
                    <div className="ml-auto">
                      <Badge>14 days</Badge>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                      <Calendar className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">School IEP Meeting</p>
                      <p className="text-sm text-muted-foreground">March 22, 2025</p>
                    </div>
                    <div className="ml-auto">
                      <Badge>7 days</Badge>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                      <Calendar className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Audiologist Appointment</p>
                      <p className="text-sm text-muted-foreground">March 25, 2025</p>
                    </div>
                    <div className="ml-auto">
                      <Badge>10 days</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Action Items</CardTitle>
                <CardDescription>Tasks that require your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>City Property Tax Due</AlertTitle>
                    <AlertDescription>
                      Your property tax payment is due in 3 days. Click to process payment.
                    </AlertDescription>
                    <Button variant="outline" size="sm" className="mt-2">
                      Pay Now
                    </Button>
                  </Alert>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Update Contact Information</AlertTitle>
                    <AlertDescription>
                      The DMV requires updated contact information for your vehicle registration.
                    </AlertDescription>
                    <Button variant="outline" size="sm" className="mt-2">
                      Update Info
                    </Button>
                  </Alert>

                  <Alert variant="default" className="border-green-200 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">School Forms Completed</AlertTitle>
                    <AlertDescription className="text-green-700">
                      All required school forms have been submitted successfully.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Integration Status</CardTitle>
              <CardDescription>Status of your connected systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">IRS Integration</span>
                  <Badge variant="outline" className="ml-auto">
                    Connected
                  </Badge>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">State DMV</span>
                  <Badge variant="outline" className="ml-auto">
                    Connected
                  </Badge>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">School District</span>
                  <Badge variant="outline" className="ml-auto">
                    Connected
                  </Badge>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <span className="text-sm font-medium">City Utilities</span>
                  <Badge variant="outline" className="ml-auto">
                    Update Required
                  </Badge>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">FibonRoseTrust</span>
                  <Badge variant="outline" className="ml-auto">
                    Secure
                  </Badge>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">DeafAuth</span>
                  <Badge variant="outline" className="ml-auto">
                    Active
                  </Badge>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">Health Provider</span>
                  <Badge variant="outline" className="ml-auto">
                    Connected
                  </Badge>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium">County Records</span>
                  <Badge variant="outline" className="ml-auto">
                    Disconnected
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
