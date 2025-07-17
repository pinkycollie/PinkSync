"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, XCircle, Calendar, FileText, RefreshCw, AlertCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function ComplianceChecker() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)

  const handleScan = () => {
    setIsScanning(true)
    setScanProgress(0)

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center">
                <svg className="h-24 w-24" viewBox="0 0 100 100">
                  <circle className="stroke-muted-foreground stroke-[4]" cx="50" cy="50" r="40" fill="transparent" />
                  <circle
                    className="stroke-primary stroke-[8]"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset="25.12"
                    transform="rotate(-90 50 50)"
                  />
                  <text x="50" y="55" textAnchor="middle" className="fill-foreground text-xl font-bold">
                    90%
                  </text>
                </svg>
              </div>
              <div className="mt-2 flex space-x-2">
                <Badge variant="outline" className="bg-green-500/10 text-green-500">
                  Good Standing
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tax Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                <span>Up to date</span>
              </div>
              <Badge>95%</Badge>
            </div>
            <Progress value={95} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">Next filing deadline: April 15, 2025</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Insurance Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                <span>Attention needed</span>
              </div>
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                85%
              </Badge>
            </div>
            <Progress value={85} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">Workers' comp insurance renewal in 14 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Business Licenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <XCircle className="mr-2 h-5 w-5 text-red-500" />
                <span>Action required</span>
              </div>
              <Badge variant="outline" className="bg-red-500/10 text-red-500">
                70%
              </Badge>
            </div>
            <Progress value={70} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">Business license expired 5 days ago</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Compliance Scanner</CardTitle>
              <CardDescription>Scan your business documents for compliance issues</CardDescription>
            </div>
            <Button onClick={handleScan} disabled={isScanning}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {isScanning ? "Scanning..." : "Run Scan"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isScanning ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Scanning documents for compliance issues...</span>
                <span>{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} />
            </div>
          ) : (
            <Tabs defaultValue="issues">
              <TabsList className="mb-4">
                <TabsTrigger value="issues">Issues</TabsTrigger>
                <TabsTrigger value="deadlines">Upcoming Deadlines</TabsTrigger>
                <TabsTrigger value="documents">Missing Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="issues">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Issue</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <XCircle className="mr-2 h-4 w-4 text-red-500" />
                          Business license expired
                        </div>
                      </TableCell>
                      <TableCell>Licensing</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-red-500/10 text-red-500">
                          High
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm">Renew Now</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                          Workers' comp insurance expiring soon
                        </div>
                      </TableCell>
                      <TableCell>Insurance</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                          Medium
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <AlertCircle className="mr-2 h-4 w-4 text-blue-500" />
                          Missing W-9 forms for 2 contractors
                        </div>
                      </TableCell>
                      <TableCell>Tax</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                          Low
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Collect Forms
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="deadlines">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          Quarterly Tax Filing
                        </div>
                      </TableCell>
                      <TableCell>Q1 2025 Estimated Tax Payment</TableCell>
                      <TableCell>April 15, 2025</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                          Upcoming
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          Insurance Renewal
                        </div>
                      </TableCell>
                      <TableCell>Workers' Compensation Insurance</TableCell>
                      <TableCell>March 28, 2025</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                          Due Soon
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          Annual Report
                        </div>
                      </TableCell>
                      <TableCell>State Business Annual Report</TableCell>
                      <TableCell>May 1, 2025</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                          Upcoming
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="documents">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          W-9 Forms
                        </div>
                      </TableCell>
                      <TableCell>Required for contractor tax reporting</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                          Medium
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Request
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          Business License Renewal
                        </div>
                      </TableCell>
                      <TableCell>Required for legal operation</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-red-500/10 text-red-500">
                          High
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm">Upload</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          Insurance Certificate
                        </div>
                      </TableCell>
                      <TableCell>Proof of current insurance coverage</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                          Medium
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Request
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
