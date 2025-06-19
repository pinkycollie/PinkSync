"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Upload, X, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatBytes } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface VideoUploadProps {
  creatorId?: string
  onSuccess?: (videoId: string) => void
}

export function VideoUpload({ creatorId, onSuccess }: VideoUploadProps) {
  const { data: session } = useSession()
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Use the session user ID if no creatorId is provided
  const effectiveCreatorId = creatorId || session?.user?.id || "anonymous"

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      // Check if file is a video
      if (!selectedFile.type.startsWith("video/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload a video file",
          variant: "destructive",
        })
        return
      }

      // Check file size (100MB limit for this demo)
      if (selectedFile.size > 100 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a video smaller than 100MB",
          variant: "destructive",
        })
        return
      }

      setFile(selectedFile)

      // Auto-fill title from filename if empty
      if (!title) {
        const fileName = selectedFile.name.split(".")[0]
        setTitle(fileName.replace(/[-_]/g, " "))
      }
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]

      // Check if file is a video
      if (!droppedFile.type.startsWith("video/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload a video file",
          variant: "destructive",
        })
        return
      }

      setFile(droppedFile)

      // Auto-fill title from filename if empty
      if (!title) {
        const fileName = droppedFile.name.split(".")[0]
        setTitle(fileName.replace(/[-_]/g, " "))
      }
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleUpload = async () => {
    if (!file || !title || !effectiveCreatorId) {
      toast({
        title: "Missing information",
        description: "Please provide a video file and title",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", title)
      formData.append("description", description)
      formData.append("creatorId", effectiveCreatorId)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return prev + 5
        })
      }, 500)

      const response = await fetch("/api/video", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()

      setProgress(100)
      setUploadComplete(true)

      toast({
        title: "Upload successful",
        description: "Your video has been uploaded and is being processed",
        variant: "default",
      })

      if (onSuccess) {
        onSuccess(data.id)
      }

      // Redirect to video detail page after 2 seconds
      setTimeout(() => {
        router.push(`/dashboard/videos/${data.id}`)
      }, 2000)
    } catch (error) {
      console.error("Error uploading video:", error)

      toast({
        title: "Upload failed",
        description: "There was an error uploading your video",
        variant: "destructive",
      })

      setUploading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setTitle("")
    setDescription("")
    setUploading(false)
    setProgress(0)
    setUploadComplete(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Video</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center ${
            file ? "border-green-500 bg-green-50 dark:bg-green-950/20" : "border-muted-foreground/25"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <Check className="h-8 w-8 text-green-500" />
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">{formatBytes(file.size)}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => setFile(null)} disabled={uploading}>
                <X className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="font-medium">Drag and drop your video here</p>
              <p className="text-sm text-muted-foreground">Or click to browse</p>
              <Input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                Select Video
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title"
            disabled={uploading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter video description (optional)"
            disabled={uploading}
            rows={3}
          />
        </div>

        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{uploadComplete ? "Upload complete" : "Uploading..."}</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={resetForm} disabled={uploading && !uploadComplete}>
          Reset
        </Button>
        <Button onClick={handleUpload} disabled={!file || !title || uploading}>
          {uploading ? (
            <>
              {uploadComplete ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Uploaded
                </>
              ) : (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading
                </>
              )}
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
