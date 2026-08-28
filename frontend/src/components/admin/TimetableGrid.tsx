import type {AdminSlot} from "../../api/dashboardApi.ts"
import {getSlotStatus} from "../../api/dashboardApi.ts"
import {SlotCard} from "./SlotCard.tsx"

type Props = {
    slots: AdminSlot[]
    now: Date
}

function roomImageSrc(room: string): string {
    const key = room.toLowerCase().replace(/\s+/g, "_")
    return `/rooms/${key}.jpg`
}

export function TimetableGrid({slots, now}: Props) {
    // Build ordered room list (preserving first-seen order, max 6)
    const roomOrder: string[] = []
    for (const slot of slots) {
        const room = slot.room ?? "Unbekannt"
        if (!roomOrder.includes(room)) roomOrder.push(room)
        if (roomOrder.length === 6) break
    }

    const byRoom = new Map<string, AdminSlot[]>()
    for (const room of roomOrder) byRoom.set(room, [])
    for (const slot of slots) {
        const room = slot.room ?? "Unbekannt"
        byRoom.get(room)?.push(slot)
    }

    const desktopColClass = [
        "",
        "",
        "md:grid-cols-2",
        "md:grid-cols-3",
        "md:grid-cols-4",
        "md:grid-cols-5",
        "md:grid-cols-6",
    ][roomOrder.length] ?? "md:grid-cols-6"

    return (
        <div className={`grid grid-cols-1 ${desktopColClass} gap-3`}>
            {roomOrder.map(room => {
                const roomSlots = byRoom.get(room) ?? []
                return (
                    <div key={room} className="flex flex-col gap-2 min-w-0">
                        {/* Room header with image */}
                        <div className="rounded-md overflow-hidden border border-border">
                            <div className="h-16 relative">
                                <img
                                    src={roomImageSrc(room)}
                                    alt={room}
                                    onError={e => { (e.currentTarget as HTMLImageElement).src = "/rooms/placeholder.jpg" }}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-end px-2 py-1">
                                    <span className="text-white font-bold uppercase tracking-widest leading-tight drop-shadow">
                                        {room}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {roomSlots.length === 0 ? (
                            <p className="text-xs text-muted px-1">Keine Slots</p>
                        ) : (
                            roomSlots.map(slot => (
                                <SlotCard
                                    key={slot.id ?? `${slot.room}-${slot.start}`}
                                    slot={slot}
                                    status={getSlotStatus(slot, now)}
                                />
                            ))
                        )}
                    </div>
                )
            })}
        </div>
    )
}
