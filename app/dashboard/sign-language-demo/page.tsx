"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SignLanguageVideo } from "@/components/sign-language-video"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WorkflowDiagram from "@/components/workflow-diagram"

export default function SignLanguageDemoPage() {
  const [text, setText] = useState("")
  const [dialect, setDialect] = useState<"asl" | "bsl" | "auslan" | "lsf" | "lsm" | "jsl">("asl")
  const [avatarStyle, setAvatarStyle] = useState<"realistic" | "cartoon" | "minimal" | "human">("realistic")
  const [quality, setQuality] = useState<"standard" | "high" | "premium">("standard")
  const [generatedVideos, setGeneratedVideos] = useState<
    Array<{
      id: string
      text: string
      dialect: string
      avatarStyle: string
      timestamp: string
    }>
  >([])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    if (!text.trim()) return

    setIsGenerating(true)

    // Add to generated videos list
    setGeneratedVideos((prev) => [
      {
        id: `gen_${Date.now()}`,
        text,
        dialect,
        avatarStyle,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ])
  }

  const handleVideoReady = () => {
    setIsGenerating(false)
  }

  const handleVideoError = () => {
    setIsGenerating(false)
  }

  const examplePhrases = [
    "Hello, my name is John. Nice to meet you.",
    "Welcome to our website. How can I help you today?",
    "Please follow the instructions on the screen.",
    "Thank you for your patience. We'll be with you shortly.",
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sign Language Generation</h1>
        <p className="text-muted-foreground mt-2">Generate sign language videos from text using AI</p>
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Generate Video</TabsTrigger>
          <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
          <TabsTrigger value="history">Generation History</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Sign Language Video</CardTitle>
              <CardDescription>Enter text to convert into sign language</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Text to Convert</label>
                <Textarea
                  placeholder="Enter text to convert to sign language..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                />

                <div className="flex flex-wrap gap-2 mt-2">
                  {examplePhrases.map((phrase, index) => (
                    <Button key={index} variant="outline" size="sm" onClick={() => setText(phrase)}>
                      Example {index + 1}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sign Language Dialect</label>
                  <Select value={dialect} onValueChange={(value: any) => setDialect(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select dialect" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asl">American Sign Language (ASL)</SelectItem>
                      <SelectItem value="bsl">British Sign Language (BSL)</SelectItem>
                      <SelectItem value="auslan">Australian Sign Language (Auslan)</SelectItem>
                      <SelectItem value="lsf">French Sign Language (LSF)</SelectItem>
                      <SelectItem value="lsm">Mexican Sign Language (LSM)</SelectItem>
                      <SelectItem value="jsl">Japanese Sign Language (JSL)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Avatar Style</label>
                  <Select value={avatarStyle} onValueChange={(value: any) => setAvatarStyle(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select avatar style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realistic">Realistic</SelectItem>
                      <SelectItem value="cartoon">Cartoon</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="human">Human Interpreter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Video Quality</label>
                  <Select value={quality} onValueChange={(value: any) => setQuality(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (480p)</SelectItem>
                      <SelectItem value="high">High (720p)</SelectItem>
                      <SelectItem value="premium">Premium (1080p)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleGenerate} disabled={!text.trim() || isGenerating} className="w-full">
                Generate Sign Language Video
              </Button>
            </CardFooter>
          </Card>

          {generatedVideos.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Generated Video</h2>
              <SignLanguageVideo
                text={generatedVideos[0].text}
                targetDialect={generatedVideos[0].dialect as any}
                avatarStyle={generatedVideos[0].avatarStyle as any}
                quality={quality}
                onReady={handleVideoReady}
                onError={handleVideoError}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="how-it-works" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>How Sign Language Generation Works</CardTitle>
              <CardDescription>Understanding the workflow behind AI-powered sign language generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <WorkflowDiagram />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">The Generation Process</h3>

                <div className="space-y-2">
                  <h4 className="font-medium">1. Input Processing</h4>
                  <p className="text-sm text-muted-foreground">
                    The text is analyzed using Natural Language Processing (NLP) to understand its structure, meaning,
                    and context. This includes identifying sentences, entities, and sentiment.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">2. Translation to Sign Language</h4>
                  <p className="text-sm text-muted-foreground">
                    The analyzed text is translated into sign language glosses - a written representation of signs. This
                    process considers the grammatical structure of sign language, which differs from spoken languages.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">3. Avatar Animation</h4>
                  <p className="text-sm text-muted-foreground">
                    The glosses are converted into 3D animations using a specialized avatar system. This includes hand
                    shapes, movements, facial expressions, and non-manual features.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">4. Video Rendering</h4>
                  <p className="text-sm text-muted-foreground">
                    The animations are rendered into a video format, optimized for quality and file size. The final
                    video is then delivered to the user.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Cloud Architecture</h3>
                <p className="text-sm text-muted-foreground">
                  Our sign language generation system uses a distributed cloud architecture:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>API Gateway handles incoming requests</li>
                  <li>Cloud Functions process requests asynchronously</li>
                  <li>AI services translate text to sign language</li>
                  <li>Specialized rendering services generate the videos</li>
                  <li>Cloud Storage hosts the generated videos</li>
                  <li>CDN delivers videos with low latency</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generation History</CardTitle>
              <CardDescription>Previously generated sign language videos</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedVideos.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No videos generated yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedVideos.map((video) => (
                    <div key={video.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">
                            {video.text.length > 50 ? `${video.text.substring(0, 50)}...` : video.text}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {new Date(video.timestamp).toLocaleString()} • {video.dialect.toUpperCase()} •{" "}
                            {video.avatarStyle}
                          </p>
                        </div>
                      </div>
                      <SignLanguageVideo
                        text={video.text}
                        targetDialect={video.dialect as any}
                        avatarStyle={video.avatarStyle as any}
                        quality={quality}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
