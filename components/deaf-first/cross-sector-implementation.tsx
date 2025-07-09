import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Users, Cog, BookOpen, GraduationCap } from "lucide-react"

export function CrossSectorImplementation() {
  const implementationSteps = [
    {
      id: "policy",
      title: "Policy Commitment",
      icon: BookOpen,
      color: "text-pink-500",
      description:
        'Mandate "DEAF FIRST" as a core standard—not just a compliance checkbox—for all partner businesses, agencies, and services.',
      steps: [
        "Develop a formal DEAF FIRST policy document that outlines principles and requirements",
        "Integrate DEAF FIRST standards into all contracts, partnerships, and service agreements",
        "Create accountability mechanisms to ensure ongoing compliance",
        "Establish regular policy review processes with Deaf community input",
      ],
    },
    {
      id: "technology",
      title: "Technology Integration",
      icon: Cog,
      color: "text-teal-500",
      description:
        "Use web platforms, blockchain (for proof/records), and accessible design—ensure all digital and physical infrastructure are inclusively built.",
      steps: [
        "Audit all digital platforms for ASL accessibility and implement necessary changes",
        "Integrate blockchain verification for important documents and agreements",
        "Implement multi-modal notification systems (visual, haptic) across all platforms",
        "Develop ASL video integration capabilities for all customer-facing systems",
      ],
    },
    {
      id: "advisory",
      title: "Community Advisory",
      icon: Users,
      color: "text-pink-500",
      description:
        "Involve Deaf professionals at every stage—from planning to evaluation—to guarantee solutions are relevant and effective.",
      steps: [
        "Establish a Deaf Advisory Board with representation across expertise areas",
        "Implement regular feedback mechanisms from the Deaf community",
        "Hire Deaf professionals in leadership and decision-making roles",
        "Create transparent reporting on how Deaf input shapes policies and implementations",
      ],
    },
    {
      id: "training",
      title: "Ongoing Training",
      icon: GraduationCap,
      color: "text-teal-500",
      description:
        "Regularly train staff—medical, legal, financial, real estate—in ASL basics and Deaf culture to foster true inclusion beyond technology.",
      steps: [
        "Develop comprehensive Deaf cultural competence training for all staff",
        "Provide basic ASL training for customer-facing employees",
        "Create sector-specific training modules for specialized vocabulary",
        "Implement regular refresher courses and advanced training opportunities",
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Cross-Sector Implementation Steps</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          These foundational steps apply across all sectors to ensure comprehensive DEAF FIRST implementation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {implementationSteps.map((step) => (
          <Card key={step.id}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${step.color}`}>
                <step.icon className="h-5 w-5" />
                {step.title}
              </CardTitle>
              <CardDescription>{step.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {step.steps.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className={`h-4 w-4 mt-1 ${step.color}`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
