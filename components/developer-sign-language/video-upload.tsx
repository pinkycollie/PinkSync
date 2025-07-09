"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useDeveloperSignLanguage } from "@/hooks/use-developer-sign-language"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, X, Upload, Video, ImageIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  categoryId: z.string().min(1, "Please select a category"),
  signLanguageType: z.enum(["DSL", "ASL", "BSL", "ISL", "Other"] as const),
  programmingCategory: z
    .enum([
      "JavaScript",
      "TypeScript",
      "React",
      "NextJS",
      "HTML",
      "CSS",
      "Git",
      "Database",
      "API",
      "DevOps",
      "Testing",
      "Accessibility",
      "Performance",
      "Security",
      "Other",
    ] as const)
    .optional(),
  complexity: z.enum(["Beginner", "Intermediate", "Advanced"] as const).optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().default(true),
})

type FormValues = z.infer<typeof formSchema>

interface VideoUploadProps {
  onSuccess?: (videoId: number) => void
}

export function VideoUpload({ onSuccess }: VideoUploadProps) {
  const { categories, tags, uploadVideo, loading } = useDeveloperSignLanguage()

  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [customTags, setCustomTags] = useState<string[]>([])
  const [customTagInput, setCustomTagInput] = useState("")

  const videoInputRef = useRef<HTMLInputElement>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      signLanguageType: "DSL",
      isPublic: true,
      tags: [],
    },
  })

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is a video
    if (!file.type.startsWith("video/")) {
      alert("Please upload a video file")
      return
    }

    setVideoFile(file)

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file)
    setVideoPreview(previewUrl)
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file for the thumbnail")
      return
    }

    setThumbnailFile(file)

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file)
    setThumbnailPreview(previewUrl)
  }

  const handleAddCustomTag = () => {
    if (!customTagInput.trim()) return

    // Check if tag already exists
    if (customTags.includes(customTagInput.trim())) {
      setCustomTagInput("")
      return
    }

    setCustomTags([...customTags, customTagInput.trim()])
    setCustomTagInput("")
  }

  const handleRemoveCustomTag = (tag: string) => {
    setCustomTags(customTags.filter((t) => t !== tag))
  }

  const onSubmit = async (values: FormValues) => {
    if (!videoFile) {
      alert("Please upload a video file")
      return
    }

    // Combine form tags with custom tags
    const allTags = [...(values.tags || []), ...customTags]

    // Add programming category and complexity as tags if provided
    if (values.programmingCategory) {
      allTags.push(values.programmingCategory)
    }

    if (values.complexity) {
      allTags.push(values.complexity)
    }

    const result = await uploadVideo(videoFile, thumbnailFile, {
      title: values.title,
      description: values.description || "",
      categoryId: Number.parseInt(values.categoryId, 10),
      signLanguageType: values.signLanguageType,
      tags: allTags,
      isPublic: values.isPublic,
    })

    if (result && onSuccess) {
      onSuccess(result.id)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Developer Sign Language Video</CardTitle>
        <CardDescription>Share your developer sign language videos with the community</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter video title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter video description" className="resize-none h-24" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="signLanguageType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sign Language Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="DSL">DSL (Developer Sign Language)</SelectItem>
                            <SelectItem value="ASL">ASL (American Sign Language)</SelectItem>
                            <SelectItem value="BSL">BSL (British Sign Language)</SelectItem>
                            <SelectItem value="ISL">ISL (International Sign Language)</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="programmingCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Programming Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="JavaScript">JavaScript</SelectItem>
                            <SelectItem value="TypeScript">TypeScript</SelectItem>
                            <SelectItem value="React">React</SelectItem>
                            <SelectItem value="NextJS">Next.js</SelectItem>
                            <SelectItem value="HTML">HTML</SelectItem>
                            <SelectItem value="CSS">CSS</SelectItem>
                            <SelectItem value="Git">Git</SelectItem>
                            <SelectItem value="Database">Database</SelectItem>
                            <SelectItem value="API">API</SelectItem>
                            <SelectItem value="DevOps">DevOps</SelectItem>
                            <SelectItem value="Testing">Testing</SelectItem>
                            <SelectItem value="Accessibility">Accessibility</SelectItem>
                            <SelectItem value="Performance">Performance</SelectItem>
                            <SelectItem value="Security">Security</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="complexity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complexity</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select complexity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            const currentTags = field.value || []
                            if (!currentTags.includes(value)) {
                              field.onChange([...currentTags, value])
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select tags" />
                          </SelectTrigger>
                          <SelectContent>
                            {tags.map((tag) => (
                              <SelectItem key={tag.id} value={tag.name}>
                                {tag.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(field.value || []).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0 text-gray-500 hover:text-gray-700"
                              onClick={() => {
                                const newTags = [...(field.value || [])]
                                newTags.splice(index, 1)
                                field.onChange(newTags)
                              }}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove tag</span>
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Custom Tags</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={customTagInput}
                      onChange={(e) => setCustomTagInput(e.target.value)}
                      placeholder="Add custom tag"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddCustomTag()
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={handleAddCustomTag}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {customTags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 text-gray-500 hover:text-gray-700"
                          onClick={() => handleRemoveCustomTag(tag)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove tag</span>
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Make this video public</FormLabel>
                        <FormDescription>Public videos can be viewed by anyone</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <div>
                  <FormLabel className="block mb-2">Video File</FormLabel>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    {videoPreview ? (
                      <div className="space-y-4">
                        <video src={videoPreview} controls className="w-full h-auto max-h-48 mx-auto" />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 truncate max-w-[200px]">{videoFile?.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setVideoFile(null)
                              setVideoPreview(null)
                              if (videoInputRef.current) {
                                videoInputRef.current.value = ""
                              }
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="flex flex-col items-center justify-center py-6 cursor-pointer"
                        onClick={() => videoInputRef.current?.click()}
                      >
                        <Video className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-900">Click to upload video</p>
                        <p className="text-xs text-gray-500 mt-1">MP4, WebM, or OGG (Max 100MB)</p>
                      </div>
                    )}
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="hidden"
                    />
                  </div>
                </div>

                <div>
                  <FormLabel className="block mb-2">Thumbnail (Optional)</FormLabel>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    {thumbnailPreview ? (
                      <div className="space-y-4">
                        <img
                          src={thumbnailPreview || "/placeholder.svg"}
                          alt="Thumbnail preview"
                          className="w-full h-auto max-h-48 mx-auto object-contain"
                        />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 truncate max-w-[200px]">{thumbnailFile?.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setThumbnailFile(null)
                              setThumbnailPreview(null)
                              if (thumbnailInputRef.current) {
                                thumbnailInputRef.current.value = ""
                              }
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="flex flex-col items-center justify-center py-6 cursor-pointer"
                        onClick={() => thumbnailInputRef.current?.click()}
                      >
                        <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-900">Click to upload thumbnail</p>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG, or GIF (Max 5MB)</p>
                      </div>
                    )}
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Video
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
