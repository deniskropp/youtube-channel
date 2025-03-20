import { VideoPlayer } from "@/components/video-player"
import { VideoInfo } from "@/components/video-info"
import { RelatedVideos } from "@/components/related-videos"
import { Comments } from "@/components/comments"
import { fetchVideoDetails, fetchChannelDetails, fetchVideoComments, fetchRelatedVideos } from "@/app/actions"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface VideoPageProps {
  params: {
    id: string
  }
}

// Loading skeletons
function VideoInfoSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-9 w-24 ml-auto" />
      </div>
      <Skeleton className="h-32 w-full rounded-lg" />
    </div>
  )
}

function CommentsSkeleton() {
  return (
    <div className="space-y-6 mt-6">
      <Skeleton className="h-6 w-48" />
      <div className="space-y-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

function RelatedVideosSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-32" />
      <div className="space-y-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex gap-2">
              <Skeleton className="w-40 aspect-video rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

// Video content component
async function VideoContent({ videoId }: { videoId: string }) {
  const videoData = await fetchVideoDetails(videoId)

  if (!videoData) {
    return <p className="text-center py-8">Video not found.</p>
  }

  const channelData = await fetchChannelDetails(videoData.snippet.channelId)

  return (
    <VideoInfo video={videoData} channel={channelData} />
  )
}

// Comments component
async function VideoComments({ videoId }: { videoId: string }) {
  const comments = await fetchVideoComments(videoId)
  return <Comments comments={comments} />
}

// Related videos component
async function VideoRelatedVideos({ videoId }: { videoId: string }) {
  const relatedVideos = await fetchRelatedVideos(videoId)
  return <RelatedVideos videos={relatedVideos} />
}

export default function VideoPage({ params }: VideoPageProps) {
  const { id } = params

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <VideoPlayer videoId={id} />

          <Suspense fallback={<VideoInfoSkeleton />}>
            <VideoContent videoId={id} />
          </Suspense>

          <Suspense fallback={<CommentsSkeleton />}>
            <VideoComments videoId={id} />
          </Suspense>
        </div>

        <div className="lg:col-span-1">
          <Suspense fallback={<RelatedVideosSkeleton />}>
            <VideoRelatedVideos videoId={id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

