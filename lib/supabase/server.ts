import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // The `cookies().set()` method can only be called in a Server Component or Route Handler.
          // This error is typically caused by an attempt to set a cookie from a Client Component
          // that rendered a Server Component that set a cookie.
          // For example, if you have a Server Component that sets a cookie and it's rendered by a Client Component,
          // you'll get this error.
          // To fix this, ensure that any cookie-setting logic is within a Server Component or Route Handler.
          console.warn("Failed to set cookie:", error)
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          console.warn("Failed to remove cookie:", error)
        }
      },
    },
  })
}
