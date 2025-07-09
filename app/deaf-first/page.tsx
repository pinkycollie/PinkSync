import { CityInitiativeForm } from "@/components/deaf-first/city-initiative-form"
import { InitiativeDashboard } from "@/components/deaf-first/initiative-dashboard"

export default function DeafFirstPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-teal-400">
          DEAF FIRST Network
        </h1>
        <p className="text-xl text-gray-600 mb-8">Launch and manage DEAF FIRST initiatives across cities and sectors</p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-6">Launch New Initiative</h2>
          <CityInitiativeForm />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Initiatives Dashboard</h2>
          <InitiativeDashboard />
        </section>
      </div>
    </div>
  )
}
