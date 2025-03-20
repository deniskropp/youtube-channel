import Link from "next/link"
import Image from "next/image"
import { type YouTubeVideo, formatViewCount, formatPublishDate, formatYouTubeDuration } from "@/lib/youtube"

interface RelatedVideosProps {
  videos: YouTubeVideo[]
}

export function RelatedVideos({ videos }: RelatedVideosProps) {
  if (!videos.length) {
    return <p className="text-center py-4">No related videos found.</p>
  }

  return (
    <div className="space-y-4">
      <h2 className="font-medium">Related Videos</h2>

      <div className="space-y-4">
        {videos.map((video) => {
          const { snippet, statistics, contentDetails } = video

          // Get the best available thumbnail
          const thumbnail = snippet.thumbnails.medium?.url || snippet.thumbnails.default.url

          // Format view count
          const views = statistics?.viewCount ? formatViewCount(statistics.viewCount) : "N/A"

          // Format publish date
          const timestamp = formatPublishDate(snippet.publishedAt)

          // Format duration
          const duration = contentDetails?.duration ? formatYouTubeDuration(contentDetails.duration) : ""

          return (
            <Link key={video.id} href={`/video/${video.id}`} className="flex gap-2 group">
              <div className="relative flex-shrink-0 w-40 aspect-video rounded-lg overflow-hidden">
                <Image
                  src={thumbnail || "/placeholder.svg"}
                  alt={snippet.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                {duration && (
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                    {duration}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-medium line-clamp-2 group-hover:text-blue-600">{snippet.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{snippet.channelTitle}</p>
                <p className="text-xs text-muted-foreground">
                  {views} views • {timestamp}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

