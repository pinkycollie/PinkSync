"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FolderOpen, FileText, FilePlus2, FileCheck, FileWarning, Upload, FolderPlus, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function FileOrganizer() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
            <CardDescription>Upload your documents for AI-powered organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div
                className="flex flex-col items-center justify-center rounded-md border border-dashed p-8"
                onClick={handleUpload}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="h-10 w-10 text-primary" />
                </div>
                <p className="mt-4 text-sm font-medium">Drag & drop files or click to browse</p>
                <p className="text-xs text-muted-foreground">Supports PDF, DOCX, XLSX, JPG, PNG</p>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled={isUploading}>
              <FilePlus2 className="mr-2 h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload Files"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common file organization tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Button variant="outline" className="justify-start">
                <FolderPlus className="mr-2 h-4 w-4" />
                Create New Category
              </Button>
              <Button variant="outline" className="justify-start">
                <FileCheck className="mr-2 h-4 w-4" />
                Batch Categorize Files
              </Button>
              <Button variant="outline" className="justify-start">
                <Search className="mr-2 h-4 w-4" />
                Find Duplicate Files
              </Button>
              <Button variant="outline" className="justify-start">
                <FileWarning className="mr-2 h-4 w-4" />
                Identify Missing Tax Documents
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>File Statistics</CardTitle>
            <CardDescription>Overview of your document organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 rounded-full bg-primary" />
                  <span className="text-sm">Tax Documents</span>
                </div>
                <span className="text-sm font-medium">42</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 rounded-full bg-blue-500" />
                  <span className="text-sm">Invoices</span>
                </div>
                <span className="text-sm font-medium">87</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 rounded-full bg-green-500" />
                  <span className="text-sm">Receipts</span>
                </div>
                <span className="text-sm font-medium">156</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 rounded-full bg-yellow-500" />
                  <span className="text-sm">Contracts</span>
                </div>
                <span className="text-sm font-medium">23</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 rounded-full bg-gray-500" />
                  <span className="text-sm">Other</span>
                </div>
                <span className="text-sm font-medium">37</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Document Library</CardTitle>
              <CardDescription>Browse and manage your organized files</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search files..." className="w-[200px] pl-8" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Files</SelectItem>
                  <SelectItem value="tax">Tax Documents</SelectItem>
                  <SelectItem value="invoices">Invoices</SelectItem>
                  <SelectItem value="receipts">Receipts</SelectItem>
                  <SelectItem value="contracts">Contracts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              {
                name: "Q1_Tax_Return_2023.pdf",
                category: "Tax Documents",
                date: "Mar 15, 2023",
                size: "2.4 MB",
              },
              {
                name: "Invoice_ABC_Corp_1234.pdf",
                category: "Invoices",
                date: "Apr 02, 2023",
                size: "1.1 MB",
              },
              {
                name: "Office_Supplies_Receipt.jpg",
                category: "Receipts",
                date: "Apr 10, 2023",
                size: "0.8 MB",
              },
              {
                name: "Vendor_Agreement_2023.docx",
                category: "Contracts",
                date: "Jan 22, 2023",
                size: "1.5 MB",
              },
              {
                name: "Business_Insurance_Policy.pdf",
                category: "Insurance",
                date: "Feb 05, 2023",
                size: "3.2 MB",
              },
            ].map((file, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent">
                <div className="flex items-center space-x-4">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {file.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{file.date}</span>
                      <span className="text-xs text-muted-foreground">{file.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <FolderOpen className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <div className="text-sm text-muted-foreground">Showing 5 of 345 files</div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
