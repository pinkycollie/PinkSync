import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Video, Calendar, Clock } from "lucide-react"

export default function HumanInterpreterList() {
  // In a real app, we would fetch this data from an API
  // For demo purposes, we're using mock data
  const interpreters = [
    {
      id: 1,
      name: "Sarah Johnson",
      specialization: ["Legal", "Government"],
      certifications: ["Certified Legal Interpreter", "Government Clearance"],
      status: "Offline",
      availability: "Mon-Fri: 9AM-5PM",
      lastUsed: "3 days ago",
      imageUrl: "/placeholder.svg?height=80&width=80&query=professional woman smiling",
    },
    {
      id: 2,
      name: "Michael Chen",
      specialization: ["Medical", "Technical"],
      certifications: ["Medical Interpreter Certification", "Technical Specialist"],
      status: "Available",
      availability: "Mon-Thu: 10AM-6PM",
      lastUsed: "1 week ago",
      imageUrl: "/placeholder.svg?height=80&width=80&query=professional man smiling",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Human Interpreters</CardTitle>
        <CardDescription>Certified interpreters available for complex situations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {interpreters.map((interpreter) => (
            <div key={interpreter.id} className="flex flex-col md:flex-row gap-4 border rounded-lg p-4">
              <div className="flex items-center md:items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={interpreter.imageUrl || "/placeholder.svg"} alt={interpreter.name} />
                  <AvatarFallback>
                    {interpreter.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{interpreter.name}</h3>
                    <Badge
                      className={
                        interpreter.status === "Available"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }
                    >
                      {interpreter.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {interpreter.specialization.map((spec) => (
                      <Badge key={spec} variant="outline" className="bg-blue-50">
                        {spec}
                      </Badge>
                    ))}
                  </div>

                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Certifications: {interpreter.certifications.join(", ")}</p>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{interpreter.availability}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Last used: {interpreter.lastUsed}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex md:ml-auto gap-2 mt-4 md:mt-0">
                <Button variant="outline" className="flex-1 md:flex-none">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </Button>
                <Button variant="outline" className="flex-1 md:flex-none">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule
                </Button>
                <Button className="flex-1 md:flex-none bg-rose-600 hover:bg-rose-700">
                  <Video className="mr-2 h-4 w-4" />
                  Call Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
