import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, DollarSign, Star } from "lucide-react"

const videoAPIs = [
  {
    name: "Mux Video API",
    pricing: "$1/GB storage + $0.005/min streaming",
    deafFeatures: {
      customUI: true,
      lowLatency: true,
      gestureSupport: "Webhook integration",
      captioning: "Third-party integration",
      signLanguageOptimized: "Custom encoding",
      analytics: "Comprehensive",
      liveStreaming: true,
    },
    pros: [
      "Excellent video quality optimization",
      "Comprehensive analytics",
      "Webhook system for AI integration",
      "Global CDN",
      "Developer-friendly APIs",
    ],
    cons: ["Pay-per-use pricing", "No built-in deaf features", "Requires custom development"],
    rating: 5,
    color: "purple",
    bestFor: "Video processing & streaming",
  },
  {
    name: "GetStream Video",
    pricing: "$100/month free credit",
    deafFeatures: {
      customUI: true,
      lowLatency: true,
      gestureSupport: "Custom implementation",
      captioning: "Third-party integration",
      signLanguageOptimized: false,
      analytics: "Basic",
      liveStreaming: true,
    },
    pros: ["Excellent React SDK", "Global edge network", "Generous free tier", "Real-time features"],
    cons: ["No built-in deaf features", "Limited analytics"],
    rating: 4,
    color: "blue",
    bestFor: "Real-time video calls",
  },
  {
    name: "Daily.co",
    pricing: "10,000 minutes/month free",
    deafFeatures: {
      customUI: true,
      lowLatency: true,
      gestureSupport: "API available",
      captioning: "Built-in transcription",
      signLanguageOptimized: false,
      analytics: "Good",
      liveStreaming: false,
    },
    pros: ["Built-in transcription", "Good free tier", "Easy integration"],
    cons: ["Limited customization", "No live streaming"],
    rating: 4,
    color: "green",
    bestFor: "Video conferencing",
  },
  {
    name: "WebRTC (Native)",
    pricing: "Free (self-hosted)",
    deafFeatures: {
      customUI: true,
      lowLatency: true,
      gestureSupport: "Full control",
      captioning: "Custom implementation",
      signLanguageOptimized: true,
      analytics: "Custom",
      liveStreaming: true,
    },
    pros: ["Complete control", "Perfect for deaf customization", "No vendor lock-in"],
    cons: ["Complex implementation", "Requires infrastructure"],
    rating: 5,
    color: "orange",
    bestFor: "Maximum customization",
  },
]

export function VideoAPIComparisonWithMux() {
  const getFeatureIcon = (supported: boolean | string) => {
    if (supported === true || supported === "true") return <CheckCircle className="h-4 w-4 text-green-500" />
    if (supported === false || supported === "false") return <XCircle className="h-4 w-4 text-red-500" />
    return <AlertCircle className="h-4 w-4 text-yellow-500" />
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-3 w-3 ${i < rating ? "text-yellow-500 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Video APIs for PinkSync: Complete Comparison</h2>
        <p className="text-gray-600">Including Mux Video API for professional video processing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {videoAPIs.map((api, index) => (
          <Card key={index} className={`border-2 border-${api.color}-200 hover:shadow-lg transition-shadow`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{api.name}</CardTitle>
                <div className="flex items-center gap-1">{getRatingStars(api.rating)}</div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{api.pricing}</span>
              </div>
              <Badge variant="outline" className={`bg-${api.color}-50 text-${api.color}-700 w-fit`}>
                {api.bestFor}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Deaf-Specific Features */}
              <div>
                <h4 className="font-semibold mb-2 text-sm">Deaf Accessibility Features</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Custom UI</span>
                    {getFeatureIcon(api.deafFeatures.customUI)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Low Latency</span>
                    {getFeatureIcon(api.deafFeatures.lowLatency)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Live Streaming</span>
                    {getFeatureIcon(api.deafFeatures.liveStreaming)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Analytics</span>
                    <Badge variant="outline" className="text-xs">
                      {api.deafFeatures.analytics}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Pros */}
              <div>
                <h4 className="font-semibold mb-2 text-sm text-green-700">Pros</h4>
                <ul className="text-xs space-y-1">
                  {api.pros.map((pro, i) => (
                    <li key={i} className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div>
                <h4 className="font-semibold mb-2 text-sm text-red-700">Cons</h4>
                <ul className="text-xs space-y-1">
                  {api.cons.map((con, i) => (
                    <li key={i} className="flex items-center gap-1">
                      <XCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Updated Recommendation */}
      <Card className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-purple-600" />
            Updated Recommendation for PinkSync
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">For Video Processing:</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Mux Video API</strong> - Best for video upload, processing, and streaming with comprehensive
                analytics. Perfect for sign language video optimization.
              </p>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                Best for VOD & Processing
              </Badge>
            </div>
            <div>
              <h4 className="font-semibold mb-2">For Real-time Calls:</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>GetStream Video</strong> - Excellent for live video calls with React integration. $100/month
                free credit for development.
              </p>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Best for Live Calls
              </Badge>
            </div>
            <div>
              <h4 className="font-semibold mb-2">For Maximum Control:</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>WebRTC Native</strong> - Complete control over deaf-specific features. Use with Mux for video
                processing backend.
              </p>
              <Badge variant="outline" className="bg-orange-50 text-orange-700">
                Best for Customization
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
