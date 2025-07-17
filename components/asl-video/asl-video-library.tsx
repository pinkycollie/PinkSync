"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ASLVideoPlayer } from "./asl-video-player"
import { Search, User, Star, Play, Languages } from "lucide-react"

interface ASLVideo {
  id: string
  title: string
  description: string
  signer: {
    name: string
    credentials: string
    photo: string
    bio: string
  }
  transcript: string
  captions: string
  duration: string
  category: "ethical-principles" | "tutorial" | "announcement"
  priority: "high" | "medium" | "low"
  tags: string[]
  uploadDate: string
  views: number
  rating: number
}

const aslVideos: ASLVideo[] = [
  {
    id: "ethical-principle-1",
    title: "Nothing About Us, Without Us - Core Principle",
    description:
      "Comprehensive explanation of our first ethical principle ensuring deaf community leadership and decision-making power.",
    signer: {
      name: "Dr. Sarah Martinez",
      credentials: "Deaf Community Leader, PhD in Deaf Studies",
      photo: "/placeholder.svg?height=100&width=100&text=Dr.+Sarah",
      bio: "Dr. Martinez has been advocating for deaf rights for over 20 years and serves on multiple national deaf advocacy boards.",
    },
    transcript: `Hello, I'm Dr. Sarah Martinez, and I want to explain our first core ethical principle: "Nothing About Us, Without Us."

This principle means that the deaf community must have majority control - at least 70% voting power - on all governance boards that make decisions about our platform and services.

Every major decision that affects deaf people must be approved by our community first. We won't accept any changes or policies that are made without our direct input and consent.

Deaf cultural experts lead the design and implementation of all features. This isn't just consultation - this is leadership. We design for ourselves, by ourselves.

Most importantly, our community has veto power. If we don't like a decision, we can stop it. This ensures that our voices are not just heard, but that they have real power.

This principle protects us from well-meaning but misguided decisions made by hearing people who don't understand our lived experiences. It ensures that technology serves us, not the other way around.`,
    captions: "ethical-principle-1-captions.vtt",
    duration: "4:32",
    category: "ethical-principles",
    priority: "high",
    tags: ["governance", "community-control", "decision-making", "leadership"],
    uploadDate: "2024-01-15",
    views: 1250,
    rating: 4.9,
  },
  {
    id: "ethical-principle-2",
    title: "Community Data Sovereignty",
    description: "Understanding how the deaf community legally owns and controls all data about deaf residents.",
    signer: {
      name: "Marcus Chen",
      credentials: "Cybersecurity Expert, Deaf Rights Advocate",
      photo: "/placeholder.svg?height=100&width=100&text=Marcus",
      bio: "Marcus specializes in data privacy and has worked with indigenous communities on data sovereignty frameworks.",
    },
    transcript: `I'm Marcus Chen, and I want to talk about Community Data Sovereignty - our second core ethical principle.

This means that the deaf community legally owns ALL data about deaf residents. Not the city, not the company, not the government - the community owns it.

We control the encryption keys and access. No one can see our data without our permission. We decide who gets access and for what purposes.

All data collection requires explicit consent given in ASL. No fine print, no hidden agreements. Everything is explained clearly in our language.

Most importantly, our community receives all insights and benefits from our data. If our data creates value, that value comes back to us - not to corporations or governments.

This protects us from surveillance, exploitation, and misuse of our personal information. Our data is our power, and we keep that power in our hands.`,
    captions: "ethical-principle-2-captions.vtt",
    duration: "3:45",
    category: "ethical-principles",
    priority: "high",
    tags: ["data-privacy", "sovereignty", "encryption", "consent"],
    uploadDate: "2024-01-16",
    views: 980,
    rating: 4.8,
  },
  {
    id: "ethical-principle-3",
    title: "Economic Justice for Deaf Community",
    description: "How our platform ensures economic empowerment and fair compensation for the deaf community.",
    signer: {
      name: "Dr. Aisha Johnson",
      credentials: "Economist, Deaf Business Development Specialist",
      photo: "/placeholder.svg?height=100&width=100&text=Dr.+Aisha",
      bio: "Dr. Johnson has helped establish over 50 deaf-owned businesses and specializes in economic development within deaf communities.",
    },
    transcript: `Hello, I'm Dr. Aisha Johnson, and I want to explain our third ethical principle: Economic Justice.

At least 50% of all contracts must go to deaf-owned businesses. This isn't charity - this is justice. Our community has the skills and expertise to build and maintain these systems.

Deaf professionals must hold at least 60% of leadership roles. We lead our own technology, our own services, our own future.

10% of all city savings from our platform goes directly back to our community. If we help cities save money, we share in those savings.

We have revenue sharing agreements with community organizations. The deaf community benefits financially from the success of this platform.

This principle ensures that technology doesn't just serve us - it employs us, empowers us, and enriches us. Economic justice is social justice.`,
    captions: "ethical-principle-3-captions.vtt",
    duration: "4:15",
    category: "ethical-principles",
    priority: "high",
    tags: ["economic-justice", "deaf-business", "leadership", "revenue-sharing"],
    uploadDate: "2024-01-17",
    views: 1100,
    rating: 4.9,
  },
]

