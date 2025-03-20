"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { type YouTubeComment, formatPublishDate } from "@/lib/youtube"

interface CommentsProps {
  comments: YouTubeComment[]
}

export function Comments({ comments }: CommentsProps) {
  const [commentText, setCommentText] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send this to your API
    console.log("Submitting comment:", commentText)
    setCommentText("")
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">{comments.length} Comments</h2>
        <Button variant="ghost" size="sm">
          Sort by
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-4">
        <Image
          src="/placeholder.svg?height=40&width=40"
          alt="Your avatar"
          width={40}
          height={40}
          className="rounded-full"
        />

        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="min-h-[80px]"
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setCommentText("")}>
              Cancel
            </Button>
            <Button type="submit" disabled={!commentText.trim()}>
              Comment
            </Button>
          </div>
        </div>
      </form>

      <Separator />

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-center py-4">No comments yet.</p>
        ) : (
          comments.map((comment) => {
            const { snippet } = comment
            const { topLevelComment } = snippet
            const commentSnippet = topLevelComment.snippet

            // Format publish date
            const timestamp = formatPublishDate(commentSnippet.publishedAt)

            return (
              <div key={comment.id} className="flex gap-4">
                <Image
                  src={commentSnippet.authorProfileImageUrl || "/placeholder.svg?height=40&width=40"}
                  alt={commentSnippet.authorDisplayName}
                  width={40}
                  height={40}
                  className="rounded-full"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{commentSnippet.authorDisplayName}</h4>
                    <span className="text-xs text-muted-foreground">{timestamp}</span>
                  </div>

                  <div className="mt-1 text-sm" dangerouslySetInnerHTML={{ __html: commentSnippet.textDisplay }} />

                  <div className="flex items-center gap-4 mt-2">
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                      <ThumbsUp size={14} />
                      {commentSnippet.likeCount}
                    </button>

                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                      <ThumbsDown size={14} />
                    </button>

                    <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

