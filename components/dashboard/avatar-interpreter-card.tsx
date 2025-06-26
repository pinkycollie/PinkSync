import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Video, MessageSquare, Plus } from "lucide-react"

export default function AvatarInterpreterCard() {
  const interpreters = [
    {
      id: 1,
      name: "Maya",
      type: "3D Avatar",
      specialization: "Healthcare",
      status: "Available",
      lastUsed: "2 hours ago",
    },
    {
      id: 2,
      name: "Alex",
      type: "3D Avatar",
      specialization: "Financial",
      status: "Available",
      lastUsed: "Yesterday",
    },
    {
      id: 3,
      name: "Sarah Johnson",
      type: "Human Interpreter",
      specialization: "Legal",
      status: "Offline",
      lastUsed: "3 days ago",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Your Interpreters</CardTitle>
            <CardDescription>Manage your 3D avatars and human interpreters</CardDescription>
          </div>
          <Button className="bg-rose-600 hover:bg-rose-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Interpreter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {interpreters.map((interpreter) => (
            <div key={interpreter.id} className="flex items-center justify-between border rounded-lg p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={`/abstract-geometric-shapes.png?height=48&width=48&query=${interpreter.type === "3D Avatar" ? "3d avatar face" : "professional person"}`}
                    alt={interpreter.name}
                  />
                  <AvatarFallback>{interpreter.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{interpreter.name}</h3>
                    <Badge
                      className={
                        interpreter.type === "3D Avatar"
                          ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                      }
                    >
                      {interpreter.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">Specializes in {interpreter.specialization}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`h-2 w-2 rounded-full ${interpreter.status === "Available" ? "bg-green-500" : "bg-gray-300"}`}
                    ></span>
                    <span className="text-xs">{interpreter.status}</span>
                    <span className="text-xs text-gray-400">• Last used: {interpreter.lastUsed}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Video className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <Button variant="outline">Manage All Interpreters</Button>
      </CardFooter>
    </Card>
  )
}
