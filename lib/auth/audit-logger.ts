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
    // Ensure all data is properly serializable
    const auditData = {
      event_type: event,
      ip_address: ipAddress || null,
      user_agent: userAgent || null,
      details: details || {},
      timestamp: new Date().toISOString(),
    }

    // Validate that the data can be serialized to JSON
    try {
      JSON.stringify(auditData)
    } catch (jsonError) {
      console.error("Data is not JSON serializable:", jsonError)
      // Create a safe version of the data
      auditData.details = { error: "Data not serializable" }
    }

    const { error } = await supabase.from("notifications").insert({
      user_id: userId || null,
      type: "audit_log",
      title: `Auth Event: ${event}`,
      message: `Authentication event occurred: ${event}`,
      data: auditData,
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
