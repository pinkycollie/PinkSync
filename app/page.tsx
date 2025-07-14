import { DashboardHeader } from "@/components/dashboard-header"
import { PinkSyncContent } from "@/components/pink-sync-content"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardHeader />
      <main className="flex-1 space-y-8 p-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">
            <PinkSyncContent priority={5} id="main-heading">
              PinkSync: Videoized Web Experience
            </PinkSyncContent>
          </h1>
          <p className="text-muted-foreground">
            <PinkSyncContent priority={4} id="main-description">
              Transform your web content into an accessible ASL video experience with PinkSync technology.
            </PinkSyncContent>
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">
              <PinkSyncContent priority={5} id="feature-1-title">
                Adaptive Modes
              </PinkSyncContent>
            </h2>
            <p>
              <PinkSyncContent priority={3} id="feature-1-desc">
                Choose from ambient, interactive, or immersive modes to customize how ASL videos appear on your site.
              </PinkSyncContent>
            </p>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">
              <PinkSyncContent priority={5} id="feature-2-title">
                Smart Preferences
              </PinkSyncContent>
            </h2>
            <p>
              <PinkSyncContent priority={3} id="feature-2-desc">
                Fine-tune video size, position, quality, and more to create the perfect experience for your users.
              </PinkSyncContent>
            </p>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">
              <PinkSyncContent priority={5} id="feature-3-title">
                Seamless Integration
              </PinkSyncContent>
            </h2>
            <p>
              <PinkSyncContent priority={3} id="feature-3-desc">
                Easily integrate PinkSync into any React or Next.js application with our comprehensive component
                library.
              </PinkSyncContent>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
