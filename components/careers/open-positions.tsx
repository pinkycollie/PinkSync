"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"

const positions = {
  engineering: [
    {
      title: "Senior React Developer",
      description: "Expert in React, Next.js, and TypeScript to build accessible, visual-first interfaces",
      location: "Remote (US)",
      type: "Full-time",
      tags: ["React", "Next.js", "TypeScript", "Accessibility"],
    },
    {
      title: "Accessibility API Engineer",
      description: "Design and implement APIs that power our visual feedback systems",
      location: "Remote (US)",
      type: "Full-time",
      tags: ["API Design", "Node.js", "Accessibility", "TypeScript"],
    },
    {
      title: "WebRTC Specialist",
      description: "Develop real-time sign language video communication features",
      location: "Remote (US)",
      type: "Full-time",
      tags: ["WebRTC", "JavaScript", "Video Streaming", "Real-time"],
    },
    {
      title: "AI/ML Engineer (Sign Language)",
      description: "Train and optimize models for sign language recognition and translation",
      location: "Remote (US)",
      type: "Full-time",
      tags: ["Machine Learning", "Computer Vision", "Python", "TensorFlow"],
    },
  ],
  design: [
    {
      title: "Deaf UX Researcher",
      description: "Lead user research with deaf developers to inform our product decisions",
      location: "Remote (US)",
      type: "Full-time",
      tags: ["User Research", "Accessibility", "UX Design"],
    },
    {
      title: "Motion Design Specialist",
      description: "Create meaningful animations and visual feedback patterns",
      location: "Remote (US)",
      type: "Full-time",
      tags: ["Motion Design", "Animation", "Visual Feedback", "CSS"],
    },
    {
      title: "Design Systems Engineer",
      description: "Build and maintain our deaf-first component library",
      location: "Remote (US)",
      type: "Full-time",
      tags: ["Design Systems", "React", "Accessibility", "UI Components"],
    },
  ],
  content: [
    {
      title: "Developer Sign Language (DSL) Creator",
      description: "Develop standardized signs for programming concepts",
      location: "Remote (US)",
      type: "Full-time",
      tags: ["Sign Language", "Programming", "Content Creation"],
    },
    {
      title: "Technical Content Producer",
      description: "Create educational content in both written and sign language formats",
      location: "Remote (US)",
      type: "Full-time",
      tags: ["Technical Writing", "Video Production", "Education"],
    },
    {
      title: "Curriculum Developer",
      description: "Design learning paths for deaf developers",
      location: "Remote (US)",
      type: "Full-time",
      tags: ["Curriculum Design", "Education", "Programming"],
    },
  ],
  operations: [
    {
      title: "VR Program Specialist",
      description: "Work with vocational rehabilitation agencies to secure funding for deaf developers",
      location: "Remote (US)",
      type: "Full-time",
      tags: ["Vocational Rehabilitation", "Program Management", "Advocacy"],
    },
    {
      title: "Deaf Community Manager",
      description: "Build and nurture our community of deaf developers",
      location: "Remote (US)",
      type: "Full-time",
      tags: ["Community Building", "Events", "Social Media"],
    },
    {
      title: "Accessibility Compliance Manager",
      description: "Ensure our platform meets and exceeds accessibility standards",
      location: "Remote (US)",
      type: "Full-time",
      tags: ["Accessibility", "Compliance", "WCAG", "Auditing"],
    },
  ],
}

export function OpenPositions() {
  const [selectedJob, setSelectedJob] = useState<null | {
    title: string
    description: string
    location: string
    type: string
    tags: string[]
  }>(null)

  return (
    <section className="py-20 bg-white" id="open-positions">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Open Positions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our team and help build the future of deaf-first development.
          </p>
        </div>

        <Tabs defaultValue="engineering" className="max-w-5xl mx-auto">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="engineering">Engineering</TabsTrigger>
            <TabsTrigger value="design">Design & UX</TabsTrigger>
            <TabsTrigger value="content">Content & Education</TabsTrigger>
            <TabsTrigger value="operations">Business & Operations</TabsTrigger>
          </TabsList>

          {Object.entries(positions).map(([category, jobs]) => (
            <TabsContent key={category} value={category} className="space-y-6">
              {jobs.map((job, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle>{job.title}</CardTitle>
                      <CardDescription>{job.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.type}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full bg-primary-600 hover:bg-primary-700"
                        onClick={() => setSelectedJob(job)}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>
          ))}
        </Tabs>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            We strongly encourage applications from deaf and hard-of-hearing individuals for all positions.
          </p>
          <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
            View All Positions <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
