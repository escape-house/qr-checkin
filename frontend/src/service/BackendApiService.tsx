import type {Slot, SlotDto} from "../types/Slot.ts";

class HttpError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly responseBody: string,
    ) {
        super(message);
        this.name = "HttpError";
    }
}

async function getJson<T>(url: string): Promise<T> {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "same-origin",
    });

    const responseText = await response.text();

    if (!response.ok) {
        throw new HttpError(
            `Request failed with status ${response.status}`,
            response.status,
            responseText,
        );
    }

    if (!responseText) {
        throw new Error(`Empty response received from ${url}`);
    }

    try {
        return JSON.parse(responseText) as T;
    } catch {
        throw new Error(`Invalid JSON received from ${url}`);
    }
}

export const checkInApi = {
    async fetchCheckInSlots(): Promise<Slot[]> {
        const slots = await getJson<SlotDto[]>("/api/quinbook/checkInSlots");
        return (
            slots.map(slotDtoToSlot)
        );
    },
};

function slotDtoToSlot(dto: SlotDto): Slot {
    const start = new Date(dto.start);
    const end = new Date(dto.end);

    if (Number.isNaN(start.getTime())) {
        throw new Error(`Invalid start slot start date: ${dto.start}`);
    }

    if (Number.isNaN(end.getTime())) {
        throw new Error(`Invalid end slot end date: ${dto.end}`);
    }

    return {
        ...dto,
        start,
        end,
    };
}