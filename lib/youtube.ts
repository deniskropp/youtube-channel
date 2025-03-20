// YouTube API types
export interface YouTubeVideo {
  id: string
  snippet: {
    title: string
    description: string
    publishedAt: string
    thumbnails: {
      default: { url: string; width: number; height: number }
      medium: { url: string; width: number; height: number }
      high: { url: string; width: number; height: number }
      standard?: { url: string; width: number; height: number }
      maxres?: { url: string; width: number; height: number }
    }
    channelTitle: string
    channelId: string
  }
  contentDetails?: {
    duration: string
  }
  statistics?: {
    viewCount: string
    likeCount: string
    commentCount: string
  }
}

export interface YouTubeComment {
  id: string
  snippet: {
    topLevelComment: {
      snippet: {
        authorDisplayName: string
        authorProfileImageUrl: string
        textDisplay: string
        publishedAt: string
        likeCount: number
      }
    }
  }
}

export interface YouTubeChannel {
  id: string
  snippet: {
    title: string
    description: string
    thumbnails: {
      default: { url: string; width: number; height: number }
      medium: { url: string; width: number; height: number }
      high: { url: string; width: number; height: number }
    }
  }
  statistics: {
    subscriberCount: string
    videoCount: string
    viewCount: string
  }
}

// Format YouTube duration (PT1H2M3S) to readable format (1:02:03)
export function formatYouTubeDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)

  if (!match) return "0:00"

  const hours = match[1] ? Number.parseInt(match[1]) : 0
  const minutes = match[2] ? Number.parseInt(match[2]) : 0
  const seconds = match[3] ? Number.parseInt(match[3]) : 0

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

// Format view count (1234567) to readable format (1.2M)
export function formatViewCount(count: string): string {
  const num = Number.parseInt(count)

  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }

  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }

  return count
}

// Format publish date to relative time (e.g., "2 weeks ago")
export function formatPublishDate(publishDate: string): string {
  const published = new Date(publishDate)
  const now = new Date()
  const diffMs = now.getTime() - published.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 1) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`
    }
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
  }

  if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
  }

  if (diffDays < 30) {
    const diffWeeks = Math.floor(diffDays / 7)
    return `${diffWeeks} week${diffWeeks !== 1 ? "s" : ""} ago`
  }

  if (diffDays < 365) {
    const diffMonths = Math.floor(diffDays / 30)
    return `${diffMonths} month${diffMonths !== 1 ? "s" : ""} ago`
  }

  const diffYears = Math.floor(diffDays / 365)
  return `${diffYears} year${diffYears !== 1 ? "s" : ""} ago`
}

