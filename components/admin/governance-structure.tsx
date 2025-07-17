"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  Building,
  MapPin,
  Shield,
  Vote,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Crown,
  UserCheck,
} from "lucide-react"

interface GovernanceLevel {
  level: "community" | "city" | "state" | "federal"
  name: string
  description: string
  votingPower: number
  representatives: number
  currentMembers: number
  responsibilities: string[]
  decisionTypes: string[]
  icon: any
}

const governanceLevels: GovernanceLevel[] = [
  {
    level: "community",
    name: "Deaf Community Board",
    description: "Primary governance body with majority control over all platform decisions",
    votingPower: 70,
    representatives: 15,
    currentMembers: 12,
    responsibilities: [
      "Platform feature approval and veto power",
      "Data sovereignty and privacy policies",
      "Community benefit distribution",
      "Cultural preservation initiatives",
      "Accessibility standards enforcement",
    ],
    decisionTypes: [
      "Feature development priorities",
      "Data sharing agreements",
      "Community fund allocation",
      "Partnership approvals",
      "Policy changes",
    ],
    icon: Users,
  },
  {
    level: "city",
    name: "Municipal Partnership Council",
    description: "City officials and deaf community liaisons for local service integration",
    votingPower: 15,
    representatives: 8,
    currentMembers: 6,
    responsibilities: [
      "Local service integration oversight",
      "City-specific accessibility compliance",
      "Emergency services coordination",
      "Local benefit program management",
      "Municipal data sharing protocols",
    ],
    decisionTypes: [
      "Local service implementations",
      "City partnership terms",
      "Emergency response protocols",
      "Local accessibility standards",
      "Municipal integration features",
    ],
    icon: Building,
  },
  {
    level: "state",
    name: "State Accessibility Board",
    description: "State government representatives and deaf community advocates",
    votingPower: 10,
    representatives: 6,
    currentMembers: 4,
    responsibilities: [
      "State agency integration oversight",
      "Cross-county service coordination",
      "State compliance monitoring",
      "Regional accessibility standards",
      "State-level advocacy coordination",
    ],
    decisionTypes: [
      "State agency integrations",
      "Regional service standards",
      "State compliance requirements",
      "Cross-jurisdictional protocols",
      "State advocacy initiatives",
    ],
    icon: MapPin,
  },
  {
    level: "federal",
    name: "Federal Advisory Committee",
    description: "Federal agency liaisons and national deaf community representatives",
    votingPower: 5,
    representatives: 4,
    currentMembers: 3,
    responsibilities: [
      "Federal agency integration guidance",
      "National accessibility standards",
      "Federal compliance oversight",
      "National policy advocacy",
      "Cross-state coordination",
    ],
    decisionTypes: [
      "Federal integration standards",
      "National accessibility policies",
      "Federal compliance requirements",
      "National advocacy strategies",
      "Interstate coordination",
    ],
    icon: Shield,
  },
]

