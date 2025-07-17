export interface EmergencyCall {
  id: string
  type: "text" | "video" | "photo" | "voice-to-text"
  status: "connecting" | "active" | "completed" | "failed"
  location: {
    latitude: number
    longitude: number
    address: string
    landmarks: string[]
  }
  medicalInfo: {
    conditions: string[]
    medications: string[]
    allergies: string[]
    emergencyContacts: EmergencyContact[]
  }
  timestamp: Date
  dispatcherId?: string
  interpreterId?: string
  evidence: MediaEvidence[]
}

export interface EmergencyContact {
  id: string
  name: string
  relationship: string
  phone: string
  email: string
  aslCapable: boolean
  priority: number
  notificationPreference: "text" | "call" | "both"
}

export interface MediaEvidence {
  id: string
  type: "photo" | "video" | "audio"
  url: string
  timestamp: Date
  description?: string
}

export interface EmergencyAlert {
  id: string
  type: "weather" | "amber" | "emergency" | "community" | "medical"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  message: string
  location: {
    area: string
    coordinates?: { lat: number; lng: number }
    radius?: number
  }
  visualAlerts: {
    screenFlash: boolean
    ledPattern: string
    vibrationPattern: number[]
    smartHomeDevices: string[]
  }
  timestamp: Date
  expiresAt: Date
  aslVideoUrl?: string
}

export class EmergencySystem {
  private static instance: EmergencySystem
  private activeCall: EmergencyCall | null = null
  private emergencyContacts: EmergencyContact[] = []
  private medicalProfile: MedicalProfile | null = null

  static getInstance(): EmergencySystem {
    if (!EmergencySystem.instance) {
      EmergencySystem.instance = new EmergencySystem()
    }
    return EmergencySystem.instance
  }

  async initiate911Call(type: "text" | "video" | "emergency"): Promise<EmergencyCall> {
    const location = await this.getCurrentLocation()
    const medicalInfo = await this.getMedicalInfo()

    const call: EmergencyCall = {
      id: `emergency_${Date.now()}`,
      type: type === "emergency" ? "text" : type,
      status: "connecting",
      location,
      medicalInfo,
      timestamp: new Date(),
      evidence: [],
    }

    this.activeCall = call

    // Notify emergency contacts
    await this.notifyEmergencyContacts(call)

    // Connect to 911 dispatch
    await this.connectToDispatch(call)

    return call
  }

  async sendTextTo911(message: string, evidence?: File[]): Promise<void> {
    if (!this.activeCall) {
      throw new Error("No active emergency call")
    }

    const mediaEvidence: MediaEvidence[] = []

    if (evidence) {
      for (const file of evidence) {
        const url = await this.uploadEvidence(file)
        mediaEvidence.push({
          id: `evidence_${Date.now()}`,
          type: file.type.startsWith("image/") ? "photo" : "video",
          url,
          timestamp: new Date(),
        })
      }
    }

    this.activeCall.evidence.push(...mediaEvidence)

    await fetch("/api/emergency/send-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callId: this.activeCall.id,
        message,
        evidence: mediaEvidence,
        location: this.activeCall.location,
      }),
    })
  }

  async startVideoCall(): Promise<string> {
    if (!this.activeCall) {
      throw new Error("No active emergency call")
    }

    const response = await fetch("/api/emergency/video-call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callId: this.activeCall.id,
        location: this.activeCall.location,
        medicalInfo: this.activeCall.medicalInfo,
      }),
    })

    const { videoUrl } = await response.json()
    return videoUrl
  }

  async getCurrentLocation(): Promise<EmergencyCall["location"]> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords

          // Reverse geocoding to get address
          const response = await fetch(`https://api.geocoding.service/reverse?lat=${latitude}&lng=${longitude}`)
          const { address, landmarks } = await response.json()

          resolve({
            latitude,
            longitude,
            address,
            landmarks: landmarks || [],
          })
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000 },
      )
    })
  }

  async getMedicalInfo(): Promise<EmergencyCall["medicalInfo"]> {
    if (!this.medicalProfile) {
      const response = await fetch("/api/emergency/medical-profile")
      this.medicalProfile = await response.json()
    }

    return {
      conditions: this.medicalProfile?.conditions || [],
      medications: this.medicalProfile?.medications || [],
      allergies: this.medicalProfile?.allergies || [],
      emergencyContacts: this.emergencyContacts,
    }
  }

  async notifyEmergencyContacts(call: EmergencyCall): Promise<void> {
    const sortedContacts = this.emergencyContacts.sort((a, b) => a.priority - b.priority).slice(0, 3) // Notify top 3 contacts

    for (const contact of sortedContacts) {
      await fetch("/api/emergency/notify-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact,
          callId: call.id,
          location: call.location,
          timestamp: call.timestamp,
        }),
      })
    }
  }

  async connectToDispatch(call: EmergencyCall): Promise<void> {
    await fetch("/api/emergency/connect-dispatch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(call),
    })
  }

  async uploadEvidence(file: File): Promise<string> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("callId", this.activeCall?.id || "")

    const response = await fetch("/api/emergency/upload-evidence", {
      method: "POST",
      body: formData,
    })

    const { url } = await response.json()
    return url
  }

  // Emergency Alert System
  async subscribeToAlerts(): Promise<void> {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      const registration = await navigator.serviceWorker.register("/sw.js")
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY,
      })

      await fetch("/api/emergency/subscribe-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      })
    }
  }

  async triggerVisualAlert(alert: EmergencyAlert): Promise<void> {
    // Screen flash
    if (alert.visualAlerts.screenFlash) {
      this.flashScreen(alert.severity)
    }

    // Vibration pattern
    if ("vibrate" in navigator && alert.visualAlerts.vibrationPattern.length > 0) {
      navigator.vibrate(alert.visualAlerts.vibrationPattern)
    }

    // Smart home integration
    if (alert.visualAlerts.smartHomeDevices.length > 0) {
      await this.triggerSmartHomeAlerts(alert.visualAlerts.smartHomeDevices, alert.severity)
    }

    // Show alert notification
    this.showAlertNotification(alert)
  }

  private flashScreen(severity: string): void {
    const colors = {
      low: "#FEF3C7",
      medium: "#FED7AA",
      high: "#FECACA",
      critical: "#DC2626",
    }

    const overlay = document.createElement("div")
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: ${colors[severity as keyof typeof colors]};
      z-index: 9999;
      pointer-events: none;
      animation: flash 0.5s ease-in-out 3;
    `

    document.body.appendChild(overlay)
    setTimeout(() => overlay.remove(), 1500)
  }

  private async triggerSmartHomeAlerts(devices: string[], severity: string): Promise<void> {
    await fetch("/api/emergency/smart-home-alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ devices, severity }),
    })
  }

  private showAlertNotification(alert: EmergencyAlert): void {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(alert.title, {
        body: alert.message,
        icon: "/emergency-icon.png",
        badge: "/emergency-badge.png",
        vibrate: alert.visualAlerts.vibrationPattern,
        requireInteraction: alert.severity === "critical",
      })
    }
  }
}

export interface MedicalProfile {
  conditions: string[]
  medications: string[]
  allergies: string[]
  bloodType?: string
  emergencyPhysician?: string
  preferredHospital?: string
  insuranceInfo?: string
  specialNeeds?: string[]
}
