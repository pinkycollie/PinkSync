import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { createClient } from "@/lib/supabase/server"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) {
        return false
      }

      const supabase = createClient()

      try {
        // Check if user exists in your custom users table
        const { data: existingUser, error: selectError } = await supabase
          .from("users")
          .select("*")
          .eq("email", user.email)
          .single()

        if (selectError && selectError.code !== "PGRST116") {
          console.error("Error checking existing user:", selectError)
          return true // Still allow sign in
        }

        if (!existingUser) {
          // Create new user in your custom users table
          const { error: insertError } = await supabase.from("users").insert({
            email: user.email,
            name: user.name,
            // Set default preferences for new users
            preferences: {
              high_contrast: false,
              large_text: false,
              animation_reduction: false,
              vibration_feedback: true,
              sign_language: "asl",
            },
            roles: ["user"],
            is_deaf: false, // User can update this later
            verification_status: "pending",
          })

          if (insertError) {
            console.error("Error creating new user:", insertError)
            return true // Still allow sign in
          }
        }

        return true
      } catch (error) {
        console.error("Unexpected error during sign in:", error)
        return true
      }
    },
    async session({ session, token }) {
      try {
        if (session.user) {
          const supabase = createClient()

          // Get user data from your custom users table
          if (session.user.email) {
            const { data: dbUser, error } = await supabase
              .from("users")
              .select("id, roles, is_deaf, preferred_sign_language, verification_status, preferences")
              .eq("email", session.user.email)
              .single()

            if (error && error.code !== "PGRST116") {
              console.error("Error getting user session data:", error)
            }

            if (dbUser) {
              session.user.id = dbUser.id
              session.user.roles = dbUser.roles
              session.user.isDeaf = dbUser.is_deaf
              session.user.preferredSignLanguage = dbUser.preferred_sign_language
              session.user.verificationStatus = dbUser.verification_status
              session.user.preferences = dbUser.preferences
            }
          }
        }
      } catch (error) {
        console.error("Unexpected error getting user session data:", error)
      }

      return session
    },
    async jwt({ token, user }) {
      return token
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt" as const,
  },
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
