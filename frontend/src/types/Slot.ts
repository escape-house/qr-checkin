export type CheckInSlotDto = {
    id: number | null
    start: string
    end: string
    players: number | null
    name: string | null
    companyName: string | null
    room: string | null
}

export type CheckInSlot = {
    id: number | null
    start: Date
    end: Date
    players: number | null
    name: string | null
    companyName: string | null
    room: string | null
    displayDate: string
}