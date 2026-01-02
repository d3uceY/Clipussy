import { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"
import { GetClips } from "../../wailsjs/go/main/App"
import { EventsOn } from "../../wailsjs/runtime"
import type { Clip } from '../../types/clip'

interface ClipContextType {
    clips: { pinned: Clip[]; recent: Clip[] }
    setClips: React.Dispatch<React.SetStateAction<{ pinned: Clip[]; recent: Clip[] }>>
    getClips: () => Promise<void>
}

const ClipContext = createContext<ClipContextType | undefined>(undefined)

export function ClipProvider({ children }: { children: ReactNode }) {
    const [clips, setClips] = useState<{ pinned: Clip[]; recent: Clip[] }>({ pinned: [], recent: [] })

    const getClips = async () => {
        return GetClips().then((data) => {
            const pinned = data.filter(clip => clip.isPinned)
            const recent = data.filter(clip => !clip.isPinned)
            setClips({ pinned, recent })
        })
    }

    useEffect(() => {
        getClips()
    }, [])

    useEffect(() => {
        EventsOn("clipboard:changed", (text: string) => {
            console.log("New clip:", text)
            getClips()
        })
    }, [])

    return (
        <ClipContext.Provider value={{ clips, setClips, getClips }}>
            {children}
        </ClipContext.Provider>
    )
}

export function useClips() {
    const context = useContext(ClipContext)
    if (context === undefined) {
        throw new Error("useClips must be used within a ClipProvider")
    }
    return context
}
