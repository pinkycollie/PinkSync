import PinkSyncDemo from "@/components/pinksync-demo"

export default function PinkSyncPage() {
  return (
    <div className="py-12 px-6 md:px-20 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">PinkSync AI</h1>
      <p className="text-gray-600 mb-8">
        PinkSync AI is a Layer 1 accessibility protocol designed to transform enterprise and government interfaces into
        deaf-friendly experiences. This demo showcases how PinkSync can simplify complex vocational rehabilitation
        content and provide visual alternatives to audio-based information.
      </p>

      <PinkSyncDemo />

      <div className="mt-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">About PinkSync AI</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium mb-2">Key Features</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                • <strong>deafAuth Authentication</strong> - Visual verification methods instead of audio CAPTCHAs
              </li>
              <li>
                • <strong>Interface Transformation Engine</strong> - Simplifies complex text while preserving meaning
              </li>
              <li>
                • <strong>HTMX Integration Layer</strong> - Enables seamless client-side transformations
              </li>
              <li>
                • <strong>Persistent Accessibility Profiles</strong> - User preferences follow across systems
              </li>
              <li>
                • <strong>Enterprise API Integration</strong> - Connects with corporate HR and government systems
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Benefits</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                • <strong>Improved Accessibility</strong> - Makes complex systems accessible to deaf users
              </li>
              <li>
                • <strong>Workforce Automation</strong> - Streamlines vocational rehabilitation processes
              </li>
              <li>
                • <strong>Compliance</strong> - Helps organizations meet accessibility requirements
              </li>
              <li>
                • <strong>Seamless Integration</strong> - Works with existing systems without major changes
              </li>
              <li>
                • <strong>Personalized Experience</strong> - Adapts to individual user preferences
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 p-4 bg-pink-50 border border-pink-200 rounded-md">
          <p className="text-gray-700">
            <strong>Enterprise & Government Integration:</strong> PinkSync AI is designed to integrate with existing
            workforce systems, vocational rehabilitation platforms, and corporate HR tools to provide seamless
            accessibility for deaf users without requiring complete system overhauls.
          </p>
        </div>
      </div>
    </div>
  )
}
