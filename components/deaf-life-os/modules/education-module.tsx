"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, CheckCircle2, FileText, GraduationCap, Info, MessageSquare, Users, Video } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function EducationModule() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">IEP Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                <span>Current</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Active
              </Badge>
            </div>
            <Progress value={100} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">Next review: March 22, 2025</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Accommodations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                <span>All Active</span>
              </div>
              <Badge>4</Badge>
            </div>
            <Progress value={100} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">ASL interpreter, FM system, visual alerts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Academic Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                <span>On Track</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                85%
              </Badge>
            </div>
            <Progress value={85} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">Meeting grade-level expectations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                <span>IEP Meeting</span>
              </div>
              <Badge>7 days</Badge>
            </div>
            <Progress value={75} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">March 22, 2025 at 2:00 PM</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="iep">IEP</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Education Overview</CardTitle>
              <CardDescription>Your child's educational journey and support services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Current School Year</h3>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    2024-2025
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Student</p>
                    <p className="text-sm">Emma Johnson</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Grade</p>
                    <p className="text-sm">5th Grade</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">School</p>
                    <p className="text-sm">Anytown Elementary School</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Teacher</p>
                    <p className="text-sm">Ms. Sarah Wilson</p>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Current Support Team</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-pink-500" />
                        <span className="text-sm">Special Education Teacher</span>
                      </div>
                      <span className="text-sm font-medium">Ms. Jennifer Davis</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Video className="mr-2 h-4 w-4 text-pink-500" />
                        <span className="text-sm">ASL Interpreter</span>
                      </div>
                      <span className="text-sm font-medium">Mr. Michael Rodriguez</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-pink-500" />
                        <span className="text-sm">Speech Therapist</span>
                      </div>
                      <span className="text-sm font-medium">Ms. Lisa Chen</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-pink-500" />
                        <span className="text-sm">Audiologist</span>
                      </div>
                      <span className="text-sm font-medium">Dr. Robert Kim</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Communications</CardTitle>
                <CardDescription>Messages from school staff</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                      <GraduationCap className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Ms. Wilson (Teacher)</p>
                      <p className="text-sm text-muted-foreground">
                        Emma did excellent work on her science project about sound waves. She presented using ASL and
                        visual aids.
                      </p>
                      <p className="text-xs text-muted-foreground">March 14, 2025</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                      <Users className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Ms. Davis (Special Ed)</p>
                      <p className="text-sm text-muted-foreground">
                        IEP meeting scheduled for March 22nd. Please review the progress report I sent home.
                      </p>
                      <p className="text-xs text-muted-foreground">March 10, 2025</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                      <Video className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Mr. Rodriguez (Interpreter)</p>
                      <p className="text-sm text-muted-foreground">
                        Emma is becoming more confident in class discussions. Her ASL vocabulary is expanding nicely.
                      </p>
                      <p className="text-xs text-muted-foreground">March 8, 2025</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message to School
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Important dates and meetings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                        <Calendar className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">IEP Annual Review</p>
                        <p className="text-xs text-muted-foreground">March 22, 2025 at 2:00 PM</p>
                      </div>
                    </div>
                    <Badge>7 days</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                        <Calendar className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Parent-Teacher Conference</p>
                        <p className="text-xs text-muted-foreground">April 15, 2025 at 3:30 PM</p>
                      </div>
                    </div>
                    <Badge variant="outline">31 days</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                        <Calendar className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Spring Break</p>
                        <p className="text-xs text-muted-foreground">April 5-12, 2025</p>
                      </div>
                    </div>
                    <Badge variant="outline">21 days</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                        <Calendar className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Deaf Awareness Week</p>
                        <p className="text-xs text-muted-foreground">September 19-25, 2025</p>
                      </div>
                    </div>
                    <Badge variant="outline">6 months</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  View School Calendar
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="iep" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Individualized Education Program (IEP)</CardTitle>
              <CardDescription>Current IEP details and accommodations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Current IEP</h3>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Active
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">IEP Start Date</p>
                    <p className="text-sm">March 22, 2024</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">IEP End Date</p>
                    <p className="text-sm">March 21, 2025</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Next Review</p>
                    <p className="text-sm">March 22, 2025</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Case Manager</p>
                    <p className="text-sm">Ms. Jennifer Davis</p>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Current Goals</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Goal Area</TableHead>
                        <TableHead>Goal</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Reading</TableCell>
                        <TableCell>Read grade-level text with 80% comprehension</TableCell>
                        <TableCell>
                          <Progress value={85} className="w-16" />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            On Track
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="font-medium">Math</TableCell>
                        <TableCell>Solve multi-step word problems independently</TableCell>
                        <TableCell>
                          <Progress value={75} className="w-16" />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            On Track
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="font-medium">Communication</TableCell>
                        <TableCell>Use ASL to participate in class discussions</TableCell>
                        <TableCell>
                          <Progress value={90} className="w-16" />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Exceeding
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="font-medium">Social Skills</TableCell>
                        <TableCell>Initiate peer interactions during recess</TableCell>
                        <TableCell>
                          <Progress value={70} className="w-16" />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                            Needs Support
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Accommodations & Modifications</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-sm">ASL interpreter for all academic classes</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-sm">FM system for improved sound quality</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-sm">Visual emergency alerts and announcements</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-sm">Captioned educational videos</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-sm">Extended time for assignments requiring listening</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-sm">Preferential seating near teacher and interpreter</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Download IEP</Button>
                  <Button>Prepare for Meeting</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Progress</CardTitle>
              <CardDescription>Track your child's educational progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">A-</div>
                    <p className="text-sm text-muted-foreground">Reading</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">B+</div>
                    <p className="text-sm text-muted-foreground">Math</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">A</div>
                    <p className="text-sm text-muted-foreground">Science</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">A-</div>
                    <p className="text-sm text-muted-foreground">Social Studies</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Progress Reports</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Period</TableHead>
                        <TableHead>Overall Grade</TableHead>
                        <TableHead>IEP Goals Met</TableHead>
                        <TableHead>Comments</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Q2 2024-2025</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            A-
                          </Badge>
                        </TableCell>
                        <TableCell>3 of 4</TableCell>
                        <TableCell>Excellent progress in all areas</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="font-medium">Q1 2024-2025</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            B+
                          </Badge>
                        </TableCell>
                        <TableCell>3 of 4</TableCell>
                        <TableCell>Strong start to the year</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="font-medium">Q4 2023-2024</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            A-
                          </Badge>
                        </TableCell>
                        <TableCell>4 of 4</TableCell>
                        <TableCell>Finished year strong</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Assessment Results</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-md border p-4">
                      <h5 className="font-medium mb-2">State Assessment (Spring 2024)</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Reading</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Proficient
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Math</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Proficient
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Science</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Advanced
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-md border p-4">
                      <h5 className="font-medium mb-2">Benchmark Assessment (Winter 2025)</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Reading Level</span>
                          <span className="text-sm font-medium">5.8 (Above Grade Level)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Math Skills</span>
                          <span className="text-sm font-medium">5.5 (Grade Level)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">ASL Proficiency</span>
                          <span className="text-sm font-medium">Advanced</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Educational Resources</CardTitle>
              <CardDescription>Support services and learning materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Deaf Education Resources</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">ASL Learning Apps and Games</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Captioned Educational Videos Library</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Visual Learning Materials Collection</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Deaf Role Model Biography Series</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Technology Resources</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">FM System Training and Support</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Tablet with Educational Apps</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Visual Alert System for Classroom</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Speech-to-Text Software</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Support Services</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Speech Therapy (2x per week)</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Audiological Services (Monthly check-ups)</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Deaf Education Specialist Consultation</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Peer Mentoring Program</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Extracurricular Activities</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">ASL Club (Wednesdays 3:30-4:30 PM)</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Deaf Sports League</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Visual Arts Program</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Science Fair Participation</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Request Additional Resources
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="communication" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>School Communication</CardTitle>
              <CardDescription>Stay connected with your child's education team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Communication Preferences</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Preferred Communication Method</span>
                      <Badge variant="outline">Email + ASL Video</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Emergency Contact Method</span>
                      <Badge variant="outline">Text Message</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Meeting Format</span>
                      <Badge variant="outline">In-Person with Interpreter</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Quick Actions</h4>
                  <div className="grid gap-2 md:grid-cols-2">
                    <Button variant="outline" className="justify-start">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Message to Teacher
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Video className="mr-2 h-4 w-4" />
                      Schedule ASL Video Call
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      Request Meeting
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      Request Progress Report
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Recent Messages</h4>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 p-4 rounded-md border">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                        <GraduationCap className="h-5 w-5 text-pink-600" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Ms. Wilson (Teacher)</p>
                          <p className="text-xs text-muted-foreground">March 14, 2025</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Emma did excellent work on her science project about sound waves. She presented using ASL and
                          visual aids, demonstrating great understanding of the concepts.
                        </p>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Reply
                          </Button>
                          <Button size="sm" variant="outline">
                            <Video className="mr-1 h-3 w-3" />
                            Video Reply
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 rounded-md border">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                        <Users className="h-5 w-5 text-pink-600" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Ms. Davis (Special Education)</p>
                          <p className="text-xs text-muted-foreground">March 10, 2025</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          IEP meeting scheduled for March 22nd at 2:00 PM. Please review the progress report I sent
                          home. Let me know if you have any questions before the meeting.
                        </p>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Reply
                          </Button>
                          <Button size="sm" variant="outline">
                            <Calendar className="mr-1 h-3 w-3" />
                            Add to Calendar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Compose New Message
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
