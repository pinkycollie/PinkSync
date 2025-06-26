"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accessibility, ZoomIn, ZoomOut, Contrast, Volume2, VolumeX, Eye, EyeOff, Vibrate } from "lucide-react"

export default function MobileAccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [highContrast, setHighContrast] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [vibrateEnabled, setVibrateEnabled] = useState(true)
  const [reduceMotion, setReduceMotion] = useState(false)

  const increaseFontSize = () => {
    if (fontSize < 24) {
      setFontSize(fontSize + 2)
      document.documentElement.style.fontSize = `${fontSize + 2}px`
    }
  }

  const decreaseFontSize = () => {
    if (fontSize > 12) {
      setFontSize(fontSize - 2)
      document.documentElement.style.fontSize = `${fontSize - 2}px`
    }
  }

  const toggleHighContrast = () => {
    setHighContrast(!highContrast)
    document.documentElement.classList.toggle("high-contrast")
  }

  const toggleReduceMotion = () => {
    setReduceMotion(!reduceMotion)
    document.documentElement.classList.toggle("reduce-motion")
  }

  return (
    <>
      {/* Floating accessibility button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 md:bottom-4 z-50 h-12 w-12 rounded-full bg-rose-600 hover:bg-rose-700 shadow-lg"
        size="icon"
      >
        <Accessibility className="h-6 w-6" />
      </Button>

      {/* Accessibility panel */}
      {isOpen && (
        <Card className="fixed bottom-32 right-4 md:bottom-16 z-50 w-72 shadow-xl">
          <CardContent className="p-4">
            <h3 className="font-medium mb-4 text-center">Accessibility Options</h3>

            <div className="space-y-4">
              {/* Font size controls */}
              <div className="flex items-center justify-between">
                <span className="text-sm">Text Size</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={decreaseFontSize}
                    disabled={fontSize <= 12}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm w-8 text-center">{fontSize}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={increaseFontSize}
                    disabled={fontSize >= 24}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* High contrast toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm">High Contrast</span>
                <Button
                  variant={highContrast ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleHighContrast}
                >
                  <Contrast className="h-4 w-4" />
                </Button>
              </div>

              {/* Sound toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm">Sound Feedback</span>
                <Button
                  variant={soundEnabled ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                >
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
              </div>

              {/* Vibration toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm">Vibration</span>
                <Button
                  variant={vibrateEnabled ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setVibrateEnabled(!vibrateEnabled)}
                >
                  <Vibrate className="h-4 w-4" />
                </Button>
              </div>

              {/* Reduce motion toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm">Reduce Motion</span>
                <Button
                  variant={reduceMotion ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleReduceMotion}
                >
                  {reduceMotion ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  )
}
