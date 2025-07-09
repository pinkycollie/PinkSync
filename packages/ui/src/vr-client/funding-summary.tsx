"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../card"
import { Button } from "../button"
import { Badge } from "../badge"
import { Download } from "lucide-react"

interface FundingItem {
  name: string
  amount: number
  status: "pending" | "approved" | "denied"
}

interface FundingSummaryProps {
  items: FundingItem[]
  totalAmount: number
  onGenerateRequest?: () => void
  onDownloadPdf?: () => void
}

export function FundingSummary({ items, totalAmount, onGenerateRequest, onDownloadPdf }: FundingSummaryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "denied":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Funding Summary</span>
          <span className="text-2xl text-purple-600">${totalAmount.toLocaleString()}</span>
        </CardTitle>
        <CardDescription>Your vocational rehabilitation funding requests</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="flex justify-between items-center py-2 border-b last:border-0">
              <div>
                <p className="font-medium">{item.name}</p>
                <Badge className={getStatusColor(item.status)} variant="outline">
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Badge>
              </div>
              <span className="font-semibold">${item.amount.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2" onClick={onDownloadPdf}>
          <Download className="h-4 w-4" />
          Download Funding Summary PDF
        </Button>
        <Button className="w-full sm:w-auto" onClick={onGenerateRequest}>
          Generate Funding Request
        </Button>
      </CardFooter>
    </Card>
  )
}
