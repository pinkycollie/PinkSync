"use client"

import { useState, useEffect, useRef } from "react"
import { Wifi, WifiOff, Activity } from "lucide-react"
import { DeafVideoCall } from "@/components/deaf-video-call"
import { VideoAPIComparison } from "@/components/video-api-comparison"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProcessedData {
  totalTrustScoreEvents: number
  totalGestureRecognitionEvents: number
  totalDeafAuthEvents: number
  lastProcessedEvent: any | null
}

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "demo"

export default function PinkSyncVideoDemo() {
  const [processedData, setProcessedData] = useState<ProcessedData>({
    totalTrustScoreEvents: 0,
    totalGestureRecognitionEvents: 0,
    totalDeafAuthEvents: 0,
    lastProcessedEvent: null,
  })
  const [rawEvents, setRawEvents] = useState<any[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected")
  const [serverInfo, setServerInfo] = useState<any>(null)
  const [subscribedEvents, setSubscribedEvents] = useState<string[]>([])

  const workerRef = useRef<Worker | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const eventCounter = useRef(0)

  // Demo mode - simulate Socket.IO server locally
  const DEMO_MODE = true // Set to false when you have a real Socket.IO server

  useEffect(() => {
    // Initialize the worker
    try {
      workerRef.current = new Worker("/worker.js")

      // Listen for messages from the worker
      workerRef.current.onmessage = (event: MessageEvent) => {
        // For demo, we'll process the events differently
        console.log("Worker message:", event.data)
      }

      workerRef.current.onerror = (error) => {
        console.error("Worker error:", error)
      }
    } catch (error) {
      console.error("Failed to create worker:", error)
    }

    // Clean up on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const generateDemoEvent = () => {
    eventCounter.current += 1
    const eventTypes = ["trust_score_event", "gesture_recognition", "deaf_auth_verification", "fibonrose_feedback"]
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)]

    const event: any = {
      id: eventCounter.current,
      type: randomType,
      timestamp: new Date().toISOString(),
      user_id: Math.floor(Math.random() * 1000) + 1,
      server_id: "demo-server-001",
      source: "demo",
    }

    if (randomType === "trust_score_event") {
      event.score_change = Math.floor(Math.random() * 10) - 5
      event.new_score = Math.floor(Math.random() * 40) + 60
    } else if (randomType === "gesture_recognition") {
      event.gesture_id = Math.floor(Math.random() * 50) + 1
      event.confidence = Number.parseFloat((Math.random() * (1.0 - 0.7) + 0.7).toFixed(2))
      event.language = ["ASL", "BSL", "LSF"][Math.floor(Math.random() * 3)]
    } else if (randomType === "deaf_auth_verification") {
      event.method = ["gesture", "biometric", "token"][Math.floor(Math.random() * 3)]
      event.success = Math.random() > 0.2 // 80% success rate
    } else if (randomType === "fibonrose_feedback") {
      event.rating = Math.floor(Math.random() * 5) + 1
      event.category = ["interpreter", "service", "accessibility"][Math.floor(Math.random() * 3)]
    }

    return event
  }

  const processEvent = (event: any) => {
    // Update processed data based on event type
    setProcessedData((prev) => {
      const updated = { ...prev, lastProcessedEvent: event }

      switch (event.type) {
        case "trust_score_event":
          updated.totalTrustScoreEvents += 1
          break
        case "gesture_recognition":
          updated.totalGestureRecognitionEvents += 1
          break
        case "deaf_auth_verification":
          updated.totalDeafAuthEvents += 1
          break
      }

      return updated
    })
  }

  const startDemoMode = () => {
    setConnectionStatus("connecting")

    // Simulate connection delay
    setTimeout(() => {
      setConnectionStatus("demo")
      setServerInfo({
        server_id: "demo-server-001",
        message: "Demo mode - simulating Socket.IO connection",
        timestamp: new Date().toISOString(),
      })
      setSubscribedEvents(["trust_score_event", "gesture_recognition", "deaf_auth_verification"])

      // Start generating demo events
      intervalRef.current = setInterval(() => {
        const event = generateDemoEvent()
        setRawEvents((prev) => [...prev.slice(-49), event])
        processEvent(event)
      }, 2000) // Generate event every 2 seconds
    }, 1000)
  }

  const stopDemoMode = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setConnectionStatus("disconnected")
    setServerInfo(null)
    setSubscribedEvents([])
  }

  const startStreaming = () => {
    setIsStreaming(true)
    if (DEMO_MODE) {
      startDemoMode()
    } else {
      // Real Socket.IO connection would go here
      console.log("Real Socket.IO connection not implemented yet")
    }
  }

  const stopStreaming = () => {
    setIsStreaming(false)
    if (DEMO_MODE) {
      stopDemoMode()
    }
  }

  const resetStream = () => {
    stopStreaming()
    setProcessedData({
      totalTrustScoreEvents: 0,
      totalGestureRecognitionEvents: 0,
      totalDeafAuthEvents: 0,
      lastProcessedEvent: null,
    })
    setRawEvents([])
    eventCounter.current = 0
  }

  const sendPing = () => {
    if (connectionStatus === "demo") {
      // Simulate ping response
      const pingEvent = {
        id: Date.now(),
        type: "pong",
        timestamp: new Date().toISOString(),
        server_id: "demo-server-001",
        latency: Math.floor(Math.random() * 50) + 10, // 10-60ms simulated latency
      }
      setRawEvents((prev) => [...prev.slice(-49), pingEvent])
    }
  }

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-100 text-green-800"
      case "demo":
        return "bg-blue-100 text-blue-800"
      case "connecting":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <Wifi className="h-3 w-3" />
      case "demo":
        return <Activity className="h-3 w-3" />
      case "connecting":
        return <Activity className="h-3 w-3 animate-pulse" />
      default:
        return <WifiOff className="h-3 w-3" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">PinkSync Video Communication</h1>
          <p className="text-xl text-gray-600">
            Deaf-first video calling with gesture recognition and accessibility features
          </p>
        </div>

        <Tabs defaultValue="demo" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="demo">Video Call Demo</TabsTrigger>
            <TabsTrigger value="comparison">API Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="demo" className="mt-6">
            <DeafVideoCall roomId="pinksync-demo" userId="demo-user" />
          </TabsContent>

          <TabsContent value="comparison" className="mt-6">
            <VideoAPIComparison />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
