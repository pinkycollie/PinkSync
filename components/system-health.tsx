import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface SystemHealthProps {
  uptime: number
  security: number
  compliance: number
  monitoring: number
}

export function SystemHealth({ uptime, security, compliance, monitoring }: SystemHealthProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          System Health
          <span
            className={`ml-2 h-3 w-3 rounded-full ${
              uptime >= 99 && security >= 95 && compliance >= 95 && monitoring >= 95 ? "bg-green-500" : "bg-amber-500"
            }`}
          ></span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">System Uptime</span>
            <span className="text-sm font-medium">{uptime}%</span>
          </div>
          <Progress value={uptime} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Security Status</span>
            <span className="text-sm font-medium">{security}%</span>
          </div>
          <Progress value={security} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Compliance</span>
            <span className="text-sm font-medium">{compliance}%</span>
          </div>
          <Progress value={compliance} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Monitoring</span>
            <span className="text-sm font-medium">{monitoring}%</span>
          </div>
          <Progress value={monitoring} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
