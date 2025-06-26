"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDeveloperSignLanguage } from "@/hooks/use-developer-sign-language"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Search, Filter } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import type { SignLanguageType, ProgrammingCategory } from "@/types/developer-sign-language"

export function VideoSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { categories, tags, loading } = useDeveloperSignLanguage()

  const [query, setQuery] = useState(searchParams.get("query") || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "")
  const [selectedSignLanguageType, setSelectedSignLanguageType] = useState(
    (searchParams.get("signLanguageType") as SignLanguageType) || "",
  )
  const [selectedProgrammingCategory, setSelectedProgrammingCategory] = useState(
    (searchParams.get("programmingCategory") as ProgrammingCategory) || "",
  )
  const [selectedComplexity, setSelectedComplexity] = useState(
    (searchParams.get("complexity") as "Beginner" | "Intermediate" | "Advanced") || "",
  )
  const [selectedTags, setSelectedTags] = useState<string[]>(searchParams.getAll("tags") || [])
  const [sortBy, setSortBy] = useState(
    (searchParams.get("sortBy") as "newest" | "oldest" | "popular" | "alphabetical") || "newest",
  )

  const [activeFilters, setActiveFilters] = useState<string[]>([])

  useEffect(() => {
    const filters = []

    if (selectedCategory) {
      const category = categories.find((c) => c.id.toString() === selectedCategory)
      if (category) {
        filters.push(`Category: ${category.name}`)
      }
    }

    if (selectedSignLanguageType) {
      filters.push(`Sign Language: ${selectedSignLanguageType}`)
    }

    if (selectedProgrammingCategory) {
      filters.push(`Programming: ${selectedProgrammingCategory}`)
    }

    if (selectedComplexity) {
      filters.push(`Complexity: ${selectedComplexity}`)
    }

    if (selectedTags.length > 0) {
      filters.push(`Tags: ${selectedTags.join(", ")}`)
    }

    setActiveFilters(filters)
  }, [
    selectedCategory,
    selectedSignLanguageType,
    selectedProgrammingCategory,
    selectedComplexity,
    selectedTags,
    categories,
  ])

  const handleSearch = () => {
    const params = new URLSearchParams()

    if (query) params.append("query", query)
    if (selectedCategory) params.append("category", selectedCategory)
    if (selectedSignLanguageType) params.append("signLanguageType", selectedSignLanguageType)
    if (selectedProgrammingCategory) params.append("programmingCategory", selectedProgrammingCategory)
    if (selectedComplexity) params.append("complexity", selectedComplexity)
    if (sortBy) params.append("sortBy", sortBy)

    selectedTags.forEach((tag) => params.append("tags", tag))

    router.push(`/developer-sign-language?${params.toString()}`)
  }

  const handleReset = () => {
    setQuery("")
    setSelectedCategory("")
    setSelectedSignLanguageType("")
    setSelectedProgrammingCategory("")
    setSelectedComplexity("")
    setSelectedTags([])
    setSortBy("newest")

    router.push("/developer-sign-language")
  }

  const handleTagToggle = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagName))
    } else {
      setSelectedTags([...selectedTags, tagName])
    }
  }

  const removeFilter = (filter: string) => {
    if (filter.startsWith("Category:")) {
      setSelectedCategory("")
    } else if (filter.startsWith("Sign Language:")) {
      setSelectedSignLanguageType("")
    } else if (filter.startsWith("Programming:")) {
      setSelectedProgrammingCategory("")
    } else if (filter.startsWith("Complexity:")) {
      setSelectedComplexity("")
    } else if (filter.startsWith("Tags:")) {
      setSelectedTags([])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search developer sign language videos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch()
              }
            }}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Filter Videos</SheetTitle>
                <SheetDescription>Refine your search with these filters</SheetDescription>
              </SheetHeader>

              <div className="py-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sign Language Type</label>
                  <Select
                    value={selectedSignLanguageType}
                    onValueChange={(value) => setSelectedSignLanguageType(value as SignLanguageType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="DSL">DSL (Developer Sign Language)</SelectItem>
                      <SelectItem value="ASL">ASL (American Sign Language)</SelectItem>
                      <SelectItem value="BSL">BSL (British Sign Language)</SelectItem>
                      <SelectItem value="ISL">ISL (International Sign Language)</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Programming Category</label>
                  <Select
                    value={selectedProgrammingCategory}
                    onValueChange={(value) => setSelectedProgrammingCategory(value as ProgrammingCategory)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
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
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Complexity</label>
                  <Select
                    value={selectedComplexity}
                    onValueChange={(value) => setSelectedComplexity(value as "Beginner" | "Intermediate" | "Advanced")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All levels</SelectItem>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as "newest" | "oldest" | "popular" | "alphabetical")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="alphabetical">Alphabetical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
                    {tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleTagToggle(tag.name)}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <SheetFooter className="sm:justify-between">
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset Filters
                </Button>
                <SheetClose asChild>
                  <Button onClick={handleSearch}>Apply Filters</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Button onClick={handleSearch} disabled={loading}>
            Search
          </Button>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {filter}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 text-gray-500 hover:text-gray-700"
                onClick={() => removeFilter(filter)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove filter</span>
              </Button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" className="text-xs" onClick={handleReset}>
            Clear All
          </Button>
        </div>
      )}
    </div>
  )
}
