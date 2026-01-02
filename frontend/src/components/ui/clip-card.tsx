"use client"

import { Copy, Trash2 } from "lucide-react"
import { useState } from "react"
import type {Clip} from '../../../types/clip'

interface ClipCardProps {
  clip: Clip
  type: "pinned" | "recent"
}

export default function ClipCard({ clip, type }: ClipCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(clip.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log("Delete clip:", clip.id)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "just now"
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
  }


  return (
    <div
      className={`sticky-note group relative flex flex-col rounded-lg p-5 transition-all ${type === "pinned" ? "pinned" : "recent"}`}
    >
      {/* Header with icon and timestamp */}
      <div className="mb-3 flex items-start justify-between">
        <span className="text-xl"></span>
        <span className="text-xs text-muted-foreground md:hidden">{formatTime(clip.createdAt)}</span>
      </div>

      {/* Content */}
      <div className="mb-4 flex-1 overflow-hidden">
        <p className="line-clamp-4 text-sm text-foreground md:line-clamp-3">{clip.content}</p>
      </div>

      {/* Footer with time and actions */}
      <div className="flex items-center justify-between">
        <span className="hidden text-xs text-muted-foreground md:block">{formatTime(clip.createdAt)}</span>
        <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={handleCopy}
            className={`rounded p-1.5 transition-colors ${
              copied ? "bg-green-100 text-green-700" : "bg-foreground/5 text-foreground hover:bg-foreground/10"
            }`}
            title="Copy to clipboard"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="rounded bg-foreground/5 p-1.5 text-foreground transition-colors hover:bg-red-100 hover:text-red-700"
            title="Delete clip"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
