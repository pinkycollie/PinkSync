"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  BarChart3,
  Building,
  Cog,
  FileText,
  Headphones,
  Home,
  MessageSquare,
  Shield,
  Upload,
  Users,
  Video,
  Globe,
  Info,
  Settings,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { NotificationSystem } from "@/components/notification-system"
import { UserProfile } from "@/components/user-profile"

export function DashboardSidebar() {
  const pathname = usePathname()

  const mainNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Videos",
      href: "/dashboard/videos",
      icon: Video,
    },
    {
      title: "Upload",
      href: "/dashboard/videos/upload",
      icon: Upload,
    },
    {
      title: "Validator",
      href: "/dashboard/validator",
      icon: Users,
    },
    {
      title: "Government Services",
      href: "/dashboard/government-services",
      icon: Globe,
    },
    {
      title: "PinkSync Info",
      href: "/dashboard/pinksync-info",
      icon: Info,
    },
    {
      title: "Analytics Hub",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      title: "Communication Center",
      href: "/dashboard/communication",
      icon: MessageSquare,
    },
    {
      title: "Accessibility Preferences",
      href: "/dashboard/preferences",
      icon: Settings,
    },
    {
      title: "Admin Controls",
      href: "/dashboard/admin",
      icon: Cog,
    },
  ]

  const solutionsNavItems = [
    {
      title: "Tax Management",
      href: "/dashboard/tax",
      icon: FileText,
    },
    {
      title: "Insurance Solution",
      href: "/dashboard/insurance",
      icon: Shield,
    },
    {
      title: "Financial Management",
      href: "/dashboard/finance",
      icon: Building,
    },
    {
      title: "Deaf-First Transformation",
      href: "/dashboard/accessibility",
      icon: Headphones,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col items-center justify-center p-4">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/letter-p-typography.png" alt="PinkSYNC Logo" />
            <AvatarFallback>PS</AvatarFallback>
          </Avatar>
          <span className="text-xl font-bold">PinkSYNC</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || pathname?.startsWith(item.href + "/")}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Specialized Solutions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {solutionsNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between">
          <NotificationSystem />
          <UserProfile />
          <ModeToggle />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
