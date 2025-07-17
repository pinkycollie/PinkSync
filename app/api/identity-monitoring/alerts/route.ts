import { type NextRequest, NextResponse } from "next/server"
import { DeafIdentityMonitor } from "@/lib/identity-monitoring/deaf-identity-monitor"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const alertType = searchParams.get("type")
    const severity = searchParams.get("severity")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const monitor = new DeafIdentityMonitor()

    // Get active alerts for user
    const alerts = await monitor.getActiveAlerts(userId, {
      alertType,
      severity,
    })

    return NextResponse.json({
      success: true,
      alerts,
      summary: {
        total: alerts.length,
        critical: alerts.filter((a) => a.severity === "critical").length,
        high: alerts.filter((a) => a.severity === "high").length,
        medium: alerts.filter((a) => a.severity === "medium").length,
        low: alerts.filter((a) => a.severity === "low").length,
      },
    })
  } catch (error) {
    console.error("Identity monitoring alerts error:", error)
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, activityData } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const monitor = new DeafIdentityMonitor()

    // Analyze activity for suspicious patterns
    const alerts = await monitor.detectSuspiciousActivity(userId, activityData)

    // Store alerts in database
    for (const alert of alerts) {
      await monitor.storeAlert(alert)
    }

    // Send notifications for critical alerts
    const criticalAlerts = alerts.filter((a) => a.severity === "critical")
    if (criticalAlerts.length > 0) {
      await monitor.sendCriticalAlertNotifications(userId, criticalAlerts)
    }

    return NextResponse.json({
      success: true,
      alertsGenerated: alerts.length,
      criticalAlerts: criticalAlerts.length,
      alerts,
    })
  } catch (error) {
    console.error("Identity monitoring analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
