"use client"

import { useState } from "react"
import { Clock, Filter, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for demonstration
const mockSubmissions = [
  {
    id: "1",
    title: "Financial Planning Consultation",
    date: "2023-05-08T14:30:00",
    status: "completed",
    processingType: "ai",
    thumbnail: "/financial-consultation.png",
  },
  {
    id: "2",
    title: "Insurance Policy Review",
    date: "2023-05-07T10:15:00",
    status: "processing",
    processingType: "human",
    thumbnail: "/insurance-review.png",
  },
  {
    id: "3",
    title: "Tax Planning Session",
    date: "2023-05-05T16:45:00",
    status: "completed",
    processingType: "both",
    thumbnail: "/tax-planning-concept.png",
  },
  {
    id: "4",
    title: "Development Project Update",
    date: "2023-05-03T09:00:00",
    status: "completed",
    processingType: "ai",
    thumbnail: "/project-update-meeting.png",
  },
]

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function SubmissionHistory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredSubmissions = mockSubmissions.filter((submission) => {
    // Filter by search query
    if (searchQuery && !submission.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Filter by tab
    if (activeTab === "ai" && submission.processingType !== "ai") return false
    if (activeTab === "human" && submission.processingType !== "human") return false
    if (activeTab === "both" && submission.processingType !== "both") return false
    if (activeTab === "processing" && submission.status !== "processing") return false
    if (activeTab === "completed" && submission.status !== "completed") return false

    return true
  })

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Submission History
        </CardTitle>
        <CardDescription>View and manage your previous video submissions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search submissions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <div className="space-y-4">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => <SubmissionItem key={submission.id} submission={submission} />)
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground">No submissions found</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="processing" className="mt-4">
            <div className="space-y-4">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => <SubmissionItem key={submission.id} submission={submission} />)
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground">No processing submissions found</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            <div className="space-y-4">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => <SubmissionItem key={submission.id} submission={submission} />)
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground">No completed submissions found</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function SubmissionItem({ submission }: { submission: any }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border p-3">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
        <img
          src={submission.thumbnail || "/placeholder.svg"}
          alt={submission.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{submission.title}</h3>
          <Badge variant={submission.status === "completed" ? "default" : "outline"}>
            {submission.status === "completed" ? "Completed" : "Processing"}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">{formatDate(submission.date)}</p>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {submission.processingType === "ai"
              ? "AI Processing"
              : submission.processingType === "human"
                ? "Human Review"
                : "AI + Human"}
          </Badge>

          {submission.processingType === "human" || submission.processingType === "both" ? (
            <Avatar className="h-5 w-5">
              <AvatarImage src="/diverse-group.png" alt="Reviewer" />
              <AvatarFallback>HR</AvatarFallback>
            </Avatar>
          ) : null}
        </div>
      </div>

      <Button variant="ghost" size="sm">
        View
      </Button>
    </div>
  )
}
