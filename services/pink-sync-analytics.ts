/**
 * PinkSync Analytics Service
 * Tracks PinkSync usage for analytics and optimization
 */

import type { PinkSyncMode, PinkSyncPreferences } from "@/lib/types/pink-sync"

interface PinkSyncEvent {
  eventType: string
  timestamp: number
  data: Record<string, any>
}

interface PinkSyncSession {
  sessionId: string
  startTime: number
  events: PinkSyncEvent[]
  mode: PinkSyncMode
  preferences: PinkSyncPreferences
}

class PinkSyncAnalytics {
  private currentSession: PinkSyncSession | null = null
  private endpoint: string | null = null
  private isEnabled = false
  private bufferSize = 10
  private flushInterval = 30000 // 30 seconds
  private flushTimer: NodeJS.Timeout | null = null

  /**
   * Initialize the analytics service
   */
  public initialize(endpoint: string): void {
    this.endpoint = endpoint
    this.isEnabled = true
    this.startSession()

    // Set up interval to flush events
    this.flushTimer = setInterval(() => this.flushEvents(), this.flushInterval)

    // Add event listener for page unload to flush events
    window.addEventListener("beforeunload", () => this.flushEvents())
  }

  /**
   * Start a new session
   */
  private startSession(): void {
    if (!this.isEnabled) return

    this.currentSession = {
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      events: [],
      mode: "off",
      preferences: {
        autoPlayVideos: true,
        showTextWithVideos: true,
        videoPriority: "essential",
        videoSize: "medium",
        videoPosition: "inline",
        videoQuality: "medium",
        signModel: "human",
      },
    }
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return "ps_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  /**
   * Track a PinkSync event
   */
  public trackEvent(eventType: string, data: Record<string, any> = {}): void {
    if (!this.isEnabled || !this.currentSession) return

    this.currentSession.events.push({
      eventType,
      timestamp: Date.now(),
      data,
    })

    // Flush events if buffer size is reached
    if (this.currentSession.events.length >= this.bufferSize) {
      this.flushEvents()
    }
  }

  /**
   * Update session mode and preferences
   */
  public updateSessionState(mode: PinkSyncMode, preferences: PinkSyncPreferences): void {
    if (!this.isEnabled || !this.currentSession) return

    this.currentSession.mode = mode
    this.currentSession.preferences = { ...preferences }

    this.trackEvent("ps_mode_change", { mode })
  }

  /**
   * Track video interaction
   */
  public trackVideoInteraction(
    contentId: string,
    action: "play" | "pause" | "expand" | "collapse" | "mute" | "unmute",
  ): void {
    this.trackEvent("ps_video_interaction", {
      contentId,
      action,
      mode: this.currentSession?.mode,
    })
  }

  /**
   * Track content visibility
   */
  public trackContentVisibility(contentId: string, isVisible: boolean, duration?: number): void {
    this.trackEvent("ps_content_visibility", {
      contentId,
      isVisible,
      duration,
    })
  }

  /**
   * Flush events to the endpoint
   */
  private flushEvents(): void {
    if (!this.isEnabled || !this.currentSession || !this.endpoint || this.currentSession.events.length === 0) return

    const eventsToSend = [...this.currentSession.events]
    this.currentSession.events = []

    const payload = {
      sessionId: this.currentSession.sessionId,
      sessionStartTime: this.currentSession.startTime,
      mode: this.currentSession.mode,
      preferences: this.currentSession.preferences,
      events: eventsToSend,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
    }

    // Send events to endpoint
    fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      // Use keepalive to ensure the request completes even if the page is unloading
      keepalive: true,
    }).catch((error) => {
      console.error("Error sending PinkSync analytics:", error)
      // Add events back to the queue if sending fails
      if (this.currentSession) {
        this.currentSession.events = [...this.currentSession.events, ...eventsToSend]
      }
    })
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
      this.flushTimer = null
    }

    this.flushEvents()
    this.isEnabled = false
    this.currentSession = null
  }
}

// Export a singleton instance
export const pinkSyncAnalytics = new PinkSyncAnalytics()

// Export the class for custom instances
export default PinkSyncAnalytics
