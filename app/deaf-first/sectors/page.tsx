import { SectorImplementation } from "@/components/deaf-first/sector-implementation"
import { CrossSectorImplementation } from "@/components/deaf-first/cross-sector-implementation"
import { CertificationProgram } from "@/components/deaf-first/certification-program"

export default function DeafFirstSectorsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-teal-400">
          DEAF FIRST Sector Implementation
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Comprehensive strategies for implementing DEAF FIRST principles across key sectors
        </p>
      </div>

      <div className="space-y-16">
        <section>
          <SectorImplementation />
        </section>

        <section>
          <CrossSectorImplementation />
        </section>

        <section>
          <CertificationProgram />
        </section>

        <section className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Organization?</h2>
          <p className="text-gray-600 mb-6">
            Our team can help you implement these DEAF FIRST strategies in your specific context.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-teal-400 text-white font-medium hover:from-pink-600 hover:to-teal-500 transition-all">
              Request Consultation
            </button>
            <a
              href="/deaf-first/checklists"
              className="px-6 py-3 rounded-lg border border-gray-300 hover:border-gray-400 transition-all text-center"
            >
              Download Implementation Checklists
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
