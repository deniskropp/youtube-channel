import Link from "next/link"
import { VideoCard } from "@/components/video-card"
import { ChannelHeader } from "@/components/channel-header"
import { fetchChannelVideos } from "./actions"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Loading component for videos
function VideosSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="w-full aspect-video rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
    </div>
  )
}

// Videos component that fetches data
async function Videos() {
  try {
    const videos = await fetchChannelVideos()

    if (!videos.length) {
      return (
        <div className="text-center py-8">
          <p>No videos found.</p>
          <p className="text-sm text-muted-foreground mt-2">Try updating the DEFAULT_CHANNEL_ID in app/actions.ts</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Link key={video.id} href={`/video/${video.id}`}>
            <VideoCard video={video} />
          </Link>
        ))}
      </div>
    )
  } catch (error) {
    console.error("Error rendering videos:", error)
    return (
      <div className="text-center py-8">
        <p>Error loading videos.</p>
        <p className="text-sm text-muted-foreground mt-2">Please check the console for details.</p>
      </div>
    )
  }
}

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ChannelHeader />
      <div className="mt-8">
        <Suspense fallback={<VideosSkeleton />}>
          <Videos />
        </Suspense>
      </div>
    </div>
  )
}

