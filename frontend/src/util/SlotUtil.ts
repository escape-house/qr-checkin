import type {CheckInSlot, CheckInSlotDto} from "../types/Slot.ts";

function isNotBooked(slot: CheckInSlot):boolean{
    return slot.name == null || slot.name === ""
}

function isBooked(slot: CheckInSlot):boolean{
    return !isNotBooked(slot)
}

function buildDisplayDate(start: Date): string {
    const time = (d: Date) => d.toLocaleTimeString("de-AT", {hour: "2-digit", minute: "2-digit"})
    return `${time(start)}`
}

function fromDto(dto: CheckInSlotDto): CheckInSlot {
    const start = new Date(dto.start)
    const end = new Date(dto.end)
    return {
        ...dto,
        start,
        end,
        displayDate: buildDisplayDate(start),
        language: dto.language,
    }
}

function slotStartTimeComparator(a: CheckInSlot, b:CheckInSlot){
    return a.start.getTime() - b.start.getTime()
}

function getRoomImageUrl(roomName: string){
    const fileName = roomName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ß/g, "ss")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");

    return `/rooms/${fileName}.webp`;
}

export const SlotUtils = {
    isBooked,
    isNotBooked,
    fromDto,
    slotStartTimeComparator,
    getRoomImageUrl
}