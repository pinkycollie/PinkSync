import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import Image from "next/image"

export default function VCodePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 md:py-8 pb-20 md:pb-8">
        <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-rose-600 transition mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="max-w-sm md:max-w-md mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <div className="bg-rose-100 h-16 w-16 md:h-20 md:w-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 md:h-10 md:w-10 text-rose-600" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">PinkSync VCode Verification</h1>
            <p className="text-sm md:text-base text-gray-600 px-4">
              Securely verify your identity to authorize this action
            </p>
          </div>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg md:text-xl">Enter Your VCode</CardTitle>
              <CardDescription className="text-sm">
                We've sent a 6-digit verification code to your registered device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vcode">Verification Code</Label>
                <Input
                  id="vcode"
                  placeholder="Enter 6-digit code"
                  className="text-center text-lg md:text-xl tracking-widest h-12 md:h-14"
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </div>

              <div className="pt-2">
                <p className="text-sm text-gray-500 mb-1">Verifying action:</p>
                <div className="bg-gray-100 p-3 rounded-md">
                  <p className="font-medium text-sm">Submit Health Insurance Claim Form</p>
                  <p className="text-xs text-gray-500">Provider: BlueCross</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3 md:space-y-4">
              <Button className="w-full bg-rose-600 hover:bg-rose-700 h-12">Verify Identity</Button>
              <Button variant="link" className="text-gray-500 text-sm">
                Resend Code
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-6 md:mt-8 text-center">
            <h3 className="font-medium mb-4 text-sm md:text-base">What is PinkSync VCode?</h3>
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div className="flex flex-col items-center">
                <div className="bg-rose-50 h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center mb-2">
                  <Shield className="h-5 w-5 md:h-6 md:w-6 text-rose-500" />
                </div>
                <p className="text-xs text-gray-600 text-center">Secure Identity Verification</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-rose-50 h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-rose-500" />
                </div>
                <p className="text-xs text-gray-600 text-center">Legal Digital Consent</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-rose-50 h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center mb-2">
                  <Image
                    src="/placeholder.svg?height=20&width=20"
                    alt="Privacy"
                    width={20}
                    height={20}
                    className="md:w-6 md:h-6"
                  />
                </div>
                <p className="text-xs text-gray-600 text-center">Privacy Protection</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
