"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// This is a mock implementation. In a real app, you would use a proper auth library
// like NextAuth.js, Clerk, or your own custom implementation with a database.

export async function register(formData: FormData) {
  // Simulate a delay to mimic a network request
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  // In a real implementation, you would:
  // 1. Validate the input
  // 2. Check if the user already exists
  // 3. Hash the password
  // 4. Create the user in the database
  // 5. Create a session

  // For now, we'll just set a cookie to simulate authentication
  cookies().set("auth-token", "mock-token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  return { success: true }
}

export async function signIn(formData: FormData) {
  // Simulate a delay to mimic a network request
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // In a real implementation, you would:
  // 1. Validate the input
  // 2. Check if the user exists
  // 3. Verify the password
  // 4. Create a session

  // For now, we'll just set a cookie to simulate authentication
  cookies().set("auth-token", "mock-token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  return { success: true }
}

export async function signOut() {
  // Delete the auth cookie
  cookies().delete("auth-token")

  // Redirect to the home page
  redirect("/")
}

export async function getSession() {
  const token = cookies().get("auth-token")

  if (!token) {
    return null
  }

  // In a real implementation, you would:
  // 1. Verify the token
  // 2. Fetch the user from the database

  // For now, we'll just return a mock user
  return {
    user: {
      id: "1",
      name: "Demo User",
      email: "user@example.com",
    },
  }
}
