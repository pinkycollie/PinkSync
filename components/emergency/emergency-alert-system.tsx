"use client"

import { useEffect, useState } from "react"
import { type EmergencyAlert, EmergencySystem } from "@/lib/emergency/emergency-communication-system"

export function EmergencyAlertSystem() {
  const [emergencySystem] = useState(() => EmergencySystem.getInstance())
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([])

  useEffect(() => {
    // Subscribe to real-time alerts
    const eventSource = new EventSource("/api/emergency/alerts/stream")

    eventSource.onmessage = (event) => {
      const alert: EmergencyAlert = JSON.parse(event.data)
      setAlerts((prev) => [alert, ...prev.slice(0, 9)]) // Keep last 10 alerts

      // Trigger visual alerts
      emergencySystem.triggerVisualAlert(alert)
    }

    return () => eventSource.close()
  }, [emergencySystem])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {alerts.map((alert) => (
        <AlertNotification key={alert.id} alert={alert} />
      ))}
    </div>
  )
}

function AlertNotification({ alert }: { alert: EmergencyAlert }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setIsVisible(false)
      },
      alert.severity === "critical" ? 30000 : 10000,
    ) // Critical alerts stay longer

    return () => clearTimeout(timer)
  }, [alert.severity])

  if (!isVisible) return null

  const severityColors = {
    low: "bg-blue-500 border-blue-600",
    medium: "bg-yellow-500 border-yellow-600",
    high: "bg-orange-500 border-orange-600",
    critical: "bg-red-500 border-red-600",
  }

  return (
    <div
      className={`
      ${severityColors[alert.severity]} 
      text-white p-4 rounded-lg shadow-lg border-l-4 
      animate-slide-in-right
    `}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{alert.title}</h4>
          <p className="text-xs mt-1 opacity-90">{alert.message}</p>
          <p className="text-xs mt-2 opacity-75">{alert.location.area}</p>
        </div>
        <button onClick={() => setIsVisible(false)} className="text-white hover:text-gray-200">
          ×
        </button>
      </div>
    </div>
  )
}
