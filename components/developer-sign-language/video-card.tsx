import type { DeveloperSignVideo } from "@/types/developer-sign-language"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, Clock } from "lucide-react"
import Link from "next/link"

interface VideoCardProps {
  video: DeveloperSignVideo
  href: string
}

export function VideoCard({ video, href }: VideoCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  return (
    <Link href={href} className="block">
      <Card className="h-full overflow-hidden transition-all hover:shadow-md hover:border-primary-300">
        <div className="aspect-video relative overflow-hidden bg-gray-100">
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl || "/placeholder.svg"}
              alt={`Thumbnail for ${video.title}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-500">{video.title.charAt(0).toUpperCase()}</span>
            </div>
          )}

          {video.durationSeconds > 0 && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
              {Math.floor(video.durationSeconds / 60)}:{(video.durationSeconds % 60).toString().padStart(2, "0")}
            </div>
          )}
        </div>

        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
        </CardHeader>

        <CardContent className="p-4 pt-0 pb-2">
          <p className="text-sm text-gray-500 line-clamp-2">{video.description}</p>

          <div className="flex flex-wrap gap-1 mt-2">
            {video.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {video.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{video.tags.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-2 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {video.viewCount || 0}
            </span>

            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {video.downloadCount || 0}
            </span>
          </div>

          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(video.createdAt)}
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}
