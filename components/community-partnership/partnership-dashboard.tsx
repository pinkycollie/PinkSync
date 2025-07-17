"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Shield,
  Heart,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Building,
  Eye,
  HandHeart,
  Gavel,
} from "lucide-react"

interface CommunityPartnership {
  id: string
  cityName: string
  stateCode: string
  deafPopulation: number
  partnershipStatus: "planning" | "pilot" | "active" | "expanding"
  communityLeadership: "deaf_led" | "deaf_majority" | "collaborative"
  ethicalCompliance: number
  communityBenefits: {
    economicImpact: number
    accessibilityImprovements: number
    communityEmpowerment: number
    culturalPreservation: number
  }
  governanceStructure: {
    communityBoard: number
    cityRepresentatives: number
    decisionMakingPower: "community_controlled" | "shared" | "city_led"
  }
}

export default function CommunityPartnershipDashboard() {
  const [partnerships] = useState<CommunityPartnership[]>([
    {
      id: "1",
      cityName: "Rochester",
      stateCode: "NY",
      deafPopulation: 2500,
      partnershipStatus: "active",
      communityLeadership: "deaf_led",
      ethicalCompliance: 95,
      communityBenefits: {
        economicImpact: 850000,
        accessibilityImprovements: 98,
        communityEmpowerment: 92,
        culturalPreservation: 88,
      },
      governanceStructure: {
        communityBoard: 7,
        cityRepresentatives: 2,
        decisionMakingPower: "community_controlled",
      },
    },
    {
      id: "2",
      cityName: "Fremont",
      stateCode: "CA",
      deafPopulation: 1200,
      partnershipStatus: "pilot",
      communityLeadership: "deaf_majority",
      ethicalCompliance: 87,
      communityBenefits: {
        economicImpact: 320000,
        accessibilityImprovements: 75,
        communityEmpowerment: 68,
        culturalPreservation: 72,
      },
      governanceStructure: {
        communityBoard: 5,
        cityRepresentatives: 3,
        decisionMakingPower: "shared",
      },
    },
  ])

  const [activeTab, setActiveTab] = useState("overview")

  const getStatusBadge = (status: string) => {
    const variants = {
      planning: { variant: "outline" as const, text: "Planning", color: "text-blue-600" },
      pilot: { variant: "secondary" as const, text: "Pilot", color: "text-yellow-600" },
      active: { variant: "default" as const, text: "Active", color: "text-green-600" },
      expanding: { variant: "default" as const, text: "Expanding", color: "text-purple-600" },
    }

    const config = variants[status] || variants.planning
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.text}
      </Badge>
    )
  }

  const getLeadershipBadge = (leadership: string) => {
    const variants = {
      deaf_led: { variant: "default" as const, text: "Deaf-Led", color: "text-green-600" },
      deaf_majority: { variant: "secondary" as const, text: "Deaf Majority", color: "text-blue-600" },
      collaborative: { variant: "outline" as const, text: "Collaborative", color: "text-gray-600" },
    }

    const config = variants[leadership] || variants.collaborative
    return (
      <Badge variant={config.variant} className={config.color}>
        <Users className="mr-1 h-3 w-3" />
        {config.text}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Community Partnership Dashboard</h2>
        <p className="text-muted-foreground">Ethical collaboration with cities for deaf community empowerment</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Partnerships</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Building className="mr-2 h-5 w-5 text-pink-500" />
                <span className="text-2xl font-bold">12</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                +3 this quarter
              </Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Cities with active partnerships</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Community Leadership</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-pink-500" />
                <span className="text-2xl font-bold">85%</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Deaf-Led
              </Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Partnerships with deaf community leadership</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ethical Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-pink-500" />
                <span className="text-2xl font-bold">92%</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Excellent
              </Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Average ethical compliance score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Community Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-pink-500" />
                <span className="text-2xl font-bold">$2.1M</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Annual
              </Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Economic benefits to deaf communities</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
          <TabsTrigger value="ethics">Ethics</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ethical Framework Principles</CardTitle>
                <CardDescription>Core principles guiding all partnerships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100">
                      <Users className="h-4 w-4 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">"Nothing About Us, Without Us"</p>
                      <p className="text-xs text-muted-foreground">Deaf community leads all decisions</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100">
                      <Heart className="h-4 w-4 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Cultural Self-Determination</p>
                      <p className="text-xs text-muted-foreground">Community defines own needs and solutions</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100">
                      <Eye className="h-4 w-4 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Accessibility by Design</p>
                      <p className="text-xs text-muted-foreground">Deaf accessibility as core feature</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100">
                      <Shield className="h-4 w-4 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Data Sovereignty</p>
                      <p className="text-xs text-muted-foreground">Community controls their own data</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100">
                      <TrendingUp className="h-4 w-4 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Economic Justice</p>
                      <p className="text-xs text-muted-foreground">Benefits flow to deaf community</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Partnership Impact</CardTitle>
                <CardDescription>Measurable outcomes across all partnerships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Accessibility Improvements</span>
                      <span className="text-sm text-muted-foreground">89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Community Empowerment</span>
                      <span className="text-sm text-muted-foreground">84%</span>
                    </div>
                    <Progress value={84} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Economic Benefits</span>
                      <span className="text-sm text-muted-foreground">76%</span>
                    </div>
                    <Progress value={76} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Cultural Preservation</span>
                      <span className="text-sm text-muted-foreground">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-600">18,500+</div>
                      <p className="text-sm text-muted-foreground">Deaf residents served</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="partnerships" className="space-y-4 mt-4">
          <div className="grid gap-4">
            {partnerships.map((partnership) => (
              <Card key={partnership.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        {partnership.cityName}, {partnership.stateCode}
                      </CardTitle>
                      <CardDescription>{partnership.deafPopulation.toLocaleString()} deaf residents</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(partnership.partnershipStatus)}
                      {getLeadershipBadge(partnership.communityLeadership)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">
                        ${partnership.communityBenefits.economicImpact.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">Economic Impact</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">
                        {partnership.communityBenefits.accessibilityImprovements}%
                      </div>
                      <p className="text-xs text-muted-foreground">Accessibility</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-purple-600">
                        {partnership.communityBenefits.communityEmpowerment}%
                      </div>
                      <p className="text-xs text-muted-foreground">Empowerment</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-pink-600">{partnership.ethicalCompliance}%</div>
                      <p className="text-xs text-muted-foreground">Ethical Compliance</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gavel className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Governance: {partnership.governanceStructure.communityBoard} community,{" "}
                          {partnership.governanceStructure.cityRepresentatives} city
                        </span>
                      </div>
                      <Badge variant="outline">
                        {partnership.governanceStructure.decisionMakingPower.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ethics" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Ethical Oversight & Compliance</CardTitle>
              <CardDescription>Ensuring partnerships serve deaf community interests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">100%</div>
                    <p className="text-sm text-muted-foreground">Community Consent</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">92%</div>
                    <p className="text-sm text-muted-foreground">Ethical Compliance</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">85%</div>
                    <p className="text-sm text-muted-foreground">Deaf Leadership</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Ethical Compliance Checklist</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Community-led governance structure</span>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Data sovereignty framework implemented</span>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Economic benefits flowing to community</span>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Cultural competency training completed</span>
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Community benefit agreement signed</span>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="governance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Governance Structure</CardTitle>
              <CardDescription>Democratic participation and community control</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Community Data Board</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Deaf Community Members</span>
                        <Badge>7 seats</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Hearing Allies</span>
                        <Badge variant="outline">2 seats</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">City Representatives</span>
                        <Badge variant="outline">1 seat</Badge>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground">
                        70% deaf community control ensures community interests are protected
                      </p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Decision Making Powers</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Data collection approval</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">System design validation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Partnership modifications</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Benefit distribution oversight</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-pink-50">
                  <h4 className="font-medium mb-2">Community Assembly</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Annual gathering of all deaf community members with voting rights on major decisions
                  </p>
                  <div className="grid gap-2 md:grid-cols-3">
                    <div className="text-center">
                      <div className="text-lg font-semibold">450+</div>
                      <p className="text-xs text-muted-foreground">Registered Voters</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">89%</div>
                      <p className="text-xs text-muted-foreground">Participation Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">12</div>
                      <p className="text-xs text-muted-foreground">Decisions Made</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Benefit Distribution</CardTitle>
              <CardDescription>Tracking economic and social benefits to deaf communities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="text-center p-4 border rounded-lg">
                    <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="text-xl font-bold">$2.1M</div>
                    <p className="text-sm text-muted-foreground">Total Economic Impact</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Building className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-xl font-bold">47</div>
                    <p className="text-sm text-muted-foreground">Deaf-Owned Businesses</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-xl font-bold">156</div>
                    <p className="text-sm text-muted-foreground">Jobs Created</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <HandHeart className="h-8 w-8 text-pink-500 mx-auto mb-2" />
                    <div className="text-xl font-bold">23</div>
                    <p className="text-sm text-muted-foreground">Organizations Funded</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Benefit Categories</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Economic Development</span>
                        <span className="text-sm text-muted-foreground">$890,000</span>
                      </div>
                      <Progress value={42} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Contracts to deaf-owned businesses, job creation, revenue sharing
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Accessibility Infrastructure</span>
                        <span className="text-sm text-muted-foreground">$650,000</span>
                      </div>
                      <Progress value={31} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Visual alert systems, ASL interpretation, accessible technology
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Community Capacity Building</span>
                        <span className="text-sm text-muted-foreground">$380,000</span>
                      </div>
                      <Progress value={18} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Organization funding, leadership development, training programs
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Cultural Preservation</span>
                        <span className="text-sm text-muted-foreground">$180,000</span>
                      </div>
                      <Progress value={9} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        ASL promotion, deaf cultural events, community space preservation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
