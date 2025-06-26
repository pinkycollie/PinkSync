"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, Home, FileText, MessageSquare, Settings, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navigationItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/dashboard/forms", icon: FileText, label: "Forms" },
    { href: "/interpreters", icon: MessageSquare, label: "Interpreters" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
    { href: "/profile", icon: User, label: "Profile" },
  ]

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Image src="/placeholder-e1neh.png" alt="VisualDesk Logo" width={32} height={32} className="rounded-lg" />
              <span className="font-bold text-rose-600">VisualDesk</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="h-10 w-10 bg-rose-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Jane Doe</p>
                <p className="text-xs text-gray-500">jane.doe@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
