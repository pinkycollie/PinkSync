"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Filter, QrCode, Loader2 } from "lucide-react"
import { usePinkSyncData } from "@/hooks/use-pinksync-data"

export default function LibraryPage() {
  const [libraryItems, setLibraryItems] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const { getLibraryContent } = usePinkSyncData({ autoRefresh: true })

  const categories = ["All", "Greetings", "Safety", "Food & Dining", "Travel", "Healthcare", "Career"]

  useEffect(() => {
    loadLibraryContent()
  }, [selectedCategory, searchTerm])

  const loadLibraryContent = async () => {
    try {
      setLoading(true)
      const category = selectedCategory === "All" ? undefined : selectedCategory
      const content = await getLibraryContent(category, searchTerm)
      setLibraryItems(content)
    } catch (error) {
      console.error("Error loading library content:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadLibraryContent()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <Link href="/scanqr" className="mr-4 flex items-center">
          <h1 className="text-xl font-bold text-pink-600">PinkSync</h1>
          <span className="ml-2 rounded-md bg-pink-100 px-2 py-1 text-xs font-medium text-pink-800">Scan QR</span>
        </Link>
        <h2 className="text-lg font-medium">Sign Language Library</h2>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <input
            type="text"
            placeholder="Search sign language content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
          />
        </form>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-pink-600" />
            <p className="mt-2 text-gray-500">Loading content from PinkSync...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {libraryItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={item.video_url || "/placeholder.svg?height=200&width=300&query=ASL content thumbnail"}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="mb-2 inline-block rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-medium text-pink-800">
                    {item.category}
                  </div>
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  {item.languages && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.languages.slice(0, 2).map((lang: string, index: number) => (
                        <span key={index} className="text-xs text-gray-500">
                          {lang}
                        </span>
                      ))}
                      {item.languages.length > 2 && (
                        <span className="text-xs text-gray-500">+{item.languages.length - 2} more</span>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t p-4">
                  <Link href={`/scanqr/library/${item.qr_code_data}`}>
                    <Button variant="link" className="h-8 p-0 text-pink-600">
                      View Details
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500">QR Available</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {libraryItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No content found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("All")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          <div className="mt-8 text-center">
            <Button variant="outline" onClick={loadLibraryContent}>
              Refresh Content
            </Button>
            <p className="mt-2 text-xs text-gray-500">Powered by PinkSync's real-time data engine</p>
          </div>
        </>
      )}
    </div>
  )
}
