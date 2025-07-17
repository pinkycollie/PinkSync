"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { X, AlertTriangle, Calendar, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

interface NotificationsPanelProps {
  onClose: () => void
}

export function NotificationsPanel({ onClose }: NotificationsPanelProps) {
  const router = useRouter()

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Notifications</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              All
              <Badge className="ml-2">3</Badge>
            </TabsTrigger>
            <TabsTrigger value="alerts">
              Alerts
              <Badge className="ml-2">1</Badge>
            </TabsTrigger>
            <TabsTrigger value="updates">
              Updates
              <Badge className="ml-2">2</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4 space-y-4">
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Property Tax Payment Due</h4>
                      <Badge variant="destructive">Urgent</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your city property tax payment is due in 3 days. Click to process payment.
                    </p>
                    <p className="text-xs text-muted-foreground">Today, 9:30 AM</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-1"
                      onClick={() =>
                        router.push("/dashboard/tax/property?source=notification&urgent=true&geolocate=true")
                      }
                    >
                      Pay Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">School IEP Meeting Scheduled</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your child's IEP meeting has been scheduled for March 22, 2025 at 2:00 PM.
                    </p>
                    <p className="text-xs text-muted-foreground">Yesterday, 3:45 PM</p>
                    <Button size="sm" variant="outline" className="mt-1">
                      Add to Calendar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Tax Documents Ready</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your tax documents have been processed and are ready for review.
                    </p>
                    <p className="text-xs text-muted-foreground">March 10, 2025</p>
                    <Button size="sm" variant="outline" className="mt-1">
                      View Documents
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="mt-4 space-y-4">
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Property Tax Payment Due</h4>
                      <Badge variant="destructive">Urgent</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your city property tax payment is due in 3 days. Click to process payment.
                    </p>
                    <p className="text-xs text-muted-foreground">Today, 9:30 AM</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-1"
                      onClick={() =>
                        router.push("/dashboard/tax/property?source=notification&urgent=true&geolocate=true")
                      }
                    >
                      Pay Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="updates" className="mt-4 space-y-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">School IEP Meeting Scheduled</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your child's IEP meeting has been scheduled for March 22, 2025 at 2:00 PM.
                    </p>
                    <p className="text-xs text-muted-foreground">Yesterday, 3:45 PM</p>
                    <Button size="sm" variant="outline" className="mt-1">
                      Add to Calendar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Tax Documents Ready</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your tax documents have been processed and are ready for review.
                    </p>
                    <p className="text-xs text-muted-foreground">March 10, 2025</p>
                    <Button size="sm" variant="outline" className="mt-1">
                      View Documents
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-between">
          <Button variant="outline" size="sm">
            Mark All as Read
          </Button>
          <Button size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
