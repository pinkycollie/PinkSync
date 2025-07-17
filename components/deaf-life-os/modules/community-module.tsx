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
  Heart,
  Info,
  MapPin,
  MessageSquare,
  Users,
  Video,
  Clock,
  Star,
  Phone,
  Globe,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function CommunityModule() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Community Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-pink-500" />
                <span>Upcoming</span>
              </div>
              <Badge>5</Badge>
            </div>
            <Progress value={75} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">ASL meetup this Saturday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Support Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-pink-500" />
                <span>Active</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                3
              </Badge>
            </div>
            <Progress value={100} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">Parent support group meets weekly</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Info className="mr-2 h-5 w-5 text-pink-500" />
                <span>Available</span>
              </div>
              <Badge>12</Badge>
            </div>
            <Progress value={90} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">Local deaf services directory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Connections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Heart className="mr-2 h-5 w-5 text-pink-500" />
                <span>Network</span>
              </div>
              <Badge variant="outline" className="bg-pink-50 text-pink-700">
                24
              </Badge>
            </div>
            <Progress value={60} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">Connected families and friends</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="groups">Support Groups</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Overview</CardTitle>
              <CardDescription>Your connection to the deaf community and support network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Local Deaf Community Center</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-pink-500" />
                      <span className="text-sm">456 Oak Street, Anytown, ST 12345</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-pink-500" />
                      <span className="text-sm">(555) 678-9012 (VP/Text)</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-pink-500" />
                      <span className="text-sm">Mon-Fri 9AM-6PM, Sat 10AM-4PM</span>
                    </div>
                    <div className="flex items-center">
                      <Globe className="mr-2 h-4 w-4 text-pink-500" />
                      <span className="text-sm">www.anytowndeafcenter.org</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Quick Access Services</h4>
                  <div className="grid gap-2 md:grid-cols-2">
                    <Button variant="outline" className="justify-start">
                      <Video className="mr-2 h-4 w-4" />
                      ASL Interpreter Request
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Community Chat
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      Event Calendar
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Info className="mr-2 h-4 w-4" />
                      Resource Directory
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Community events and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                        <Users className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">ASL Social Meetup</p>
                        <p className="text-xs text-muted-foreground">Saturday, March 16, 2025 at 2:00 PM</p>
                      </div>
                    </div>
                    <Badge>Tomorrow</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                        <Heart className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Parent Support Group</p>
                        <p className="text-xs text-muted-foreground">Tuesday, March 19, 2025 at 7:00 PM</p>
                      </div>
                    </div>
                    <Badge variant="outline">5 days</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                        <Video className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">ASL Storytelling Night</p>
                        <p className="text-xs text-muted-foreground">Friday, March 22, 2025 at 6:30 PM</p>
                      </div>
                    </div>
                    <Badge variant="outline">8 days</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                        <Calendar className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Deaf Awareness Workshop</p>
                        <p className="text-xs text-muted-foreground">Saturday, March 30, 2025 at 10:00 AM</p>
                      </div>
                    </div>
                    <Badge variant="outline">16 days</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  View All Events
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Community Resources</CardTitle>
                <CardDescription>Essential services and support</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                      <Video className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">ASL Interpreter Services</p>
                      <p className="text-sm text-muted-foreground">24/7 availability for emergencies</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                      <Phone className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Video Relay Service</p>
                      <p className="text-sm text-muted-foreground">Free communication service</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                      <Users className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Deaf Mentorship Program</p>
                      <p className="text-sm text-muted-foreground">Connect with deaf role models</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                      <Info className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Legal Advocacy Services</p>
                      <p className="text-sm text-muted-foreground">ADA compliance and rights protection</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Info className="mr-2 h-4 w-4" />
                  Browse All Resources
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Events</CardTitle>
              <CardDescription>Discover and participate in deaf community events</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-pink-500" />
                        ASL Social Meetup
                      </div>
                    </TableCell>
                    <TableCell>Mar 16, 2025 2:00 PM</TableCell>
                    <TableCell>Deaf Community Center</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        Social
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm">RSVP</Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Heart className="mr-2 h-4 w-4 text-pink-500" />
                        Parent Support Group
                      </div>
                    </TableCell>
                    <TableCell>Mar 19, 2025 7:00 PM</TableCell>
                    <TableCell>Community Center Room B</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Support
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm">RSVP</Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Video className="mr-2 h-4 w-4 text-pink-500" />
                        ASL Storytelling Night
                      </div>
                    </TableCell>
                    <TableCell>Mar 22, 2025 6:30 PM</TableCell>
                    <TableCell>Main Auditorium</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700">
                        Cultural
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm">RSVP</Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Info className="mr-2 h-4 w-4 text-pink-500" />
                        Deaf Awareness Workshop
                      </div>
                    </TableCell>
                    <TableCell>Mar 30, 2025 10:00 AM</TableCell>
                    <TableCell>Conference Room A</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                        Educational
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm">RSVP</Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-pink-500" />
                        Deaf Sports League
                      </div>
                    </TableCell>
                    <TableCell>Apr 5, 2025 1:00 PM</TableCell>
                    <TableCell>City Recreation Center</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700">
                        Sports
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        Learn More
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="flex space-x-2 w-full">
                <Button variant="outline" className="flex-1">
                  Create Event
                </Button>
                <Button className="flex-1">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Calendar
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Support Groups</CardTitle>
              <CardDescription>Connect with others who share similar experiences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Parents of Deaf Children</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-pink-500" />
                          <span className="text-sm">24 active members</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-pink-500" />
                          <span className="text-sm">Meets every Tuesday 7:00 PM</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-pink-500" />
                          <span className="text-sm">Community Center Room B</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="mr-2 h-4 w-4 text-yellow-500" />
                          <span className="text-sm">4.8/5 rating</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Join Group</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Young Deaf Professionals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-pink-500" />
                          <span className="text-sm">18 active members</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-pink-500" />
                          <span className="text-sm">Meets monthly, 1st Saturday</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-pink-500" />
                          <span className="text-sm">Various locations</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="mr-2 h-4 w-4 text-yellow-500" />
                          <span className="text-sm">4.6/5 rating</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Join Group</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Cochlear Implant Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-pink-500" />
                          <span className="text-sm">15 active members</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-pink-500" />
                          <span className="text-sm">Meets bi-weekly, Thursdays</span>
                        </div>
                        <div className="flex items-center">
                          <Video className="mr-2 h-4 w-4 text-pink-500" />
                          <span className="text-sm">Virtual and in-person</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="mr-2 h-4 w-4 text-yellow-500" />
                          <span className="text-sm">4.9/5 rating</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Join Group</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">ASL Learning Circle</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-pink-500" />
                          <span className="text-sm">32 active members</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-pink-500" />
                          <span className="text-sm">Meets weekly, Wednesdays</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-pink-500" />
                          <span className="text-sm">Library Community Room</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="mr-2 h-4 w-4 text-yellow-500" />
                          <span className="text-sm">4.7/5 rating</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Join Group</Button>
                    </CardFooter>
                  </Card>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Group Benefits</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-sm">Peer support and shared experiences</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-sm">Professional facilitation available</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-sm">ASL interpretation provided</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-sm">Confidential and safe environment</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Start New Support Group
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Resources</CardTitle>
              <CardDescription>Essential services and support for the deaf community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Communication Services</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Availability</TableHead>
                        <TableHead>Contact</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">ASL Interpreters</TableCell>
                        <TableCell>Deaf Community Center</TableCell>
                        <TableCell>24/7 Emergency</TableCell>
                        <TableCell>(555) 678-9012</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Video Relay Service</TableCell>
                        <TableCell>Multiple Providers</TableCell>
                        <TableCell>24/7</TableCell>
                        <TableCell>711</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">CART Services</TableCell>
                        <TableCell>Regional CART Provider</TableCell>
                        <TableCell>By Appointment</TableCell>
                        <TableCell>(555) 789-0123</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Educational Resources</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">ASL Classes for all levels</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Deaf Culture workshops</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Technology training sessions</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Career development programs</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Support Services</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Mental health counseling (ASL fluent)</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Legal advocacy and ADA compliance</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Employment assistance and job placement</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Housing assistance and accommodations</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Emergency Services</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Text-to-911 service available</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Emergency interpreter services</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Visual alert systems in public buildings</span>
                    </div>
                    <div className="flex items-center">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="text-sm">Emergency notification system registration</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex space-x-2 w-full">
                <Button variant="outline" className="flex-1">
                  Request Service
                </Button>
                <Button className="flex-1">
                  <Info className="mr-2 h-4 w-4" />
                  Resource Guide
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Network</CardTitle>
              <CardDescription>Connect with friends, family, and community members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">24</div>
                    <p className="text-sm text-muted-foreground">Total Connections</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">8</div>
                    <p className="text-sm text-muted-foreground">Close Friends</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">16</div>
                    <p className="text-sm text-muted-foreground">Community Members</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Recent Connections</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                          <Users className="h-5 w-5 text-pink-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Sarah Chen</p>
                          <p className="text-xs text-muted-foreground">Parent from support group</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Video className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                          <Users className="h-5 w-5 text-pink-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Mike Rodriguez</p>
                          <p className="text-xs text-muted-foreground">ASL interpreter</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Video className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                          <Users className="h-5 w-5 text-pink-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Emma Davis</p>
                          <p className="text-xs text-muted-foreground">Young professional group</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Video className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                          <Users className="h-5 w-5 text-pink-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Dr. Lisa Park</p>
                          <p className="text-xs text-muted-foreground">Audiologist</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Connection Preferences</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Preferred Communication</span>
                      <Badge variant="outline">ASL Video + Text</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Privacy Level</span>
                      <Badge variant="outline">Friends Only</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Profile Visibility</span>
                      <Badge variant="outline">Community Members</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex space-x-2 w-full">
                <Button variant="outline" className="flex-1">
                  Find Connections
                </Button>
                <Button className="flex-1">
                  <Users className="mr-2 h-4 w-4" />
                  Invite Friends
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
