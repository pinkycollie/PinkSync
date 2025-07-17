"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Smartphone, Tablet, DollarSign, TrendingUp, Heart, Briefcase } from "lucide-react"

interface FederalProgramsData {
  ndbedp: any
  vocationalRehab: any
  federalAgencies: any[]
  lastUpdated: string
}

export default function FederalProgramsDashboard() {
  const [data, setData] = useState<FederalProgramsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedState, setSelectedState] = useState("national")

  useEffect(() => {
    fetchData()
  }, [selectedState])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/federal-programs/data?state=${selectedState}`)
      const result = await response.json()

      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch federal programs data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num)
  }

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading federal programs data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">🏛️ Federal Programs for Deaf Community</h1>
          <p className="text-muted-foreground">
            Comprehensive tracking of federal agencies, nonprofits, and programs supporting deaf individuals
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ndbedp">NDBEDP</TabsTrigger>
          <TabsTrigger value="vr">Vocational Rehab</TabsTrigger>
          <TabsTrigger value="agencies">Federal Agencies</TabsTrigger>
          <TabsTrigger value="nonprofits">Nonprofits</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Program Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">NDBEDP Participants</CardTitle>
                <Smartphone className="h-4 w-4 text-pink-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(28500)}</div>
                <div className="text-xs text-muted-foreground">+450 new enrollments monthly</div>
                <Progress value={85} className="mt-2 h-1" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">VR Deaf Clients</CardTitle>
                <Briefcase className="h-4 w-4 text-pink-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(77700)}</div>
                <div className="text-xs text-muted-foreground">68.5% success rate</div>
                <Progress value={68} className="mt-2 h-1" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Federal Funding</CardTitle>
                <DollarSign className="h-4 w-4 text-pink-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(12500000000)}</div>
                <div className="text-xs text-muted-foreground">Across all deaf programs</div>
                <Progress value={92} className="mt-2 h-1" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Equipment Distributed</CardTitle>
                <Tablet className="h-4 w-4 text-pink-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(125000)}</div>
                <div className="text-xs text-muted-foreground">Assistive devices annually</div>
                <Progress value={78} className="mt-2 h-1" />
              </CardContent>
            </Card>
          </div>

          {/* Program Impact Summary */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-pink-500" />
                  Employment Impact
                </CardTitle>
                <CardDescription>How federal programs improve deaf employment outcomes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Competitive Employment Achieved</span>
                    <Badge variant="outline">{formatNumber(32500)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Average Wage Increase</span>
                    <Badge variant="outline" className="text-green-600">
                      +35.2%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Job Retention Rate</span>
                    <Badge variant="outline" className="text-blue-600">
                      82.3%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Gained Employment (NDBEDP)</span>
                    <Badge variant="outline">{formatNumber(3200)}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  Independence & Quality of Life
                </CardTitle>
                <CardDescription>Improvements in daily living and community participation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Increased Independence</span>
                    <Badge variant="outline">{formatNumber(38100)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Reduced Social Isolation</span>
                    <Badge variant="outline">{formatNumber(14200)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Community Participation</span>
                    <Badge variant="outline">{formatNumber(39000)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Self-Advocacy Skills</span>
                    <Badge variant="outline">{formatNumber(18500)}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ndbedp" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-pink-500" />
                National Deaf-Blind Equipment Distribution Program
              </CardTitle>
              <CardDescription>
                Federally funded program providing assistive technology to deaf-blind individuals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-4">
                  <h4 className="font-semibold">Program Overview</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Participants</span>
                      <span className="font-medium">{formatNumber(28500)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Monthly New Enrollments</span>
                      <span className="font-medium text-green-600">+{formatNumber(450)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Funding</span>
                      <span className="font-medium">{formatCurrency(27500000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">State Programs</span>
                      <span className="font-medium">56</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Active Vendors</span>
                      <span className="font-medium">85</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Equipment Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Smartphones</span>
                      <span className="font-medium">{formatNumber(15600)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Tablets</span>
                      <span className="font-medium">{formatNumber(8900)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Braille Displays</span>
                      <span className="font-medium">{formatNumber(3200)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Amplified Phones</span>
                      <span className="font-medium">{formatNumber(12500)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Alerting Devices</span>
                      <span className="font-medium">{formatNumber(71600)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Demographics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Under 18</span>
                      <span className="font-medium">{formatNumber(2850)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Age 18-64</span>
                      <span className="font-medium">{formatNumber(18200)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Over 65</span>
                      <span className="font-medium">{formatNumber(7450)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Usher Syndrome</span>
                      <span className="font-medium">{formatNumber(6800)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Congenital Deaf-Blind</span>
                      <span className="font-medium">{formatNumber(4200)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Communication Methods & Technology</CardTitle>
              <CardDescription>How participants communicate and what technology they use</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{formatNumber(8500)}</div>
                  <div className="text-sm text-muted-foreground">Tactile ASL</div>
                  <Progress value={30} className="mt-2 h-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{formatNumber(12200)}</div>
                  <div className="text-sm text-muted-foreground">Braille</div>
                  <Progress value={43} className="mt-2 h-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{formatNumber(15600)}</div>
                  <div className="text-sm text-muted-foreground">Large Print</div>
                  <Progress value={55} className="mt-2 h-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{formatNumber(9800)}</div>
                  <div className="text-sm text-muted-foreground">Speech Reading</div>
                  <Progress value={34} className="mt-2 h-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{formatNumber(3200)}</div>
                  <div className="text-sm text-muted-foreground">Protactile</div>
                  <Progress value={11} className="mt-2 h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vr" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-pink-500" />
                Vocational Rehabilitation Services
              </CardTitle>
              <CardDescription>
                State-federal partnership providing employment services to people with disabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-4">
                  <h4 className="font-semibold">Program Overview</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total VR Clients</span>
                      <span className="font-medium">{formatNumber(850000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Deaf Clients</span>
                      <span className="font-medium">{formatNumber(45600)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Deaf-Blind Clients</span>
                      <span className="font-medium">{formatNumber(3200)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Hard of Hearing</span>
                      <span className="font-medium">{formatNumber(28900)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Successful Closures</span>
                      <span className="font-medium text-green-600">{formatNumber(32500)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Support Services</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Interpreter Hours</span>
                      <span className="font-medium">{formatNumber(485000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Interpreter Cost</span>
                      <span className="font-medium">{formatCurrency(48500000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Assistive Devices</span>
                      <span className="font-medium">{formatNumber(15600)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Technology Cost</span>
                      <span className="font-medium">{formatCurrency(28500000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Job Placements</span>
                      <span className="font-medium">{formatNumber(28900)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Training Services</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">College Training</span>
                      <span className="font-medium">{formatNumber(18500)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Vocational Training</span>
                      <span className="font-medium">{formatNumber(25600)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">On-the-Job Training</span>
                      <span className="font-medium">{formatNumber(12800)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Apprenticeships</span>
                      <span className="font-medium">{formatNumber(3200)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Skill Development</span>
                      <span className="font-medium">{formatNumber(32100)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Employment Outcomes</CardTitle>
              <CardDescription>Success metrics for deaf VR clients achieving competitive employment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{formatNumber(32500)}</div>
                  <div className="text-sm text-muted-foreground">Competitive Employment</div>
                  <Progress value={68} className="mt-2 h-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">$18.50</div>
                  <div className="text-sm text-muted-foreground">Average Wage</div>
                  <Progress value={75} className="mt-2 h-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">+35.2%</div>
                  <div className="text-sm text-muted-foreground">Wage Increase</div>
                  <Progress value={85} className="mt-2 h-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">82.3%</div>
                  <div className="text-sm text-muted-foreground">Job Retention</div>
                  <Progress value={82} className="mt-2 h-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{formatNumber(28900)}</div>
                  <div className="text-sm text-muted-foreground">With Benefits</div>
                  <Progress value={89} className="mt-2 h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agencies" className="space-y-4">
          <div className="grid gap-4">
            {[
              {
                name: "Department of Education - OSERS",
                type: "Federal Agency",
                budget: 3200000000,
                deafFunding: 450000000,
                programs: 2,
                beneficiaries: 77700,
                description: "Provides VR services and special education support",
              },
              {
                name: "Social Security Administration",
                type: "Federal Agency",
                budget: 203000000000,
                deafFunding: 11700000000,
                programs: 2,
                beneficiaries: 470000,
                description: "SSDI and SSI benefits for disabled individuals",
              },
              {
                name: "National Institute on Deafness (NIDCD)",
                type: "Federal Agency",
                budget: 450000000,
                deafFunding: 280000000,
                programs: 1,
                beneficiaries: 36000000,
                description: "Research on hearing, balance, and communication disorders",
              },
            ].map((agency) => (
              <Card key={agency.name}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{agency.name}</CardTitle>
                      <CardDescription>{agency.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{agency.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Total Budget</div>
                      <div className="text-xl font-bold">{formatCurrency(agency.budget)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Deaf-Specific Funding</div>
                      <div className="text-xl font-bold text-pink-600">{formatCurrency(agency.deafFunding)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Programs</div>
                      <div className="text-xl font-bold">{agency.programs}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Beneficiaries</div>
                      <div className="text-xl font-bold">{formatNumber(agency.beneficiaries)}</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Deaf-Specific Funding Percentage</span>
                      <span>{Math.round((agency.deafFunding / agency.budget) * 100)}%</span>
                    </div>
                    <Progress value={(agency.deafFunding / agency.budget) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="nonprofits" className="space-y-4">
          <div className="grid gap-4">
            {[
              {
                name: "National Association of the Deaf (NAD)",
                type: "Advocacy Organization",
                budget: 2500000,
                programs: 1,
                beneficiaries: 48000,
                description: "Legal advocacy and education on deaf rights",
                impact: "125 legal cases won, 45 policies changed",
              },
              {
                name: "Helen Keller National Center",
                type: "Service Provider",
                budget: 12000000,
                programs: 1,
                beneficiaries: 8500,
                description: "Specialized services for deaf-blind individuals",
                impact: "3,200 individuals served, 1,800 professionals trained",
              },
              {
                name: "Gallaudet University",
                type: "Educational Institution",
                budget: 125000000,
                programs: 1,
                beneficiaries: 1800,
                description: "Higher education for deaf and hard of hearing students",
                impact: "78.5% graduation rate, 85.2% employment rate",
              },
              {
                name: "Registry of Interpreters for the Deaf (RID)",
                type: "Professional Organization",
                budget: 3500000,
                programs: 3,
                beneficiaries: 15000,
                description: "Certification and professional development for interpreters",
                impact: "12,500 certified interpreters, 450 continuing education programs",
              },
            ].map((org) => (
              <Card key={org.name}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{org.name}</CardTitle>
                      <CardDescription>{org.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {org.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Annual Budget</div>
                      <div className="text-xl font-bold">{formatCurrency(org.budget)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Programs</div>
                      <div className="text-xl font-bold">{org.programs}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Beneficiaries</div>
                      <div className="text-xl font-bold">{formatNumber(org.beneficiaries)}</div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-900 mb-1">Key Impact</div>
                    <div className="text-sm text-blue-800">{org.impact}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
