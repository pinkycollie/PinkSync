"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { X, Type, Lightbulb, Vibrate, Smartphone, Video, MessageSquare, Palette } from "lucide-react"

interface AccessibilityPanelProps {
  onClose: () => void
}

export function AccessibilityPanel({ onClose }: AccessibilityPanelProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Accessibility</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visual Settings</CardTitle>
              <CardDescription>Customize how content appears</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="text-size" className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Text Size
                  </Label>
                  <span className="text-sm">Large</span>
                </div>
                <Slider id="text-size" defaultValue={[75]} max={100} step={1} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="contrast" className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    High Contrast
                  </Label>
                  <Switch id="contrast" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="reduce-motion" className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Reduce Motion
                  </Label>
                  <Switch id="reduce-motion" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Preferences</CardTitle>
              <CardDescription>Customize notification methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="visual-alerts" className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Visual Alerts
                  </Label>
                  <Switch id="visual-alerts" defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="vibration" className="flex items-center gap-2">
                    <Vibrate className="h-4 w-4" />
                    Vibration Alerts
                  </Label>
                  <Switch id="vibration" defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="flash-notifications" className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Flash Notifications
                  </Label>
                  <Switch id="flash-notifications" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Communication Preferences</CardTitle>
              <CardDescription>Set your preferred communication methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="asl-video" className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    ASL Video Interface
                  </Label>
                  <Switch id="asl-video" defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="text-chat" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Text Chat
                  </Label>
                  <Switch id="text-chat" defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="asl-first" className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    ASL as Primary Language
                  </Label>
                  <Switch id="asl-first" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Save Preferences</Button>
        </div>
      </div>
    </div>
  )
}
