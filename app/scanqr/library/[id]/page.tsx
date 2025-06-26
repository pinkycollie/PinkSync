"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, Share2, Play, Pause } from "lucide-react"
import Link from "next/link"

// Mock data for sign language content details
const contentDetails = {
  "sign-language-content-1": {
    title: "Welcome Message",
    description:
      "A friendly welcome message in American Sign Language (ASL) that can be used in various settings such as businesses, schools, or public spaces.",
    category: "Greetings",
    thumbnail: "/placeholder.svg?height=400&width=600&query=ASL welcome message detailed view",
    qrCode: "/placeholder.svg?height=300&width=300&query=QR code for welcome message",
    videoUrl: "/placeholder.svg?height=400&width=600&query=ASL welcome message video",
    arPreview: "/placeholder.svg?height=400&width=600&query=AR preview of ASL welcome message",
    languages: ["American Sign Language (ASL)", "British Sign Language (BSL)"],
  },
  "sign-language-content-2": {
    title: "Emergency Information",
    description:
      "Critical emergency evacuation instructions in sign language to ensure safety information is accessible to the Deaf community.",
    category: "Safety",
    thumbnail: "/placeholder.svg?height=400&width=600&query=ASL emergency information detailed view",
    qrCode: "/placeholder.svg?height=300&width=300&query=QR code for emergency information",
    videoUrl: "/placeholder.svg?height=400&width=600&query=ASL emergency information video",
    arPreview: "/placeholder.svg?height=400&width=600&query=AR preview of ASL emergency information",
    languages: ["American Sign Language (ASL)"],
  },
  "sign-language-content-3": {
    title: "Restaurant Menu Guide",
    description: "A guide to common restaurant menu items and useful phrases for ordering food in sign language.",
    category: "Food & Dining",
    thumbnail: "/placeholder.svg?height=400&width=600&query=ASL restaurant menu guide detailed view",
    qrCode: "/placeholder.svg?height=300&width=300&query=QR code for restaurant menu",
    videoUrl: "/placeholder.svg?height=400&width=600&query=ASL restaurant menu video",
    arPreview: "/placeholder.svg?height=400&width=600&query=AR preview of ASL restaurant menu guide",
    languages: ["American Sign Language (ASL)", "International Sign"],
  },
  "sign-language-content-4": {
    title: "Public Transportation",
    description:
      "Guide to navigating public transportation systems with sign language instructions for buses, trains, and subways.",
    category: "Travel",
    thumbnail: "/placeholder.svg?height=400&width=600&query=ASL public transportation guide detailed view",
    qrCode: "/placeholder.svg?height=300&width=300&query=QR code for transportation guide",
    videoUrl: "/placeholder.svg?height=400&width=600&query=ASL public transportation video",
    arPreview: "/placeholder.svg?height=400&width=600&query=AR preview of ASL public transportation guide",
    languages: ["American Sign Language (ASL)"],
  },
  "sign-language-content-5": {
    title: "Medical Appointment",
    description:
      "Essential sign language phrases and vocabulary for medical appointments to improve healthcare accessibility.",
    category: "Healthcare",
    thumbnail: "/placeholder.svg?height=400&width=600&query=ASL medical appointment guide detailed view",
    qrCode: "/placeholder.svg?height=300&width=300&query=QR code for medical appointment",
    videoUrl: "/placeholder.svg?height=400&width=600&query=ASL medical appointment video",
    arPreview: "/placeholder.svg?height=400&width=600&query=AR preview of ASL medical appointment guide",
    languages: ["American Sign Language (ASL)", "British Sign Language (BSL)"],
  },
  "sign-language-content-6": {
    title: "Job Interview Tips",
    description:
      "Sign language content covering common job interview questions and professional workplace communication.",
    category: "Career",
    thumbnail: "/placeholder.svg?height=400&width=600&query=ASL job interview tips detailed view",
    qrCode: "/placeholder.svg?height=300&width=300&query=QR code for job interview tips",
    videoUrl: "/placeholder.svg?height=400&width=600&query=ASL job interview video",
    arPreview: "/placeholder.svg?height=400&width=600&query=AR preview of ASL job interview tips",
    languages: ["American Sign Language (ASL)"],
  },
}

