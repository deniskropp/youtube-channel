"use client"

import { useEffect, useRef } from "react"

interface VideoPlayerProps {
  videoId: string
}

export function VideoPlayer({ videoId }: VideoPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load YouTube API if not already loaded
    if (!window.YT) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      const firstScriptTag = document.getElementsByTagName("script")[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    // Initialize player when API is ready
    const onYouTubeIframeAPIReady = () => {
      if (!playerRef.current) return

      new window.YT.Player(playerRef.current, {
        videoId,
        playerVars: {
          autoplay: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            // Player is ready
          },
          onStateChange: (event) => {
            // Player state changed
          },
        },
      })
    }

    // If YT API is already loaded, initialize player
    if (window.YT && window.YT.Player) {
      onYouTubeIframeAPIReady()
    } else {
      // Otherwise wait for API to load
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady
    }

    return () => {
      // Cleanup
      if (window.onYouTubeIframeAPIReady === onYouTubeIframeAPIReady) {
        window.onYouTubeIframeAPIReady = null
      }
    }
  }, [videoId])

  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      <div ref={playerRef} className="w-full aspect-video" />
    </div>
  )
}

// Add YouTube Player type definition
declare global {
  interface Window {
    YT: {
      Player: any
      PlayerState: any
    }
    onYouTubeIframeAPIReady: (() => void) | null
  }
}

