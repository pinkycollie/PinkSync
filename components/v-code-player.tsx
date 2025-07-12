"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, RotateCcw, CheckCircle, AlertTriangle, Clock, Edit } from "lucide-react"

interface VCodePlayerProps {
  vcode: {
    id: string
    timestamp: string
    content: string
    status: "verified" | "pending" | "corrected"
    documentType: string
    videoUrl: string
    originalContent?: string
  }
}

export function VCodePlayer({ vcode }: VCodePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showCorrection, setShowCorrection] = useState(false)

  const statusColors = {
    verified: "bg-green-100 text-green-800",
    pending: "bg-amber-100 text-amber-800",
    corrected: "bg-blue-100 text-blue-800",
  }

  const statusIcons = {
    verified: <CheckCircle size={16} className="text-green-500" />,
    pending: <Clock size={16} className="text-amber-500" />,
    corrected: <AlertTriangle size={16} className="text-blue-500" />,
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              vCode: {vcode.id}
              <Badge variant="outline" className={cn("ml-2 flex items-center gap-1", statusColors[vcode.status])}>
                {statusIcons[vcode.status]}
                <span className="capitalize">{vcode.status}</span>
              </Badge>
            </CardTitle>
            <CardDescription>
              {new Date(vcode.timestamp).toLocaleString()} • {vcode.documentType}
            </CardDescription>
          </div>

          {vcode.status === "corrected" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCorrection(!showCorrection)}
              className="text-blue-600"
            >
              {showCorrection ? "Show Current" : "Show Original"}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative bg-black rounded-md overflow-hidden aspect-video">
          <img
            src={vcode.videoUrl || "/placeholder.svg"}
            alt="ASL Video Recording"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-16 w-16 rounded-full bg-black/30 text-white hover:bg-black/50"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </Button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex justify-between items-center">
              <div className="text-white text-sm font-medium">00:00 / 00:12</div>
              <Button variant="ghost" size="icon" className="text-white">
                <RotateCcw size={16} />
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="interpretation">
          <TabsList className="w-full">
            <TabsTrigger value="interpretation" className="flex-1">
              AI Interpretation
            </TabsTrigger>
            <TabsTrigger value="metadata" className="flex-1">
              Metadata
            </TabsTrigger>
          </TabsList>

          <TabsContent value="interpretation" className="pt-4">
            <div className="bg-gray-50 rounded-md p-4 border">
              {vcode.status === "corrected" && showCorrection ? (
                <div className="relative">
                  <p className="text-gray-500 line-through">{vcode.originalContent}</p>
                  <p className="text-gray-900 font-medium mt-2">{vcode.content}</p>
                  <Badge className="absolute top-0 right-0 bg-blue-100 text-blue-800">Corrected</Badge>
                </div>
              ) : (
                <p className="text-gray-900">{vcode.content}</p>
              )}
            </div>

            {vcode.status === "pending" && (
              <div className="flex gap-2 mt-4">
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  <CheckCircle size={16} className="mr-2" />
                  Verify
                </Button>
                <Button variant="outline" className="flex-1">
                  <Edit size={16} className="mr-2" />
                  Correct
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="metadata" className="pt-4">
            <div className="bg-gray-50 rounded-md p-4 border">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <dt className="text-gray-500">Hash</dt>
                <dd className="text-gray-900 font-mono">sha256:8f4e9c7b3a2d1e0f...</dd>

                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-900">{new Date(vcode.timestamp).toLocaleString()}</dd>

                <dt className="text-gray-500">AI Model</dt>
                <dd className="text-gray-900">PinkSync ASL Transformer v3.2</dd>

                <dt className="text-gray-500">Confidence</dt>
                <dd className="text-gray-900">98.7%</dd>

                <dt className="text-gray-500">Video Length</dt>
                <dd className="text-gray-900">12 seconds</dd>

                <dt className="text-gray-500">Storage</dt>
                <dd className="text-gray-900">Encrypted S3 (AES-256)</dd>
              </dl>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Import cn utility
import { cn } from "@/lib/utils"
