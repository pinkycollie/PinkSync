"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Stethoscope, Scale, Landmark, Home } from "lucide-react"

export function SectorImplementation() {
  const [activeTab, setActiveTab] = useState("medical")

  const sectors = [
    {
      id: "medical",
      title: "Medical",
      icon: Stethoscope,
      color: "text-pink-500",
      description: "Healthcare accessibility for Deaf patients",
      strategies: [
        {
          title: "ASL-First Communications",
          description:
            "All interactions (telehealth, in-person, records access) should support and prioritize direct ASL video options—never relying on text/voice alone.",
          implementation: [
            "Integrate ASL video chat options into patient portals",
            "Provide ASL video explanations for all medical procedures",
            "Train staff on working with ASL interpreters effectively",
            "Implement visual alerts for waiting rooms and hospital settings",
          ],
        },
        {
          title: "Accessible Portals",
          description:
            "Clinics and hospitals offer web/mobile portals with natively produced ASL content for instructions, alerts, consents, and prescriptions.",
          implementation: [
            "Develop ASL video libraries for common medical terms and procedures",
            "Create ASL versions of all consent forms and patient education materials",
            "Ensure patient portals support video uploads for ASL questions",
            "Implement visual confirmation for medication instructions",
          ],
        },
        {
          title: "Visual & Tactile Alerts",
          description:
            "Appointment reminders, emergencies, and prescription notifications include visual and haptic options, not just phone/audio.",
          implementation: [
            "Configure multi-modal alerts (visual, haptic) for appointment reminders",
            "Implement flashing light systems for emergency notifications",
            "Provide vibrating pagers or smartphone integration for in-facility alerts",
            "Ensure prescription apps include visual notification options",
          ],
        },
      ],
      metrics: [
        "Percentage of patient interactions conducted in ASL",
        "Reduction in miscommunication incidents",
        "Patient satisfaction scores from Deaf community",
        "Decreased appointment no-shows due to improved communication",
      ],
      caseStudy: {
        title: "Memorial Hospital ASL Integration",
        description:
          "Memorial Hospital implemented a comprehensive ASL-first approach, resulting in a 45% increase in Deaf patient visits and a 60% improvement in treatment adherence.",
        results: [
          "Integrated ASL video options throughout patient journey",
          "Trained 100% of staff on Deaf cultural competence",
          "Reduced miscommunication incidents by 78%",
          "Improved patient satisfaction scores by 92%",
        ],
      },
    },
    {
      id: "legal",
      title: "Legal",
      icon: Scale,
      color: "text-teal-500",
      description: "Legal system accessibility for Deaf clients",
      strategies: [
        {
          title: "Guaranteed ASL Counsel",
          description:
            "All legal services (consultation, court, contracts) offer on-demand, certified ASL interpreters or Deaf legal professionals.",
          implementation: [
            "Establish partnerships with certified legal ASL interpreters",
            "Create a database of Deaf legal professionals by specialty",
            "Implement video remote interpreting for immediate access",
            "Train legal staff on working effectively with interpreters",
          ],
        },
        {
          title: "Accessible Documentation",
          description:
            "Contracts and notices are explained and stored with ASL video, not just written English; blockchain (e.g. NFTs or timestamps) can record receipt and agreement for clarity and proof.",
          implementation: [
            "Create ASL video explanations for all standard legal documents",
            "Implement blockchain verification for ASL contract explanations",
            "Develop a system for storing ASL video explanations alongside documents",
            "Create visual guides for complex legal processes",
          ],
        },
        {
          title: "Inclusive Civic Access",
          description:
            "Public notices, voting, and civic forums ensure simultaneous ASL video and visual notifications.",
          implementation: [
            "Provide ASL interpreters at all public hearings and forums",
            "Create ASL video versions of all public notices and ballot measures",
            "Implement visual notification systems for civic emergencies",
            "Ensure voting materials are available in ASL video format",
          ],
        },
      ],
      metrics: [
        "Percentage of legal proceedings with ASL access",
        "Number of legal documents with ASL video explanations",
        "Reduction in legal misunderstandings due to language barriers",
        "Increased Deaf participation in civic processes",
      ],
      caseStudy: {
        title: "City of Portland Legal Accessibility Initiative",
        description:
          "The City of Portland implemented ASL access across all legal and civic services, resulting in a 65% increase in Deaf civic participation.",
        results: [
          "Provided ASL interpreters at all public meetings",
          "Created ASL video explanations for all city ordinances",
          "Implemented blockchain verification for legal documents",
          "Increased Deaf voter turnout by 53%",
        ],
      },
    },
    {
      id: "financial",
      title: "Financial",
      icon: Landmark,
      color: "text-pink-500",
      description: "Financial services accessibility for Deaf clients",
      strategies: [
        {
          title: "ASL in Banking & Advising",
          description:
            "Financial institutions provide ASL-accessible staff, video appointments, and educational materials for transactions, lending, and investments.",
          implementation: [
            "Train customer-facing staff in basic ASL or provide on-demand interpreters",
            "Create ASL video libraries for financial education and product information",
            "Implement video banking options with ASL support",
            "Develop visual guides for complex financial products",
          ],
        },
        {
          title: "Accessible Financial Records",
          description: "Account management and digital banking offer ASL video guides and accessible customer support.",
          implementation: [
            "Create ASL video tutorials for online banking features",
            "Implement video customer service with ASL support",
            "Provide visual transaction histories and spending analytics",
            "Ensure mobile banking apps are fully accessible with visual alerts",
          ],
        },
        {
          title: "Transparent Auth & Consent",
          description:
            "Use verifiable, accessible signatures (including on-chain/NFT receipts if possible) for financial agreements, ensuring Deaf clients are not excluded from authentication or authorization.",
          implementation: [
            "Implement visual biometric authentication options",
            "Create blockchain verification for financial agreements",
            "Develop visual confirmation processes for transactions",
            "Ensure all consent processes have ASL video explanations",
          ],
        },
      ],
      metrics: [
        "Number of financial transactions conducted in ASL",
        "Customer satisfaction scores from Deaf clients",
        "Reduction in financial misunderstandings due to language barriers",
        "Increased financial literacy among Deaf customers",
      ],
      caseStudy: {
        title: "First Community Credit Union ASL Banking",
        description:
          "First Community Credit Union implemented comprehensive ASL banking services, resulting in a 70% increase in Deaf members and improved financial outcomes.",
        results: [
          "Trained all tellers in basic ASL and Deaf culture",
          "Created ASL video explanations for all financial products",
          "Implemented video banking with ASL interpreters",
          "Increased Deaf members' average savings by 40%",
        ],
      },
    },
    {
      id: "realestate",
      title: "Real Estate",
      icon: Home,
      color: "text-teal-500",
      description: "Real estate accessibility for Deaf buyers and renters",
      strategies: [
        {
          title: "ASL-Accessible Listings",
          description:
            "Property listings online and in offices include video tours and ASL descriptions, and open houses provide ASL guides.",
          implementation: [
            "Create ASL video descriptions for all property listings",
            "Provide ASL interpreters at open houses and showings",
            "Develop virtual tours with ASL narration options",
            "Train real estate agents in basic ASL and Deaf culture",
          ],
        },
        {
          title: "Inclusive Transactions",
          description:
            "From showing to closing, all contracts, disclosures, and communications provide ASL options—in person or remote.",
          implementation: [
            "Create ASL video explanations for all standard real estate documents",
            "Implement video remote interpreting for all transaction meetings",
            "Develop visual guides for the home buying/renting process",
            "Ensure all digital transaction platforms support ASL video",
          ],
        },
        {
          title: "Community Ownership & Transparency",
          description:
            "Employ DAOs or web3 tools to let Deaf buyers, tenants, and organizations own, manage, and document their real estate dealings with on-chain records that are accessible and permanent.",
          implementation: [
            "Create blockchain-verified property records with ASL explanations",
            "Develop DAOs for Deaf community property management",
            "Implement transparent, visual property management systems",
            "Create ASL-accessible dispute resolution processes",
          ],
        },
      ],
      metrics: [
        "Number of real estate transactions conducted with ASL support",
        "Percentage of listings with ASL video descriptions",
        "Deaf homeownership rates compared to general population",
        "Customer satisfaction scores from Deaf clients",
      ],
      caseStudy: {
        title: "Accessible Homes Real Estate Group",
        description:
          "Accessible Homes implemented ASL-first real estate services, resulting in a 55% increase in Deaf homeownership in their market.",
        results: [
          "Created ASL video tours for all property listings",
          "Provided ASL interpreters at all client meetings",
          "Implemented blockchain verification for all transactions",
          "Reduced closing time for Deaf clients by 35%",
        ],
      },
    },
  ]

  const activeSector = sectors.find((sector) => sector.id === activeTab) || sectors[0]

  return (
    <div className="w-full space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          {sectors.map((sector) => (
            <TabsTrigger key={sector.id} value={sector.id} className="flex items-center gap-2">
              <sector.icon className={`h-4 w-4 ${sector.color}`} />
              <span>{sector.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {sectors.map((sector) => (
          <TabsContent key={sector.id} value={sector.id} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Strategies */}
              <div className="md:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold">DEAF FIRST Strategies for {sector.title}</h2>
                <p className="text-gray-600">{sector.description}</p>

                {sector.strategies.map((strategy, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className={`flex items-center gap-2 ${sector.color}`}>
                        <CheckCircle className="h-5 w-5" />
                        {strategy.title}
                      </CardTitle>
                      <CardDescription>{strategy.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <h4 className="font-medium mb-2">Implementation Steps:</h4>
                      <ul className="space-y-2">
                        {strategy.implementation.map((step, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className={`h-4 w-4 mt-1 ${sector.color}`} />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Case Study and Metrics */}
              <div className="space-y-6">
                <Card>
                  <CardHeader className={`bg-gradient-to-r from-pink-500 to-teal-400 text-white`}>
                    <CardTitle>Success Metrics</CardTitle>
                    <CardDescription className="text-white/80">
                      Key performance indicators for {sector.title} sector
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {sector.metrics.map((metric, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className={`h-4 w-4 mt-1 ${sector.color}`} />
                          <span>{metric}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className={sector.color}>Case Study: {sector.caseStudy.title}</CardTitle>
                    <CardDescription>{sector.caseStudy.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-medium mb-2">Results:</h4>
                    <ul className="space-y-2">
                      {sector.caseStudy.results.map((result, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className={`h-4 w-4 mt-1 ${sector.color}`} />
                          <span>{result}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Button className="w-full bg-gradient-to-r from-pink-500 to-teal-400 hover:from-pink-600 hover:to-teal-500">
                  Get {sector.title} Implementation Guide
                </Button>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
