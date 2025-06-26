"use server"

import type { VCodeVerification } from "@/lib/types"

/**
 * Generates a new VCode for verification
 */
export async function generateVCode(userId: string, action: string): Promise<{ vcode: string; expiresAt: string }> {
  // In a real implementation, this would connect to the PinkSync VCode system
  // For demo purposes, we're generating a mock VCode

  // Generate a random 6-digit code
  const vcode = Math.floor(100000 + Math.random() * 900000).toString()

  // Set expiration to 10 minutes from now
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return { vcode, expiresAt }
}

/**
 * Verifies a VCode
 */
export async function verifyVCode(userId: string, vcode: string, action: string): Promise<VCodeVerification> {
  // In a real implementation, this would verify with the PinkSync VCode system
  // For demo purposes, we're simulating a verification

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Simple validation for demo - any 6-digit code is valid
  const isValid = vcode.length === 6 && /^\d+$/.test(vcode)

  const verification: VCodeVerification = {
    id: `verification_${Date.now()}`,
    userId,
    action,
    timestamp: new Date().toISOString(),
    success: isValid,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Valid for 24 hours
  }

  return verification
}

/**
 * Gets the verification status for a user
 */
export async function getVerificationStatus(userId: string): Promise<{ verified: boolean; lastVerification?: string }> {
  // In a real implementation, this would check the database
  // For demo purposes, we're returning mock data

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Mock verification status
  return {
    verified: true,
    lastVerification: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  }
}
