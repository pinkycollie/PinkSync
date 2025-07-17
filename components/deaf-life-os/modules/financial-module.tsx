"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CreditCard,
  DollarSign,
  FileText,
  Home,
  PiggyBank,
  Wallet,
  BarChart,
  Calendar,
  CheckCircle2,
  Info,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function FinancialModule() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,650.32</div>
            <p className="text-xs text-muted-foreground">+$1,250.00 this month</p>
            <Progress value={65} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,240.00</div>
            <p className="text-xs text-muted-foreground">This month</p>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,990.00</div>
            <p className="text-xs text-muted-foreground">This month</p>
            <Progress value={60} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450.00</div>
            <p className="text-xs text-muted-foreground">+$500.00 this month</p>
            <Progress value={40} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="taxes">Taxes</TabsTrigger>
          <TabsTrigger value="bills">Bills & Payments</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
              <CardDescription>Your financial health at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-2">Monthly Cash Flow</h3>
                  <div className="h-[200px] w-full bg-gray-100 rounded-md flex items-center justify-center">
                    <BarChart className="h-8 w-8 text-gray-400" />
                    <span className="ml-2 text-gray-500">Income vs. Expenses Chart</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Spending by Category</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
                        <span className="text-sm">Housing</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">$1,500.00</span>
                        <span className="text-xs text-muted-foreground ml-2">(38%)</span>
                      </div>
                    </div>
                    <Progress value={38} className="h-2" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-sm">Transportation</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">$650.00</span>
                        <span className="text-xs text-muted-foreground ml-2">(16%)</span>
                      </div>
                    </div>
                    <Progress value={16} className="h-2" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Food</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">$850.00</span>
                        <span className="text-xs text-muted-foreground ml-2">(21%)</span>
                      </div>
                    </div>
                    <Progress value={21} className="h-2" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <span className="text-sm">Utilities</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">$320.00</span>
                        <span className="text-xs text-muted-foreground ml-2">(8%)</span>
                      </div>
                    </div>
                    <Progress value={8} className="h-2" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                        <span className="text-sm">Other</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">$670.00</span>
                        <span className="text-xs text-muted-foreground ml-2">(17%)</span>
                      </div>
                    </div>
                    <Progress value={17} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest financial activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                        <ArrowDown className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Grocery Store</p>
                        <p className="text-xs text-muted-foreground">Mar 15, 2025</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-red-500">-$85.42</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <ArrowUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Paycheck</p>
                        <p className="text-xs text-muted-foreground">Mar 15, 2025</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-green-500">+$2,450.00</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                        <ArrowDown className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Gas Station</p>
                        <p className="text-xs text-muted-foreground">Mar 14, 2025</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-red-500">-$45.00</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                        <ArrowDown className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Restaurant</p>
                        <p className="text-xs text-muted-foreground">Mar 13, 2025</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-red-500">-$65.30</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Transactions
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Bills</CardTitle>
                <CardDescription>Bills due in the next 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                        <Home className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Mortgage</p>
                        <p className="text-xs text-muted-foreground">Due on Apr 1, 2025</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium">$1,250.00</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                        <CreditCard className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Credit Card</p>
                        <p className="text-xs text-muted-foreground">Due on Mar 25, 2025</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium">$450.00</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Property Tax</p>
                        <p className="text-xs text-muted-foreground">Due on Mar 18, 2025</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-red-500">$3,250.00</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                        <Wallet className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Car Insurance</p>
                        <p className="text-xs text-muted-foreground">Due on Apr 5, 2025</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium">$125.00</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Bills
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Accounts</CardTitle>
              <CardDescription>Your connected bank and investment accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4 text-pink-500" />
                        First National Bank
                      </div>
                    </TableCell>
                    <TableCell>Checking</TableCell>
                    <TableCell>$4,250.32</TableCell>
                    <TableCell>Today</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4 text-pink-500" />
                        First National Bank
                      </div>
                    </TableCell>
                    <TableCell>Savings</TableCell>
                    <TableCell>$12,450.00</TableCell>
                    <TableCell>Today</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4 text-pink-500" />
                        Capital Credit
                      </div>
                    </TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell>-$1,850.00</TableCell>
                    <TableCell>Yesterday</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <PiggyBank className="mr-2 h-4 w-4 text-pink-500" />
                        Retirement Fund
                      </div>
                    </TableCell>
                    <TableCell>Investment</TableCell>
                    <TableCell>$85,750.00</TableCell>
                    <TableCell>Mar 10, 2025</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Connect New Account
              </Button>
            </CardFooter>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Account Activity</CardTitle>
                <CardDescription>Recent activity across all accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                        <ArrowDown className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Withdrawal - ATM</p>
                        <p className="text-xs text-muted-foreground">Mar 15, 2025</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-red-500">-$200.00</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <ArrowUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Deposit - Direct Deposit</p>
                        <p className="text-xs text-muted-foreground">Mar 15, 2025</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-green-500">+$2,450.00</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                        <ArrowDown className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Payment - Credit Card</p>
                        <p className="text-xs text-muted-foreground">Mar 10, 2025</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-red-500">-$450.00</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <ArrowUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Transfer - To Savings</p>
                        <p className="text-xs text-muted-foreground">Mar 5, 2025</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-green-500">+$500.00</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>Security status of your financial accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">Two-Factor Authentication</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Enabled
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">FibonRoseTrust Integration</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Connected
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">Transaction Alerts</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Enabled
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                      <span className="text-sm font-medium">Last Security Review</span>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      30+ days
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Review Security Settings
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="taxes" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Information</CardTitle>
              <CardDescription>Your tax filing status and documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">2024 Tax Return</h3>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    In Progress
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Filing Status</span>
                    <span className="text-sm font-medium">60% Complete</span>
                  </div>
                  <Progress value={60} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Documents Gathered</span>
                    <span>Review</span>
                    <span>Submit</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-pink-500" />
                    <span className="text-sm font-medium">Filing Deadline</span>
                  </div>
                  <Badge>April 15, 2025</Badge>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Tax Documents</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-pink-500" />
                            W-2 (Employer)
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Received
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-pink-500" />
                            1099-INT (Bank Interest)
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Received
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-pink-500" />
                            1098 (Mortgage Interest)
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Received
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-pink-500" />
                            Charitable Donations
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                            Pending
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            Upload
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Save Progress</Button>
                  <Button>Continue Tax Filing</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tax History</CardTitle>
              <CardDescription>Your past tax filings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tax Year</TableHead>
                    <TableHead>Filing Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Refund/Payment</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">2023</TableCell>
                    <TableCell>April 10, 2024</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Filed
                      </Badge>
                    </TableCell>
                    <TableCell className="text-green-500">+$1,250.00</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">2022</TableCell>
                    <TableCell>April 15, 2023</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Filed
                      </Badge>
                    </TableCell>
                    <TableCell className="text-green-500">+$850.00</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">2021</TableCell>
                    <TableCell>April 12, 2022</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Filed
                      </Badge>
                    </TableCell>
                    <TableCell className="text-red-500">-$320.00</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bills" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bills & Payments</CardTitle>
              <CardDescription>Manage your recurring bills and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bill</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Home className="mr-2 h-4 w-4 text-pink-500" />
                        Mortgage
                      </div>
                    </TableCell>
                    <TableCell>$1,250.00</TableCell>
                    <TableCell>Apr 1, 2025</TableCell>
                    <TableCell>
                      <Badge variant="outline">Upcoming</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm">Pay Now</Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                        Property Tax
                      </div>
                    </TableCell>
                    <TableCell>$3,250.00</TableCell>
                    <TableCell>Mar 18, 2025</TableCell>
                    <TableCell>
                      <Badge variant="destructive">Due Soon</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm">Pay Now</Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4 text-pink-500" />
                        Credit Card
                      </div>
                    </TableCell>
                    <TableCell>$450.00</TableCell>
                    <TableCell>Mar 25, 2025</TableCell>
                    <TableCell>
                      <Badge variant="outline">Upcoming</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm">Pay Now</Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Wallet className="mr-2 h-4 w-4 text-pink-500" />
                        Car Insurance
                      </div>
                    </TableCell>
                    <TableCell>$125.00</TableCell>
                    <TableCell>Apr 5, 2025</TableCell>
                    <TableCell>
                      <Badge variant="outline">Upcoming</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm">Pay Now</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Add New Bill
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Recent bill payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Mortgage Payment</p>
                      <p className="text-xs text-muted-foreground">Mar 1, 2025</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium">$1,250.00</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Credit Card Payment</p>
                      <p className="text-xs text-muted-foreground">Feb 25, 2025</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium">$450.00</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Electric Bill</p>
                      <p className="text-xs text-muted-foreground">Feb 20, 2025</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium">$85.42</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Water Bill</p>
                      <p className="text-xs text-muted-foreground">Feb 15, 2025</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium">$45.30</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Benefits</CardTitle>
              <CardDescription>Your benefits and assistance programs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Deaf-Specific Benefits</h3>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Active Benefits</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Benefit</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Next Review</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-pink-500" />
                            Telecommunications Relay Services
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell>No Review Required</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-pink-500" />
                            Hearing Aid Tax Credit
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell>Annual (Tax Filing)</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-pink-500" />
                            Disability Tax Credit
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell>Annual (Tax Filing)</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Available Benefits</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Benefit</TableHead>
                        <TableHead>Eligibility</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-pink-500" />
                            Supplemental Security Income (SSI)
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            Check Eligibility
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            Apply
                          </Button>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-pink-500" />
                            Vocational Rehabilitation
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            Likely Eligible
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            Apply
                          </Button>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-pink-500" />
                            Home Modification Grants
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            Likely Eligible
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            Apply
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Check All Benefits</Button>
                  <Button>Apply for Benefits</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Benefit Resources</CardTitle>
              <CardDescription>Helpful resources for financial assistance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Financial Assistance Programs</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      National Deaf Center Financial Aid Resources
                    </li>
                    <li className="flex items-center text-sm">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      State Vocational Rehabilitation Services
                    </li>
                    <li className="flex items-center text-sm">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      Telecommunications Equipment Distribution Program
                    </li>
                  </ul>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium mb-2">Tax Benefits</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      Disability Tax Credit Guide
                    </li>
                    <li className="flex items-center text-sm">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      Medical Expense Deductions for Hearing Devices
                    </li>
                    <li className="flex items-center text-sm">
                      <Info className="mr-2 h-4 w-4 text-blue-500" />
                      Work Opportunity Tax Credit for Employers
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Schedule Benefit Consultation
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
