"use client"

import { CheckCircle, AlertTriangle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface VCodeEntryProps {
  vcode: {
    id: string
    timestamp: string
    content: string
    status: "verified" | "pending" | "corrected"
    documentType: string
  }
  isSelected: boolean
  onClick: () => void
}

export function VCodeEntry({ vcode, isSelected, onClick }: VCodeEntryProps) {
  const statusIcons = {
    verified: <CheckCircle size={16} className="text-green-500" />,
    pending: <Clock size={16} className="text-amber-500" />,
    corrected: <AlertTriangle size={16} className="text-blue-500" />,
  }

  const statusColors = {
    verified: "bg-green-100 text-green-800",
    pending: "bg-amber-100 text-amber-800",
    corrected: "bg-blue-100 text-blue-800",
  }

  const formattedDate = new Date(vcode.timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })

  return (
    <div
      className={cn(
        "px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors",
        isSelected && "bg-pink-50 hover:bg-pink-50 border-l-4 border-pink-500",
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-1">
        <div className="font-medium text-gray-900 truncate max-w-[180px]">{vcode.id}</div>
        <Badge variant="outline" className={cn("flex items-center gap-1", statusColors[vcode.status])}>
          {statusIcons[vcode.status]}
          <span className="capitalize">{vcode.status}</span>
        </Badge>
      </div>

      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{vcode.content}</p>

      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{formattedDate}</span>
        <span>{vcode.documentType}</span>
      </div>
    </div>
  )
}
