import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, MessageSquare, Clock, Settings, User, Shield } from "lucide-react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import FormProcessingCard from "@/components/dashboard/form-processing-card"
import AvatarInterpreterCard from "@/components/dashboard/avatar-interpreter-card"
import RecentActivitiesCard from "@/components/dashboard/recent-activities-card"
import BottomNavigation from "@/components/mobile/bottom-navigation"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 md:py-8 pb-20 md:pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Button variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50 w-full sm:w-auto">
              <Shield className="mr-2 h-4 w-4" />
              Verify Identity
            </Button>
            <Button className="bg-rose-600 hover:bg-rose-700 w-full sm:w-auto">
              <FileText className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
              <FileText className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">+2 pending verification</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">2 unread messages</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <Clock className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="forms" className="mb-6 md:mb-8">
          <TabsList className="grid grid-cols-3 w-full mb-4 md:mb-6">
            <TabsTrigger value="forms" className="text-xs md:text-sm">
              Forms
            </TabsTrigger>
            <TabsTrigger value="interpreters" className="text-xs md:text-sm">
              Interpreters
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-xs md:text-sm">
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="forms" className="space-y-6">
            <FormProcessingCard />
          </TabsContent>

          <TabsContent value="interpreters" className="space-y-6">
            <AvatarInterpreterCard />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <RecentActivitiesCard />
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Status</CardTitle>
              <CardDescription>Your PinkSync VCode verification status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="bg-green-100 p-2 rounded-full">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-800">Verified</p>
                  <p className="text-sm text-green-600">Your identity is verified with PinkSync VCode</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Last verification: 2 days ago</p>
                <Button variant="outline" size="sm" className="w-full">
                  Manage Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and requests</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                <FileText className="h-6 w-6 mb-2" />
                <span>Healthcare Form</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                <MessageSquare className="h-6 w-6 mb-2" />
                <span>Contact Support</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                <User className="h-6 w-6 mb-2" />
                <span>Update Profile</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                <Settings className="h-6 w-6 mb-2" />
                <span>Preferences</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
}
