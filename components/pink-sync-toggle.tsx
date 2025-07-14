"use client"

import { useState } from "react"
import { VideoOff, Settings, Sparkles, Hand, Layers } from "lucide-react"
import { usePinkSync } from "@/contexts/pink-sync-context"
import type { PinkSyncMode } from "@/lib/types/pink-sync"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"

/**
 * PinkSyncToggle Component
 * Provides the user interface for controlling PinkSync settings
 */
export function PinkSyncToggle() {
  const { mode, setMode, preferences, updatePreferences } = usePinkSync()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Helper to get the icon and label for the current mode
  const getModeInfo = (currentMode: PinkSyncMode) => {
    switch (currentMode) {
      case "ambient":
        return { icon: <Hand className="h-4 w-4" />, label: "Ambient" }
      case "interactive":
        return { icon: <Layers className="h-4 w-4" />, label: "Interactive" }
      case "immersive":
        return { icon: <Sparkles className="h-4 w-4" />, label: "Immersive" }
      default:
        return { icon: <VideoOff className="h-4 w-4" />, label: "Off" }
    }
  }

  const { icon, label } = getModeInfo(mode)

  // Toggle between off and the last active mode
  const [lastActiveMode, setLastActiveMode] = useState<PinkSyncMode>("ambient")

  const togglePinkSync = () => {
    if (mode === "off") {
      setMode(lastActiveMode)
    } else {
      setLastActiveMode(mode)
      setMode("off")
    }
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 rounded-full bg-pink-100 px-3 py-1 dark:bg-pink-950">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex items-center gap-1.5 ${mode !== "off" ? "text-pink-600" : "text-muted-foreground"}`}>
              {mode === "off" ? <VideoOff className="h-4 w-4" /> : icon}
              <Label htmlFor="pink-sync" className="text-xs font-medium cursor-pointer">
                PinkSync
              </Label>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle PinkSync ASL integration</p>
          </TooltipContent>
        </Tooltip>

        <Switch
          id="pink-sync"
          checked={mode !== "off"}
          onCheckedChange={togglePinkSync}
          className="data-[state=checked]:bg-pink-600"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full p-0 text-pink-600 hover:bg-pink-200 dark:hover:bg-pink-800"
              disabled={mode === "off"}
            >
              <Settings className="h-3 w-3" />
              <span className="sr-only">PinkSync Settings</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>PinkSync Mode</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={mode} onValueChange={(value) => setMode(value as PinkSyncMode)}>
              <DropdownMenuRadioItem value="ambient">
                <Hand className="mr-2 h-4 w-4" /> Ambient
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="interactive">
                <Layers className="mr-2 h-4 w-4" /> Interactive
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="immersive">
                <Sparkles className="mr-2 h-4 w-4" /> Immersive
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={() => setIsSettingsOpen(true)}>
                <Settings className="mr-2 h-4 w-4" /> Advanced Settings
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>PinkSync Settings</DialogTitle>
              <DialogDescription>
                Customize how PinkSync displays ASL content throughout the application.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="video-priority">Content Priority</Label>
                <RadioGroup
                  id="video-priority"
                  value={preferences.videoPriority}
                  onValueChange={(value) => updatePreferences({ videoPriority: value as any })}
                  className="flex"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="essential" id="essential" />
                    <Label htmlFor="essential">Essential Only</Label>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">All Content</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="video-position">Video Position</Label>
                <RadioGroup
                  id="video-position"
                  value={preferences.videoPosition}
                  onValueChange={(value) => updatePreferences({ videoPosition: value as any })}
                  className="flex"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="inline" id="inline" />
                    <Label htmlFor="inline">Inline</Label>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <RadioGroupItem value="floating" id="floating" />
                    <Label htmlFor="floating">Floating</Label>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <RadioGroupItem value="sidebar" id="sidebar" />
                    <Label htmlFor="sidebar">Sidebar</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid gap-2">
                <div className="flex justify-between">
                  <Label htmlFor="video-size">Video Size</Label>
                  <span className="text-sm text-muted-foreground capitalize">{preferences.videoSize}</span>
                </div>
                <Slider
                  id="video-size"
                  min={1}
                  max={3}
                  step={1}
                  value={preferences.videoSize === "small" ? [1] : preferences.videoSize === "medium" ? [2] : [3]}
                  onValueChange={(value) => {
                    const sizeMap = { 1: "small", 2: "medium", 3: "large" } as const
                    updatePreferences({ videoSize: sizeMap[value[0] as 1 | 2 | 3] })
                  }}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sign-model">Sign Language Model</Label>
                <RadioGroup
                  id="sign-model"
                  value={preferences.signModel}
                  onValueChange={(value) => updatePreferences({ signModel: value as any })}
                  className="flex"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="human" id="human" />
                    <Label htmlFor="human">Human Signer</Label>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <RadioGroupItem value="avatar" id="avatar" />
                    <Label htmlFor="avatar">3D Avatar</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="video-quality">Video Quality</Label>
                <RadioGroup
                  id="video-quality"
                  value={preferences.videoQuality}
                  onValueChange={(value) => updatePreferences({ videoQuality: value as any })}
                  className="flex"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low">Low</Label>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">High</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-play"
                  checked={preferences.autoPlayVideos}
                  onCheckedChange={(checked) => updatePreferences({ autoPlayVideos: checked })}
                />
                <Label htmlFor="auto-play">Auto-play videos</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="show-text"
                  checked={preferences.showTextWithVideos}
                  onCheckedChange={(checked) => updatePreferences({ showTextWithVideos: checked })}
                />
                <Label htmlFor="show-text">Show text with videos</Label>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsSettingsOpen(false)}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
