import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Video, Settings, Plus } from "lucide-react"

export default function AvatarInterpreterList() {
  // In a real app, we would fetch this data from an API
  // For demo purposes, we're using mock data
  const avatars = [
    {
      id: 1,
      name: "Maya",
      specialization: ["Healthcare", "Medical"],
      style: "Professional",
      status: "Available",
      lastUsed: "2 hours ago",
      imageUrl: "/placeholder-k0yol.png",
    },
    {
      id: 2,
      name: "Alex",
      specialization: ["Financial", "Banking"],
      style: "Business",
      status: "Available",
      lastUsed: "Yesterday",
      imageUrl: "/placeholder-wng00.png",
    },
    {
      id: 3,
      name: "Taylor",
      specialization: ["General", "Customer Service"],
      style: "Casual",
      status: "Available",
      lastUsed: "1 week ago",
      imageUrl: "/placeholder-kajqf.png",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        {avatars.map((avatar) => (
          <Card key={avatar.id} className="overflow-hidden">
            <div className="aspect-square bg-gray-100 relative">
              <Avatar className="h-full w-full rounded-none">
                <AvatarImage src={avatar.imageUrl || "/placeholder.svg"} alt={avatar.name} className="object-cover" />
                <AvatarFallback className="rounded-none text-4xl">{avatar.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute top-3 right-3">
                <Badge
                  className={
                    avatar.status === "Available"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                  }
                >
                  {avatar.status}
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-2">
              <CardTitle>{avatar.name}</CardTitle>
              <CardDescription>3D Avatar Interpreter</CardDescription>
            </CardHeader>

            <CardContent className="pb-2">
              <div className="flex flex-wrap gap-1 mb-2">
                {avatar.specialization.map((spec) => (
                  <Badge key={spec} variant="outline" className="bg-rose-50">
                    {spec}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-500">Style: {avatar.style}</p>
              <p className="text-sm text-gray-500">Last used: {avatar.lastUsed}</p>
            </CardContent>

            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Video className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}

        <Card className="flex flex-col items-center justify-center border-dashed">
          <CardContent className="pt-6 flex flex-col items-center">
            <div className="h-20 w-20 rounded-full bg-rose-50 flex items-center justify-center mb-4">
              <Plus className="h-10 w-10 text-rose-400" />
            </div>
            <h3 className="font-medium text-lg mb-2">Create New Avatar</h3>
            <p className="text-center text-gray-500 mb-4">
              Design a custom 3D avatar interpreter for your specific needs
            </p>
            <Button className="bg-rose-600 hover:bg-rose-700">Create Avatar</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
