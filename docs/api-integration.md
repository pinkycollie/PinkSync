# PinkSync API Integration Guide

## Overview

The PinkSync ecosystem consists of three main API services:

1. **DeafAuth** (`deafauth.pinksync.io`) - Authentication and user management
2. **PinkSync** (`api.pinksync.io`) - Core platform and accessibility features  
3. **FibonRose** (`fibonrose.mbtquniverse.com`) - Trust verification and badges

## Quick Start

### Installation

\`\`\`bash
npm install @pinksync/api-client
# or use the generated client in lib/api/
\`\`\`

### Basic Usage

\`\`\`typescript
import { pinkSyncAPI } from '@/lib/api/client'

// Set authentication token
pinkSyncAPI.setToken('your-jwt-token')

// Get current user
const userResponse = await pinkSyncAPI.getCurrentUser()
if (userResponse.status === 'success') {
  console.log('User:', userResponse.data)
}
\`\`\`

## Authentication Flow

### 1. User Registration

\`\`\`typescript
const signupResponse = await pinkSyncAPI.signup(
  'user@example.com',
  'securePassword123',
  'John Doe',
  {
    high_contrast: false,
    large_text: true,
    animation_reduction: false,
    vibration_feedback: true,
    sign_language: 'asl'
  }
)

if (signupResponse.status === 'success') {
  const { token, user } = signupResponse.data
  pinkSyncAPI.setToken(token)
  // Store token securely
}
\`\`\`

### 2. User Login

\`\`\`typescript
const loginResponse = await pinkSyncAPI.login('user@example.com', 'password')
if (loginResponse.status === 'success') {
  pinkSyncAPI.setToken(loginResponse.data.token)
}
\`\`\`

### 3. Token Verification

\`\`\`typescript
const verifyResponse = await pinkSyncAPI.verifyToken()
if (verifyResponse.status === 'success' && verifyResponse.data.valid) {
  // Token is valid, user is authenticated
}
\`\`\`

## Core Features

### Accessibility Preferences

\`\`\`typescript
// Get current preferences
const prefsResponse = await pinkSyncAPI.getAccessibilityPreferences()

// Update preferences
await pinkSyncAPI.updateAccessibilityPreferences({
  high_contrast: true,
  large_text: true,
  animation_reduction: true,
  vibration_feedback: true,
  sign_language: 'asl'
})
\`\`\`

### Video Management

\`\`\`typescript
// Upload video
const formData = new FormData()
formData.append('file', videoFile)
formData.append('title', 'My ASL Video')
formData.append('sign_language', 'asl')

const uploadResponse = await pinkSyncAPI.uploadVideo(formData)

// List user videos
const videosResponse = await pinkSyncAPI.listVideos({
  page: 1,
  limit: 10,
  status: 'ready'
})
\`\`\`

### Trust Verification

\`\`\`typescript
// Submit verification
const verificationData = new FormData()
verificationData.append('type', 'deaf_creator')
verificationData.append('documents', documentFile)

const verificationResponse = await pinkSyncAPI.submitVerification(verificationData)

// Check credibility score
const scoreResponse = await pinkSyncAPI.getCredibilityScore()
if (scoreResponse.status === 'success') {
  const { score, badges, verified } = scoreResponse.data
}
\`\`\`

## Visual Feedback System

All API responses include visual feedback designed for deaf users:

\`\`\`typescript
interface VisualFeedback {
  icon: string        // Icon name (e.g., 'success', 'error', 'loading')
  color: string       // Color code (e.g., 'green', 'red', 'blue')
  animation: string   // Animation type (e.g., 'fade', 'pulse', 'shake')
  vibration: boolean  // Whether to trigger haptic feedback
}
\`\`\`

### Implementing Visual Feedback

\`\`\`typescript
const response = await pinkSyncAPI.login(email, password)

if (response.visual_feedback) {
  const { icon, color, animation, vibration } = response.visual_feedback
  
  // Show visual indicator
  showIcon(icon, color, animation)
  
  // Trigger haptic feedback if supported
  if (vibration && 'vibrate' in navigator) {
    navigator.vibrate(200)
  }
}
\`\`\`

## Error Handling

\`\`\`typescript
try {
  const response = await pinkSyncAPI.getCurrentUser()
  
  if (response.status === 'error') {
    // Handle API error
    console.error('API Error:', response.message)
    
    // Show visual feedback
    if (response.visual_feedback) {
      showErrorFeedback(response.visual_feedback)
    }
  }
} catch (error) {
  // Handle network/client error
  console.error('Network Error:', error)
}
\`\`\`

## Environment Configuration

\`\`\`env
# API Endpoints
NEXT_PUBLIC_PINKSYNC_API_URL=https://api.pinksync.io/v2
NEXT_PUBLIC_DEAFAUTH_API_URL=https://deafauth.pinksync.io/v1
NEXT_PUBLIC_FIBONROSE_API_URL=https://fibonrose.mbtquniverse.com/v1

# API Keys (server-side only)
PINKSYNC_API_KEY=your-api-key
DEAFAUTH_API_KEY=your-deafauth-key
FIBONROSE_API_KEY=your-fibonrose-key
\`\`\`

## React Hooks Integration

\`\`\`typescript
// Custom hook for API integration
import { useState, useEffect } from 'react'
import { pinkSyncAPI } from '@/lib/api/client'

export function useCurrentUser() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await pinkSyncAPI.getCurrentUser()
        if (response.status === 'success') {
          setUser(response.data)
        } else {
          setError(response.message)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading, error }
}
\`\`\`

## Testing

\`\`\`typescript
// Mock API responses for testing
import { jest } from '@jest/globals'

jest.mock('@/lib/api/client', () => ({
  pinkSyncAPI: {
    getCurrentUser: jest.fn().mockResolvedValue({
      status: 'success',
      data: {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User'
      }
    })
  }
}))
\`\`\`

## Rate Limiting

The API implements rate limiting:
- Authentication endpoints: 5 requests per minute
- Video upload: 10 uploads per hour
- General endpoints: 100 requests per minute

Handle rate limiting gracefully:

\`\`\`typescript
const response = await pinkSyncAPI.getCurrentUser()
if (response.status === 'error' && response.code === 'rate_limit_exceeded') {
  // Show rate limit message with visual feedback
  showRateLimitWarning(response.visual_feedback)
}
