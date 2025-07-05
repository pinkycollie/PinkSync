import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
        <span className="text-pink-500">PinkSync</span> - One Layer, One Accessibility
      </h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-3xl">
        The data + AI engine powering real-time sync across apps, APIs, and platforms. Central to ensuring universal
        Deaf accessibility across all tools.
      </p>
      <div className="flex gap-4 mt-10">
        <Link href="/auth/register">
          <Button size="lg" className="bg-pink-500 hover:bg-pink-600">
            Get Started
          </Button>
        </Link>
        <Link href="/features">
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </Link>
      </div>
    </div>
  )
}
