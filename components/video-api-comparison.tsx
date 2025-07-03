import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, DollarSign, Zap } from "lucide-react"

const videoAPIs = [
  {
    name: "GetStream Video",
    pricing: "$100/month free credit",
    deafFeatures: {
      customUI: true,
      lowLatency: true,
      gestureSupport: "Custom implementation",
      captioning: "Third-party integration",
      signLanguageOptimized: false,
    },
    pros: ["Excellent React SDK", "Global edge network", "Generous free tier", "Highly customizable"],
    cons: ["No built-in deaf features", "Requires custom development"],
    rating: 4,
    color: "blue",
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
    },
    pros: ["Built-in transcription", "Good free tier", "Easy integration", "Recording features"],
    cons: ["Limited customization", "No gesture recognition"],
    rating: 4,
    color: "green",
  },
  {
    name: "Agora.io",
    pricing: "10,000 minutes/month free",
    deafFeatures: {
      customUI: true,
      lowLatency: true,
      gestureSupport: "Custom implementation",
      captioning: "Extension available",
      signLanguageOptimized: false,
    },
    pros: ["Very low latency", "Global infrastructure", "AI extensions", "Good documentation"],
    cons: ["Complex setup", "No native deaf features"],
    rating: 4,
    color: "orange",
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
    },
    pros: ["Complete control", "No vendor lock-in", "Perfect for deaf customization", "Free"],
    cons: ["Complex implementation", "Requires infrastructure", "No managed service"],
    rating: 5,
    color: "purple",
  },
  {
    name: "Jitsi Meet",
    pricing: "Free (open source)",
    deafFeatures: {
      customUI: true,
      lowLatency: false,
      gestureSupport: "Custom implementation",
      captioning: "Plugin available",
      signLanguageOptimized: false,
    },
    pros: ["Open source", "Self-hostable", "Free", "Privacy focused"],
    cons: ["Higher latency", "Limited scalability", "Requires hosting"],
    rating: 3,
    color: "gray",
  },
]

export function VideoAPIComparison() {
  const getFeatureIcon = (supported: boolean | string) => {
    if (supported === true) return <CheckCircle className="h-4 w-4 text-green-500" />
    if (supported === false) return <XCircle className="h-4 w-4 text-red-500" />
    return <AlertCircle className="h-4 w-4 text-yellow-500" />
  }

  const getRatingStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating)
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Video APIs for Deaf-First Communication</h2>
        <p className="text-gray-600">Comparing video calling solutions for PinkSync's accessibility needs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {videoAPIs.map((api, index) => (
          <Card key={index} className={`border-2 border-${api.color}-200 hover:shadow-lg transition-shadow`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{api.name}</CardTitle>
                <Badge variant="outline" className={`bg-${api.color}-50 text-${api.color}-700`}>
                  {getRatingStars(api.rating)}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{api.pricing}</span>
              </div>
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
                    <span>Gesture Support</span>
                    {getFeatureIcon(typeof api.deafFeatures.gestureSupport === "string")}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Live Captions</span>
                    {getFeatureIcon(typeof api.deafFeatures.captioning === "string")}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sign Language Optimized</span>
                    {getFeatureIcon(api.deafFeatures.signLanguageOptimized)}
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

      {/* Recommendation */}
      <Card className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            Recommendation for PinkSync
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">For MVP/Prototype:</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>GetStream Video</strong> - Best balance of features, free tier, and React integration.
                $100/month free credit gives you plenty of room to build and test.
              </p>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Recommended for Development
              </Badge>
            </div>
            <div>
              <h4 className="font-semibold mb-2">For Production/Scale:</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>WebRTC Native</strong> - Complete control over deaf-specific features like gesture recognition,
                sign language optimization, and custom UI/UX.
              </p>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                Best for Deaf Customization
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