export default function ContentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState("preview")

  // Check if content exists
  const content = contentDetails[id as keyof typeof contentDetails]

  if (!content) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.push("/scanqr/library")} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Link href="/scanqr" className="mr-4 flex items-center">
            <h1 className="text-xl font-bold text-pink-600">PinkSync</h1>
            <span className="ml-2 rounded-md bg-pink-100 px-2 py-1 text-xs font-medium text-pink-800">Scan QR</span>
          </Link>
          <h2 className="text-lg font-medium">Content Not Found</h2>
        </div>
        <Card className="mt-6">
          <CardContent className="p-6 text-center">
            <p className="mb-4 text-gray-500">The requested sign language content could not be found.</p>
            <Button onClick={() => router.push("/scanqr/library")} className="bg-pink-600 hover:bg-pink-700">
              Return to Library
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => router.push("/scanqr/library")} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Link href="/scanqr" className="mr-4 flex items-center">
          <h1 className="text-xl font-bold text-pink-600">PinkSync</h1>
          <span className="ml-2 rounded-md bg-pink-100 px-2 py-1 text-xs font-medium text-pink-800">Scan QR</span>
        </Link>
        <h2 className="text-lg font-medium">{content.title}</h2>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 grid w-full grid-cols-2">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="ar">AR View</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="mt-0">
              <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
                <img
                  src={content.videoUrl || "/placeholder.svg"}
                  alt={`${content.title} preview`}
                  className="h-full w-full object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-black/50 p-4 text-white hover:bg-black/70"
                  onClick={togglePlayback}
                >
                  {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="ar" className="mt-0">
              <div className="aspect-video overflow-hidden rounded-lg bg-black">
                <img
                  src={content.arPreview || "/placeholder.svg"}
                  alt={`${content.title} AR preview`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    className="bg-pink-600 hover:bg-pink-700"
                    onClick={() => router.push(`/scanqr/ar?qrData=${id}`)}
                  >
                    View in AR
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <h2 className="mb-2 text-xl font-semibold">Description</h2>
            <p className="text-gray-700">{content.description}</p>

            <h2 className="mb-2 mt-6 text-xl font-semibold">Available Sign Languages</h2>
            <div className="flex flex-wrap gap-2">
              {content.languages.map((language, index) => (
                <div key={index} className="rounded-full bg-pink-100 px-3 py-1 text-sm text-pink-800">
                  {language}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-center text-lg font-semibold">QR Code</h2>
              <div className="flex justify-center">
                <img
                  src={content.qrCode || "/placeholder.svg"}
                  alt={`QR code for ${content.title}`}
                  className="h-48 w-48"
                />
              </div>
              <p className="mt-4 text-center text-sm text-gray-500">
                Scan this QR code to view the sign language hologram in AR
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Button
              className="w-full bg-pink-600 hover:bg-pink-700"
              onClick={() => router.push(`/scanqr/ar?qrData=${id}`)}
            >
              View in AR
            </Button>
          </div>

          <Card className="mt-6">
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Usage Information</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="font-medium">Category:</span>
                  <span className="ml-2 text-gray-700">{content.category}</span>
                </div>
                <div>
                  <span className="font-medium">Format:</span>
                  <span className="ml-2 text-gray-700">3D Hologram</span>
                </div>
                <div>
                  <span className="font-medium">Duration:</span>
                  <span className="ml-2 text-gray-700">30 seconds</span>
                </div>
                <div>
                  <span className="font-medium">Created:</span>
                  <span className="ml-2 text-gray-700">June 15, 2024</span>
                </div>
                <div>
                  <span className="font-medium">PinkSync ID:</span>
                  <span className="ml-2 text-gray-700">{id}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
