"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, DollarSign, Clock, BarChart, Zap, CheckCircle2, ArrowUpRight, Lightbulb } from "lucide-react"

export function BusinessOptimizer() {
  const [implementedSuggestions, setImplementedSuggestions] = useState<string[]>([])

  const handleImplement = (id: string) => {
    if (implementedSuggestions.includes(id)) {
      setImplementedSuggestions(implementedSuggestions.filter((item) => item !== id))
    } else {
      setImplementedSuggestions([...implementedSuggestions, id])
    }
  }

  const suggestions = [
    {
      id: "s1",
      title: "Implement automated invoice processing",
      description: "Save 5 hours per week by automating invoice data entry and processing",
      category: "Automation",
      impact: "High",
      icon: <Zap className="h-5 w-5" />,
      metrics: {
        timeSaved: "5 hours/week",
        costSaved: "$250/month",
        implementation: "2-3 days",
      },
    },
    {
      id: "s2",
      title: "Consolidate software subscriptions",
      description: "Reduce redundant tools and save on monthly subscription costs",
      category: "Cost Optimization",
      impact: "Medium",
      icon: <DollarSign className="h-5 w-5" />,
      metrics: {
        timeSaved: "1 hour/week",
        costSaved: "$175/month",
        implementation: "1 day",
      },
    },
    {
      id: "s3",
      title: "Implement client onboarding workflow",
      description: "Standardize client onboarding to improve experience and reduce errors",
      category: "Process Improvement",
      impact: "High",
      icon: <TrendingUp className="h-5 w-5" />,
      metrics: {
        timeSaved: "3 hours/client",
        costSaved: "$0/month",
        implementation: "3-4 days",
      },
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Optimization Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center">
                <svg className="h-24 w-24" viewBox="0 0 100 100">
                  <circle className="stroke-muted-foreground stroke-[4]" cx="50" cy="50" r="40" fill="transparent" />
                  <circle
                    className="stroke-primary stroke-[8]"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset="100.48"
                    transform="rotate(-90 50 50)"
                  />
                  <text x="50" y="55" textAnchor="middle" className="fill-foreground text-xl font-bold">
                    60%
                  </text>
                </svg>
              </div>
              <div className="mt-2 flex space-x-2">
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                  Room for Improvement
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Potential Time Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                <span>9 hours/week</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Based on implementing all high-impact suggestions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Potential Cost Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-primary" />
                <span>$425/month</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Based on implementing all cost-saving suggestions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Implemented Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                <span>
                  {implementedSuggestions.length} of {suggestions.length}
                </span>
              </div>
              <Progress value={(implementedSuggestions.length / suggestions.length) * 100} className="w-16" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {suggestions.length - implementedSuggestions.length} suggestions remaining
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Optimization Suggestions</CardTitle>
          <CardDescription>AI-powered suggestions to improve your business efficiency</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Suggestions</TabsTrigger>
              <TabsTrigger value="automation">Automation</TabsTrigger>
              <TabsTrigger value="cost">Cost Optimization</TabsTrigger>
              <TabsTrigger value="process">Process Improvement</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <Card key={suggestion.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            {suggestion.icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                            <CardDescription>{suggestion.description}</CardDescription>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            suggestion.impact === "High"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-yellow-500/10 text-yellow-500"
                          }
                        >
                          {suggestion.impact} Impact
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs text-muted-foreground">Time Saved</span>
                          <span className="font-medium">{suggestion.metrics.timeSaved}</span>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs text-muted-foreground">Cost Saved</span>
                          <span className="font-medium">{suggestion.metrics.costSaved}</span>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs text-muted-foreground">Implementation Time</span>
                          <span className="font-medium">{suggestion.metrics.implementation}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant={implementedSuggestions.includes(suggestion.id) ? "default" : "outline"}
                        className="w-full"
                        onClick={() => handleImplement(suggestion.id)}
                      >
                        {implementedSuggestions.includes(suggestion.id) ? (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Implemented
                          </>
                        ) : (
                          "Implement Suggestion"
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="automation">
              <div className="space-y-4">
                {suggestions
                  .filter((s) => s.category === "Automation")
                  .map((suggestion) => (
                    <Card key={suggestion.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              {suggestion.icon}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                              <CardDescription>{suggestion.description}</CardDescription>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              suggestion.impact === "High"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-yellow-500/10 text-yellow-500"
                            }
                          >
                            {suggestion.impact} Impact
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex flex-col space-y-1">
                            <span className="text-xs text-muted-foreground">Time Saved</span>
                            <span className="font-medium">{suggestion.metrics.timeSaved}</span>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <span className="text-xs text-muted-foreground">Cost Saved</span>
                            <span className="font-medium">{suggestion.metrics.costSaved}</span>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <span className="text-xs text-muted-foreground">Implementation Time</span>
                            <span className="font-medium">{suggestion.metrics.implementation}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant={implementedSuggestions.includes(suggestion.id) ? "default" : "outline"}
                          className="w-full"
                          onClick={() => handleImplement(suggestion.id)}
                        >
                          {implementedSuggestions.includes(suggestion.id) ? (
                            <>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Implemented
                            </>
                          ) : (
                            "Implement Suggestion"
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="cost">
              <div className="space-y-4">
                {suggestions
                  .filter((s) => s.category === "Cost Optimization")
                  .map((suggestion) => (
                    <Card key={suggestion.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              {suggestion.icon}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                              <CardDescription>{suggestion.description}</CardDescription>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              suggestion.impact === "High"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-yellow-500/10 text-yellow-500"
                            }
                          >
                            {suggestion.impact} Impact
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex flex-col space-y-1">
                            <span className="text-xs text-muted-foreground">Time Saved</span>
                            <span className="font-medium">{suggestion.metrics.timeSaved}</span>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <span className="text-xs text-muted-foreground">Cost Saved</span>
                            <span className="font-medium">{suggestion.metrics.costSaved}</span>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <span className="text-xs text-muted-foreground">Implementation Time</span>
                            <span className="font-medium">{suggestion.metrics.implementation}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant={implementedSuggestions.includes(suggestion.id) ? "default" : "outline"}
                          className="w-full"
                          onClick={() => handleImplement(suggestion.id)}
                        >
                          {implementedSuggestions.includes(suggestion.id) ? (
                            <>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Implemented
                            </>
                          ) : (
                            "Implement Suggestion"
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="process">
              <div className="space-y-4">
                {suggestions
                  .filter((s) => s.category === "Process Improvement")
                  .map((suggestion) => (
                    <Card key={suggestion.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              {suggestion.icon}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                              <CardDescription>{suggestion.description}</CardDescription>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              suggestion.impact === "High"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-yellow-500/10 text-yellow-500"
                            }
                          >
                            {suggestion.impact} Impact
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex flex-col space-y-1">
                            <span className="text-xs text-muted-foreground">Time Saved</span>
                            <span className="font-medium">{suggestion.metrics.timeSaved}</span>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <span className="text-xs text-muted-foreground">Cost Saved</span>
                            <span className="font-medium">{suggestion.metrics.costSaved}</span>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <span className="text-xs text-muted-foreground">Implementation Time</span>
                            <span className="font-medium">{suggestion.metrics.implementation}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant={implementedSuggestions.includes(suggestion.id) ? "default" : "outline"}
                          className="w-full"
                          onClick={() => handleImplement(suggestion.id)}
                        >
                          {implementedSuggestions.includes(suggestion.id) ? (
                            <>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Implemented
                            </>
                          ) : (
                            "Implement Suggestion"
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Insights</CardTitle>
          <CardDescription>AI-generated insights based on your business data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 rounded-lg border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium">Seasonal Cash Flow Pattern Detected</h4>
                <p className="text-sm text-muted-foreground">
                  Your business shows a consistent pattern of reduced cash flow during Q3 each year. Consider adjusting
                  your marketing budget or exploring new revenue streams during this period.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 rounded-lg border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                <BarChart className="h-5 w-5 text-blue-500" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium">Client Concentration Risk</h4>
                <p className="text-sm text-muted-foreground">
                  30% of your revenue comes from a single client. This creates a potential risk if they reduce their
                  business with you. Consider diversifying your client base to reduce dependency.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 rounded-lg border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium">Growth Opportunity in Digital Services</h4>
                <p className="text-sm text-muted-foreground">
                  Based on your client interactions and market trends, there's a growing demand for digital services in
                  your industry. Consider expanding your offerings in this area.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View All Insights
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
