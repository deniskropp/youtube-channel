"use server"

import type { YouTubeVideo, YouTubeComment, YouTubeChannel } from "@/lib/youtube"

const API_KEY = process.env.YOUTUBE_API_KEY
const BASE_URL = "https://www.googleapis.com/youtube/v3"

// Default channel ID
const DEFAULT_CHANNEL_ID = "UCcHQy37BNOHoXx6QhhWKK0A"

// Fetch channel videos
export async function fetchChannelVideos(
  channelIdOrHandle: string = DEFAULT_CHANNEL_ID,
  maxResults = 12,
): Promise<YouTubeVideo[]> {
  try {
    // Determine if we're dealing with a channel handle or ID
    const isHandle = channelIdOrHandle.startsWith("@")

    // First, get the channel's uploads playlist ID
    const channelResponse = await fetch(
      isHandle
        ? `${BASE_URL}/channels?part=contentDetails&forHandle=${channelIdOrHandle}&key=${API_KEY}`
        : `${BASE_URL}/channels?part=contentDetails&id=${channelIdOrHandle}&key=${API_KEY}`,
    )

    if (!channelResponse.ok) {
      throw new Error("Failed to fetch channel data")
    }

    const channelData = await channelResponse.json()

    // Check if we have items in the response
    if (!channelData.items || channelData.items.length === 0) {
      console.error("No channel found for:", channelIdOrHandle)
      return []
    }

    const uploadsPlaylistId = channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads

    if (!uploadsPlaylistId) {
      throw new Error("Could not find uploads playlist")
    }

    // Get videos from the uploads playlist
    const playlistResponse = await fetch(
      `${BASE_URL}/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${uploadsPlaylistId}&key=${API_KEY}`,
    )

    if (!playlistResponse.ok) {
      throw new Error("Failed to fetch playlist items")
    }

    const playlistData = await playlistResponse.json()

    if (!playlistData.items || playlistData.items.length === 0) {
      return []
    }

    // Get video IDs to fetch additional details
    const videoIds = playlistData.items.map((item: any) => item.snippet.resourceId.videoId).join(",")

    // Get video details (duration, statistics)
    const videosResponse = await fetch(
      `${BASE_URL}/videos?part=contentDetails,statistics&id=${videoIds}&key=${API_KEY}`,
    )

    if (!videosResponse.ok) {
      throw new Error("Failed to fetch video details")
    }

    const videosData = await videosResponse.json()

    // Combine playlist items with video details
    return playlistData.items.map((item: any) => {
      const videoDetails = videosData.items.find((video: any) => video.id === item.snippet.resourceId.videoId)

      return {
        id: item.snippet.resourceId.videoId,
        snippet: item.snippet,
        contentDetails: videoDetails?.contentDetails,
        statistics: videoDetails?.statistics,
      }
    })
  } catch (error) {
    console.error("Error fetching channel videos:", error)
    return []
  }
}

// Fetch video details
export async function fetchVideoDetails(videoId: string): Promise<YouTubeVideo | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch video details")
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      return null
    }

    return data.items[0]
  } catch (error) {
    console.error("Error fetching video details:", error)
    return null
  }
}

// Fetch channel details
export async function fetchChannelDetails(
  channelIdOrHandle: string = DEFAULT_CHANNEL_ID,
): Promise<YouTubeChannel | null> {
  try {
    // Determine if we're dealing with a channel handle or ID
    const isHandle = channelIdOrHandle.startsWith("@")

    const response = await fetch(
      isHandle
        ? `${BASE_URL}/channels?part=snippet,statistics&forHandle=${channelIdOrHandle}&key=${API_KEY}`
        : `${BASE_URL}/channels?part=snippet,statistics&id=${channelIdOrHandle}&key=${API_KEY}`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch channel details")
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      console.error("No channel found for:", channelIdOrHandle)
      return null
    }

    return data.items[0]
  } catch (error) {
    console.error("Error fetching channel details:", error)
    return null
  }
}

// Fetch video comments
export async function fetchVideoComments(videoId: string, maxResults = 10): Promise<YouTubeComment[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/commentThreads?part=snippet&videoId=${videoId}&maxResults=${maxResults}&key=${API_KEY}`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch video comments")
    }

    const data = await response.json()

    if (!data.items) {
      return []
    }

    return data.items
  } catch (error) {
    console.error("Error fetching video comments:", error)
    return []
  }
}

// Fetch related videos
export async function fetchRelatedVideos(videoId: string, maxResults = 5): Promise<YouTubeVideo[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=${maxResults}&key=${API_KEY}`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch related videos")
    }

    const data = await response.json()

    if (!data.items) {
      return []
    }

    // Get video IDs to fetch additional details
    const videoIds = data.items.map((item: any) => item.id.videoId).join(",")

    // Get video details (duration, statistics)
    const videosResponse = await fetch(
      `${BASE_URL}/videos?part=contentDetails,statistics&id=${videoIds}&key=${API_KEY}`,
    )

    if (!videosResponse.ok) {
      throw new Error("Failed to fetch video details")
    }

    const videosData = await videosResponse.json()

    // Combine search results with video details
    return data.items.map((item: any) => {
      const videoDetails = videosData.items.find((video: any) => video.id === item.id.videoId)

      return {
        id: item.id.videoId,
        snippet: item.snippet,
        contentDetails: videoDetails?.contentDetails,
        statistics: videoDetails?.statistics,
      }
    })
  } catch (error) {
    console.error("Error fetching related videos:", error)
    return []
  }
}

// Search videos
export async function searchVideos(query: string, maxResults = 10): Promise<YouTubeVideo[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${API_KEY}`,
    )

    if (!response.ok) {
      throw new Error("Failed to search videos")
    }

    const data = await response.json()

    if (!data.items) {
      return []
    }

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      snippet: item.snippet,
    }))
  } catch (error) {
    console.error("Error searching videos:", error)
    return []
  }
}

