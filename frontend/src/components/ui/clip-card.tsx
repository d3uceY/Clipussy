"use client"

import { Copy, Pin } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import type { Clip } from '../../../types/clip'
import { TogglePin } from "../../../wailsjs/go/main/App"
import { useClips } from "@/context/ClipContext"


interface ClipCardProps {
    clip: Clip
    type: "pinned" | "recent"
}

export default function ClipCard({ clip, type }: ClipCardProps) {
    const [copied, setCopied] = useState(false)
    const cardRef = useRef<HTMLDivElement>(null)
    const { getClips } = useClips()

    useEffect(() => {
        const updateRowSpan = () => {
            if (cardRef.current) {
                const rowHeight = 10 // Must match grid-auto-rows in CSS
                const rowGap = 16 // Must match gap in CSS
                const cardHeight = cardRef.current.getBoundingClientRect().height
                const rowSpan = Math.ceil((cardHeight + rowGap) / (rowHeight + rowGap))
                cardRef.current.style.setProperty('--row-span', String(rowSpan))
            }
        }

        updateRowSpan()
        window.addEventListener('resize', updateRowSpan)
        return () => window.removeEventListener('resize', updateRowSpan)
    }, [clip.content])

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(clip.content)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    const handlePin = async () => {
        const clipId = Number(clip.id.replace('clip_', ''))
        console.log("Toggling pin for clip ID:", clipId)
        await TogglePin(clipId).catch((err) => {
            console.error("Failed to toggle pin:", err)
        }).finally(() => {
            getClips()
        })
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
            ref={cardRef}
            className={"hand-drawn lined thin p-3 bg-[#F9F5E6] relative group"}
        >   {/* Header with icon and timestamp */}
            {type == "pinned" && <img src={"pin.png"} alt="pin-img" className="h-10 -top-5 right-0 absolute" />}
            <div className="mb-3 flex items-start justify-between">
                {JSON.stringify(clip.isPinned)}
                <span className="text-xl"></span>
                <span className="text-xs text-muted-foreground md:hidden">{formatTime(clip.createdAt)}</span>
            </div>

            {/* Content */}
            <div className="mb-4 flex-1 overflow-hidden">
                <p className="line-clamp-4 text-sm text-foreground md:line-clamp-8">{clip.content}</p>
            </div>

            {/* Footer with time and actions */}
            <div className="flex items-center justify-between">
                <span className="hidden text-xs text-muted-foreground md:block">{formatTime(clip.createdAt)}</span>
                <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                        onClick={handleCopy}
                        className={`rounded p-1.5 transition-colors ${copied ? "bg-green-100 text-green-700" : "bg-foreground/5 text-foreground hover:bg-foreground/10"
                            }`}
                        title="Copy to clipboard"
                    >
                        <Copy className="h-4 w-4" />
                    </button>
                    <button
                        onClick={handlePin}
                        className={`rounded p-1.5 transition-colors ${
                            clip.isPinned 
                                ? "bg-yellow-100 text-yellow-700 hover:bg-red-100 hover:text-red-700" 
                                : "bg-foreground/5 text-foreground hover:bg-yellow-100 hover:text-yellow-700"
                        }`}
                        title={clip.isPinned ? "Unpin clip" : "Pin clip"}
                    >
                        <Pin className={`h-4 w-4 ${clip.isPinned ? "fill-current" : ""}`} />
                    </button>
                </div>
            </div>
        </div>
    )
}
