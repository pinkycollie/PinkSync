import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, FileText, MessageSquare, ShieldCheck, UserCheck, Menu } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <header className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image
            src="/placeholder-e1neh.png"
            alt="VisualDesk Logo"
            width={32}
            height={32}
            className="rounded-lg md:w-10 md:h-10"
          />
          <h1 className="text-xl md:text-2xl font-bold text-rose-600">VisualDesk</h1>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex gap-6">
          <Link href="#features" className="text-gray-700 hover:text-rose-600 transition">
            Features
          </Link>
          <Link href="#how-it-works" className="text-gray-700 hover:text-rose-600 transition">
            How It Works
          </Link>
          <Link href="#security" className="text-gray-700 hover:text-rose-600 transition">
            Security
          </Link>
        </nav>

        {/* Desktop buttons */}
        <div className="hidden md:flex gap-3">
          <Button variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50">
            Sign In
          </Button>
          <Button className="bg-rose-600 hover:bg-rose-700">Get Started</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="text-center max-w-4xl mx-auto mb-12 md:mb-16 px-4">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 text-gray-900 leading-tight">
            AI-Powered Virtual Assistant for Deaf Users
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-700 mb-6 md:mb-8 italic px-2">
            "We do it for you — from form to finish, with zero confusion."
          </p>
          <div className="flex flex-col gap-3 md:flex-row md:gap-4 justify-center px-4">
            <Button size="lg" className="bg-rose-600 hover:bg-rose-700 w-full md:w-auto">
              Try VisualDesk Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-rose-200 w-full md:w-auto">
              Watch Demo
            </Button>
          </div>
        </section>

        <section
          id="features"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16 px-4"
        >
          <Card className="border-rose-100">
            <CardHeader>
              <FileText className="h-10 w-10 text-rose-500 mb-2" />
              <CardTitle>Automated Form Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                AI reads, understands, and fills out complex healthcare and financial forms automatically.
              </p>
            </CardContent>
          </Card>

          <Card className="border-rose-100">
            <CardHeader>
              <MessageSquare className="h-10 w-10 text-rose-500 mb-2" />
              <CardTitle>Seamless Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Handles communications with providers via secure digital channels with visual-first interfaces.
              </p>
            </CardContent>
          </Card>

          <Card className="border-rose-100">
            <CardHeader>
              <ShieldCheck className="h-10 w-10 text-rose-500 mb-2" />
              <CardTitle>PinkSync VCode</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Secure verification system for digital consent and signatures without paper forms.
              </p>
            </CardContent>
          </Card>

          <Card className="border-rose-100">
            <CardHeader>
              <UserCheck className="h-10 w-10 text-rose-500 mb-2" />
              <CardTitle>3D Avatar Interpreters</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Personalized, secure 3D avatar interpreters for consistent communication experience.
              </p>
            </CardContent>
          </Card>
        </section>

        <section id="how-it-works" className="mb-12 md:mb-16 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-10 text-gray-900">
            How VisualDesk Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <div className="bg-rose-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-rose-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Does the Heavy Lifting</h3>
              <p className="text-gray-600">
                Our AI handles complex forms, communications, and explains everything clearly with visuals.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-rose-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-rose-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Minimal Human Intervention</h3>
              <p className="text-gray-600">
                Only when necessary, connect with Deaf-friendly support via 3D avatar or video.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-rose-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-rose-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Verification</h3>
              <p className="text-gray-600">
                Confirm decisions with your personalized PinkSync VCode for legal and secure verification.
              </p>
            </div>
          </div>
        </section>

        <section id="security" className="bg-rose-50 rounded-2xl p-8 mb-16">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Security & Privacy First</h2>
              <p className="text-gray-700 mb-4">
                VisualDesk prioritizes your security and privacy with end-to-end encryption, secure verification, and
                strict access controls.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="h-5 w-5 text-rose-600 mt-1 flex-shrink-0" />
                  <span>End-to-end encrypted communications</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="h-5 w-5 text-rose-600 mt-1 flex-shrink-0" />
                  <span>HIPAA and financial regulation compliant</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="h-5 w-5 text-rose-600 mt-1 flex-shrink-0" />
                  <span>Personalized access controls for interpreters</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <Image
                src="/placeholder-3i5fh.png"
                alt="Security Visualization"
                width={400}
                height={300}
                className="rounded-lg"
              />
            </div>
          </div>
        </section>

        <section className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Ready to Experience VisualDesk?</h2>
          <p className="text-gray-700 mb-8">Join the future of accessible, AI-powered assistance for Deaf users.</p>
          <Button size="lg" className="bg-rose-600 hover:bg-rose-700">
            Get Started Today
          </Button>
        </section>
      </main>

      <footer className="bg-gray-50 py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Image src="/placeholder-e1neh.png" alt="VisualDesk Logo" width={32} height={32} className="rounded-lg" />
              <span className="text-xl font-bold text-rose-600">VisualDesk</span>
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-gray-600 hover:text-rose-600">
                Terms
              </Link>
              <Link href="#" className="text-gray-600 hover:text-rose-600">
                Privacy
              </Link>
              <Link href="#" className="text-gray-600 hover:text-rose-600">
                Contact
              </Link>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} VisualDesk by PinkSync. All rights reserved.</p>
            <p className="mt-1">Part of the MBTQ Ecosystem</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
