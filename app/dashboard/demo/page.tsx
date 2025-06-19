import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { AdaptiveContent } from "@/components/adaptive-content"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DemoPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">PinkSync Adaptive Demo</h1>
        <p className="text-muted-foreground mt-2">
          Experience how PinkSync adapts content based on your accessibility preferences
        </p>
      </div>

      {!session?.user ? (
        <div className="rounded-lg border p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Sign in to experience personalized content</h2>
          <p className="mb-4 text-muted-foreground">
            PinkSync adapts content based on your accessibility preferences. Sign in to set your preferences and see how
            content adapts to your needs.
          </p>
          <Button asChild>
            <Link href="/auth/signin?callbackUrl=/dashboard/demo">Sign In</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Adaptive Content Examples</h2>
            <Button asChild variant="outline">
              <Link href="/dashboard/preferences">Adjust Your Preferences</Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <AdaptiveContent
              contentId="demo-1"
              title="What is PinkSync?"
              textContent="PinkSync is a comprehensive platform designed to transform digital content into deaf-friendly experiences. It analyzes existing interfaces, videos, and applications to automatically generate accessible alternatives that prioritize visual communication.

The platform serves as a bridge between standard digital content and the deaf community, ensuring that information is presented in a way that is intuitive and accessible for deaf and hard-of-hearing users."
              signLanguageText="PinkSync helps make digital content accessible for deaf people. It changes regular websites and videos into formats that are easier for deaf people to use and understand."
            />

            <AdaptiveContent
              contentId="demo-2"
              title="How PinkSync Works"
              textContent="PinkSync uses advanced AI to analyze content and transform it into deaf-accessible formats. The process involves several steps:

1. Content Analysis: PinkSync scans the content to understand its structure and meaning.
2. Accessibility Evaluation: The system identifies areas that need improvement for deaf accessibility.
3. Transformation: Content is converted into deaf-friendly formats, including sign language videos, enhanced visual cues, and optimized captions.
4. Validation: Human experts review the transformed content to ensure quality and accuracy.
5. Distribution: The accessible content is delivered to users through various channels."
              signLanguageText="PinkSync uses AI to make content accessible for deaf people. It analyzes content, identifies accessibility issues, transforms it with sign language and visual elements, has humans check the quality, and then delivers it to users."
            />
          </div>

          <div className="rounded-lg border p-6 bg-muted/50 mt-8">
            <h3 className="text-lg font-semibold mb-2">How This Demo Works</h3>
            <p className="mb-4">
              This demo showcases PinkSync's ability to adapt content based on your accessibility preferences. Here's
              what's happening:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                The content adapts based on your preferences set in the{" "}
                <Link href="/dashboard/preferences" className="text-primary underline">
                  Accessibility Preferences
                </Link>{" "}
                page
              </li>
              <li>
                If you've selected sign language as your preferred communication method, sign language explanations will
                appear automatically
              </li>
              <li>Text size and contrast adjust based on your visual preferences</li>
              <li>
                PinkSync learns from your interactions - try clicking "Show Sign Language" a few times and then visit
                another page and return
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
