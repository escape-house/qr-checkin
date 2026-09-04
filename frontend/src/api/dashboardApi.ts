export type AdminCheckInPlayer = {
    id: string
    firstName: string
    lastName: string
    wantsPhotosOnline: boolean
}

export type AdminSlot = {
    id: number | null
    start: string
    end: string
    players: number | null
    name: string | null
    companyName: string | null
    room: string | null
    checkedInPlayers: AdminCheckInPlayer[]
    type: string
    comment?: string
    language?: string
}

export type SlotStatus = "blocked" | "notBooked" | "checkin" | "active" | "past" | "future"

export function getSlotStatus(slot: AdminSlot, now: Date): SlotStatus {
    if (slot.type === "block" && slot.checkedInPlayers.length === 0) return "blocked" // blocker slot with no check-ins = room blocked
    if (slot.type === "mask") return "notBooked"                                       // mask = placeholder for an unbooked slot
    const start = new Date(slot.start)
    const end = new Date(slot.end)
    if (now >= start && now <= new Date(end.getTime() + 10 * 60 * 1000)) return "active"  // active from start until 10 min after end
    if (now >= new Date(start.getTime() - 15 * 60 * 1000) && now < start) return "checkin" // check-in window opens 15 min before start
    if (now > new Date(end.getTime() + 10 * 60 * 1000)) return "past"                      // past 10 min after end
    return "future"
}

export async function fetchDashboard(date?: string): Promise<AdminSlot[]> {
    const url = date ? `/api/admin/dashboard?date=${date}` : "/api/admin/dashboard"
    const res = await fetch(url)
    if (!res.ok) throw new Error("Failed to fetch dashboard")
    return res.json()
}
