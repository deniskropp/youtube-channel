import Link from "next/link"
import { VideoCard } from "@/components/video-card"
import { searchVideos } from "../actions"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Loading component for search results
function SearchResultsSkeleton() {
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

// Search results component that fetches data
async function SearchResults({ query }: { query: string }) {
  const videos = await searchVideos(query)

  if (!videos.length) {
    return <p className="text-center py-8">No videos found for "{query}".</p>
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
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q: string }
}) {
  const query = searchParams.q || ""

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Search results for: {query}</h1>

      <Suspense fallback={<SearchResultsSkeleton />}>
        <SearchResults query={query} />
      </Suspense>
    </div>
  )
}

