"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateUserPreferences } from "@/app/actions/user-actions"
import { useToast } from "@/hooks/use-toast"
import { Eye, MessageSquare, Type, Hand, Save, RotateCcw, Sparkles, Fingerprint, Braces } from "lucide-react"

interface UserPreferencesFormProps {
  userId: string
  initialPreferences: any
}

export function UserPreferencesForm({ userId, initialPreferences }: UserPreferencesFormProps) {
  const [preferences, setPreferences] = useState(initialPreferences)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSave = async () => {
    setIsSaving(true)

    try {
      await updateUserPreferences(userId, preferences)

      toast({
        title: "Preferences saved",
        description: "Your accessibility preferences have been updated",
      })

      router.refresh()
    } catch (error) {
      console.error("Error saving preferences:", error)

      toast({
        title: "Error saving preferences",
        description: "There was a problem saving your preferences",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setPreferences(initialPreferences)
  }

  const updatePreference = (category: string, key: string, value: any) => {
    setPreferences((prev: any) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalized Accessibility Settings</CardTitle>
        <CardDescription>
          Customize how PinkSync works for you. These settings will be applied across all your devices.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="communication" className="space-y-4">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="communication">
              <MessageSquare className="h-4 w-4 mr-2" />
              Communication
            </TabsTrigger>
            <TabsTrigger value="visual">
              <Eye className="h-4 w-4 mr-2" />
              Visual
            </TabsTrigger>
            <TabsTrigger value="captions">
              <Type className="h-4 w-4 mr-2" />
              Captions
            </TabsTrigger>
            <TabsTrigger value="sign-language">
              <Hand className="h-4 w-4 mr-2" />
              Sign Language
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Braces className="h-4 w-4 mr-2" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="communication" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Preferred Communication Method</h3>
              <RadioGroup
                value={preferences.communication_method}
                onValueChange={(value) => setPreferences({ ...preferences, communication_method: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="text" id="comm-text" />
                  <Label htmlFor="comm-text">Text</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sign_language" id="comm-sign" />
                  <Label htmlFor="comm-sign">Sign Language</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="voice" id="comm-voice" />
                  <Label htmlFor="comm-voice">Voice</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mixed" id="comm-mixed" />
                  <Label htmlFor="comm-mixed">Mixed (Adapt based on content)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Voice Preferences</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="text-to-speech">Text-to-Speech</Label>
                  <Switch
                    id="text-to-speech"
                    checked={preferences.voice_preferences.text_to_speech}
                    onCheckedChange={(checked) => updatePreference("voice_preferences", "text_to_speech", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="speech-to-text">Speech-to-Text</Label>
                  <Switch
                    id="speech-to-text"
                    checked={preferences.voice_preferences.speech_to_text}
                    onCheckedChange={(checked) => updatePreference("voice_preferences", "speech_to_text", checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="voice-type">Voice Type</Label>
                <Select
                  value={preferences.voice_preferences.voice_type}
                  onValueChange={(value) => updatePreference("voice_preferences", "voice_type", value)}
                >
                  <SelectTrigger id="voice-type">
                    <SelectValue placeholder="Select voice type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="feminine">Feminine</SelectItem>
                    <SelectItem value="masculine">Masculine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="haptic-feedback">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Fingerprint className="h-4 w-4 mr-2" />
                      Haptic Feedback
                    </div>
                    <p className="text-sm text-muted-foreground">Enable vibration feedback for interactions</p>
                  </div>
                </Label>
                <Switch
                  id="haptic-feedback"
                  checked={preferences.haptic_feedback}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, haptic_feedback: checked })}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="visual" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Visual Display Preferences</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="high-contrast">High Contrast Mode</Label>
                  <Switch
                    id="high-contrast"
                    checked={preferences.visual_preferences.high_contrast}
                    onCheckedChange={(checked) => updatePreference("visual_preferences", "high_contrast", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="large-text">Large Text</Label>
                  <Switch
                    id="large-text"
                    checked={preferences.visual_preferences.large_text}
                    onCheckedChange={(checked) => updatePreference("visual_preferences", "large_text", checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color-scheme">Color Scheme</Label>
                <Select
                  value={preferences.visual_preferences.color_scheme}
                  onValueChange={(value) => updatePreference("visual_preferences", "color_scheme", value)}
                >
                  <SelectTrigger id="color-scheme">
                    <SelectValue placeholder="Select color scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="high-contrast">High Contrast</SelectItem>
                    <SelectItem value="dark-enhanced">Dark Enhanced</SelectItem>
                    <SelectItem value="light-enhanced">Light Enhanced</SelectItem>
                    <SelectItem value="colorblind-friendly">Colorblind Friendly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="captions" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="captions-enabled">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Type className="h-4 w-4 mr-2" />
                      Enable Captions
                    </div>
                    <p className="text-sm text-muted-foreground">Show captions for video and audio content</p>
                  </div>
                </Label>
                <Switch
                  id="captions-enabled"
                  checked={preferences.caption_preferences.enabled}
                  onCheckedChange={(checked) => updatePreference("caption_preferences", "enabled", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="caption-size">Caption Size</Label>
                <Select
                  value={preferences.caption_preferences.size}
                  onValueChange={(value) => updatePreference("caption_preferences", "size", value)}
                >
                  <SelectTrigger id="caption-size">
                    <SelectValue placeholder="Select caption size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="x-large">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="caption-position">Caption Position</Label>
                <Select
                  value={preferences.caption_preferences.position}
                  onValueChange={(value) => updatePreference("caption_preferences", "position", value)}
                >
                  <SelectTrigger id="caption-position">
                    <SelectValue placeholder="Select caption position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom">Bottom</SelectItem>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="side">Side</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="caption-language">Caption Language</Label>
                <Select
                  value={preferences.caption_preferences.language}
                  onValueChange={(value) => updatePreference("caption_preferences", "language", value)}
                >
                  <SelectTrigger id="caption-language">
                    <SelectValue placeholder="Select caption language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                    <SelectItem value="ko">Korean</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sign-language" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="sign-language-enabled">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Hand className="h-4 w-4 mr-2" />
                      Enable Sign Language
                    </div>
                    <p className="text-sm text-muted-foreground">Show sign language interpretation for content</p>
                  </div>
                </Label>
                <Switch
                  id="sign-language-enabled"
                  checked={preferences.sign_language_preferences.enabled}
                  onCheckedChange={(checked) => updatePreference("sign_language_preferences", "enabled", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sign-language-dialect">Sign Language Dialect</Label>
                <Select
                  value={preferences.sign_language_preferences.dialect}
                  onValueChange={(value) => updatePreference("sign_language_preferences", "dialect", value)}
                >
                  <SelectTrigger id="sign-language-dialect">
                    <SelectValue placeholder="Select sign language dialect" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asl">American Sign Language (ASL)</SelectItem>
                    <SelectItem value="bsl">British Sign Language (BSL)</SelectItem>
                    <SelectItem value="auslan">Australian Sign Language (Auslan)</SelectItem>
                    <SelectItem value="lsf">French Sign Language (LSF)</SelectItem>
                    <SelectItem value="lsm">Mexican Sign Language (LSM)</SelectItem>
                    <SelectItem value="jsl">Japanese Sign Language (JSL)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar-style">Avatar Style</Label>
                <Select
                  value={preferences.sign_language_preferences.avatar_style}
                  onValueChange={(value) => updatePreference("sign_language_preferences", "avatar_style", value)}
                >
                  <SelectTrigger id="avatar-style">
                    <SelectValue placeholder="Select avatar style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realistic">Realistic</SelectItem>
                    <SelectItem value="cartoon">Cartoon</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="human">Human Interpreter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-adapt">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Adaptive Learning
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Allow PinkSync to learn from your behavior and automatically adjust settings
                    </p>
                  </div>
                </Label>
                <Switch
                  id="auto-adapt"
                  checked={preferences.auto_adapt}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, auto_adapt: checked })}
                />
              </div>

              <div className="rounded-md border p-4 bg-muted/50">
                <h3 className="font-medium mb-2">Data & Privacy</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  PinkSync stores your preferences securely to provide a personalized experience. Your interaction data
                  is only used to improve your accessibility experience.
                </p>
                <Button variant="outline" size="sm">
                  Export My Data
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset} disabled={isSaving}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Default
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>Saving...</>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
