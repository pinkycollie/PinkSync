"use client"

import { useState } from "react"
import { Bell, Settings, HelpCircle, MessageSquare, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDeafAuth } from "./hooks/use-deaf-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface DashboardHeaderProps {
  onAccessibilityToggle: () => void
  onNotificationsToggle: () => void
}

export function DashboardHeader({ onAccessibilityToggle, onNotificationsToggle }: DashboardHeaderProps) {
  const { user } = useDeafAuth()
  const [showVideoAssistant, setShowVideoAssistant] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length < 2) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    setIsSearching(true)
    setShowResults(true)

    // Smart search across all modules
    const results = await Promise.all([
      searchGovernmentServices(query),
      searchFinancialServices(query),
      searchHealthServices(query),
      searchEducationServices(query),
      searchCommunityFeatures(query),
      searchASLCommands(query),
    ])

    const flatResults = results.flat().slice(0, 8) // Limit to 8 results
    setSearchResults(flatResults)
    setIsSearching(false)
  }

  const searchGovernmentServices = async (query: string) => {
    const services = [
      {
        type: "government",
        title: "Tax Payment",
        description: "Pay property taxes",
        url: "/dashboard/tax/property",
        icon: "🏛️",
      },
      {
        type: "government",
        title: "Social Security",
        description: "Check SSI benefits",
        url: "/dashboard/government?tab=ssa",
        icon: "💰",
      },
      {
        type: "government",
        title: "DMV Services",
        description: "Renew driver's license",
        url: "/dashboard/government?tab=dmv",
        icon: "🚗",
      },
    ]
    return services.filter(
      (s) =>
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase()),
    )
  }

  const searchFinancialServices = async (query: string) => {
    const services = [
      {
        type: "financial",
        title: "Budget Tracker",
        description: "Track monthly expenses",
        url: "/dashboard/financial?tab=budget",
        icon: "📊",
      },
      {
        type: "financial",
        title: "Benefits Calculator",
        description: "Calculate available benefits",
        url: "/dashboard/financial?tab=benefits",
        icon: "🧮",
      },
    ]
    return services.filter(
      (s) =>
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase()),
    )
  }

  const searchHealthServices = async (query: string) => {
    const services = [
      {
        type: "health",
        title: "Find Interpreter",
        description: "Locate ASL interpreters",
        url: "/dashboard/health?tab=interpreters",
        icon: "🤟",
      },
      {
        type: "health",
        title: "Medical Records",
        description: "Access health records",
        url: "/dashboard/health?tab=records",
        icon: "📋",
      },
    ]
    return services.filter(
      (s) =>
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase()),
    )
  }

  const searchEducationServices = async (query: string) => {
    const services = [
      {
        type: "education",
        title: "ASL Classes",
        description: "Find ASL learning resources",
        url: "/dashboard/education?tab=asl",
        icon: "🎓",
      },
      {
        type: "education",
        title: "Scholarships",
        description: "Deaf student scholarships",
        url: "/dashboard/education?tab=scholarships",
        icon: "💡",
      },
    ]
    return services.filter(
      (s) =>
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase()),
    )
  }

  const searchCommunityFeatures = async (query: string) => {
    const features = [
      {
        type: "community",
        title: "Community Events",
        description: "Local deaf community events",
        url: "/dashboard/community?tab=events",
        icon: "👥",
      },
      {
        type: "community",
        title: "Support Groups",
        description: "Peer support networks",
        url: "/dashboard/community?tab=support",
        icon: "🤝",
      },
    ]
    return features.filter(
      (f) =>
        f.title.toLowerCase().includes(query.toLowerCase()) ||
        f.description.toLowerCase().includes(query.toLowerCase()),
    )
  }

  const searchASLCommands = async (query: string) => {
    const commands = [
      {
        type: "asl",
        title: "Show Dashboard",
        description: "ASL: Point to screen + 'HOME'",
        url: "/dashboard",
        icon: "🤟",
      },
      {
        type: "asl",
        title: "Emergency Help",
        description: "ASL: Both hands up + 'HELP'",
        url: "/emergency",
        icon: "🚨",
      },
    ]
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase()),
    )
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-pink-600">
            DeafLifeOS
            <span className="ml-1 text-xs text-pink-400">by PinkSync</span>
          </span>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="relative w-full max-w-sm">
            <Input
              type="search"
              placeholder="Search or use ASL commands..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              className="md:w-[300px] lg:w-[400px] pl-10 pr-10 border-pink-200 focus:border-pink-500"
            />
            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin h-4 w-4 border-2 border-pink-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((result, index) => (
                      <a
                        key={index}
                        href={result.url}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowResults(false)}
                      >
                        <span className="text-lg">{result.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{result.title}</div>
                          <div className="text-sm text-gray-500">{result.description}</div>
                        </div>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{result.type}</span>
                      </a>
                    ))}
                  </div>
                ) : searchQuery.length >= 2 ? (
                  <div className="p-4 text-center text-gray-500">
                    No results found for "{searchQuery}"
                    <div className="text-xs mt-1">Try searching for services, benefits, or ASL commands</div>
                  </div>
                ) : null}
              </div>
            )}
            <MessageSquare className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1"
              onClick={() => setShowVideoAssistant(!showVideoAssistant)}
            >
              <Video className="h-4 w-4 text-pink-500" />
            </Button>
          </div>

          <Button variant="ghost" size="icon" onClick={onAccessibilityToggle} className="relative">
            <HelpCircle className="h-5 w-5 text-pink-500" />
          </Button>

          <Button variant="ghost" size="icon" onClick={onNotificationsToggle} className="relative">
            <Bell className="h-5 w-5 text-pink-500" />
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
              3
            </Badge>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5 text-pink-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Appearance</DropdownMenuItem>
              <DropdownMenuItem>Notifications</DropdownMenuItem>
              <DropdownMenuItem>Integrations</DropdownMenuItem>
              <DropdownMenuItem>ASL Settings</DropdownMenuItem>
              <DropdownMenuItem>Visual Alerts</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar>
                  <AvatarImage src={user?.profileUrl || "/placeholder.svg"} alt={user?.name} />
                  <AvatarFallback className="bg-pink-200 text-pink-800">{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuItem>Security</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {showVideoAssistant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">ASL Video Assistant</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowVideoAssistant(false)}>
                <span className="sr-only">Close</span>
                <span aria-hidden>×</span>
              </Button>
            </div>
            <div className="aspect-video bg-gray-100 rounded-md mb-4 flex items-center justify-center">
              <p className="text-gray-500">ASL Video Interface</p>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setShowVideoAssistant(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
