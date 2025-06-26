import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import MobileNavigation from "@/components/mobile/mobile-navigation"

export default function DashboardHeader() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MobileNavigation />
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/placeholder-e1neh.png" alt="VisualDesk Logo" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-rose-600 hidden sm:inline">VisualDesk</span>
          </Link>
        </div>

        <nav className="hidden md:flex gap-6">
          <Link href="/dashboard" className="text-gray-700 hover:text-rose-600 transition font-medium">
            Dashboard
          </Link>
          <Link href="/dashboard/forms" className="text-gray-700 hover:text-rose-600 transition">
            Forms
          </Link>
          <Link href="/interpreters" className="text-gray-700 hover:text-rose-600 transition">
            Interpreters
          </Link>
          <Link href="/dashboard/settings" className="text-gray-700 hover:text-rose-600 transition">
            Settings
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-rose-500 rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/diverse-person-smiling.png" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Jane Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">jane.doe@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
