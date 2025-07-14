import Link from "next/link"
import { Calculator, FileText, LineChart, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PinkSyncContent } from "@/components/pink-sync-content"

export function DomainCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Financial Domain Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Link
              href="https://deafva.mbtquniverse.com/financial"
              className="transition-colors hover:text-primary hover:underline"
              prefetch={true}
            >
              deafva.mbtquniverse.com/financial
            </Link>
          </CardTitle>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <PinkSyncContent priority={5} id="financial-title">
              Financial Planning
            </PinkSyncContent>
          </div>
          <p className="text-xs text-muted-foreground">
            <PinkSyncContent priority={4} id="financial-desc">
              Investment guidance, budget coaching, and document assistance
            </PinkSyncContent>
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <PinkSyncContent priority={3} id="financial-feature-1">
                Personalized financial advice
              </PinkSyncContent>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <PinkSyncContent priority={3} id="financial-feature-2">
                Visual budget tracking
              </PinkSyncContent>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <PinkSyncContent priority={3} id="financial-feature-3">
                ASL financial education
              </PinkSyncContent>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Insurance Domain Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Link
              href="https://deafva.mbtquniverse.com/insurance"
              className="transition-colors hover:text-primary hover:underline"
              prefetch={true}
            >
              deafva.mbtquniverse.com/insurance
            </Link>
          </CardTitle>
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <PinkSyncContent priority={5} id="insurance-title">
              Policy Management
            </PinkSyncContent>
          </div>
          <p className="text-xs text-muted-foreground">
            <PinkSyncContent priority={4} id="insurance-desc">
              Coverage explanations, claims assistance, and risk assessment
            </PinkSyncContent>
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              <PinkSyncContent priority={3} id="insurance-feature-1">
                Visual policy comparisons
              </PinkSyncContent>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              <PinkSyncContent priority={3} id="insurance-feature-2">
                Step-by-step claims guidance
              </PinkSyncContent>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              <PinkSyncContent priority={3} id="insurance-feature-3">
                Risk visualization tools
              </PinkSyncContent>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Tax Domain Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Link
              href="https://deafva.mbtquniverse.com/tax"
              className="transition-colors hover:text-primary hover:underline"
              prefetch={true}
            >
              deafva.mbtquniverse.com/tax
            </Link>
          </CardTitle>
          <Calculator className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <PinkSyncContent priority={5} id="tax-title">
              Tax Assistance
            </PinkSyncContent>
          </div>
          <p className="text-xs text-muted-foreground">
            <PinkSyncContent priority={4} id="tax-desc">
              Preparation guidance, deduction finding, and compliance assistance
            </PinkSyncContent>
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-500"></span>
              <PinkSyncContent priority={3} id="tax-feature-1">
                Visual tax preparation
              </PinkSyncContent>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-500"></span>
              <PinkSyncContent priority={3} id="tax-feature-2">
                Deduction opportunity alerts
              </PinkSyncContent>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-500"></span>
              <PinkSyncContent priority={3} id="tax-feature-3">
                Compliance deadline reminders
              </PinkSyncContent>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Development Domain Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Link
              href="https://deafva.mbtquniverse.com/dev"
              className="transition-colors hover:text-primary hover:underline"
              prefetch={true}
            >
              deafva.mbtquniverse.com/dev
            </Link>
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <PinkSyncContent priority={5} id="dev-title">
              Project Management
            </PinkSyncContent>
          </div>
          <p className="text-xs text-muted-foreground">
            <PinkSyncContent priority={4} id="dev-desc">
              Status tracking, requirements clarification, and testing assistance
            </PinkSyncContent>
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-500"></span>
              <PinkSyncContent priority={3} id="dev-feature-1">
                Visual project timelines
              </PinkSyncContent>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-500"></span>
              <PinkSyncContent priority={3} id="dev-feature-2">
                Requirements visualization
              </PinkSyncContent>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-500"></span>
              <PinkSyncContent priority={3} id="dev-feature-3">
                Interactive testing guides
              </PinkSyncContent>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
