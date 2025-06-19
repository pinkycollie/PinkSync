"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, ChevronRight, ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Progress } from "@/components/ui/progress"
import SignLanguageExplanation from "@/components/sign-language-explanation"

interface DemoScenario {
  id: number
  title: string
  description: string
  demo_type: string
  config: any
}

interface PinkSyncDemoSectionProps {
  demos: DemoScenario[]
}

export function PinkSyncDemoSection({ demos }: PinkSyncDemoSectionProps) {
  const [activeDemo, setActiveDemo] = useState<DemoScenario | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  // Group demos by type
  const demoTypes = [...new Set(demos.map((demo) => demo.demo_type))]

  const handleSelectDemo = (demo: DemoScenario) => {
    setActiveDemo(demo)
    setIsPlaying(false)
    setProgress(0)
    setCurrentStep(0)
  }

  const handlePlay = () => {
    if (!activeDemo) return

    setIsPlaying(true)

    // Simulate demo progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsPlaying(false)
          return 100
        }
        return prev + 5
      })

      setCurrentStep((prev) => {
        const steps = activeDemo.config.steps || []
        if (prev >= steps.length - 1) {
          return steps.length - 1
        }
        return Math.floor((progress / 100) * steps.length)
      })
    }, 500)

    return () => clearInterval(interval)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setProgress(0)
    setCurrentStep(0)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Interactive Demonstrations</h2>

      <Tabs defaultValue={demoTypes[0]} className="space-y-4">
        <TabsList>
          {demoTypes.map((type) => (
            <TabsTrigger key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        {demoTypes.map((type) => (
          <TabsContent key={type} value={type} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {demos
                .filter((demo) => demo.demo_type === type)
                .map((demo) => (
                  <Card
                    key={demo.id}
                    className={`cursor-pointer transition-all ${activeDemo?.id === demo.id ? "ring-2 ring-primary" : ""}`}
                    onClick={() => handleSelectDemo(demo)}
                  >
                    <CardHeader>
                      <CardTitle>{demo.title}</CardTitle>
                      <CardDescription>{demo.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
            </div>

            {activeDemo && activeDemo.demo_type === type && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>{activeDemo.title}</CardTitle>
                  <CardDescription>{activeDemo.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-x-2">
                      {isPlaying ? (
                        <Button onClick={handlePause}>
                          <Pause className="h-4 w-4 mr-2" /> Pause
                        </Button>
                      ) : (
                        <Button onClick={handlePlay}>
                          <Play className="h-4 w-4 mr-2" /> Play Demo
                        </Button>
                      )}
                      <Button variant="outline" onClick={handleReset}>
                        <RotateCcw className="h-4 w-4 mr-2" /> Reset
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">Progress: {progress}%</div>
                  </div>

                  <Progress value={progress} className="h-2" />

                  <div className="rounded-lg border bg-card p-4">
                    <div className="space-y-4">
                      {activeDemo.config.steps &&
                        activeDemo.config.steps.map((step: any, index: number) => (
                          <div
                            key={index}
                            className={`transition-all ${
                              index === currentStep
                                ? "bg-accent p-3 rounded-md"
                                : index < currentStep
                                  ? "opacity-60"
                                  : "opacity-40"
                            }`}
                          >
                            <div className="flex items-center">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                  index <= currentStep
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {index + 1}
                              </div>
                              <div className="ml-4 font-medium">{step.title}</div>
                            </div>
                            {index === currentStep && (
                              <div className="ml-12 mt-2 text-sm text-muted-foreground">{step.description}</div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>

                  <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="flex w-full justify-between">
                        <span>View Sign Language Explanation</span>
                        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="rounded-md border p-4 mt-2">
                        <SignLanguageExplanation
                          text={
                            activeDemo.config.signLanguageText ||
                            `This is a demonstration of ${activeDemo.title}, showing how PinkSync processes and transforms content for deaf accessibility.`
                          }
                        />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
