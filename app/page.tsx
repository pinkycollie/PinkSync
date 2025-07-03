"use client"
import { DeafVideoCall } from "@/components/deaf-video-call"
import { VideoAPIComparison } from "@/components/video-api-comparison"
import { VideoAPIComparisonWithMux } from "@/components/video-api-comparison-with-mux"
import { MuxVideoIntegration } from "@/components/mux-video-integration"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PinkSyncVideoDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">PinkSync Video Communication</h1>
          <p className="text-xl text-gray-600">
            Deaf-first video calling with professional processing and accessibility features
          </p>
        </div>

        <Tabs defaultValue="mux" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="mux">Mux Integration</TabsTrigger>
            <TabsTrigger value="demo">Video Call Demo</TabsTrigger>
            <TabsTrigger value="comparison">API Comparison</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="mux" className="mt-6">
            <MuxVideoIntegration />
          </TabsContent>

          <TabsContent value="demo" className="mt-6">
            <DeafVideoCall roomId="pinksync-demo" userId="demo-user" />
          </TabsContent>

          <TabsContent value="comparison" className="mt-6">
            <VideoAPIComparison />
          </TabsContent>

          <TabsContent value="detailed" className="mt-6">
            <VideoAPIComparisonWithMux />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
