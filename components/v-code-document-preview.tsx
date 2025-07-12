import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, ExternalLink, Lock } from "lucide-react"

interface VCodeDocumentPreviewProps {
  vcode: {
    id: string
    documentType: string
  }
}

export function VCodeDocumentPreview({ vcode }: VCodeDocumentPreviewProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <FileText size={18} />
          Linked Document
        </CardTitle>
        <CardDescription>{vcode.documentType} with embedded vCode</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="bg-gray-50 border rounded-md p-4 mb-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <FileText size={40} className="text-pink-600" />
              <div>
                <h3 className="font-medium">{vcode.documentType}.pdf</h3>
                <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <Badge className="bg-pink-100 text-pink-800 flex items-center gap-1">
              <Lock size={12} />
              vCode Secured
            </Badge>
          </div>

          <div className="bg-white border border-dashed border-gray-300 rounded p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-pink-100 text-pink-800 p-1 rounded">
                  <Lock size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium">PinkSync vCode Verification</p>
                  <p className="text-xs text-gray-500">ID: {vcode.id}</p>
                </div>
              </div>
              <img src="/placeholder-i0x1a.png" alt="vCode QR" className="h-20 w-20" />
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            This document contains a secure vCode reference that links to the original signed video and AI
            interpretation. Scan the QR code or enter the vCode ID in the PinkSync portal to verify.
          </p>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 flex items-center gap-2">
              <Download size={16} />
              Download PDF
            </Button>
            <Button variant="outline" className="flex-1 flex items-center gap-2">
              <ExternalLink size={16} />
              Verify Online
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
