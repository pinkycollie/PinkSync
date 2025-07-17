"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface FibonRoseTrustContextType {
  isConnected: boolean
  securityLevel: "high" | "medium" | "low"
  lastSync: Date
  connect: () => Promise<void>
  disconnect: () => void
}

const FibonRoseTrustContext = createContext<FibonRoseTrustContextType | null>(null)

export function useFibonRoseTrust() {
  const context = useContext(FibonRoseTrustContext)
  if (!context) {
    throw new Error("useFibonRoseTrust must be used within a FibonRoseTrustProvider")
  }
  return context
}

interface FibonRoseTrustProviderProps {
  children: ReactNode
}

export function FibonRoseTrustProvider({ children }: FibonRoseTrustProviderProps) {
  const [isConnected, setIsConnected] = useState(true)
  const [securityLevel] = useState<"high" | "medium" | "low">("high")
  const [lastSync] = useState(new Date())

  const connect = async () => {
    setIsConnected(true)
  }

  const disconnect = () => {
    setIsConnected(false)
  }

  const value: FibonRoseTrustContextType = {
    isConnected,
    securityLevel,
    lastSync,
    connect,
    disconnect,
  }

  return <FibonRoseTrustContext.Provider value={value}>{children}</FibonRoseTrustContext.Provider>
}
