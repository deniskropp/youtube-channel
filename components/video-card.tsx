import Image from "next/image"
import { type YouTubeVideo, formatViewCount, formatPublishDate, formatYouTubeDuration } from "@/lib/youtube"

interface VideoCardProps {
  video: YouTubeVideo
}

export function VideoCard({ video }: VideoCardProps) {
  const { snippet, statistics, contentDetails } = video

  // Get the best available thumbnail
  const thumbnail = snippet.thumbnails.maxres?.url || snippet.thumbnails.standard?.url || snippet.thumbnails.high.url

  // Format view count
  const views = statistics?.viewCount ? formatViewCount(statistics.viewCount) : "N/A"

  // Format publish date
  const timestamp = formatPublishDate(snippet.publishedAt)

  // Format duration
  const duration = contentDetails?.duration ? formatYouTubeDuration(contentDetails.duration) : ""

  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
        <Image
          src={thumbnail || "/placeholder.svg"}
          alt={snippet.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 py-0.5 rounded">{duration}</div>
        )}
      </div>
      <h3 className="font-medium line-clamp-2 group-hover:text-blue-600">{snippet.title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{snippet.channelTitle}</p>
      <p className="text-sm text-muted-foreground">
        {views} views • {timestamp}
      </p>
    </div>
  )
}

