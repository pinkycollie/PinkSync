"use server"

import type { FormRequest } from "@/lib/types"

/**
 * Creates a new form request
 */
export async function createFormRequest(formType: string, provider: string, formData: any): Promise<FormRequest> {
  // In a real implementation, this would save to a database
  // For demo purposes, we're returning a mock response

  const newFormRequest: FormRequest = {
    id: `form_${Date.now()}`,
    userId: "user_123", // In a real app, this would come from the authenticated user
    formType,
    provider,
    status: "pending",
    progress: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    formData,
  }

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return newFormRequest
}

/**
 * Gets a form request by ID
 */
export async function getFormRequest(formId: string): Promise<FormRequest | null> {
  // In a real implementation, this would fetch from a database
  // For demo purposes, we're returning a mock response

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Mock form request
  if (formId === "mock_form_1") {
    return {
      id: "mock_form_1",
      userId: "user_123",
      formType: "Health Insurance Claim",
      provider: "BlueCross",
      status: "processing",
      progress: 65,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updatedAt: new Date().toISOString(),
      formData: {
        patientName: "Jane Doe",
        policyNumber: "BC12345678",
        serviceDate: "2023-04-15",
      },
    }
  }

  return null
}

/**
 * Updates a form request
 */
export async function updateFormRequest(formId: string, updates: Partial<FormRequest>): Promise<FormRequest> {
  // In a real implementation, this would update a database record
  // For demo purposes, we're returning a mock response

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  // Mock updated form
  return {
    id: formId,
    userId: "user_123",
    formType: "Health Insurance Claim",
    provider: "BlueCross",
    status: updates.status || "processing",
    progress: updates.progress || 75,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date().toISOString(),
    formData: updates.formData || {
      patientName: "Jane Doe",
      policyNumber: "BC12345678",
      serviceDate: "2023-04-15",
    },
    processedData: updates.processedData,
  }
}

/**
 * Gets all form requests for a user
 */
export async function getUserFormRequests(): Promise<FormRequest[]> {
  // In a real implementation, this would fetch from a database
  // For demo purposes, we're returning mock data

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Mock form requests
  return [
    {
      id: "form_1",
      userId: "user_123",
      formType: "Health Insurance Claim",
      provider: "BlueCross",
      status: "processing",
      progress: 85,
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      updatedAt: new Date().toISOString(),
      formData: {
        patientName: "Jane Doe",
        policyNumber: "BC12345678",
      },
    },
    {
      id: "form_2",
      userId: "user_123",
      formType: "Mortgage Application",
      provider: "First National Bank",
      status: "completed",
      progress: 100,
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      formData: {
        applicantName: "Jane Doe",
        loanAmount: 250000,
      },
    },
    {
      id: "form_3",
      userId: "user_123",
      formType: "Tax Return Form",
      provider: "IRS",
      status: "needs_info",
      progress: 30,
      createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      updatedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      formData: {
        taxpayerName: "Jane Doe",
        taxYear: 2023,
      },
    },
  ]
}
