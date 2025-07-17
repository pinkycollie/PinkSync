"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  CheckCircle2,
  FileText,
  Heart,
  Info,
  MessageSquare,
  Phone,
  Stethoscope,
  User,
  Video,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function HealthModule() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Health Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                <span>Good</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Stable
              </Badge>
            </div>
            <Progress value={85} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">Last checkup: Feb 15, 2025</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hearing Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                <span>Monitored</span>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Stable
              </Badge>
            </div>
            <Progress value={100} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">Next audiogram: June 15, 2025</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                <span>Upcoming</span>
              </div>
              <Badge>1</Badge>
            </div>
            <Progress value={50} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">Audiologist: March 25, 2025</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                <span>Current</span>
              </div>
              <Badge>0</Badge>
            </div>
            <Progress value={100} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">No active prescriptions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="hearing">Hearing Health</TabsTrigger>
          <TabsTrigger value="records">Medical Records</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Overview</CardTitle>
              <CardDescription>Your comprehensive health status and care coordination</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Primary Care Physician</p>
                    <p className="text-sm">Dr. Sarah Martinez, MD</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Audiologist</p>
                    <p className="text-sm">Dr. Michael Chen, AuD</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Insurance</p>
                    <p className="text-sm">Blue Cross Blue Shield</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Emergency Contact</p>
                    <p className="text-sm">Jane Johnson (Mother)</p>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Health Summary</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-sm">Congenital sensorineural hearing loss (bilateral, profound)</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-sm">Cochlear implants (bilateral) - functioning well</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-sm">No known allergies</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-sm">Up to date on all vaccinations</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Accessibility Accommodations</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">ASL interpreter available for all appointments</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Written communication preferred for instructions</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Visual alerts for appointment reminders</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Video relay service for phone consultations</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest health-related activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                      <Stethoscope className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Annual Physical Exam</p>
                      <p className="text-sm text-muted-foreground">
                        Completed annual checkup with Dr. Martinez. All vitals normal.
                      </p>
                      <p className="text-xs text-muted-foreground">February 15, 2025</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                      <Heart className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Cochlear Implant Mapping</p>
                      <p className="text-sm text-muted-foreground">
                        Routine mapping session completed. Settings optimized for better clarity.
                      </p>
                      <p className="text-xs text-muted-foreground">January 20, 2025</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                      <FileText className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Lab Results</p>
                      <p className="text-sm text-muted-foreground">
                        Blood work results received. All values within normal range.
                      </p>
                      <p className="text-xs text-muted-foreground">January 10, 2025</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Health Reminders</CardTitle>
                <CardDescription>Important health tasks and reminders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                        <Calendar className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Audiologist Appointment</p>
                        <p className="text-xs text-muted-foreground">March 25, 2025 at 10:00 AM</p>
                      </div>
                    </div>
                    <Badge>10 days</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                        <Heart className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Cochlear Implant Check</p>
                        <p className="text-xs text-muted-foreground">Due: April 20, 2025</p>
                      </div>
                    </div>
                    <Badge variant="outline">36 days</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                        <FileText className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Annual Audiogram</p>
                        <p className="text-xs text-muted-foreground">Due: June 15, 2025</p>
                      </div>
                    </div>
                    <Badge variant="outline">92 days</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                        <Stethoscope className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Dental Cleaning</p>
                        <p className="text-xs text-muted-foreground">Due: August 15, 2025</p>
                      </div>
                    </div>
                    <Badge variant="outline">153 days</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Appointment
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Appointments</CardTitle>
              <CardDescription>Manage your healthcare appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-pink-500" />
                        Mar 25, 2025 10:00 AM
                      </div>
                    </TableCell>
                    <TableCell>Dr. Michael Chen, AuD</TableCell>
                    <TableCell>Audiologist Follow-up</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        Scheduled
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-pink-500" />
                        Apr 20, 2025 2:00 PM
                      </div>
                    </TableCell>
                    <TableCell>Dr. Lisa Park, AuD</TableCell>
                    <TableCell>Cochlear Implant Mapping</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        Scheduled
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-pink-500" />
                        Jun 15, 2025 9:00 AM
                      </div>
                    </TableCell>
                    <TableCell>Dr. Michael Chen, AuD</TableCell>
                    <TableCell>Annual Audiogram</TableCell>
                    <TableCell>
                      <Badge variant="outline">Pending</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm">Schedule</Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-pink-500" />
                        Feb 15, 2025 11:00 AM
                      </div>
                    </TableCell>
                    <TableCell>Dr. Sarah Martinez, MD</TableCell>
                    <TableCell>Annual Physical</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Completed
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        View Notes
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule New Appointment
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appointment Preferences</CardTitle>
              <CardDescription>Your accessibility and communication preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Communication Preferences</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">ASL Interpreter Required</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Yes
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Preferred Reminder Method</span>
                      <Badge variant="outline">Text + Visual Alert</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Appointment Notes</span>
                      <Badge variant="outline">Written Summary Required</Badge>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Accessibility Needs</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-sm">Visual alert system for waiting room</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-sm">Written instructions and discharge summaries</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-sm">Face-to-face communication when possible</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-sm">Video relay service for phone consultations</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Update Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="hearing" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Hearing Health</CardTitle>
              <CardDescription>Comprehensive hearing health management and cochlear implant care</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Hearing Loss Type</p>
                    <p className="text-sm">Congenital Sensorineural (Bilateral, Profound)</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Cochlear Implants</p>
                    <p className="text-sm">Bilateral - Cochlear Nucleus 7</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Implant Date</p>
                    <p className="text-sm">Left: June 2020, Right: August 2020</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last Mapping</p>
                    <p className="text-sm">January 20, 2025</p>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Cochlear Implant Status</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        <span className="text-sm">Left Implant</span>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Functioning Well
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        <span className="text-sm">Right Implant</span>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Functioning Well
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        <span className="text-sm">Battery Life</span>
                      </div>
                      <Badge variant="outline">Normal (5-7 days)</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        <span className="text-sm">Sound Quality</span>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Excellent
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Recent Audiograms</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Results</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Jan 20, 2025</TableCell>
                        <TableCell>Aided Audiogram</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Stable
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="font-medium">Jun 15, 2024</TableCell>
                        <TableCell>Annual Audiogram</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Stable
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="font-medium">Dec 10, 2023</TableCell>
                        <TableCell>Routine Check</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Stable
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Hearing Aids & Accessories</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cochlear Nucleus 7 Processors</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Wireless Accessories</span>
                      <Badge variant="outline">Phone Clip, TV Streamer</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Backup Processors</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Available
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Battery Supply</span>
                      <Badge variant="outline">Adequate (2 months)</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex space-x-2 w-full">
                <Button variant="outline" className="flex-1">
                  Order Supplies
                </Button>
                <Button className="flex-1">Schedule Mapping</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical Records</CardTitle>
              <CardDescription>Access and manage your health records</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-pink-500" />
                        Annual Physical Report
                      </div>
                    </TableCell>
                    <TableCell>Feb 15, 2025</TableCell>
                    <TableCell>Dr. Sarah Martinez</TableCell>
                    <TableCell>Physical Exam</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-pink-500" />
                        Cochlear Implant Mapping Report
                      </div>
                    </TableCell>
                    <TableCell>Jan 20, 2025</TableCell>
                    <TableCell>Dr. Lisa Park</TableCell>
                    <TableCell>Audiology</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-pink-500" />
                        Blood Work Results
                      </div>
                    </TableCell>
                    <TableCell>Jan 10, 2025</TableCell>
                    <TableCell>Dr. Sarah Martinez</TableCell>
                    <TableCell>Lab Results</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-pink-500" />
                        Audiogram Results
                      </div>
                    </TableCell>
                    <TableCell>Jun 15, 2024</TableCell>
                    <TableCell>Dr. Michael Chen</TableCell>
                    <TableCell>Audiology</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-pink-500" />
                        Vaccination Record
                      </div>
                    </TableCell>
                    <TableCell>Mar 10, 2024</TableCell>
                    <TableCell>Dr. Sarah Martinez</TableCell>
                    <TableCell>Immunization</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="flex space-x-2 w-full">
                <Button variant="outline" className="flex-1">
                  Request Records
                </Button>
                <Button variant="outline" className="flex-1">
                  Upload Document
                </Button>
                <Button className="flex-1">Share Records</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Healthcare Providers</CardTitle>
              <CardDescription>Your healthcare team and contact information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Primary Care</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-pink-500" />
                          <span className="text-sm font-medium">Dr. Sarah Martinez, MD</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="mr-2 h-4 w-4 text-pink-500" />
                          <span className="text-sm">(555) 123-4567</span>
                        </div>
                        <div className="flex items-center">
                          <Info className="mr-2 h-4 w-4 text-pink-500" />
                          <span className="text-sm">Family Medicine Associates</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                          <span className="text-sm">ASL Interpreter Available</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex space-x-2 w-full">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Phone className="mr-1 h-3 w-3" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <MessageSquare className="mr-1 h-3 w-3" />
                          Message
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Audiologist</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-pink-500" />
                          <span className="text-sm font-medium">Dr. Michael Chen, AuD</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="mr-2 h-4 w-4 text-pink-500" />
                          <span className="text-sm">(555) 234-5678</span>
                        </div>
                        <div className="flex items-center">
                          <Info className="mr-2 h-4 w-4 text-pink-500" />
                          <span className="text-sm">Hearing Health Center</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                          <span className="text-sm">Deaf Community Specialist</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex space-x-2 w-full">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Phone className="mr-1 h-3 w-3" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Video className="mr-1 h-3 w-3" />
                          Video
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Cochlear Implant Specialist</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-pink-500" />
                          <span className="text-sm font-medium">Dr. Lisa Park, AuD</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="mr-2 h-4 w-4 text-pink-500" />
                          <span className="text-sm">(555) 345-6789</span>
                        </div>
                        <div className="flex items-center">
                          <Info className="mr-2 h-4 w-4 text-pink-500" />
                          <span className="text-sm">Cochlear Implant Center</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                          <span className="text-sm">Mapping Specialist</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex space-x-2 w-full">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Calendar className="mr-1 h-3 w-3" />
                          Schedule
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <MessageSquare className="mr-1 h-3 w-3" />
                          Message
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Emergency Contact</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-pink-500" />
                          <span className="text-sm font-medium">Jane Johnson (Mother)</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="mr-2 h-4 w-4 text-pink-500" />
                          <span className="text-sm">(555) 456-7890</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="mr-2 h-4 w-4 text-pink-500" />
                          <span className="text-sm">Text: (555) 456-7890</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                          <span className="text-sm">ASL Fluent</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex space-x-2 w-full">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Phone className="mr-1 h-3 w-3" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <MessageSquare className="mr-1 h-3 w-3" />
                          Text
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Healthcare Team Notes</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">All providers are familiar with deaf community needs</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">ASL interpreters available at all locations</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Written communication preferred for complex instructions</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Emergency protocols include visual alerts</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Add New Provider
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