export function GovernanceStructure() {
  const [selectedLevel, setSelectedLevel] = useState<GovernanceLevel>(governanceLevels[0])
  const [showVotingProcess, setShowVotingProcess] = useState(false)

  const totalVotingPower = governanceLevels.reduce((sum, level) => sum + level.votingPower, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold">🏛️ Democratic Governance Structure</h2>
        <p className="text-muted-foreground mt-2">
          Community-controlled decision making with transparent representation across all levels
        </p>
      </div>

      {/* Core Principle Alert */}
      <Alert className="border-pink-200 bg-pink-50">
        <Crown className="h-4 w-4 text-pink-600" />
        <AlertDescription className="text-pink-800">
          <strong>Core Principle:</strong> The deaf community maintains 70% voting control to ensure "Nothing About Us,
          Without Us" is always respected. No decision affecting deaf people can be made without community majority
          approval.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="structure" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="structure">Governance Structure</TabsTrigger>
          <TabsTrigger value="voting">Voting Process</TabsTrigger>
          <TabsTrigger value="representatives">Representatives</TabsTrigger>
          <TabsTrigger value="decisions">Decision Types</TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="space-y-4">
          {/* Voting Power Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-pink-500" />
                Voting Power Distribution
              </CardTitle>
              <CardDescription>Democratic representation ensuring deaf community control</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {governanceLevels.map((level) => {
                  const Icon = level.icon
                  return (
                    <div key={level.level} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-pink-500" />
                          <span className="font-medium">{level.name}</span>
                        </div>
                        <Badge variant={level.level === "community" ? "default" : "outline"}>
                          {level.votingPower}% Voting Power
                        </Badge>
                      </div>
                      <Progress value={level.votingPower} className="h-2" />
                      <p className="text-sm text-muted-foreground">{level.description}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Governance Levels Detail */}
          <div className="grid gap-4 md:grid-cols-2">
            {governanceLevels.map((level) => {
              const Icon = level.icon
              const completionRate = (level.currentMembers / level.representatives) * 100

              return (
                <Card
                  key={level.level}
                  className={`cursor-pointer transition-colors ${
                    selectedLevel.level === level.level ? "border-pink-300 bg-pink-50" : "hover:border-pink-200"
                  }`}
                  onClick={() => setSelectedLevel(level)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-pink-500" />
                        {level.name}
                      </div>
                      <Badge variant={level.level === "community" ? "default" : "outline"}>{level.votingPower}%</Badge>
                    </CardTitle>
                    <CardDescription>{level.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Representatives</span>
                        <span>
                          {level.currentMembers}/{level.representatives}
                        </span>
                      </div>
                      <Progress value={completionRate} className="h-2" />

                      <div className="space-y-1">
                        <p className="text-sm font-medium">Key Responsibilities:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {level.responsibilities.slice(0, 3).map((resp, i) => (
                            <li key={i}>• {resp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="voting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Vote className="h-5 w-5 text-pink-500" />
                Democratic Voting Process
              </CardTitle>
              <CardDescription>How decisions are made with community control</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Voting Steps */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Decision-Making Process</h4>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-100 text-pink-600 text-sm font-medium">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Proposal Submission</p>
                        <p className="text-sm text-muted-foreground">
                          Any community member or representative can submit a proposal with ASL video explanation
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-100 text-pink-600 text-sm font-medium">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Community Review (7 days)</p>
                        <p className="text-sm text-muted-foreground">
                          Deaf community board reviews proposal and provides feedback in ASL
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-100 text-pink-600 text-sm font-medium">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Multi-Level Discussion (5 days)</p>
                        <p className="text-sm text-muted-foreground">
                          All governance levels discuss impact and provide input
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-100 text-pink-600 text-sm font-medium">
                        4
                      </div>
                      <div>
                        <p className="font-medium">Weighted Voting (3 days)</p>
                        <p className="text-sm text-muted-foreground">
                          Secure voting with weighted representation (Community 70%, City 15%, State 10%, Federal 5%)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-100 text-pink-600 text-sm font-medium">
                        5
                      </div>
                      <div>
                        <p className="font-medium">Implementation or Veto</p>
                        <p className="text-sm text-muted-foreground">
                          Requires 51% overall approval, but community can veto with 51% community vote
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Voting Requirements */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Voting Requirements</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium">Standard Decisions</p>
                      <p className="text-xs text-muted-foreground">51% overall approval required</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Major Changes</p>
                      <p className="text-xs text-muted-foreground">66% overall + 60% community approval</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Constitutional Changes</p>
                      <p className="text-xs text-muted-foreground">75% overall + 70% community approval</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Community Veto Power</p>
                      <p className="text-xs text-muted-foreground">51% community vote can stop any decision</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="representatives" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {governanceLevels.map((level) => {
              const Icon = level.icon
              return (
                <Card key={level.level}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-pink-500" />
                      {level.name}
                    </CardTitle>
                    <CardDescription>
                      {level.currentMembers} of {level.representatives} positions filled
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Progress value={(level.currentMembers / level.representatives) * 100} className="h-2" />

                      <div>
                        <h4 className="font-medium mb-2">Current Representatives</h4>
                        <div className="space-y-2">
                          {Array.from({ length: level.currentMembers }, (_, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <UserCheck className="h-3 w-3 text-green-500" />
                              <span>Representative {i + 1}</span>
                              <Badge variant="outline" className="text-xs">
                                Active
                              </Badge>
                            </div>
                          ))}
                          {Array.from({ length: level.representatives - level.currentMembers }, (_, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="h-3 w-3 rounded-full border border-gray-300" />
                              <span>Open Position {i + 1}</span>
                              <Badge variant="outline" className="text-xs">
                                Recruiting
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {level.representatives > level.currentMembers && (
                        <Button variant="outline" size="sm" className="w-full">
                          Apply to Represent {level.name}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="decisions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Decision Authority Matrix</CardTitle>
              <CardDescription>What types of decisions each governance level can make</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {governanceLevels.map((level) => {
                  const Icon = level.icon
                  return (
                    <div key={level.level} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-pink-500" />
                        <h4 className="font-semibold">{level.name}</h4>
                        <Badge variant="outline">{level.votingPower}% Weight</Badge>
                      </div>

                      <div className="grid gap-2 md:grid-cols-2">
                        {level.decisionTypes.map((decision, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span>{decision}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Admin Access Note */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertTriangle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>No Traditional "Admin" Role:</strong> Instead of centralized admin control, we use distributed
          governance where the deaf community has democratic control. Technical administration is performed by
          deaf-owned businesses under community oversight.
        </AlertDescription>
      </Alert>
    </div>
  )
}
