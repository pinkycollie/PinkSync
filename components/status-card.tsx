import { CheckCircle, AlertCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatusCardProps {
  title: string
  value: string
  status: "success" | "warning" | "pending"
  description?: string
  className?: string
}

export function StatusCard({ title, value, status, description, className }: StatusCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
        {status === "warning" && <AlertCircle className="h-4 w-4 text-amber-500" />}
        {status === "pending" && <Clock className="h-4 w-4 text-blue-500" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}
