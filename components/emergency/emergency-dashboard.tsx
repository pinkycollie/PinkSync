"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, Video, MessageSquare, MapPin, Heart, Users, AlertTriangle, Shield, Bell, Activity } from "lucide-react"
import {
  EmergencySystem,
  type EmergencyCall,
  type EmergencyAlert,
} from "@/lib/emergency/emergency-communication-system"

export function EmergencyDashboard() {
  const [emergencySystem] = useState(() => EmergencySystem.getInstance())
  const [activeCall, setActiveCall] = useState<EmergencyCall | null>(null)
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([])
  const [isEmergencyMode, setIsEmergencyMode] = useState(false)

  useEffect(() => {
    // Subscribe to emergency alerts
    emergencySystem.subscribeToAlerts()

    // Load recent alerts
    loadRecentAlerts()
  }, [emergencySystem])

  const loadRecentAlerts = async () => {
    const response = await fetch("/api/emergency/recent-alerts")
    const recentAlerts = await response.json()
    setAlerts(recentAlerts)
  }

  const handle911Call = async (type: "text" | "video" | "emergency") => {
    setIsEmergencyMode(true)
    try {
      const call = await emergencySystem.initiate911Call(type)
      setActiveCall(call)
    } catch (error) {
      console.error("Emergency call failed:", error)
      setIsEmergencyMode(false)
    }
  }

  const sendEmergencyText = async (message: string) => {
    if (activeCall) {
      await emergencySystem.sendTextTo911(message)
    }
  }

  const startVideoCall = async () => {
    if (activeCall) {
      const videoUrl = await emergencySystem.startVideoCall()
      window.open(videoUrl, "_blank")
    }
  }

  if (isEmergencyMode && activeCall) {
    return <ActiveEmergencyInterface call={activeCall} onSendText={sendEmergencyText} onStartVideo={startVideoCall} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Emergency Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Shield className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">Emergency Response Center</h1>
          </div>
          <p className="text-lg text-gray-600">Comprehensive emergency services designed for the deaf community</p>
        </div>

        {/* Emergency Action Buttons */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="h-6 w-6" />
              <span>Emergency Services</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => handle911Call("emergency")}
                className="h-20 bg-red-600 hover:bg-red-700 text-white text-lg font-semibold"
                size="lg"
              >
                <Phone className="h-8 w-8 mr-3" />
                EMERGENCY 911
              </Button>

              <Button
                onClick={() => handle911Call("text")}
                variant="outline"
                className="h-20 border-red-300 text-red-700 hover:bg-red-50 text-lg"
                size="lg"
              >
                <MessageSquare className="h-8 w-8 mr-3" />
                Text to 911
              </Button>

              <Button
                onClick={() => handle911Call("video")}
                variant="outline"
                className="h-20 border-red-300 text-red-700 hover:bg-red-50 text-lg"
                size="lg"
              >
                <Video className="h-8 w-8 mr-3" />
                Video Call 911
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="alerts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="alerts">Emergency Alerts</TabsTrigger>
            <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
            <TabsTrigger value="medical">Medical Profile</TabsTrigger>
            <TabsTrigger value="analytics">Safety Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Active Emergency Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div
                        className={`p-2 rounded-full ${
                          alert.severity === "critical"
                            ? "bg-red-100 text-red-600"
                            : alert.severity === "high"
                              ? "bg-orange-100 text-orange-600"
                              : alert.severity === "medium"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{alert.title}</h3>
                          <Badge
                            variant={
                              alert.severity === "critical"
                                ? "destructive"
                                : alert.severity === "high"
                                  ? "destructive"
                                  : alert.severity === "medium"
                                    ? "default"
                                    : "secondary"
                            }
                          >
                            {alert.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{alert.message}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{alert.location.area}</span>
                          </span>
                          <span>{new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <EmergencyContactsPanel />
          </TabsContent>

          <TabsContent value="medical" className="space-y-4">
            <MedicalProfilePanel />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <SafetyAnalyticsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ActiveEmergencyInterface({
  call,
  onSendText,
  onStartVideo,
}: {
  call: EmergencyCall
  onSendText: (message: string) => void
  onStartVideo: () => void
}) {
  const [message, setMessage] = useState("")

  return (
    <div className="min-h-screen bg-red-600 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="animate-pulse">
            <AlertTriangle className="h-16 w-16 mx-auto mb-4" />
          </div>
          <h1 className="text-4xl font-bold">EMERGENCY CALL ACTIVE</h1>
          <p className="text-xl">Connected to 911 Dispatch</p>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Call ID: {call.id}
          </Badge>
        </div>

        <Card className="bg-white text-black">
          <CardHeader>
            <CardTitle>Emergency Communication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={onStartVideo} className="h-16 bg-blue-600 hover:bg-blue-700">
                <Video className="h-8 w-8 mr-3" />
                Start Video Call with ASL Interpreter
              </Button>

              <Button
                onClick={() => onSendText(message)}
                className="h-16 bg-green-600 hover:bg-green-700"
                disabled={!message.trim()}
              >
                <MessageSquare className="h-8 w-8 mr-3" />
                Send Text Message
              </Button>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your emergency message here..."
              className="w-full h-32 p-4 border rounded-lg text-lg"
            />
          </CardContent>
        </Card>

        <Card className="bg-white text-black">
          <CardHeader>
            <CardTitle>Your Location & Medical Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Current Location</h3>
                <p className="text-sm text-gray-600">{call.location.address}</p>
                <p className="text-xs text-gray-500">
                  {call.location.latitude}, {call.location.longitude}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Medical Information</h3>
                <div className="space-y-1 text-sm">
                  {call.medicalInfo.conditions.length > 0 && (
                    <p>
                      <strong>Conditions:</strong> {call.medicalInfo.conditions.join(", ")}
                    </p>
                  )}
                  {call.medicalInfo.allergies.length > 0 && (
                    <p>
                      <strong>Allergies:</strong> {call.medicalInfo.allergies.join(", ")}
                    </p>
                  )}
                  {call.medicalInfo.medications.length > 0 && (
                    <p>
                      <strong>Medications:</strong> {call.medicalInfo.medications.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function EmergencyContactsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Emergency Contacts</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Emergency contacts list would go here */}
          <p className="text-gray-600">
            Configure your emergency contacts for automatic notification during emergencies.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function MedicalProfilePanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Heart className="h-5 w-5" />
          <span>Medical Profile</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Medical profile form would go here */}
          <p className="text-gray-600">Maintain your medical information for emergency responders.</p>
        </div>
      </CardContent>
    </Card>
  )
}

function SafetyAnalyticsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Safety Analytics</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Safety analytics would go here */}
          <p className="text-gray-600">View emergency response times and safety metrics in your area.</p>
        </div>
      </CardContent>
    </Card>
  )
}
