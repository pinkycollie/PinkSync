"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle, Settings, User, Key, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function PinkSyncDemo() {
  const [authState, setAuthState] = useState<"unauthenticated" | "processing" | "authenticated">("unauthenticated")
  const [preferences, setPreferences] = useState({
    simplified: true,
    visual: true,
    transcription: true,
    signLanguage: false,
  })
  const [demoMode, setDemoMode] = useState<"normal" | "accessible">("normal")

  // Sample complex text that would be transformed
  const complexText =
    "The vocational rehabilitation assessment process necessitates comprehensive documentation including psychoeducational evaluations, functional capacity assessments, and prior intervention outcome analysis before eligibility determination can be completed."

  // Transformed accessible version
  const accessibleText =
    "The job support evaluation needs these documents:\n• Learning assessments\n• What you can do at work\n• Results from past help\n\nWe'll review these to see if you qualify for services."

  const handleAuth = () => {
    setAuthState("processing")
    setTimeout(() => {
      setAuthState("authenticated")
    }, 1500)
  }

  const toggleDemoMode = () => {
    setDemoMode(demoMode === "normal" ? "accessible" : "normal")
  }

  const togglePreference = (pref: keyof typeof preferences) => {
    setPreferences({ ...preferences, [pref]: !preferences[pref] })
  }

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg shadow-md">
      <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
            PS
          </div>
          <h1 className="text-2xl font-bold text-gray-800">PinkSync Layer 1 Demo</h1>
        </div>
        {authState === "authenticated" && (
          <Button
            variant="outline"
            className="flex items-center bg-pink-100 text-pink-700 hover:bg-pink-200"
            onClick={toggleDemoMode}
          >
            <Settings size={16} className="mr-2" />
            {demoMode === "normal" ? "View Accessible" : "View Original"}
          </Button>
        )}
      </header>

      {authState !== "authenticated" ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-700">deafAuth Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 mb-6">
              <div className="flex items-center border rounded-md p-3 bg-gray-50">
                <User size={20} className="text-gray-500 mr-3" />
                <Input
                  type="text"
                  placeholder="Username"
                  className="bg-transparent border-none shadow-none focus-visible:ring-0"
                  disabled={authState === "processing"}
                />
              </div>

              <div className="flex items-center border rounded-md p-3 bg-gray-50">
                <Key size={20} className="text-gray-500 mr-3" />
                <Input
                  type="password"
                  placeholder="Password"
                  className="bg-transparent border-none shadow-none focus-visible:ring-0"
                  disabled={authState === "processing"}
                />
              </div>
            </div>

            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                <Lock size={16} className="text-pink-600" />
              </div>
              <div className="text-sm text-gray-600">
                <strong>Deaf-First Authentication</strong>: Visual verification instead of audio captcha
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                  key={num}
                  className="aspect-square bg-gray-200 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-300 transition"
                >
                  <img
                    src={`/placeholder.svg?key=m7n6a&height=80&width=80&query=visual verification tile ${num}`}
                    alt={`Visual verification tile ${num}`}
                    className="rounded-md"
                  />
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button
                className={`px-6 py-2 rounded-md ${authState === "processing" ? "bg-gray-300" : "bg-pink-600 hover:bg-pink-700"} text-white font-medium transition w-full`}
                onClick={handleAuth}
                disabled={authState === "processing"}
              >
                {authState === "processing" ? "Authenticating..." : "Authenticate with deafAuth"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Vocational Rehabilitation Document</h2>
                <div className="flex items-center text-green-600 text-sm">
                  <CheckCircle size={16} className="mr-1" />
                  PinkSync Enabled
                </div>
              </div>

              <div className="mb-4 p-4 bg-gray-100 rounded-md">
                {demoMode === "normal" ? (
                  <div>
                    <p className="text-gray-800">{complexText}</p>
                    <div className="mt-4 flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                        <img src="/audio-icon.png" alt="Audio icon" />
                      </div>
                      <div className="h-10 bg-gray-300 rounded-full flex-1">{/* Audio player placeholder */}</div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 flex items-start">
                      <img src="/placeholder.svg?key=jybfh" alt="Visual cue" className="mr-4 rounded-md" />
                      <p className="text-gray-800 whitespace-pre-line">{accessibleText}</p>
                    </div>
                    <div className="p-3 bg-pink-50 border border-pink-200 rounded-md">
                      <p className="text-sm text-gray-700">
                        <strong>Transcription:</strong> "We need to see your learning tests, work ability assessments,
                        and what's worked before. Then we can decide if you qualify for our services."
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {demoMode === "accessible" && (
                <div className="text-sm text-gray-500 flex items-center">
                  <AlertTriangle size={14} className="mr-1 text-yellow-500" />
                  Content automatically simplified by PinkSync Layer 1
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-700">Accessibility Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(preferences).map(([pref, value]) => {
                  const label = {
                    simplified: "Simplify Complex Language",
                    visual: "Add Visual Enhancements",
                    transcription: "Show Transcriptions",
                    signLanguage: "Add Sign Language Videos",
                  }[pref as keyof typeof preferences]

                  return (
                    <div key={pref} className="flex items-center justify-between">
                      <Label htmlFor={`pref-${pref}`} className="text-gray-700">
                        {label}
                      </Label>
                      <Switch
                        id={`pref-${pref}`}
                        checked={value}
                        onCheckedChange={() => togglePreference(pref as keyof typeof preferences)}
                        className={value ? "bg-pink-500 data-[state=checked]:bg-pink-500" : ""}
                      />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
