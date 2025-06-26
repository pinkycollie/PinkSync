"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, CheckCircle, Clock, AlertCircle, Stethoscope, Scale, Landmark, Home } from "lucide-react"

interface ChecklistItem {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  timeframe: string
  category: string
  resources?: string[]
}

interface SectorChecklist {
  id: string
  title: string
  icon: any
  color: string
  description: string
  items: ChecklistItem[]
}

export function ImplementationChecklists() {
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState("medical")

  const toggleItem = (itemId: string) => {
    setCompletedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

  const checklists: SectorChecklist[] = [
    {
      id: "medical",
      title: "Medical Sector",
      icon: Stethoscope,
      color: "text-pink-500",
      description: "Healthcare accessibility implementation checklist",
      items: [
        {
          id: "med-1",
          title: "Conduct Deaf Community Needs Assessment",
          description: "Survey local Deaf community to understand specific healthcare access barriers and preferences",
          priority: "high",
          timeframe: "Week 1-2",
          category: "Planning & Assessment",
          resources: ["Community survey templates", "Focus group guides", "Deaf community liaisons"],
        },
        {
          id: "med-2",
          title: "Establish ASL Interpreter Network",
          description: "Partner with certified medical ASL interpreters and create on-demand access system",
          priority: "high",
          timeframe: "Week 2-4",
          category: "Staffing & Resources",
          resources: [
            "Interpreter certification verification",
            "Video remote interpreting platform",
            "Emergency interpreter protocols",
          ],
        },
        {
          id: "med-3",
          title: "Install Visual Alert Systems",
          description:
            "Implement flashing lights, vibrating pagers, and visual displays for waiting rooms and patient areas",
          priority: "high",
          timeframe: "Week 3-6",
          category: "Infrastructure",
          resources: ["Visual alert hardware", "Installation guides", "Patient notification apps"],
        },
        {
          id: "med-4",
          title: "Create ASL Medical Content Library",
          description: "Develop ASL video explanations for common procedures, medications, and health conditions",
          priority: "medium",
          timeframe: "Week 4-12",
          category: "Content Development",
          resources: ["Medical ASL dictionary", "Video production equipment", "Deaf medical professionals"],
        },
        {
          id: "med-5",
          title: "Upgrade Patient Portal with ASL Support",
          description:
            "Integrate ASL video options into existing patient portal for appointments, results, and communications",
          priority: "medium",
          timeframe: "Week 6-10",
          category: "Technology Integration",
          resources: ["Portal development team", "ASL video hosting platform", "User testing protocols"],
        },
        {
          id: "med-6",
          title: "Train Medical Staff on Deaf Culture",
          description:
            "Provide comprehensive training on Deaf culture, communication best practices, and working with interpreters",
          priority: "high",
          timeframe: "Week 8-12",
          category: "Staff Training",
          resources: ["Deaf culture training materials", "Communication workshops", "Ongoing education programs"],
        },
        {
          id: "med-7",
          title: "Implement ASL Telehealth Options",
          description: "Set up video conferencing systems that support ASL interpretation for remote consultations",
          priority: "medium",
          timeframe: "Week 10-14",
          category: "Technology Integration",
          resources: ["HIPAA-compliant video platforms", "Interpreter scheduling system", "Patient device support"],
        },
        {
          id: "med-8",
          title: "Create Accessible Emergency Protocols",
          description: "Develop visual and tactile emergency notification systems and evacuation procedures",
          priority: "high",
          timeframe: "Week 12-16",
          category: "Safety & Compliance",
          resources: ["Emergency alert systems", "Visual evacuation maps", "Staff emergency training"],
        },
        {
          id: "med-9",
          title: "Establish Patient Feedback System",
          description: "Create ASL-accessible feedback mechanisms to continuously improve Deaf patient experience",
          priority: "low",
          timeframe: "Week 16-20",
          category: "Quality Improvement",
          resources: ["ASL feedback videos", "Survey platforms", "Community advisory board"],
        },
        {
          id: "med-10",
          title: "Obtain DEAF FIRST Certification",
          description: "Complete certification process to demonstrate commitment to Deaf accessibility standards",
          priority: "low",
          timeframe: "Week 20-24",
          category: "Certification",
          resources: ["Certification application", "Documentation requirements", "Assessment protocols"],
        },
      ],
    },
    {
      id: "legal",
      title: "Legal Sector",
      icon: Scale,
      color: "text-teal-500",
      description: "Legal system accessibility implementation checklist",
      items: [
        {
          id: "legal-1",
          title: "Audit Current Legal Accessibility",
          description: "Assess existing legal services for Deaf accessibility gaps and compliance requirements",
          priority: "high",
          timeframe: "Week 1-2",
          category: "Planning & Assessment",
          resources: ["ADA compliance checklist", "Accessibility audit tools", "Legal accessibility standards"],
        },
        {
          id: "legal-2",
          title: "Establish Certified Legal Interpreter Network",
          description: "Partner with certified legal ASL interpreters and create emergency access protocols",
          priority: "high",
          timeframe: "Week 2-4",
          category: "Staffing & Resources",
          resources: [
            "Legal interpreter certifications",
            "Court interpreter protocols",
            "Emergency interpreter access",
          ],
        },
        {
          id: "legal-3",
          title: "Create ASL Legal Document Library",
          description: "Develop ASL video explanations for standard contracts, legal procedures, and rights",
          priority: "medium",
          timeframe: "Week 4-12",
          category: "Content Development",
          resources: ["Legal ASL terminology", "Video production setup", "Legal document templates"],
        },
        {
          id: "legal-4",
          title: "Implement Blockchain Document Verification",
          description: "Set up blockchain system to verify ASL document explanations and client understanding",
          priority: "medium",
          timeframe: "Week 6-10",
          category: "Technology Integration",
          resources: ["Blockchain platform", "Smart contract development", "Digital signature systems"],
        },
        {
          id: "legal-5",
          title: "Upgrade Court Technology Systems",
          description: "Install visual alert systems and ASL interpretation technology in courtrooms",
          priority: "high",
          timeframe: "Week 8-12",
          category: "Infrastructure",
          resources: ["Courtroom AV equipment", "Interpreter positioning systems", "Visual notification displays"],
        },
        {
          id: "legal-6",
          title: "Train Legal Staff on Deaf Rights",
          description: "Educate attorneys and staff on Deaf rights, culture, and effective communication practices",
          priority: "high",
          timeframe: "Week 10-14",
          category: "Staff Training",
          resources: ["Deaf rights training materials", "Communication workshops", "Cultural competency programs"],
        },
        {
          id: "legal-7",
          title: "Develop ASL Civic Participation Tools",
          description: "Create ASL resources for voting, public hearings, and civic engagement",
          priority: "medium",
          timeframe: "Week 12-16",
          category: "Civic Engagement",
          resources: ["Voting guides in ASL", "Public hearing interpretation", "Civic education materials"],
        },
        {
          id: "legal-8",
          title: "Establish Legal Aid ASL Services",
          description: "Ensure legal aid services are fully accessible with ASL interpretation and Deaf attorneys",
          priority: "medium",
          timeframe: "Week 14-18",
          category: "Service Delivery",
          resources: ["Legal aid interpreter funding", "Deaf attorney network", "Pro bono ASL services"],
        },
        {
          id: "legal-9",
          title: "Create Emergency Legal Access Protocol",
          description: "Develop 24/7 emergency legal interpretation services for urgent legal matters",
          priority: "high",
          timeframe: "Week 16-20",
          category: "Emergency Services",
          resources: ["Emergency interpreter hotline", "After-hours access protocols", "Crisis legal support"],
        },
        {
          id: "legal-10",
          title: "Implement Continuous Compliance Monitoring",
          description: "Establish ongoing monitoring system to ensure continued legal accessibility compliance",
          priority: "low",
          timeframe: "Week 20-24",
          category: "Quality Assurance",
          resources: ["Compliance monitoring tools", "Regular accessibility audits", "Feedback collection systems"],
        },
      ],
    },
    {
      id: "financial",
      title: "Financial Sector",
      icon: Landmark,
      color: "text-pink-500",
      description: "Financial services accessibility implementation checklist",
      items: [
        {
          id: "fin-1",
          title: "Assess Financial Accessibility Barriers",
          description: "Evaluate current banking and financial services for Deaf accessibility challenges",
          priority: "high",
          timeframe: "Week 1-2",
          category: "Planning & Assessment",
          resources: ["Financial accessibility audit", "Customer feedback analysis", "Regulatory compliance review"],
        },
        {
          id: "fin-2",
          title: "Train Customer Service Staff in ASL Basics",
          description: "Provide ASL training for front-line staff and establish interpreter access protocols",
          priority: "high",
          timeframe: "Week 2-6",
          category: "Staff Training",
          resources: ["ASL training programs", "Customer service protocols", "Interpreter scheduling systems"],
        },
        {
          id: "fin-3",
          title: "Implement Video Banking with ASL Support",
          description: "Set up secure video banking platform with ASL interpretation capabilities",
          priority: "medium",
          timeframe: "Week 4-8",
          category: "Technology Integration",
          resources: ["Secure video platform", "Banking software integration", "ASL interpreter network"],
        },
        {
          id: "fin-4",
          title: "Create ASL Financial Education Library",
          description:
            "Develop comprehensive ASL videos explaining banking products, investment options, and financial literacy",
          priority: "medium",
          timeframe: "Week 6-12",
          category: "Content Development",
          resources: ["Financial ASL terminology", "Educational video production", "Financial literacy curriculum"],
        },
        {
          id: "fin-5",
          title: "Upgrade Mobile Banking App Accessibility",
          description: "Ensure mobile banking apps support visual alerts, ASL video help, and accessible navigation",
          priority: "medium",
          timeframe: "Week 8-12",
          category: "Technology Integration",
          resources: ["App development team", "Accessibility testing tools", "User experience research"],
        },
        {
          id: "fin-6",
          title: "Implement Visual Authentication Systems",
          description: "Set up biometric and visual authentication options as alternatives to voice-based systems",
          priority: "high",
          timeframe: "Week 10-14",
          category: "Security & Authentication",
          resources: [
            "Biometric authentication systems",
            "Visual verification protocols",
            "Security compliance review",
          ],
        },
        {
          id: "fin-7",
          title: "Establish Deaf Financial Advisory Services",
          description: "Recruit Deaf financial advisors or train existing advisors in Deaf cultural competency",
          priority: "medium",
          timeframe: "Week 12-16",
          category: "Service Delivery",
          resources: [
            "Deaf financial professional network",
            "Cultural competency training",
            "Advisory service protocols",
          ],
        },
        {
          id: "fin-8",
          title: "Create Blockchain Financial Verification",
          description: "Implement blockchain system for transparent, accessible financial agreement verification",
          priority: "low",
          timeframe: "Week 14-18",
          category: "Technology Integration",
          resources: ["Blockchain platform", "Smart contract development", "Financial verification protocols"],
        },
        {
          id: "fin-9",
          title: "Develop Emergency Financial Access",
          description: "Create 24/7 emergency financial services with immediate ASL interpretation access",
          priority: "medium",
          timeframe: "Week 16-20",
          category: "Emergency Services",
          resources: ["Emergency service protocols", "After-hours interpreter access", "Crisis financial support"],
        },
        {
          id: "fin-10",
          title: "Launch Deaf Community Financial Programs",
          description: "Develop specialized financial products and services tailored to Deaf community needs",
          priority: "low",
          timeframe: "Week 20-24",
          category: "Community Programs",
          resources: ["Community needs assessment", "Product development team", "Marketing in ASL"],
        },
      ],
    },
    {
      id: "realestate",
      title: "Real Estate Sector",
      icon: Home,
      color: "text-teal-500",
      description: "Real estate accessibility implementation checklist",
      items: [
        {
          id: "re-1",
          title: "Evaluate Real Estate Accessibility Gaps",
          description: "Assess current real estate services for barriers faced by Deaf buyers, sellers, and renters",
          priority: "high",
          timeframe: "Week 1-2",
          category: "Planning & Assessment",
          resources: ["Accessibility assessment tools", "Client feedback surveys", "Market analysis reports"],
        },
        {
          id: "re-2",
          title: "Train Real Estate Agents in Deaf Culture",
          description: "Provide comprehensive training on Deaf culture, communication, and accessibility needs",
          priority: "high",
          timeframe: "Week 2-6",
          category: "Staff Training",
          resources: ["Deaf culture training materials", "Communication workshops", "Ongoing education programs"],
        },
        {
          id: "re-3",
          title: "Create ASL Property Listing Videos",
          description: "Develop ASL video descriptions and virtual tours for all property listings",
          priority: "medium",
          timeframe: "Week 4-8",
          category: "Content Development",
          resources: ["Video production equipment", "ASL real estate terminology", "Virtual tour technology"],
        },
        {
          id: "re-4",
          title: "Implement Visual Property Alert Systems",
          description: "Set up visual notification systems for property alerts, showings, and communications",
          priority: "medium",
          timeframe: "Week 6-10",
          category: "Technology Integration",
          resources: ["Visual alert systems", "Mobile app notifications", "Property management software"],
        },
        {
          id: "re-5",
          title: "Establish ASL Interpretation for Transactions",
          description: "Ensure all property showings, negotiations, and closings have ASL interpretation available",
          priority: "high",
          timeframe: "Week 8-12",
          category: "Service Delivery",
          resources: ["Real estate interpreter network", "Video remote interpreting", "Transaction protocols"],
        },
        {
          id: "re-6",
          title: "Create ASL Real Estate Document Library",
          description: "Develop ASL video explanations for contracts, disclosures, and legal documents",
          priority: "medium",
          timeframe: "Week 10-14",
          category: "Content Development",
          resources: ["Legal document templates", "ASL legal terminology", "Video production setup"],
        },
        {
          id: "re-7",
          title: "Implement Blockchain Property Records",
          description: "Set up blockchain system for transparent, accessible property transaction records",
          priority: "low",
          timeframe: "Week 12-16",
          category: "Technology Integration",
          resources: ["Blockchain platform", "Property record systems", "Smart contract development"],
        },
        {
          id: "re-8",
          title: "Develop Deaf Community Housing Programs",
          description: "Create specialized housing programs and resources for Deaf community members",
          priority: "medium",
          timeframe: "Week 14-18",
          category: "Community Programs",
          resources: ["Community housing needs assessment", "Funding sources", "Partnership development"],
        },
        {
          id: "re-9",
          title: "Establish Visual Property Management",
          description: "Implement visual communication systems for property management and tenant relations",
          priority: "medium",
          timeframe: "Week 16-20",
          category: "Property Management",
          resources: ["Visual communication tools", "Property management software", "Tenant notification systems"],
        },
        {
          id: "re-10",
          title: "Create Accessible Dispute Resolution",
          description: "Develop ASL-accessible mediation and dispute resolution processes for property issues",
          priority: "low",
          timeframe: "Week 20-24",
          category: "Dispute Resolution",
          resources: ["Mediation protocols", "ASL interpreter access", "Legal support systems"],
        },
      ],
    },
  ]

  const activeChecklist = checklists.find((c) => c.id === activeTab) || checklists[0]
  const completedCount = activeChecklist.items.filter((item) => completedItems[item.id]).length
  const progressPercentage = (completedCount / activeChecklist.items.length) * 100

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-50"
      case "medium":
        return "text-yellow-500 bg-yellow-50"
      case "low":
        return "text-green-500 bg-green-50"
      default:
        return "text-gray-500 bg-gray-50"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return AlertCircle
      case "medium":
        return Clock
      case "low":
        return CheckCircle
      default:
        return CheckCircle
    }
  }

  const downloadChecklist = (sectorId: string) => {
    const checklist = checklists.find((c) => c.id === sectorId)
    if (!checklist) return

    const content = `# DEAF FIRST Implementation Checklist - ${checklist.title}

${checklist.description}

## Progress: ${completedCount}/${checklist.items.length} items completed (${Math.round(progressPercentage)}%)

${checklist.items
  .map(
    (item) => `
### ${item.title}
- **Description:** ${item.description}
- **Priority:** ${item.priority.toUpperCase()}
- **Timeframe:** ${item.timeframe}
- **Category:** ${item.category}
- **Status:** ${completedItems[item.id] ? "✅ Completed" : "⏳ Pending"}
${item.resources ? `- **Resources:** ${item.resources.join(", ")}` : ""}
`,
  )
  .join("\n")}

---
Generated by MBTQ.dev DEAF FIRST Implementation System
`

    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `deaf-first-${sectorId}-checklist.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-teal-400">
          DEAF FIRST Implementation Checklists
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Comprehensive, actionable checklists to guide your organization through implementing DEAF FIRST principles.
          Track your progress and download customized implementation guides.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          {checklists.map((checklist) => (
            <TabsTrigger key={checklist.id} value={checklist.id} className="flex items-center gap-2">
              <checklist.icon className={`h-4 w-4 ${checklist.color}`} />
              <span>{checklist.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {checklists.map((checklist) => (
          <TabsContent key={checklist.id} value={checklist.id} className="space-y-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-pink-500 to-teal-400 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <checklist.icon className="h-6 w-6" />
                    <div>
                      <CardTitle>{checklist.title} Implementation Checklist</CardTitle>
                      <CardDescription className="text-white/80">{checklist.description}</CardDescription>
                    </div>
                  </div>
                  <Button
                    onClick={() => downloadChecklist(checklist.id)}
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-white/80 mb-2">
                    <span>
                      Progress: {completedCount}/{checklist.items.length} items completed
                    </span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="bg-white/20" />
                </div>
              </CardHeader>
            </Card>

            <div className="grid gap-4">
              {checklist.items.map((item) => {
                const PriorityIcon = getPriorityIcon(item.priority)
                return (
                  <Card
                    key={item.id}
                    className={`transition-all ${completedItems[item.id] ? "bg-green-50 border-green-200" : ""}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          id={item.id}
                          checked={completedItems[item.id] || false}
                          onCheckedChange={() => toggleItem(item.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3
                                className={`font-medium ${completedItems[item.id] ? "line-through text-gray-500" : ""}`}
                              >
                                {item.title}
                              </h3>
                              <p
                                className={`text-sm text-gray-600 mt-1 ${completedItems[item.id] ? "line-through" : ""}`}
                              >
                                {item.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}
                              >
                                <PriorityIcon className="h-3 w-3" />
                                {item.priority}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Timeframe:</span>
                              <p className="text-gray-600">{item.timeframe}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Category:</span>
                              <p className="text-gray-600">{item.category}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Status:</span>
                              <p className={completedItems[item.id] ? "text-green-600 font-medium" : "text-yellow-600"}>
                                {completedItems[item.id] ? "Completed" : "Pending"}
                              </p>
                            </div>
                          </div>

                          {item.resources && (
                            <div>
                              <span className="font-medium text-gray-700 text-sm">Required Resources:</span>
                              <ul className="text-sm text-gray-600 mt-1">
                                {item.resources.map((resource, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <CheckCircle className="h-3 w-3 text-gray-400" />
                                    {resource}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Card className="bg-gradient-to-r from-pink-50 to-teal-50 border-pink-200">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2">Need Implementation Support?</h3>
                <p className="text-gray-600 mb-4">
                  Our team can help you customize this checklist for your specific organization and provide ongoing
                  support.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button className="bg-gradient-to-r from-pink-500 to-teal-400 hover:from-pink-600 hover:to-teal-500">
                    Request Consultation
                  </Button>
                  <Button variant="outline">Join Implementation Community</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
