import { createClient } from "@/lib/supabase/server"

export interface AuditEvent {
  event: string
  userId?: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

export async function logAuthEvent(event: AuditEvent): Promise<void> {
  try {
    const supabase = createClient()

    // Ensure all data is JSON serializable
    const safeDetails = event.details ? JSON.parse(JSON.stringify(event.details)) : {}

    // Create notification entry for audit logging
    const auditData = {
      user_id: event.userId || null,
      type: "audit_log",
      title: `Auth Event: ${event.event}`,
      message: `Authentication event occurred: ${event.event}`,
      data: {
        event: event.event,
        details: safeDetails,
        ip_address: event.ipAddress,
        user_agent: event.userAgent,
        timestamp: new Date().toISOString(),
      },
      read: false,
      visual_feedback: {
        icon: "shield",
        color: "blue",
        animation: "none",
        vibration: false,
      },
    }

    const { error } = await supabase.from("notifications").insert(auditData)

    if (error) {
      console.error("Error logging auth event to Supabase:", error)
      // Fallback to console logging
      console.log("Audit Event:", {
        event: event.event,
        userId: event.userId,
        details: safeDetails,
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error("Unexpected error in audit logger:", error)
    // Fallback to console logging
    console.log("Audit Event (fallback):", {
      event: event.event,
      userId: event.userId,
      timestamp: new Date().toISOString(),
    })
  }
}

export async function logSystemEvent(event: string, details?: Record<string, any>, userId?: string): Promise<void> {
  await logAuthEvent({
    event,
    userId,
    details,
  })
}
