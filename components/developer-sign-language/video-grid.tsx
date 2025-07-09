import type { DeveloperSignVideo } from "@/types/developer-sign-language"
import { VideoCard } from "./video-card"

interface VideoGridProps {
  videos: DeveloperSignVideo[]
  basePath?: string
}

export function VideoGrid({ videos, basePath = "/developer-sign-language" }: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No videos found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} href={`${basePath}/${video.id}`} />
      ))}
    </div>
  )
}
