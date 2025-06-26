import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function InterpreterPreferences() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Communication Preferences</CardTitle>
          <CardDescription>Choose your preferred method of communication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Default Interpreter Type</h3>
            <RadioGroup defaultValue="avatar" className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="avatar" id="avatar" />
                <Label htmlFor="avatar">3D Avatar Interpreter</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="human" id="human" />
                <Label htmlFor="human">Human Interpreter</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="text" id="text" />
                <Label htmlFor="text">Text-Only Communication</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Default Avatar</h3>
            <Select defaultValue="maya">
              <SelectTrigger>
                <SelectValue placeholder="Select an avatar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maya">Maya (Healthcare)</SelectItem>
                <SelectItem value="alex">Alex (Financial)</SelectItem>
                <SelectItem value="taylor">Taylor (General)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Communication Style</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="formality">Formality</Label>
                  <span className="text-sm text-gray-500">Professional</span>
                </div>
                <Slider defaultValue={[75]} max={100} step={1} id="formality" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Casual</span>
                  <span>Formal</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="detail">Detail Level</Label>
                  <span className="text-sm text-gray-500">Moderate</span>
                </div>
                <Slider defaultValue={[50]} max={100} step={1} id="detail" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Brief</span>
                  <span>Detailed</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="speed">Communication Speed</Label>
                  <span className="text-sm text-gray-500">Normal</span>
                </div>
                <Slider defaultValue={[50]} max={100} step={1} id="speed" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Slower</span>
                  <span>Faster</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="bg-rose-600 hover:bg-rose-700">Save Preferences</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy & Security</CardTitle>
          <CardDescription>Manage who can access your interpreters and information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-approve">Auto-approve trusted providers</Label>
              <p className="text-sm text-gray-500">
                Automatically approve interpreter access for your trusted healthcare providers
              </p>
            </div>
            <Switch id="auto-approve" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="record-sessions">Record interpretation sessions</Label>
              <p className="text-sm text-gray-500">
                Save recordings of your interpretation sessions for future reference
              </p>
            </div>
            <Switch id="record-sessions" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="data-sharing">Share usage data to improve service</Label>
              <p className="text-sm text-gray-500">Allow anonymous usage data to improve our AI and services</p>
            </div>
            <Switch id="data-sharing" defaultChecked />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="bg-rose-600 hover:bg-rose-700">Save Privacy Settings</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
