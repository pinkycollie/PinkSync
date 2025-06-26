import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import AvatarInterpreterList from "@/components/interpreters/avatar-interpreter-list"
import HumanInterpreterList from "@/components/interpreters/human-interpreter-list"
import InterpreterPreferences from "@/components/interpreters/interpreter-preferences"

export default function InterpretersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Interpreters</h1>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button className="bg-rose-600 hover:bg-rose-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Interpreter
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Interpreter Hub</CardTitle>
            <CardDescription>Manage your 3D avatars and human interpreters for seamless communication</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              VisualDesk provides both AI-powered 3D avatar interpreters and certified human interpreters to assist with
              your communication needs. Customize your preferences and choose the right interpreter for each situation.
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="avatars" className="mb-8">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
            <TabsTrigger value="avatars">3D Avatars</TabsTrigger>
            <TabsTrigger value="humans">Human Interpreters</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="avatars">
            <AvatarInterpreterList />
          </TabsContent>

          <TabsContent value="humans">
            <HumanInterpreterList />
          </TabsContent>

          <TabsContent value="preferences">
            <InterpreterPreferences />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
