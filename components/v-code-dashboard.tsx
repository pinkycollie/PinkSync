"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { VCodeEntry } from "@/components/v-code-entry"
import { VCodePlayer } from "@/components/v-code-player"
import { VCodeDocumentPreview } from "@/components/v-code-document-preview"
import { Search, Upload, Clock, FileText } from "lucide-react"

export function VCodeDashboard() {
  const [selectedVCode, setSelectedVCode] = useState<string | null>(null)

  const vCodes = [
    {
      id: "VID-239dfk43",
      timestamp: "2025-05-14T15:32:10",
      content: "I authorize payment to Dr. Kim.",
      status: "verified",
      documentType: "Payment Authorization",
      videoUrl: "/placeholder-51sr4.png",
    },
    {
      id: "VID-985hj32l",
      timestamp: "2025-05-14T14:15:22",
      content: "Schedule appointment for next Tuesday at 2pm.",
      status: "pending",
      documentType: "Appointment Request",
      videoUrl: "/placeholder-u7tn5.png",
    },
    {
      id: "VID-456gh78m",
      timestamp: "2025-05-13T09:45:33",
      content: "I do not consent to this procedure.",
      status: "corrected",
      documentType: "Medical Consent Form",
      originalContent: "I consent to this procedure.",
      videoUrl: "/placeholder-6icoe.png",
    },
  ]

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-pink-600">PinkSync vCode</h1>
            <p className="text-gray-600">Video-Coded Accessibility Ledger</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Upload size={16} />
              New Video
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input placeholder="Search vCodes..." className="pl-10 w-64" />
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>vCode Ledger</CardTitle>
              <CardDescription>Recent signed interactions</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="all">
                <div className="px-6">
                  <TabsList className="w-full">
                    <TabsTrigger value="all" className="flex-1">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="verified" className="flex-1">
                      Verified
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="flex-1">
                      Pending
                    </TabsTrigger>
                    <TabsTrigger value="corrected" className="flex-1">
                      Corrected
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="m-0">
                  <div className="divide-y">
                    {vCodes.map((vcode) => (
                      <VCodeEntry
                        key={vcode.id}
                        vcode={vcode}
                        isSelected={selectedVCode === vcode.id}
                        onClick={() => setSelectedVCode(vcode.id)}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="verified" className="m-0">
                  <div className="divide-y">
                    {vCodes
                      .filter((vcode) => vcode.status === "verified")
                      .map((vcode) => (
                        <VCodeEntry
                          key={vcode.id}
                          vcode={vcode}
                          isSelected={selectedVCode === vcode.id}
                          onClick={() => setSelectedVCode(vcode.id)}
                        />
                      ))}
                  </div>
                </TabsContent>

                {/* Similar content for other tabs */}
              </Tabs>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 px-6 py-3">
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <Clock size={14} />
                Last updated: 2 minutes ago
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedVCode ? (
            <div className="space-y-6">
              <VCodePlayer vcode={vCodes.find((v) => v.id === selectedVCode)!} />

              <VCodeDocumentPreview vcode={vCodes.find((v) => v.id === selectedVCode)!} />
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center p-8">
              <div className="text-center">
                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">Select a vCode</h3>
                <p className="text-gray-500 max-w-md">
                  Choose a vCode entry from the ledger to view the original signed video, AI interpretation, and linked
                  documents.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
