"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Share2, Users, Shield, Heart, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { MuxVideoPlayer } from "@/components/asl-video/mux-video-player"

export default function IntroToDeafLifeOSPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <Link href="/">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to DeafLifeOS
            </Button>
          </Link>

          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              🤟 Introduction to DeafLifeOS
            </h1>
            <p className="text-lg text-gray-600">Your Complete Life Management System</p>
            <Badge className="mt-2 bg-pink-100 text-pink-800">
              <Clock className="h-3 w-3 mr-1" />
              12 minutes • ASL with captions
            </Badge>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        {/* Priority Alert */}
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🚨</div>
              <div>
                <h3 className="font-semibold text-red-800">High Priority Community Message</h3>
                <p className="text-red-700 text-sm">
                  This introduction video contains essential information about your rights and the ethical principles
                  that govern DeafLifeOS. Community participation in governance decisions requires viewing this content.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Mux Video Player */}
        <div className="mb-8">
          <MuxVideoPlayer
            playbackId="deaflifeos-intro-mux-id"
            title="Introduction to DeafLifeOS: Your Complete Life Management System"
            signer={{
              name: "Dr. Sarah Martinez",
              credentials: "Certified ASL Interpreter, RID CI/CT",
              photo: "/placeholder.svg?height=100&width=100&text=Dr.+Sarah+Martinez",
              bio: "Dr. Martinez is a nationally certified ASL interpreter with 15 years of experience in community interpreting and deaf advocacy. She specializes in government and healthcare interpretation.",
            }}
            transcript={`Welcome to DeafLifeOS - your comprehensive life management system designed by and for the deaf community.

I'm Dr. Sarah Martinez, and I'm excited to introduce you to a revolutionary platform that puts deaf people in control of their entire digital life.

DeafLifeOS is built on three core principles:
1. Community Ownership - This platform belongs to the deaf community
2. Data Sovereignty - You own and control all your personal data  
3. Economic Justice - 50% of all contracts go to deaf-owned businesses

Let me show you what makes DeafLifeOS special:

GOVERNMENT INTEGRATION
Connect securely with the IRS, Social Security Administration, DMV, and more. No more waiting on hold or struggling with inaccessible phone systems. Everything is visual, accessible, and in your control.

FAMILY BENEFIT MONITORING
Automatically discover benefits for your entire family. Our system monitors over 2,000 federal, state, and local programs to ensure you never miss out on support you're entitled to.

HEALTHCARE COORDINATION
Manage all your healthcare needs in one place. Schedule appointments, access medical records, and communicate with providers - all with full ASL interpretation available.

FINANCIAL MANAGEMENT
Track your finances, manage benefits, and optimize your economic situation with tools designed specifically for the deaf community's unique needs.

EMERGENCY SERVICES
Direct access to 911 with automatic ASL interpretation, emergency alerts with visual notifications, and community emergency response coordination.

COMMUNITY FEATURES
Connect with other deaf community members, participate in democratic governance of the platform, and access peer support networks.

This isn't just another app - it's a complete operating system for deaf life. Built with us, by us, for us.

Ready to take control of your digital life? Let's get started.`}
            captions="Full closed captions available in English and Spanish"
            duration="12:45"
            category="ethical-principles"
            priority="high"
            chapters={[
              { title: "Welcome & Introduction", startTime: 0, endTime: 120 },
              { title: "Core Principles", startTime: 120, endTime: 300 },
              { title: "Government Integration", startTime: 300, endTime: 480 },
              { title: "Family Benefits", startTime: 480, endTime: 600 },
              { title: "Healthcare & Emergency", startTime: 600, endTime: 720 },
              { title: "Community Features", startTime: 720, endTime: 765 },
            ]}
          />
        </div>

        {/* Key Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-pink-200 bg-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-800">
                <Users className="h-5 w-5" />
                Community Ownership
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-pink-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  70% voting power to deaf community
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Democratic governance platform
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Community veto power on all decisions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  "Nothing About Us, Without Us"
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Shield className="h-5 w-5" />
                Data Sovereignty
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-purple-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  You own all your personal data
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Modular security architecture
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Zero-breach isolation system
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Community-controlled data policies
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Heart className="h-5 w-5" />
                Economic Justice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  50% contracts to deaf-owned businesses
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Benefit optimization for families
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Financial empowerment tools
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Community wealth building
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* What You'll Learn */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">What You'll Learn in This Video</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-lg">🏛️ Government Services</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Secure IRS tax filing and refund tracking</li>
                  <li>• Social Security benefit management</li>
                  <li>• DMV services without phone calls</li>
                  <li>• USPS address changes and mail forwarding</li>
                  <li>• Multi-state government coordination</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-lg">👨‍👩‍👧‍👦 Family & Community</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Automatic benefit discovery for family</li>
                  <li>• Deaf identity passport system</li>
                  <li>• Community governance participation</li>
                  <li>• Peer support networks</li>
                  <li>• Cultural preservation tools</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-lg">🏥 Healthcare & Emergency</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Healthcare provider coordination</li>
                  <li>• Medical record management</li>
                  <li>• Emergency 911 with ASL interpretation</li>
                  <li>• Visual emergency alert system</li>
                  <li>• Community emergency response</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-lg">💰 Financial & Immigration</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Multi-language immigrant support</li>
                  <li>• Naturalization process tracking</li>
                  <li>• Financial optimization tools</li>
                  <li>• Business management features</li>
                  <li>• Economic empowerment resources</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white" asChild>
                <Link href="/register">🤟 Create Your Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">📊 Explore Dashboard</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/community">🤝 Join Community</Link>
              </Button>
            </div>
            <p className="text-center text-sm text-gray-600 mt-4">
              By creating an account, you agree to participate in our community-governed platform and acknowledge that
              you've watched this introduction video.
            </p>
          </CardContent>
        </Card>

        {/* Video Series Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Complete DeafLifeOS Video Series</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Introduction to DeafLifeOS",
                  duration: "12:45",
                  status: "current",
                  description: "Core principles and overview",
                },
                {
                  title: "Government Services Deep Dive",
                  duration: "18:30",
                  status: "next",
                  description: "IRS, SSA, DMV integration",
                },
                {
                  title: "Family Benefit Discovery",
                  duration: "15:20",
                  status: "upcoming",
                  description: "Automatic benefit monitoring",
                },
                {
                  title: "Community Governance",
                  duration: "22:15",
                  status: "upcoming",
                  description: "Democratic participation",
                },
              ].map((video, index) => (
                <Card
                  key={index}
                  className={`${
                    video.status === "current"
                      ? "border-pink-500 bg-pink-50"
                      : video.status === "next"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{video.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{video.description}</p>
                    <p className="text-sm font-medium mb-3">{video.duration}</p>
                    <Button
                      size="sm"
                      variant={video.status === "current" ? "default" : "outline"}
                      className="w-full"
                      disabled={video.status === "upcoming"}
                    >
                      {video.status === "current"
                        ? "Currently Watching"
                        : video.status === "next"
                          ? "Watch Next"
                          : "Coming Soon"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
