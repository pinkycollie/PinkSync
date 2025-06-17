import { DeafAuthProvider, DeafAuthLogin } from "@/components/deafauth-provider"

export default function AuthPage() {
  return (
    <DeafAuthProvider>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <DeafAuthLogin />
      </div>
    </DeafAuthProvider>
  )
}
