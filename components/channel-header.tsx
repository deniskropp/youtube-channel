import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchChannelDetails } from "@/app/actions"
import { formatViewCount } from "@/lib/youtube"
import { Suspense } from "react"

function ChannelHeaderSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="w-full h-32 sm:h-48 rounded-lg" />
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}

async function ChannelHeaderContent() {
  try {
    const channel = await fetchChannelDetails()

    if (!channel) {
      return (
        <div className="text-center py-4">
          <p>Channel information not available.</p>
          <p className="text-sm text-muted-foreground mt-2">Try updating the DEFAULT_CHANNEL_ID in app/actions.ts</p>
        </div>
      )
    }

    const { snippet, statistics } = channel
    const subscriberCount = formatViewCount(statistics.subscriberCount)

    return (
      <>
        {/* Channel Banner - using a placeholder since API doesn't provide banner */}
        <div className="relative w-full h-32 sm:h-48 rounded-lg overflow-hidden bg-gradient-to-r from-gray-700 to-gray-900">
          <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold opacity-30">
            {snippet.title}
          </div>
        </div>

        {/* Channel Info */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Image
            src={snippet.thumbnails.high.url || "/placeholder.svg"}
            alt={snippet.title}
            width={80}
            height={80}
            className="rounded-full border-4 border-background -mt-10 sm:-mt-16 z-10 bg-background"
          />

          <div className="flex-1">
            <h1 className="text-2xl font-bold">{snippet.title}</h1>
            <p className="text-muted-foreground">{subscriberCount} subscribers</p>
          </div>

          <Button>Subscribe</Button>
        </div>
      </>
    )
  } catch (error) {
    console.error("Error rendering channel header:", error)
    return (
      <div className="text-center py-4">
        <p>Error loading channel information.</p>
        <p className="text-sm text-muted-foreground mt-2">Please check the console for details.</p>
      </div>
    )
  }
}

export function ChannelHeader() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<ChannelHeaderSkeleton />}>
        <ChannelHeaderContent />
      </Suspense>

      {/* Channel Navigation */}
      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}

