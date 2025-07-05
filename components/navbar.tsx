"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { signOut } from "@/lib/auth"

export function Navbar() {
  const pathname = usePathname()

  // This would typically come from a server component or context
  // For demo purposes, we'll consider the user logged in if not on auth pages
  const isLoggedIn = !pathname.includes("/auth/")

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-pink-500">PinkSync</span>
          </Link>

          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-pink-500 ${
                pathname === "/" ? "text-pink-500" : "text-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/features"
              className={`text-sm font-medium transition-colors hover:text-pink-500 ${
                pathname === "/features" ? "text-pink-500" : "text-foreground"
              }`}
            >
              Features
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-pink-500 ${
                pathname === "/about" ? "text-pink-500" : "text-foreground"
              }`}
            >
              About
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <form action={signOut}>
              <Button variant="ghost" size="sm" className="gap-2">
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </form>
          ) : (
            <>
              <Link href="/auth/sign-in">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="bg-pink-500 hover:bg-pink-600">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
