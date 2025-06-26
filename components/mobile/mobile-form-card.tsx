"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle, Clock, AlertCircle, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface MobileFormCardProps {
  form: {
    id: number
    title: string
    provider: string
    progress: number
    status: string
    lastUpdated: string
  }
}

export default function MobileFormCard({ form }: MobileFormCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs">Processing</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">Completed</Badge>
      case "needs_info":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 text-xs">Needs Info</Badge>
      default:
        return <Badge className="text-xs">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "needs_info":
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      default:
        return null
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div className="mt-0.5">{getStatusIcon(form.status)}</div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-medium truncate">{form.title}</CardTitle>
              <p className="text-xs text-gray-500 truncate">Provider: {form.provider}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-2">
            {getStatusBadge(form.status)}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Download</DropdownMenuItem>
                <DropdownMenuItem>Share</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{form.progress}%</span>
            </div>
            <Progress value={form.progress} className="h-1.5" />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Updated: {form.lastUpdated}</span>
            <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-6 px-2">
              <span className="text-xs">View</span>
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
