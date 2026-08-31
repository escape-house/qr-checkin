import type {CheckInSlotDto} from "../types/Slot.ts"
import {SlotUtils} from "../util/SlotUtil.ts"

export async function fetchCheckInSlots() {
    const response = await fetch("/api/quinbook/checkInSlots")
    if (!response.ok) throw new Error("Failed to fetch slots")
    const dtos: CheckInSlotDto[] = await response.json()
    return dtos.map(SlotUtils.fromDto)
}

export async function fetchCheckInSlot(date: string, slotId: string) {
    const response = await fetch(`/api/quinbook/slot/${date}/${slotId}`)
    if (!response.ok) throw new Error("Failed to fetch slot")
    console.log(response)
    const dto: CheckInSlotDto = await response.json()
    console.log(dto)
    console.log(SlotUtils.fromDto(dto))
    return SlotUtils.fromDto(dto)
}

export type CheckInFormData = {
    firstName: string
    lastName: string
    email: string
    agreesToTermsAndCondition: boolean
    wantsPhotosOnline: boolean
    wantsNewsletter: boolean
}

export async function fetchRooms(): Promise<string[]> {
    const response = await fetch("/api/quinbook/rooms")
    if (!response.ok) throw new Error("Failed to fetch rooms")
    return response.json()
}

export async function postCheckIn(roomName: string, slotId: number | null, form: CheckInFormData) {
    const url = slotId != null
        ? `/api/checkin/${roomName}/${slotId}`
        : `/api/checkin/${roomName}`
    const body = {
        ...form,
        email: form.email.trim() || null,
    }
    const response = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body),
    })
    if (!response.ok) throw new Error("Check-in failed")
}
