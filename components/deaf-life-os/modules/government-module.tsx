"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangle,
  Building,
  CheckCircle2,
  FileText,
  GraduationCap,
  Home,
  Info,
  Search,
  Upload,
  Download,
  Clock,
  X,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function GovernmentModule() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showDocumentUpload, setShowDocumentUpload] = useState(false)

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Federal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                <span>Good Standing</span>
              </div>
              <Badge>100%</Badge>
            </div>
            <Progress value={100} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">All federal requirements met</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                <span>Good Standing</span>
              </div>
              <Badge>95%</Badge>
            </div>
            <Progress value={95} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">Driver's license renewal in 45 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">City/County</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                <span>Action Required</span>
              </div>
              <Badge variant="destructive">70%</Badge>
            </div>
            <Progress value={70} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">Property tax payment due in 3 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">School District</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Info className="mr-2 h-5 w-5 text-blue-500" />
                <span>Meeting Scheduled</span>
              </div>
              <Badge variant="outline" className="bg-blue-50">
                100%
              </Badge>
            </div>
            <Progress value={100} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">IEP meeting on March 22, 2025</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="federal">Federal</TabsTrigger>
          <TabsTrigger value="state">State</TabsTrigger>
          <TabsTrigger value="local">City/County</TabsTrigger>
          <TabsTrigger value="school">School District</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Government Tasks</CardTitle>
              <CardDescription>Upcoming deadlines and requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Building className="mr-2 h-4 w-4 text-pink-500" />
                        Property Tax Payment
                      </div>
                    </TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>March 18, 2025</TableCell>
                    <TableCell>
                      <Badge variant="destructive">Due Soon</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm">Pay Now</Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <GraduationCap className="mr-2 h-4 w-4 text-pink-500" />
                        IEP Meeting
                      </div>
                    </TableCell>
                    <TableCell>School District</TableCell>
                    <TableCell>March 22, 2025</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        Scheduled
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-pink-500" />
                        Tax Filing
                      </div>
                    </TableCell>
                    <TableCell>Federal (IRS)</TableCell>
                    <TableCell>April 15, 2025</TableCell>
                    <TableCell>
                      <Badge variant="outline">In Progress</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        Continue
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Home className="mr-2 h-4 w-4 text-pink-500" />
                        Driver's License Renewal
                      </div>
                    </TableCell>
                    <TableCell>State DMV</TableCell>
                    <TableCell>April 30, 2025</TableCell>
                    <TableCell>
                      <Badge variant="outline">Upcoming</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        Schedule
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => setShowDocumentUpload(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Government Document
              </Button>
            </CardFooter>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Communications</CardTitle>
                <CardDescription>Messages from government entities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                      <Building className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">City Property Tax Office</p>
                      <p className="text-sm text-muted-foreground">
                        Reminder: Your property tax payment is due on March 18, 2025.
                      </p>
                      <p className="text-xs text-muted-foreground">March 10, 2025</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                      <FileText className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Internal Revenue Service</p>
                      <p className="text-sm text-muted-foreground">
                        Your tax documents have been processed and are ready for review.
                      </p>
                      <p className="text-xs text-muted-foreground">March 5, 2025</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                      <GraduationCap className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">School District</p>
                      <p className="text-sm text-muted-foreground">
                        Your child's IEP meeting has been scheduled for March 22, 2025.
                      </p>
                      <p className="text-xs text-muted-foreground">March 1, 2025</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Document Status</CardTitle>
                <CardDescription>Status of your government documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-pink-500" />
                      <span className="text-sm font-medium">Driver's License</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Valid
                      </Badge>
                      <span className="ml-2 text-xs text-muted-foreground">Expires: 04/30/2025</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-pink-500" />
                      <span className="text-sm font-medium">Passport</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Valid
                      </Badge>
                      <span className="ml-2 text-xs text-muted-foreground">Expires: 07/15/2028</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-pink-500" />
                      <span className="text-sm font-medium">Vehicle Registration</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Valid
                      </Badge>
                      <span className="ml-2 text-xs text-muted-foreground">Expires: 09/30/2025</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-pink-500" />
                      <span className="text-sm font-medium">Property Deed</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Valid
                      </Badge>
                      <span className="ml-2 text-xs text-muted-foreground">No Expiration</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Documents
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="federal" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Federal Government</CardTitle>
              <CardDescription>IRS and federal agency interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Tax Filing Status</h3>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    In Progress
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">2024 Tax Return</span>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Due: April 15, 2025</span>
                    </div>
                  </div>
                  <Progress value={60} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Documents Gathered</span>
                    <span>Review</span>
                    <span>Submit</span>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Required Documents</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      W-2 Forms
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      1099 Forms
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      Mortgage Interest Statement
                    </li>
                    <li className="flex items-center text-sm">
                      <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                      Charitable Donation Receipts
                    </li>
                  </ul>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Save Progress</Button>
                  <Button>Continue Tax Filing</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Federal Benefits</CardTitle>
              <CardDescription>Your federal benefit programs</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Program</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Next Action</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-pink-500" />
                        Social Security
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>Annual Review: Nov 2025</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-pink-500" />
                        Medicare
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>Open Enrollment: Oct 15 - Dec 7, 2025</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        View Benefits
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-pink-500" />
                        Veterans Benefits
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>No action required</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="state" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>State Government</CardTitle>
              <CardDescription>DMV and state agency interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Driver's License</h3>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Valid
                  </Badge>
                </div>

                <div className="rounded-md border p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">License Number</p>
                      <p className="text-sm">D12345678</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Expiration Date</p>
                      <p className="text-sm">April 30, 2025</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Class</p>
                      <p className="text-sm">C - Standard</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Restrictions</p>
                      <p className="text-sm">None</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Vehicle Registration</h3>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Valid
                  </Badge>
                </div>

                <div className="rounded-md border p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">License Plate</p>
                      <p className="text-sm">ABC 1234</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Expiration Date</p>
                      <p className="text-sm">September 30, 2025</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Vehicle</p>
                      <p className="text-sm">2022 Toyota Camry</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">VIN</p>
                      <p className="text-sm">1HGCM82633A123456</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Schedule DMV Appointment</Button>
                  <Button>Renew License</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>State Tax Information</CardTitle>
              <CardDescription>Your state tax status and history</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tax Year</TableHead>
                    <TableHead>Filing Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">2024</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        In Progress
                      </Badge>
                    </TableCell>
                    <TableCell>TBD</TableCell>
                    <TableCell>Not Due</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        Continue
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">2023</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Filed
                      </Badge>
                    </TableCell>
                    <TableCell>$2,450.00</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">2022</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Filed
                      </Badge>
                    </TableCell>
                    <TableCell>$2,180.00</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="local" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>City/County Government</CardTitle>
              <CardDescription>Property taxes and local services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Property Tax</h3>
                  <Badge variant="destructive">Due Soon</Badge>
                </div>

                <div className="rounded-md border p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Property Address</p>
                      <p className="text-sm">123 Main Street, Anytown, ST 12345</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Due Date</p>
                      <p className="text-sm font-medium text-red-500">March 18, 2025 (3 days)</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Amount Due</p>
                      <p className="text-sm">$3,250.00</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Parcel Number</p>
                      <p className="text-sm">123-456-789</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button>Pay Property Tax Now</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Utility Services</h3>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Paid
                  </Badge>
                </div>

                <div className="rounded-md border p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Water & Sewer</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Paid
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Trash Collection</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Paid
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Storm Water Fee</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Paid
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Local Services</CardTitle>
              <CardDescription>Community resources and services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Deaf Community Resources</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      Deaf Community Center - 456 Oak St, Anytown
                    </li>
                    <li className="flex items-center text-sm">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      ASL Interpreter Services - Available 24/7 through City Hall
                    </li>
                    <li className="flex items-center text-sm">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      Deaf Social Club - Meets every Tuesday at 7pm
                    </li>
                  </ul>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Emergency Services</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      Text-to-911 Service - Available in your area
                    </li>
                    <li className="flex items-center text-sm">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      Video Relay Service - Integrated with local emergency services
                    </li>
                    <li className="flex items-center text-sm">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      Emergency Alerts - Visual and vibration notifications enabled
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Find More Local Resources
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="school" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>School District</CardTitle>
              <CardDescription>Education services and meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Upcoming IEP Meeting</h3>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Scheduled
                  </Badge>
                </div>

                <div className="rounded-md border p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Date & Time</p>
                      <p className="text-sm">March 22, 2025 at 2:00 PM</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm">Anytown Elementary School, Room 105</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">ASL Interpreter</p>
                      <p className="text-sm">Confirmed</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Documents</p>
                      <p className="text-sm">Current IEP, Progress Reports</p>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Button variant="outline">Reschedule</Button>
                    <Button>Prepare for Meeting</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">School Communications</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                      <GraduationCap className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Special Education Department</p>
                      <p className="text-sm text-muted-foreground">
                        Your child's IEP meeting has been scheduled for March 22, 2025 at 2:00 PM.
                      </p>
                      <p className="text-xs text-muted-foreground">March 1, 2025</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                      <GraduationCap className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Principal's Office</p>
                      <p className="text-sm text-muted-foreground">
                        School will be closed for spring break from April 5-12, 2025.
                      </p>
                      <p className="text-xs text-muted-foreground">February 28, 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Educational Resources</CardTitle>
              <CardDescription>Support services and accommodations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Current Accommodations</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      ASL Interpreter for all classes
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      Visual emergency alerts
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      FM system in classroom
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      Captioned educational videos
                    </li>
                  </ul>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Available Resources</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      Deaf Education Specialist - Ms. Johnson
                    </li>
                    <li className="flex items-center text-sm">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      After-school ASL Club - Wednesdays 3:30-4:30pm
                    </li>
                    <li className="flex items-center text-sm">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      Deaf Peer Mentoring Program
                    </li>
                    <li className="flex items-center text-sm">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      Parent Support Group - First Thursday of each month
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Request Additional Accommodations
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {showDocumentUpload && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Upload Government Document</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowDocumentUpload(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="document-type">Document Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tax">Tax Document</SelectItem>
                    <SelectItem value="id">Identification</SelectItem>
                    <SelectItem value="property">Property Record</SelectItem>
                    <SelectItem value="vehicle">Vehicle Document</SelectItem>
                    <SelectItem value="school">School Document</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="document-name">Document Name</Label>
                <Input id="document-name" placeholder="Enter document name" />
              </div>

              <div className="space-y-2">
                <Label>Upload File</Label>
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-pink-100">
                    <Upload className="h-10 w-10 text-pink-600" />
                  </div>
                  <p className="mt-4 text-sm font-medium">Drag & drop file or click to browse</p>
                  <p className="text-xs text-muted-foreground">Supports PDF, JPG, PNG (max 10MB)</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="document-notes">Notes (Optional)</Label>
                <Input id="document-notes" placeholder="Add any notes about this document" />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDocumentUpload(false)}>
                Cancel
              </Button>
              <Button>Upload Document</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
