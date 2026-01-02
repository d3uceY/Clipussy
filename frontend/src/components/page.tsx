"use client"

import { useState, useMemo, Suspense } from "react"
import { Search } from "lucide-react"
import ClipCard from "./ui/clip-card"

// Sample data from the provided JSON
const initialData = {
  meta: {
    total: 94,
    limit: 100,
    pinnedCount: 6,
  },
  pinned: [
    {
      id: "clip_001",
      content: 'git commit -m "initial commit"',
      length: 32,
      isPinned: true,
      createdAt: "2026-01-01T09:12:44.221Z",
    },
    {
      id: "clip_002",
      content: "rm -rf node_modules && npm install",
      length: 35,
      isPinned: true,
      createdAt: "2026-01-01T11:30:02.003Z",
    },
    {
      id: "clip_003",
      content: "npm install @tanstack/react-table",
      length: 36,
      isPinned: true,
      createdAt: "2026-01-02T13:42:11.402Z",
    },
    {
      id: "clip_004",
      content: "SELECT * FROM users WHERE active = 1;",
      length: 39,
      isPinned: true,
      createdAt: "2026-01-02T13:41:01.998Z",
    },
    {
      id: "clip_005",
      content: "https://docs.tauri.app/start/",
      length: 34,
      isPinned: true,
      createdAt: "2026-01-02T13:38:44.771Z",
    },
    {
      id: "clip_006",
      content: '{ "name": "clipussy", "private": true }',
      length: 39,
      isPinned: true,
      createdAt: "2026-01-02T13:35:09.114Z",
    },
  ],
  recent: [
    {
      id: "clip_9f3a2c",
      content: "npm install @tanstack/react-table",
      length: 36,
      isPinned: false,
      createdAt: "2026-01-02T13:42:11.402Z",
    },
    {
      id: "clip_9f3a2d",
      content: "SELECT * FROM users WHERE active = 1;",
      length: 39,
      isPinned: false,
      createdAt: "2026-01-02T13:41:01.998Z",
    },
    {
      id: "clip_9f3a2e",
      content: "https://docs.tauri.app/start/",
      length: 34,
      isPinned: false,
      createdAt: "2026-01-02T13:38:44.771Z",
    },
    {
      id: "clip_9f3a2f",
      content: '{ "name": "clipussy", "private": true }',
      length: 39,
      isPinned: false,
      createdAt: "2026-01-02T13:35:09.114Z",
    },
    {
      id: "clip_9f3a30",
      content: "POV: you copied this knowing Clipussy got you 🐾",
      length: 49,
      isPinned: false,
      createdAt: "2026-01-02T13:31:55.003Z",
    },
    {
      id: "clip_9f3a31",
      content: 'const handleClick = () => { console.log("clicked") }',
      length: 52,
      isPinned: false,
      createdAt: "2026-01-02T13:29:15.008Z",
    },
  ],
}

function PageContent() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredClips = useMemo(() => {
    const query = searchQuery.toLowerCase()

    if (!query) {
      return {
        pinned: initialData.pinned,
        recent: initialData.recent,
      }
    }

    return {
      pinned: initialData.pinned.filter(
        (clip) =>
          clip.content.toLowerCase().includes(query),
      ),
      recent: initialData.recent.filter(
        (clip) =>
          clip.content.toLowerCase().includes(query),
      ),
    }
  }, [searchQuery])

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <h1 className="font-serif text-4xl font-bold italic text-foreground md:text-5xl">Clipussy</h1>
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search (Ctrl+F)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg bg-white px-4 py-2 text-foreground shadow-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-accent" />
          </div>
        </div>

        {/* Pinned Section */}
        {filteredClips.pinned.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-foreground">
              <span className="text-2xl">📌</span>
              <span className="italic">Pinned</span>
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {filteredClips.pinned.map((clip) => (
                <ClipCard key={clip.id} clip={clip} type="pinned" />
              ))}
            </div>
          </section>
        )}

        {/* Recent Section */}
        {filteredClips.recent.length > 0 && (
          <section>
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-foreground">
              <span className="text-2xl">📝</span>
              <span className="italic">Recent</span>
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {filteredClips.recent.map((clip) => (
                <ClipCard key={clip.id} clip={clip} type="recent" />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {filteredClips.pinned.length === 0 && filteredClips.recent.length === 0 && (
          <div className="flex h-64 items-center justify-center text-center">
            <p className="text-lg text-muted-foreground">
              {searchQuery ? "No clips found matching your search" : "No clips yet. Start copying!"}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

export default function Page() {
  return (
    <Suspense>
      <PageContent />
    </Suspense>
  )
}
