import { useState, useRef, useEffect } from "react"
import { Search } from "lucide-react"
import ClipCard from "./ui/clip-card"
import { useClips } from "../context/ClipContext"
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { playSound } from "@/helpers/playSound";

// Sample data from the provided JSON

function PageContent() {
    const [searchQuery, setSearchQuery] = useState("")
    const { clips } = useClips()
    const searchInputRef = useRef<HTMLInputElement>(null)
    const tl = gsap.timeline();

    useGSAP(() => {
        tl.to('.paper-curtain-1', { left: "-53vw", duration: 1.5, ease: "steps(12)", onStart: () => playSound('paper-curtain-sound.mp3', true, .8) })
            .to('.paper-curtain-2', { right: '-53vw', duration: 1.5, ease: "steps(9)", }, '-=1.5')
            .from('.pussy', { y: '100%', xPercent: -100, ease: "steps(12)" }, "-=0.5")
    })


    const filteredClips = () => {
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
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault()
                searchInputRef.current?.focus()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    return (
        <main className="min-h-screen bg-background p-6 md:p-10">

            <img src="/paper-curtain.png" className="paper-curtain-1 h-screen fixed w-[53vw] left-0 top-0 bottom-0 z-10 " />
            <img src="/paper-curtain.png" className="paper-curtain-2 h-screen fixed w-[53vw] -right-8 top-0 bottom-0 z-10 " />
            {/* // pussy cat image */}
            <div className="h-[20vh] pussy fixed bottom-0 -left-6 z-1">
                <img src="/pussy.png" alt="pussy" className="block h-full" />
            </div>
            <div className="margin"></div>
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-10 flex items-center gap-8 justify-between">
                    <h1 className="font-serif text-4xl font-bold italic text-foreground md:text-5xl">Clipussy</h1>
                    <div className="relative w-full max-w-md torn-input">
                        <div className="tape-1 absolute -top-3 left-0 h-12 w-4 bg-yellow-200/40 rotate-45 rounded-sm shadow-sm"></div>
                        <div className="tape-2 absolute -top-3 right-0 h-12 w-4 bg-yellow-200/40 -rotate-45 rounded-sm shadow-sm"></div>
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search (Ctrl+F)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 pt-2 text-foreground placeholder-gray-500 focus:outline-none"
                        />
                        <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#c0bdbd]" />
                    </div>
                </div>

                {/* Pinned Section */}
                {filteredClips().pinned.length > 0 && (
                    <section className="mb-12">
                        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-foreground">
                            <span className="text-2xl">📌</span>
                            <span className="italic">Pinned</span>
                        </h2>
                        <div className="free-form-grid-container">
                            {filteredClips().pinned.map((clip) => (
                                <ClipCard key={clip.id} clip={clip} type="pinned" />
                            ))}
                        </div>
                    </section>
                )}

                {/* Recent Section */}
                {filteredClips().recent.length > 0 && (
                    <section>
                        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-foreground">
                            <span className="text-2xl">📝</span>
                            <span className="italic">Recent</span>
                        </h2>
                        <div className="free-form-grid-container">
                            {filteredClips().recent.map((clip) => (
                                <ClipCard key={clip.id} clip={clip} type="recent" />
                            ))}
                        </div>
                    </section>
                )}

                {/* Empty State */}
                {filteredClips().pinned.length === 0 && filteredClips().recent.length === 0 && (
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

import { ClipProvider } from "../context/ClipContext"

export default function Page() {
    return (
        <ClipProvider>
            <PageContent />
        </ClipProvider>
    )
}
