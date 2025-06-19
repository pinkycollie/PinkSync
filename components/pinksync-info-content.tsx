"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Save, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { updateDocumentationSection } from "@/app/actions/documentation-actions"

interface DocumentationSection {
  id: number
  title: string
  content: string
  section: string
  order_index: number
}

interface PinkSyncInfoContentProps {
  sections: DocumentationSection[]
  canEdit: boolean
}

export function PinkSyncInfoContent({ sections, canEdit }: PinkSyncInfoContentProps) {
  const [editingSection, setEditingSection] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")

  // Group sections by their section category
  const groupedSections = sections.reduce(
    (acc, section) => {
      if (!acc[section.section]) {
        acc[section.section] = []
      }
      acc[section.section].push(section)
      return acc
    },
    {} as Record<string, DocumentationSection[]>,
  )

  // Get unique section categories
  const sectionCategories = Object.keys(groupedSections)

  const handleEdit = (section: DocumentationSection) => {
    setEditingSection(section.id)
    setEditTitle(section.title)
    setEditContent(section.content)
  }

  const handleSave = async (sectionId: number) => {
    try {
      await updateDocumentationSection(sectionId, editTitle, editContent)
      setEditingSection(null)
      // In a real app, you would refresh the data here
    } catch (error) {
      console.error("Error updating section:", error)
    }
  }

  const handleCancel = () => {
    setEditingSection(null)
  }

  return (
    <Tabs defaultValue={sectionCategories[0]} className="space-y-4">
      <TabsList>
        {sectionCategories.map((category) => (
          <TabsTrigger key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </TabsTrigger>
        ))}
      </TabsList>

      {sectionCategories.map((category) => (
        <TabsContent key={category} value={category} className="space-y-4">
          {groupedSections[category].map((section) => (
            <Card key={section.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                {editingSection === section.id ? (
                  <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="font-semibold" />
                ) : (
                  <CardTitle>{section.title}</CardTitle>
                )}

                {canEdit && (
                  <div className="flex space-x-2">
                    {editingSection === section.id ? (
                      <>
                        <Button size="sm" variant="ghost" onClick={handleCancel}>
                          <X className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                        <Button size="sm" onClick={() => handleSave(section.id)}>
                          <Save className="h-4 w-4 mr-1" /> Save
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(section)}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    )}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {editingSection === section.id ? (
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[200px]"
                  />
                ) : (
                  <div className="prose max-w-none dark:prose-invert">
                    {section.content.split("\n").map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      ))}
    </Tabs>
  )
}
