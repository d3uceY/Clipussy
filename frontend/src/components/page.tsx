import { useState, useMemo, useEffect } from "react"
import { EventsOn } from "../../wailsjs/runtime";
import { GetClips } from '../../wailsjs/go/main/App'
import { Search } from "lucide-react"
import ClipCard from "./ui/clip-card"
import type { Clip } from "types/clip";

// Sample data from the provided JSON

function PageContent() {
    const [searchQuery, setSearchQuery] = useState("")
    const [clips, setClips] = useState<{ pinned: Clip[]; recent: Clip[] }>({ pinned: [], recent: [] });

    const getClips = async () => {
        const data = await GetClips();

        // wanted to use a hash map but i said fuck it lmao
        const pinned = data.filter(clip => clip.isPinned);
        const recent = data.filter(clip => !clip.isPinned);

        setClips({ pinned, recent });
    }

    useEffect(() => {
        getClips();
    }, []);

    EventsOn("clipboard:changed", (text: string) => {
        console.log("New clip:", text);

        // get fresh clips data
        getClips();
    });

    const filteredClips = useMemo(() => {
        const query = searchQuery.toLowerCase()

        if (!query) {
            return {
                pinned: clips.pinned,
                recent: clips.recent,
            }
        }

        return {
            pinned: clips.pinned.filter(
                (clip) =>
                    clip.content.toLowerCase().includes(query),
            ),
            recent: clips.recent.filter(
                (clip) =>
                    clip.content.toLowerCase().includes(query),
            ),
        }
    }, [searchQuery])

    return (
        <main className="min-h-screen bg-background p-6 md:p-10">
            <div className="margin"></div>

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
                        <div className="free-form-grid-container">
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
                        <div className="free-form-grid-container">
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
        <PageContent />
    )
}
