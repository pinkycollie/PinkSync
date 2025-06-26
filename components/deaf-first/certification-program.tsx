import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Award, Shield, Clock } from "lucide-react"

export function CertificationProgram() {
  const certificationLevels = [
    {
      id: "bronze",
      title: "Bronze",
      icon: Award,
      color: "bg-amber-600",
      textColor: "text-amber-600",
      description: "Essential DEAF FIRST implementation",
      requirements: [
        "ASL interpretation available upon request",
        "Basic staff training in Deaf awareness",
        "Visual alerts for critical communications",
        "Accessible digital content with captions",
      ],
      timeframe: "3-6 months",
      price: "$2,500",
    },
    {
      id: "silver",
      title: "Silver",
      icon: Award,
      color: "bg-gray-400",
      textColor: "text-gray-500",
      description: "Advanced DEAF FIRST implementation",
      requirements: [
        "On-demand ASL interpretation services",
        "Comprehensive staff training in Deaf culture",
        "Multi-modal communication systems (visual, haptic)",
        "ASL video content for key services and information",
        "Deaf advisory input on accessibility features",
      ],
      timeframe: "6-9 months",
      price: "$5,000",
    },
    {
      id: "gold",
      title: "Gold",
      icon: Award,
      color: "bg-yellow-400",
      textColor: "text-yellow-600",
      description: "Comprehensive DEAF FIRST implementation",
      requirements: [
        "Deaf professionals on staff or leadership team",
        "ASL-first approach to all communications",
        "Complete digital and physical accessibility",
        "Blockchain verification for important documents",
        "Regular Deaf community feedback integration",
        "Ongoing staff training and development",
        "Measurable impact metrics and reporting",
      ],
      timeframe: "9-12 months",
      price: "$10,000",
    },
  ]

  const certificationProcess = [
    {
      step: 1,
      title: "Initial Assessment",
      description: "Comprehensive evaluation of current accessibility practices and gaps",
    },
    {
      step: 2,
      title: "Custom Implementation Plan",
      description: "Tailored roadmap for achieving your target certification level",
    },
    {
      step: 3,
      title: "Staff Training",
      description: "Comprehensive training on Deaf culture, ASL basics, and accessibility best practices",
    },
    {
      step: 4,
      title: "Technology Integration",
      description: "Implementation of necessary tools and platforms for ASL accessibility",
    },
    {
      step: 5,
      title: "Verification Audit",
      description: "Thorough review by Deaf professionals to verify implementation",
    },
    {
      step: 6,
      title: "Certification & Recognition",
      description: "Official certification, digital badge, and public recognition",
    },
  ]

  return (
    <div className="space-y-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">DEAF FIRST Certification Program</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Demonstrate your commitment to Deaf accessibility with our comprehensive certification program.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {certificationLevels.map((level) => (
          <Card key={level.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge className={`${level.color} hover:${level.color}`}>{level.title}</Badge>
                <level.icon className={`h-6 w-6 ${level.textColor}`} />
              </div>
              <CardTitle>{level.title} Certification</CardTitle>
              <CardDescription>{level.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <h4 className="font-medium mb-2">Requirements:</h4>
              <ul className="space-y-2 mb-4">
                {level.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className={`h-4 w-4 mt-1 ${level.textColor}`} />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Clock className="h-4 w-4" />
                <span>Timeframe: {level.timeframe}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Shield className="h-4 w-4" />
                <span>Investment: {level.price}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-gradient-to-r from-pink-500 to-teal-400 hover:from-pink-600 hover:to-teal-500">
                Apply for {level.title} Certification
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16">
        <h3 className="text-xl font-bold mb-6 text-center">Certification Process</h3>
        <div className="relative">
          {/* Process timeline line */}
          <div className="absolute left-[15px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-pink-500 to-teal-400 md:left-1/2 md:-ml-[1px]"></div>

          <div className="space-y-12">
            {certificationProcess.map((process, index) => (
              <div key={index} className="relative">
                <div
                  className={`flex items-center md:absolute md:left-1/2 md:-translate-x-1/2 z-10 ${
                    index % 2 === 0 ? "justify-start" : "justify-start md:justify-start"
                  }`}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-teal-400 text-white font-bold">
                    {process.step}
                  </div>
                </div>

                <div
                  className={`pl-12 md:w-1/2 md:pl-0 ${
                    index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:ml-auto"
                  }`}
                >
                  <h4 className="text-lg font-medium">{process.title}</h4>
                  <p className="text-gray-600">{process.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Button className="px-8 py-6 text-lg bg-gradient-to-r from-pink-500 to-teal-400 hover:from-pink-600 hover:to-teal-500">
          Start Your Certification Journey
        </Button>
      </div>
    </div>
  )
}
