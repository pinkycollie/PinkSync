import { kv } from "@vercel/kv"
import { getSession, signIn as baseSignIn, signUp as baseSignUp } from "./auth"
import type { User, AuthError } from "./types"

// VR Client specific user profile
export interface VRClientProfile {
  clientId: string
  counselorId?: string
  state: string
  fundingStatus: "pending" | "approved" | "denied" | "partial"
  employmentGoal: "job-placement" | "self-employment" | "education" | "other"
  accommodations: string[]
  fundingRequests: {
    id: string
    name: string
    amount: number
    status: "pending" | "approved" | "denied"
    category: string
  }[]
  documents: {
    id: string
    name: string
    type: string
    uploadDate: number
    status: "pending" | "approved" | "rejected"
  }[]
}

/**
 * Get the VR client profile for the current user
 */
export async function getVRClientProfile(): Promise<VRClientProfile | null> {
  const session = await getSession()
  if (!session) return null

  try {
    const profile = await kv.get<VRClientProfile>(`vr-client:${session.user.id}`)
    return profile
  } catch (error) {
    console.error("Error fetching VR client profile:", error)
    return null
  }
}

/**
 * Sign in as a VR client
 */
export async function signInVRClient(
  credentials: { email: string; password: string },
  options?: { redirectTo?: string },
): Promise<{ success: boolean; error?: AuthError; user?: User; profile?: VRClientProfile }> {
  const result = await baseSignIn(credentials, options)

  if (!result.success || !result.user) {
    return result
  }

  // Fetch the VR client profile
  const profile = await getVRClientProfile()

  return {
    ...result,
    profile: profile || undefined,
  }
}

/**
 * Sign up as a VR client
 */
export async function signUpVRClient(
  userData: {
    email: string
    password: string
    name: string
    preferredSignLanguage?: "ASL" | "BSL" | "ISL" | "Other"
    requiresVisualFeedback?: boolean
    state: string
    employmentGoal: "job-placement" | "self-employment" | "education" | "other"
    accommodations?: string[]
  },
  options?: { redirectTo?: string },
): Promise<{ success: boolean; error?: AuthError; user?: User; profile?: VRClientProfile }> {
  // Create the base user account
  const result = await baseSignUp(
    {
      email: userData.email,
      password: userData.password,
      name: userData.name,
      preferredSignLanguage: userData.preferredSignLanguage,
      requiresVisualFeedback: userData.requiresVisualFeedback,
    },
    options,
  )

  if (!result.success || !result.user) {
    return result
  }

  // Create the VR client profile
  const profile: VRClientProfile = {
    clientId: `VR-${result.user.id.substring(0, 8).toUpperCase()}`,
    state: userData.state,
    fundingStatus: "pending",
    employmentGoal: userData.employmentGoal,
    accommodations: userData.accommodations || [],
    fundingRequests: [],
    documents: [],
  }

  // Store the profile
  await kv.set(`vr-client:${result.user.id}`, profile)

  return {
    ...result,
    profile,
  }
}

/**
 * Update the VR client profile
 */
export async function updateVRClientProfile(
  updates: Partial<VRClientProfile>,
): Promise<{ success: boolean; profile?: VRClientProfile; error?: string }> {
  const session = await getSession()
  if (!session) {
    return { success: false, error: "Not authenticated" }
  }

  try {
    // Get the current profile
    const currentProfile = await getVRClientProfile()
    if (!currentProfile) {
      return { success: false, error: "Profile not found" }
    }

    // Update the profile
    const updatedProfile: VRClientProfile = {
      ...currentProfile,
      ...updates,
      // Preserve the clientId
      clientId: currentProfile.clientId,
    }

    // Store the updated profile
    await kv.set(`vr-client:${session.user.id}`, updatedProfile)

    return { success: true, profile: updatedProfile }
  } catch (error) {
    console.error("Error updating VR client profile:", error)
    return { success: false, error: "Failed to update profile" }
  }
}

/**
 * Add a funding request to the VR client profile
 */
export async function addFundingRequest(
  request: Omit<VRClientProfile["fundingRequests"][0], "id" | "status">,
): Promise<{ success: boolean; request?: VRClientProfile["fundingRequests"][0]; error?: string }> {
  const session = await getSession()
  if (!session) {
    return { success: false, error: "Not authenticated" }
  }

  try {
    // Get the current profile
    const profile = await getVRClientProfile()
    if (!profile) {
      return { success: false, error: "Profile not found" }
    }

    // Create the new request
    const newRequest = {
      ...request,
      id: `req-${Date.now().toString(36)}`,
      status: "pending" as const,
    }

    // Add the request to the profile
    profile.fundingRequests.push(newRequest)

    // Store the updated profile
    await kv.set(`vr-client:${session.user.id}`, profile)

    return { success: true, request: newRequest }
  } catch (error) {
    console.error("Error adding funding request:", error)
    return { success: false, error: "Failed to add funding request" }
  }
}

/**
 * Upload a document to the VR client profile
 */
export async function addDocument(document: { name: string; type: string; blobUrl: string }): Promise<{
  success: boolean
  document?: VRClientProfile["documents"][0]
  error?: string
}> {
  const session = await getSession()
  if (!session) {
    return { success: false, error: "Not authenticated" }
  }

  try {
    // Get the current profile
    const profile = await getVRClientProfile()
    if (!profile) {
      return { success: false, error: "Profile not found" }
    }

    // Create the new document
    const newDocument = {
      id: `doc-${Date.now().toString(36)}`,
      name: document.name,
      type: document.type,
      uploadDate: Date.now(),
      status: "pending" as const,
    }

    // Add the document to the profile
    profile.documents.push(newDocument)

    // Store the updated profile
    await kv.set(`vr-client:${session.user.id}`, profile)

    // Store the document blob URL separately
    await kv.set(`vr-document:${newDocument.id}`, {
      blobUrl: document.blobUrl,
      userId: session.user.id,
    })

    return { success: true, document: newDocument }
  } catch (error) {
    console.error("Error adding document:", error)
    return { success: false, error: "Failed to add document" }
  }
}
