"use client"

import { useState } from "react"
import Image from "next/image"
import { ThumbsUp, Share, Download, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { type YouTubeVideo, type YouTubeChannel, formatViewCount, formatPublishDate } from "@/lib/youtube"

interface VideoInfoProps {
  video: YouTubeVideo
  channel: YouTubeChannel | null
}

export function VideoInfo({ video, channel }: VideoInfoProps) {
  const [showFullDescription, setShowFullDescription] = useState(false)

  const { snippet, statistics } = video

  // Format view count
  const views = statistics?.viewCount ? formatViewCount(statistics.viewCount) : "N/A"

  // Format like count
  const likes = statistics?.likeCount ? formatViewCount(statistics.likeCount) : "N/A"

  // Format publish date
  const timestamp = formatPublishDate(snippet.publishedAt)

  // Channel info
  const channelAvatar = channel?.snippet.thumbnails.default.url || "/placeholder.svg?height=40&width=40"
  const channelName = channel?.snippet.title || snippet.channelTitle
  const subscribers = channel?.statistics.subscriberCount ? formatViewCount(channel.statistics.subscriberCount) : "N/A"

  // Format description with line breaks and links
  const formatDescription = (description: string) => {
    if (!description) return "No description available."

    // Convert URLs to clickable links
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const withLinks = description.replace(
      urlRegex,
      (url) =>
        `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${url}</a>`,
    )

    // Convert timestamps (e.g., 0:42) to clickable links
    const timestampRegex = /(\d+:)?(\d+):(\d+)/g
    const withTimestamps = withLinks.replace(timestampRegex, (timestamp) => {
      // Don't convert if it's already in a link
      if (withLinks.indexOf(`">${timestamp}</a>`) > -1) return timestamp
      return `<span class="text-blue-600 cursor-pointer hover:underline">${timestamp}</span>`
    })

    return withTimestamps
  }

  return (
    <div className="mt-4 space-y-4">
      <h1 className="text-xl font-bold">{snippet.title}</h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Image
            src={channelAvatar || "/placeholder.svg"}
            alt={channelName}
            width={40}
            height={40}
            className="rounded-full"
          />

          <div>
            <h3 className="font-medium">{channelName}</h3>
            <p className="text-sm text-muted-foreground">{subscribers} subscribers</p>
          </div>

          <Button className="ml-2">Subscribe</Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="gap-1">
            <ThumbsUp size={16} />
            {likes}
          </Button>

          <Button variant="secondary" size="sm" className="gap-1">
            <Share size={16} />
            Share
          </Button>

          <Button variant="secondary" size="sm" className="gap-1">
            <Download size={16} />
            Download
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreHorizontal size={16} />
            <span className="sr-only">More</span>
          </Button>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex gap-2 text-sm mb-2">
          <span>{views} views</span>
          <span>{timestamp}</span>
        </div>

        <div
          className={`text-sm whitespace-pre-line ${showFullDescription ? "" : "line-clamp-2"}`}
          dangerouslySetInnerHTML={{
            __html: formatDescription(snippet.description),
          }}
        />

        {snippet.description && snippet.description.length > 100 && (
          <Button
            variant="link"
            size="sm"
            className="p-0 h-auto mt-1"
            onClick={() => setShowFullDescription(!showFullDescription)}
          >
            {showFullDescription ? "Show less" : "Show more"}
          </Button>
        )}
      </div>

      <Separator />
    </div>
  )
}

