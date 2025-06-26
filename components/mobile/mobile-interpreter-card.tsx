"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Video, Phone } from "lucide-react"

interface MobileInterpreterCardProps {
  interpreter: {
    id: number
    name: string
    type: string
    specialization: string[]
    status: string
    lastUsed: string
  }
}

export default function MobileInterpreterCard({ interpreter }: MobileInterpreterCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={`/placeholder.svg?height=48&width=48&query=${interpreter.type === "3D Avatar" ? "3d avatar face" : "professional person"}`}
              alt={interpreter.name}
            />
            <AvatarFallback>{interpreter.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-sm truncate">{interpreter.name}</h3>
              <Badge
                className={
                  interpreter.status === "Available"
                    ? "bg-green-100 text-green-800 hover:bg-green-100 text-xs"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-100 text-xs"
                }
              >
                {interpreter.status}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mb-1">{interpreter.type}</p>
            <div className="flex flex-wrap gap-1">
              {interpreter.specialization.slice(0, 2).map((spec) => (
                <Badge key={spec} variant="outline" className="text-xs bg-rose-50">
                  {spec}
                </Badge>
              ))}
              {interpreter.specialization.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{interpreter.specialization.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <MessageSquare className="mr-1 h-3 w-3" />
            <span className="text-xs">Chat</span>
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Video className="mr-1 h-3 w-3" />
            <span className="text-xs">Video</span>
          </Button>
          <Button size="sm" className="flex-1 bg-rose-600 hover:bg-rose-700">
            <Phone className="mr-1 h-3 w-3" />
            <span className="text-xs">Call</span>
          </Button>
        </div>

        <p className="text-xs text-gray-400 mt-2 text-center">Last used: {interpreter.lastUsed}</p>
      </CardContent>
    </Card>
  )
}
