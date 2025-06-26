"use client"

import { Home, FileText, MessageSquare, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function BottomNavigation() {
  const pathname = usePathname()

  const navigationItems = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/dashboard/forms", icon: FileText, label: "Forms" },
    { href: "/interpreters", icon: MessageSquare, label: "Chat" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="grid grid-cols-4 h-16">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive ? "text-rose-600 bg-rose-50" : "text-gray-600 hover:text-rose-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
