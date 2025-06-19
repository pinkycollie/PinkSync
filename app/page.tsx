import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center border-b px-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-pink-500"></div>
          <span className="text-xl font-bold">PinkSYNC</span>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">PinkSYNC Mission Control</h1>
        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
          A comprehensive management platform designed to oversee and control all aspects of Pinky AI operations through
          a unified, visual-first interface, with a primary focus on deaf-first accessibility.
        </p>
        <div className="mt-8 flex gap-4">
          <Button asChild size="lg">
            <Link href="/dashboard">Enter Mission Control</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </main>
      <footer className="border-t p-6 text-center text-sm text-muted-foreground">
        MBTQ GROUP Proprietary - All rights reserved
      </footer>
    </div>
  )
}