export function ASLVideoLibrary() {
  const [selectedVideo, setSelectedVideo] = useState<ASLVideo | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [showLibrary, setShowLibrary] = useState(true)

  const filteredVideos = aslVideos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = filterCategory === "all" || video.category === filterCategory

    return matchesSearch && matchesCategory
  })

  if (selectedVideo && !showLibrary) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setShowLibrary(true)} className="flex items-center gap-2">
            ← Back to Video Library
          </Button>
          <Badge className="bg-pink-600 text-white">ASL Video Content</Badge>
        </div>

        <ASLVideoPlayer
          videoId={selectedVideo.id}
          title={selectedVideo.title}
          signer={selectedVideo.signer}
          transcript={selectedVideo.transcript}
          captions={selectedVideo.captions}
          duration={selectedVideo.duration}
          category={selectedVideo.category}
          priority={selectedVideo.priority}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">🤟 ASL Video Library - Ethical Principles</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Watch our core ethical principles explained in American Sign Language by deaf community leaders and experts.
        </p>
      </div>

      {/* Search and Filter */}
      <Card className="border-2 border-pink-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search videos by title, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant={filterCategory === "all" ? "default" : "outline"}
                onClick={() => setFilterCategory("all")}
                size="sm"
              >
                All Videos
              </Button>
              <Button
                variant={filterCategory === "ethical-principles" ? "default" : "outline"}
                onClick={() => setFilterCategory("ethical-principles")}
                size="sm"
              >
                Ethical Principles
              </Button>
              <Button
                variant={filterCategory === "tutorial" ? "default" : "outline"}
                onClick={() => setFilterCategory("tutorial")}
                size="sm"
              >
                Tutorials
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <Card
            key={video.id}
            className="border-2 border-gray-200 hover:border-pink-300 transition-colors cursor-pointer"
          >
            <CardContent className="p-0">
              {/* Video Thumbnail */}
              <div className="relative">
                <img
                  src={`/placeholder.svg?height=200&width=300&text=ASL+Video:+${encodeURIComponent(video.title.substring(0, 20))}`}
                  alt={video.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button
                    size="lg"
                    onClick={() => {
                      setSelectedVideo(video)
                      setShowLibrary(false)
                    }}
                    className="bg-pink-600 hover:bg-pink-700 text-white rounded-full w-16 h-16"
                  >
                    <Play className="w-8 h-8" />
                  </Button>
                </div>

                {/* Priority Badge */}
                {video.priority === "high" && (
                  <Badge className="absolute top-2 left-2 bg-red-600 text-white">High Priority</Badge>
                )}

                {/* Duration */}
                <Badge className="absolute bottom-2 right-2 bg-black/80 text-white">{video.duration}</Badge>
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{video.title}</h3>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>

                {/* Signer Info */}
                <div className="flex items-center gap-2 mb-3">
                  <img
                    src={video.signer.photo || "/placeholder.svg"}
                    alt={video.signer.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{video.signer.name}</div>
                    <div className="text-xs text-gray-500">{video.signer.credentials}</div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {video.views.toLocaleString()} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {video.rating}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {video.category.replace("-", " ")}
                  </Badge>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {video.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredVideos.length === 0 && (
        <Card className="border-2 border-gray-200">
          <CardContent className="p-12 text-center">
            <Languages className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No videos found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters to find more videos.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
