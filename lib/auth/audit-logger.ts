import { createClient } from "@/lib/supabase/server"

interface AuditLogEvent {
  event: string
  userId?: string
  ipAddress?: string
  userAgent?: string
  details?: Record<string, any>
}

export async function logAuthEvent({ event, userId, ipAddress, userAgent, details }: AuditLogEvent) {
  const supabase = createClient()

  try {
    // Use the notifications table for audit logging with a specific type
    const { error } = await supabase.from("notifications").insert({
      user_id: userId,
      type: "audit_log",
      title: `Auth Event: ${event}`,
      message: `Authentication event occurred: ${event}`,
      data: {
        event_type: event,
        ip_address: ipAddress,
        user_agent: userAgent,
        details: details,
        timestamp: new Date().toISOString(),
      },
      read: true, // Mark audit logs as read by default
    })

    if (error) {
      console.error("Error logging auth event to Supabase:", error)
      // Fallback to console logging
      console.log("AUDIT LOG (fallback):", {
        event,
        userId,
        ipAddress,
        userAgent,
        details,
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error("Unexpected error during audit logging:", error)
    // Fallback to console logging
    console.log("AUDIT LOG (fallback):", {
      event,
      userId,
      ipAddress,
      userAgent,
      details,
      timestamp: new Date().toISOString(),
    })
  }
}
