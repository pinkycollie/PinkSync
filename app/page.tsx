import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, FileText, Shield, Video } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-pink-600 mb-4">vCode API</h1>
          <p className="text-xl text-gray-600 mb-6">Video-Coded Accessibility Ledger</p>
          <Badge variant="outline" className="text-sm">
            v2.0.0 • vcode.pinksync.io
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-blue-500" />
                Sign Language Processing
              </CardTitle>
              <CardDescription>
                Secure video capture and AI-powered transformation of sign language content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1">
                <li>• ASL, BSL, and ISL support</li>
                <li>• Real-time processing</li>
                <li>• Structured data extraction</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                Auditable Verification
              </CardTitle>
              <CardDescription>
                Complete audit trail with cryptographic verification of all interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1">
                <li>• Immutable audit logs</li>
                <li>• Error correction tracking</li>
                <li>• Trust verification</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-500" />
                Document Integration
              </CardTitle>
              <CardDescription>Embed vCodes in documents for verifiable sign language consent</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1">
                <li>• PDF embedding</li>
                <li>• QR code generation</li>
                <li>• Legal compliance</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-orange-500" />
                Partner Integration
              </CardTitle>
              <CardDescription>RESTful API designed for healthcare, legal, and financial partners</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1">
                <li>• JWT authentication</li>
                <li>• Visual feedback system</li>
                <li>• Comprehensive documentation</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Get Started</h2>
          <p className="text-gray-600">Ready to integrate sign language accessibility into your application?</p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <a href="https://developers.pinksync.io/vcode" target="_blank" rel="noopener noreferrer">
                <FileText className="mr-2 h-4 w-4" />
                API Documentation
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/api/health" target="_blank" rel="noopener noreferrer">
                <Shield className="mr-2 h-4 w-4" />
                Service Health
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-12 p-6 bg-pink-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2">One Layer, One Accessibility</h3>
          <p className="text-gray-700">
            The vCode API is part of the PinkSync Ecosystem, designed to ensure universal accessibility for Deaf
            individuals across all digital platforms and services.
          </p>
        </div>
      </div>
    </div>
  )
}
