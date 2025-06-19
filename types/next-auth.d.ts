declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      roles?: string[]
      isDeaf?: boolean
      preferredSignLanguage?: string
      verificationStatus?: string
      preferences?: Record<string, any>
    }
  }

  interface User {
    id: string
    roles?: string[]
    isDeaf?: boolean
    preferredSignLanguage?: string
    verificationStatus?: string
    preferences?: Record<string, any>
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles?: string[]
    isDeaf?: boolean
    preferredSignLanguage?: string
    verificationStatus?: string
    preferences?: Record<string, any>
  }
}
