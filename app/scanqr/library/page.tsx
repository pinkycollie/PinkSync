import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Filter, QrCode } from "lucide-react"

export default function LibraryPage() {
  // Sample sign language content library
  const libraryItems = [
    {
      id: "sign-language-content-1",
      title: "Welcome Message",
      category: "Greetings",
      thumbnail: "/placeholder.svg?height=200&width=300&query=ASL welcome message thumbnail",
      qrCode: "/placeholder.svg?height=100&width=100&query=QR code for welcome message",
    },
    {
      id: "sign-language-content-2",
      title: "Emergency Information",
      category: "Safety",
      thumbnail: "/placeholder.svg?height=200&width=300&query=ASL emergency information thumbnail",
      qrCode: "/placeholder.svg?height=100&width=100&query=QR code for emergency information",
    },
    {
      id: "sign-language-content-3",
      title: "Restaurant Menu Guide",
      category: "Food & Dining",
      thumbnail: "/placeholder.svg?height=200&width=300&query=ASL restaurant menu guide thumbnail",
      qrCode: "/placeholder.svg?height=100&width=100&query=QR code for restaurant menu",
    },
    {
      id: "sign-language-content-4",
      title: "Public Transportation",
      category: "Travel",
      thumbnail: "/placeholder.svg?height=200&width=300&query=ASL public transportation guide thumbnail",
      qrCode: "/placeholder.svg?height=100&width=100&query=QR code for transportation guide",
    },
    {
      id: "sign-language-content-5",
      title: "Medical Appointment",
      category: "Healthcare",
      thumbnail: "/placeholder.svg?height=200&width=300&query=ASL medical appointment guide thumbnail",
      qrCode: "/placeholder.svg?height=100&width=100&query=QR code for medical appointment",
    },
    {
      id: "sign-language-content-6",
      title: "Job Interview Tips",
      category: "Career",
      thumbnail: "/placeholder.svg?height=200&width=300&query=ASL job interview tips thumbnail",
      qrCode: "/placeholder.svg?height=100&width=100&query=QR code for job interview tips",
    },
  ]

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
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <input
            type="text"
            placeholder="Search sign language content..."
            className="w-full rounded-md border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {libraryItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={item.thumbnail || "/placeholder.svg"}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <CardContent className="p-4">
              <div className="mb-2 inline-block rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-medium text-pink-800">
                {item.category}
              </div>
              <h2 className="text-lg font-semibold">{item.title}</h2>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-4">
              <Link href={`/scanqr/library/${item.id}`}>
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

      <div className="mt-8 text-center">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  )
}
